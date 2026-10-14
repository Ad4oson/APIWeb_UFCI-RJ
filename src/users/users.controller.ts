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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /** Cadastra um usuário com e-mail válido e senha protegida por hash. */
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  /** Lista os usuários sem expor suas senhas. */
  @Get()
  findAll() {
    return this.users.findAll();
  }

  /** Lista somente usuários ativos. */
  @Get('active')
  findActive() {
    return this.users.findActive();
  }

  /** Retorna os aluguéis associados ao usuário. */
  @Get(':id/rentals')
  findRentals(@Param('id', ParseIntPipe) id: number) {
    return this.users.findRentals(id);
  }

  /** Busca um usuário pelo identificador. */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne(id);
  }

  /** Atualiza os dados enviados; a senha nunca é devolvida pela API. */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  /** Desativa um usuário que não tenha aluguéis em andamento. */
  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.users.deactivate(id);
  }

  /** Reativa um usuário previamente desativado. */
  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.users.activate(id);
  }

  /** Exclui um usuário somente quando não há aluguéis vinculados. */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}
