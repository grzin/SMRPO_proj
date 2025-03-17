'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { FC, useActionState } from 'react'
import { Project } from '@/payload-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { createProjectAction } from '@/actions/project-action'
import { FormMessage } from '@/components/ui/form'

interface ProjectProps {
  projects: Project[]
}

const Projects: FC<ProjectProps> = ({ projects }) => {
  const initialState = {
    name: '',
    message: '',
  }
  const [state, formAction, pending] = useActionState(createProjectAction, initialState)
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
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Create project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new project</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form action={formAction}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Project name
                  </Label>
                  <Input name="name" defaultValue={state.name} className="col-span-3" />
                  <FormMessage className="col-span-4">{state.message}</FormMessage>
                </div>
                <Button type="submit" disabled={pending}>
                  Create
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {projects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <div
              key={project.id}
              className="flex items-start justify-between p-4 bg-white rounded-md shadow-sm flex-col"
            >
              <h2 className="font-medium">{project.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Projects
