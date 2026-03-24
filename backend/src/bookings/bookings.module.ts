import { Module } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { BookingsController } from './bookings.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { TourDatesModule } from '../tour-dates/tour-dates.module'
import { ProvidersModule } from '../providers/providers.module'

@Module({
  imports: [
    PrismaModule,
    TourDatesModule,
    ProvidersModule,
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}