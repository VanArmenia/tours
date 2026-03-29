import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async createProvider(userId: string, data: any) {
    const existing = await this.prisma.providerProfile.findUnique({
      where: { userId },
    })

    if (existing) {
      throw new BadRequestException('Provider already exists')
    }

   const provider =
    await this.prisma.providerProfile.create({
      data: {
        userId,
        companyName: data.companyName,
        description: data.description,
      },
    })

     // 🔥 update user role → PROVIDER
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'PROVIDER' },
    })

    return provider
  }

  getAllProviders() {
    return this.prisma.providerProfile.findMany({
      include: {
        user: true,
      },
    })
  }

  getProviderById(id: string) {
    return this.prisma.providerProfile.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })
  }

  getMyProvider(userId: string) {
    return this.prisma.providerProfile.findUnique({
      where: { userId },
    })
  }
}