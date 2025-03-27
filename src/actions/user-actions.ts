'use server'

import { getPayload } from 'payload'
import { z } from 'zod'
import config from '@/payload.config'
import { getUser } from '@/actions/login-action'
import { Story, User } from '@/payload-types'

const updateProfileSchema = z.object({
  username: z.string().min(3),
  email: z.union([z.string().email().optional(), z.literal('')]),
  name: z.string().min(1),
  surname: z.string().min(1),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
})

export async function isMember(user: User, members: { user: User; role: string }[]) {
  return members.some((member) => member.user.id === user.id)
}

export async function isAdminOrMethodologyManager(user: User, members: any[]) {
  const ourUser = members.find((member) => member.user.id === user.id)
  return (
    user.role === 'admin' ||
    ((await isMember(user, members)) &&
      (ourUser?.role === 'methodology_manager' || ourUser?.role === 'product_manager'))
  )
}

export async function isMethodologyManager(user: User, members: any[]) {
  const ourUser = members.find((member) => member.user.id === user.id)
  return (await isMember(user, members)) && ourUser?.role === 'methodology_manager'
}

export async function canDeleteStory(user: User, story: any, members: any[]) {
  return (await isAdminOrMethodologyManager(user, members)) && (!story.sprint || !story.realized)
}

export async function updateProfileAction(formData: FormData) {
  const payload = await getPayload({ config })

  const validatedFields = updateProfileSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email')?.toString(),
    name: formData.get('name'),
    surname: formData.get('surname')
  })

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errorMessages).flat()[0]
    return { error: firstError }
  }

  const user = await getUser()

  // Check for duplicate username
  const existingUser = await payload.find({
    collection: 'users',
    where: {
      username: {
        equals: validatedFields.data.username,
      },
      id: {
        not_equals: user.id, // Exclude the current user from the check
      },
    },
  })

  if (existingUser.totalDocs > 0) {
    return { error: 'Username already exists' }
  }

  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        username: validatedFields.data.username,
        email: validatedFields.data.email,
        name: validatedFields.data.name,
        surname: validatedFields.data.surname
      },
    })
    return { success: true }
  } catch (_errors) {
    return { error: 'Failed to update profile' }
  }
}

export async function updatePasswordAction(formData: FormData) {
  const payload = await getPayload({ config })

  const validatedFields = updatePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  })

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors
    const firstError = Object.values(errorMessages).flat()[0]

    return { error: firstError }
  }

  const user = await getUser()

  // Verify the current password
  let isPasswordValid = true

  await payload
    .login({
      collection: 'users',
      data: {
        username: user.username,
        password: validatedFields.data.currentPassword,
      },
    })
    .catch(() => {
      isPasswordValid = false
    })

  if (!isPasswordValid) {
    return { error: 'Current password is incorrect' }
  }

  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: validatedFields.data.newPassword,
      },
    })
    return { success: true }
  } catch (_error) {
    return { error: 'Failed to update password' }
  }
}
