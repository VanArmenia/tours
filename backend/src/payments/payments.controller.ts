import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
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

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.paymentsService.createCheckoutSession(
      user.id,
      body.bookingId,
    )
  }

  @Post('webhook')
  async webhook(@Req() req: any) {
   return this.paymentsService.handleWebhook(req)
}
}