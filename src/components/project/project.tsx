'use client'

import { Project, Sprint, TaskTime, User, WallMessage } from '@/payload-types'
import { FC, useActionState, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
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
import {
  addUserAction,
  deleteMember,
  editProjectDetails,
  editUserAction,
} from '@/actions/project-action'
import 'easymde/dist/easymde.min.css'
import { Documentation } from '../documentation/documentation'
import { Wall } from '../wall/wall'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { Textarea } from '../ui/textarea'

const roleNames = {
  scrum_master: 'Scrum master',
  scrum_master_developer: 'Scrum master & Developer',
  product_owner: 'Product owner',
  product_owner_developer: 'Product owner & Developer',
  developer: 'Developer',
}

function isAdminOrMethodologyManager(user: User | null, project: Project) {
  if (user?.role === 'admin') {
    return true
  }

  if (
    project?.members?.find(
      (member) =>
        (member.user as User).id === user?.id &&
        (member.role === 'scrum_master' || member.role == 'scrum_master_developer'),
    )
  ) {
    return true
  }
}

export const UserSelect: FC<{
  users: User[]
  currentUser?: User
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}> = ({ users, defaultValue, currentUser, value, onValueChange }) => {
  let selections = users
  if (currentUser != undefined && !users.some((x) => x.id == currentUser.id)) {
    selections = [currentUser, ...users]
  }
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange} name="user">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent>
        {selections.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            <UserAvatar user={user} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const RoleSelect: FC<{
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}> = ({ defaultValue = 'developer', value, onValueChange }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange} name="role">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Project" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="scrum_master">Scrum master</SelectItem>
        <SelectItem value="scrum_master_developer">Scrum master & Developer</SelectItem>
        <SelectItem value="product_owner">Product owner</SelectItem>
        <SelectItem value="product_owner_developer">Product owner & Developer</SelectItem>
        <SelectItem value="developer">Developer</SelectItem>
      </SelectContent>
    </Select>
  )
}

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
}> = ({
  project,
  taskTimes,
  sprints,
  canAddStory,
  canUpdateTimeEstimate,
  canNotSeeTimeEstimate,
  canAddSprint,
  users,
  wallMessages,
  isDeveloperBool,
  isMemberBool,
  isMethodologyManagerBool,
}) => {
  const router = useRouter()
  const [addMember, setAddMembers] = useState(false)
  const { user } = useUser()

  // Members
  const [editingMember, setEditingMember] = useState<null | string>(null)
  const [selectedUser, setSelectedUser] = useState<null | string>(null)
  const [selectedRole, setSelectedRole] = useState<
    | 'scrum_master'
    | 'scrum_master_developer'
    | 'product_owner'
    | 'product_owner_developer'
    | 'developer'
  >('developer')

  // Details
  const [editDetails, setEditDetails] = useState(false)
  const [editName, setEditName] = useState<string>(project.name)
  const [editDescription, setEditDescription] = useState<string>(project.description ?? '')
  const [editError, setEditError] = useState<string>('')

  const initialState = {
    message: '',
  }
  const [state, formAction, pending] = useActionState(addUserAction, initialState)

  const usersToSelect = users.filter(
    (user) => !project.members?.some((x) => (x.user as User).id === user.id),
  )

  const isMethodologyManager = isAdminOrMethodologyManager(user, project)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Project details</CardTitle>
            <CardDescription>Project details</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="flex flex-col gap-4 items-start justify-start">
              <div className="flex flex-row gap-4">
                <p className="text-lg w-[120px]">Name:</p>
                {!editDetails && <h3 className="text-xl">{project.name}</h3>}
                {editDetails && (
                  <Input
                    className="w-[500px]"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value)
                    }}
                  />
                )}
              </div>
              <div className="flex flex-row gap-4">
                <p className="text-lg w-[120px]">Description:</p>
                {!editDetails && <h3 className="text-lg">{project.description}</h3>}
                {editDetails && (
                  <Textarea
                    rows={6}
                    className="w-[500px]"
                    value={editDescription}
                    onChange={(e) => {
                      setEditDescription(e.target.value)
                    }}
                  />
                )}
              </div>
              {isMethodologyManager && !editDetails && (
                <Button
                  onClick={() => {
                    setEditDetails(true)
                    setEditError('')
                    setEditName(project.name)
                    setEditDescription(project.description ?? '')
                  }}
                >
                  Edit
                </Button>
              )}
              {editDetails && (
                <div className="flex flex-row gap-4">
                  <Button
                    onClick={async () => {
                      if (editName === project.name && editDescription === project.description) {
                        setEditError('')
                        setEditDetails(false)
                        return
                      }

                      const result = await editProjectDetails(project.id, editName, editDescription)

                      if (result.isError) {
                        setEditError(result.error)
                        setEditDetails(true)
                      } else {
                        setEditError('')
                        setEditDetails(false)
                        router.refresh()
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditDetails(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <p style={{ color: 'red' }} className="text-lg">
              {editError}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
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
                  {project?.members?.map((member) => {
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {editingMember != member.id && <UserAvatar user={member.user as User} />}
                          {editingMember == member.id && (
                            <UserSelect
                              users={usersToSelect}
                              currentUser={member.user as User}
                              value={selectedUser?.toString()}
                              onValueChange={(newVal) => setSelectedUser(newVal)}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            {editingMember != member.id && <p>{roleNames[member.role]}</p>}
                            {editingMember == member.id && (
                              <RoleSelect
                                value={selectedRole}
                                onValueChange={(newVal) => {
                                  if (
                                    newVal == 'scrum_master' ||
                                    newVal == 'product_owner' ||
                                    newVal == 'developer' ||
                                    newVal == 'scrum_master_developer' ||
                                    newVal == 'product_owner_developer'
                                  ) {
                                    setSelectedRole(newVal)
                                  }
                                }}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <div className="flex gap-2">
                            {isMethodologyManager &&
                              editingMember != member.id &&
                              user?.id != (member.user as User).id && (
                                <>
                                  <Button
                                    onClick={(e) => {
                                      setEditingMember(member.id ?? null)
                                      setSelectedUser((member?.user as User).id.toString())
                                      setSelectedRole(member.role)
                                      e.preventDefault()
                                      return false
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={async (e) => {
                                      await deleteMember(project.id, member.id ?? '')
                                      e.preventDefault()
                                      return false
                                    }}
                                    variant="destructive"
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            {isMethodologyManager && editingMember == member.id && (
                              <>
                                <Button
                                  onClick={async (e) => {
                                    const response = await editUserAction(
                                      project.id,
                                      member.id ?? '',
                                      parseInt(selectedUser ?? ''),
                                      selectedRole,
                                    )
                                    if (response == 'OK') {
                                      router.refresh()
                                    }
                                    e.preventDefault()
                                    return false
                                  }}
                                  type="button"
                                >
                                  Save
                                </Button>
                                <Button
                                  onClick={async (e) => {
                                    setEditingMember(null)
                                    e.preventDefault()
                                    return false
                                  }}
                                  variant="secondary"
                                  type="button"
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    {addMember && (
                      <>
                        <TableCell>
                          <UserSelect users={usersToSelect} />
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <RoleSelect />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-2 justify-end">
                            <Button variant="default" type="submit" disabled={pending}>
                              Add
                            </Button>
                            <Button variant="destructive" onClick={() => setAddMembers(false)}>
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                    {isMethodologyManager && !addMember && (
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
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sprit backlog</CardTitle>
          </CardHeader>
          <CardContent className=""></CardContent>
        </Card>
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
      <Documentation project={project} />
    </div>
  )
}
