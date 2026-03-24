import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'

import { TourDatesService } from './tour-dates.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('tour-dates')
export class TourDatesController {
  constructor(
    private tourDatesService: TourDatesService,
  ) {}

  // create date
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.tourDatesService.createDate(
      user.id,
      body,
    )
  }

  // dates for tour
  @Get('tour/:tourId')
  getForTour(
    @Param('tourId') tourId: string,
  ) {
    return this.tourDatesService.getDatesForTour(
      tourId,
    )
  }

  // my dates
  @Get('me/list')
  @UseGuards(JwtAuthGuard)
  myDates(@CurrentUser() user: any) {
    return this.tourDatesService.getMyDates(
      user.id,
    )
  }

  // delete date
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.tourDatesService.deleteDate(
      user.id,
      id,
    )
  }
}