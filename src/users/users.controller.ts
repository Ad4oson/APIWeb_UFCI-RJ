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
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Query } from '@nestjs/common';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Cadastrar Usuário' })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar usuários com paginação e filtros' })
  findAll(@Query() query: ListUsersDto) {
    return this.users.findAll(query);
  }


  @Get('active')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Listar usuários ativos com paginação e filtro por nome',
  })
  findActive(@Query() query: ListUsersDto) {
    return this.users.findActive(query);
  }

  @Get(':id/rentals')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Aluguéis associados ao usuário' })
  findRentals(@Param('id', ParseIntPipe) id: number) {
    return this.users.findRentals(id);
  }


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

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário pelo id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiOperation({ summary: 'Atualizar usuário' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativa usuário' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.users.deactivate(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Reativa usuário' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.users.activate(id);
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}
