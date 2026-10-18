import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module ({
    controllers: [CategoriesController],
    providers: [CategoriesService, CategoriesRepository, PrismaService],
})
export class CategoriesModule {}