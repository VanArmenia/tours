import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'

import { ProvidersService } from './providers.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  // create provider profile
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.providersService.createProvider(
      user.id,
      body,
    )
  }

  // get all providers
  @Get()
  getAll() {
    return this.providersService.getAllProviders()
  }

  // get provider by id
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.providersService.getProviderById(id)
  }

  // get my provider profile
  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return this.providersService.getMyProvider(user.id)
  }
}