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
import TaskTimes from '@/components/times/times'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; task_slug: string }>
}) {
  const { slug: projectId, task_slug: taskId } = await params
  const payload = await getPayload({ config })
  const user = await getUser(false)
  const project = await payload
    .findByID({
      collection: 'projects',
      id: projectId,
      overrideAccess: false,
      user: user,
      depth: 3,
    })
    .catch(() => null)
  if (project === null) {
    redirect('/projects')
  }

  const story = (
    await payload.find({
      collection: 'stories',
      where: {
        project: { equals: project.id },
      },
    })
  ).docs[0]

  const task = story.tasks?.find((t) => t.id === taskId)

  const times = await payload.find({
    collection: 'taskTimes',
    where: {
      user: { equals: user.id },
      task: { equals: taskId },
    },
    sort: '-date',
  })

  const activeTask = await payload.find({
    collection: 'timeTracking',
    where: {
      user: { equals: user.id },
    },
  })

  let activeTaskDescription = null
  if (activeTask.totalDocs > 0) {
    const stories = await payload.find({ collection: 'stories' })
    stories.docs.forEach((s) => {
      s.tasks?.forEach((t) => {
        if (t.id === activeTask.docs[0].task && t.id !== taskId)
          activeTaskDescription = t.description
      })
    })
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
                <BreadcrumbLink href={'/projects/' + project.id}>{project?.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Time management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <TaskTimes
        project={project}
        story={story}
        taskId={taskId}
        taskDescription={task?.description || ''}
        isActiveTask={activeTask.totalDocs > 0 && activeTask.docs[0].task === taskId}
        activeTaskDescription={activeTaskDescription}
        times={times.docs}
      />
    </>
  )
}
