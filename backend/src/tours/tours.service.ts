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

  async searchTours(query: any) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10

    const {
      location,
      minPrice,
      maxPrice,
      category,
      date,
      people,
      search,
    } = query

    const filters: any[] = []

    // 🔎 search
    if (search) {
      filters.push({
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            location: {
              city: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ],
      })
    }

    // 📍 location
    if (location) {
      filters.push({
        location: {
          city: {
            contains: location,
            mode: 'insensitive',
          },
        },
      })
    }

    // 🏷 category
    if (category) {
      filters.push({
        category: {
          slug: category,
        },
      })
    }

    // 💰 price
    if (minPrice || maxPrice) {
      filters.push({
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
      })
    }

    // 👥 capacity
    if (people) {
      filters.push({
        maxPeople: {
          gte: Number(people),
        },
      })
    }

    // 📅 availability
    if (date) {
      filters.push({
        dates: {
          some: {
            startTime: {
              gte: new Date(date),
            },
            availableSpots: {
              gte: people ? Number(people) : 1,
            },
          },
        },
      })
    }

    return this.prisma.tour.findMany({
      where: {
        status: 'ACTIVE', // 🔥 VERY IMPORTANT
        AND: filters,
      },

      skip: (page - 1) * limit,
      take: limit,

      include: {
        location: true,
        category: true,
        dates: true,
      },
    })
  }
}