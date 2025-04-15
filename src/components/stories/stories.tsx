'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { FC, useActionState } from 'react'
import Link from 'next/link'
import { canDeleteStory } from '@/actions/user-actions'
import { useUser } from '@/contexts/user-context'
import { useEffect, useState } from 'react'
import { Project, Story, TaskTime, User } from '@/payload-types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { editStoryTimeEstimateAction } from '@/actions/story-action'
import { toggleRealizationAction } from '@/actions/task-action'
import { FormError } from '../ui/form'
import AddTaskDialog from '../tasks/tasks-add-dialog'
import { Switch } from '@/components/ui/switch'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import datetimeDifference from 'datetime-difference'

function sumTimes(taskTimes: TaskTime[]) {
  dayjs.extend(duration)
  let sum = dayjs.duration(0)

  taskTimes.forEach((taskTime) => {
    if (taskTime.customHMS) {
      const negative = taskTime.customHMS.charAt(0) === '-'
      if (negative) {
        const arr = taskTime.customHMS.substring(2).split(' ')
        sum = sum.subtract({
          hours: Number(arr[0].split('h')[0]),
          minutes: Number(arr[1].split('m')[0]),
          seconds: Number(arr[2].split('s')[0]),
        })
      } else {
        const arr = taskTime.customHMS.split(' ')
        sum = sum.add({
          hours: Number(arr[0].split('h')[0]),
          minutes: Number(arr[1].split('m')[0]),
          seconds: Number(arr[2].split('s')[0]),
        })
      }
    } else if (taskTime.end) {
      const diff = datetimeDifference(new Date(taskTime.start), new Date(taskTime.end))
      sum = sum.add({
        hours: diff.hours,
        minutes: diff.minutes,
        seconds: diff.seconds,
      })
    }
  })

  return `${sum.hours()}h ${sum.minutes()}m ${sum.seconds()}s`
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
}> = ({
  project,
  taskTimes,
  canAddStory,
  canUpdateTimeEstimate,
  canNotSeeTimeEstimate,
  isDeveloperBool,
  isMemberBool,
  isMethodologyManagerBool,
}) => {
  const [deletableStories, setDeletableStories] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const user = useUser().user

  const handleGoToAdd = () => {
    router.push(`/stories/add?projectId=${project.id}`)
  }

  const handleToggle = async (storyId: number, taskId: any, newValue: boolean) => {
    const result = await toggleRealizationAction(storyId, taskId, newValue)
    if ('error' in result) {
      // event.preventDefault()
      return
    }
    router.refresh()
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
                      <ul>
                        {story.acceptanceTests.map((testObj, index) => (
                          <li key={index}>#{testObj.test}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                          <Label htmlFor="timeEstimate">Time estimate (in story points)</Label>
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
                              Update
                            </Button>
                          ) : (
                            <></>
                          )}
                          {state.message && <FormError>{state.message}</FormError>}
                        </form>
                      )}
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
                      <div className="grid grid-cols-6 gap-4">
                        <div>Description</div>
                        <div>Time Estimate</div>
                        <div>Realized</div>
                        <div>Tasked User</div>
                        <div>Status</div>
                        <div>Time tracking</div>
                      </div>
                      {story.tasks?.map((task) => (
                        <Card key={task.id}>
                          <CardContent>
                            <div className="grid grid-cols-6 gap-4">
                              <div>{task.description}</div>
                              <div>{task.estimate}</div>
                              <div>
                                <Switch
                                  checked={task.realized}
                                  onCheckedChange={(val) => handleToggle(story.id, task.id, val)}
                                  disabled={
                                    !task.taskedUser || !(user?.id === (task.taskedUser as User).id)
                                  }
                                />
                              </div>
                              <div>
                                {task.taskedUser ? (
                                  (task.taskedUser as User).username
                                ) : (
                                  <span style={{ color: 'gray', fontStyle: 'italic' }}>
                                    Unassigned
                                  </span>
                                )}
                              </div>
                              <div>{task.status}</div>
                              <div className="flex justify-between">
                                {sumTimes(taskTimes.filter((t) => t.task === task.id))}
                                {user?.id === (task.taskedUser as User).id && isDeveloperBool ? (
                                  <a
                                    href={
                                      '/projects/' + project.id + '/tasks/time/' + (task.id || '')
                                    }
                                    className="text-primary"
                                  >
                                    {' '}
                                    Manage
                                  </a>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
