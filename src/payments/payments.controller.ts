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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentsService } from './payments.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pagamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um pagamento para um aluguel próprio' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Pagamento criado.' })
  create(
    @Body() dto: CreatePaymentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.create(dto, request.user);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar pagamentos com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de pagamentos.' })
  findAll(
    @Query() query: ListPaymentsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.findAll(query, request.user);
  }

  @Get('pending')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Listar pagamentos pendentes com filtros e paginação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de pagamentos pendentes.',
  })
  findPending(
    @Query() query: ListPaymentsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.findPending(query, request.user);
  }

  @Get('report/summary')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Consultar relatório financeiro' })
  @ApiResponse({ status: 200, description: 'Resumo financeiro do período.' })
  summary(
    @Query() query: ListPaymentsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.summary(query, request.user);
  }

  @Get('rental/:rentalId')
  @ApiOperation({ summary: 'Listar pagamentos de um aluguel' })
  @ApiParam({
    name: 'rentalId',
    description: 'ID numérico do aluguel',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de pagamentos do aluguel.',
  })
  findByRental(
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Query() query: ListPaymentsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.findByRental(rentalId, query, request.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID numérico do pagamento',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Detalhes do pagamento.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.findOne(id, request.user);
  }

  @Post('calculate-fine/:rentalId')
  @ApiOperation({ summary: 'Calcular multa de atraso de aluguel próprio' })
  @ApiParam({
    name: 'rentalId',
    description: 'ID numérico do aluguel',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Cálculo da multa.' })
  calculateFine(
    @Param('rentalId', ParseIntPipe) rentalId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.calculateFine(rentalId, request.user);
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Confirmar pagamento como administrador' })
  @ApiParam({
    name: 'id',
    description: 'ID numérico do pagamento',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Pagamento confirmado.' })
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.confirm(id, request.user);
  }

  @Patch(':id/refund')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Estornar pagamento como administrador' })
  @ApiParam({
    name: 'id',
    description: 'ID numérico do pagamento',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Pagamento estornado.' })
  refund(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.payments.refund(id, request.user);
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.payments.remove(id);
  }
}