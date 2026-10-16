import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { RentalsModule } from './rentals/rentals.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesModule } from './categories/categories.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    CategoriesModule,
    ReviewsModule,
    PrismaModule,
    UsersModule,
    GamesModule,
    RentalsModule,
    PaymentsModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'apiweb_ufci-rj',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
