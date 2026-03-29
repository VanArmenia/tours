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
import { ReviewsModule } from './reviews/reviews.module';
import { ProviderDashboardModule } from './provider-dashboard/provider-dashboard.module';
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    ProvidersModule, 
    ToursModule, 
    TourDatesModule, 
    BookingsModule, 
    PaymentsModule, 
    ScheduleModule.forRoot(), 
    CronModule, 
    ReviewsModule, 
    ProviderDashboardModule, 
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, StripeService, CronService],
})
export class AppModule {}
