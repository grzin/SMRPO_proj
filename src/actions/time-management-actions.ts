'use server'

import { z } from 'zod'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { hoursValidator, minutesValidator, secondsValidator } from './validators'
import { getUser } from './login-action'
import { redirect } from 'next/navigation'

const createSchema = z.object({
  hours: hoursValidator,
  minutes: minutesValidator,
  seconds: secondsValidator,
})

export async function createTimeAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    projectId: formData.get('projectId'),
    taskId: formData.get('taskId'),
    action: formData.get('action'),
    hours: Number(formData.get('hours')?.toString()),
    minutes: Number(formData.get('minutes')?.toString()),
    seconds: Number(formData.get('seconds')?.toString()),
  }

  const validatedFields = createSchema.safeParse({
    hours: Number(formData.get('hours')?.toString()),
    minutes: Number(formData.get('minutes')?.toString()),
    seconds: Number(formData.get('seconds')?.toString()),
  })

  if (!validatedFields.success) {
    return response
  }

  const data = validatedFields.data

  if (data.hours === 0 && data.minutes === 0 && data.seconds === 0) return response

  let prefix = ''
  if (response.action === 'subtract') prefix = '- '

  let isError = false
  const newTaskTime = await payload
    .create({
      collection: 'taskTimes',
      data: {
        user: user,
        task: response.taskId?.toString() || '',
        start: new Date().toISOString(),
        customHMS: `${prefix}${data.hours}h ${data.minutes}m ${data.seconds}s`,
      },
      overrideAccess: false,
      user: user,
    })
    .catch((_error) => {
      isError = true
    })

  if (newTaskTime) {
    redirect(`/projects/${response.projectId}/tasks/time/${response.taskId}`)
  }

  if (isError) {
    return response
  }
  return response
}
