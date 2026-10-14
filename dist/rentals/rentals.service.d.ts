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
            ano_lancamento: number | null;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ativo: boolean;
            quantidade_disponivel: number;
            id: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
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
                ano_lancamento: number | null;
                numero_jogadores_min: number;
                numero_jogadores_max: number;
                idade_minima: number;
                duracao_minutos: number;
                complexidade: number;
                ativo: boolean;
                quantidade_disponivel: number;
                id: number;
            };
            pagamentos: {
                id: number;
                status: import(".prisma/client").$Enums.StatusPagamento;
                id_aluguel: number;
                valor: Prisma.Decimal;
                data_pagamento: Date;
                forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
            }[];
        } & {
            valor_diaria: Prisma.Decimal;
            id: number;
            id_usuario: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: Prisma.Decimal | null;
            status: import(".prisma/client").$Enums.StatusAluguel;
            local: boolean;
            observacoes: string | null;
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
            ano_lancamento: number | null;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ativo: boolean;
            quantidade_disponivel: number;
            id: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
    }>;
    returnRental(id: number): Promise<{
        dias_atraso: number;
        multa: Prisma.Decimal;
        pagamento_multa: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        } | null;
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
    }>;
    cancel(id: number): Promise<{
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
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
            ano_lancamento: number | null;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ativo: boolean;
            quantidade_disponivel: number;
            id: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
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
            ano_lancamento: number | null;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ativo: boolean;
            quantidade_disponivel: number;
            id: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
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
            ano_lancamento: number | null;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ativo: boolean;
            quantidade_disponivel: number;
            id: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
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
            ano_lancamento: number | null;
            numero_jogadores_min: number;
            numero_jogadores_max: number;
            idade_minima: number;
            duracao_minutos: number;
            complexidade: number;
            ativo: boolean;
            quantidade_disponivel: number;
            id: number;
        };
        pagamentos: {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        }[];
    } & {
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
    }>;
    remove(id: number): Promise<{
        valor_diaria: Prisma.Decimal;
        id: number;
        id_usuario: number;
        id_jogo: number;
        data_aluguel: Date;
        data_prevista_devolucao: Date;
        data_devolucao: Date | null;
        quantidade: number;
        valor_total: Prisma.Decimal | null;
        status: import(".prisma/client").$Enums.StatusAluguel;
        local: boolean;
        observacoes: string | null;
    }>;
    private addDays;
    private startOfDay;
    private rentalDays;
}
