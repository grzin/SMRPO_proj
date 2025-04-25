'use client'

import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Project, Story, TaskTime, Sprint } from '@/payload-types'
import { TaskList } from '../stories/stories'
import { Stori, noSprintAssigned } from '../stories/stories'
import { Label } from '@radix-ui/react-select'
import { isProductOwner } from '@/actions/user-actions'

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
  console.log('product backlog stories', project.stories)
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
                    </TabsList>
                    <TabsContent value="active sprint">
                      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {(project.stories as Story[])
                          .filter(
                            (story) =>
                              story.sprint && (story.sprint as Sprint).id === currentSprint?.id,
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
                      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {projectSprints
                          ?.filter(
                            (sprint) =>
                              sprint.name !== noSprintAssigned && sprint.id !== currentSprint?.id,
                          )
                          .map((sprint) => {
                            const sprintStories = (project.stories as Story[]).filter(
                              (story) => story.sprint && (story.sprint as Sprint).id === sprint.id,
                            )
                            const totalTimeEstimate = sprintStories.reduce(
                              (sum, story) => sum + (story.timeEstimate || 0),
                              0,
                            )

                            return (
                              <div key={sprint.id} className="mb-4 border rounded p-4 shadow-sm">
                                <h3 className="text-lg font-semibold">{sprint.name}</h3>
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
                                    />
                                  ))}
                                </div>
                                <div className="mt-2 border-t pt-2">
                                  <p>
                                    <b>Total Time Estimate:</b> {totalTimeEstimate} story points
                                  </p>
                                  <p>
                                    <b>Velocity:</b> {sprint.velocity} story points
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                      <h3 className="text-lg font-semibold">Stories not assigned to any sprint</h3>
                      <div className="flex flex-1 flex-col gap-4">
                        {(project.stories as Story[])
                          .filter(
                            (story) =>
                              !story.sprint && story.timeEstimate && story.timeEstimate > 0,
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
                            />
                          ))}
                      </div>
                      <div className="mt-2 border-t pt-2">
                        <p>
                          <b>Total Time Estimate:</b>{' '}
                          {(project.stories as Story[])
                            .filter((story) => !story.sprint)
                            .reduce((sum, story) => sum + (story.timeEstimate || 0), 0)}{' '}
                          story points
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="realized">
            {(project.stories as Story[])
              .filter((story) => story.timeEstimate == 0)
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
                />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
