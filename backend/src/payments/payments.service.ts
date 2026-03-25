import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { StripeService } from '../stripe/stripe.service'
import Stripe from 'stripe'

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private stripe: StripeService,) {}

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

  async confirmPayment(providerPaymentId: string,  paymentId: string,) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id: paymentId,
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
            providerPaymentId,
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

  async createCheckoutSession(
    userId: string,
    bookingId: string,
    ) {
    const booking =
      await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
          payment: true,
          tourDate: {
          include: {
              tour: true,
          },
          },
      },
      })

    if (!booking) throw new Error()

    if (booking.userId !== userId)
        throw new Error()

    const payment =
      booking.payment ??
      (await this.prisma.payment.create({
      data: {
          bookingId,
          provider: 'STRIPE',
          amount: booking.totalPrice,
          currency: 'EUR',
          status: 'PENDING',
      },
      }))

    const session =
      await this.stripe.client.checkout.sessions.create({
        mode: 'payment',
        success_url:
          process.env.FRONTEND_URL +
          '/success',
        cancel_url:
          process.env.FRONTEND_URL +
          '/cancel',
        line_items: [
          {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount:
            Math.round(
                booking.totalPrice * 100,
            ),
            product_data: {
            name:
                booking.tourDate.tour
                .title,
            },
          },
        },
      ],
      metadata: {
          paymentId: payment.id,
      },
      })

    await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
        providerPaymentId:
            session.id,
        status: 'REQUIRES_ACTION',
        },
    })

    return session.url
  }

  async handleWebhook(req: any) {
    try {
      const sig = req.headers['stripe-signature']

      const event =
        this.stripe.client.webhooks.constructEvent(
          req.rawBody,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!,
        )

      console.log('EVENT:', event.type)

      if (
        event.type ===
        'checkout.session.completed'
      ) {
        const session =
          event.data.object as any

        const paymentId =
          session.metadata?.paymentId

        console.log(
          'paymentId:',
          paymentId,
        )

        await this.confirmPayment(
          session.id,
          paymentId,
        )
      }

      return { received: true }
    } catch (err) {
      console.error(
        'WEBHOOK ERROR:',
        err,
      )
      throw err
    }
  }
}