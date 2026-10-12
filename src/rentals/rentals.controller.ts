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
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';
import { RentalsService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentals: RentalsService) {}

  @Post()
  create(@Body() dto: CreateRentalDto) {
    return this.rentals.create(dto);
  }

  @Get()
  findAll(@Query() query: ListRentalsDto) {
    return this.rentals.findAll(query);
  }

  @Get('active')
  findActive() {
    return this.rentals.findActive();
  }

  @Get('overdue')
  findOverdue() {
    return this.rentals.findOverdue();
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.rentals.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.findOne(id);
  }

  @Patch(':id/return')
  returnRental(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.returnRental(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.cancel(id);
  }

  @Patch(':id/extend')
  extend(@Param('id', ParseIntPipe) id: number, @Body() dto: ExtendRentalDto) {
    return this.rentals.extend(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentals.remove(id);
  }
}