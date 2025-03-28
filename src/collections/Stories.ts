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
      name: 'description',
      type: 'textarea',
      required: true,
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
      required: true,
    },
  ],
}
