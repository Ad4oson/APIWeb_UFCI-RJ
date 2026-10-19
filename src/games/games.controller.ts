import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';
import { Query } from '@nestjs/common';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';

@ApiTags('Jogos')
@Controller('games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  /** Cadastra um jogo e inicia o estoque com todas as unidades disponíveis. */
  @Post()
  @ApiOperation({ summary: 'Criar jogo'})
  @ApiBody({ type: CreateGameDto})
  create(@Body() dto: CreateGameDto) {
    return this.games.create(dto);
  }

  /** Lista todos os jogos cadastrados. */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar jogos'})
  findAll() {
    return this.games.findAll();
  }

  /** Lista jogos ativos que ainda têm unidades disponíveis para aluguel. */
  @Get('available')
  @ApiOperation({ summary: 'Listar jogos ativos'})
  @UseInterceptors(CacheInterceptor)
  findAvailable() {
    return this.games.findAvailable();
  }

  /** Retorna os aluguéis associados ao jogo. */
  @Get(':id/rentals')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar aluguéis associados ao jogo'})
  findRentals(@Param('id', ParseIntPipe) id: number) {
    return this.games.findRentals(id);
  }

  /** Busca um jogo pelo identificador. */
  @Get(':id')
  @ApiOperation({summary :'Busca por Id'})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.games.findOne(id);
  }

  /** Atualiza os dados enviados e mantém o estoque alugado reservado. */
  @Patch(':id')
  @ApiOperation({summary :'Atualizar jogo'})
  @ApiBody ({type: UpdateGameDto})
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.games.update(id, dto);
  }

  /** Desativa o jogo sem apagar seu histórico. */
  @Patch(':id/deactivate')
  @ApiOperation({summary :'Desativa jogo'})
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.games.deactivate(id);
  }

  /** Reativa um jogo previamente desativado. */
  @Patch(':id/activate')
  @ApiOperation({summary :'Reativa jogo'})
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.games.activate(id);
  }

  /** Exclui um jogo que não possua histórico de aluguéis. */
  @Delete(':id')
  @ApiOperation({summary :'Deleta jogo'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.games.remove(id);
  }

  //Busca um jogo pela categoria
  @Get(':id/categories')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar  categorias do jogo'})
  findCategories(@Param('id', ParseIntPipe) id: number) {
    return this.games.findCategories(id);
  }

  @Get(':id/reviews')
  findReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListGameReviewsDto,
  ) {
    return this.games.findReviews(id, query);
  }

  @Get(':id/reviews/stats')
  findReviewStats(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListGameReviewsDto,
  ) {
    return this.games.findReviewStats(id, query);
  }
  
  /** Exclui um jogo que não possua histórico de aluguéis. */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.games.remove(id);
  }
}
