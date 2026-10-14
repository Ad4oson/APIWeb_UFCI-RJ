import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGameDto) {
    const minJogadores = dto.numero_jogadores_min ?? 1;
    const maxJogadores = dto.numero_jogadores_max ?? 4;

    if (minJogadores > maxJogadores) {
      throw new BadRequestException(
        'O mínimo de jogadores não pode ser maior que o máximo.',
      );
    }

    return this.prisma.jogo.create({
      data: {
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
      },
    });
  }

  findAll() {
    return this.prisma.jogo.findMany({ orderBy: { nome: 'asc' } });
  }

  findAvailable() {
    return this.prisma.jogo.findMany({
      where: { ativo: true, quantidade_disponivel: { gt: 0 } },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const jogo = await this.prisma.jogo.findUnique({ where: { id } });
    if (!jogo) throw new NotFoundException('Jogo não encontrado.');
    return jogo;
  }

  async findRentals(id: number) {
    await this.findOne(id);
    return this.prisma.aluguel.findMany({
      where: { id_jogo: id },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
        pagamentos: true,
      },
      orderBy: { data_aluguel: 'desc' },
    });
  }

  async update(id: number, dto: UpdateGameDto) {
    const jogo = await this.findOne(id);
    const minJogadores =
      dto.numero_jogadores_min ?? jogo.numero_jogadores_min;
    const maxJogadores =
      dto.numero_jogadores_max ?? jogo.numero_jogadores_max;

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

      const resultado = await this.prisma.jogo.updateMany({
        where: {
          id,
          quantidade_total: jogo.quantidade_total,
          quantidade_disponivel: jogo.quantidade_disponivel,
        },
        data: dados,
      });
      if (resultado.count !== 1) {
        throw new BadRequestException(
          'O estoque foi alterado durante a atualização. Consulte o jogo e tente novamente.',
        );
      }
      return this.prisma.jogo.findUniqueOrThrow({ where: { id } });
    }

    return this.prisma.jogo.update({ where: { id }, data: dados });
  }

  async deactivate(id: number) {
    await this.findOne(id);
    return this.prisma.jogo.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.prisma.jogo.update({
      where: { id },
      data: { ativo: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const alugueis = await this.prisma.aluguel.count({
      where: { id_jogo: id },
    });
    if (alugueis > 0) {
      throw new BadRequestException(
        'Não é possível excluir um jogo que possui histórico de aluguéis.',
      );
    }

    return this.prisma.jogo.delete({ where: { id } });
  }
}
