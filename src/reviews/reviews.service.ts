import { 
    ConflictException,
    Injectable,
    NotFoundException,
 } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(dto: CreateReviewDto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                id: dto.id_usuario,
            },
        });

        if(!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const jogo = await this.prisma.jogo.findUnique({
            where: {
                id: dto.id_jogo,
            },
        });

        if(!jogo) {
            throw new NotFoundException('jogo não encontrado');
        }

        const avaliacaoExistente = await this.prisma.avaliacao.findFirst({
            where: {
                id_usuario: dto.id_usuario,
                id_jogo: dto.id_jogo,
            },
        });

        if(avaliacaoExistente) {
            throw new ConflictException('Este usuário já avaliou esse jogo');
        }

        return this.prisma.avaliacao.create({
            data: {
                id_usuario: dto.id_usuario,
                id_jogo: dto.id_jogo,
                nota: dto.nota,
                comentario: dto.comentario,
            }, include: {
                usuario: true,
                jogo: true,
            },
        });
    }

    findAll() {
        return this.prisma.avaliacao.findMany({
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
        });
    }

    async findOne(id: number) {
        const avaliacao = await this.prisma.avaliacao.findUnique({
            where: { id },
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

        if(!avaliacao) {
            throw new NotFoundException('avaliação não encontrada');
        }

        return avaliacao;
    }

    async update(id: number, dto: UpdateReviewDto) {
        await this.findOne(id);

        return this.prisma.avaliacao.update({
            where: { id, },
            data: {
                ...(dto.nota !== undefined && {nota: dto.nota,
                }),
                ...(dto.comentario !== undefined && {comentario: dto. comentario,}),
            },
            include: {
                usuario: true,
                jogo: true,
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.avaliacao.delete({
            where: { id, },
        });
    }
}