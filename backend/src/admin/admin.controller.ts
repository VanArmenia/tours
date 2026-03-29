import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private service: AdminService) {}

  @Get('providers')
  getProviders() {
    return this.service.getProviders()
  }

  @Patch('providers/:id/verify')
  verify(@Param('id') id: string) {
    return this.service.verifyProvider(id)
  }
}