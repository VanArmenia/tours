import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service'

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async test() {
    return this.prisma.user.findMany()
  }
}
