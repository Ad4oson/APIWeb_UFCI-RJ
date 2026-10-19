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

@ApiTags('Avaliações')
@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviews: ReviewsService,
    ) {}

    @Post()
    @ApiBody({ type: CreateReviewDto })
    @ApiOperation({ summary: 'Criar avaliação' })
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

    @Get(':id')
    @ApiOperation({ summary: 'Busca avaliação pelo id' })
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviews.findOne(id);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateReviewDto })
    @ApiOperation({ summary: 'Atualizar notas e comentários da avaliação' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateReviewDto,
    ) {
        return this.reviews.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar avaliação' })
    remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.reviews.remove(id);
    }
}