import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'titleLowerCase',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'realized',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'rejectComment',
      type: 'text',
      required: false,
    },
    {
      name: 'acceptanceTests',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'test',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      options: ['must have', 'should have', 'could have', "won't have this time"],
      required: true,
    },
    {
      name: 'businessValue',
      type: 'number',
      required: true,
    },
    {
      name: 'timeEstimate',
      type: 'number',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'sprint',
      type: 'relationship',
      relationTo: 'sprints',
      required: false,
    },
    {
      name: 'tasks',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'estimate',
          type: 'number',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: ['accepted', 'pending', 'unassigned', 'active'],
          required: true,
        },
        {
          name: 'taskedUser',
          type: 'relationship',
          relationTo: 'users',
          required: false,
        },
        {
          name: 'realized',
          type: 'checkbox',
          required: true,
        },
      ],
      required: false,
    },
  ],
}
