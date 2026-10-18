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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';
import { RentalsService } from './rentals.service';

@ApiTags('Aluguéis')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentals: RentalsService) {}

  @ApiOperation({ summary: 'Criar aluguel' })
  @ApiResponse({ status: 201, description: 'Aluguel registrado e estoque atualizado.' })
  @Post()
  create(@Body() dto: CreateRentalDto) {
    return this.rentals.create(dto);
  }

  @ApiOperation({ summary: 'Listar aluguéis' })
  @ApiResponse({ status: 200, description: 'Lista paginada de aluguéis.' })
  @Get()
  findAll(@Query() query: ListRentalsDto) {
    return this.rentals.findAll(query);
  }

  @ApiOperation({ summary: 'Listar aluguéis ativos' })
  @Get('active')
  findActive() {
    return this.rentals.findActive();
  }

  @ApiOperation({ summary: 'Listar aluguéis em atraso' })
  @Get('overdue')
  findOverdue() {
    return this.rentals.findOverdue();
  }

  @ApiOperation({ summary: 'Buscar histórico por usuário' })
  @ApiParam({ name: 'userId', description: 'ID numérico do usuário', type: Number })
  @ApiResponse({ status: 200, description: 'Histórico de locações do usuário.' })
  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.rentals.findByUser(userId);
  }

  @ApiOperation({ summary: 'Buscar aluguel por ID' })
  @ApiParam({ name: 'id', description: 'ID numérico do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Detalhes do aluguel.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.findOne(id);
  }

  @ApiOperation({ summary: 'Registrar devolução' })
  @ApiParam({ name: 'id', description: 'ID numérico do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Devolução registrada no sistema.' })
  @Patch(':id/return')
  returnRental(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.returnRental(id);
  }

  @ApiOperation({ summary: 'Cancelar aluguel' })
  @ApiParam({ name: 'id', description: 'ID numérico do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Aluguel cancelado e item devolvido ao estoque.' })
  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.cancel(id);
  }

  @ApiOperation({ summary: 'Prorrogar devolução' })
  @ApiParam({ name: 'id', description: 'ID numérico do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Prazo estendido com sucesso.' })
  @Patch(':id/extend')
  extend(@Param('id', ParseIntPipe) id: number, @Body() dto: ExtendRentalDto) {
    return this.rentals.extend(id, dto);
  }

  @ApiOperation({ summary: 'Excluir registro de aluguel' })
  @ApiParam({ name: 'id', description: 'ID numérico do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Registro apagado permanentemente.' })
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.remove(id);
  }
}