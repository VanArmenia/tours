import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding...')

  // categories
  await prisma.category.createMany({
    data: [
      { name: 'Hiking', slug: 'hiking' },
      { name: 'City Tour', slug: 'city-tour' },
      { name: 'Workshop', slug: 'workshop' },
      { name: 'Food', slug: 'food' },
    ],
    skipDuplicates: true,
  })

  //locations
  await prisma.location.createMany({
  data: [
    { id: 'loc1', country: 'Czechia', city: 'Prague' },
    { id: 'loc2', country: 'France', city: 'Paris' },
    ],
  })

  // user
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      passwordHash: '123456',
      firstName: 'Test',
      lastName: 'User',
    },
  })

  console.log('User created:', user.id)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })