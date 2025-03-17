import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  return user?.role === 'admin'
}

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  return user?.role === 'admin'
}
