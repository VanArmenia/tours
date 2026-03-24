import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, data: any) {
    const date =
      await this.prisma.tourDate.findUnique({
        where: { id: data.tourDateId },
        include: {
          tour: true,
        },
      })

    if (!date) {
      throw new NotFoundException()
    }

    if (date.availableSpots < data.peopleCount) {
      throw new BadRequestException(
        'Not enough spots',
      )
    }

    const price = date.priceOverride ?? date.tour.price

    const totalPrice = price * data.peopleCount

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const booking =
      await this.prisma.$transaction(
        async (tx) => {
          await tx.tourDate.update({
            where: { id: date.id },
            data: {
              availableSpots:
                date.availableSpots -
                data.peopleCount,
            },
          })

         return tx.booking.create({
          data: {
            userId,
            tourDateId: date.id,
            peopleCount: data.peopleCount,
            totalPrice,
            status: 'RESERVED',
            expiresAt,
          },
        })
        },
      )

    return booking
  }

  getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        tourDate: {
          include: {
            tour: true,
          },
        },
      },
    })
  }

  async getProviderBookings(userId: string) {
    const provider =
      await this.prisma.providerProfile.findUnique(
        {
          where: { userId },
        },
      )

    if (!provider) {
      throw new ForbiddenException()
    }

    return this.prisma.booking.findMany({
      where: {
        tourDate: {
          tour: {
            providerId:
              provider.id,
          },
        },
      },
      include: {
        user: true,
        tourDate: {
          include: {
            tour: true,
          },
        },
      },
    })
  }

  async cancelBooking(
    userId: string,
    bookingId: string,
  ) {
    const booking =
      await this.prisma.booking.findUnique(
        {
          where: { id: bookingId },
        },
      )

    if (!booking) {
      throw new NotFoundException()
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException()
    }

    return this.prisma.$transaction(
      async (tx) => {
        await tx.tourDate.update({
          where: {
            id: booking.tourDateId,
          },
          data: {
            availableSpots: {
              increment:
                booking.peopleCount,
            },
          },
        })

        return tx.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
          },
        })
      },
    )
  }
}