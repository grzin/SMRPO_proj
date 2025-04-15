import type { CollectionConfig } from 'payload'
import { isProjectMember } from './access/is-project-member'
import { isAdmin } from './access/is-admin'

const projectRoles = [
  {
    label: 'Scrum master',
    value: 'scrum_master',
  },
  {
    label: 'Scrum master & Developer',
    value: 'scrum_master_developer',
  },
  {
    label: 'Product owner',
    value: 'product_owner',
  },
  {
    label: 'Product owner & Developer',
    value: 'product_owner_developer',
  },
  {
    label: 'Developer',
    value: 'developer',
  },
]

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: isProjectMember,
    create: isAdmin,
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
      name: 'description',
      type: 'text',
      required: false,
      unique: false,
      index: false,
    },
    {
      name: 'key',
      type: 'text',
      hooks: {
        afterRead: [
          ({ data }) => {
            return data?.name?.toLowerCase() ?? ''
          },
        ],
        beforeChange: [
          ({ data }) => {
            return data?.name?.toLowerCase() ?? ''
          },
        ],
      },
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
    {
      name: 'documentation',
      type: 'text',
      required: false,
      unique: false,
      index: false,
    },
  ],
}
