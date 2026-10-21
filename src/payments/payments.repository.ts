import { Injectable } from '@nestjs/common';
import { FormaPagamento, Prisma, StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const includePadrao = {
  aluguel: {
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
      jogo: true,
    },
  },
};

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarAluguelPorId(id: number) {
    return this.prisma.aluguel.findUnique({
      where: { id },
    });
  }

  async somarPagamentosAtivosDoAluguel(id_aluguel: number) {
    const resultado = await this.prisma.pagamento.aggregate({
      where: {
        id_aluguel,
        status: { in: [StatusPagamento.PENDENTE, StatusPagamento.PAGO] },
      },
      _sum: { valor: true },
    });

    return resultado._sum.valor ?? new Prisma.Decimal(0);
  }

  async criar(dados: {
    id_aluguel: number;
    valor: Prisma.Decimal;
    forma_pagamento: FormaPagamento;
  }) {
    return this.prisma.pagamento.create({
      data: {
        id_aluguel: dados.id_aluguel,
        valor: dados.valor,
        forma_pagamento: dados.forma_pagamento,
      },
      include: includePadrao,
    });
  }

  async listar(
    where: Prisma.PagamentoWhereInput,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.pagamento.findMany({
        where,
        include: includePadrao,
        orderBy: { data_pagamento: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.pagamento.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async buscarPorId(id: number) {
    return this.prisma.pagamento.findUnique({
      where: { id },
      include: includePadrao,
    });
  }

  async resumirPorAluguel(where: Prisma.PagamentoWhereInput) {
    const grupos = await this.prisma.pagamento.groupBy({
      by: ['status'],
      where,
      _sum: { valor: true },
    });

    let totalPago = new Prisma.Decimal(0);
    let totalPendente = new Prisma.Decimal(0);

    for (const grupo of grupos) {
      if (grupo.status === StatusPagamento.PAGO) {
        totalPago = grupo._sum.valor ?? new Prisma.Decimal(0);
      }

      if (grupo.status === StatusPagamento.PENDENTE) {
        totalPendente = grupo._sum.valor ?? new Prisma.Decimal(0);
      }
    }

    return { totalPago, totalPendente };
  }

  async atualizarStatus(id: number, status: StatusPagamento) {
    return this.prisma.pagamento.update({
      where: { id },
      data: { status },
      include: includePadrao,
    });
  }

  async buscarResumoFinanceiro(inicio: Date, fim: Date) {
    const wherePago: Prisma.PagamentoWhereInput = {
      status: StatusPagamento.PAGO,
      data_pagamento: { gte: inicio, lte: fim },
    };

    const [agregacao, quantidadeCompensados, porStatus] = await Promise.all([
      this.prisma.pagamento.aggregate({
        where: wherePago,
        _sum: { valor: true },
      }),
      this.prisma.pagamento.count({ where: wherePago }),
      this.prisma.pagamento.groupBy({
        by: ['status'],
        where: { data_pagamento: { gte: inicio, lte: fim } },
        _count: { _all: true },
        _sum: { valor: true },
      }),
    ]);

    return {
      periodo: { inicio, fim },
      total_arrecadado: agregacao._sum.valor ?? new Prisma.Decimal(0),
      quantidade_pagamentos_compensados: quantidadeCompensados,
      por_status: porStatus,
    };
  }

  async deletar(id: number) {
    return this.prisma.pagamento.delete({
      where: { id },
    });
  }
}