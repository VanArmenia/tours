import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { ToursModule } from './tours/tours.module';
import { TourDatesModule } from './tour-dates/tour-dates.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { StripeService } from './stripe/stripe.service';
import { ScheduleModule } from '@nestjs/schedule'
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProvidersModule, ToursModule, TourDatesModule, BookingsModule, PaymentsModule, ScheduleModule.forRoot(), CronModule,],
  controllers: [AppController],
  providers: [AppService, StripeService, CronService],
})
export class AppModule {}
