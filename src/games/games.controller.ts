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
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  /** Cadastra um jogo e inicia o estoque com todas as unidades disponíveis. */
  @Post()
  create(@Body() dto: CreateGameDto) {
    return this.games.create(dto);
  }

  /** Lista todos os jogos cadastrados. */
  @Get()
  findAll() {
    return this.games.findAll();
  }

  /** Lista jogos ativos que ainda têm unidades disponíveis para aluguel. */
  @Get('available')
  findAvailable() {
    return this.games.findAvailable();
  }

  /** Retorna os aluguéis associados ao jogo. */
  @Get(':id/rentals')
  findRentals(@Param('id', ParseIntPipe) id: number) {
    return this.games.findRentals(id);
  }

  /** Busca um jogo pelo identificador. */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.games.findOne(id);
  }

  /** Atualiza os dados enviados e mantém o estoque alugado reservado. */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.games.update(id, dto);
  }

  /** Desativa o jogo sem apagar seu histórico. */
  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.games.deactivate(id);
  }

  /** Reativa um jogo previamente desativado. */
  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.games.activate(id);
  }

  /** Exclui um jogo que não possua histórico de aluguéis. */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.games.remove(id);
  }

  //Busca um jogo pela categoria
  @Get(':id/categories')
  findCategories(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.games.findCategories(id);
  }
}
