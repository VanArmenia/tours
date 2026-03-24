import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  async createTour(userId: string, data: any) {
    const provider =
      await this.prisma.providerProfile.findUnique({
        where: { userId },
      })

    if (!provider) {
      throw new ForbiddenException('Not a provider')
    }

    return this.prisma.tour.create({
      data: {
        title: data.title,
        description: data.description,

        price: data.price,
        currency: data.currency,

        durationMinutes: data.durationMinutes,
        maxPeople: data.maxPeople,

        categoryId: data.categoryId,
        locationId: data.locationId,

        providerId: provider.id,
      },
    })
  }

  getAllTours() {
    return this.prisma.tour.findMany({
      include: {
        provider: true,
        category: true,
        location: true,
      },
    })
  }

  async getTourById(id: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      include: {
        provider: true,
        category: true,
        location: true,
        dates: true,
        images: true,
      },
    })

    if (!tour) {
      throw new NotFoundException()
    }

    return tour
  }

  async getMyTours(userId: string) {
    const provider =
      await this.prisma.providerProfile.findUnique({
        where: { userId },
      })

    if (!provider) return []

    return this.prisma.tour.findMany({
      where: {
        providerId: provider.id,
      },
      include: {
        category: true,
        location: true,
      },
    })
  }
}