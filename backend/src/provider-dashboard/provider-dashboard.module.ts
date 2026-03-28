import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { ProviderDashboardService } from './provider-dashboard.service'
import { ProviderDashboardController } from './provider-dashboard.controller'

@Module({
  imports: [PrismaModule],
  providers: [ProviderDashboardService],
  controllers: [ProviderDashboardController],
})
export class ProviderDashboardModule {}