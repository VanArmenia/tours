import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { ProviderDashboardService } from './provider-dashboard.service'

@Controller('provider/dashboard')
@UseGuards(JwtAuthGuard)
export class ProviderDashboardController {
  constructor(private service: ProviderDashboardService) {}

  @Get()
  dashboard(@CurrentUser() user: any) {
    return this.service.getDashboard(user.id)
  }

  @Get('earnings')
  earnings(@CurrentUser() user: any) {
    return this.service.getEarnings(user.id)
  }

  @Get('bookings')
  bookings(@CurrentUser() user: any) {
    return this.service.getBookings(user.id)
  }

  @Get('tours')
  tours(@CurrentUser() user: any) {
    return this.service.getTours(user.id)
  }

  @Get('reviews')
  reviews(@CurrentUser() user: any) {
    return this.service.getReviews(user.id)
  }

  @Get('stats')
  stats(@CurrentUser() user: any) {
    return this.service.getStats(user.id)
  }
}