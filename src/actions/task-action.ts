'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { isMethodologyManager, isMember } from '@/actions/user-actions'
import { getUser } from '@/actions/login-action'
import { Project, Story, User } from '@/payload-types'
import { redirect } from 'next/navigation'

export async function addTaskAction(
  formData: FormData,
  project: Project,
  story: Story,
): Promise<{ data: string } | { error: string }> {
  const payload = await getPayload({ config })
  const user = await getUser()

  const description = formData.get('description')?.toString() ?? ''
  const estimate = parseFloat(formData.get('estimate')?.toString() ?? '')
  const taskedUserId = formData.get('member')?.toString()

  const status = taskedUserId ? 'pending' : 'unassigned'

  if (estimate < 0) {
    return { error: 'Estimate must be non-negative.' }
  }

  if (description.length === 0) {
    return { error: 'Description cannot be empty.' }
  }

  if (
    !(
      (await isMethodologyManager(user, project.members ?? [])) ||
      (await isMember(user, project.members ?? []))
    )
  ) {
    return { error: 'You lack permission to add tasks.' }
  }

  try {
    // Create the task
    const createdTask = {
      description,
      estimate,
      taskedUser: taskedUserId ? parseInt(taskedUserId) : null,
      status: status as 'pending' | 'unassigned' | 'accepted',
      realized: false,
    }

    const newTasks = [...(story.tasks ?? []), createdTask]

    await payload.update({
      collection: 'stories',
      data: {
        tasks: newTasks,
      },

      where: {
        id: { equals: story.id },
      },
    })

    return { data: 'Success' }
  } catch (err) {
    console.error('Failed to add task:', err)
    return { error: 'Failed to add task' }
  }
}

export async function toggleRealizationAction(storyId: number, taskId: any, newValue: boolean) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const story = await payload.findByID({
    collection: 'stories',
    id: storyId,
  })

  const taskIndex = (story.tasks ?? []).findIndex((task) => task.id === taskId)

  if (taskIndex === -1) {
    return { error: 'Task not found in story' }
  }

  const task = story.tasks![taskIndex]

  // Only the tasked user can toggle their task
  const taskedUserId = typeof task.taskedUser === 'object' ? task.taskedUser?.id : task.taskedUser

  if (!taskedUserId || taskedUserId !== user.id) {
    return { error: 'You are not authorized to change this task.' }
  }

  // Update the task in place
  story.tasks![taskIndex].realized = newValue

  // Persist the story with updated task
  await payload.update({
    collection: 'stories',
    id: storyId,
    data: {
      tasks: story.tasks,
    },
  })

  return { success: true }
}
