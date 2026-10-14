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
exports.RentalsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const rentalDetails = {
    usuario: { select: { id: true, nome: true, email: true } },
    jogo: true,
    pagamentos: true,
};
let RentalsService = class RentalsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const dueDate = dto.data_prevista_devolucao ?? this.addDays(new Date(), 7);
        if (this.startOfDay(dueDate) <= this.startOfDay(new Date())) {
            throw new common_1.BadRequestException('A devolução prevista deve ser futura.');
        }
        return this.prisma.$transaction(async (tx) => {
            const [usuario, jogo] = await Promise.all([
                tx.usuario.findUnique({ where: { id: dto.id_usuario } }),
                tx.jogo.findUnique({ where: { id: dto.id_jogo } }),
            ]);
            if (!usuario)
                throw new common_1.NotFoundException('Usuário não encontrado.');
            if (!usuario.ativo) {
                throw new common_1.BadRequestException('O usuário está inativo e não pode alugar.');
            }
            if (!jogo)
                throw new common_1.NotFoundException('Jogo não encontrado.');
            if (!jogo.ativo) {
                throw new common_1.BadRequestException('O jogo está inativo e não pode ser alugado.');
            }
            const reservation = await tx.jogo.updateMany({
                where: {
                    id: jogo.id,
                    ativo: true,
                    quantidade_disponivel: { gte: dto.quantidade },
                },
                data: { quantidade_disponivel: { decrement: dto.quantidade } },
            });
            if (reservation.count !== 1) {
                throw new common_1.BadRequestException('Estoque insuficiente para a quantidade solicitada.');
            }
            const rentalDays = Math.max(1, Math.ceil((this.startOfDay(dueDate).getTime() -
                this.startOfDay(new Date()).getTime()) /
                86_400_000));
            return tx.aluguel.create({
                data: {
                    id_usuario: usuario.id,
                    id_jogo: jogo.id,
                    quantidade: dto.quantidade,
                    data_prevista_devolucao: dueDate,
                    valor_diaria: jogo.valor_diaria,
                    valor_total: jogo.valor_diaria.mul(dto.quantidade).mul(rentalDays),
                    local: dto.local,
                    observacoes: dto.observacoes,
                },
                include: rentalDetails,
            });
        });
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 20, 100);
        const where = query.status
            ? { status: query.status }
            : {};
        const [data, total] = await this.prisma.$transaction([
            this.prisma.aluguel.findMany({
                where,
                include: rentalDetails,
                orderBy: { data_aluguel: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.aluguel.count({ where }),
        ]);
        return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const rental = await this.prisma.aluguel.findUnique({
            where: { id },
            include: rentalDetails,
        });
        if (!rental)
            throw new common_1.NotFoundException('Aluguel não encontrado.');
        return rental;
    }
    async returnRental(id) {
        return this.prisma.$transaction(async (tx) => {
            const rental = await tx.aluguel.findUnique({ where: { id } });
            if (!rental)
                throw new common_1.NotFoundException('Aluguel não encontrado.');
            if (rental.status !== client_1.StatusAluguel.ATIVO &&
                rental.status !== client_1.StatusAluguel.ATRASADO) {
                throw new common_1.BadRequestException('Este aluguel não pode ser devolvido.');
            }
            const returnedAt = new Date();
            const lateDays = Math.max(0, Math.ceil((this.startOfDay(returnedAt).getTime() -
                this.startOfDay(rental.data_prevista_devolucao).getTime()) /
                86_400_000));
            const fine = new client_1.Prisma.Decimal(rental.valor_diaria)
                .mul(lateDays)
                .mul(rental.quantidade);
            const contractedTotal = rental.valor_total ??
                new client_1.Prisma.Decimal(rental.valor_diaria)
                    .mul(rental.quantidade)
                    .mul(this.rentalDays(rental.data_aluguel, rental.data_prevista_devolucao));
            const transition = await tx.aluguel.updateMany({
                where: {
                    id,
                    status: { in: [client_1.StatusAluguel.ATIVO, client_1.StatusAluguel.ATRASADO] },
                },
                data: {
                    status: client_1.StatusAluguel.DEVOLVIDO,
                    data_devolucao: returnedAt,
                    valor_total: contractedTotal.add(fine),
                },
            });
            if (transition.count !== 1) {
                throw new common_1.BadRequestException('Este aluguel já foi alterado e não pode ser devolvido.');
            }
            await tx.jogo.update({
                where: { id: rental.id_jogo },
                data: { quantidade_disponivel: { increment: rental.quantidade } },
            });
            let finePayment = null;
            if (fine.greaterThan(0)) {
                finePayment = await tx.pagamento.create({
                    data: {
                        id_aluguel: id,
                        valor: fine,
                        forma_pagamento: null,
                        status: client_1.StatusPagamento.PENDENTE,
                    },
                });
            }
            const updated = await tx.aluguel.findUniqueOrThrow({ where: { id } });
            return { ...updated, dias_atraso: lateDays, multa: fine, pagamento_multa: finePayment };
        });
    }
    async cancel(id) {
        return this.prisma.$transaction(async (tx) => {
            const rental = await tx.aluguel.findUnique({ where: { id } });
            if (!rental)
                throw new common_1.NotFoundException('Aluguel não encontrado.');
            if (rental.status !== client_1.StatusAluguel.ATIVO) {
                throw new common_1.BadRequestException('Somente aluguéis ativos podem ser cancelados.');
            }
            const transition = await tx.aluguel.updateMany({
                where: { id, status: client_1.StatusAluguel.ATIVO },
                data: { status: client_1.StatusAluguel.CANCELADO },
            });
            if (transition.count !== 1) {
                throw new common_1.BadRequestException('Este aluguel já foi alterado e não pode ser cancelado.');
            }
            await tx.jogo.update({
                where: { id: rental.id_jogo },
                data: { quantidade_disponivel: { increment: rental.quantidade } },
            });
            return tx.aluguel.findUniqueOrThrow({ where: { id } });
        });
    }
    async findByUser(userId) {
        const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        return this.prisma.aluguel.findMany({
            where: { id_usuario: userId },
            include: rentalDetails,
            orderBy: { data_aluguel: 'desc' },
        });
    }
    findActive() {
        const today = this.startOfDay(new Date());
        return this.prisma.aluguel.findMany({
            where: {
                status: client_1.StatusAluguel.ATIVO,
                data_prevista_devolucao: { gte: today },
            },
            include: rentalDetails,
            orderBy: { data_prevista_devolucao: 'asc' },
        });
    }
    async findOverdue() {
        const today = this.startOfDay(new Date());
        await this.prisma.aluguel.updateMany({
            where: {
                status: client_1.StatusAluguel.ATIVO,
                data_prevista_devolucao: { lt: today },
            },
            data: { status: client_1.StatusAluguel.ATRASADO },
        });
        return this.prisma.aluguel.findMany({
            where: {
                status: client_1.StatusAluguel.ATRASADO,
                data_prevista_devolucao: { lt: today },
            },
            include: rentalDetails,
            orderBy: { data_prevista_devolucao: 'asc' },
        });
    }
    async extend(id, dto) {
        const rental = await this.prisma.aluguel.findUnique({ where: { id } });
        if (!rental)
            throw new common_1.NotFoundException('Aluguel não encontrado.');
        if (rental.status !== client_1.StatusAluguel.ATIVO &&
            rental.status !== client_1.StatusAluguel.ATRASADO) {
            throw new common_1.BadRequestException('Somente aluguéis não devolvidos podem ser prorrogados.');
        }
        const extendedDate = this.addDays(new Date(rental.data_prevista_devolucao), dto.dias);
        const contractedTotal = rental.valor_total ??
            new client_1.Prisma.Decimal(rental.valor_diaria)
                .mul(rental.quantidade)
                .mul(this.rentalDays(rental.data_aluguel, rental.data_prevista_devolucao));
        return this.prisma.aluguel.update({
            where: { id },
            data: {
                data_prevista_devolucao: extendedDate,
                valor_total: contractedTotal.add(new client_1.Prisma.Decimal(rental.valor_diaria).mul(rental.quantidade).mul(dto.dias)),
                status: client_1.StatusAluguel.ATIVO,
            },
            include: rentalDetails,
        });
    }
    async remove(id) {
        return this.prisma.$transaction(async (tx) => {
            const rental = await tx.aluguel.findUnique({ where: { id } });
            if (!rental)
                throw new common_1.NotFoundException('Aluguel não encontrado.');
            if (rental.status === client_1.StatusAluguel.ATIVO || rental.status === client_1.StatusAluguel.ATRASADO) {
                await tx.jogo.update({
                    where: { id: rental.id_jogo },
                    data: { quantidade_disponivel: { increment: rental.quantidade } },
                });
            }
            try {
                return await tx.aluguel.delete({ where: { id } });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                    throw new common_1.BadRequestException('Não é possível remover um aluguel com pagamentos vinculados.');
                }
                throw error;
            }
        });
    }
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    startOfDay(date) {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    rentalDays(start, end) {
        return Math.max(1, Math.ceil((this.startOfDay(end).getTime() - this.startOfDay(start).getTime()) /
            86_400_000));
    }
};
exports.RentalsService = RentalsService;
exports.RentalsService = RentalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RentalsService);
//# sourceMappingURL=rentals.service.js.map