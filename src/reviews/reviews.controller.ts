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

    //Lista todas as avaliações cadastradas
    @Get()
    findAll() {
        return this.reviews.findAll();
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