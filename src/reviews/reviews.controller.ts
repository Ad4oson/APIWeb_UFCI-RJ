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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { ReviewsService } from './reviews.service';
import { Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListReviewsDto } from './dto/list-reviews.dto'; 

@ApiTags('Avaliações')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

    //Cria uma avaliação para um jogo
    @ApiOperation({
        summary: 'Criar uma avaliação',
    })
    @ApiResponse({
        status: 201,
        description: 'Avaliação criada com sucesso',
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário ou jogo não encontrado',
    })
    @Post()
    create(
        @Body() dto: CreateReviewDto,
    ) {
        return this.reviews.create(dto);
    }

  @ApiOperation({
    summary: 'Listar avaliações',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de avaliações',
  })
  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Query() query: ListReviewsDto) {
    return this.reviews.findAll(query);
  }

    //Busca uma avaliação pelo identificador
    @ApiOperation({
        summary: 'Buscar avaliação por ID',
    })
    @ApiParam({
        name: 'id',
        description: 'ID da avaliação',
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliação Encontrada',
    })
    @ApiResponse({
        status: 404,
        description: 'Avaliação não encontrada',
    })
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviews.findOne(id);
    }

    //Atualiza notas e comentários da avaliação
    @ApiOperation({
        summary: 'Atualizar avaliação',
    })
    @ApiParam({
        name: 'id',
        description: 'ID da avaliação',
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliação atualizada com sucesso',
    })
    @ApiResponse({
        status: 404,
        description: 'Avaliação não encontrada',
    })
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateReviewDto,
    ) {
        return this.reviews.update(id, dto);
    }

    //Remove uma avaliação já feita
    @ApiOperation({
        summary: 'Excluir avaliação',
    })
    @ApiParam({
        name: 'id',
        description: 'ID da avaliação',
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliação removida com sucesso',
    })
    @ApiResponse({
        status: 404,
        description: 'Avaliação não encontrada',
    })
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviews.remove(id);
    }
}
