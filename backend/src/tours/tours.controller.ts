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
  UploadedFiles,
  Delete,
  Patch
} from '@nestjs/common'

import { ToursService } from './tours.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'

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
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only images allowed'), false)
      }
      cb(null, true)
    },
  }))
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

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10 , {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only images allowed'), false)
      }
      cb(null, true)
    },
  }))
  uploadMultiple(
    @CurrentUser() user: any,
    @Param('id') tourId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.toursService.uploadMultipleImages(
      user.id,
      tourId,
      files,
    )
  }

  @Delete('image/:id')
  @UseGuards(JwtAuthGuard)
  deleteImage(
    @CurrentUser() user: any,
    @Param('id') imageId: string,
  ) {
    return this.toursService.deleteImage(
      user.id,
      imageId,
    )
  }

  @Patch('image/:id/cover')
  @UseGuards(JwtAuthGuard)
  setCover(
    @CurrentUser() user: any,
    @Param('id') imageId: string,
  ) {
    return this.toursService.setCoverImage(
      user.id,
      imageId,
    )
  }
}