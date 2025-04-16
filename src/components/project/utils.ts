import { Project, User } from '@/payload-types'

export function isAdminOrMethodologyManager(user: User | null, project: Project) {
  if (user?.role === 'admin') {
    return true
  }

  if (
    project?.members?.find(
      (member) =>
        (member.user as User).id === user?.id &&
        (member.role === 'scrum_master' || member.role == 'scrum_master_developer'),
    )
  ) {
    return true
  }

  return false
}
