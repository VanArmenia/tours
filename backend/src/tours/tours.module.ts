import { Module } from '@nestjs/common'
import { ToursService } from './tours.service'
import { ToursController } from './tours.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { ProvidersModule } from '../providers/providers.module'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'

@Module({
  imports: [PrismaModule, ProvidersModule, CloudinaryModule],
  providers: [ToursService],
  controllers: [ToursController],
})
export class ToursModule {}