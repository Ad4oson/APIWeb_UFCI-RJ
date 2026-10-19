import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const detalhesAluguel = {
  usuario: { select: { id: true, nome: true, email: true } },
  pagamentos: true,
} satisfies Prisma.AluguelInclude;

@Injectable()
export class GamesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: Prisma.JogoCreateInput) {
    return this.prisma.jogo.create({ data });
  }

  async listar() {
    return this.prisma.jogo.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async listarDisponiveis() {
    return this.prisma.jogo.findMany({
      where: {
        ativo: true,
        quantidade_disponivel: { gt: 0 },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.jogo.findUnique({
      where: { id },
    });
  }

  async buscarAlugueis(id: number) {
    return this.prisma.aluguel.findMany({
      where: { id_jogo: id },
      include: detalhesAluguel,
      orderBy: { data_aluguel: 'desc' },
    });
  }

  async atualizar(id: number, data: Prisma.JogoUpdateInput) {
    return this.prisma.jogo.update({
      where: { id },
      data,
    });
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
    return this.prisma.jogo.delete({
      where: { id },
    });
  }

  async buscarCategorias(id: number) {
    return this.prisma.categoriaJogo.findMany({
      where: { id_jogo: id },
      include: { categoria: true },
    });
  }
}