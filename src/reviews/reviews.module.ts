import{ Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './reviews.repository';

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService, ReviewsRepository],
})

export class ReviewsModule {}