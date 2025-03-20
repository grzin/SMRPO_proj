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
import { redirect } from 'next/navigation'
import { ProjectDashboard } from '@/components/project/project'
import { isAdminOrMethodologyManager } from '@/actions/user-actions'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: projectId } = await params
  const payload = await getPayload({ config })
  const user = await getUser(false)
  const project = await payload
    .findByID({ collection: 'projects', id: projectId, overrideAccess: false, user: user, depth: 3 })
    .catch(() => null)

  // dirty patch
  const stories = await payload.find({
    collection: 'stories',
    where: { project: { equals: projectId } },
  }).catch(() => ({ docs: [] }));

  project.stories = stories.docs;

  const canAddStory = await isAdminOrMethodologyManager(user)

  if (project === null) {
    redirect('/projects')
  }

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
                <BreadcrumbPage>{project?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ProjectDashboard project={project} canAddStory={canAddStory} />
      </div>
    </>
  )
}
