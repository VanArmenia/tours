import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('reviews')
export class ReviewsController {
  constructor(
    private reviewsService: ReviewsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.reviewsService.createReview(
      user.id,
      dto,
    )
  }

  @Get(':tourId')
  getReviews(@Param('tourId') tourId: string) {
    return this.reviewsService.getTourReviews(
      tourId,
    )
  }
}