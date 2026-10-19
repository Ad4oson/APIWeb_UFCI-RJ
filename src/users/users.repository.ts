import { Injectable } from '@nestjs/common';
import { Prisma, StatusAluguel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListUsersDto } from './dto/list-user.dto';

const dadosPublicosUsuario = {
  id: true,
  nome: true,
  email: true,
  telefone: true,
  cpf: true,
  data_cadastro: true,
  ativo: true,
} satisfies Prisma.UsuarioSelect;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  async criar(data: any) {
    return this.prisma.usuario.create({
      data,
      select: dadosPublicosUsuario,
    });
  }

  async buscarPaginado(query: ListUsersDto, somenteAtivos = false) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: Prisma.UsuarioWhereInput = {};

    if (query.nome?.trim()) {
      where.nome = { contains: query.nome.trim() };
    }

    if (somenteAtivos) {
      where.ativo = true;
    } else if (query.ativo !== undefined) {
      where.ativo = query.ativo;
    }

    const [data, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        select: dadosPublicosUsuario,
        orderBy: { nome: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.usuario.count({ where }),
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
    return this.prisma.usuario.findUnique({
      where: { id },
      select: dadosPublicosUsuario,
    });
  }

  async buscarAlugueisDoUsuario(id: number) {
    return this.prisma.aluguel.findMany({
      where: { id_usuario: id },
      include: { jogo: true, pagamentos: true },
      orderBy: { data_aluguel: 'desc' },
    });
  }

  async buscarPorCpf(cpf: string) {
    return this.prisma.usuario.findUnique({
      where: { cpf },
      select: { id: true },
    });
  }

  async atualizar(id: number, data: any) {
    return this.prisma.usuario.update({
      where: { id },
      data,
      select: dadosPublicosUsuario,
    });
  }

  async buscarCredenciaisPorEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        role: true,
        ativo: true,
      },
    });
  }

  async contarAlugueisAtivos(id: number) {
    return this.prisma.aluguel.count({
      where: {
        id_usuario: id,
        status: { in: [StatusAluguel.ATIVO, StatusAluguel.ATRASADO] },
      },
    });
  }

  async mudarStatus(id: number, ativo: boolean) {
    return this.prisma.usuario.update({
      where: { id },
      data: { ativo },
      select: dadosPublicosUsuario,
    });
  }

  async contarHistoricoAlugueis(id: number) {
    return this.prisma.aluguel.count({
      where: { id_usuario: id },
    });
  }

  async deletar(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
      select: dadosPublicosUsuario,
    });
  }
}
