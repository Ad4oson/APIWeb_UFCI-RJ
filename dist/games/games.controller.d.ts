import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    create(dto: CreateGameDto): Promise<{
        nome: string;
        descricao: string | null;
        valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        nome: string;
        descricao: string | null;
        valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
        valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
        valor_diaria: import("@prisma/client/runtime/library").Decimal;
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
