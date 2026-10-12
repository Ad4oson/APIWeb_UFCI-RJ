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
import { AdminGuard } from '../common/guards/admin.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.payments.create(dto);
  }

  @Get()
  findAll(@Query() query: ListPaymentsDto) {
    return this.payments.findAll(query);
  }

  @Get('pending')
  findPending() {
    return this.payments.findPending();
  }

  @Get('report/summary')
  summary(@Query() query: ListPaymentsDto) {
    return this.payments.summary(query);
  }

  @Get('rental/:rentalId')
  findByRental(@Param('rentalId', ParseIntPipe) rentalId: number) {
    return this.payments.findByRental(rentalId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payments.findOne(id);
  }

  @Post('calculate-fine/:rentalId')
  calculateFine(@Param('rentalId', ParseIntPipe) rentalId: number) {
    return this.payments.calculateFine(rentalId);
  }

  @Patch(':id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.payments.confirm(id);
  }

  @Patch(':id/refund')
  refund(@Param('id', ParseIntPipe) id: number) {
    return this.payments.refund(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.payments.remove(id);
  }
}