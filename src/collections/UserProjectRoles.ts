import type { CollectionConfig } from 'payload'

export const UserProjectRoles: CollectionConfig = {
  slug: 'userProjectRoles',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'project-roles',
      required: false,
    },
  ],
  timestamps: true,
}
