import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const detalhesPagamento = {
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
} satisfies Prisma.PagamentoInclude;

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarAluguel(id: number) {
    return this.prisma.aluguel.findUnique({
      where: { id },
    });
  }

  async criar(data: Prisma.PagamentoCreateInput) {
    return this.prisma.pagamento.create({
      data,
      include: detalhesPagamento,
    });
  }

  async listarPagamentos(params: {
    where?: Prisma.PagamentoWhereInput;
    page?: number;
    limit?: number;
    orderBy?: Prisma.PagamentoOrderByWithRelationInput;
  }) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 20, 100);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.pagamento.findMany({
        where: params.where,
        include: detalhesPagamento,
        orderBy: params.orderBy ?? { data_pagamento: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pagamento.count({
        where: params.where,
      }),
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
      include: detalhesPagamento,
    });
  }

  async buscarPorAluguel(id_aluguel: number) {
    return this.prisma.pagamento.findMany({
      where: { id_aluguel },
      include: detalhesPagamento,
      orderBy: { data_pagamento: 'desc' },
    });
  }

  async confirmarPagamento(id: number) {
    return this.prisma.pagamento.update({
      where: { id },
      data: { status: StatusPagamento.PAGO },
      include: detalhesPagamento,
    });
  }

  async solicitarEstorno(id: number) {
    return this.prisma.pagamento.update({
      where: { id },
      data: { status: StatusPagamento.ESTORNADO },
      include: detalhesPagamento,
    });
  }

  async listarPendentes() {
    return this.prisma.pagamento.findMany({
      where: { status: StatusPagamento.PENDENTE },
      include: detalhesPagamento,
      orderBy: { data_pagamento: 'asc' },
    });
  }

  async calcularMulta(id_aluguel: number) {
    const aluguel = await this.prisma.aluguel.findUnique({
      where: { id: id_aluguel },
    });

    if (!aluguel) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    const hoje = new Date();
    const inicioHoje = new Date(hoje);
    inicioHoje.setHours(0, 0, 0, 0);

    const dataPrevista = new Date(aluguel.data_prevista_devolucao);
    dataPrevista.setHours(0, 0, 0, 0);

    const diasAtraso = Math.max(
      0,
      Math.ceil((inicioHoje.getTime() - dataPrevista.getTime()) / 86_400_000),
    );

    const multa = new Prisma.Decimal(aluguel.valor_diaria)
      .mul(diasAtraso)
      .mul(aluguel.quantidade);

    return {
      rentalId: id_aluguel,
      dias_atraso: diasAtraso,
      multa,
      data_prevista_devolucao: aluguel.data_prevista_devolucao,
    };
  }

  async resumoFinanceiro(params: { startDate?: string; endDate?: string }) {
    const start = params.startDate
      ? this.dateBoundary(params.startDate, false)
      : new Date(0);

    const end = params.endDate
      ? this.dateBoundary(params.endDate, true)
      : new Date();

    if (start > end) {
      throw new BadRequestException(
        'startDate deve ser anterior ou igual a endDate.',
      );
    }

    const where = {
      status: StatusPagamento.PAGO,
      data_pagamento: {
        gte: start,
        lte: end,
      },
    } satisfies Prisma.PagamentoWhereInput;

    const [aggregate, count, porStatus] = await Promise.all([
      this.prisma.pagamento.aggregate({
        where,
        _sum: { valor: true },
      }),
      this.prisma.pagamento.count({
        where,
      }),
      this.prisma.pagamento.groupBy({
        by: ['status'],
        where: {
          data_pagamento: {
            gte: start,
            lte: end,
          },
        },
        _count: { _all: true },
        _sum: { valor: true },
      }),
    ]);

    return {
      periodo: {
        inicio: start,
        fim: end,
      },
      total_arrecadado: aggregate._sum.valor ?? new Prisma.Decimal(0),
      quantidade_pagamentos_compensados: count,
      por_status: porStatus,
    };
  }

  async remover(id: number) {
    return this.prisma.pagamento.delete({
      where: { id },
    });
  }

  async contarPagamentosDoAluguel(id_aluguel: number) {
    return this.prisma.pagamento.count({
      where: { id_aluguel },
    });
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
