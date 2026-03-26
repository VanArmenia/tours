import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common'

import { ToursService } from './tours.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('tours')
export class ToursController {
  constructor(
    private toursService: ToursService,
  ) {}

  // create tour
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.toursService.createTour(
      user.id,
      body,
    )
  }

  // single tour
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.toursService.getTourById(id)
  }

  // my tours
  @Get('me/list')
  @UseGuards(JwtAuthGuard)
  myTours(@CurrentUser() user: any) {
    return this.toursService.getMyTours(
      user.id,
    )
  }

  @Get()
  findAll(@Query() query: any) {
    console.log('RAW QUERY:', query)
    return this.toursService.searchTours(query)
  }
}