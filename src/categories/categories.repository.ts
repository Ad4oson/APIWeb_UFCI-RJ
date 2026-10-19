import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { ListCategoryGamesDto } from './dto/list-category-games.dto';
import { ListCategoriesDto } from './dto/list-categories.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarTodas(query: ListCategoriesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: any = {};

    if(query.id) {
      where.id = query.id;
    }
    if(query.nome) {
      where.nome = {
        contains: query.nome,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.categoria.findMany({
        where,
        orderBy: {
          nome: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prisma.categoria.count({
        where,
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

  async listarJogosDaCategoria(
    id_categoria: number,
    apenasDisponiveis = false,
    query?: ListCategoryGamesDto
  ) {
    
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    
    const where: any = {
      id_categoria,
    };

    where.jogo = {};

    if(query?.nome) {
      where.jogo.nome = {
        contains: query.nome,
      };
    }

    if(query?.ativo !== undefined) {
      where.jogo.ativo = query.ativo;
    }

    if(apenasDisponiveis) {
      where.jogo.ativo = true;

      where.jogo.quantidade_disponivel = {
        gt: 0,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.categoriaJogo.findMany({
        where,
        include: {
          jogo: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id_jogo: 'asc',
        },
      }),

      this.prisma.categoriaJogo.count({
        where,
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
}