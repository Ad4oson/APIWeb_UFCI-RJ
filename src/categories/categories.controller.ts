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

  @ApiOperation({ summary: 'Listar categorias' })
  @ApiResponse({ status: 200, description: 'Lista paginada de categorias' })
  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Query() query: ListCategoriesDto) {
    return this.categories.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Encontra 1 categoria pelo id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categories.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOperation({ summary: 'Atualiza categoria' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(id, dto);
  }

  @Post('games')
  @ApiBody({ type: LinkCategoryGameDto })
  @ApiOperation({ summary: 'Associa categoria a um jogo' })
  linkGame(@Body() dto: LinkCategoryGameDto) {
    return this.categories.linkGame(dto);
  }

  @Delete('games')
  @ApiOperation({ summary: 'Remove associação de categoria e jogo' })
  @ApiBody({ type: LinkCategoryGameDto })
  unlikGame(@Body() dto: LinkCategoryGameDto) {
    return this.categories.unlikGame(dto);
  }

  @ApiOperation({ summary: 'Lista os jogos de uma categoria' })
  @ApiResponse({ status: 200, description: 'Lista paginada dos jogos associados à categoria' })
  @UseInterceptors(CacheInterceptor)
  @Get(':id/games')
  findGames(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListCategoryGamesDto,
  ) {
    return this.categories.findGames(id, query);
  }

  @ApiOperation({ summary: 'Lista apenas os jogos disponíveis da categoria' })
  @ApiResponse({ status: 200, description: 'Lista paginada de jogos disponíveis' })
  @UseInterceptors(CacheInterceptor)
  @Get(':id/games/available')
  findAvailableGames(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListCategoryGamesDto,
  ) {
    return this.categories.findAvailableGames(id, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove categoria' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categories.remove(id);
  }
}