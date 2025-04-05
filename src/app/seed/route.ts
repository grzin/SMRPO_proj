import { Sprint, User } from '@/payload-types'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { getPayload, Payload } from 'payload'
import { defaultDocumentation } from './default_documentation'

// Seed the databse with test data
export async function GET() {
  const payload = await getPayload({ config })

  await createAdmin(payload)
  await createTestUsers(payload)
  await createProjects(payload)
  await createSprints(payload)

  return NextResponse.json({ success: true })
}

async function createTestUsers(payload: Payload) {
  for (let i = 0; i < 10; i++) {
    const user: Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'> = {
      username: `user${i}`,
      surname: `Surname${i}`,
      name: `Name${i}`,
      password: `test`,
      email: `user${i}@example.com`,
      role: 'user',
    }

    await payload.create({
      collection: 'users',
      data: user,
    })
  }
}

async function createAdmin(payload: Payload) {
  const admin: Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'> = {
    username: 'admin',
    surname: 'Surname',
    name: 'Name',
    password: 'admin',
    email: 'admin@example.com',
    role: 'admin',
  }

  const djkhaleed: Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'> = {
    username: 'djk',
    password: 'anotherone',
    name: 'another',
    surname: 'one',
    email: '',
    role: 'admin',
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

  await payload
    .create({
      collection: 'users',
      data: djkhaleed,
    })
    .catch((error) => {
      // Gracefully fail, if djkhaleed already exists
      console.error(error)
    })
}

async function createProjects(payload: Payload) {
  const names = [
    {
      name: 'Testni projekt',
    },
    {
      name: 'Resni projekt',
    },
    {
      name: 'Projekt na katerem ni noben',
    },
    {
      name: 'Project Rockwell B-1 Lancer',
    },
  ]

  for (let i = 0; i < names.length; i++) {
    await payload
      .create({
        collection: 'projects',
        data: {
          name: names[i].name,
          members: [
            {
              user: 1,
              role: 'methodology_manager',
            },
            {
              user: 2,
              role: 'product_manager',
            },
            {
              user: 3,
              role: 'developer',
            },
          ],
          documentation: defaultDocumentation,
        },
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

async function createSprints(payload: Payload) {
  const sprints: Omit<Sprint, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>[] = [
    {
      name: 'Sprint #1 - Past sprint',
      startDate: '2025-03-17T00:00:00.000Z',
      endDate: '2025-03-21T00:00:00.000Z',
      velocity: 3,
      project: 1,
    },
    {
      name: 'Sprint #2 - Current sprint',
      startDate: '2025-03-21T00:00:00.000Z',
      endDate: '2025-06-13T12:00:00.000Z',
      velocity: 6,
      project: 2,
    },
    {
      name: 'Sprint #3 - Future sprint',
      startDate: '2025-07-23T00:00:00.000Z',
      endDate: '2025-07-27T00:00:00.000Z',
      velocity: 4,
      project: 3,
    },
    {
      name: 'Sprint #4',
      startDate: '2025-06-16T00:00:00.000Z',
      endDate: '2025-06-20T00:00:00.000Z',
      velocity: 5,
      project: 2,
    },
  ]

  for (let i = 0; i < sprints.length; i++) {
    await payload
      .create({
        collection: 'sprints',
        data: sprints[i],
      })
      .catch((error) => {
        // Gracefully fail, if the sprint already exists
        console.error(error)
      })
  }
}
