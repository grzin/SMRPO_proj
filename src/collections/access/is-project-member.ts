import { Project } from '@/payload-types'
import type { Access, Where } from 'payload'

export const isProjectMember: Access<Project> = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user?.role === 'admin') {
    return true
  }

  const query: Where = {
    'members.user': { equals: user?.id },
  }
  return query
}
