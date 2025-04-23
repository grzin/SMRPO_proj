import type { CollectionConfig } from 'payload'
import { userAccess } from './access/user-access'

export const TaskTimes: CollectionConfig = {
  slug: 'taskTimes',
  access: {
    read: userAccess,
    create: userAccess,
    update: userAccess,
    delete: userAccess,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'task',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'text',
      required: true,
    },
    {
      name: 'hours',
      type: 'number',
      required: true,
    },
    {
      name: 'minutes',
      type: 'number',
      required: true,
    },
    {
      name: 'seconds',
      type: 'number',
      required: true,
    },
    {
      name: 'est_hours',
      type: 'number',
      required: true,
    },
    {
      name: 'est_minutes',
      type: 'number',
      required: true,
    },
    {
      name: 'est_seconds',
      type: 'number',
      required: true,
    },
  ],
  timestamps: true,
}
