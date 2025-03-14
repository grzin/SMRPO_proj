import { User } from '@/payload-types'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { getPayload, Payload } from 'payload'

// Seed the databse with test data
export async function GET() {
  const payload = await getPayload({ config })

  await createRoles(payload)
  await createAdmin(payload)
  await createProjectRoles(payload)
  await createProjects(payload)
  await createUserProjectRoles(payload)

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

  const djkhaleed: Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'> = {
    username: 'djk',
    password: 'anotherone',
    name: 'another one',
    email: '',
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


