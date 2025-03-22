'use server'

import { z } from 'zod'
import config from '@/payload.config'
import { getPayload } from 'payload'
import {
  firstError,
  idValidator,
  sprintNameValidator,
  sprintStartDateValidator,
  sprintEndDateValidator,
  sprintVelocityValidator,
  sprintProjectValidator,
} from './validators'
import { getUser } from './login-action'
import { redirect } from 'next/navigation'

const createSchema = z.object({
  name: sprintNameValidator,
  startDate: sprintStartDateValidator,
  endDate: sprintEndDateValidator,
  velocity: sprintVelocityValidator,
  project_id: sprintProjectValidator,
})

const editSchema = z.object({
  id: idValidator,
  name: sprintNameValidator,
  startDate: sprintStartDateValidator,
  endDate: sprintEndDateValidator,
  velocity: sprintVelocityValidator,
  project_id: sprintProjectValidator,
})

const deleteSchema = z.object({
  id: idValidator,
})

export async function createSprintAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    name: formData.get('name')?.toString() ?? '',
    startDate: formData.get('startDate')?.toString() ?? '',
    endDate: formData.get('endDate')?.toString() ?? '',
    velocity: Number(formData.get('velocity')?.toString()),
    project_id: Number(formData.get('project_id')?.toString()),
    message: '',
    error: {
      name: '',
      startDate: '',
      endDate: '',
      velocity: '',
      project_id: '',
    },
  }

  const validatedFields = createSchema.safeParse({
    name: formData.get('name')?.toString() ?? '',
    startDate: new Date(formData.get('startDate')?.toString() ?? ''),
    endDate: new Date(formData.get('endDate')?.toString() ?? ''),
    velocity: Number(formData.get('velocity')?.toString()),
    project_id: Number(formData.get('project_id')?.toString()),
  })

  if (!validatedFields.success) {
    response.error = firstError(validatedFields.error.flatten().fieldErrors)
    return response
  }

  const data = validatedFields.data

  if (data.endDate < data.startDate) {
    response.error.endDate = 'Sprint must end after start date'
    return response
  }

  const projectExists = await payload.find({
    collection: 'projects',
    where: {
      id: { equals: data.project_id },
    },
  })

  if (projectExists.totalDocs === 0) {
    response.error.project_id = 'Invalid project'
    return response
  }

  const duplicateSprints = await payload.find({
    collection: 'sprints',
    where: {
      and: [{ project: { equals: data.project_id } }, { name: { equals: data.name } }],
    },
  })

  if (duplicateSprints.totalDocs > 0) {
    response.error.name = 'Sprint name already exists'
    return response
  }

  const overlapingSprints = await payload.find({
    collection: 'sprints',
    where: {
      and: [
        { project: { equals: data.project_id } },
        {
          or: [
            {
              and: [
                { startDate: { greater_than_equal: data.startDate.toISOString() } },
                { startDate: { less_than_equal: data.endDate.toISOString() } },
              ],
            },
            {
              and: [
                { endDate: { greater_than_equal: data.startDate.toISOString() } },
                { endDate: { less_than_equal: data.endDate.toISOString() } },
              ],
            },
            {
              and: [
                { startDate: { less_than_equal: data.startDate.toISOString() } },
                { endDate: { greater_than_equal: data.endDate.toISOString() } },
              ],
            },
          ],
        },
      ],
    },
  })

  if (overlapingSprints.totalDocs > 0) {
    response.error.name = 'Sprint must not overlap with existing sprints'
    return response
  }

  let isError = false
  const newSprint = await payload
    .create({
      collection: 'sprints',
      data: {
        name: data.name,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        velocity: data.velocity,
        project: data.project_id,
      },
      overrideAccess: false,
      user: user,
    })
    .catch((_error) => {
      isError = true
    })

  if (newSprint) {
    redirect('/sprints/' + newSprint.id)
  }

  if (isError) {
    response.message = 'Failed to create sprint'
    return response
  }
  response.message = 'Sprint created successfully'
  return response
}

export async function editSprintAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    name: formData.get('name')?.toString() ?? '',
    startDate: formData.get('startDate')?.toString() ?? '',
    endDate: formData.get('endDate')?.toString() ?? '',
    velocity: Number(formData.get('velocity')?.toString()),
    project_id: Number(formData.get('project_id')?.toString()),
    message: '',
    error: {
      name: '',
      startDate: '',
      endDate: '',
      velocity: '',
      project_id: '',
    },
  }

  const validatedFields = editSchema.safeParse({
    id: formData.get('id')?.toString() ?? '',
    name: formData.get('name')?.toString() ?? '',
    startDate: new Date(formData.get('startDate')?.toString() ?? ''),
    endDate: new Date(formData.get('endDate')?.toString() ?? ''),
    velocity: Number(formData.get('velocity')?.toString()),
    project_id: Number(formData.get('project_id')?.toString()),
  })

  if (!validatedFields.success) {
    response.error = firstError(validatedFields.error.flatten().fieldErrors)
    return response
  }

  const data = validatedFields.data

  if (data.endDate < data.startDate) {
    response.error.endDate = 'Sprint must end after start date'
    return response
  }

  const duplicateSprints = await payload.find({
    collection: 'sprints',
    where: {
      and: [
        { project: { equals: data.project_id } },
        { name: { equals: data.name } },
        { id: { not_equals: data.id } },
      ],
    },
  })

  if (duplicateSprints.totalDocs > 0) {
    response.error.name = 'Sprint name already exists'
    return response
  }

  const overlapingSprints = await payload.find({
    collection: 'sprints',
    where: {
      and: [
        { project: { equals: data.project_id } },
        { id: { not_equals: data.id } },
        {
          or: [
            {
              and: [
                { startDate: { greater_than_equal: data.startDate.toISOString() } },
                { startDate: { less_than_equal: data.endDate.toISOString() } },
              ],
            },
            {
              and: [
                { endDate: { greater_than_equal: data.startDate.toISOString() } },
                { endDate: { less_than_equal: data.endDate.toISOString() } },
              ],
            },
            {
              and: [
                { startDate: { less_than_equal: data.startDate.toISOString() } },
                { endDate: { greater_than_equal: data.endDate.toISOString() } },
              ],
            },
          ],
        },
      ],
    },
  })

  if (overlapingSprints.totalDocs > 0) {
    response.error.name = 'Sprint must not overlap with existing sprints'
    return response
  }

  let isError = false
  await payload
    .update({
      collection: 'sprints',
      data: {
        name: data.name,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        velocity: data.velocity,
        project: data.project_id,
      },
      where: {
        id: { equals: data.id },
      },
      overrideAccess: false,
      user: user,
    })
    .catch((_error) => {
      isError = true
    })

  if (isError) {
    response.message = 'Failed to update sprint'
    return response
  }

  response.message = 'Sprint updated successfully'
  return response
}

export async function deleteSprintAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const validatedFields = deleteSchema.safeParse({
    id: formData.get('id')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    return {
      message: 'Failed to delete sprint',
    }
  }

  let isError = false

  await payload
    .delete({
      collection: 'sprints',
      where: {
        id: { equals: validatedFields.data.id },
      },
      overrideAccess: false,
      user: user,
    })
    .catch(() => {
      isError = true
    })

  if (isError) {
    return {
      message: 'Failed to delete sprint',
    }
  }

  redirect('/sprints')
}
