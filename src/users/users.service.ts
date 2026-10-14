import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusAluguel } from '@prisma/client';
import { randomBytes, scryptSync } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const dadosPublicosUsuario = {
  id: true,
  nome: true,
  email: true,
  telefone: true,
  cpf: true,
  data_cadastro: true,
  ativo: true,
} satisfies Prisma.UsuarioSelect;

function gerarHashSenha(senha: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (usuarioExistente) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    return this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: gerarHashSenha(dto.senha),
        telefone: dto.telefone,
      },
      select: dadosPublicosUsuario,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: dadosPublicosUsuario,
      orderBy: { nome: 'asc' },
    });
  }

  findActive() {
    return this.prisma.usuario.findMany({
      where: { ativo: true },
      select: dadosPublicosUsuario,
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: dadosPublicosUsuario,
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  async findRentals(id: number) {
    await this.findOne(id);
    return this.prisma.aluguel.findMany({
      where: { id_usuario: id },
      include: {
        jogo: true,
        pagamentos: true,
      },
      orderBy: { data_aluguel: 'desc' },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.email) {
      const usuarioComEmail = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });
      if (usuarioComEmail && usuarioComEmail.id !== id) {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
    }

    const { senha, ...dados } = dto;
    return this.prisma.usuario.update({
      where: { id },
      data: {
        ...dados,
        ...(senha !== undefined && { senha: gerarHashSenha(senha) }),
      },
      select: dadosPublicosUsuario,
    });
  }

  async deactivate(id: number) {
    await this.findOne(id);

    const alugueisEmAndamento = await this.prisma.aluguel.count({
      where: {
        id_usuario: id,
        status: { in: [StatusAluguel.ATIVO, StatusAluguel.ATRASADO] },
      },
    });
    if (alugueisEmAndamento > 0) {
      throw new BadRequestException(
        'Não é possível desativar um usuário com aluguéis em andamento.',
      );
    }

    return this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: dadosPublicosUsuario,
    });
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.update({
      where: { id },
      data: { ativo: true },
      select: dadosPublicosUsuario,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const historicoAlugueis = await this.prisma.aluguel.count({
      where: { id_usuario: id },
    });
    if (historicoAlugueis > 0) {
      throw new BadRequestException(
        'Não é possível excluir um usuário que possui histórico de aluguéis.',
      );
    }

    return this.prisma.usuario.delete({
      where: { id },
      select: dadosPublicosUsuario,
    });
  }
}
