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
import { CreateRentalDto } from './dto/create-rental.dto';
import { ExtendRentalDto } from './dto/extend-rental.dto';
import { ListRentalsDto } from './dto/list-rentals.dto';
import { CurrentUser, RentalsService } from './rentals.service';

interface AuthenticatedRequest {
  user: CurrentUser;
}

@ApiTags('Aluguéis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentals: RentalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar aluguel' })
  @ApiBody({ type: CreateRentalDto })
  @ApiResponse({
    status: 201,
    description: 'Aluguel registrado e estoque atualizado.',
  })
  create(
    @Body() dto: CreateRentalDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.create(dto, request.user);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar aluguéis' })
  @ApiResponse({ status: 200, description: 'Lista de aluguéis.' })
  findAll(
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findAll(query, request.user);
  }

  @Get('active')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar aluguéis em andamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de aluguéis em andamento.',
  })
  findActive(
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findActive(query, request.user);
  }

  @Get('overdue')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar aluguéis em atraso' })
  @ApiResponse({
    status: 200,
    description: 'Lista de aluguéis em atraso.',
  })
  findOverdue(
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findOverdue(query, request.user);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar histórico do usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Histórico de aluguéis do usuário.',
  })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findByUser(userId, query, request.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar aluguel por ID' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Detalhes do aluguel.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findOne(id, request.user);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Registrar devolução' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Devolução registrada.' })
  returnRental(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.returnRental(id, request.user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar aluguel' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Aluguel cancelado.' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.cancel(id, request.user);
  }

  @Patch(':id/extend')
  @ApiOperation({ summary: 'Prorrogar devolução' })
  @ApiBody({ type: ExtendRentalDto })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Prazo prorrogado.' })
  extend(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ExtendRentalDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.extend(id, dto, request.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir aluguel' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Aluguel excluído.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.remove(id, request.user);
  }
}