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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Query } from '@nestjs/common';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /** Cadastra um usuário com e-mail válido e senha protegida por hash. */

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Cadastrar Usuário' })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  /** Lista os usuários sem expor suas senhas. */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar usuários' })
  findAll() {
    return this.users.findAll();
  }

  /** Lista somente usuários ativos. */
  @Get('active')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar usuários ativos' })
  findActive() {
    return this.users.findActive();
  }

  /** Retorna os aluguéis associados ao usuário. */

  @Get(':id/rentals')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Aluguéis associados ao usuário' })
  findRentals(@Param('id', ParseIntPipe) id: number) {
    return this.users.findRentals(id);
  }

  //Busca um usuário pelo review
  @Get(':id/reviews')
  findReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListGameReviewsDto,
  ) {
    return this.users.findReviews(id, query);
  }

  @Get(':id/reviews/stats')
  findReviewStats(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListGameReviewsDto,
  ) {
    return this.users.findReviewStats(id, query);
  }

  /** Busca um usuário pelo identificador. */
  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário pelo id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne(id);
  }

  /** Atualiza os dados enviados; a senha nunca é devolvida pela API. */
  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiOperation({ summary: 'Atualizar usuário' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  /** Desativa um usuário que não tenha aluguéis em andamento. */
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativa usuário' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.users.deactivate(id);
  }

  /** Reativa um usuário previamente desativado. */
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Reativa usuário' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.users.activate(id);
  }

  /** Exclui um usuário somente quando não há aluguéis vinculados. */
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta usuário' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}
