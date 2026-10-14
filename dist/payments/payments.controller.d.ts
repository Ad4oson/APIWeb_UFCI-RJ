import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly payments;
    constructor(payments: PaymentsService);
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
                valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
            valor_diaria: import("@prisma/client/runtime/library").Decimal;
            id: number;
            id_usuario: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: import("@prisma/client/runtime/library").Decimal | null;
            status: import(".prisma/client").$Enums.StatusAluguel;
            local: boolean;
            observacoes: string | null;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: import("@prisma/client/runtime/library").Decimal;
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
                    valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
                valor_diaria: import("@prisma/client/runtime/library").Decimal;
                id: number;
                id_usuario: number;
                id_jogo: number;
                data_aluguel: Date;
                data_prevista_devolucao: Date;
                data_devolucao: Date | null;
                quantidade: number;
                valor_total: import("@prisma/client/runtime/library").Decimal | null;
                status: import(".prisma/client").$Enums.StatusAluguel;
                local: boolean;
                observacoes: string | null;
            };
        } & {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: import("@prisma/client/runtime/library").Decimal;
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
    findPending(): import(".prisma/client").Prisma.PrismaPromise<({
        aluguel: {
            usuario: {
                nome: string;
                id: number;
                email: string;
            };
            jogo: {
                nome: string;
                descricao: string | null;
                valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
            valor_diaria: import("@prisma/client/runtime/library").Decimal;
            id: number;
            id_usuario: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: import("@prisma/client/runtime/library").Decimal | null;
            status: import(".prisma/client").$Enums.StatusAluguel;
            local: boolean;
            observacoes: string | null;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    })[]>;
    summary(query: ListPaymentsDto): Promise<{
        periodo: {
            inicio: Date;
            fim: Date;
        };
        total_arrecadado: import("@prisma/client/runtime/library").Decimal;
        quantidade_pagamentos_compensados: number;
        por_status: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PagamentoGroupByOutputType, "status"[]> & {
            _count: {
                _all: number;
            };
            _sum: {
                valor: import("@prisma/client/runtime/library").Decimal | null;
            };
        })[];
    }>;
    findByRental(rentalId: number): Promise<{
        aluguel: {
            valor_diaria: import("@prisma/client/runtime/library").Decimal;
            id: number;
            id_usuario: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: import("@prisma/client/runtime/library").Decimal | null;
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
                    valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
                valor_diaria: import("@prisma/client/runtime/library").Decimal;
                id: number;
                id_usuario: number;
                id_jogo: number;
                data_aluguel: Date;
                data_prevista_devolucao: Date;
                data_devolucao: Date | null;
                quantidade: number;
                valor_total: import("@prisma/client/runtime/library").Decimal | null;
                status: import(".prisma/client").$Enums.StatusAluguel;
                local: boolean;
                observacoes: string | null;
            };
        } & {
            id: number;
            status: import(".prisma/client").$Enums.StatusPagamento;
            id_aluguel: number;
            valor: import("@prisma/client/runtime/library").Decimal;
            data_pagamento: Date;
            forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
        })[];
        total_pago: import("@prisma/client/runtime/library").Decimal;
        total_pendente: import("@prisma/client/runtime/library").Decimal;
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
                valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
            valor_diaria: import("@prisma/client/runtime/library").Decimal;
            id: number;
            id_usuario: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: import("@prisma/client/runtime/library").Decimal | null;
            status: import(".prisma/client").$Enums.StatusAluguel;
            local: boolean;
            observacoes: string | null;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
    calculateFine(rentalId: number): Promise<{
        rentalId: number;
        dias_atraso: number;
        multa: import("@prisma/client/runtime/library").Decimal;
        data_prevista_devolucao: Date;
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
                valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
            valor_diaria: import("@prisma/client/runtime/library").Decimal;
            id: number;
            id_usuario: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: import("@prisma/client/runtime/library").Decimal | null;
            status: import(".prisma/client").$Enums.StatusAluguel;
            local: boolean;
            observacoes: string | null;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: import("@prisma/client/runtime/library").Decimal;
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
                valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
            valor_diaria: import("@prisma/client/runtime/library").Decimal;
            id: number;
            id_usuario: number;
            id_jogo: number;
            data_aluguel: Date;
            data_prevista_devolucao: Date;
            data_devolucao: Date | null;
            quantidade: number;
            valor_total: import("@prisma/client/runtime/library").Decimal | null;
            status: import(".prisma/client").$Enums.StatusAluguel;
            local: boolean;
            observacoes: string | null;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusPagamento;
        id_aluguel: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        data_pagamento: Date;
        forma_pagamento: import(".prisma/client").$Enums.FormaPagamento | null;
    }>;
}
