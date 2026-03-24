import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  // Register user
  async register(data: {
    email: string
    passwordHash: string
    firstName: string
    lastName: string
  }) {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10)
    const user = await this.prisma.user.create({
      data: { ...data, passwordHash: hashedPassword },
    })
    return this.generateToken(user.id)
  }

  // Login
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    return this.generateToken(user.id)
  }

  private generateToken(userId: string) {
    return this.jwtService.sign({ sub: userId })
  }
}