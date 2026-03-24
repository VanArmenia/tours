import { Module } from '@nestjs/common'
import { TourDatesService } from './tour-dates.service'
import { TourDatesController } from './tour-dates.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { ToursModule } from '../tours/tours.module'

@Module({
  imports: [PrismaModule, ToursModule],
  providers: [TourDatesService],
  controllers: [TourDatesController],
})
export class TourDatesModule {}