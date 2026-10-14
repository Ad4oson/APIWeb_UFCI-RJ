import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }>;
    findAll(): Prisma.PrismaPromise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }[]>;
    findActive(): Prisma.PrismaPromise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }[]>;
    findOne(id: number): Promise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }>;
    findRentals(id: number): Promise<({
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
    update(id: number, dto: UpdateUserDto): Promise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }>;
    deactivate(id: number): Promise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }>;
    activate(id: number): Promise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }>;
    remove(id: number): Promise<{
        nome: string;
        ativo: boolean;
        id: number;
        email: string;
        telefone: string | null;
        cpf: string | null;
        data_cadastro: Date;
    }>;
}
