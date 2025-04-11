import SprintEdit from '@/components/sprints/sprint-edit'
import { getPayload } from 'payload'
import config from '@/payload.config'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getUser } from '@/actions/login-action'
import { useSearchParams } from 'next/navigation'
import { Project } from '@/payload-types'

export default async function Page({
  params,
  searchParams = {},
}: {
  params: Promise<{ slug: string }>
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { slug: sprintId } = await params
  const payload = await getPayload({ config })
  const user = await getUser(false)
  const editSprint = await payload
    .findByID({ collection: 'sprints', id: sprintId, overrideAccess: false, user: user })
    .catch(() => null)
  const editSprintProjects = await payload.find({ collection: 'projects' }).catch(() => null)
  const sprints = await payload.find({ collection: 'sprints' }).catch(() => null)

  const projectId = Number(searchParams['projectId'] ?? '')

  let project: Project | null = null
  if (projectId && !isNaN(projectId) && isFinite(projectId)) {
    project = await payload.findByID({ collection: 'projects', id: projectId }).catch(() => null)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {project && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={'/projects/' + project.id}>
                      {project?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbLink href="/sprints">Sprints</BreadcrumbLink>
              </BreadcrumbItem>
              {editSprint && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink>{editSprint.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SprintEdit
          sprintEdit={editSprint}
          sprintEditProjects={editSprintProjects?.docs || []}
          sprints={sprints?.docs || []}
        />
      </div>
    </>
  )
}
