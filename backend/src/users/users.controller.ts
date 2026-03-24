import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return user
  }

  // GET /users
  @Get()
  getAll() {
    return this.usersService.findAll()
  }

  // GET /users/:id
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  // PATCH /users/me
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.usersService.updateUser(user.id, body)
  }
}