import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common'

import { PaymentsService } from './payments.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.paymentsService.createPayment(
      user.id,
      body.bookingId,
    )
  }
}