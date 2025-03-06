import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'role',
  },
  fields: [
    {
      name: 'role',
      type: 'text',
      index: true,
      required: true,
      unique: true,
    },
  ],
  timestamps: true,
}
