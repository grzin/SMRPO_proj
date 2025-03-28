'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { FC, useActionState } from 'react'
import Link from 'next/link'
import { canDeleteStory } from '@/actions/user-actions'
import { useUser } from '@/contexts/user-context'
import { useEffect, useState } from 'react'
import { Project, Story, User } from '@/payload-types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { editStoryTimeEstimateAction } from '@/actions/story-action'
import { FormError } from '../ui/form'

export const Stories: FC<{ project: Project, canAddStory: boolean, canUpdateTimeEstimate: boolean }> = ({
  project,
  canAddStory,
  canUpdateTimeEstimate,
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

  //console.log(deletableStories)
  //console.log(user)
  //console.log(project.stories)

  console.log(project.members)

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
              {(project.stories as Story[]).map((story) =>
                deletableStories[story.id] ? (
                  <li
                    key={story.id}
                    className="border rounded p-4 hover:bg-gray-100 grid auto-rows-min gap-4 md:grid-cols-3"
                  >
                    <Link href={`/stories/edit?storyId=${story.id}&projectId=${project.id}`} className='cursor-pointer col-span-2'>
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
                    <div className="col-span-1">
                      <div className="grid gap-3">
                        <form action={formAction}>
                          <Input name='projectId'
                                id="projectId"
                                type='number'
                                defaultValue={project.id}
                                hidden/>
                          <Input name='storyId'
                                id="storyId"
                                type='number'
                                defaultValue={story.id}
                                hidden/>
                          <Label htmlFor="timeEstimate">Time estimate</Label>
                          <Input
                            name="timeEstimate"
                            id="timeEstimate"
                            type="number"
                            placeholder="Enter time estimate value"
                            defaultValue={story.timeEstimate || undefined}
                            disabled={!canUpdateTimeEstimate}
                            min={0}
                          />
                          <Button type="submit" className="mt-1" disabled={!canUpdateTimeEstimate || pending}>Update</Button>
                          {state.message && <FormError>{state.message}</FormError>}
                        </form>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={story.id} className="border rounded p-4">
                    <h3 className="text-lg font-semibold">{story.title}</h3>
                    <p>Description: {story.description}</p>
                    <p className="text-sm text-gray-500">Priority: {story.priority}</p>
                    <p className="text-sm text-gray-500">Business Value: {story.businessValue}</p>
                    <ul>
                      {story.acceptanceTests.map((testObj, index) => (
                        <li key={index}>#{testObj.test}</li>
                      ))}
                    </ul>
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p>No stories found for this project.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
