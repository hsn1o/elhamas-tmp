/**
 * One-time script to create the first admin user.
 * Run: npx tsx scripts/seed-admin.ts
 * Or: node --loader ts-node/esm scripts/seed-admin.ts (if you use ts-node)
 *
 * Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME in env or edit below.
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'changeme'
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Admin'

async function main() {
  const existing = await prisma.adminUser.findUnique({
    where: { email: ADMIN_EMAIL },
  })
  if (existing) {
    console.log('Admin user already exists:', ADMIN_EMAIL)
    return
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await prisma.adminUser.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: ADMIN_NAME,
      role: 'admin',
    },
  })
  console.log('Created admin user:', ADMIN_EMAIL)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
