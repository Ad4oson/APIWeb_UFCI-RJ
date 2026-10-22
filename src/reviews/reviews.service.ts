import { 
    ConflictException,
    Injectable,
    NotFoundException,
 } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly repository: ReviewsRepository,
    ) {}

    async create(dto: CreateReviewDto) {
        const usuario = await this.repository.buscarUsuario(dto.id_usuario);

        if(!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const jogo = await this.repository.buscarJogo(dto.id_jogo);

        if(!jogo) {
            throw new NotFoundException('Jogo não encontrado');
        }

        const avaliacaoExistente = await this.repository.buscarAvaliacaoUsuarioJogo(dto.id_usuario, dto.id_jogo);

        if(avaliacaoExistente) {
            throw new ConflictException('Este usuário já avaliou esse jogo');
        }

       return this.repository.criar(dto);
    }

    async findAll(query: ListReviewsDto) {
        return this.repository.listar(query);
    }

    async findOne(id: number) {
        const avaliacao = await this.repository.buscarPorId(id);

        if(!avaliacao) {
            throw new NotFoundException('Avaliação não encontrada');
        }

        return avaliacao;
    }

    async update(id: number, dto: UpdateReviewDto) {
        await this.findOne(id);

        return this.repository.atualizar(id, dto);
    }

    async remove(id: number) {
        await this.findOne(id);

       return this.repository.deletar(id);
    }
}