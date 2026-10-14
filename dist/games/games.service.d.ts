import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
export declare class GamesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateGameDto): Promise<{
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
    }>;
    findAll(): Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: number): Promise<{
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
    }>;
    update(id: number, dto: UpdateGameDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
        mensagem: string;
    }>;
}
