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
  @ApiOperation({ summary: 'Criar um novo aluguel' })
  @ApiBody({ type: CreateRentalDto })
  @ApiResponse({
    status: 201,
    description: 'Aluguel registrado e estoque do jogo atualizado.',
  })
  create(
    @Body() dto: CreateRentalDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.create(dto, request.user);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar aluguéis com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de aluguéis.' })
  findAll(
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findAll(query, request.user);
  }

  @Get('active')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Listar aluguéis ativos com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de aluguéis ativos.',
  })
  findActive(
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findActive(query, request.user);
  }

  @Get('overdue')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Listar aluguéis atrasados com filtros e paginação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de aluguéis atrasados.',
  })
  findOverdue(
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findOverdue(query, request.user);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar histórico paginado de um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Histórico paginado de aluguéis do usuário.',
  })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ListRentalsDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findByUser(userId, query, request.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar aluguel pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Detalhes do aluguel.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.findOne(id, request.user);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Registrar devolução de um jogo' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Devolução registrada.' })
  returnRental(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.returnRental(id, request.user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar um aluguel ativo' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Aluguel cancelado.' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.cancel(id, request.user);
  }

  @Patch(':id/extend')
  @ApiOperation({ summary: 'Prorrogar a data de devolução' })
  @ApiBody({ type: ExtendRentalDto })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Prazo do aluguel prorrogado.' })
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
  @ApiOperation({ summary: 'Excluir um aluguel sem pagamentos associados' })
  @ApiParam({ name: 'id', description: 'ID do aluguel', type: Number })
  @ApiResponse({ status: 200, description: 'Aluguel excluído.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.rentals.remove(id, request.user);
  }
}