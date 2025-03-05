import { User } from '@/payload-types'
import { createContext, useContext, ReactNode } from 'react'

interface UserContextType {
  user: User | null
}

const UserContext = createContext<UserContextType>({ user: null })

export const UserProvider = ({ children, user }: { children: ReactNode; user: User }) => {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
