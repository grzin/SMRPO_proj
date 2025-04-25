'use client'

import { FC } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Project, Story, TaskTime, Sprint } from '@/payload-types'
import { TaskList } from '../stories/stories'
import { Stori, noSprintAssigned } from '../stories/stories'
import { Label } from '@radix-ui/react-select'
import { isProductOwner } from '@/actions/user-actions'
import { useState } from 'react'
import { editStorySprint } from '@/actions/story-action'

export const ProductBacklog: FC<{
  project: Project
  taskTimes: TaskTime[]
  canAddStory: boolean
  canUpdateTimeEstimate: boolean
  canNotSeeTimeEstimate: boolean
  isDeveloperBool: boolean
  isMemberBool: boolean
  isMethodologyManagerBool: boolean
  projectSprints: Sprint[]
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
  const today = new Date()
  const currentSprint = projectSprints?.find(
    (sprint) => new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today,
  )
  const [selectedStories, setSelectedStories] = useState<number[]>([]);
  
  console.log('sprints', projectSprints)
  return (
    <Card className="col-span-3">
      <CardContent className="">
        <Tabs defaultValue="unrealized">
          <TabsList className="w-full">
            <TabsTrigger value="unrealized">Unrealized</TabsTrigger>
            <TabsTrigger value="realized">Realized</TabsTrigger>
          </TabsList>
          <TabsContent value="unrealized">
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Card className="col-span-3">
                <CardContent className="">
                  <Tabs defaultValue="active sprint">
                    <TabsList className="w-full">
                      <TabsTrigger value="active sprint">
                        Active sprint{currentSprint ? ' - ' + currentSprint?.name : ''}
                      </TabsTrigger>
                      <TabsTrigger value="others">Other</TabsTrigger>
                      <TabsTrigger value="future releases">Future Releases</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active sprint">
                      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {(project.stories as Story[])
                          .filter(
                            (story) =>
                              story.sprint && (story.sprint as Sprint).id === currentSprint?.id && story.timeEstimate && story.timeEstimate > 0,
                          )
                          .map((story) => (
                            <Stori
                              key={story.id}
                              story={story}
                              project={project}
                              taskTimes={taskTimes}
                              canUpdateTimeEstimate={canUpdateTimeEstimate}
                              canNotSeeTimeEstimate={canNotSeeTimeEstimate}
                              isDeveloperBool={isDeveloperBool}
                              isMemberBool={isMemberBool}
                              isMethodologyManagerBool={isMethodologyManagerBool}
                              projectSprints={projectSprints}
                              canAddStory={canAddStory}
                              onStorySelect={undefined}
                            />
                          ))}
                        {currentSprint && (
                          <div className="mt-2 border-t pt-2">
                            <p>
                              <b>Total Time Estimate:</b>{' '}
                              {(project.stories as Story[])
                                .filter(
                                  (story) =>
                                    story.sprint &&
                                    (story.sprint as Sprint).id === currentSprint.id,
                                )
                                .reduce((sum, story) => sum + (story.timeEstimate || 0), 0)}{' '}
                              story points
                            </p>
                            <p>
                              <b>Velocity:</b> {currentSprint.velocity} story points
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="others">
                      <div className="flex flex-1 flex-col gap-4">
                        {currentSprint && (
                          <div className="mb-4 flex justify-end">
                            <Button
                              disabled={selectedStories.length === 0}
                              className={`mt-1 ${selectedStories.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                              onClick={async () => {
                                for (const storyId of selectedStories) {
                                  await editStorySprint(currentSprint.name, storyId);
                                }
                                setSelectedStories([]);
                                (project.stories as Story[]).forEach((story) => {
                                  if (selectedStories.includes(story.id)) {
                                    story.sprint = currentSprint;
                                  }
                                })
                              }}
                                
                            >
                              Add selected stories to current sprint
                            </Button>
                          </div>
                        )}
                        {(project.stories as Story[])
                          .filter(
                            (story) =>
                              !story.sprint && story.priority !== 'won\'t have this time',
                          )
                          .map((story) => (
                            <Stori
                              key={story.id}
                              story={story}
                              project={project}
                              taskTimes={taskTimes}
                              canUpdateTimeEstimate={canUpdateTimeEstimate}
                              canNotSeeTimeEstimate={canNotSeeTimeEstimate}
                              isDeveloperBool={isDeveloperBool}
                              isMemberBool={isMemberBool}
                              isMethodologyManagerBool={isMethodologyManagerBool}
                              projectSprints={projectSprints}
                              canAddStory={canAddStory}
                              onStorySelect={(storyId, isSelected) => {
                                setSelectedStories((prev) =>
                                  isSelected ? [...prev, storyId] : prev.filter((id) => id !== storyId)
                                );
                              }}
                            />
                          ))}
                      </div>
                      <div className="mt-2 border-t pt-2">
                        <p>
                          <b>Total Time Estimate:</b>{' '}
                          {(project.stories as Story[])
                            .filter((story) => !story.sprint && story.priority !== 'won\'t have this time')
                            .reduce((sum, story) => sum + (story.timeEstimate || 0), 0)}{' '}
                          story points
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="future releases">
                      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {(project.stories as Story[])
                          .filter(
                            (story) =>
                              story.priority === 'won\'t have this time'
                          )
                          .map((story) => (
                            <Stori
                              key={story.id}
                              story={story}
                              project={project}
                              taskTimes={taskTimes}
                              canUpdateTimeEstimate={canUpdateTimeEstimate}
                              canNotSeeTimeEstimate={canNotSeeTimeEstimate}
                              isDeveloperBool={isDeveloperBool}
                              isMemberBool={isMemberBool}
                              isMethodologyManagerBool={isMethodologyManagerBool}
                              projectSprints={projectSprints}
                              canAddStory={canAddStory}
                              onStorySelect={undefined}
                            />
                          ))}
                        {currentSprint && (
                          <div className="mt-2 border-t pt-2">
                            <p>
                              <b>Total Time Estimate:</b>{' '}
                              {(project.stories as Story[])
                                .filter(
                                  (story) =>
                                    story.priority === 'won\'t have this time',
                                )
                                .reduce((sum, story) => sum + (story.timeEstimate || 0), 0)}{' '}
                              story points
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="realized">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {projectSprints
              ?.filter(
                (sprint) =>
                  sprint.name !== noSprintAssigned && new Date(sprint.startDate) < today,
              )
              .map((sprint) => {
                const sprintStories = (project.stories as Story[]).filter(
                  (story) => story.timeEstimate == 0 && (story.sprint as Sprint)?.id === sprint.id,
                )
                console.log('sprint stories', sprintStories)
                console.log('project stories', project.stories)
                console.log('sprint', sprint)
                return (
                  <div key={sprint.id} className="mb-4 border rounded p-4 shadow-sm">
                    <h3 className="text-lg">Implemented in: <b className="font-semibold">{sprint.name}</b></h3>
                    <div className="flex flex-1 flex-col gap-4">
                      {sprintStories.map((story) => (
                        <Stori
                          key={story.id}
                          story={story}
                          project={project}
                          taskTimes={taskTimes}
                          canUpdateTimeEstimate={canUpdateTimeEstimate}
                          canNotSeeTimeEstimate={canNotSeeTimeEstimate}
                          isDeveloperBool={isDeveloperBool}
                          isMemberBool={isMemberBool}
                          isMethodologyManagerBool={isMethodologyManagerBool}
                          projectSprints={projectSprints}
                          canAddStory={canAddStory}
                          onStorySelect={undefined}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
