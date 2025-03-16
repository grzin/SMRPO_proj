import { Access } from 'payload'

// Allow access to admin and own
export const userAccess: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user.role === 'admin') {
    return true
  }

  return {
    id: {
      equals: user.id,
    },
  }
}
