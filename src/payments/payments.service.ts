import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';

const paymentDetails = {
  aluguel: {
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      jogo: true,
    },
  },
} satisfies Prisma.PagamentoInclude;

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.aluguel.findUnique({
        where: { id: dto.id_aluguel },
      });
      if (!rental) throw new NotFoundException('Aluguel não encontrado.');
      if (rental.status === 'CANCELADO') {
        throw new BadRequestException(
          'Não é possível pagar um aluguel cancelado.',
        );
      }

      const paidOrPending = await tx.pagamento.aggregate({
        where: {
          id_aluguel: dto.id_aluguel,
          status: { in: [StatusPagamento.PENDENTE, StatusPagamento.PAGO] },
        },
        _sum: { valor: true },
      });
      const rentalDays = Math.max(
        1,
        Math.ceil(
          (this.startOfDay(rental.data_prevista_devolucao).getTime() -
            this.startOfDay(rental.data_aluguel).getTime()) /
            86_400_000,
        ),
      );
      const rentalValue =
        rental.valor_total ??
        rental.valor_diaria.mul(rental.quantidade).mul(rentalDays);
      const balance = rentalValue.sub(paidOrPending._sum.valor ?? 0);
      if (new Prisma.Decimal(dto.valor).greaterThan(balance)) {
        throw new BadRequestException('O pagamento excede o saldo do aluguel.');
      }

      return tx.pagamento.create({
        data: {
          id_aluguel: dto.id_aluguel,
          valor: new Prisma.Decimal(dto.valor),
          forma_pagamento: dto.forma_pagamento,
        },
        include: paymentDetails,
      });
    });
  }

  async findAll(query: ListPaymentsDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const dateFilter: Prisma.DateTimeFilter = {};
    if (query.startDate)
      dateFilter.gte = this.dateBoundary(query.startDate, false);
    if (query.endDate) dateFilter.lte = this.dateBoundary(query.endDate, true);
    if (query.startDate && query.endDate && dateFilter.gte! > dateFilter.lte!) {
      throw new BadRequestException(
        'startDate deve ser anterior ou igual a endDate.',
      );
    }
    const where: Prisma.PagamentoWhereInput =
      query.startDate || query.endDate ? { data_pagamento: dateFilter } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.pagamento.findMany({
        where,
        include: paymentDetails,
        orderBy: { data_pagamento: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pagamento.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const payment = await this.prisma.pagamento.findUnique({
      where: { id },
      include: paymentDetails,
    });
    if (!payment) throw new NotFoundException('Pagamento não encontrado.');
    return payment;
  }

  async findByRental(rentalId: number) {
    const rental = await this.prisma.aluguel.findUnique({
      where: { id: rentalId },
    });
    if (!rental) throw new NotFoundException('Aluguel não encontrado.');
    const payments = await this.prisma.pagamento.findMany({
      where: { id_aluguel: rentalId },
      include: paymentDetails,
      orderBy: { data_pagamento: 'desc' },
    });
    const totalPago = payments
      .filter((payment) => payment.status === StatusPagamento.PAGO)
      .reduce((sum, payment) => sum.add(payment.valor), new Prisma.Decimal(0));
    const totalPendente = payments
      .filter((payment) => payment.status === StatusPagamento.PENDENTE)
      .reduce((sum, payment) => sum.add(payment.valor), new Prisma.Decimal(0));
    return {
      aluguel: rental,
      pagamentos: payments,
      total_pago: totalPago,
      total_pendente: totalPendente,
    };
  }

  async confirm(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.pagamento.findUnique({ where: { id } });
      if (!payment) throw new NotFoundException('Pagamento não encontrado.');
      if (payment.status !== StatusPagamento.PENDENTE) {
        throw new BadRequestException(
          'Somente pagamentos pendentes podem ser confirmados.',
        );
      }
      return tx.pagamento.update({
        where: { id },
        data: { status: StatusPagamento.PAGO },
        include: paymentDetails,
      });
    });
  }

  async refund(id: number) {
    const payment = await this.prisma.pagamento.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado.');
    if (payment.status !== StatusPagamento.PAGO) {
      throw new BadRequestException(
        'Somente pagamentos realizados podem ser estornados.',
      );
    }
    return this.prisma.pagamento.update({
      where: { id },
      data: { status: StatusPagamento.ESTORNADO },
      include: paymentDetails,
    });
  }

  findPending() {
    return this.prisma.pagamento.findMany({
      where: { status: StatusPagamento.PENDENTE },
      include: paymentDetails,
      orderBy: { data_pagamento: 'asc' },
    });
  }

  async calculateFine(rentalId: number) {
    const rental = await this.prisma.aluguel.findUnique({
      where: { id: rentalId },
    });
    if (!rental) throw new NotFoundException('Aluguel não encontrado.');
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const dueDate = new Date(rental.data_prevista_devolucao);
    dueDate.setHours(0, 0, 0, 0);
    // O cálculo usa dias corridos completos entre a data prevista e hoje, com a mesma fórmula aplicada na devolução.
    const lateDays = Math.max(
      0,
      Math.ceil((todayStart.getTime() - dueDate.getTime()) / 86_400_000),
    );
    const fine = new Prisma.Decimal(rental.valor_diaria)
      .div(2)
      .mul(lateDays)
      .mul(rental.quantidade);
    return {
      rentalId,
      dias_atraso: lateDays,
      multa: fine,
      data_prevista_devolucao: rental.data_prevista_devolucao,
    };
  }

  async summary(query: ListPaymentsDto) {
    const start = query.startDate
      ? this.dateBoundary(query.startDate, false)
      : new Date(0);
    const end = query.endDate
      ? this.dateBoundary(query.endDate, true)
      : new Date();
    if (start > end) {
      throw new BadRequestException(
        'startDate deve ser anterior ou igual a endDate.',
      );
    }
    const where = {
      status: StatusPagamento.PAGO,
      data_pagamento: { gte: start, lte: end },
    } satisfies Prisma.PagamentoWhereInput;
    const [aggregate, count, byStatus] = await Promise.all([
      this.prisma.pagamento.aggregate({ where, _sum: { valor: true } }),
      this.prisma.pagamento.count({ where }),
      this.prisma.pagamento.groupBy({
        by: ['status'],
        where: { data_pagamento: { gte: start, lte: end } },
        _count: { _all: true },
        _sum: { valor: true },
      }),
    ]);
    return {
      periodo: { inicio: start, fim: end },
      total_arrecadado: aggregate._sum.valor ?? new Prisma.Decimal(0),
      quantidade_pagamentos_compensados: count,
      por_status: byStatus,
    };
  }

  async remove(id: number) {
    const payment = await this.prisma.pagamento.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado.');
    if (
      payment.status !== StatusPagamento.PENDENTE &&
      payment.status !== StatusPagamento.CANCELADO
    ) {
      throw new BadRequestException(
        'Somente pagamentos pendentes ou cancelados podem ser excluídos.',
      );
    }
    return this.prisma.pagamento.delete({ where: { id } });
  }

  private startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private dateBoundary(value: string, endOfDay: boolean): Date {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(
        `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`,
      );
    }
    return new Date(value);
  }
}
