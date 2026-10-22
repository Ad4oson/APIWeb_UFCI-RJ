import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusPagamento } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentsRepository } from './payments.repository';

export interface CurrentPaymentUser {
  id: number;
  role: string;
}

@Injectable()
export class PaymentsService {
  constructor(private readonly repository: PaymentsRepository) {}

  private exigirAdmin(usuario: CurrentPaymentUser) {
    if (usuario.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso restrito a administradores.');
    }
  }

  private montarFiltroDatas(query: ListPaymentsDto) {
    const data: Prisma.DateTimeFilter = {};

    if (query.startDate) {
      const inicio = new Date(query.startDate);

      if (/^\d{4}-\d{2}-\d{2}$/.test(query.startDate)) {
        inicio.setUTCHours(0, 0, 0, 0);
      }

      data.gte = inicio;
    }

    if (query.endDate) {
      const fim = new Date(query.endDate);

      if (/^\d{4}-\d{2}-\d{2}$/.test(query.endDate)) {
        fim.setUTCHours(23, 59, 59, 999);
      }

      data.lte = fim;
    }

    if (data.gte && data.lte && data.gte > data.lte) {
      throw new BadRequestException(
        'startDate deve ser anterior ou igual a endDate.',
      );
    }

    return Object.keys(data).length > 0 ? data : undefined;
  }

  private montarFiltro(
    query: ListPaymentsDto,
    usuario: CurrentPaymentUser,
    status?: StatusPagamento,
  ): Prisma.PagamentoWhereInput {
    const where: Prisma.PagamentoWhereInput = {};

    if (status !== undefined) {
      where.status = status;
    } else if (query.status !== undefined) {
      where.status = query.status;
    }

    if (query.forma_pagamento !== undefined) {
      where.forma_pagamento = query.forma_pagamento;
    }

    const datas = this.montarFiltroDatas(query);

    if (datas) {
      where.data_pagamento = datas;
    }

    if (usuario.role !== 'ADMIN') {
      where.aluguel = { is: { id_usuario: usuario.id } };
    }

    return where;
  }

  private async verificarAcesso(
    id: number,
    usuario: CurrentPaymentUser,
  ) {
    const pagamento = await this.repository.buscarPorId(id);

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    if (
      usuario.role !== 'ADMIN' &&
      pagamento.aluguel.id_usuario !== usuario.id
    ) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    return pagamento;
  }

  async create(dto: CreatePaymentDto, usuario: CurrentPaymentUser) {
    const aluguel = await this.repository.buscarAluguelPorId(dto.id_aluguel);

    if (!aluguel) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    if (usuario.role !== 'ADMIN' && aluguel.id_usuario !== usuario.id) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    if (aluguel.status === 'CANCELADO') {
      throw new BadRequestException(
        'Não é possível pagar um aluguel cancelado.',
      );
    }

    const totalPagoOuPendente =
      await this.repository.somarPagamentosAtivosDoAluguel(dto.id_aluguel);

    const dataInicio = new Date(aluguel.data_aluguel);
    dataInicio.setHours(0, 0, 0, 0);

    const dataPrevista = new Date(aluguel.data_prevista_devolucao);
    dataPrevista.setHours(0, 0, 0, 0);

    const diffMs = dataPrevista.getTime() - dataInicio.getTime();
    const diasAluguel = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const valorAluguel =
      aluguel.valor_total ??
      aluguel.valor_diaria.mul(aluguel.quantidade).mul(diasAluguel);

    const saldoRestante = valorAluguel.sub(totalPagoOuPendente);

    if (new Prisma.Decimal(dto.valor).greaterThan(saldoRestante)) {
      throw new BadRequestException('O pagamento excede o saldo do aluguel.');
    }

    return this.repository.criar({
      id_aluguel: dto.id_aluguel,
      valor: new Prisma.Decimal(dto.valor),
      forma_pagamento: dto.forma_pagamento,
    });
  }

