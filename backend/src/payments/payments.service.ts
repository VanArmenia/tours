import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(userId: string, bookingId: string) {
    const booking =
      await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          payment: true,
        },
      })

    if (!booking) throw new NotFoundException()

    if (booking.userId !== userId) {
      throw new BadRequestException()
    }

    if (booking.payment) {
      return booking.payment
    }

    const payment =
      await this.prisma.payment.create({
        data: {
          bookingId,
          provider: 'STRIPE',
          amount: booking.totalPrice,
          currency: 'EUR',
          status: 'PENDING',
        },
      })

    return payment
  }

  async confirmPayment(providerPaymentId: string) {
    const payment =
      await this.prisma.payment.findFirst({
        where: {
          providerPaymentId,
        },
        include: {
          booking: true,
        },
      })

    if (!payment) {
      throw new NotFoundException()
    }

    return this.prisma.$transaction(
      async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        })

        return tx.booking.update({
          where: {
            id: payment.bookingId,
          },
          data: {
            status: 'CONFIRMED',
          },
        })
      },
    )
  }

  async cancelPayment(bookingId: string) {
    const booking =
      await this.prisma.booking.findUnique({
        where: { id: bookingId },
      })

    if (!booking) throw new NotFoundException()

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