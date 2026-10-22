import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarTodas() {
    return this.prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.categoria.findUnique({ where: { id } });
  }

  async buscarPorNome(nome: string) {
    return this.prisma.categoria.findUnique({ where: { nome } });
  }

  async criar(data: CreateCategoryDto) {
    return this.prisma.categoria.create({ data });
  }

  async atualizar(id: number, data: UpdateCategoryDto) {
    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async deletar(id: number) {
    return this.prisma.categoria.delete({ where: { id } });
  }

  async buscarJogo(id_jogo: number) {
    return this.prisma.jogo.findUnique({ where: { id: id_jogo } });
  }

  async buscarRelacao(id_categoria: number, id_jogo: number) {
    return this.prisma.categoriaJogo.findUnique({
      where: {
        id_categoria_id_jogo: { id_categoria, id_jogo },
      },
    });
  }

  async linkarJogo(data: LinkCategoryGameDto) {
    return this.prisma.categoriaJogo.create({ data });
  }

  async deslinkarJogo(id_categoria: number, id_jogo: number) {
    return this.prisma.categoriaJogo.delete({
      where: {
        id_categoria_id_jogo: { id_categoria, id_jogo },
      },
    });
  }

  async listarJogosDaCategoria(id_categoria: number, apenasDisponiveis = false) {

    let filtro: any = { id_categoria };

    if (apenasDisponiveis) {
      filtro = {
        id_categoria,
        jogo: {
          ativo: true,
          quantidade_disponivel: { gt: 0 },
        },
      };
    }

    return this.prisma.categoriaJogo.findMany({
      where: filtro,
      include: { jogo: true },
    });
  }
}