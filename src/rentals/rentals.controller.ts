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
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';
import { RentalsService } from './rentals.service';

@ApiTags('Aluguéis')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentals: RentalsService) {}

  @ApiOperation({ summary: 'Criar um novo aluguel' })
  @ApiBody({ type: CreateRentalDto })
  @ApiResponse({
    status: 201,
    description: 'Aluguel registrado e estoque do jogo atualizado.',
  })
  @Post()
  create(@Body() dto: CreateRentalDto) {
    return this.rentals.create(dto);
  }

  @ApiOperation({ summary: 'Listar todos os aluguéis' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada com os aluguéis do sistema.',
  })
  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Query() query: ListRentalsDto) {
    return this.rentals.findAll(query);
  }

  @ApiOperation({ summary: 'Listar apenas aluguéis ativos' })
  @UseInterceptors(CacheInterceptor)
  @Get('active')
  findActive() {
    return this.rentals.findActive();
  }

  @ApiOperation({ summary: 'Listar aluguéis atrasados' })
  @Get('overdue')
  findOverdue() {
    return this.rentals.findOverdue();
  }

  @ApiOperation({ summary: 'Ver histórico de um usuário específico' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Histórico completo de locações do usuário.',
  })
  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.rentals.findByUser(userId);
  }

  @ApiOperation({ summary: 'Buscar detalhes de um aluguel pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Dados detalhados do aluguel.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.findOne(id);
  }

  @ApiOperation({ summary: 'Registrar a devolução de um jogo' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Devolução concluída com sucesso.' })
  @Patch(':id/return')
  returnRental(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.returnRental(id);
  }

  @ApiOperation({ summary: 'Cancelar um aluguel em andamento' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Aluguel cancelado e jogo devolvido ao estoque.',
  })
  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.cancel(id);
  }

  @ApiOperation({ summary: 'Prorrogar a data de devolução' })
  @ApiBody({ type: ExtendRentalDto })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Data de devolução estendida.' })
  @Patch(':id/extend')
  extend(@Param('id', ParseIntPipe) id: number, @Body() dto: ExtendRentalDto) {
    return this.rentals.extend(id, dto);
  }

  @ApiOperation({ summary: 'Apagar registro de aluguel do banco' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Registro apagado permanentemente.',
  })
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.remove(id);
  }
}
