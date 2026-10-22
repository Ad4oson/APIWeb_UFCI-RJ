import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusAluguel } from '@prisma/client';
import { RentalsRepository } from './rentals.repository';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';

export interface CurrentUser {
  id: number;
  role: string;
}

@Injectable()
export class RentalsService {
  constructor(private readonly repository: RentalsRepository) {}

  private adicionarDias(data: Date, dias: number): Date {
    const resultado = new Date(data);
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
  }

  private comecoDoDia(data: Date): Date {
    const resultado = new Date(data);
    resultado.setHours(0, 0, 0, 0);
    return resultado;
  }

  private diasDeAluguel(inicio: Date, fim: Date): number {
    const diffMs =
      this.comecoDoDia(fim).getTime() - this.comecoDoDia(inicio).getTime();

    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  private montarFiltro(
    query: ListRentalsDto,
    usuario: CurrentUser,
    status?: StatusAluguel,
  ): Prisma.AluguelWhereInput {
    const where: Prisma.AluguelWhereInput = {};

    if (usuario.role === 'ADMIN') {
      if (query.id_usuario !== undefined) {
        where.id_usuario = query.id_usuario;
      }
    } else {
      where.id_usuario = usuario.id;
    }

    if (status !== undefined) {
      where.status = status;
    } else if (query.status !== undefined) {
      where.status = query.status;
    }

    if (query.id_jogo !== undefined) {
      where.id_jogo = query.id_jogo;
    }

    if (query.local !== undefined) {
      where.local = query.local;
    }

    return where;
  }

  private async verificarAcesso(id: number, usuario: CurrentUser) {
    const aluguel = await this.repository.buscarPorId(id);

    if (!aluguel) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    if (usuario.role !== 'ADMIN' && aluguel.id_usuario !== usuario.id) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    return aluguel;
  }

  private exigirAdmin(usuario: CurrentUser) {
    if (usuario.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso restrito a administradores.');
    }
  }

  async create(dto: CreateRentalDto, usuarioAtual: CurrentUser) {
    const previsao =
      dto.data_prevista_devolucao ?? this.adicionarDias(new Date(), 7);

    if (this.comecoDoDia(previsao) <= this.comecoDoDia(new Date())) {
      throw new BadRequestException(
        'A devolução prevista deve ser para o futuro.',
      );
    }

    const idUsuario =
      usuarioAtual.role === 'ADMIN' ? dto.id_usuario : usuarioAtual.id;

    const usuario = await this.repository.buscarUsuario(idUsuario);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (!usuario.ativo) {
      throw new BadRequestException('Usuário inativo não pode alugar jogo.');
    }

    const pagamentosPendentes =
      await this.repository.contarPagamentosPendentesDoUsuario(usuario.id);

    if (pagamentosPendentes > 0) {
      throw new BadRequestException(
        'Usuário com pagamentos pendentes não pode realizar novos aluguéis.',
      );
    }

    const jogo = await this.repository.buscarJogo(dto.id_jogo);

    if (!jogo) {
      throw new NotFoundException('Jogo não encontrado.');
    }

    if (!jogo.ativo) {
      throw new BadRequestException('Este jogo está inativo.');
    }

    const dias = this.diasDeAluguel(new Date(), previsao);
    const valorTotal = jogo.valor_diaria.mul(dto.quantidade).mul(dias);

    return this.repository.criarAluguel(
      usuario.id,
      jogo.id,
      dto.quantidade,
      previsao,
      jogo.valor_diaria,
      valorTotal,
      dto.local,
      dto.observacoes,
    );
  }

  findAll(query: ListRentalsDto, usuario: CurrentUser) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    return this.repository.listar(
      this.montarFiltro(query, usuario),
      page,
      limit,
    );
  }

  async findOne(id: number, usuario: CurrentUser) {
    return this.verificarAcesso(id, usuario);
  }

