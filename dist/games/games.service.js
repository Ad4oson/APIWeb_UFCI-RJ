"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let GamesService = class GamesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const nome = dto.nome.trim();
        if (!nome)
            throw new common_1.BadRequestException('O nome do jogo é obrigatório.');
        const existingGame = await this.prisma.jogo.findFirst({
            where: { nome },
            select: { id: true },
        });
        if (existingGame) {
            throw new common_1.ConflictException('Já existe um jogo com este nome.');
        }
        const numeroJogadoresMin = dto.numero_jogadores_min ?? 2;
        const numeroJogadoresMax = dto.numero_jogadores_max ?? 4;
        if (numeroJogadoresMin > numeroJogadoresMax) {
            throw new common_1.BadRequestException('O número mínimo de jogadores não pode superar o máximo.');
        }
        try {
            return await this.prisma.jogo.create({
                data: {
                    nome,
                    descricao: dto.descricao,
                    valor_diaria: new client_1.Prisma.Decimal(dto.valor_diaria),
                    quantidade_total: dto.quantidade_total,
                    quantidade_disponivel: dto.quantidade_total,
                    numero_jogadores_min: numeroJogadoresMin,
                    numero_jogadores_max: numeroJogadoresMax,
                    idade_minima: dto.idade_minima ?? 18,
                    duracao_minutos: dto.duracao_minutos,
                    complexidade: dto.complexidade,
                    ano_lancamento: dto.ano_lancamento,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException('Já existe um jogo com este nome.');
            }
            throw error;
        }
    }
    findAll() {
        return this.prisma.jogo.findMany({ orderBy: { nome: 'asc' } });
    }
    async findOne(id) {
        const game = await this.prisma.jogo.findUnique({ where: { id } });
        if (!game)
            throw new common_1.NotFoundException('Jogo não encontrado.');
        return game;
    }
    async update(id, dto) {
        const nome = dto.nome?.trim();
        if (nome !== undefined && !nome) {
            throw new common_1.BadRequestException('O nome do jogo é obrigatório.');
        }
        return this.prisma
            .$transaction(async (tx) => {
            const game = await tx.jogo.findUnique({ where: { id } });
            if (!game)
                throw new common_1.NotFoundException('Jogo não encontrado.');
            if (nome !== undefined) {
                const existingGame = await tx.jogo.findFirst({
                    where: { nome, NOT: { id } },
                    select: { id: true },
                });
                if (existingGame) {
                    throw new common_1.ConflictException('Já existe um jogo com este nome.');
                }
            }
            const minPlayers = dto.numero_jogadores_min ?? game.numero_jogadores_min;
            const maxPlayers = dto.numero_jogadores_max ?? game.numero_jogadores_max;
            if (minPlayers > maxPlayers) {
                throw new common_1.BadRequestException('O número mínimo de jogadores não pode superar o máximo.');
            }
            const data = {
                ...(nome !== undefined && { nome }),
                ...(dto.descricao !== undefined && { descricao: dto.descricao }),
                ...(dto.valor_diaria !== undefined && {
                    valor_diaria: new client_1.Prisma.Decimal(dto.valor_diaria),
                }),
                ...(dto.numero_jogadores_min !== undefined && {
                    numero_jogadores_min: dto.numero_jogadores_min,
                }),
                ...(dto.numero_jogadores_max !== undefined && {
                    numero_jogadores_max: dto.numero_jogadores_max,
                }),
                ...(dto.idade_minima !== undefined && {
                    idade_minima: dto.idade_minima,
                }),
                ...(dto.duracao_minutos !== undefined && {
                    duracao_minutos: dto.duracao_minutos,
                }),
                ...(dto.complexidade !== undefined && {
                    complexidade: dto.complexidade,
                }),
                ...(dto.ano_lancamento !== undefined && {
                    ano_lancamento: dto.ano_lancamento,
                }),
                ...(dto.ativo !== undefined && { ativo: dto.ativo }),
            };
            if (dto.quantidade_total !== undefined) {
                const alugados = game.quantidade_total - game.quantidade_disponivel;
                if (dto.quantidade_total < alugados) {
                    throw new common_1.BadRequestException('O estoque total não pode ser menor que a quantidade atualmente alugada.');
                }
                data.quantidade_total = dto.quantidade_total;
                data.quantidade_disponivel = dto.quantidade_total - alugados;
                const result = await tx.jogo.updateMany({
                    where: {
                        id,
                        quantidade_total: game.quantidade_total,
                        quantidade_disponivel: game.quantidade_disponivel,
                    },
                    data,
                });
                if (result.count !== 1) {
                    throw new common_1.BadRequestException('O estoque mudou durante a atualização. Consulte o jogo e tente novamente.');
                }
                return tx.jogo.findUniqueOrThrow({ where: { id } });
            }
            return tx.jogo.update({ where: { id }, data });
        })
            .catch((error) => {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException('Já existe um jogo com este nome.');
            }
            throw error;
        });
    }
    async remove(id) {
        const game = await this.prisma.jogo.findUnique({ where: { id } });
        if (!game)
            throw new common_1.NotFoundException('Jogo não encontrado.');
        const [rentals, reviews] = await this.prisma.$transaction([
            this.prisma.aluguel.count({ where: { id_jogo: id } }),
            this.prisma.avaliacao.count({ where: { id_jogo: id } }),
        ]);
        if (rentals > 0 || reviews > 0) {
            throw new common_1.BadRequestException('Não é possível excluir um jogo com aluguéis ou avaliações registrados.');
        }
        await this.prisma.jogo.delete({ where: { id } });
        return { mensagem: 'Jogo excluído com sucesso.' };
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamesService);
//# sourceMappingURL=games.service.js.map