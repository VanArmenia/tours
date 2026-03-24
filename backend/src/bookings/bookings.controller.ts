import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'

import { BookingsService } from './bookings.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('bookings')
export class BookingsController {
  constructor(
    private bookingsService: BookingsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.bookingsService.createBooking(
      user.id,
      body,
    )
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  myBookings(
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.getMyBookings(
      user.id,
    )
  }

  @Get('provider')
  @UseGuards(JwtAuthGuard)
  providerBookings(
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.getProviderBookings(
      user.id,
    )
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  cancel(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.bookingsService.cancelBooking(
      user.id,
      id,
    )
  }
}