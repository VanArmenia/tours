import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY!,
      {
        apiVersion: '2026-02-25.clover',
      },
    )
  }

  get client() {
    return this.stripe
  }
}