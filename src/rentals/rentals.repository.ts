import { Injectable } from '@nestjs/common';
import { Prisma, StatusAluguel, StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const detalhes = {
  usuario: { select: { id: true, nome: true, email: true } },
  jogo: true,
  pagamentos: true,
} satisfies Prisma.AluguelInclude;

@Injectable()
export class RentalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarUsuario(id: number) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async buscarJogo(id: number) {
    return this.prisma.jogo.findUnique({ where: { id } });
  }

  async buscarPorId(id: number) {
    return this.prisma.aluguel.findUnique({
      where: { id },
      include: detalhes,
    });
  }

  async listar(where: Prisma.AluguelWhereInput, skip: number, take: number) {
    return this.prisma.$transaction([
      this.prisma.aluguel.findMany({
        where,
        include: detalhes,
        orderBy: { data_aluguel: 'desc' },
        skip,
        take,
      }),
      this.prisma.aluguel.count({ where }),
    ]);
  }

  async criarAluguel(
    id_usuario: number, 
    id_jogo: number, 
    quantidade: number, 
    data_prevista: Date, 
    valor_diaria: Prisma.Decimal,
    valor_total: Prisma.Decimal,
    local?: boolean,
    observacoes?: string
  ) {
    return this.prisma.$transaction(async (tx) => {
      const reserva = await tx.jogo.updateMany({
        where: {
          id: id_jogo,
          ativo: true,
          quantidade_disponivel: { gte: quantidade },
        },
        data: { quantidade_disponivel: { decrement: quantidade } },
      });

      if (reserva.count === 0) {
        throw new Error('ESTOQUE_INSUFICIENTE');
      }

      return tx.aluguel.create({
        data: {
          id_usuario,
          id_jogo,
          quantidade,
          data_prevista_devolucao: data_prevista,
          valor_diaria,
          valor_total,
          local,
          observacoes,
        },
        include: detalhes,
      });
    });
  }

  async devolver(id: number, data_devolucao: Date, novoValorTotal: Prisma.Decimal, quantidade: number, id_jogo: number, multa: Prisma.Decimal) {
    return this.prisma.$transaction(async (tx) => {
      const transicao = await tx.aluguel.updateMany({
        where: {
          id,
          status: { in: [StatusAluguel.ATIVO, StatusAluguel.ATRASADO] },
        },
        data: {
          status: StatusAluguel.DEVOLVIDO,
          data_devolucao,
          valor_total: novoValorTotal,
        },
      });

      if (transicao.count === 0) {
        throw new Error('NAO_PODE_DEVOLVER');
      }

      await tx.jogo.update({
        where: { id: id_jogo },
        data: { quantidade_disponivel: { increment: quantidade } },
      });

      let finePayment = null;
      if (multa.greaterThan(0)) {
        finePayment = await tx.pagamento.create({
          data: {
            id_aluguel: id,
            valor: multa,
            status: StatusPagamento.PENDENTE,
          },
        });
      }

      const atualizado = await tx.aluguel.findUniqueOrThrow({ where: { id } });
      return { atualizado, finePayment };
    });
  }

  async cancelar(id: number, quantidade: number, id_jogo: number) {
    return this.prisma.$transaction(async (tx) => {
      const transicao = await tx.aluguel.updateMany({
        where: { id, status: StatusAluguel.ATIVO },
        data: { status: StatusAluguel.CANCELADO },
      });

      if (transicao.count === 0) {
        throw new Error('NAO_PODE_CANCELAR');
      }

      await tx.jogo.update({
        where: { id: id_jogo },
        data: { quantidade_disponivel: { increment: quantidade } },
      });

      return tx.aluguel.findUniqueOrThrow({ where: { id } });
    });
  }

  async excluir(id: number, status: StatusAluguel, quantidade: number, id_jogo: number) {
    return this.prisma.$transaction(async (tx) => {
      if (status === StatusAluguel.ATIVO || status === StatusAluguel.ATRASADO) {
        await tx.jogo.update({
          where: { id: id_jogo },
          data: { quantidade_disponivel: { increment: quantidade } },
        });
      }
      return tx.aluguel.delete({ where: { id } });
    });
  }

  async buscarPorUsuarioLista(userId: number) {
    return this.prisma.aluguel.findMany({
      where: { id_usuario: userId },
      include: detalhes,
      orderBy: { data_aluguel: 'desc' },
    });
  }

  async buscarAtivosLista(hoje: Date) {
    return this.prisma.aluguel.findMany({
      where: {
        status: StatusAluguel.ATIVO,
        data_prevista_devolucao: { gte: hoje },
      },
      include: detalhes,
      orderBy: { data_prevista_devolucao: 'asc' },
    });
  }

  async processarAtrasados(hoje: Date) {
    await this.prisma.aluguel.updateMany({
      where: {
        status: StatusAluguel.ATIVO,
        data_prevista_devolucao: { lt: hoje },
      },
      data: { status: StatusAluguel.ATRASADO },
    });

    return this.prisma.aluguel.findMany({
      where: {
        status: StatusAluguel.ATRASADO,
        data_prevista_devolucao: { lt: hoje },
      },
      include: detalhes,
      orderBy: { data_prevista_devolucao: 'asc' },
    });
  }

  async prorrogarPrazo(id: number, novaData: Date, novoTotal: Prisma.Decimal) {
    return this.prisma.aluguel.update({
      where: { id },
      data: {
        data_prevista_devolucao: novaData,
        valor_total: novoTotal,
        status: StatusAluguel.ATIVO,
      },
      include: detalhes,
    });
  }
}