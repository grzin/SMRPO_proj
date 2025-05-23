'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

import { FC, useActionState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link'
import { canDeleteStory } from '@/actions/user-actions'
import { useUser } from '@/contexts/user-context'
import { useEffect, useState } from 'react'
import { Project, Story, TaskTime, User, Sprint } from '@/payload-types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { editStoryTimeEstimateAction, editStorySprint, acceptStory, rejectStory } from '@/actions/story-action'
import {
  toggleRealizationAction,
  deleteTaskAction,
  acceptTaskAction,
  cancelTaskAction,
} from '@/actions/task-action'
import { FormError } from '../ui/form'
import AddTaskDialog from '../tasks/tasks-add-dialog'
import EditTaskDialog from '../tasks/tasks-edit-dialog'
import { Switch } from '@/components/ui/switch'
import { UserAvatar } from '../ui/avatar'
import { useRouter } from 'next/navigation'

export const noSprintAssigned: string = 'No Sprint Assigned'

function sumEstTimes(story: Story, times: TaskTime[]) {
  let storySum = 0
  story.tasks?.forEach((task) => {
    if (!times.find((time) => task.id === time.task)) {
      storySum += task.estimate
    }
  })

  const s =
    times.map((t) => t.est_seconds).reduce((x, y) => x + y, 0) + Math.floor(storySum * 60 * 60)
  const m = times.map((t) => t.est_minutes).reduce((x, y) => x + y, 0) + Math.floor(s / 60)
  const h = times.map((t) => t.est_hours).reduce((x, y) => x + y, 0) + Math.floor(m / 60)

  return formatTime(h, m % 60, s % 60)
}

function sumTimes(times: TaskTime[]) {
  const s = times.map((t) => t.seconds).reduce((x, y) => x + y, 0)
  const m = times.map((t) => t.minutes).reduce((x, y) => x + y, 0) + Math.floor(s / 60)
  const h = times.map((t) => t.hours).reduce((x, y) => x + y, 0) + Math.floor(m / 60)
  return formatTime(h, m % 60, s % 60)
}

function formatEstTaskTime(taskTime: TaskTime | undefined) {
  if (taskTime === undefined) return ''
  return formatTime(taskTime.est_hours, taskTime.est_minutes, taskTime.est_seconds)
}

function formatTime(h: number, m: number, s: number) {
  return `${h}h ${m}m ${s}s`
}

function isEstTimeZero(taskTime: TaskTime | undefined) {
  if (taskTime === undefined) return false
  return taskTime.est_hours === 0 && taskTime.est_minutes === 0 && taskTime.est_seconds === 0
}

export const Stories: FC<{
  project: Project
  taskTimes: TaskTime[]
  canAddStory: boolean
  canUpdateTimeEstimate: boolean
  canNotSeeTimeEstimate: boolean
  isDeveloperBool: boolean
  isMemberBool: boolean
  isMethodologyManagerBool: boolean
  projectSprints: Sprint[] | null
}> = ({
  project,
  taskTimes,
  canAddStory,
  canUpdateTimeEstimate,
  canNotSeeTimeEstimate,
  isDeveloperBool,
  isMemberBool,
  isMethodologyManagerBool,
  projectSprints,
}) => {
  const [deletableStories, setDeletableStories] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const user = useUser().user

  const handleGoToAdd = () => {
    router.push(`/stories/add?projectId=${project.id}`)
  }

  const initialState = {
    storyId: 0,
    timeEstimate: 0,
    message: '',
  }

  const [state, formAction, pending] = useActionState(editStoryTimeEstimateAction, initialState)

  useEffect(() => {
    if (!user) {
      return
    }
    const checkDeletableStories = async () => {
      const results: Record<number, boolean> = {}
      for (const story of (project.stories as Story[]) ?? []) {
        results[story.id] = await canDeleteStory(user, story, project.members ?? [])
      }
      setDeletableStories(results)
    }

    checkDeletableStories()
  }, [project.stories, user, project.members])

  if (projectSprints && !projectSprints.some((sprint) => sprint.name === noSprintAssigned)) {
    projectSprints.unshift({
      id: -1,
      name: noSprintAssigned,
      startDate: '',
      endDate: '',
      velocity: 0,
      project: 0,
      updatedAt: '',
      createdAt: '',
    })
  }
  
  const today = new Date()
  const currentSprint = projectSprints?.find(
    (sprint) => new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today,
  )

  return (
    <div className="rounded-xl md:min-h-min">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>User Stories</CardTitle>
          <CardDescription>Define and assign user stories of this project</CardDescription>
          <div className="flex">
            {canAddStory && <Button onClick={handleGoToAdd}>Add User Story</Button>}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          {project.stories && project.stories.length > 0 ? (
            <ul className="space-y-4">
              {(project.stories as Story[]).map((story) => (
                <li
                  key={story.id}
                  className="border rounded p-4 hover:bg-gray-100 grid auto-rows-min gap-4 md:grid-cols-3"
                >
                  {deletableStories[story.id] ? (
                    <Link
                      href={`/stories/edit?storyId=${story.id}&projectId=${project.id}`}
                      className="cursor-pointer col-span-2"
                    >
                      <h3 className="text-lg font-semibold">{story.title}</h3>
                      <p>Description: {story.description}</p>
                      <p className="text-sm text-gray-500">Priority: {story.priority}</p>
                      <p className="text-sm text-gray-500">Business Value: {story.businessValue}</p>
                      {story.rejectComment && (<p className="text-sm text-orange-500">Rejected because: {story.rejectComment}</p>)}
                      <p className="text-sm text-gray-500">
                        Sprint: {story.sprint == null ? 'undefined' : (story.sprint as Sprint).name}
                      </p>
                      <p className="text-sm text-gray-500">Acceptance Tests: </p>
                      <ul>
                        {story.acceptanceTests.map((testObj, index) => (
                          <li key={index}>#{testObj.test}</li>
                        ))}
                      </ul>
                    </Link>
                  ) : (
                    <div className="col-span-2">
                      <h3 className="text-lg font-semibold">{story.title}</h3>
                      <p>Description: {story.description}</p>
                      <p className="text-sm text-gray-500">Priority: {story.priority}</p>
                      <p className="text-sm text-gray-500">Business Value: {story.businessValue}</p>
                      {story.rejectComment && (<p className="text-sm text-orange-500">Rejected because: {story.rejectComment}</p>)}
                      <ul>
                        {story.acceptanceTests.map((testObj, index) => (
                          <li key={index}>#{testObj.test}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="col-span-1">
                    <div className="col-span-1">
                      <div className="grid gap-3">
                        {canNotSeeTimeEstimate ? (
                          <></>
                        ) : (
                          <form action={formAction}>
                            <Input
                              name="projectId"
                              id="projectId"
                              type="number"
                              defaultValue={project.id}
                              hidden
                            />
                            <Input
                              name="storyId"
                              id="storyId"
                              type="number"
                              defaultValue={story.id}
                              hidden
                            />
                            <Label className="p-2" htmlFor="timeEstimate">
                              Time estimate (in story points)
                            </Label>
                            <Input
                              name="timeEstimate"
                              id="timeEstimate"
                              type="number"
                              placeholder="Enter time estimate value"
                              defaultValue={story.timeEstimate || undefined}
                              disabled={!canUpdateTimeEstimate}
                              min={0}
                            />
                            {canUpdateTimeEstimate ? (
                              <Button type="submit" className="mt-1">
                                Update time estimate
                              </Button>
                            ) : (
                              <></>
                            )}
                            {state.message && <FormError>{state.message}</FormError>}
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <h1>
                      <b>Tasks</b>
                    </h1>
                    {(isMemberBool || isMethodologyManagerBool) && (
                      <div>
                        <AddTaskDialog project={project} story={story} />
                      </div>
                    )}
                    <div>
                      <div className="grid grid-cols-7 gap-4">
                        <div>Description</div>
                        <div>Time Estimate</div>
                        <div>Realized</div>
                        <div>Tasked User</div>
                        <div>Status</div>
                        <div>Time tracking</div>
                      </div>
                      <TaskList
                        story={story}
                        project={project}
                        taskTimes={taskTimes}
                        isDeveloperBool={isDeveloperBool}
                        isMemberBool={isMemberBool}
                        isMethodologyManagerBool={isMethodologyManagerBool}
                      />
                      <div className="grid grid-cols-7 gap-4 mt-4 px-6">
                        <div>Sum:</div>
                        <div>
                          {sumEstTimes(
                            story,
                            taskTimes.filter(
                              (tt) => story.tasks?.find((t) => t.id === tt.task) !== undefined,
                            ),
                          )}
                        </div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div>
                          {sumTimes(
                            taskTimes.filter(
                              (tt) => story.tasks?.find((t) => t.id === tt.task) !== undefined,
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No stories found for this project.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const TaskList: FC<{
  story: Story
  project: Project
  taskTimes: TaskTime[]
  isDeveloperBool: boolean
  isMemberBool: boolean
  isMethodologyManagerBool: boolean
  filterStatus?: 'pending' | 'accepted' | 'unassigned' | 'realized'
  displayTitle?: boolean
}> = ({
  story,
  project,
  taskTimes,
  isDeveloperBool,
  isMemberBool,
  isMethodologyManagerBool,
  filterStatus,
  displayTitle = false,
}) => {
  const router = useRouter()
  const user = useUser().user

  const handleToggle = async (storyId: number, taskId: any, newValue: boolean) => {
    const result = await toggleRealizationAction(storyId, taskId, newValue)
    if ('error' in result) {
      // event.preventDefault()
      return
    }
    router.refresh()
  }

  const handleAccept = async (storyId: number, taskId: any) => {
    const result = await acceptTaskAction(storyId, taskId)
    if ('error' in result) {
      // event.preventDefault()
      return
    }
    router.refresh()
  }

  const handleCancel = async (storyId: number, taskId: any) => {
    const result = await cancelTaskAction(storyId, taskId)
    if ('error' in result) {
      // event.preventDefault()
      return
    }
    router.refresh()
  }

  const handleDeteleTask = async (storyId: number, taskId: any, project: Project) => {
    const result = await deleteTaskAction(storyId, taskId, project)
    if ('error' in result) {
      // event.preventDefault()
      return
    }
    router.refresh()
  }

  const filteredTasks =
    story.tasks?.filter((task) => {
      if (filterStatus === undefined) {
        return true
      }

      if (filterStatus === 'unassigned') {
        return task.status === 'unassigned'
      }

      if (filterStatus === 'pending') {
        return task.status === 'pending' && !task.realized
      }

      if (filterStatus === 'accepted') {
        return task.status === 'accepted' && !task.realized
      }

      if (filterStatus === 'realized') {
        return task.realized
      }
    }) ?? []

  return (
    <>
      {displayTitle && filteredTasks.length > 0 && (
        <>
          <h1 className="text-lg font-semibold">{story.title}</h1>
          <div className="grid grid-cols-7 gap-4">
            <div>Description</div>
            <div>Time Estimate</div>
            <div>Realized</div>
            <div>Tasked User</div>
            <div>Status</div>
            <div>Time tracking</div>
          </div>
        </>
      )}
      {filteredTasks.map((task) => (
        <Card key={task.id}>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              <div>{task.description}</div>
              <div>
                {formatEstTaskTime(
                  taskTimes
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .find((tt) => tt.task === task.id),
                ) || task.estimate}
              </div>
              <div>
                <Switch
                  checked={task.realized}
                  onCheckedChange={async (val) => await handleToggle(story.id, task.id, val)}
                  disabled={
                    !task.taskedUser ||
                    !(user?.id === (task.taskedUser as User).id && task.status === 'accepted') ||
                    (task.estimate >= 0 && !taskTimes.find((tt) => tt.task === task.id)) ||
                    !taskTimes
                      .sort((a, b) => (a.date < b.date ? 1 : -1))
                      .filter((tt) => tt.task === task.id)
                      .some((t) => isEstTimeZero(t))
                  }
                />
              </div>
              <div>
                {task.taskedUser ? (
                  <UserAvatar user={task.taskedUser as User} />
                ) : (
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>Unassigned</span>
                )}
              </div>
              <div>{task.status}</div>
              <div className="flex justify-between pr-8">
                {sumTimes(taskTimes.filter((t) => t.task === task.id))}
                {user?.id === (task.taskedUser && (task.taskedUser as User).id) &&
                isDeveloperBool &&
                !task.realized &&
                (task.status === 'accepted' || task.status === 'active') ? (
                  <a
                    href={'/projects/' + project.id + '/tasks/time/' + (task.id || '')}
                    className="text-primary"
                  >
                    {' '}
                    Manage
                  </a>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(isMemberBool || isMethodologyManagerBool) && (
                  <>
                    {task.status === 'unassigned' && (
                      <Button
                        type="button"
                        onClick={async () => await handleDeteleTask(story.id, task.id, project)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </Button>
                    )}
                    {!task.realized && task.status !== 'accepted' && (
                      <EditTaskDialog
                        project={project}
                        story={story}
                        task={{
                          id: task.id as string,
                          description: task.description,
                          taskedUser: (task.taskedUser as User) ?? null,
                          estimate: task.estimate,
                          status: task.status,
                        }}
                      />
                    )}
                  </>
                )}
                {task.status === 'pending' && (task.taskedUser as User).id === user.id && (
                  <>
                    <Button onClick={async () => await handleAccept(story.id, task.id)}>
                      Accept
                    </Button>
                  </>
                )}
                {task.status === 'accepted' &&
                  !task.realized &&
                  (task.taskedUser as User).id === user.id && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={async () => await handleCancel(story.id, task.id)}
                      >
                        Release
                      </Button>
                    </>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export const Stori: FC<{
  story: Story
  project: Project
  taskTimes: TaskTime[]
  canUpdateTimeEstimate: boolean
  canNotSeeTimeEstimate: boolean
  isDeveloperBool: boolean
  isMemberBool: boolean
  isMethodologyManagerBool: boolean
  projectSprints: Sprint[] | null
  canAddStory: boolean
  onStorySelect: ((storyId: number, isSelected: boolean) => void) | undefined

}> = ({
  story,
  project,
  taskTimes,
  canUpdateTimeEstimate,
  canNotSeeTimeEstimate,
  isDeveloperBool,
  isMemberBool,
  isMethodologyManagerBool,
  projectSprints,
  canAddStory,
  onStorySelect
}) => {
  const [deletableStories, setDeletableStories] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const user = useUser().user

  const handleGoToAdd = () => {
    router.push(`/stories/add?projectId=${project.id}`)
  }

  const initialState = {
    storyId: 0,
    timeEstimate: 0,
    message: '',
  }

  const [state, formAction, pending] = useActionState(editStoryTimeEstimateAction, initialState)
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  
  const today = new Date()
  const currentSprint = projectSprints?.find(
    (sprint) => new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today,
  )

  useEffect(() => {
    if (!user) {
      return
    }
    const checkDeletableStories = async () => {
      const results: Record<number, boolean> = {}
      for (const story of (project.stories as Story[]) ?? []) {
        results[story.id] = await canDeleteStory(user, story, project.members ?? [])
      }
      setDeletableStories(results)
    }

    checkDeletableStories()
  }, [project.stories, user, project.members])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onStorySelect) return;
    onStorySelect(story.id, e.target.checked);
  };
  if (projectSprints && !projectSprints.some((sprint) => sprint.name === noSprintAssigned)) {
    projectSprints.unshift({
      id: -1,
      name: noSprintAssigned,
      startDate: '',
      endDate: '',
      velocity: 0,
      project: 0,
      updatedAt: '',
      createdAt: '',
    })
  }

  return (
    <li
      key={story.id}
      className="border rounded p-4 hover:bg-gray-100 grid auto-rows-min gap-4 md:grid-cols-24"
    >
      {deletableStories[story.id] ? (
        <Link
          href={`/stories/edit?storyId=${story.id}&projectId=${project.id}`}
          className="cursor-pointer col-span-14"
        >
          <h3 className="text-lg font-semibold">{story.title}</h3>
          <p>Description: {story.description}</p>
          <p className="text-sm text-gray-500">Priority: {story.priority}</p>
          <p className="text-sm text-gray-500">Business Value: {story.businessValue}</p>
          {story.rejectComment && (<p className="text-sm text-orange-500">Rejected because: {story.rejectComment}</p>)}
          <p className="text-sm text-gray-500">Acceptance Tests: </p>
          <ul>
            {story.acceptanceTests.map((testObj, index) => (
              <li key={index}>#{testObj.test}</li>
            ))}
          </ul>
        </Link>
      ) : (
        <div className="col-span-14">
          <h3 className="text-lg font-semibold">{story.title}</h3>
          <p>Description: {story.description}</p>
          <p className="text-sm text-gray-500">Priority: {story.priority}</p>
          <p className="text-sm text-gray-500">Business Value: {story.businessValue}</p>
          {story.rejectComment && (<p className="text-sm text-orange-500">Rejected because: {story.rejectComment}</p>)}
          <ul>
            {story.acceptanceTests.map((testObj, index) => (
              <li key={index}>#{testObj.test}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="col-span-7">
        <div className="col-span-1">
          <div className="grid gap-3">
            {canNotSeeTimeEstimate ? (
              <></>
            ) : (
              <form action={formAction}>
                <Input
                  name="projectId"
                  id="projectId"
                  type="number"
                  defaultValue={project.id}
                  hidden
                />
                <Input name="storyId" id="storyId" type="number" defaultValue={story.id} hidden />
                <Label className="p-2" htmlFor="timeEstimate">
                  Time estimate (in story points)
                </Label>
                <Input
                  name="timeEstimate"
                  id="timeEstimate"
                  type="number"
                  placeholder="Enter time estimate value"
                  defaultValue={story.timeEstimate || undefined}
                  disabled={!canUpdateTimeEstimate}
                  min={0}
                />
                {canUpdateTimeEstimate ? (
                  <Button type="submit" className="mt-1">
                    Update time estimate
                  </Button>
                ) : (
                  <></>
                )}
                {state.message && <FormError>{state.message}</FormError>}
              </form>
            )}
          </div>
        </div>
      </div>
      {onStorySelect != undefined && story.timeEstimate && story.timeEstimate > 0 && isMethodologyManagerBool ? (
      <div className="col-span-2 justify-end flex">
        <input
          type="checkbox"
          onChange={handleCheckboxChange}
          className="form-checkbox h-5 w-5 ml-auto"
        />
      </div>) : (<></>)}
      <div className="col-span-2 justify-end flex">
      <div className="col-span-12 justify-end flex flex-col gap-2">
        {!story.realized && (story.sprint as Sprint)?.id == currentSprint?.id  && canNotSeeTimeEstimate ? (
          <div>
            <Button
            variant="default"
              disabled={
                !story.tasks ||
                story.tasks.length === 0 ||
                story.tasks.some((task) => !task.realized)
              }
              className={`px-4 py-2 rounded ${
                !story.tasks ||
                story.tasks.length === 0 ||
                story.tasks.some((task) => !task.realized)
                  ? "bg-gray-400 cursor-not-allowed"
                  : ""
              }`}
              onClick={async () => {
                await acceptStory(story.id).then(() => {
                  router.refresh();
                });
              }}
            >
              Accept Story
            </Button>
            </div>
        ) : (<></>)}
        
        {(story.sprint as Sprint)?.id == currentSprint?.id  && canNotSeeTimeEstimate ? (
          <div>
            <Button
              variant="destructive"
              onClick={() => setRejectDialogOpen(true)} // Open the reject dialog
            >
              Reject Story
            </Button> 
            <Dialog open={isRejectDialogOpen} onOpenChange={setRejectDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Story</DialogTitle>
                  <p>Please provide a reason for rejecting this story.</p>
                </DialogHeader>
                <Input
                  placeholder="Enter rejection reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (rejectReason.trim() === '') {
                        alert('Please provide a reason for rejection.');
                        return;
                      }
                      await rejectStory(rejectReason, story.id); // Call rejectStory with reason and storyId
                      setRejectDialogOpen(false); // Close the dialog
                      setRejectReason(''); // Clear the input
                      router.refresh(); // Refresh the page
                    }}
                  >
                    Reject
                  </Button>
                  <Button variant="default" onClick={() => setRejectDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
        ) : (<></>)}
        </div>
      </div>
      <div className="col-span-24">
        <h1>
          <b>Tasks</b>
        </h1>
        {(isMemberBool || isMethodologyManagerBool) && (
          <div>
            <AddTaskDialog project={project} story={story} />
          </div>
        )}
        <div>
          <div className="grid grid-cols-7 gap-4">
            <div>Description</div>
            <div>Time Estimate</div>
            <div>Realized</div>
            <div>Tasked User</div>
            <div>Status</div>
            <div>Time tracking</div>
          </div>
          <TaskList
            story={story}
            project={project}
            taskTimes={taskTimes}
            isDeveloperBool={isDeveloperBool}
            isMemberBool={isMemberBool}
            isMethodologyManagerBool={isMethodologyManagerBool}
          />
          <div className="grid grid-cols-7 gap-4 mt-4 px-6">
            <div>Sum:</div>
            <div>
              {sumEstTimes(
                story,
                taskTimes.filter((tt) => story.tasks?.find((t) => t.id === tt.task) !== undefined),
              )}
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div>
              {sumTimes(
                taskTimes.filter((tt) => story.tasks?.find((t) => t.id === tt.task) !== undefined),
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
