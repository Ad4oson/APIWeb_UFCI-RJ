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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const dadosPublicosUsuario = {
    id: true,
    nome: true,
    email: true,
    telefone: true,
    cpf: true,
    data_cadastro: true,
    ativo: true,
};
function gerarHashSenha(senha) {
    const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, node_crypto_1.scryptSync)(senha, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (usuarioExistente) {
            throw new common_1.ConflictException('Este e-mail já está cadastrado.');
        }
        return this.prisma.usuario.create({
            data: {
                nome: dto.nome,
                email: dto.email,
                senha: gerarHashSenha(dto.senha),
                telefone: dto.telefone,
            },
            select: dadosPublicosUsuario,
        });
    }
    findAll() {
        return this.prisma.usuario.findMany({
            select: dadosPublicosUsuario,
            orderBy: { nome: 'asc' },
        });
    }
    findActive() {
        return this.prisma.usuario.findMany({
            where: { ativo: true },
            select: dadosPublicosUsuario,
            orderBy: { nome: 'asc' },
        });
    }
    async findOne(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            select: dadosPublicosUsuario,
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        return usuario;
    }
    async findRentals(id) {
        await this.findOne(id);
        return this.prisma.aluguel.findMany({
            where: { id_usuario: id },
            include: {
                jogo: true,
                pagamentos: true,
            },
            orderBy: { data_aluguel: 'desc' },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.email) {
            const usuarioComEmail = await this.prisma.usuario.findUnique({
                where: { email: dto.email },
                select: { id: true },
            });
            if (usuarioComEmail && usuarioComEmail.id !== id) {
                throw new common_1.ConflictException('Este e-mail já está cadastrado.');
            }
        }
        const { senha, ...dados } = dto;
        return this.prisma.usuario.update({
            where: { id },
            data: {
                ...dados,
                ...(senha !== undefined && { senha: gerarHashSenha(senha) }),
            },
            select: dadosPublicosUsuario,
        });
    }
    async deactivate(id) {
        await this.findOne(id);
        const alugueisEmAndamento = await this.prisma.aluguel.count({
            where: {
                id_usuario: id,
                status: { in: [client_1.StatusAluguel.ATIVO, client_1.StatusAluguel.ATRASADO] },
            },
        });
        if (alugueisEmAndamento > 0) {
            throw new common_1.BadRequestException('Não é possível desativar um usuário com aluguéis em andamento.');
        }
        return this.prisma.usuario.update({
            where: { id },
            data: { ativo: false },
            select: dadosPublicosUsuario,
        });
    }
    async activate(id) {
        await this.findOne(id);
        return this.prisma.usuario.update({
            where: { id },
            data: { ativo: true },
            select: dadosPublicosUsuario,
        });
    }
    async remove(id) {
        await this.findOne(id);
        const historicoAlugueis = await this.prisma.aluguel.count({
            where: { id_usuario: id },
        });
        if (historicoAlugueis > 0) {
            throw new common_1.BadRequestException('Não é possível excluir um usuário que possui histórico de aluguéis.');
        }
        return this.prisma.usuario.delete({
            where: { id },
            select: dadosPublicosUsuario,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map