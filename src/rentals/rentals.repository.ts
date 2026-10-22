import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, StatusAluguel, StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const includeDetalhes = {
  usuario: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
  jogo: true,
  pagamentos: true,
};

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
      include: includeDetalhes,
    });
  }

  async listar(
    where: Prisma.AluguelWhereInput,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.aluguel.findMany({
        where,
        include: includeDetalhes,
        orderBy: { data_aluguel: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.aluguel.count({ where }),
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

  async criarAluguel(
    id_usuario: number,
    id_jogo: number,
    quantidade: number,
    data_prevista: Date,
    valor_diaria: Prisma.Decimal,
    valor_total: Prisma.Decimal,
    local: boolean,
    observacoes?: string,
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
        throw new BadRequestException('Estoque insuficiente para este jogo ou o jogo está inativo.');
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
        include: includeDetalhes,
      });
    });
  }

  async devolver(
    id: number,
    data_devolucao: Date,
    novoValorTotal: Prisma.Decimal,
    quantidade: number,
    id_jogo: number,
    multa: Prisma.Decimal,
  ) {
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
        throw new BadRequestException('Este aluguel não pode ser devolvido pois já foi finalizado ou cancelado.');
      }

      await tx.jogo.update({
        where: { id: id_jogo },
        data: { quantidade_disponivel: { increment: quantidade } },
      });

      let pagamentoMulta = null;

      if (multa.greaterThan(0)) {
        pagamentoMulta = await tx.pagamento.create({
          data: {
            id_aluguel: id,
            valor: multa,
            status: StatusPagamento.PENDENTE,
          },
        });
      }

      const atualizado = await tx.aluguel.findUnique({
        where: { id },
        include: includeDetalhes,
      });

      return { atualizado, pagamentoMulta };
    });
  }

  async cancelar(id: number, quantidade: number, id_jogo: number) {
    return this.prisma.$transaction(async (tx) => {
      const transicao = await tx.aluguel.updateMany({
        where: { id, status: StatusAluguel.ATIVO },
        data: { status: StatusAluguel.CANCELADO },
      });

      if (transicao.count === 0) {
        throw new BadRequestException('Somente aluguéis ativos podem ser cancelados.');
      }

      await tx.jogo.update({
        where: { id: id_jogo },
        data: { quantidade_disponivel: { increment: quantidade } },
      });

      return tx.aluguel.findUnique({
        where: { id },
        include: includeDetalhes,
      });
    });
  }

  async contarPagamentosDoAluguel(id_aluguel: number) {
    return this.prisma.pagamento.count({
      where: { id_aluguel },
    });
  }

  async excluir(
    id: number,
    status: StatusAluguel,
    quantidade: number,
    id_jogo: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      if (
        status === StatusAluguel.ATIVO ||
        status === StatusAluguel.ATRASADO
      ) {
        await tx.jogo.update({
          where: { id: id_jogo },
          data: { quantidade_disponivel: { increment: quantidade } },
        });
      }

      return tx.aluguel.delete({ where: { id } });
    });
  }

  async atualizarAtrasados(hoje: Date, id_usuario?: number) {

    const whereClause: Prisma.AluguelWhereInput = {
      status: StatusAluguel.ATIVO,
      data_prevista_devolucao: { lt: hoje },
    };

    if (id_usuario !== undefined) {
      whereClause.id_usuario = id_usuario;
    }

    await this.prisma.aluguel.updateMany({
      where: whereClause,
      data: { status: StatusAluguel.ATRASADO },
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
      include: includeDetalhes,
    });
  }

  async contarPagamentosPendentesDoUsuario(id_usuario: number) {
    return this.prisma.pagamento.count({
      where: {
        status: StatusPagamento.PENDENTE,
        aluguel: { is: { id_usuario } },
      },
    });
  }
}