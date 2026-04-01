import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CloudinaryService } from '../cloudinary/cloudinary.service'

@Injectable()
export class ToursService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async createTour(userId: string, data: any) {
    const provider =
      await this.prisma.providerProfile.findUnique({
        where: { userId },
      })

    if (!provider) {
      throw new ForbiddenException('Not a provider')
    }

     // 🔥 NEW: check verification
    if (!provider.verified) {
      throw new ForbiddenException(
        'Provider not verified',
      )
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

  async uploadImage(
    userId: string,
    tourId: string,
    file: Express.Multer.File,
  ) {
    const provider =
      await this.prisma.providerProfile.findUnique({
        where: { userId },
      })

    if (!provider) {
      throw new ForbiddenException()
    }

    const tour = await this.prisma.tour.findUnique({
      where: { id: tourId },
    })

    if (!tour) {
      throw new NotFoundException()
    }

    if (tour.providerId !== provider.id) {
      throw new ForbiddenException()
    }

    // 🔥 upload to cloudinary
    const result: any =
      await this.cloudinary.uploadImage(file)

    // 🔥 save in DB
    return this.prisma.image.create({
      data: {
        tourId,
        url: result.secure_url,
      },
    })
  }
}