import type { CollectionConfig } from 'payload'

export const ProjectRoles: CollectionConfig = {
  slug: 'project-roles',
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
