'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { isAdminOrMethodologyManager, canDeleteStory } from '@/actions/user-actions'
import { getUser } from '@/actions/login-action'
import { Project, Story, User } from '@/payload-types'
import { redirect } from 'next/navigation'

export async function getStoryById(storyId: string) {
  const payload = await getPayload({ config })
  const story = await payload
    .findByID({
      collection: 'stories',
      id: storyId,
    })
    .catch(() => {
      return { error: 'Failed fetching story' }
    })

  return story
}

export async function addStoryAction(formData: FormData, members: any) {
  const payload = await getPayload({ config })
  const user = await getUser()

  // Extract values from FormData
  const title = formData.get('title')?.toString() ?? ''
  const description = formData.get('description')?.toString() ?? ''
  const acceptanceTests = formData
    .getAll('acceptanceTests')
    .map((str) => ({ test: str.toString() }))

  console.log(acceptanceTests)
  const priority = formData.get('priority')?.toString() as
    | 'must have'
    | 'should have'
    | 'could have'
    | "won't have this time"
  const businessValue = parseInt(formData.get('businessValue')?.toString() || 'a', 10)
  const projectId = Number(formData.get('project')?.toString())

  console.log(title, description, acceptanceTests, priority, businessValue, projectId)
  console.log('lel', members)

  if (!isAdminOrMethodologyManager(user, members)) {
    return { error: 'You do not have permission to add a user story' }
  }

  const projectExists = await payload
    .findByID({
      collection: 'projects',
      id: projectId,
    })
    .catch(() => {
      return { error: 'Failed fetching project' }
    })

  if (!projectExists) {
    return { error: 'Invalid project ID' }
  }

  // Check for duplicate title
  const existingStory = await payload.find({
    collection: 'stories',
    where: {
      titleLowerCase: {
        equals: title.toLowerCase(),
      },
    },
  })

  if (existingStory.totalDocs > 0) {
    return { error: 'Story already exists' }
  }

  // Check valid priorities
  if (!['must have', 'should have', 'could have', "won't have this time"].includes(priority)) {
    return { error: 'Invalid priority' }
  }

  // Check business value
  if (isNaN(businessValue)) {
    return { error: 'Business value must be a number' }
  }

  try {
    const savedStory = await payload.create({
      collection: 'stories',
      data: {
        title: title,
        titleLowerCase: title.toLowerCase(),
        description: description,
        acceptanceTests: acceptanceTests,
        priority: priority,
        businessValue: businessValue,
        project: projectId,
        sprint: 1,
      },
    })
    return { data: savedStory }
  } catch (error) {
    console.error('Failed to save user story:', error)
    return { error: 'Failed to save user story' }
  }
}

export async function editStoryAction(formData: FormData, members: any) {
  const payload = await getPayload({ config })
  const user = await getUser()

  // Extract values from FormData
  const title = formData.get('title')?.toString()
  const description = formData.get('description')?.toString()
  const acceptanceTests = formData
    .getAll('acceptanceTests')
    .map((str) => ({ test: str.toString() }))
  const priority = formData.get('priority')?.toString() as
    | 'must have'
    | 'should have'
    | 'could have'
    | "won't have this time"
  const businessValue = parseInt(formData.get('businessValue')?.toString() || 'a', 10)
  const storyId = Number(formData.get('storyId')?.toString())

  console.log(title, description, acceptanceTests, priority, businessValue, storyId)

  const story = await payload
    .findByID({
      collection: 'stories',
      id: storyId,
    })
    .catch(() => {
      return { error: 'Failed fetching story' }
    })

  if ('error' in story) {
    return story
  }

  if (!canDeleteStory(user, story, members)) {
    return { error: 'You do not have permission to edit a user story' }
  }

  // Check for duplicate title
  const existingStory = await payload.find({
    collection: 'stories',
    where: {
      titleLowerCase: {
        equals: title?.toLowerCase(),
      },
      id: {
        not_equals: storyId, // Exclude the current user from the check
      },
    },
  })

  console.log(title)
  console.log(existingStory)

  if (existingStory.totalDocs > 0) {
    return { error: 'Story already exists' }
  }

  // Check valid priorities
  if (!['must have', 'should have', 'could have', "won't have this time"].includes(priority)) {
    return { error: 'Invalid priority' }
  }

  // Check business value
  if (isNaN(businessValue)) {
    return { error: 'Business value must be a number' }
  }

  try {
    const updatedStory = await payload.update({
      collection: 'stories',
      id: storyId,
      data: {
        title: title,
        titleLowerCase: title?.toLowerCase(),
        description: description,
        acceptanceTests: acceptanceTests,
        priority: priority,
        businessValue: businessValue,
      },
    })
    return { data: updatedStory }
  } catch (error) {
    console.error('Failed to save user story:', error)
    return { error: 'Failed to save user story' }
  }
}

export async function deleteStoryAction(storyId: any) {
  const payload = await getPayload({ config })
  const user = await getUser()
  const story = await payload
    .findByID({
      collection: 'stories',
      id: storyId,
    })
    .catch(() => {
      return { error: 'Failed fetching story' }
    })

  if ('error' in story) {
    return story
  }

  const members = (story?.project as Project)?.members ?? []

  if (!canDeleteStory(user, story, members)) {
    return { error: 'You do not have permission to delete a user story' }
  }

  try {
    await payload.delete({
      collection: 'stories',
      id: storyId,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to delete user story:', error)
    return { error: 'Failed to delete user story' }
  }
}

export async function editStoryTimeEstimateAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const projectId = Number(formData.get('projectId')?.toString())
  const response = {
    storyId: Number(formData.get('storyId')?.toString()),
    timeEstimate: Number(formData.get('timeEstimate')?.toString()),
    message: '',
  }

  await payload.update({
    collection: 'stories',
    id: response.storyId,
    data: {
      timeEstimate: response.timeEstimate,
    },
  })

  redirect(`/projects/${projectId}`)
  return response
}
