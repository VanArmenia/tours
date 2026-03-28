🧾 PROJECT SUMMARY (Tours Backend)
🏗️ Architecture Overview

You are building a tour booking marketplace backend with:

NestJS + Prisma + PostgreSQL + Stripe

Core modules:

Auth
Users / Providers
Tours
Bookings
Payments (Stripe)
Reviews & Ratings
Search & Filters
Webhooks
Expiration jobs (cron)

🧭 CORE FLOWS
1️⃣ Booking Flow
User selects tour date
→ creates booking
→ booking has expiresAt (e.g. +30 min)
→ status = PENDING
2️⃣ Payment Flow (Stripe)
Frontend calls /payments/checkout
→ Stripe session created
→ returns checkout URL
→ user pays on Stripe page

After payment:

Stripe redirects user to success page
AND
Stripe sends webhook to backend

Backend webhook:

✔ verify signature
✔ mark payment as PAID
✔ update booking = CONFIRMED
3️⃣ Stripe Concepts
Stripe Session
temporary checkout object
contains:

- amount
- metadata (bookingId, userId)
- success/cancel URLs
  Webhook Secret
  STRIPE_WEBHOOK_SECRET = used to verify Stripe calls

Found in:

👉 Stripe Dashboard → Developers → Webhooks

🧠 DATABASE (KEY MODELS)
Booking
status: PENDING | CONFIRMED | CANCELLED
expiresAt: DateTime

Used for:

cron job cancels expired bookings
Payment
stripeSessionId
status: PENDING | PAID | FAILED
Tour
title
price
location
category
rating (avg)
reviewsCount
Review
userId
tourId
rating (1–5)
comment
@@unique([userId, tourId])

⭐ REVIEWS SYSTEM
Logic:
User can only review AFTER confirmed booking

Flow:

1. check booking exists
2. create review
3. recalc tour rating
4. update Tour.rating + reviewsCount
   Rating Strategy
   Review.rating = source of truth
   Tour.rating = cached average
   🔍 SEARCH & FILTERS

Fixed implementation:

Features:
text search (title, description, city)
location filter
category filter
price range
people capacity
date availability
Key fix:
NO {} inside AND array
use dynamic filters array

⚠️ CRITICAL FIXES YOU MADE
Prisma Migrate issue
use migrate deploy in production
use migrate dev in development
Stripe webhook error
problem: missing raw body
solution: disable bodyParser for webhook route
TypeScript issues
Cannot find namespace Stripe → missing import
session.metadata possibly null → optional chaining needed
bodyParser not found → wrong Nest setup

⏱️ EXPIRATION SYSTEM
booking expiresAt = now + 30 min
cron job:
if expiresAt < now → cancel booking

📦 CURRENT STATUS

You already built:

✔ Auth system
✔ Tours CRUD
✔ Search engine
✔ Booking system
✔ Stripe payments
✔ Webhook processing
✔ Expiration logic
✔ Reviews + ratings
