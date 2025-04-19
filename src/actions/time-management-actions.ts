'use server'

import config from '@/payload.config'
import { getPayload } from 'payload'
import { getUser } from './login-action'
import { redirect } from 'next/navigation'
import datetimeDifference from 'datetime-difference'

export async function manualTrackTimeAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    projectId: formData.get('projectId'),
    taskId: formData.get('taskId'),
    date: formData.get('date'),
    hours: formData.get('hours'),
    minutes: formData.get('minutes'),
    seconds: formData.get('seconds'),
    est_hours: formData.get('est_hours'),
    est_minutes: formData.get('est_minutes'),
    est_seconds: formData.get('est_seconds'),
  }

  const date = new Date(response.date?.toString() || '')
  if (date > new Date()) return response

  const y = date.getFullYear()
  const m = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  const d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  const dateString = `${y}-${m}-${d}`
  const tt = await payload.find({
    collection: 'taskTimes',
    where: {
      user: { equals: user.id },
      task: { equals: response.taskId?.toString() || '' },
      date: { equals: dateString },
    },
  })

  if (tt.totalDocs > 0) {
    await payload.update({
      collection: 'taskTimes',
      where: {
        user: { equals: user.id },
        task: { equals: response.taskId?.toString() || '' },
        date: { equals: dateString },
      },
      data: {
        hours: Number(response.hours?.toString()),
        minutes: Number(response.minutes?.toString()),
        seconds: Number(response.seconds?.toString()),
        est_hours: Number(response.est_hours?.toString()),
        est_minutes: Number(response.est_minutes?.toString()),
        est_seconds: Number(response.est_seconds?.toString()),
      },
    })
  } else {
    await payload.create({
      collection: 'taskTimes',
      data: {
        user: user.id,
        task: response.taskId?.toString() || '',
        date: dateString,
        hours: Number(response.hours?.toString()),
        minutes: Number(response.minutes?.toString()),
        seconds: Number(response.seconds?.toString()),
        est_hours: Number(response.est_hours?.toString()),
        est_minutes: Number(response.est_minutes?.toString()),
        est_seconds: Number(response.est_seconds?.toString()),
      },
    })
  }

  redirect(`/projects/${response.projectId?.toString()}/tasks/time/${response.taskId?.toString()}`)

  return response
}

export async function trackTimeAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    projectId: formData.get('projectId'),
    taskId: formData.get('taskId'),
    action: formData.get('action'),
  }

  const stories = await payload.find({
    collection: 'stories',
  })
  const story = stories.docs.find((story) =>
    story.tasks?.find((task) => task.id === response.taskId?.toString()),
  )
  const tasks = story?.tasks

  if (response.action === 'start') {
    await payload.create({
      collection: 'timeTracking',
      data: {
        user: user.id,
        task: response.taskId?.toString() || '',
        start: new Date().toISOString(),
      },
      overrideAccess: false,
      user: user,
    })

    tasks?.forEach((task) => {
      if (task.id === response.taskId?.toString()) {
        task.status = 'active'
      }
    })
    await payload.update({
      collection: 'stories',
      where: {
        id: { equals: story?.id },
      },
      data: {
        tasks: tasks,
      },
    })
  } else if (response.action === 'stop') {
    const tt = await payload.find({
      collection: 'timeTracking',
      where: {
        user: { equals: user.id },
        task: { equals: response.taskId?.toString() || '' },
      },
    })

    const startDate = new Date(tt.docs[0].start)
    await payload.delete({
      collection: 'timeTracking',
      id: tt.docs[0].id,
    })

    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    const d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    const dateString = `${y}-${m}-${d}`
    const taskTime = await payload.find({
      collection: 'taskTimes',
      where: {
        user: { equals: user.id },
        task: { equals: response.taskId?.toString() || '' },
        date: { equals: dateString },
      },
    })

    const diff = datetimeDifference(startDate, date)

    if (taskTime.totalDocs > 0) {
      const s = taskTime.docs[0].seconds + diff.seconds
      const m = taskTime.docs[0].minutes + diff.minutes + Math.floor(s / 60)
      const h = taskTime.docs[0].hours + diff.hours + Math.floor(m / 60)
      await payload.update({
        collection: 'taskTimes',
        data: {
          hours: h,
          minutes: m % 60,
          seconds: s % 60,
        },
        where: {
          user: { equals: user.id },
          task: { equals: response.taskId?.toString() || '' },
          date: { equals: dateString },
        },
      })
    } else {
      const task = tasks?.find((t) => t.id === response.taskId?.toString())
      await payload.create({
        collection: 'taskTimes',
        data: {
          user: user.id,
          task: response.taskId?.toString() || '',
          date: dateString,
          hours: diff.hours,
          minutes: diff.minutes,
          seconds: diff.seconds,
          est_hours: Math.floor(task?.estimate || 0),
          est_minutes: Math.floor(((task?.estimate || 0) % 1) * 60),
          est_seconds: Math.floor(((((task?.estimate || 0) % 1) * 60) % 1) * 60),
        },
        overrideAccess: false,
        user: user,
      })
    }

    tasks?.forEach((task) => {
      if (task.id === response.taskId?.toString()) {
        task.status = 'accepted'
      }
    })
    await payload.update({
      collection: 'stories',
      where: {
        id: { equals: story?.id },
      },
      data: {
        tasks: tasks,
      },
    })
  }

  redirect(`/projects/${response.projectId?.toString()}/tasks/time/${response.taskId?.toString()}`)

  return response
}
