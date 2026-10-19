import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoriesDto } from './dto/list-categories.dto';
import { ListCategoryGamesDto } from './dto/list-category-games.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { CategoriesService } from './categories.service';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categories: CategoriesService) {}

    @Post()
    @ApiBody({ type: CreateCategoryDto })
    @ApiOperation({ summary: 'Criar categoria' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categories.create(dto);
    }

    @ApiOperation({ summary: 'Listar categorias' })
    @ApiResponse({ status: 200, description: 'Lista paginada de categorias' })
    @UseInterceptors(CacheInterceptor)
    @Get()
    findAll(@Query() query: ListCategoriesDto) {
        return this.categories.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca categoria pelo id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categories.findOne(id);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateCategoryDto })
    @ApiOperation({ summary: 'Atualizar categoria' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryDto,
    ) {
        return this.categories.update(id, dto);
    }

    @Post('games')
    @ApiBody({ type: LinkCategoryGameDto })
    @ApiOperation({ summary: 'Associar jogo a categoria' })
    addGame(@Body() dto: LinkCategoryGameDto) {
        return this.categories.linkGame(dto);
    }

    @Delete('games')
    @ApiBody({ type: LinkCategoryGameDto })
    @ApiOperation({ summary: 'Remover jogo de categoria' })
    removeGame(@Body() dto: LinkCategoryGameDto) {
        return this.categories.unlikGame(dto);
    }

    @Get(':id/games')
    @ApiOperation({ summary: 'Listar jogos de uma categoria' })
    findGames(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: ListCategoryGamesDto,
    ) {
        return this.categories.findGames(id, query);
    }

    @Get(':id/games/available')
    @ApiOperation({ summary: 'Listar jogos disponíveis de uma categoria' })
    findAvailableGames(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: ListCategoryGamesDto,
    ) {
        return this.categories.findAvailableGames(id, query);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover categoria' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categories.remove(id);
    }
}