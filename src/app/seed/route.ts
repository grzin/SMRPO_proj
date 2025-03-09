import { User } from '@/payload-types'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { getPayload, Payload } from 'payload'

// Seed the databse with test data
export async function GET() {
  const payload = await getPayload({ config })

  await createRoles(payload)
  await createAdmin(payload)

  return NextResponse.json({ success: true })
}

async function createRoles(payload: Payload) {
  const roles = [
    {
      role: 'admin',
    },
    {
      role: 'user',
    },
  ]

  for (let i = 0; i < roles.length; i++) {
    await payload
      .create({
        collection: 'roles',
        data: roles[i],
      })
      .catch((error) => {
        // Gracefully fail, if the role already exists
        console.error(error)
      })
  }
}

async function createAdmin(payload: Payload) {
  const adminRole = await payload.find({
    collection: 'roles',
    where: {
      role: { equals: 'admin' },
    },
  })

  const admin: Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'> = {
    username: 'admin',
    surname: 'Surname',
    name: 'Name',
    password: 'admin',
    email: 'admin@example.com',

    role: adminRole.docs[0].id,
  }

  await payload
    .create({
      collection: 'users',
      data: admin,
    })
    .catch((error) => {
      // Gracefully fail, if admin already exists
      console.error(error)
    })
}
