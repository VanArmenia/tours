import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'

import { ToursService } from './tours.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

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
    return this.toursService.searchTours(query)
  }

  // ✅ upload image
  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @CurrentUser() user: any,
    @Param('id') tourId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.toursService.uploadImage(
      user.id,
      tourId,
      file,
    )
  }
}