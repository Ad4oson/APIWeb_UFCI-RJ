import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePaymentDto): Promise<{
        aluguel: {
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
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: Prisma.Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
    findAll(query: ListPaymentsDto): Promise<{
        data: ({
            aluguel: {
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
            };
        } & {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: number): Promise<{
        aluguel: {
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
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: Prisma.Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
    findByRental(rentalId: number): Promise<{
        aluguel: {
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
        };
        pagamentos: ({
            aluguel: {
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
            };
        } & {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: Prisma.Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        })[];
        total_pago: Prisma.Decimal;
        total_pendente: Prisma.Decimal;
    }>;
    confirm(id: number): Promise<{
        aluguel: {
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
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: Prisma.Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
    refund(id: number): Promise<{
        aluguel: {
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
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: Prisma.Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
    findPending(): Prisma.PrismaPromise<({
        aluguel: {
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
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: Prisma.Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    })[]>;
    calculateFine(rentalId: number): Promise<{
        rentalId: number;
        dias_atraso: number;
        multa: Prisma.Decimal;
        data_prevista_devolucao: Date;
    }>;
    summary(query: ListPaymentsDto): Promise<{
        periodo: {
            inicio: Date;
            fim: Date;
        };
        total_arrecadado: Prisma.Decimal;
        quantidade_pagamentos_compensados: number;
        por_status: (Prisma.PickEnumerable<Prisma.PagamentoGroupByOutputType, "status"[]> & {
            _count: {
                _all: number;
            };
            _sum: {
                valor: Prisma.Decimal | null;
            };
        })[];
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: Prisma.Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
    private startOfDay;
    private dateBoundary;
}
