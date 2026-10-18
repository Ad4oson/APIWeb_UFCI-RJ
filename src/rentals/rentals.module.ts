import { Module } from '@nestjs/common';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { RentalsRepository } from './rentals.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RentalsController],
  providers: [RentalsService, RentalsRepository, PrismaService],
})
export class RentalsModule {}