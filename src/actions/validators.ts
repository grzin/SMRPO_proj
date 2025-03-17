import { z } from 'zod'

export function firstError(fieldErrors: any) {
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

export const usernameValidator = z
  .string({
    invalid_type_error: 'Invalid username',
  })
  .min(1, {
    message: 'Username is required',
  })

export const passwordValidator = z
  .string({
    invalid_type_error: 'Invalid password',
  })
  .min(12, { message: 'Password must be at leas 12 characters long' })
  .max(128, { message: 'Password must be at most 128 characters long' })

export const nameValidators = z
  .string({
    invalid_type_error: 'Invalid name',
  })
  .min(1, { message: 'Name is required' })

export const surnameValidators = z
  .string({
    invalid_type_error: 'Invalid surname',
  })
  .min(1, { message: 'Surname is required' })

export const emailValidator = z
  .string({
    invalid_type_error: 'Invalid email',
  })
  .email({ message: 'Invalid email' })

export const roleValidator = z.enum(['admin', 'user']).default('user')

export const idValidator = z.preprocess((val) => Number(val), z.number())
