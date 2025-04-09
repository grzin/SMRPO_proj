import { z } from 'zod'
import Holidays from 'date-holidays'

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
  .transform((val) => val.toLowerCase())

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
  .transform((val) => val.toLowerCase())

export const roleValidator = z.enum(['admin', 'user']).default('user')

export const idValidator = z
  .string()
  .refine((val) => val !== null && val !== '', {
    message: 'Value cannot be null or empty',
  })
  .transform((val) => {
    const parsed = Number(val)
    return parsed
  })
  .refine((val) => !isNaN(val), {
    message: 'Value must be a valid number',
  })

export const sprintNameValidator = z
  .string({
    invalid_type_error: 'Invalid sprint name',
  })
  .min(1, 'Name is required')

export const sprintStartDateValidator = z
  .date()
  .min(new Date(new Date().setUTCHours(0, 0, 0, 0)), 'Sprint must start after current date')
  .superRefine((date, ctx) => {
    const hd = new Holidays('SI')
    const day = date.getDay()

    if (day === 6 || day === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'Sprint cannot start on a weekend',
      })
    }
    if (hd.isHoliday(date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: 'Sprint cannot start on a holiday',
      })
    }
  })

export const sprintEndDateValidator = z.date().superRefine((date, ctx) => {
  const hd = new Holidays('SI')
  const day = date.getDay()

  if (day === 6 || day === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      message: 'Sprint cannot end on a weekend',
    })
  }
  if (hd.isHoliday(date)) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      message: 'Sprint cannot end on a holiday',
    })
  }
})

export const sprintVelocityValidator = z.number().min(1, 'Enter valid (positive) sprint velocity')

export const sprintProjectValidator = z.number().min(0, 'Invalid project id')

export const projectName = z.string().min(1, { message: 'Project name is required' })
