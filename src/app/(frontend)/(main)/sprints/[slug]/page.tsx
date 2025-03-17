import SprintEdit from '@/components/sprints/sprint-edit'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getUser } from '@/actions/login-action'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: sprintId } = await params
  const payload = await getPayload({ config })
  const user = await getUser(true)
  const editSprint = await payload
    .findByID({ collection: 'sprints', id: sprintId, overrideAccess: false, user: user })
    .catch(() => null)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/sprints">Sprints</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{editSprint?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SprintEdit sprintEdit={editSprint} />
      </div>
    </>
  )
}
