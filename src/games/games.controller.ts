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
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';
import {
  ListGameCategoriesDto,
  ListGameRentalsDto,
  ListGamesDto,
} from './dto/list-games.dto';

@ApiTags('Jogos')
@Controller('games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar jogo' })
  @ApiBody({ type: CreateGameDto })
  create(@Body() dto: CreateGameDto) {
    return this.games.create(dto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar jogos' })
  findAll(@Query() query: ListGamesDto) {
    return this.games.findAll(query);
  }

  @Get('available')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar jogos disponíveis' })
  findAvailable(@Query() query: ListGamesDto) {
    return this.games.findAvailable(query);
  }

  @Get(':id/rentals')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar aluguéis associados ao jogo' })
  findRentals(@Param('id', ParseIntPipe) id: number) {
    return this.games.findRentals(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca por Id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.games.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar jogo' })
  @ApiBody({ type: UpdateGameDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.games.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativa jogo' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.games.deactivate(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Reativa jogo' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.games.activate(id);
  }

  //Busca um jogo pela categoria
  @Get(':id/categories')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar categorias do jogo' })
  findCategories(@Param('id', ParseIntPipe) id: number) {
    return this.games.findCategories(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Listar avaliações do jogo' })
  findReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListGameReviewsDto,
  ) {
    return this.games.findReviews(id, query);
  }

  @Get(':id/reviews/stats')
  @ApiOperation({ summary: 'Estatísticas de avaliações do jogo' })
  findReviewStats(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListGameReviewsDto,
  ) {
    return this.games.findReviewStats(id, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta jogo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.games.remove(id);
  }
}