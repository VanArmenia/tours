import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TourDatesService {
  constructor(private prisma: PrismaService) {}

  async createDate(userId: string, data: any) {
    const provider =
      await this.prisma.providerProfile.findUnique({
        where: { userId },
      })

    if (!provider) {
      throw new ForbiddenException('Not provider')
    }

    const tour = await this.prisma.tour.findUnique({
      where: { id: data.tourId },
    })

    if (!tour) {
      throw new NotFoundException('Tour not found')
    }

    if (tour.providerId !== provider.id) {
      throw new ForbiddenException(
        'Not your tour',
      )
    }

    return this.prisma.tourDate.create({
      data: {
        tourId: data.tourId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        availableSpots: data.availableSpots,
        priceOverride: data.priceOverride,
      },
    })
  }

  getDatesForTour(tourId: string) {
    return this.prisma.tourDate.findMany({
      where: { tourId },
      orderBy: { startTime: 'asc' },
    })
  }

  async getMyDates(userId: string) {
    const provider =
      await this.prisma.providerProfile.findUnique({
        where: { userId },
      })

    if (!provider) return []

    return this.prisma.tourDate.findMany({
      where: {
        tour: {
          providerId: provider.id,
        },
      },
      include: {
        tour: true,
      },
    })
  }

  async deleteDate(userId: string, id: string) {
    const provider =
      await this.prisma.providerProfile.findUnique({
        where: { userId },
      })

    if (!provider) {
      throw new ForbiddenException()
    }

    const date =
      await this.prisma.tourDate.findUnique({
        where: { id },
        include: {
          tour: true,
        },
      })

    if (!date) {
      throw new NotFoundException()
    }

    if (date.tour.providerId !== provider.id) {
      throw new ForbiddenException()
    }

    return this.prisma.tourDate.delete({
      where: { id },
    })
  }
}