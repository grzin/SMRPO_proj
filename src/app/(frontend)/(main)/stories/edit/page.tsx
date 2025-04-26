import StoryEdit from '@/components/stories/stories-edit'

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
import { useRouter, useSearchParams } from 'next/navigation'
import { getProjectById } from '@/actions/project-action'
import { getStoryById } from '@/actions/story-action'
import { getUser } from '@/actions/login-action'
import { Project, Story } from '@/payload-types'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ projectId: string; storyId: string }>
}) {
  const { projectId, storyId } = await searchParams

  const project = (await getProjectById(projectId)) as Project
  const story = (await getStoryById(storyId)) as Story
  const user = await getUser()

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
                <BreadcrumbLink href={'/projects/' + project.id}>{project?.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Edit user story</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <StoryEdit project={project} story={story} />
      </div>
    </>
  )
}
