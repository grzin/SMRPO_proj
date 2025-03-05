'use server'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { z } from 'zod'

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

export async function loginAction(prevState: { message: string }, formData: FormData) {
  const payload = await getPayload({ config })

  const validatedFields = loginSchema.safeParse({
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    return { ...validatedFields.error.flatten().fieldErrors, message: '' }
  }

  const result = await payload
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

  return { message: 'Login successfull', username: '', password: '' }
}
