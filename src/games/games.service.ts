import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GamesRepository } from './games.repository';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ListGamesDto } from './dto/list-games.dto';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';

@Injectable()
export class GamesService {
  constructor(private readonly repository: GamesRepository) {}

  async create(dto: CreateGameDto) {
    const minJogadores = dto.numero_jogadores_min ?? 1;
    const maxJogadores = dto.numero_jogadores_max ?? 4;

    if (minJogadores > maxJogadores) {
      throw new BadRequestException(
        'O mínimo de jogadores não pode ser maior que o máximo.',
      );
    }

    return this.repository.criar({
      nome: dto.nome,
      descricao: dto.descricao,
      valor_diaria: new Prisma.Decimal(dto.valor_diaria),
      quantidade_total: dto.quantidade_total,
      quantidade_disponivel: dto.quantidade_total,
      ano_lancamento: dto.ano_lancamento,
      numero_jogadores_min: minJogadores,
      numero_jogadores_max: maxJogadores,
      idade_minima: dto.idade_minima ?? 0,
      duracao_minutos: dto.duracao_minutos ?? 60,
      complexidade: dto.complexidade ?? 1,
    });
  }

  private async listarJogos(
    where: Prisma.JogoWhereInput,
    page: number,
    limit: number,
  ) {
    return this.repository.listarPaginado(where, page, limit);
  }

  async findAvailable(query: ListGamesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: Prisma.JogoWhereInput = {
      ativo: true,
      quantidade_disponivel: { gt: 0 },
      ...(query.nome && { nome: { contains: query.nome } }),
      ...(query.complexidade !== undefined && {
        complexidade: query.complexidade,
      }),
      ...(query.ano !== undefined && { ano_lancamento: query.ano }),
      ...(query.jogadores !== undefined && {
        numero_jogadores_min: { lte: query.jogadores },
        numero_jogadores_max: { gte: query.jogadores },
      }),
    };

    return this.listarJogos(where, page, limit);
  }

  async findAll(query: ListGamesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: Prisma.JogoWhereInput = {
      ...(query.nome && { nome: { contains: query.nome } }),
      ...(query.ativo !== undefined && { ativo: query.ativo }),
      ...(query.complexidade !== undefined && {
        complexidade: query.complexidade,
      }),
      ...(query.ano !== undefined && { ano_lancamento: query.ano }),
      ...(query.jogadores !== undefined && {
        numero_jogadores_min: { lte: query.jogadores },
        numero_jogadores_max: { gte: query.jogadores },
      }),
    };

    return this.listarJogos(where, page, limit);
  }

  async findOne(id: number) {
    const jogo = await this.repository.buscarPorId(id);
    if (!jogo) throw new NotFoundException('Jogo não encontrado.');
    return jogo;
  }

  async findRentals(id: number) {
    await this.findOne(id);
    return this.repository.buscarAlugueis(id);
  }

  async findReviews(id: number, query: ListGameReviewsDto) {
    await this.findOne(id);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: Prisma.AvaliacaoWhereInput = {
      id_jogo: id,
      ...(query.nota !== undefined && { nota: query.nota }),
      ...(query.usuario && {
        usuario: { nome: { contains: query.usuario } },
      }),
    };

    return this.repository.buscarAvaliacoes(where, page, limit);
  }

  async findReviewStats(id: number, query: ListGameReviewsDto) {
    await this.findOne(id);

    const where: Prisma.AvaliacaoWhereInput = {
      id_jogo: id,
      ...(query.nota !== undefined && { nota: query.nota }),
      ...(query.usuario && {
        usuario: { nome: { contains: query.usuario } },
      }),
    };

    const stats = await this.repository.buscarEstatisticasAvaliacoes(where);

    return {
      media: stats._avg.nota,
      maiorNota: stats._max.nota,
      menorNota: stats._min.nota,
      totalAvaliacoes: stats._count,
    };
  }

  async update(id: number, dto: UpdateGameDto) {
    const jogo = await this.findOne(id);
    const minJogadores = dto.numero_jogadores_min ?? jogo.numero_jogadores_min;
    const maxJogadores = dto.numero_jogadores_max ?? jogo.numero_jogadores_max;

    if (minJogadores > maxJogadores) {
      throw new BadRequestException(
        'O mínimo de jogadores não pode ser maior que o máximo.',
      );
    }

    const dados: Prisma.JogoUpdateInput = {
      ...(dto.nome !== undefined && { nome: dto.nome }),
      ...(dto.descricao !== undefined && { descricao: dto.descricao }),
      ...(dto.valor_diaria !== undefined && {
        valor_diaria: new Prisma.Decimal(dto.valor_diaria),
      }),
      ...(dto.ano_lancamento !== undefined && {
        ano_lancamento: dto.ano_lancamento,
      }),
      ...(dto.numero_jogadores_min !== undefined && {
        numero_jogadores_min: dto.numero_jogadores_min,
      }),
      ...(dto.numero_jogadores_max !== undefined && {
        numero_jogadores_max: dto.numero_jogadores_max,
      }),
      ...(dto.idade_minima !== undefined && {
        idade_minima: dto.idade_minima,
      }),
      ...(dto.duracao_minutos !== undefined && {
        duracao_minutos: dto.duracao_minutos,
      }),
      ...(dto.complexidade !== undefined && {
        complexidade: dto.complexidade,
      }),
      ...(dto.ativo !== undefined && { ativo: dto.ativo }),
    };

    if (dto.quantidade_total !== undefined) {
      const unidadesAlugadas =
        jogo.quantidade_total - jogo.quantidade_disponivel;

      if (dto.quantidade_total < unidadesAlugadas) {
        throw new BadRequestException(
          'O estoque não pode ser menor que a quantidade atualmente alugada.',
        );
      }

      dados.quantidade_total = dto.quantidade_total;
      dados.quantidade_disponivel = dto.quantidade_total - unidadesAlugadas;

      const resultado = await this.repository.atualizarEstoque(
        id,
        jogo.quantidade_total,
        jogo.quantidade_disponivel,
        dados,
      );

      if (resultado.count !== 1) {
        throw new BadRequestException(
          'O estoque foi alterado durante a atualização. Consulte o jogo e tente novamente.',
        );
      }

      return this.repository.buscarPorId(id);
    }

    return this.repository.atualizar(id, dados);
  }

  async deactivate(id: number) {
    await this.findOne(id);
    return this.repository.desativar(id);
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.repository.ativar(id);
  }

  async remove(id: number) {
    await this.findOne(id);

    const alugueis = await this.repository.contarAlugueis(id);
    if (alugueis > 0) {
      throw new BadRequestException(
        'Não é possível excluir um jogo que possui histórico de aluguéis.',
      );
    }

    return this.repository.excluir(id);
  }

  async findCategories(id: number) {
    await this.findOne(id);
    return this.repository.buscarCategorias(id);
  }
}
