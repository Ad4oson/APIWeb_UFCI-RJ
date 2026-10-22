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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListCategoriesDto } from './dto/list-categories.dto';
import { ListCategoryGamesDto } from './dto/list-category-games.dto';


@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma categoria de jogo' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

    //Busca uma categoria pelo identificador
    @ApiParam({
        name: 'id',
        description: 'ID da categoria',
        type: Number,
    })
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categories.findOne(id);
    }

    //Atualiza os dados da categoria
    @ApiParam({
        name: 'id',
        description: 'ID da categoria',
        type: Number,
    })
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryDto,
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
    @ApiParam({
        name: 'id',
        description: 'ID da categoria',
        type: Number,
    })
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
    @ApiParam({
        name: 'id',
        description: 'ID da categoria',
        type: Number,
    })
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
    @ApiParam({
        name: 'id',
        description: 'ID da categoria',
        type: Number,
    })
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.categories.remove(id);
    }
}
