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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoriesDto } from './dto/list-categories.dto';
import { ListCategoryGamesDto } from './dto/list-category-games.dto';

@ApiTags('Categorias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar categoria' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  findAll(@Query() query: ListCategoriesDto) {
    return this.categories.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da categoria' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categories.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar categoria' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(id, dto);
  }

  @Post('games')
  @ApiOperation({ summary: 'Associar jogo a categoria' })
  linkGame(@Body() dto: LinkCategoryGameDto) {
    return this.categories.linkGame(dto);
  }

  @Delete('games')
  @ApiOperation({ summary: 'Remover associação de jogo e categoria' })
  unlinkGame(@Body() dto: LinkCategoryGameDto) {
    return this.categories.unlikGame(dto);
  }

  @Get(':id/games')
  @ApiOperation({ summary: 'Listar jogos da categoria' })
  findGames(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListCategoryGamesDto,
  ) {
    return this.categories.findGames(id, query);
  }

  @Get(':id/games/available')
  @ApiOperation({ summary: 'Listar jogos disponíveis da categoria' })
  findAvailableGames(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListCategoryGamesDto,
  ) {
    return this.categories.findAvailableGames(id, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir categoria' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categories.remove(id);
  }
}