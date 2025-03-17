import type { CollectionBeforeLoginHook, CollectionConfig } from 'payload'
import { isAdmin, isAdminField } from './access/is-admin'
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

const userRoles = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
]

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: userAccess,
    update: userAccess,
    create: isAdmin,
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
      options: userRoles,
      defaultValue: 'user',
      required: true,
      access: {
        update: isAdminField,
        create: isAdminField,
      },
    },
    {
      name: 'lastLogin',
      type: 'text',
      required: false,
    },
  ],
  timestamps: true,
}
