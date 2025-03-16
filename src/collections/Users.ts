import type { Access, CollectionConfig } from 'payload'
import { isAdmin } from './access/is-admin'
import { userAccess } from './access/user-access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: userAccess,
    create: userAccess,
    update: userAccess,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'surname',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
    },
  ],
  timestamps: true,
}
