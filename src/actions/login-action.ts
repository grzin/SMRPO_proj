'use server'
import { User } from '@/payload-types'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, Payload } from 'payload'
import { z } from 'zod'
import { headers as getHeaders } from 'next/headers'

const usernameValidator = z
  .string({
    invalid_type_error: 'Invalid username',
  })
  .min(1, {
    message: 'Username is required',
  })

const passwordValidator = z
  .string({
    invalid_type_error: 'Invalid password',
  })
  .min(12, { message: 'Password must be at leas 12 characters long' })
  .max(128, { message: 'Password must be at most 128 characters long' })

const nameValidators = z
  .string({
    invalid_type_error: 'Invalid name',
  })
  .min(1, { message: 'Name is required' })

const surnameValidators = z
  .string({
    invalid_type_error: 'Invalid surname',
  })
  .min(1, { message: 'Surname is required' })

const emailValidator = z
  .string({
    invalid_type_error: 'Invalid email',
  })
  .email({ message: 'Invalid email' })

const registerSchema = z.object({
  username: usernameValidator,
  password: passwordValidator,
  passwordRepeat: passwordValidator,
  name: nameValidators,
  surname: surnameValidators,
  email: emailValidator,
})

export async function loginAction({}, formData: FormData) {
  const payload = await getPayload({ config })

  const response = {
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    message: '',
  }

  const data = {
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  }

  const result: any = await payload
    .login({
      collection: 'users',
      data: {
        username: data.username,
        password: data.password,
      },
    })
    .catch((error) => {
      return {}
    })

  if (!result.token) {
    response.message = 'Username or password incorrect'
    return response
  }

  const cookieStore = await cookies()
  cookieStore.set('payload-token', result.token, { httpOnly: true, secure: false, path: '/' })
  redirect('/')
}

function firstError(fieldErrors: any) {
  const keys = Object.keys(fieldErrors)
  const errors: any = {}

  for (const key of keys) {
    errors[key] = ''
    if (fieldErrors[key].length > 0) {
      errors[key] = fieldErrors[key][0]
    }
  }
  return errors
}

export async function registerAction({}, formData: FormData) {
  const payload = await getPayload({ config })

  const response = {
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    passwordRepeat: formData.get('password-repeat')?.toString() ?? '',
    name: formData.get('name')?.toString() ?? '',
    surname: formData.get('surname')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    message: '',
    error: {
      username: '',
      password: '',
      passwordRepeat: '',
      name: '',
      surname: '',
      email: '',
    },
  }

  const validatedFields = registerSchema.safeParse({
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    passwordRepeat: formData.get('password-repeat')?.toString() ?? '',
    name: formData.get('name')?.toString() ?? '',
    surname: formData.get('surname')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    response.error = firstError(validatedFields.error.flatten().fieldErrors)
    console.log(response)
    return response
  }

  const data = validatedFields.data

  if (data.password !== data.passwordRepeat) {
    response.error.passwordRepeat = 'Passwords do not match'
    return response
  }

  const duplicateUsers = await payload.find({
    collection: 'users',
    where: { username: { equals: data.username } },
  })

  if (duplicateUsers.totalDocs > 0) {
    response.error.username = 'Username already exists'
    return response
  }

  let isError = false
  await payload
    .create({
      collection: 'users',
      data: {
        username: data.username,
        password: data.password,
        name: data.name,
        surname: data.surname,
        email: data.email,
        role: 'user',
      },
    })
    .catch((error) => {
      isError = true
    })

  if (isError) {
    response.message = 'Failed to create user'
    return response
  }

  const loginResult: any = await payload
    .login({
      collection: 'users',
      data: {
        username: data.username,
        password: data.password,
      },
    })
    .catch((error) => {
      return {}
    })

  if (!loginResult.token) {
    response.message = 'Failed to automatically login'
    return response
  }

  const cookieStore = await cookies()
  cookieStore.set('payload-token', loginResult.token, { httpOnly: true, secure: false, path: '/' })
  redirect('/')
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')

    redirect('/login')
  } catch (error) {
    return { success: false, error: 'An error occurred during logout' }
  }
}

export async function getUser(): Promise<User> {
  const headers = await getHeaders()
  const payload: Payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  if (!user) {
    redirect('/login')
  }

  return user
}