  async returnRental(id: number, usuario: CurrentUser) {
    const aluguel = await this.verificarAcesso(id, usuario);

    if (
      aluguel.status !== StatusAluguel.ATIVO &&
      aluguel.status !== StatusAluguel.ATRASADO
    ) {
      throw new BadRequestException('Este aluguel não pode ser devolvido.');
    }

    const devolvidoEm = new Date();
    const diffMs =
      this.comecoDoDia(devolvidoEm).getTime() -
      this.comecoDoDia(aluguel.data_prevista_devolucao).getTime();

    const diasDeAtraso = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const multa = new Prisma.Decimal(aluguel.valor_diaria)
      .div(2)
      .mul(diasDeAtraso)
      .mul(aluguel.quantidade);

    const valorContrato =
      aluguel.valor_total ??
      new Prisma.Decimal(aluguel.valor_diaria)
        .mul(aluguel.quantidade)
        .mul(
          this.diasDeAluguel(
            aluguel.data_aluguel,
            aluguel.data_prevista_devolucao,
          ),
        );

    const { atualizado, pagamentoMulta } = await this.repository.devolver(
      id,
      devolvidoEm,
      valorContrato.add(multa),
      aluguel.quantidade,
      aluguel.id_jogo,
      multa,
    );

    return {
      ...atualizado,
      dias_atraso: diasDeAtraso,
      multa,
      pagamento_multa: pagamentoMulta,
    };
  }

  async cancel(id: number, usuario: CurrentUser) {
    const aluguel = await this.verificarAcesso(id, usuario);

    if (aluguel.status !== StatusAluguel.ATIVO) {
      throw new BadRequestException(
        'Somente aluguéis ativos podem ser cancelados.',
      );
    }

    return this.repository.cancelar(
      id,
      aluguel.quantidade,
      aluguel.id_jogo,
    );
  }

  async findByUser(
    userId: number,
    query: ListRentalsDto,
    usuario: CurrentUser,
  ) {
    if (usuario.role !== 'ADMIN' && userId !== usuario.id) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const existe = await this.repository.buscarUsuario(userId);

    if (!existe) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.repository.listar(
      {
        ...this.montarFiltro(query, usuario),
        id_usuario: userId,
      },
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async findActive(query: ListRentalsDto, usuario: CurrentUser) {
    const hoje = this.comecoDoDia(new Date());

    return this.repository.listar(
      {
        ...this.montarFiltro(query, usuario, StatusAluguel.ATIVO),
        data_prevista_devolucao: { gte: hoje },
      },
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async findOverdue(query: ListRentalsDto, usuario: CurrentUser) {
    const hoje = this.comecoDoDia(new Date());

    await this.repository.atualizarAtrasados(
      hoje,
      usuario.role === 'ADMIN' ? undefined : usuario.id,
    );

    return this.repository.listar(
      {
        ...this.montarFiltro(query, usuario, StatusAluguel.ATRASADO),
        data_prevista_devolucao: { lt: hoje },
      },
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async extend(id: number, dto: ExtendRentalDto, usuario: CurrentUser) {
    const aluguel = await this.verificarAcesso(id, usuario);

    const hoje = this.comecoDoDia(new Date());
    const vencimentoOriginal = this.comecoDoDia(
      new Date(aluguel.data_prevista_devolucao),
    );

    if (aluguel.status !== StatusAluguel.ATIVO || vencimentoOriginal < hoje) {
      throw new BadRequestException(
        'Somente aluguéis ativos e ainda dentro do prazo podem ser prorrogados.',
      );
    }

    const novaData = this.adicionarDias(
      new Date(aluguel.data_prevista_devolucao),
      dto.dias,
    );

    const valorOriginal =
      aluguel.valor_total ??
      new Prisma.Decimal(aluguel.valor_diaria)
        .mul(aluguel.quantidade)
        .mul(
          this.diasDeAluguel(
            aluguel.data_aluguel,
            aluguel.data_prevista_devolucao,
          ),
        );

    const valorAdicional = new Prisma.Decimal(aluguel.valor_diaria)
      .mul(aluguel.quantidade)
      .mul(dto.dias);

    return this.repository.prorrogarPrazo(
      id,
      novaData,
      valorOriginal.add(valorAdicional),
    );
  }

  async remove(id: number, usuario: CurrentUser) {
    this.exigirAdmin(usuario);

    const aluguel = await this.verificarAcesso(id, usuario);
    const qtdPagamentos =
      await this.repository.contarPagamentosDoAluguel(id);

    if (qtdPagamentos > 0) {
      throw new BadRequestException(
        'Não é possível apagar um aluguel que tem pagamentos registrados.',
      );
    }

    return this.repository.excluir(
      id,
      aluguel.status,
      aluguel.quantidade,
      aluguel.id_jogo,
    );
  }
}