import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';
export declare class RentalsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateRentalDto): Promise<{
        usuario: {
            nome: string;
            id: number;
            email: string;
        };
        jogo: {
            nome: string;
            descricao: string | null;
            valor_diaria: Prisma.Decimal;
            quantidade_total: number;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ano_lancamento: number | null;
            ativo: boolean;
            id: number;
            quantidade_disponivel: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            data_pagamento: Date;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    }>;
    findAll(query: ListRentalsDto): Promise<{
        data: ({
            usuario: {
                nome: string;
                id: number;
                email: string;
            };
            jogo: {
                nome: string;
                descricao: string | null;
                valor_diaria: Prisma.Decimal;
                quantidade_total: number;
                numero_jogadores_min: number;
                numero_jogadores_max: number;
                idade_minima: number;
                duracao_minutos: number;
                complexidade: number;
                ano_lancamento: number | null;
                ativo: boolean;
                id: number;
                quantidade_disponivel: number;
            };
            pagamentos: {
                id: number;
                status: import(".prisma/client").$Enums.StatusPagamento;
                id_aluguel: number;
                valor: Prisma.Decimal;
                forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
                data_pagamento: Date;
            }[];
        } & {
            valor_diaria: Prisma.Decimal;
            id: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: Prisma.Decimal | null;
            status: import(".prisma/client").$Enums.StatusAluguel;
            local: boolean;
            observacoes: string | null;
            id_usuario: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: number): Promise<{
        usuario: {
            nome: string;
            id: number;
            email: string;
        };
        jogo: {
            nome: string;
            descricao: string | null;
            valor_diaria: Prisma.Decimal;
            quantidade_total: number;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ano_lancamento: number | null;
            ativo: boolean;
            id: number;
            quantidade_disponivel: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            data_pagamento: Date;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    }>;
    returnRental(id: number): Promise<{
        dias_atraso: number;
        multa: Prisma.Decimal;
        pagamento_multa: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            data_pagamento: Date;
        } | null;
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    }>;
    cancel(id: number): Promise<{
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    }>;
    findByUser(userId: number): Promise<({
        usuario: {
            nome: string;
            id: number;
            email: string;
        };
        jogo: {
            nome: string;
            descricao: string | null;
            valor_diaria: Prisma.Decimal;
            quantidade_total: number;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ano_lancamento: number | null;
            ativo: boolean;
            id: number;
            quantidade_disponivel: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            data_pagamento: Date;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    })[]>;
    findActive(): Prisma.PrismaPromise<({
        usuario: {
            nome: string;
            id: number;
            email: string;
        };
        jogo: {
            nome: string;
            descricao: string | null;
            valor_diaria: Prisma.Decimal;
            quantidade_total: number;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ano_lancamento: number | null;
            ativo: boolean;
            id: number;
            quantidade_disponivel: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            data_pagamento: Date;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    })[]>;
    findOverdue(): Promise<({
        usuario: {
            nome: string;
            id: number;
            email: string;
        };
        jogo: {
            nome: string;
            descricao: string | null;
            valor_diaria: Prisma.Decimal;
            quantidade_total: number;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ano_lancamento: number | null;
            ativo: boolean;
            id: number;
            quantidade_disponivel: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            data_pagamento: Date;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    })[]>;
    extend(id: number, dto: ExtendRentalDto): Promise<{
        usuario: {
            nome: string;
            id: number;
            email: string;
        };
        jogo: {
            nome: string;
            descricao: string | null;
            valor_diaria: Prisma.Decimal;
            quantidade_total: number;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ano_lancamento: number | null;
            ativo: boolean;
            id: number;
            quantidade_disponivel: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            data_pagamento: Date;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    }>;
    remove(id: number): Promise<{
        valor_diaria: Prisma.Decimal;
        id: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
        id_usuario: number;
    }>;
    private addDays;
    private startOfDay;
    private rentalDays;
}
