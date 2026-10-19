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
import { Prisma } from '@prisma/client';

function gerarHashSenha(senha: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const jaExiste = await this.repository.buscarPorEmail(dto.email);
    if (jaExiste) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    const cpfExistente = await this.repository.buscarPorCpf(dto.cpf);
    if (cpfExistente) {
      throw new ConflictException('Este CPF já está cadastrado.');
    }

    const dadosNovoUsuario = {
      nome: dto.nome,
      email: dto.email,
      senha: gerarHashSenha(dto.senha),
      telefone: dto.telefone,
      cpf: dto.cpf,
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

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    // se o cara tentar trocar de email, checa se não bate com o de outro
    if (dto.email) {
      const checkEmail = await this.repository.buscarPorEmail(dto.email);
      if (checkEmail && checkEmail.id !== id) {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
    }

    if (dto.cpf !== undefined) {
      const cpfExistente = await this.repository.buscarPorCpf(dto.cpf);

      if (cpfExistente && cpfExistente.id !== id) {
        throw new ConflictException('Este CPF já está cadastrado.');
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
