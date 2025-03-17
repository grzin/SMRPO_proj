'use server'

import { getPayload } from 'payload'
import { getUser } from './login-action'
import config from '@/payload.config'
import { z } from 'zod'
import { projectName } from './validators'
import { redirect } from 'next/navigation'

const createProjectSchema = z.object({
  name: projectName,
})

export async function createProjectAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    name: formData.get('name')?.toString() ?? '',
    message: '',
  }

  const validatedFields = createProjectSchema.safeParse({
    name: formData.get('name')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    response.message = 'Failed to create project'
    return response
  }

  const duplicateProject = await payload.find({
    collection: 'projects',
    where: { name: { equals: validatedFields.data.name } },
  })

  if (duplicateProject.totalDocs > 0) {
    response.message = 'Project with the same name already exists!'
    return response
  }

  let isError = false
  const newProject = await payload
    .create({
      collection: 'projects',
      data: {
        name: validatedFields.data.name,
        members: [
          {
            user: user.id,
            role: 'methodology_manager',
          },
        ],
      },
      overrideAccess: false,
      user: user,
    })
    .catch(() => {
      isError = true
    })

  if (isError || !newProject) {
    response.message = 'Failed to create project'
    return response
  }

  redirect(`/projects/${newProject?.id}`)
}
