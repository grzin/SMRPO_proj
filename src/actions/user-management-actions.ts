'use server'

import { z } from 'zod'
import config from '@/payload.config'
import { getPayload } from 'payload'
import {
  emailValidator,
  firstError,
  idValidator,
  nameValidators,
  passwordValidator,
  roleValidator,
  surnameValidators,
  usernameValidator,
} from './validators'
import { getUser } from './login-action'
import { redirect } from 'next/navigation'

const createSchema = z.object({
  username: usernameValidator,
  password: passwordValidator,
  passwordRepeat: passwordValidator,
  name: nameValidators,
  surname: surnameValidators,
  email: emailValidator,
  role: roleValidator,
})

const editSchema = z.object({
  id: idValidator,
  username: usernameValidator,
  name: nameValidators,
  surname: surnameValidators,
  email: emailValidator,
  role: roleValidator,
})

const passwordSchema = z.object({
  id: idValidator,
  password: passwordValidator,
})

const deleteSchema = z.object({
  id: idValidator,
})

// Administration
export async function createUserAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

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
      role: '',
    },
  }

  const validatedFields = createSchema.safeParse({
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    passwordRepeat: formData.get('password-repeat')?.toString() ?? '',
    name: formData.get('name')?.toString() ?? '',
    surname: formData.get('surname')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    role: formData.get('role')?.toString() ?? '',
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
    where: { or: [{ username: { equals: data.username } }, { email: { equals: data.email } }] },
  })

  if (duplicateUsers.totalDocs > 0) {
    if (duplicateUsers.docs[0].username === data.username) {
      response.error.username = 'Username already exists'
    }
    if (duplicateUsers.docs[0].email === data.email) {
      response.error.email = 'Email already exists'
    }
    return response
  }

  let isError = false
  const newUser = await payload
    .create({
      collection: 'users',
      data: {
        username: data.username,
        password: data.password,
        name: data.name,
        surname: data.surname,
        email: data.email,
        role: data.role,
      },
      overrideAccess: false,
      user: user,
    })
    .catch((_error) => {
      isError = true
    })

  if (newUser) {
    redirect('/users/' + newUser.id)
  }

  if (isError) {
    response.message = 'Failed to create user'
    return response
  }
  response.message = 'User created successfully'
  return response
}

export async function editUserAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    username: formData.get('username')?.toString() ?? '',
    name: formData.get('name')?.toString() ?? '',
    surname: formData.get('surname')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    role: formData.get('role')?.toString() ?? '',
    message: '',
    error: {
      username: '',
      name: '',
      surname: '',
      email: '',
      role: '',
    },
  }

  const validatedFields = editSchema.safeParse({
    id: formData.get('id')?.toString() ?? '',
    username: formData.get('username')?.toString() ?? '',
    name: formData.get('name')?.toString() ?? '',
    surname: formData.get('surname')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    role: formData.get('role')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    response.error = firstError(validatedFields.error.flatten().fieldErrors)
    return response
  }

  const data = validatedFields.data

  const duplicateUsers = await payload.find({
    collection: 'users',
    where: {
      and: [
        { or: [{ username: { equals: data.username } }, { email: { equals: data.email } }] },
        { id: { not_equals: data.id } },
      ],
    },
  })

  if (duplicateUsers.totalDocs > 0) {
    if (duplicateUsers.docs[0].username === data.username) {
      response.error.username = 'Username already exists'
    }
    if (duplicateUsers.docs[0].email === data.email) {
      response.error.email = 'Email already exists'
    }
    return response
  }

  let isError = false
  await payload
    .update({
      collection: 'users',
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        role: data.role,
      },
      where: {
        id: { equals: data.id },
      },
      overrideAccess: false,
      user: user,
    })
    .catch((_error) => {
      isError = true
    })

  if (isError) {
    response.message = 'Failed to update user'
    return response
  }

  response.message = 'User updated successfully'
  return response
}

export async function changePasswordAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    password: '',
    message: '',
    error: {
      id: '',
      password: '',
    },
  }

  const validatedFields = passwordSchema.safeParse({
    id: formData.get('id')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    response.error = firstError(validatedFields.error.flatten().fieldErrors)
    return response
  }

  const data = validatedFields.data

  let isError = false
  await payload
    .update({
      collection: 'users',
      data: {
        password: data.password,
      },
      where: {
        id: { equals: data.id },
      },
      overrideAccess: false,
      user: user,
    })
    .catch((_error) => {
      isError = true
    })

  if (isError) {
    response.message = 'Failed to update user password'
    return response
  }

  response.message = 'User password updated successfully'
  return response
}

export async function deleteUserAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const validatedFields = deleteSchema.safeParse({
    id: formData.get('id')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    return {
      message: 'Failed to delete user',
    }
  }

  let isError = false

  await payload
    .delete({
      collection: 'users',
      where: {
        id: { equals: validatedFields.data.id },
      },
      overrideAccess: false,
      user: user,
    })
    .catch(() => {
      isError = true
    })

  if (isError) {
    return {
      message: 'Failed to delete user',
    }
  }

  redirect('/users')
}
