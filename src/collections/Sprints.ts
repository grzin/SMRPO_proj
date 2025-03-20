import type { CollectionConfig } from 'payload'
import { userAccess } from './access/user-access'

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
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'speed',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
  ],
  timestamps: true,
}
