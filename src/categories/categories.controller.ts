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
import { Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListCategoriesDto } from './dto/list-categories.dto';
import { ListCategoryGamesDto } from './dto/list-category-games.dto';


@ApiTags('Categorias')
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
    @ApiOperation({
        summary: 'Listar categorias',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada de categorias',
    })
    @Get()
    findAll(
        @Query() query: ListCategoriesDto,
    ) {
        return this.categories.findAll(query);
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
    @ApiOperation({
        summary: 'Lista os jogos de uma categoria',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada dos jogos associados à categoria',
    })
    @Get(':id/games')
    findGames(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: ListCategoryGamesDto,
    ) {
        return this.categories.findGames(id, query);
    }

    //Lista apenas jogos disponivéis da categoria específica
    @ApiOperation({
        summary: 'Lista apenas os jogos disponíveis da categoria',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada de jogos disponíveis',
    })
    @Get(':id/games/available')
    findAvailableGames(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: ListCategoryGamesDto,
    ) {
        return this.categories.findAvailableGames(id, query);
    }

    //Remove uma categoria
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categories.remove(id);
    }

}
