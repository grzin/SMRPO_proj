'use server'
import { User } from '@/payload-types'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, Payload } from 'payload'
import { z } from 'zod'
import { headers as getHeaders } from 'next/headers'
import {
  emailValidator,
  firstError,
  nameValidators,
  passwordValidator,
  surnameValidators,
  usernameValidator,
} from './validators'

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
    .catch((_error) => {
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

export async function registerAction({}, formData: FormData) {
  const payload = await getPayload({ config })

  const response = {
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    passwordRepeat: formData.get('password-repeat')?.toString() ?? '',
    name: formData.get('name')?.toString() ?? '',
    surname: formData.get('surname')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    role: formData.get('role')?.toString() ?? '',
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
    .catch((_error) => {
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
    .catch((_error) => {
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
  } catch (_error) {
    return { success: false, error: 'An error occurred during logout' }
  }
}

export async function getUser(mustBeAdmin?: boolean): Promise<User> {
  const headers = await getHeaders()
  const payload: Payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  if (!user) {
    redirect('/login')
  }

  if (mustBeAdmin && user.role !== 'admin') {
    redirect('/login')
  }

  return user
}
