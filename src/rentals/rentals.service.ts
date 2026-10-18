import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusAluguel } from '@prisma/client';
import { RentalsRepository } from './rentals.repository';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';

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
    return Math.max(
      1,
      Math.ceil((this.comecoDoDia(fim).getTime() - this.comecoDoDia(inicio).getTime()) / 86_400_000),
    );
  }

  async create(dto: CreateRentalDto) {
    const previsao = dto.data_prevista_devolucao ?? this.adicionarDias(new Date(), 7);
    
    if (this.comecoDoDia(previsao) <= this.comecoDoDia(new Date())) {
      throw new BadRequestException('A devolução prevista deve ser para o futuro.');
    }

    const usuario = await this.repository.buscarUsuario(dto.id_usuario);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    if (!usuario.ativo) {
      throw new BadRequestException('Usuário inativo não pode alugar jogo.');
    }

    const jogo = await this.repository.buscarJogo(dto.id_jogo);
    if (!jogo) throw new NotFoundException('Jogo não encontrado.');
    if (!jogo.ativo) {
      throw new BadRequestException('Este jogo está inativo.');
    }

    const dias = this.diasDeAluguel(new Date(), previsao);
    const valorTotal = jogo.valor_diaria.mul(dto.quantidade).mul(dias);

    try {
      return await this.repository.criarAluguel(
        usuario.id,
        jogo.id,
        dto.quantidade,
        previsao,
        jogo.valor_diaria,
        valorTotal,
        dto.local,
        dto.observacoes
      );
    } catch (erro: any) {
      if (erro.message === 'ESTOQUE_INSUFICIENTE') {
        throw new BadRequestException('Estoque insuficiente para essa quantidade.');
      }
      throw erro;
    }
  }

  async findAll(query: ListRentalsDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const pular = (page - 1) * limit;

    const where: Prisma.AluguelWhereInput = query.status ? { status: query.status } : {};

    const [registros, total] = await this.repository.listar(where, pular, limit);
    
    return { data: registros, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const aluguel = await this.repository.buscarPorId(id);
    if (!aluguel) throw new NotFoundException('Aluguel não encontrado.');
    return aluguel;
  }

  async returnRental(id: number) {
    const aluguel = await this.findOne(id);

    if (aluguel.status !== StatusAluguel.ATIVO && aluguel.status !== StatusAluguel.ATRASADO) {
      throw new BadRequestException('Este aluguel não pode ser devolvido.');
    }

    const devolvidoEm = new Date();
    const diasDeAtraso = Math.max(
      0,
      Math.ceil((this.comecoDoDia(devolvidoEm).getTime() - this.comecoDoDia(aluguel.data_prevista_devolucao).getTime()) / 86_400_000)
    );

    const multa = new Prisma.Decimal(aluguel.valor_diaria).mul(diasDeAtraso).mul(aluguel.quantidade);
    
    const valorContrato = aluguel.valor_total ?? new Prisma.Decimal(aluguel.valor_diaria)
        .mul(aluguel.quantidade)
        .mul(this.diasDeAluguel(aluguel.data_aluguel, aluguel.data_prevista_devolucao));

    const novoValorTotal = valorContrato.add(multa);

    try {
      const { atualizado, finePayment } = await this.repository.devolver(
        id, devolvidoEm, novoValorTotal, aluguel.quantidade, aluguel.id_jogo, multa
      );
      
      return { ...atualizado, dias_atraso: diasDeAtraso, multa, pagamento_multa: finePayment };
    } catch (erro: any) {
      if (erro.message === 'NAO_PODE_DEVOLVER') {
        throw new BadRequestException('Este aluguel já foi alterado e não pode ser devolvido.');
      }
      throw erro;
    }
  }

  async cancel(id: number) {
    const aluguel = await this.findOne(id);
    
    if (aluguel.status !== StatusAluguel.ATIVO) {
      throw new BadRequestException('Somente aluguéis ativos podem ser cancelados.');
    }

    try {
      return await this.repository.cancelar(id, aluguel.quantidade, aluguel.id_jogo);
    } catch (erro: any) {
      if (erro.message === 'NAO_PODE_CANCELAR') {
         throw new BadRequestException('Aluguel já foi alterado.');
      }
      throw erro;
    }
  }

  async findByUser(userId: number) {
    const usuario = await this.repository.buscarUsuario(userId);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return this.repository.buscarPorUsuarioLista(userId);
  }

  findActive() {
    const hoje = this.comecoDoDia(new Date());
    return this.repository.buscarAtivosLista(hoje);
  }

  async findOverdue() {
    const hoje = this.comecoDoDia(new Date());
    return this.repository.processarAtrasados(hoje);
  }

  async extend(id: number, dto: ExtendRentalDto) {
    const aluguel = await this.findOne(id);
    
    if (aluguel.status !== StatusAluguel.ATIVO && aluguel.status !== StatusAluguel.ATRASADO) {
      throw new BadRequestException('Somente aluguéis não devolvidos podem ser prorrogados.');
    }

    const novaData = this.adicionarDias(new Date(aluguel.data_prevista_devolucao), dto.dias);
    
    const valorOriginal = aluguel.valor_total ?? new Prisma.Decimal(aluguel.valor_diaria)
        .mul(aluguel.quantidade)
        .mul(this.diasDeAluguel(aluguel.data_aluguel, aluguel.data_prevista_devolucao));
        
    const novoValor = valorOriginal.add(
      new Prisma.Decimal(aluguel.valor_diaria).mul(aluguel.quantidade).mul(dto.dias)
    );

    return this.repository.prorrogarPrazo(id, novaData, novoValor);
  }

  async remove(id: number) {
    const aluguel = await this.findOne(id);

    try {
      return await this.repository.excluir(id, aluguel.status, aluguel.quantidade, aluguel.id_jogo);
    } catch (erro: any) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2003') {
        throw new BadRequestException('Não é possível apagar um aluguel que tem pagamentos registrados.');
      }
      throw erro;
    }
  }
}