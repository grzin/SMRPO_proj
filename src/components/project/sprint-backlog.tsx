'use client'

import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Project, Story, TaskTime } from '@/payload-types'
import { TaskList } from '../stories/stories'
import { Label } from '@radix-ui/react-select'

export const SprintBacklog: FC<{
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
        <Tabs defaultValue="unassigned">
          <TabsList className="w-full">
            <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
          <TabsContent value="unassigned">
            {(project.stories as Story[]).map((story) => (
              <TaskList
                filterStatus="unassigned"
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
          <TabsContent value="assigned">
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
          <TabsContent value="active">
            {(project.stories as Story[]).map((story) => (
              <TaskList
                filterStatus="accepted"
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
          <TabsContent value="done">
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
