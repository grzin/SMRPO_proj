'use server'

import { getPayload } from 'payload'
import { getUser } from './login-action'
import config from '@/payload.config'
import { z } from 'zod'
import { idValidator, projectDescription, projectName } from './validators'
import { redirect } from 'next/navigation'
import { Project, User, WallMessage } from '@/payload-types'
import { projectRoleValidator } from './project-validators'
import { Role } from '@/components/project/role-select'

const createProjectSchema = z.object({
  name: projectName,
  description: projectDescription,
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
      (member) =>
        (member.user as User).id === user.id &&
        (member.role === 'scrum_master' || member.role == 'scrum_master_developer'),
    )
  ) {
    return true
  }
}

export async function createProjectAction(name: string, description: string) {
  const payload = await getPayload({ config })
  const user = await getUser()

  const response = {
    name: name,
    message: 'test',
  }

  const validatedFields = createProjectSchema.safeParse({
    name: name,
    description: description,
  })

  if (!validatedFields.success) {
    response.message = validatedFields.error.errors[0].message
    return response
  }

  const duplicateProject = await payload.find({
    collection: 'projects',
    where: { key: { equals: validatedFields.data.name.toLowerCase() } },
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
        description: validatedFields.data.description,
        members: [
          {
            user: user.id,
            role: 'scrum_master',
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

  const validatedFields = addMemberScehma.safeParse({
    project: formData.get('project') ?? '',
    user: formData.get('user') ?? '',
    role: formData.get('role')?.toString() ?? '',
  })

  if (!validatedFields.success) {
    response.message = JSON.stringify(validatedFields.error.errors)
    return response
  }

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
        createdAt: new Date().toDateString(),
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

export async function editProjectDetails(
  projectId: number,
  name: string,
  description: string,
): Promise<Result> {
  const payload = await getPayload({ config })
  const user = await getUser()

  const validatedFields = createProjectSchema.safeParse({
    name: name ?? '',
    description: description ?? '',
  })

  if (!validatedFields.success) {
    return {
      isError: true,
      error: validatedFields.error.errors[0].message,
    }
  }

  const exisitngProject = await payload
    .find({
      collection: 'projects',
      where: { and: [{ key: { equals: name.toLowerCase() } }, { id: { not_equals: projectId } }] },
    })
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
        name: validatedFields.data.name,
        description: validatedFields.data.description,
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
  role:
    | 'scrum_master'
    | 'scrum_master_developer'
    | 'product_owner'
    | 'developer'
    | 'product_owner_scrum_master',
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
