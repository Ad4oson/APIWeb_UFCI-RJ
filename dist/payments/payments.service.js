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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const paymentDetails = {
    aluguel: {
        include: {
            usuario: { select: { id: true, nome: true, email: true } },
            jogo: true,
        },
    },
};
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.$transaction(async (tx) => {
            const rental = await tx.aluguel.findUnique({ where: { id: dto.id_aluguel } });
            if (!rental)
                throw new common_1.NotFoundException('Aluguel não encontrado.');
            if (rental.status === 'CANCELADO') {
                throw new common_1.BadRequestException('Não é possível pagar um aluguel cancelado.');
            }
            const paidOrPending = await tx.pagamento.aggregate({
                where: {
                    id_aluguel: dto.id_aluguel,
                    status: { in: [client_1.StatusPagamento.PENDENTE, client_1.StatusPagamento.PAGO] },
                },
                _sum: { valor: true },
            });
            const rentalDays = Math.max(1, Math.ceil((this.startOfDay(rental.data_prevista_devolucao).getTime() -
                this.startOfDay(rental.data_aluguel).getTime()) /
                86_400_000));
            const rentalValue = rental.valor_total ??
                rental.valor_diaria.mul(rental.quantidade).mul(rentalDays);
            const balance = rentalValue.sub(paidOrPending._sum.valor ?? 0);
            if (new client_1.Prisma.Decimal(dto.valor).greaterThan(balance)) {
                throw new common_1.BadRequestException('O pagamento excede o saldo do aluguel.');
            }
            return tx.pagamento.create({
                data: {
                    id_aluguel: dto.id_aluguel,
                    valor: new client_1.Prisma.Decimal(dto.valor),
                    forma_pagamento: dto.forma_pagamento,
                },
                include: paymentDetails,
            });
        });
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 20, 100);
        const dateFilter = {};
        if (query.startDate)
            dateFilter.gte = this.dateBoundary(query.startDate, false);
        if (query.endDate)
            dateFilter.lte = this.dateBoundary(query.endDate, true);
        if (query.startDate && query.endDate && dateFilter.gte > dateFilter.lte) {
            throw new common_1.BadRequestException('startDate deve ser anterior ou igual a endDate.');
        }
        const where = query.startDate || query.endDate ? { data_pagamento: dateFilter } : {};
        const [data, total] = await this.prisma.$transaction([
            this.prisma.pagamento.findMany({
                where,
                include: paymentDetails,
                orderBy: { data_pagamento: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.pagamento.count({ where }),
        ]);
        return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const payment = await this.prisma.pagamento.findUnique({
            where: { id },
            include: paymentDetails,
        });
        if (!payment)
            throw new common_1.NotFoundException('Pagamento não encontrado.');
        return payment;
    }
    async findByRental(rentalId) {
        const rental = await this.prisma.aluguel.findUnique({ where: { id: rentalId } });
        if (!rental)
            throw new common_1.NotFoundException('Aluguel não encontrado.');
        const payments = await this.prisma.pagamento.findMany({
            where: { id_aluguel: rentalId },
            include: paymentDetails,
            orderBy: { data_pagamento: 'desc' },
        });
        const totalPago = payments
            .filter((payment) => payment.status === client_1.StatusPagamento.PAGO)
            .reduce((sum, payment) => sum.add(payment.valor), new client_1.Prisma.Decimal(0));
        const totalPendente = payments
            .filter((payment) => payment.status === client_1.StatusPagamento.PENDENTE)
            .reduce((sum, payment) => sum.add(payment.valor), new client_1.Prisma.Decimal(0));
        return { aluguel: rental, pagamentos: payments, total_pago: totalPago, total_pendente: totalPendente };
    }
    async confirm(id) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.pagamento.findUnique({ where: { id } });
            if (!payment)
                throw new common_1.NotFoundException('Pagamento não encontrado.');
            if (payment.status !== client_1.StatusPagamento.PENDENTE) {
                throw new common_1.BadRequestException('Somente pagamentos pendentes podem ser confirmados.');
            }
            return tx.pagamento.update({
                where: { id },
                data: { status: client_1.StatusPagamento.PAGO },
                include: paymentDetails,
            });
        });
    }
    async refund(id) {
        const payment = await this.prisma.pagamento.findUnique({ where: { id } });
        if (!payment)
            throw new common_1.NotFoundException('Pagamento não encontrado.');
        if (payment.status !== client_1.StatusPagamento.PAGO) {
            throw new common_1.BadRequestException('Somente pagamentos realizados podem ser estornados.');
        }
        return this.prisma.pagamento.update({
            where: { id },
            data: { status: client_1.StatusPagamento.ESTORNADO },
            include: paymentDetails,
        });
    }
    findPending() {
        return this.prisma.pagamento.findMany({
            where: { status: client_1.StatusPagamento.PENDENTE },
            include: paymentDetails,
            orderBy: { data_pagamento: 'asc' },
        });
    }
    async calculateFine(rentalId) {
        const rental = await this.prisma.aluguel.findUnique({ where: { id: rentalId } });
        if (!rental)
            throw new common_1.NotFoundException('Aluguel não encontrado.');
        const today = new Date();
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        const dueDate = new Date(rental.data_prevista_devolucao);
        dueDate.setHours(0, 0, 0, 0);
        const lateDays = Math.max(0, Math.ceil((todayStart.getTime() - dueDate.getTime()) / 86_400_000));
        const fine = new client_1.Prisma.Decimal(rental.valor_diaria)
            .mul(lateDays)
            .mul(rental.quantidade);
        return {
            rentalId,
            dias_atraso: lateDays,
            multa: fine,
            data_prevista_devolucao: rental.data_prevista_devolucao,
        };
    }
    async summary(query) {
        const start = query.startDate
            ? this.dateBoundary(query.startDate, false)
            : new Date(0);
        const end = query.endDate
            ? this.dateBoundary(query.endDate, true)
            : new Date();
        if (start > end) {
            throw new common_1.BadRequestException('startDate deve ser anterior ou igual a endDate.');
        }
        const where = {
            status: client_1.StatusPagamento.PAGO,
            data_pagamento: { gte: start, lte: end },
        };
        const [aggregate, count, byStatus] = await Promise.all([
            this.prisma.pagamento.aggregate({ where, _sum: { valor: true } }),
            this.prisma.pagamento.count({ where }),
            this.prisma.pagamento.groupBy({
                by: ['status'],
                where: { data_pagamento: { gte: start, lte: end } },
                _count: { _all: true },
                _sum: { valor: true },
            }),
        ]);
        return {
            periodo: { inicio: start, fim: end },
            total_arrecadado: aggregate._sum.valor ?? new client_1.Prisma.Decimal(0),
            quantidade_pagamentos_compensados: count,
            por_status: byStatus,
        };
    }
    async remove(id) {
        const payment = await this.prisma.pagamento.findUnique({ where: { id } });
        if (!payment)
            throw new common_1.NotFoundException('Pagamento não encontrado.');
        if (payment.status !== client_1.StatusPagamento.PENDENTE &&
            payment.status !== client_1.StatusPagamento.CANCELADO) {
            throw new common_1.BadRequestException('Somente pagamentos pendentes ou cancelados podem ser excluídos.');
        }
        return this.prisma.pagamento.delete({ where: { id } });
    }
    startOfDay(date) {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    dateBoundary(value, endOfDay) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
        }
        return new Date(value);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map