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
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Query } from '@nestjs/common';
import { ListGameReviewsDto } from '../reviews/dto/list-game-reviews.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get()
  findAll() {
    return this.users.findAll();
  }

  @Get('active')
  findActive() {
    return this.users.findActive();
  }

  @Get(':id/rentals')
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.users.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.users.activate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}
