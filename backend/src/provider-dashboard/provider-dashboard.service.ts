import { Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProviderDashboardService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // 🔐 Get provider
  // =========================
  async getProvider(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    })

    if (!provider) {
      throw new ForbiddenException('Not a provider')
    }

    return provider
  }

  // =========================
  // 📊 Dashboard overview
  // =========================
  async getDashboard(userId: string) {
    const provider = await this.getProvider(userId)

    const [
      totalTours,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      recentBookings,
    ] = await Promise.all([
      this.prisma.tour.count({
        where: { providerId: provider.id },
      }),

      this.prisma.booking.count({
        where: {
          tourDate: {
            tour: { providerId: provider.id },
          },
        },
      }),

      this.prisma.booking.count({
        where: {
          status: 'CONFIRMED',
          tourDate: {
            tour: { providerId: provider.id },
          },
        },
      }),

      this.prisma.booking.count({
        where: {
          status: 'PENDING',
          tourDate: {
            tour: { providerId: provider.id },
          },
        },
      }),

      this.prisma.booking.findMany({
        where: {
          tourDate: {
            tour: { providerId: provider.id },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          payment: true,
          tourDate: {
            include: {
              tour: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const totalRevenue = await this.getRevenue(provider.id)

    return {
      totalTours,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalRevenue,
      recentBookings,
    }
  }

  // =========================
  // 💰 Earnings (Stripe-based reality)
  // =========================
  async getEarnings(userId: string) {
    const provider = await this.getProvider(userId)

    const bookings = await this.prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        tourDate: {
          tour: { providerId: provider.id },
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    })

    const totalRevenue = bookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0,
    )

    return {
      totalRevenue,
      totalBookings: bookings.length,
      averageBookingValue: bookings.length
        ? totalRevenue / bookings.length
        : 0,
    }
  }

  // =========================
  // 🧳 Provider tours
  // =========================
  async getTours(userId: string) {
    const provider = await this.getProvider(userId)

    return this.prisma.tour.findMany({
      where: {
        providerId: provider.id,
      },
      include: {
        category: true,
        location: true,
        dates: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // =========================
  // 📅 Provider bookings
  // =========================
  async getBookings(userId: string) {
    const provider = await this.getProvider(userId)

    return this.prisma.booking.findMany({
      where: {
        tourDate: {
          tour: {
            providerId: provider.id,
          },
        },
      },
      include: {
        user: true,
        payment: true,
        tourDate: {
          include: {
            tour: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // =========================
  // ⭐ Reviews
  // =========================
  async getReviews(userId: string) {
    const provider = await this.getProvider(userId)

    return this.prisma.review.findMany({
      where: {
        tour: {
          providerId: provider.id,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // =========================
  // 📈 Stats / Analytics
  // =========================
  async getStats(userId: string) {
    const provider = await this.getProvider(userId)

    const reviews = await this.prisma.review.findMany({
      where: {
        tour: { providerId: provider.id },
      },
      select: {
        rating: true,
      },
    })

    const totalBookings = await this.prisma.booking.count({
      where: {
        tourDate: {
          tour: { providerId: provider.id },
        },
      },
    })

    const confirmedBookings = await this.prisma.booking.count({
      where: {
        status: 'CONFIRMED',
        tourDate: {
          tour: { providerId: provider.id },
        },
      },
    })

    const avgRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length

    return {
      averageRating: avgRating,
      totalReviews: reviews.length,
      totalBookings,
      confirmedBookings,
      conversionRate:
        totalBookings === 0
          ? 0
          : confirmedBookings / totalBookings,
    }
  }

  // =========================
  // 💰 Internal helper (revenue)
  // =========================
  private async getRevenue(providerId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        tourDate: {
          tour: { providerId },
        },
      },
      select: {
        totalPrice: true,
      },
    })

    return bookings.reduce((sum, b) => sum + b.totalPrice, 0)
  }
}