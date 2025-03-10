'use client'

import { AppSidebar } from '@/components/app-sidebar'
import AddProjectForm from '@/components/project/add-project'
import { LoginForm } from '@/components/login-form'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ProjectProvider } from '@/contexts/project-context'
import { Project, UserProjectRole, User, ProjectRole } from '@/payload-types'
import { FC, useEffect, useState } from 'react'
import Modal from '@/components/ui/addProjectModal'
import { UIProject, ProjectUser } from './page'
import { object } from 'zod'

interface ProjectProps {
  projects: UIProject[]
}

const Projects: FC<ProjectProps> = ({ projects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProjectRoles, setUserProjectRoles] = useState<UserProjectRole[]>([]);
  const [roles, setRoles] = useState<ProjectRole[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getUserRolesForProject = (projectId: number) => {
    return userProjectRoles.filter(upr => upr.project === projectId);
  };

    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sprint</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <button onClick={openModal} className="mb-4 p-2 bg-blue-500 text-white rounded">
              Add Project
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <AddProjectForm onClose={closeModal} />
            </Modal>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-muted/50 aspect-video rounded-xl p-4">
                  <h2>{proj.name}</h2>
                  <ul>
                  {proj.users?.map((user) => (
                      <li key={user.id}>
                        {user.name}{(user.role != null) ? ' - ' + user.role : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </div>
      </>
    )
}

export default Projects
