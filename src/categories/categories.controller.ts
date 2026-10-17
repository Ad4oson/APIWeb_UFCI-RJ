import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categories: CategoriesService,
    ) {}

    //Cria uma categoria de jogos
    @Post()
    create(
        @Body() dto: CreateCategoryDto,) {
        return this.categories.create(dto);
    }
    
    //Lista todas as categorias cadastradas
    @Get()
    findAll() {
         return this.categories.findAll();
        }

    //Busca uma categoria pelo identificador
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categories.findOne(id);
    }

    //Atualiza os dados da categoria
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        dto: UpdateCategoryDto,
    ) {
        return this.categories.update(id, dto);
    }
    
    //Associa uma categoria a um jogo
    @Post('games')
    linkGame(
        @Body()
        dto: LinkCategoryGameDto,
    ) {
        return this.categories.linkGame(dto);
    }

    //Remove a associação entre categoria e jogos
    @Delete('games')
    unlikGame(
        @Body()
        dto: LinkCategoryGameDto,
    ) {
        return this.categories.unlikGame(dto);
    }

    //Lista jogos pertencentes a uma categoria
    @Get(':id/games')
    findGames(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categories.findGames(id);
    }

    //Lista apenas jogos disponivéis da categoria específica
    @Get(':id/games/available')
    findAvailableGames(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categories.findAvailableGames(id);
    }

    //Remove uma categoria
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categories.remove(id);
    }

}
