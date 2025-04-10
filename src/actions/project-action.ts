'use server'

import { getPayload } from 'payload'
import { getUser } from './login-action'
import config from '@/payload.config'
import { z } from 'zod'
import { idValidator, projectName } from './validators'
import { redirect } from 'next/navigation'
import { Project, User, WallMessage } from '@/payload-types'
import { projectRoleValidator } from './project-validators'

const createProjectSchema = z.object({
  name: projectName,
})

const addMemberScehma = z.object({
  project: idValidator,
  user: idValidator,
  role: projectRoleValidator,
})

export async function isAdminOrMethodologyManager(user: User, project: Project) {
  if (user?.role === 'admin') {
    return true
  }

  if (
    project?.members?.find(
      (member) => (member.user as User).id === user.id && member.role === 'methodology_manager',
    )
  ) {
    return true
  }
}

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

export const getProjectById = async (projectId: string) => {
  const payload = await getPayload({ config })

  const project = await payload
    .findByID({
      collection: 'projects',
      id: projectId,
    })
    .catch(() => {
      return { error: 'Failed fetching project' }
    })

  return project
}

export async function addUserAction({}, formData: FormData) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    message: '',
  }

  console.log(formData.get('projectId'))
  console.log(formData.get('user'))
  console.log(formData.get('role')?.toString())

  const validatedFields = addMemberScehma.safeParse({
    project: formData.get('project') ?? '',
    user: formData.get('user') ?? '',
    role: formData.get('role')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    response.message = JSON.stringify(validatedFields.error.errors)
    return response
  }

  console.log('validated')

  const project = await payload
    .findByID({ collection: 'projects', id: validatedFields.data.project })
    .catch(() => null)

  const newMembers = project?.members ?? []
  newMembers.push({
    user: validatedFields.data.user,
    role: validatedFields.data.role,
  })

  let isError = false
  await payload
    .update({
      collection: 'projects',
      data: {
        members: newMembers,
      },

      where: {
        id: { equals: validatedFields.data.project },
      },
      overrideAccess: false,
      user: user,
    })
    .catch(() => {
      isError = true
    })

  if (isError) {
    response.message = 'Failed to add new member'
    return response
  }

  redirect(`/projects/${validatedFields.data.project}`)
}

export async function deleteMember(projectId: number, memberId: string) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const project = await payload
    .findByID({ collection: 'projects', id: projectId })
    .catch(() => null)

  const newMembers = (project?.members ?? []).filter((x) => x.id !== memberId)

  let isError = false
  await payload
    .update({
      collection: 'projects',
      data: {
        members: newMembers,
      },

      where: {
        id: { equals: projectId },
      },
      overrideAccess: false,
      user: user,
    })
    .catch(() => {
      isError = true
    })

  if (isError) {
    return 'Error removing member'
  }

  redirect(`/projects/${projectId}`)
}

export async function updateDocumentationAction(projectId: number, docs: string) {
  const payload = await getPayload({ config })

  try {
    await payload.update({
      collection: 'projects',
      id: projectId,
      data: {
        documentation: docs,
      },
    })
    return { success: true }
  } catch (_errors) {
    return { error: 'Failed to update profile' }
  }
}

export async function postWallMessageAction(projectId: number, message: string, username: string) {
  const payload = await getPayload({ config })
  const response = {
    message: '',
  }

  let isError = false
  await payload
    .create({
      collection: 'wall-messages',
      data: {
        message: message,
        username: username,
        createdAt: new Date().toLocaleString(),
        project: projectId,
      },
    })
    .catch(() => {
      isError = true
    })

  if (isError) {
    response.message = 'Failed to post wall message'
    return response
  }
}

export async function editProjectDetails(projectId: number, name: string): Promise<Result> {
  const payload = await getPayload({ config })
  const user = await getUser()

  const validatedFields = createProjectSchema.safeParse({
    name: name ?? '',
  })

  if (!validatedFields.success) {
    return {
      isError: true,
      error: validatedFields.error.errors[0].message,
    }
  }

  const exisitngProject = await payload
    .find({ collection: 'projects', where: { key: { equals: name.toLowerCase() } } })
    .catch(() => null)

  if ((exisitngProject?.totalDocs ?? 0) > 0) {
    return {
      isError: true,
      error: 'Project with the same name already exists',
    }
  }

  let isError = false
  await payload
    .update({
      collection: 'projects',
      data: {
        name: name,
      },

      where: {
        id: { equals: projectId },
      },
      overrideAccess: false,
      user: user,
    })
    .catch(() => {
      isError = true
    })

  if (isError) {
    return {
      isError: true,
      error: 'Error renaming project',
    }
  }
  return {
    isError: false,
    error: '',
  }
}

type Result = {
  isError: boolean
  error: string
}

export async function editUserAction(
  projectId: number,
  memberId: string,
  userId: number,
  role: string,
) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    message: '',
  }

  const project = await payload
    .findByID({ collection: 'projects', id: projectId })
    .catch(() => null)

  const newMembers = (project?.members ?? []).map((x) => {
    if (x.id == memberId) {
      return {
        user: userId,
        role: role,
      }
    }
    return x
  })

  console.log(JSON.stringify(newMembers))

  let isError = false
  await payload
    .update({
      collection: 'projects',
      data: {
        members: newMembers,
      },

      where: {
        id: { equals: projectId },
      },
      overrideAccess: false,
      user: user,
    })
    .catch(() => {
      isError = true
    })

  if (isError) {
    response.message = 'Failed to add new member'
    return response
  }

  return 'OK'
}
