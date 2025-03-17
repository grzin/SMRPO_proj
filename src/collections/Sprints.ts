import { ValidationError, type CollectionBeforeValidateHook, type CollectionConfig } from 'payload'
import { userAccess } from './access/user-access'
import { isAdmin } from './access/is-admin'
import { date } from 'payload/shared'
import { Sprint } from '@/payload-types'

const beforeValidateHook: CollectionBeforeValidateHook<Sprint> = async ({
  req,
  data,
  originalDoc,
}) => {
  const payload = req.payload

  const entries = (
    await payload.find({
      collection: 'sprints',
      pagination: false,
      where: { id: { not_equals: originalDoc?.id } },
    })
  ).docs

  entries.forEach((entry) => {
    if (
      data?.start &&
      new Date(data?.start) > new Date(entry.start) &&
      new Date(data?.start) < new Date(entry.end)
    ) {
      throw new ValidationError({
        errors: [{ path: 'start', message: 'Sprint start date cannot overlap another sprint.' }],
      })
    }
    if (
      data?.end &&
      new Date(data?.end) > new Date(entry.start) &&
      new Date(data?.end) < new Date(entry.end)
    ) {
      throw new ValidationError({
        errors: [{ path: 'end', message: 'Sprint end date cannot overlap another sprint.' }],
      })
    }
    if (
      data?.start &&
      data?.end &&
      new Date(data?.start) < new Date(entry.start) &&
      new Date(data?.end) > new Date(entry.end)
    ) {
      throw new ValidationError({
        errors: [{ path: 'start', message: 'Sprint cannot overlap another sprint.' }],
      })
    }
  })

  return
}

export const Sprints: CollectionConfig = {
  slug: 'sprints',
  access: {
    read: userAccess,
    create: userAccess,
    update: userAccess,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [beforeValidateHook],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'start',
      type: 'date',
      required: true,
      validate: (value, args) => {
        if (value && new Date(value) < new Date()) return 'Date cannot be before current date.'
        return date(value, args)
      },
    },
    {
      name: 'end',
      type: 'date',
      required: true,
      validate: (value, args) => {
        // @ts-ignore
        let data: Sprint = args.data
        if (value && value < new Date(data.start)) return 'End date cannot be before start date.'
        return date(value, args)
      },
    },
    {
      name: 'speed',
      type: 'number',
      required: true,
      min: 0,
    },
  ],
  timestamps: true,
}
