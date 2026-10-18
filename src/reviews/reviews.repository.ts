import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const detalhesAvaliacao = {
  usuario: {
    select: {
      id: true,
      nome: true,
      email: true,
    },
  },
  jogo: {
    select: {
      id: true,
      nome: true,
    },
  },
} satisfies Prisma.AvaliacaoInclude;

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarUsuario(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async buscarJogo(id: number) {
    return this.prisma.jogo.findUnique({
      where: { id },
    });
  }

  async buscarPorUsuarioEJogo(id_usuario: number, id_jogo: number) {
    return this.prisma.avaliacao.findFirst({
      where: {
        id_usuario,
        id_jogo,
      },
    });
  }

  async criar(data: Prisma.AvaliacaoCreateInput) {
    return this.prisma.avaliacao.create({
      data,
      include: detalhesAvaliacao,
    });
  }

  async listar() {
    return this.prisma.avaliacao.findMany({
      include: detalhesAvaliacao,
      orderBy: {
        data_avaliacao: 'desc',
      },
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.avaliacao.findUnique({
      where: { id },
      include: detalhesAvaliacao,
    });
  }

  async atualizar(id: number, data: Prisma.AvaliacaoUpdateInput) {
    return this.prisma.avaliacao.update({
      where: { id },
      data,
      include: detalhesAvaliacao,
    });
  }

  async deletar(id: number) {
    return this.prisma.avaliacao.delete({
      where: { id },
    });
  }
}