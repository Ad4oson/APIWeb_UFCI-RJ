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
const prisma_service_1 = require("../prisma/prisma.service");
const publicUserFields = {
    id: true,
    nome: true,
    email: true,
    telefone: true,
    cpf: true,
    data_cadastro: true,
    ativo: true,
};
function normalizeCpf(value) {
    if (!value)
        return null;
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) {
        throw new common_1.BadRequestException('CPF inválido.');
    }
    if (/^(\d)\1{10}$/.test(digits)) {
        throw new common_1.BadRequestException('CPF inválido.');
    }
    let sum = 0;
    for (let index = 0; index < 9; index += 1) {
        sum += Number(digits[index]) * (10 - index);
    }
    let firstVerifierDigit = 11 - (sum % 11);
    if (firstVerifierDigit >= 10) {
        firstVerifierDigit = 0;
    }
    sum = 0;
    for (let index = 0; index < 10; index += 1) {
        sum += Number(digits[index]) * (11 - index);
    }
    let secondVerifierDigit = 11 - (sum % 11);
    if (secondVerifierDigit >= 10) {
        secondVerifierDigit = 0;
    }
    const expectedDigits = `${firstVerifierDigit}${secondVerifierDigit}`;
    if (digits.slice(-2) !== expectedDigits) {
        throw new common_1.BadRequestException('CPF inválido.');
    }
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const nome = dto.nome.trim();
        const email = dto.email.trim().toLowerCase();
        if (!nome)
            throw new common_1.BadRequestException('O nome do usuário é obrigatório.');
        const cpf = normalizeCpf(dto.cpf);
        const existingUser = await this.prisma.usuario.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Já existe um usuário com este e-mail.');
        }
        if (cpf) {
            const cpfInUse = await this.prisma.usuario.findUnique({
                where: { cpf },
                select: { id: true },
            });
            if (cpfInUse) {
                throw new common_1.ConflictException('Já existe um usuário com este CPF.');
            }
        }
        return this.prisma.usuario.create({
            data: {
                nome,
                email,
                senha: dto.senha,
                cpf,
                telefone: dto.telefone,
            },
            select: publicUserFields,
        });
    }
    findAll() {
        return this.prisma.usuario.findMany({
            select: publicUserFields,
            orderBy: { nome: 'asc' },
        });
    }
    findActive() {
        return this.prisma.usuario.findMany({
            where: { ativo: true },
            select: publicUserFields,
            orderBy: { nome: 'asc' },
        });
    }
    findInactive() {
        return this.prisma.usuario.findMany({
            where: { ativo: false },
            select: publicUserFields,
            orderBy: { nome: 'asc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.usuario.findUnique({
            where: { id },
            select: publicUserFields,
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        return user;
    }
    async update(id, dto) {
        const existingUser = await this.prisma.usuario.findUnique({ where: { id } });
        if (!existingUser)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        const nome = dto.nome?.trim();
        const email = dto.email?.trim().toLowerCase();
        const cpf = dto.cpf !== undefined ? normalizeCpf(dto.cpf) : undefined;
        if (nome !== undefined && !nome) {
            throw new common_1.BadRequestException('O nome do usuário é obrigatório.');
        }
        if (email !== undefined && email !== existingUser.email) {
            const emailInUse = await this.prisma.usuario.findUnique({
                where: { email },
                select: { id: true },
            });
            if (emailInUse) {
                throw new common_1.ConflictException('Já existe um usuário com este e-mail.');
            }
        }
        if (cpf !== undefined && cpf !== null && existingUser.cpf !== cpf) {
            const cpfInUse = await this.prisma.usuario.findUnique({
                where: { cpf },
                select: { id: true },
            });
            if (cpfInUse) {
                throw new common_1.ConflictException('Já existe um usuário com este CPF.');
            }
        }
        return this.prisma.usuario.update({
            where: { id },
            data: {
                ...(nome !== undefined && { nome }),
                ...(email !== undefined && { email }),
                ...(dto.senha !== undefined && { senha: dto.senha }),
                ...(cpf !== undefined && { cpf }),
                ...(dto.telefone !== undefined && { telefone: dto.telefone }),
            },
            select: publicUserFields,
        });
    }
    async findRentals(id) {
        const user = await this.prisma.usuario.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        return this.prisma.aluguel.findMany({
            where: { id_usuario: id },
            include: {
                jogo: true,
                pagamentos: true,
            },
            orderBy: { data_aluguel: 'desc' },
        });
    }
    async setActive(id, active) {
        const user = await this.prisma.usuario.findUnique({
            where: { id },
            select: { id: true, ativo: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        if (!active) {
            const activeRentals = await this.prisma.aluguel.count({
                where: {
                    id_usuario: id,
                    status: { in: [client_1.StatusAluguel.ATIVO, client_1.StatusAluguel.ATRASADO] },
                },
            });
            if (activeRentals > 0) {
                throw new common_1.BadRequestException('Não é possível desativar um usuário com aluguéis em andamento.');
            }
        }
        return this.prisma.usuario.update({
            where: { id },
            data: { ativo: active },
            select: publicUserFields,
        });
    }
    async remove(id) {
        const user = await this.prisma.usuario.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        const [rentals, reviews] = await this.prisma.$transaction([
            this.prisma.aluguel.count({ where: { id_usuario: id } }),
            this.prisma.avaliacao.count({ where: { id_usuario: id } }),
        ]);
        if (rentals > 0 || reviews > 0) {
            throw new common_1.BadRequestException('Não é possível excluir um usuário com aluguéis ou avaliações registrados.');
        }
        await this.prisma.usuario.delete({ where: { id } });
        return { mensagem: 'Usuário excluído com sucesso.' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map