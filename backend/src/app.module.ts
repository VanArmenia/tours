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

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProvidersModule, ToursModule, TourDatesModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
