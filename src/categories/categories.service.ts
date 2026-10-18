import { 
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

    constructor(private readonly repository: CategoriesRepository) {}

    async create(dto: CreateCategoryDto) {

        const checkNome = await this.repository.buscarPorNome(dto.nome);
        if (checkNome) {
            throw new ConflictException('Já existe uma categoria com esse nome');
        }
        
        return this.repository.criar(dto);
    }

    findAll() {
        return this.repository.buscarTodas();
    }

    async findOne(id: number) {
        const categoria = await this.repository.buscarPorId(id);

        if (!categoria) {
            throw new NotFoundException('Categoria não encontrada');
        }

        return categoria;
    }

    async update(id: number, dto: UpdateCategoryDto) {
        await this.findOne(id);

        // se mandou nome no body, checa se não vai dar conflito
        if (dto.nome) {
            const checkNome = await this.repository.buscarPorNome(dto.nome);
            if (checkNome && checkNome.id !== id) {
                throw new ConflictException('Já existe uma categoria com esse nome');
            }
        }

        return this.repository.atualizar(id, dto);
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.repository.deletar(id);
    }

    async linkGame(dto: LinkCategoryGameDto) {
        await this.findOne(dto.id_categoria);

        const jogo = await this.repository.buscarJogo(dto.id_jogo);
        if (!jogo) {
            throw new NotFoundException('Jogo não encontrado');
        }

        const jaExiste = await this.repository.buscarRelacao(dto.id_categoria, dto.id_jogo);
        if (jaExiste) {
            throw new ConflictException('Esta associação já existe');
        }

        return this.repository.linkarJogo(dto);
    }

    async unlikGame(dto: LinkCategoryGameDto) {
        // removendo a relacao
        return this.repository.deslinkarJogo(dto.id_categoria, dto.id_jogo);
    }

    async findGames(id: number) {
        await this.findOne(id);
        return this.repository.listarJogosDaCategoria(id);
    }

    async findAvailableGames(id: number) {
        await this.findOne(id);
        return this.repository.listarJogosDaCategoria(id, true);
    }
}