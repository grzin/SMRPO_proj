import type { CollectionConfig } from 'payload'
import { isProjectMember } from './access/is-project-member'

const projectRoles = [
  {
    label: 'Skrbnik metodologije',
    value: 'methodology_manager',
  },
  {
    label: 'Produktni vodja',
    value: 'product_manager',
  },
  {
    label: 'Član razvojne skupine',
    value: 'developer',
  },
]

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: isProjectMember,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      index: false,
    },
    {
      name: 'members',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: projectRoles,
          required: true,
        },
      ],
    },
    {
      name: 'stories',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
    },
  ],
}
