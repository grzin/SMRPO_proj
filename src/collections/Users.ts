import type { CollectionBeforeLoginHook, CollectionConfig } from 'payload'
import { isAdmin } from './access/is-admin'
import { userAccess } from './access/user-access'
import { User } from '@/payload-types'

const beforeLoginHook: CollectionBeforeLoginHook<User> = async ({ req, user }) => {
  const payload = req.payload
  const loginDate = new Date()
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      lastLogin: loginDate.toLocaleDateString() + ' ' + loginDate.toLocaleTimeString(),
    },
  })
  return user
}

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
  hooks: {
    beforeLogin: [beforeLoginHook],
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
    {
      name: 'lastLogin',
      type: 'text',
      required: false,
    },
  ],
  timestamps: true,
}
