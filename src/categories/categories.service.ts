import { 
    ConflictException,
    Injectable,
    NotFoundException,
 } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateCategoryDto) {
        const categoriaExistente = await this.prisma.categoria.findUnique({
            where: {
                nome: dto.nome,
            },
        });

        if(categoriaExistente) {
            throw new ConflictException('Já existe uma categoria com esse nome');
        }
        return this.prisma.categoria.create({ data: dto });
    }

    findAll() {
        return this.prisma.categoria.findMany({
            orderBy: {
                nome: 'asc',
            },
        });
    }

    async findOne(id: number) {
        const categoria = await this.prisma.categoria.findUnique({
            where: { id },
        });

        if(!categoria) {
            throw new NotFoundException('Categoria não encontrada');
        }

        return categoria;
    }

    async update(id: number, dto: UpdateCategoryDto) {
        await this.findOne(id);

        if(dto.nome) {
            const categoriaExistente = await this.prisma.categoria.findUnique({
                where: { nome: dto.nome },
            });

            if(categoriaExistente && categoriaExistente.id !== id) {
                throw new ConflictException('Já existe uma categoria com esse nome');
            }
        }

        return this.prisma.categoria.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.categoria.delete({
            where: { id },
        });
    }

    async linkGame(dto: LinkCategoryGameDto) {
        await this.findOne(dto.id_categoria);

        const jogo = await this.prisma.jogo.findUnique({
            where: { id: dto.id_jogo },
        });

        if(!jogo) {
            throw new NotFoundException('Jogo não encontrado')
        };

        const relacao = await this.prisma.categoriaJogo.findUnique({
            where: {id_categoria_id_jogo: {
                id_categoria: dto.id_categoria,
                id_jogo: dto.id_jogo
            },
        },
        });

        if(relacao) {
            throw new  ConflictException('Esta associação já existe')
        };

        return this.prisma.categoriaJogo.create({data: dto});
    }

    async unlikGame(dto: LinkCategoryGameDto) {
        return this.prisma.categoriaJogo.delete({
            where: {
                id_categoria_id_jogo: {
                    id_categoria: dto.id_categoria,
                    id_jogo: dto.id_jogo,
                },
            },
        });
    }

    async findGames(id: number) {
        await this.findOne(id);

        return this.prisma.categoriaJogo.findMany({
            where: {
                id_categoria: id,
            },include: {
                jogo: true,
            },
        });
    }

    async findAvailableGames(id: number) {
        await this.findOne(id);

        return this.prisma.categoriaJogo.findMany({
            where: {
                id_categoria: id,
                jogo: { 
                    ativo: true,
                    quantidade_disponivel: { gt: 0, }
                },
            },include: {
                jogo: true,
            },
        });
    }

}