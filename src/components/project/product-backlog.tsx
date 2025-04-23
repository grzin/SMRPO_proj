'use client'

import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Project, Story, TaskTime, Sprint } from '@/payload-types'
import { TaskList } from '../stories/stories'
import { Stori } from '../stories/stories'
import { Label } from '@radix-ui/react-select'

export const ProductBacklog: FC<{
  project: Project
  taskTimes: TaskTime[]
  canAddStory: boolean
  canUpdateTimeEstimate: boolean
  canNotSeeTimeEstimate: boolean
  isDeveloperBool: boolean
  isMemberBool: boolean
  isMethodologyManagerBool: boolean
  projectSprints: Sprint[] | null
}> = ({ project, taskTimes, isDeveloperBool, isMemberBool, isMethodologyManagerBool, projectSprints }) => {
  const today = new Date();
  const currentSprint = projectSprints?.find(
    (sprint) => new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today
  );
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
                      <TabsTrigger value="active sprint">Active sprint</TabsTrigger>
                      <TabsTrigger value="others">Other</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active sprint">
                      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {(project.stories as Story[])
                          .filter((story) => story.sprint && (story.sprint as Sprint).id === currentSprint?.id)
                          .map((story) => (
                            <Stori
                              story={story}
                              project={project}
                              taskTimes={taskTimes}
                              canUpdateTimeEstimate={false}
                              canNotSeeTimeEstimate={false}
                              isDeveloperBool={false}
                              isMemberBool={false}
                              isMethodologyManagerBool={false}
                              projectSprints={null}
                            />
                        ))}                       
                      </div>
                    </TabsContent>
                    <TabsContent value="others">
                      {(project.stories as Story[])
                        .filter((story) => !(story.timeEstimate == 0 && story.sprint) && story.sprint && (story.sprint as Sprint).id !== currentSprint?.id)
                        .map((story) => (
                          <Stori
                            story={story}
                            project={project}
                            taskTimes={taskTimes}
                            canUpdateTimeEstimate={false}
                            canNotSeeTimeEstimate={false}
                            isDeveloperBool={false}
                            isMemberBool={false}
                            isMethodologyManagerBool={false}
                            projectSprints={null}
                          />
                      ))}
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
                  story={story}
                  project={project}
                  taskTimes={taskTimes}
                  canUpdateTimeEstimate={false}
                  canNotSeeTimeEstimate={false}
                  isDeveloperBool={false}
                  isMemberBool={false}
                  isMethodologyManagerBool={false}
                  projectSprints={null}
                />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
