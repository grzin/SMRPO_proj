'use client'

import { User } from '@/payload-types'
import { createContext, useContext, ReactNode } from 'react'

interface UserContextType {
  user: User
  isAdmin: boolean
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children, user }: { children: ReactNode; user: User }) => {
  const isAdmin = user.role == 'admin'
  return <UserContext.Provider value={{ user, isAdmin }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
