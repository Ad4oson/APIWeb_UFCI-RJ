import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LinkCategoryGameDto } from './dto/link-category-game.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  //Cria uma categoria de jogos
  @Post()
  @ApiOperation({ summary: 'Cria uma categoria de jogo' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  //Lista todas as categorias cadastradas
  @Get()
  @ApiOperation({ summary: 'Lista todas categorias ' })
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.categories.findAll();
  }

  //Busca uma categoria pelo identificador
  @Get(':id')
  @ApiOperation({ summary: 'Encontra 1 categoria pelo id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categories.findOne(id);
  }

  //Atualiza os dados da categoria
  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOperation({ summary: 'Atualiza categoria' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: UpdateCategoryDto,
  ) {
    return this.categories.update(id, dto);
  }

  //Associa uma categoria a um jogo
  @Post('games')
  @ApiBody({ type: LinkCategoryGameDto })
  @ApiOperation({ summary: 'Associa categoria a um jogo' })
  linkGame(
    @Body()
    dto: LinkCategoryGameDto,
  ) {
    return this.categories.linkGame(dto);
  }

  //Remove a associação entre categoria e jogos
  @Delete('games')
  @ApiOperation({ summary: 'Remove associação de categoria e jogo' })
  @ApiBody({ type: LinkCategoryGameDto })
  unlikGame(
    @Body()
    dto: LinkCategoryGameDto,
  ) {
    return this.categories.unlikGame(dto);
  }

  //Lista jogos pertencentes a uma categoria
  @Get(':id/games')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar jogos de uma categoria' })
  findGames(@Param('id', ParseIntPipe) id: number) {
    return this.categories.findGames(id);
  }

  //Lista apenas jogos disponivéis da categoria específica
  @Get(':id/games/available')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar jogos disponíveis de uma categoria' })
  findAvailableGames(@Param('id', ParseIntPipe) id: number) {
    return this.categories.findAvailableGames(id);
  }

  //Remove uma categoria
  @Delete(':id')
  @ApiOperation({ summary: 'Remove categoria' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categories.remove(id);
  }
}
