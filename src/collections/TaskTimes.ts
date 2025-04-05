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
      type: 'number',
      required: true,
    },
    {
      name: 'start',
      type: 'date',
      required: true,
    },
    {
      name: 'end',
      type: 'date',
      required: false,
    },
    {
      name: 'customHMS',
      type: 'text',
      required: false,
    },
  ],
  timestamps: true,
}
