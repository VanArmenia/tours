import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  getProviders() {
    return this.prisma.providerProfile.findMany({
      include: { user: true },
    })
  }

  verifyProvider(id: string) {
    return this.prisma.providerProfile.update({
      where: { id },
      data: { verified: true },
    })
  }
}