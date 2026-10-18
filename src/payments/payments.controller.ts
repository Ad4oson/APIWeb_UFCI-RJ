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
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Pagamentos')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @ApiOperation({ summary: 'Criar pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento gerado com sucesso.' })
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.payments.create(dto);
  }

  @ApiOperation({ summary: 'Listar pagamentos' })
  @ApiResponse({ status: 200, description: 'Lista paginada de transações.' })
  @Get()
  findAll(@Query() query: ListPaymentsDto) {
    return this.payments.findAll(query);
  }

  @ApiOperation({ summary: 'Listar pagamentos pendentes' })
  @Get('pending')
  findPending() {
    return this.payments.findPending();
  }

  @ApiOperation({ summary: 'Relatório financeiro' })
  @Get('report/summary')
  summary(@Query() query: ListPaymentsDto) {
    return this.payments.summary(query);
  }

  @ApiOperation({ summary: 'Buscar pagamentos por aluguel' })
  @ApiParam({ name: 'rentalId', description: 'ID numérico do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Faturas vinculadas ao aluguel.' })
  @Get('rental/:rentalId')
  findByRental(@Param('rentalId', ParseIntPipe) rentalId: number) {
    return this.payments.findByRental(rentalId);
  }

  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiParam({ name: 'id', description: 'ID numérico do pagamento', type: Number })
  @ApiResponse({ status: 200, description: 'Detalhes da transação.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payments.findOne(id);
  }

  @ApiOperation({ summary: 'Calcular multa de atraso' })
  @ApiParam({ name: 'rentalId', description: 'ID numérico do aluguel', type: Number })
  @ApiResponse({ status: 201, description: 'Cálculo de multa gerado.' })
  @Post('calculate-fine/:rentalId')
  calculateFine(@Param('rentalId', ParseIntPipe) rentalId: number) {
    return this.payments.calculateFine(rentalId);
  }

  @ApiOperation({ summary: 'Confirmar compensação' })
  @ApiParam({ name: 'id', description: 'ID numérico do pagamento', type: Number })
  @ApiResponse({ status: 200, description: 'Transação confirmada.' })
  @Patch(':id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.payments.confirm(id);
  }

  @ApiOperation({ summary: 'Solicitar estorno' })
  @ApiParam({ name: 'id', description: 'ID numérico do pagamento', type: Number })
  @ApiResponse({ status: 200, description: 'Estorno processado.' })
  @Patch(':id/refund')
  refund(@Param('id', ParseIntPipe) id: number) {
    return this.payments.refund(id);
  }

  @ApiOperation({ summary: 'Excluir registro de pagamento' })
  @ApiParam({ name: 'id', description: 'ID numérico do pagamento', type: Number })
  @ApiResponse({ status: 200, description: 'Registro apagado permanentemente.' })
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.payments.remove(id);
  }
}