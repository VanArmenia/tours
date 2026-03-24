import { Module } from '@nestjs/common'
import { ToursService } from './tours.service'
import { ToursController } from './tours.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { ProvidersModule } from '../providers/providers.module'

@Module({
  imports: [PrismaModule, ProvidersModule],
  providers: [ToursService],
  controllers: [ToursController],
})
export class ToursModule {}