'use server'
import { User } from '@/payload-types'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, Payload } from 'payload'
import { z } from 'zod'
import { headers as getHeaders } from 'next/headers'

const loginSchema = z.object({
  username: z
    .string({
      invalid_type_error: 'Invalid username',
    })
    .min(3, {
      message: 'Username must be at least 3 characters long',
    }),
  password: z.string({
    invalid_type_error: 'Invalid password',
  }),
})

export async function loginAction({}, formData: FormData) {
  const payload = await getPayload({ config })

  const validatedFields = loginSchema.safeParse({
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    return { ...validatedFields.error.flatten().fieldErrors, message: '' }
  }

  const result: any = await payload
    .login({
      collection: 'users',
      data: {
        username: formData.get('username')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
      },
    })
    .catch((error) => {
      return { message: 'Failed to login', username: '', password: '' }
    })

  if (!result.token) {
    return { message: 'Username or password incorrect', username: '', password: '' }
  }

  const cookieStore = await cookies()
  cookieStore.set('payload-token', result.token, { httpOnly: true, secure: false, path: '/' })
  redirect('/dashboard')
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')

    redirect('/dashboard')
  } catch (error) {
    return { success: false, error: 'An error occurred during logout' }
  }
}

export async function getUser(): Promise<User> {
  const headers = await getHeaders()
  const payload: Payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  if (!user) {
    redirect('/')
  }

  return user
}
