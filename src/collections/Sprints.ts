import type { CollectionConfig } from 'payload'
import { isSprintProjectMember } from './access/sprint-access'

export const Sprints: CollectionConfig = {
  slug: 'sprints',
  access: {
    read: isSprintProjectMember,
    create: isSprintProjectMember,
    update: isSprintProjectMember,
    delete: isSprintProjectMember,
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
      name: 'velocity',
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
