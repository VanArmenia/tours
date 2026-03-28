import {
  Injectable,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createReview(
    userId: string,
    dto: any,
  ) {
    // ✅ check user has completed booking
    const booking =
      await this.prisma.booking.findFirst({
        where: {
          userId,
          status: 'CONFIRMED',
          tourDate: {
            tourId: dto.tourId,
          },
        },
      })

    if (!booking) {
      throw new BadRequestException(
        'You can only review after completing booking',
      )
    }

    // ✅ create review
    const review =
      await this.prisma.review.create({
        data: {
          userId,
          tourId: dto.tourId,
          rating: dto.rating,
          comment: dto.comment,
        },
      })

    // ✅ update tour rating
    await this.updateTourRating(dto.tourId)

    return review
  }

  async updateTourRating(tourId: string) {
    const reviews =
      await this.prisma.review.findMany({
        where: { tourId },
      })

    const avg =
      reviews.reduce(
        (sum, r) => sum + r.rating,
        0,
      ) / reviews.length

    await this.prisma.tour.update({
      where: { id: tourId },
      data: {
        rating: avg,
      },
    })
  }

  async getTourReviews(tourId: string) {
    return this.prisma.review.findMany({
      where: { tourId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}