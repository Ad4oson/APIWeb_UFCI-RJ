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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ListGamesDto } from './dto/list-games.dto';
import { GamesService } from './games.service';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';

@ApiTags('Jogos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar jogo' })
  @ApiBody({ type: CreateGameDto })
  create(@Body() dto: CreateGameDto) {
    return this.games.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar jogos' })
  findAll(@Query() query: ListGamesDto) {
    return this.games.findAll(query);
  }

  @Get('available')
  @ApiOperation({ summary: 'Listar jogos disponíveis' })
  findAvailable(@Query() query: ListGamesDto) {
    return this.games.findAvailable(query);
  }

  @Get(':id/rentals')
  @ApiOperation({ summary: 'Listar aluguéis de um jogo' })
  findRentals(@Param('id', ParseIntPipe) id: number) {
    return this.games.findRentals(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar jogo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.games.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar jogo' })
  @ApiBody({ type: UpdateGameDto })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGameDto,
  ) {
    return this.games.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativar jogo' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.games.deactivate(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Ativar jogo' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.games.activate(id);
  }

  @Get(':id/categories')
  @ApiOperation({ summary: 'Listar categorias de um jogo' })
  findCategories(@Param('id', ParseIntPipe) id: number) {
    return this.games.findCategories(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Listar avaliações de um jogo' })
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
  @ApiOperation({ summary: 'Excluir jogo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.games.remove(id);
  }
}