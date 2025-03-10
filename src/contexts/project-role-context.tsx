import { ProjectRole } from '@/payload-types'
import { createContext, useContext, ReactNode } from 'react'

interface ProjectRoleContextType {
  projectRole: ProjectRole | null
}

const ProjectRoleContext = createContext<ProjectRoleContextType>({ projectRole: null })

export const ProjectRoleProvider = ({ children, projectRole }: { children: ReactNode; projectRole: ProjectRole }) => {
  return <ProjectRoleContext.Provider value={{ projectRole }}>{children}</ProjectRoleContext.Provider>
}

export const useProject = (): ProjectRoleContextType => {
  const context = useContext(ProjectRoleContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
