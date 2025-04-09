'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { isAdminOrMethodologyManager, canDeleteStory } from '@/actions/user-actions'
import { getUser } from '@/actions/login-action'
import { Project, Story, User } from '@/payload-types'
import { redirect } from 'next/navigation'

export async function addTaskAction(formData: FormData, project: Project, story: Story) {
    const payload = await getPayload({ config })
    const user = await getUser()
  
    const description = formData.get('description')?.toString() ?? ''
    const estimate = parseFloat(formData.get('estimate')?.toString() ?? '')
    const taskedUserId = formData.get('member')?.toString()
    
    const status = taskedUserId ? 'pending' : 'unassigned'
  
    try {
      // Create the task
      const createdTask =  {
          description,
          estimate,
          // taskedUser: taskedUserId,
          status: (status as 'pending' | 'unassigned' | 'accepted'),
          realized: false,
        }
    
    const newTasks = [...(story.tasks ?? []), createdTask]

    await payload
      .update({
        collection: 'stories',
        data: {
          tasks: newTasks,
        },
  
        where: {
          id: { equals: story.id },
        },
      })
  
      return { data: "Success" }
    } catch (err) {
      console.error('Failed to add task:', err)
      return { error: 'Failed to add task' }
    }
}