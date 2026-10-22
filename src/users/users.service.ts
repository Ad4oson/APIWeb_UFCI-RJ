import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scryptSync } from 'node:crypto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';


function gerarHashSenha(senha: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly prisma: PrismaService
  ) {}

  async create(dto: CreateUserDto) {
    const jaExiste = await this.repository.buscarPorEmail(dto.email);
    if (jaExiste) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    const dadosNovoUsuario = {
      nome: dto.nome,
      email: dto.email,
      senha: gerarHashSenha(dto.senha),
      telefone: dto.telefone,
    };

    return this.repository.criar(dadosNovoUsuario);
  }

  findAll() {
    return this.repository.buscarTodos();
  }

  findActive() {
    return this.repository.buscarAtivos();
  }

  async findOne(id: number) {
    const usuario = await this.repository.buscarPorId(id);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return usuario;
  }

  async findRentals(id: number) {
    await this.findOne(id); // valida se o usuário existe primeiro
    return this.repository.buscarAlugueisDoUsuario(id);
  }

  async findReviews(
    id: number,
    query: ListGameReviewsDto
  ) {
    await this.findOne(id);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: any = {
      id_usuario: id,
    };

    if(query.nota){
      where.nota = query.nota;
    }

    const [data, total] = await Promise.all([
      this.prisma.avaliacao.findMany({
        where,
        include: {
          jogo: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.avaliacao.count({
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

  async findReviewStats(
    id: number,
    query: ListGameReviewsDto
  ) {
    await this.findOne(id);

    const where: any = {
      id_usuario: id,
    };

    if(query.nota) {
      where.nota = query.nota;
    }

    const stats = await this.prisma.avaliacao.aggregate({
      where,
      _avg: {
        nota: true,
      },
      _count: true,
    });

    return {
      media: stats._avg.nota,
      totalAvaliacoes: stats._count,
    };
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    // se o cara tentar trocar de email, checa se não bate com o de outro
    if (dto.email) {
      const checkEmail = await this.repository.buscarPorEmail(dto.email);
      if (checkEmail && checkEmail.id !== id) {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
    }

    const { senha, ...dados } = dto;
    const dadosAtualizados = {
      ...dados,
      ...(senha !== undefined && { senha: gerarHashSenha(senha) }),
    };

    return this.repository.atualizar(id, dadosAtualizados);
  }

  async deactivate(id: number) {
    await this.findOne(id);

    const pendentes = await this.repository.contarAlugueisAtivos(id);
    if (pendentes > 0) {
      throw new BadRequestException(
        'Não é possível desativar um usuário com aluguéis em andamento.',
      );
    }

    return this.repository.mudarStatus(id, false);
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.repository.mudarStatus(id, true);
  }

  async remove(id: number) {
    await this.findOne(id);

    const temHistorico = await this.repository.contarHistoricoAlugueis(id);
    if (temHistorico > 0) {
      throw new BadRequestException(
        'Não é possível excluir um usuário que possui histórico de aluguéis.',
      );
    }

    return this.repository.deletar(id);
  }
}