import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { CurrentUser } from './current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body
    return this.authService.login(email, password)
  }

  @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: any) {
    return user
  }
}