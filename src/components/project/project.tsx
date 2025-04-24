'use client'

import { Project, Sprint, TaskTime, User, WallMessage } from '@/payload-types'
import { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Stories } from '../stories/stories'
import Link from 'next/link'
import 'easymde/dist/easymde.min.css'
import { Documentation } from '../documentation/documentation'
import { Wall } from '../wall/wall'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { SprintBacklog } from './sprint-backlog'
import { ProductBacklog } from './product-backlog'
import { ProjectMembers } from './project-members'
import { ProjectDetails } from './project-details'

export const ProjectDashboard: FC<{
  project: Project
  taskTimes: TaskTime[]
  sprints: Sprint[]
  canAddStory: boolean
  canUpdateTimeEstimate: boolean
  canNotSeeTimeEstimate: boolean
  canAddSprint: boolean
  users: User[]
  wallMessages: WallMessage[]
  isDeveloperBool: boolean
  isMemberBool: boolean
  isMethodologyManagerBool: boolean
}> = (props) => {
  const {
    project,
    taskTimes,
    sprints,
    canAddStory,
    canUpdateTimeEstimate,
    canNotSeeTimeEstimate,
    canAddSprint,
    wallMessages,
    isDeveloperBool,
    isMemberBool,
    isMethodologyManagerBool,
  } = props
console.log("sprintsm project dashboard", sprints)
  return (
    <Tabs defaultValue="details">
      <TabsList className="w-full">
        <TabsTrigger value="details">Project details</TabsTrigger>
        <TabsTrigger value="product">Product backlog</TabsTrigger>
        <TabsTrigger value="sprint">Sprint backlog</TabsTrigger>
        <TabsTrigger value="documentation">Documentation</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <ProjectDetails {...props} />
            <ProjectMembers {...props} />
          </div>
          <Stories
            project={project}
            taskTimes={taskTimes}
            canAddStory={canAddStory}
            canUpdateTimeEstimate={canUpdateTimeEstimate}
            canNotSeeTimeEstimate={canNotSeeTimeEstimate}
            isDeveloperBool={isDeveloperBool}
            isMemberBool={isMemberBool}
            isMethodologyManagerBool={isMethodologyManagerBool}
            projectSprints={sprints}
          />
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sprints</CardTitle>
                <CardDescription>Project sprints</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Start date</TableHead>
                      <TableHead>End date</TableHead>
                      <TableHead>Velocity (in story points)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sprints.map((sprint) => (
                      <TableRow key={sprint.id}>
                        <TableCell className="font-medium">
                          {canAddSprint ? (
                            <Link href={`/sprints/${sprint.id}?projectId=${project.id}`}>
                              {sprint.name}
                            </Link>
                          ) : (
                            <>{sprint.name}</>
                          )}
                        </TableCell>
                        <TableCell>{new Date(sprint.startDate).toLocaleString('sl-SI')}</TableCell>
                        <TableCell>{new Date(sprint.endDate).toLocaleString('sl-SI')}</TableCell>
                        <TableCell>{sprint.velocity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {canAddSprint ? (
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Link href={`/sprints/-1?projectId=${project.id}`}>
                            <Button variant="default">Add sprint</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  ) : (
                    <></>
                  )}
                </Table>
              </CardContent>
            </Card>
          </div>
          <Wall wallMessages={wallMessages} project={project} />
        </div>
      </TabsContent>
      <TabsContent value="product">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ProductBacklog
            project={project}
            taskTimes={taskTimes}
            canAddStory={canAddStory}
            canUpdateTimeEstimate={canUpdateTimeEstimate}
            canNotSeeTimeEstimate={canNotSeeTimeEstimate}
            isDeveloperBool={isDeveloperBool}
            isMemberBool={isMemberBool}
            isMethodologyManagerBool={isMethodologyManagerBool}
            projectSprints={sprints}
          />
        </div>
      </TabsContent>
      <TabsContent value="sprint">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SprintBacklog
            project={project}
            taskTimes={taskTimes}
            canAddStory={canAddStory}
            canUpdateTimeEstimate={canUpdateTimeEstimate}
            canNotSeeTimeEstimate={canNotSeeTimeEstimate}
            isDeveloperBool={isDeveloperBool}
            isMemberBool={isMemberBool}
            isMethodologyManagerBool={isMethodologyManagerBool}
          />
        </div>
      </TabsContent>
      <TabsContent value="documentation">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Documentation project={project} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
