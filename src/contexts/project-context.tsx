import { Project } from '@/payload-types'
import { createContext, useContext, ReactNode } from 'react'

interface ProjectContextType {
  project: Project | null
}

const ProjectContext = createContext<ProjectContextType>({ project: null })

export const ProjectProvider = ({ children, project }: { children: ReactNode; project: Project }) => {
  return <ProjectContext.Provider value={{ project }}>{children}</ProjectContext.Provider>
}

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
