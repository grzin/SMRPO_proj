import type { CollectionConfig } from 'payload'
import { userAccess } from './access/user-access'

export const WallMessages: CollectionConfig = {
  slug: 'wall-messages',
  access: {
    read: userAccess,
    create: userAccess,
    update: userAccess,
    delete: userAccess,
  },
  fields: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
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
