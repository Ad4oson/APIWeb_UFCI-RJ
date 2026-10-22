import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: Prisma.JogoCreateInput) {
    return this.prisma.jogo.create({ data });
  }

  async listarPaginado(
    where: Prisma.JogoWhereInput,
    page: number,
    limit: number,
  ) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.jogo.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.jogo.count({ where }),
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
    return this.prisma.jogo.findUnique({ where: { id } });
  }

  async buscarAlugueis(id: number) {
    return this.prisma.aluguel.findMany({
      where: { id_jogo: id },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
        pagamentos: true,
      },
      orderBy: { data_aluguel: 'desc' },
    });
  }

  async buscarAvaliacoes(
    where: Prisma.AvaliacaoWhereInput,
    page: number,
    limit: number,
  ) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.avaliacao.findMany({
        where,
        include: {
          usuario: { select: { id: true, nome: true } },
        },
        orderBy: { data_avaliacao: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.avaliacao.count({ where }),
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

  async buscarEstatisticasAvaliacoes(where: Prisma.AvaliacaoWhereInput) {
    return this.prisma.avaliacao.aggregate({
      where,
      _avg: { nota: true },
      _max: { nota: true },
      _min: { nota: true },
      _count: true,
    });
  }

  async atualizar(id: number, data: Prisma.JogoUpdateInput) {
    return this.prisma.jogo.update({ where: { id }, data });
  }

  async atualizarEstoque(
    id: number,
    quantidadeTotalAtual: number,
    quantidadeDisponivelAtual: number,
    data: Prisma.JogoUpdateManyMutationInput,
  ) {
    return this.prisma.jogo.updateMany({
      where: {
        id,
        quantidade_total: quantidadeTotalAtual,
        quantidade_disponivel: quantidadeDisponivelAtual,
      },
      data,
    });
  }

  async desativar(id: number) {
    return this.prisma.jogo.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async ativar(id: number) {
    return this.prisma.jogo.update({
      where: { id },
      data: { ativo: true },
    });
  }

  async contarAlugueis(id: number) {
    return this.prisma.aluguel.count({
      where: { id_jogo: id },
    });
  }

  async excluir(id: number) {
    return this.prisma.jogo.delete({ where: { id } });
  }

  async buscarCategorias(id: number) {
    return this.prisma.categoriaJogo.findMany({
      where: { id_jogo: id },
      include: { categoria: true },
    });
  }
}
