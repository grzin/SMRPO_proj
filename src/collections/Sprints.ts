import type { CollectionConfig } from 'payload'
import { userAccess } from './access/user-access'
import { date } from 'payload/shared'
import { Sprint } from '@/payload-types'

export const Sprints: CollectionConfig = {
  slug: 'sprints',
  access: {
    read: userAccess,
    create: userAccess,
    update: userAccess,
    delete: userAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      validate: (value, args) => {
        if (value && new Date(value) < new Date())
          return 'Start date cannot be before current date.'
        return date(value, args)
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      validate: (value, args) => {
        // @ts-ignore
        let data: Sprint = args.data
        if (value && new Date(value) < new Date(data.startDate))
          return 'End date cannot be before start date.'
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
