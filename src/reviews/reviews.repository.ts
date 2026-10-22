import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service'
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ListReviewsDto } from "./dto/list-reviews.dto";

@Injectable()
export class ReviewsRepository {
    constructor( private readonly prisma: PrismaService) {}

    async buscarUsuario(id: number) {
        return this.prisma.usuario.findUnique({
            where: {id},
        });
    }

    async buscarJogo(id: number) {
        return this.prisma.jogo.findUnique({
            where: {id},
        });
    }

    async buscarAvaliacaoUsuarioJogo(
        id_usuario: number,
        id_jogo: number,
    ) {
        return this.prisma.avaliacao.findFirst({
            where: {
                id_usuario,
                id_jogo,
            },
        });
    }

    async criar(dto: CreateReviewDto) {
        return this.prisma.avaliacao.create({
            data: {
                id_usuario: dto.id_usuario,
                id_jogo: dto.id_jogo,
                nota: dto.nota,
                comentario: dto.comentario,
            },
            include: {
                usuario: true,
                jogo: true,
            },
        });
    }

    async listar(query: ListReviewsDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const where: any = {};

        if(query.id_jogo) {
            where.id_jogo = query.id_jogo;
        }

        if(query.nota) {
            where.nota = query.nota;
        }

        const data = await this.prisma.avaliacao.findMany({
            where,
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                jogo: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
            orderBy: {
                data_avaliacao: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const total = await this.prisma.avaliacao.count({
            where,
        });

        return {
            data,
            meta: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async buscarPorId(id: number) {
        return this.prisma.avaliacao.findUnique({
            where: {id},
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                jogo: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });
    }

    async atualizar(id: number, dto: UpdateReviewDto) {
        return this.prisma.avaliacao.update({
            where: {id},
            data: {
                ...(dto.nota !== undefined && {nota: dto.nota,}),
                ...(dto.comentario !== undefined && {comentario: dto.comentario,}),
            },
            include: {
                usuario: true,
                jogo: true,
            },
        });
    }

    async deletar(id: number) {
        return this.prisma.avaliacao.delete({
            where: {id},
        });
    }
}