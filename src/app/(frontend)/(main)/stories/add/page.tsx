import StoriesAdd from '@/components/stories/stories-add'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getProjectById } from '@/actions/project-action'
import { getUser } from '@/actions/login-action'

export default async function Page({ searchParams }: { searchParams: { projectId: string; storyId: string } }) {
  const { projectId, storyId } = await searchParams;

  const project = await getProjectById(projectId);
  const user = await getUser();

  console.log(project);
  console.log(user);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Add User Story</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <StoriesAdd project={project} user={user} />
      </div>
    </>
  )
}
