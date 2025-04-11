import { Sprint } from '@/payload-types'
import type { Access, Where } from 'payload'

export const isSprintProjectMember: Access<Sprint> = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user?.role === 'admin') {
    return true
  }

  const query: Where = {
    'project.members.user': { equals: user?.id },
  }

  return query
}
