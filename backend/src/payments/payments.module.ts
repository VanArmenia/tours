import { Module } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { BookingsModule } from '../bookings/bookings.module'
import { StripeService } from '../stripe/stripe.service'

@Module({
  imports: [PrismaModule, BookingsModule],
  providers: [PaymentsService, StripeService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}