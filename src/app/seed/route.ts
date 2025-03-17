import { Sprint, User } from '@/payload-types'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { getPayload, Payload } from 'payload'

// Seed the databse with test data
export async function GET() {
  const payload = await getPayload({ config })

  await createAdmin(payload)
  await createProjectRoles(payload)
  await createProjects(payload)
  await createUserProjectRoles(payload)
  await createTestUsers(payload)
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

async function createProjectRoles(payload: Payload) {
  const roles = [
    {
      role: 'Član razvojne skupine',
    },
    {
      role: 'Produktni vodja',
    },
    {
      role: 'Skrbnik metodologije',
    },
  ]

  for (let i = 0; i < roles.length; i++) {
    await payload
      .create({
        collection: 'project-roles',
        data: roles[i],
      })
      .catch((error) => {
        // Gracefully fail, if the role already exists
        console.error(error)
      })
  }
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
        data: names[i],
      })
      .catch((error) => {
        // Gracefully fail, if the role already exists
        console.error(error)
      })
  }
}

async function createUserProjectRoles(payload: Payload) {
  const uprs = [
    {
      user: 10,
      project: 4,
      role: 1,
    },
    {
      user: 9,
      project: 1,
      role: 1,
    },
    {
      user: 9,
      project: 1,
      role: 2,
    },
    {
      user: 10,
      project: 4,
      role: 2,
    },
  ]

  for (let i = 0; i < uprs.length; i++) {
    await payload
      .create({
        collection: 'userProjectRoles',
        data: uprs[i],
      })
      .catch((error) => {
        // Gracefully fail, if the role already exists
        console.error(error)
      })
  }
}

async function createSprints(payload: Payload) {
  const sprints: Omit<Sprint, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>[] = [
    {
      name: 'Sprint #1',
      startDate: '2025-03-17:00:00.000Z',
      endDate: '2025-03-20:00:00.000Z',
      speed: 3,
    },
    {
      name: 'Sprint #2',
      startDate: '2025-03-24:00:00.000Z',
      endDate: '2025-03-28T12:00:00.000Z',
      speed: 6,
    },
    {
      name: 'Sprint #3',
      startDate: '2025-03-30:00:00.000Z',
      endDate: '2025-03-31:00:00.000Z',
      speed: 4,
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