  findAll(query: ListPaymentsDto, usuario: CurrentPaymentUser) {
    return this.repository.listar(
      this.montarFiltro(query, usuario),
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async findOne(id: number, usuario: CurrentPaymentUser) {
    return this.verificarAcesso(id, usuario);
  }

  async findByRental(
    rentalId: number,
    query: ListPaymentsDto,
    usuario: CurrentPaymentUser,
  ) {
    const aluguel = await this.repository.buscarAluguelPorId(rentalId);

    if (!aluguel) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    if (usuario.role !== 'ADMIN' && aluguel.id_usuario !== usuario.id) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    const where: Prisma.PagamentoWhereInput = {
      ...this.montarFiltro(query, usuario),
      id_aluguel: rentalId,
    };

    const [resultado, totais] = await Promise.all([
      this.repository.listar(where, query.page ?? 1, query.limit ?? 20),
      this.repository.resumirPorAluguel(where),
    ]);

    return {
      aluguel,
      pagamentos: resultado.data,
      meta: resultado.meta,
      total_pago: totais.totalPago,
      total_pendente: totais.totalPendente,
    };
  }

  async findPending(query: ListPaymentsDto, usuario: CurrentPaymentUser) {
    return this.repository.listar(
      this.montarFiltro(query, usuario, StatusPagamento.PENDENTE),
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async confirm(id: number, usuario: CurrentPaymentUser) {
    this.exigirAdmin(usuario);

    const pagamento = await this.verificarAcesso(id, usuario);

    if (pagamento.status !== StatusPagamento.PENDENTE) {
      throw new BadRequestException(
        'Somente pagamentos pendentes podem ser confirmados.',
      );
    }

    return this.repository.atualizarStatus(id, StatusPagamento.PAGO);
  }

  async refund(id: number, usuario: CurrentPaymentUser) {
    this.exigirAdmin(usuario);

    const pagamento = await this.verificarAcesso(id, usuario);

    if (pagamento.status !== StatusPagamento.PAGO) {
      throw new BadRequestException(
        'Somente pagamentos realizados podem ser estornados.',
      );
    }

    return this.repository.atualizarStatus(id, StatusPagamento.ESTORNADO);
  }

  async calculateFine(rentalId: number, usuario: CurrentPaymentUser) {
    const aluguel = await this.repository.buscarAluguelPorId(rentalId);

    if (!aluguel) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    if (usuario.role !== 'ADMIN' && aluguel.id_usuario !== usuario.id) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataPrevista = new Date(aluguel.data_prevista_devolucao);
    dataPrevista.setHours(0, 0, 0, 0);

    const diffMs = hoje.getTime() - dataPrevista.getTime();
    const diasAtraso = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const multa = new Prisma.Decimal(aluguel.valor_diaria)
      .div(2)
      .mul(diasAtraso)
      .mul(aluguel.quantidade);

    return {
      rentalId,
      dias_atraso: diasAtraso,
      multa,
      data_prevista_devolucao: aluguel.data_prevista_devolucao,
    };
  }

  async summary(query: ListPaymentsDto, usuario: CurrentPaymentUser) {
    this.exigirAdmin(usuario);

    const inicio = query.startDate
      ? new Date(query.startDate)
      : new Date(0);
    const fim = query.endDate ? new Date(query.endDate) : new Date();

    if (query.startDate && /^\d{4}-\d{2}-\d{2}$/.test(query.startDate)) {
      inicio.setUTCHours(0, 0, 0, 0);
    }

    if (query.endDate && /^\d{4}-\d{2}-\d{2}$/.test(query.endDate)) {
      fim.setUTCHours(23, 59, 59, 999);
    }

    if (inicio > fim) {
      throw new BadRequestException(
        'startDate deve ser anterior ou igual a endDate.',
      );
    }

    return this.repository.buscarResumoFinanceiro(inicio, fim);
  }

  async remove(id: number, usuario: CurrentPaymentUser) {
    this.exigirAdmin(usuario);

    const pagamento = await this.verificarAcesso(id, usuario);

    if (
      pagamento.status !== StatusPagamento.PENDENTE &&
      pagamento.status !== StatusPagamento.CANCELADO
    ) {
      throw new BadRequestException(
        'Somente pagamentos pendentes ou cancelados podem ser excluídos.',
      );
    }

    return this.repository.deletar(id);
  }
}