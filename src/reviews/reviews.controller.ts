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
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { ParamsTokenFactory } from '@nestjs/core/internal';
import { Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListReviewsDto } from './dto/list-reviews.dto'; 

@ApiTags('Avaliações')
@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviews: ReviewsService,
    ) {}

    //Cria uma avaliação para um jogo
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
    @Get()
    findAll(@Query() query: ListReviewsDto){
        return this.reviews.findAll(query);
    }

    //Busca uma avaliação pelo identificador
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviews.findOne(id);
    }

    //Atualiza notas e comentários da avaliação
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateReviewDto,
    ) {
        return this.reviews.update(id, dto);
    }

    //Remove uma avaliação já feita
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviews.remove(id);
    }
}