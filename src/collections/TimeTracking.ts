import type { CollectionConfig } from 'payload'
import { userAccess } from './access/user-access'

export const TimeTracking: CollectionConfig = {
  slug: 'timeTracking',
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
      name: 'start',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}
