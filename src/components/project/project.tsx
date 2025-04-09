'use client'

import { Project, Sprint, User, WallMessage } from '@/payload-types'
import { FC, useActionState, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useUser } from '@/contexts/user-context'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { UserAvatar } from '../ui/avatar'
import { Stories } from '../stories/stories'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { addUserAction, deleteMember } from '@/actions/project-action'
import 'easymde/dist/easymde.min.css'
import { Documentation } from '../documentation/documentation'
import { Wall } from '../wall/wall'

const roleNames = {
  methodology_manager: 'Methodology Manager',
  product_manager: 'Product Manager',
  developer: 'Developer',
}

export const UserSelect: FC<{ users: User[]; defaultValue?: string }> = ({
  users,
  defaultValue,
}) => {
  return (
    <Select defaultValue={defaultValue} name="user">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            <UserAvatar user={user} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const ProjectDashboard: FC<{
  project: Project
  sprints: Sprint[]
  canAddStory: boolean
  canUpdateTimeEstimate: boolean
  canNotSeeTimeEstimate: boolean
  canAddSprint: boolean
  users: User[]
  wallMessages: WallMessage[]
}> = ({
  project,
  sprints,
  canAddStory,
  canUpdateTimeEstimate,
  canNotSeeTimeEstimate,
  canAddSprint,
  users,
  wallMessages,
}) => {
  const { user } = useUser()
  const [editMembers, setEditMembers] = useState<null | number>(null)
  const [addMember, setAddMembers] = useState(false)
  const [editDetails, setEditDetails] = useState(false)
  const [members, setMembers] = useState(project.members)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const editorRef = useRef<string | null>(null)

  const initialState = {
    message: '',
  }
  const [state, formAction, pending] = useActionState(addUserAction, initialState)

  const usersToSelect = users.filter(
    (user) => !members?.some((x) => (x.user as User).id === user.id),
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Project details</CardTitle>
            <CardDescription>Project details</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Table>
              <TableBody>
                <TableRow key="name">
                  <TableCell className="text-lg font-semibold">Name:</TableCell>
                  <TableCell>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button>Edit details</Button>
          </CardFooter>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Project members and roles</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow max-h-[500px] overflow-auto">
            <form action={formAction}>
              <input type="hidden" name="project" value={project.id} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">User</TableHead>
                    <TableHead className="text-right">Role</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!editMembers && (
                    <>
                      {project?.members?.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <UserAvatar user={member.user as User} />
                          </TableCell>
                          <TableCell className="text-right">{roleNames[member.role]}</TableCell>
                          <TableCell className="flex justify-end">
                            {!addMember && (
                              <div className="flex gap-2">
                                <Button>Edit</Button>
                                <Button
                                  onClick={async () => {
                                    const response = await deleteMember(project.id, member.id ?? '')
                                    console.log(response)
                                  }}
                                  variant="destructive"
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                  {editMembers && (
                    <>
                      {members?.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <UserAvatar user={member.user as User} />
                          </TableCell>
                          <Select defaultValue={member.role} name="project_id">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Project" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="methodology_manager">
                                Methodology Manager
                              </SelectItem>
                              <SelectItem value="product_manager">Product Manager</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                            </SelectContent>
                          </Select>
                          <TableCell className="text-right">{roleNames[member.role]}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    {addMember && (
                      <>
                        <TableCell>
                          <UserSelect users={usersToSelect} />
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <Select defaultValue="developer" name="role">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Project" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="methodology_manager">
                                Methodology Manager
                              </SelectItem>
                              <SelectItem value="product_manager">Product Manager</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-2 justify-end">
                            <Button variant="default" type="submit">
                              Add
                            </Button>
                            <Button variant="destructive" onClick={() => setAddMembers(false)}>
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                    {!addMember && (
                      <TableCell colSpan={3}>
                        <Button onClick={() => setAddMembers(true)}>Add member</Button>
                      </TableCell>
                    )}
                  </TableRow>
                </TableFooter>
              </Table>
            </form>
          </CardContent>
        </Card>
      </div>
      <Stories
        project={project}
        canAddStory={canAddStory}
        canUpdateTimeEstimate={canUpdateTimeEstimate}
        canNotSeeTimeEstimate={canNotSeeTimeEstimate}
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
                        <Link href={`/sprints/${sprint.id}`}>{sprint.name}</Link>
                      ) : (
                        <>{sprint.name}</>
                      )}
                    </TableCell>
                    <TableCell>{new Date(sprint.startDate).toLocaleString()}</TableCell>
                    <TableCell>{new Date(sprint.endDate).toLocaleString()}</TableCell>
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
      <Wall wallMessages={wallMessages} projectId={project.id} />
      <Documentation project={project} />
    </div>
  )
}
