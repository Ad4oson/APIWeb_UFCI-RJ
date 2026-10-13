import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusAluguel, StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';

const rentalDetails = {
  usuario: { select: { id: true, nome: true, email: true } },
  jogo: true,
  pagamentos: true,
} satisfies Prisma.AluguelInclude;

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRentalDto) {
    const dueDate = dto.data_prevista_devolucao ?? this.addDays(new Date(), 7);
    if (this.startOfDay(dueDate) <= this.startOfDay(new Date())) {
      throw new BadRequestException('A devolução prevista deve ser futura.');
    }

    return this.prisma.$transaction(async (tx) => {
      const [usuario, jogo] = await Promise.all([
        tx.usuario.findUnique({ where: { id: dto.id_usuario } }),
        tx.jogo.findUnique({ where: { id: dto.id_jogo } }),
      ]);

      if (!usuario) throw new NotFoundException('Usuário não encontrado.');
      if (!usuario.ativo) {
        throw new BadRequestException('O usuário está inativo e não pode alugar.');
      }
      if (!jogo) throw new NotFoundException('Jogo não encontrado.');
      if (!jogo.ativo) {
        throw new BadRequestException('O jogo está inativo e não pode ser alugado.');
      }

      // O decremento condicional torna a checagem e a reserva atômicas, evitando estoque negativo em requisições concorrentes.
      const reservation = await tx.jogo.updateMany({
        where: {
          id: jogo.id,
          ativo: true,
          quantidade_disponivel: { gte: dto.quantidade },
        },
        data: { quantidade_disponivel: { decrement: dto.quantidade } },
      });
      if (reservation.count !== 1) {
        throw new BadRequestException('Estoque insuficiente para a quantidade solicitada.');
      }

      const rentalDays = Math.max(
        1,
        Math.ceil(
          (this.startOfDay(dueDate).getTime() -
            this.startOfDay(new Date()).getTime()) /
            86_400_000,
        ),
      );
      return tx.aluguel.create({
        data: {
          id_usuario: usuario.id,
          id_jogo: jogo.id,
          quantidade: dto.quantidade,
          data_prevista_devolucao: dueDate,
          valor_diaria: jogo.valor_diaria,
          valor_total: jogo.valor_diaria.mul(dto.quantidade).mul(rentalDays),
          local: dto.local,
          observacoes: dto.observacoes,
        },
        include: rentalDetails,
      });
    });
  }

  async findAll(query: ListRentalsDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where: Prisma.AluguelWhereInput = query.status
      ? { status: query.status }
      : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.aluguel.findMany({
        where,
        include: rentalDetails,
        orderBy: { data_aluguel: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.aluguel.count({ where }),
    ]);
    return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const rental = await this.prisma.aluguel.findUnique({
      where: { id },
      include: rentalDetails,
    });
    if (!rental) throw new NotFoundException('Aluguel não encontrado.');
    return rental;
  }

  async returnRental(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.aluguel.findUnique({ where: { id } });
      if (!rental) throw new NotFoundException('Aluguel não encontrado.');
      if (
        rental.status !== StatusAluguel.ATIVO &&
        rental.status !== StatusAluguel.ATRASADO
      ) {
        throw new BadRequestException('Este aluguel não pode ser devolvido.');
      }

      const returnedAt = new Date();
      const lateDays = Math.max(
        0,
        Math.ceil(
          (this.startOfDay(returnedAt).getTime() -
            this.startOfDay(rental.data_prevista_devolucao).getTime()) /
            86_400_000,
        ),
      );
      // A multa adotada é a diária do contrato multiplicada pelos dias corridos de atraso e unidades alugadas.
      const fine = new Prisma.Decimal(rental.valor_diaria)
        .mul(lateDays)
        .mul(rental.quantidade);
      const contractedTotal =
        rental.valor_total ??
        new Prisma.Decimal(rental.valor_diaria)
          .mul(rental.quantidade)
          .mul(this.rentalDays(rental.data_aluguel, rental.data_prevista_devolucao));

      const transition = await tx.aluguel.updateMany({
        where: {
          id,
          status: { in: [StatusAluguel.ATIVO, StatusAluguel.ATRASADO] },
        },
        data: {
          status: StatusAluguel.DEVOLVIDO,
          data_devolucao: returnedAt,
          valor_total: contractedTotal.add(fine),
        },
      });
      if (transition.count !== 1) {
        throw new BadRequestException('Este aluguel já foi alterado e não pode ser devolvido.');
      }
      await tx.jogo.update({
        where: { id: rental.id_jogo },
        data: { quantidade_disponivel: { increment: rental.quantidade } },
      });

      let finePayment = null;
      if (fine.greaterThan(0)) {
        finePayment = await tx.pagamento.create({
          data: {
            id_aluguel: id,
            valor: fine,
            forma_pagamento: null,
            status: StatusPagamento.PENDENTE,
          },
        });
      }
      const updated = await tx.aluguel.findUniqueOrThrow({ where: { id } });
      return { ...updated, dias_atraso: lateDays, multa: fine, pagamento_multa: finePayment };
    });
  }

  async cancel(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.aluguel.findUnique({ where: { id } });
      if (!rental) throw new NotFoundException('Aluguel não encontrado.');
      if (rental.status !== StatusAluguel.ATIVO) {
        throw new BadRequestException('Somente aluguéis ativos podem ser cancelados.');
      }
      const transition = await tx.aluguel.updateMany({
        where: { id, status: StatusAluguel.ATIVO },
        data: { status: StatusAluguel.CANCELADO },
      });
      if (transition.count !== 1) {
        throw new BadRequestException('Este aluguel já foi alterado e não pode ser cancelado.');
      }
      await tx.jogo.update({
        where: { id: rental.id_jogo },
        data: { quantidade_disponivel: { increment: rental.quantidade } },
      });
      return tx.aluguel.findUniqueOrThrow({ where: { id } });
    });
  }

  async findByUser(userId: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return this.prisma.aluguel.findMany({
      where: { id_usuario: userId },
      include: rentalDetails,
      orderBy: { data_aluguel: 'desc' },
    });
  }

  findActive() {
    const today = this.startOfDay(new Date());
    return this.prisma.aluguel.findMany({
      where: {
        status: StatusAluguel.ATIVO,
        data_prevista_devolucao: { gte: today },
      },
      include: rentalDetails,
      orderBy: { data_prevista_devolucao: 'asc' },
    });
  }

  async findOverdue() {
    const today = this.startOfDay(new Date());
    await this.prisma.aluguel.updateMany({
      where: {
        status: StatusAluguel.ATIVO,
        data_prevista_devolucao: { lt: today },
      },
      data: { status: StatusAluguel.ATRASADO },
    });
    return this.prisma.aluguel.findMany({
      where: {
        status: StatusAluguel.ATRASADO,
        data_prevista_devolucao: { lt: today },
      },
      include: rentalDetails,
      orderBy: { data_prevista_devolucao: 'asc' },
    });
  }

  async extend(id: number, dto: ExtendRentalDto) {
    const rental = await this.prisma.aluguel.findUnique({ where: { id } });
    if (!rental) throw new NotFoundException('Aluguel não encontrado.');
    if (
      rental.status !== StatusAluguel.ATIVO &&
      rental.status !== StatusAluguel.ATRASADO
    ) {
      throw new BadRequestException('Somente aluguéis não devolvidos podem ser prorrogados.');
    }
    const extendedDate = this.addDays(
      new Date(rental.data_prevista_devolucao),
      dto.dias,
    );
    const contractedTotal =
      rental.valor_total ??
      new Prisma.Decimal(rental.valor_diaria)
        .mul(rental.quantidade)
        .mul(this.rentalDays(rental.data_aluguel, rental.data_prevista_devolucao));
    return this.prisma.aluguel.update({
      where: { id },
      data: {
        data_prevista_devolucao: extendedDate,
        valor_total: contractedTotal.add(
          new Prisma.Decimal(rental.valor_diaria).mul(rental.quantidade).mul(dto.dias),
        ),
        status: StatusAluguel.ATIVO,
      },
      include: rentalDetails,
    });
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.aluguel.findUnique({ where: { id } });
      if (!rental) throw new NotFoundException('Aluguel não encontrado.');
      if (rental.status === StatusAluguel.ATIVO || rental.status === StatusAluguel.ATRASADO) {
        await tx.jogo.update({
          where: { id: rental.id_jogo },
          data: { quantidade_disponivel: { increment: rental.quantidade } },
        });
      }
      try {
        return await tx.aluguel.delete({ where: { id } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
          throw new BadRequestException('Não é possível remover um aluguel com pagamentos vinculados.');
        }
        throw error;
      }
    });
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private rentalDays(start: Date, end: Date): number {
    return Math.max(
      1,
      Math.ceil(
        (this.startOfDay(end).getTime() - this.startOfDay(start).getTime()) /
          86_400_000,
      ),
    );
  }
}