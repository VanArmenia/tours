import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CronService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // runs every minute
  @Cron('*/10 * * * *')
  async expireBookings() {
    console.log('Running cron...')

    const expiredBookings =
      await this.prisma.booking.findMany({
        where: {
          status: 'RESERVED',
          expiresAt: {
            lt: new Date(),
          },
        },
      })

    for (const booking of expiredBookings) {
      await this.prisma.$transaction(
        async (tx) => {
          // release spots
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

          // cancel booking
          await tx.booking.update({
            where: {
              id: booking.id,
            },
            data: {
              status: 'CANCELLED',
            },
          })
        },
      )

      console.log(
        'Expired booking:',
        booking.id,
      )
    }
  }
}