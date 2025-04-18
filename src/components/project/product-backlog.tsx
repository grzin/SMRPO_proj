'use client'

import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Project, Story, TaskTime } from '@/payload-types'
import { TaskList } from '../stories/stories'
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
}> = ({ project, taskTimes, isDeveloperBool, isMemberBool, isMethodologyManagerBool }) => {
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
                        
                      </div>
                    </TabsContent>
                    <TabsContent value="others">
                      {(project.stories as Story[]).map((story) => (
                        <TaskList
                          filterStatus="pending"
                          key={story.id}
                          story={story}
                          project={project}
                          taskTimes={taskTimes}
                          isDeveloperBool={isDeveloperBool}
                          isMemberBool={isMemberBool}
                          isMethodologyManagerBool={isMethodologyManagerBool}
                          displayTitle={true}
                        />
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="realized">
            {(project.stories as Story[]).map((story) => (
              <TaskList
                filterStatus="realized"
                key={story.id}
                story={story}
                project={project}
                taskTimes={taskTimes}
                isDeveloperBool={isDeveloperBool}
                isMemberBool={isMemberBool}
                isMethodologyManagerBool={isMethodologyManagerBool}
                displayTitle={true}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
