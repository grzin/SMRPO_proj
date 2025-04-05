'use client'

import { Project, Sprint, User } from '@/payload-types'
import { FC, useActionState, useState, useRef } from 'react'
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
import { Edit } from 'lucide-react'
import { addUserAction } from '@/actions/project-action'
import SimpleMDE from 'react-simplemde-editor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'easymde/dist/easymde.min.css'


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
  documentationS: string
}> = ({ project, sprints, canAddStory, canUpdateTimeEstimate, canNotSeeTimeEstimate, canAddSprint, users, documentationS }) => {
  const { user } = useUser()
  const [editMembers, setEditMembers] = useState<null | number>(null)
  const [addMember, setAddMembers] = useState(false)
  const [editDetails, setEditDetails] = useState(false)
  const [members, setMembers] = useState(project.members)
  const [documentation, setDocumentation] = useState(documentationS || '')
  const [isEditing, setIsEditing] = useState(false)
  const editorRef = useRef<string | null>(null);

  const initialState = {
    message: '',
  }
  const [state, formAction, pending] = useActionState(addUserAction, initialState)

  const exportToMarkdown = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name}-documentation.md`
    link.click()
    URL.revokeObjectURL(url)
  }

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
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Project members and roles</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <form action={formAction}>
              <input type="hidden" name="project" value={project.id} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">User</TableHead>
                    <TableHead className="text-right">Role</TableHead>
                    {editMembers && <TableHead className="text-right">Action</TableHead>}
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
                          <UserSelect users={users} />
                        </TableCell>
                        <TableCell>
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
                        <TableCell className="flex flex-row gap-2">
                          <Button variant="default" type="submit">
                            Add
                          </Button>
                          <Button variant="destructive">Cancel</Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableFooter>
              </Table>
            </form>
          </CardContent>
        </Card>
      </div>
      <Stories project={project} canAddStory={canAddStory} canUpdateTimeEstimate={canUpdateTimeEstimate} canNotSeeTimeEstimate={canNotSeeTimeEstimate} />
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
                      {canAddSprint ? (<Link href={`/sprints/${sprint.id}`}>{sprint.name}</Link>) : (<>{sprint.name}</>)}
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
                      <Button variant="default">
                      Add sprint
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableFooter>
              ) : (<></>)}
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Project documentation</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
          {isEditing ? (
              <SimpleMDE
                value={documentation}
                onChange={(value) => editorRef.current = value}
                options={{
                  spellChecker: false,
                  placeholder: 'Write your project documentation here...',
                }}
              />
            ) : (
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{documentation}</ReactMarkdown>
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="default" 
                onClick={() => {
                  if (isEditing) {
                    setDocumentation(editorRef.current || documentation)
                  }
                  setIsEditing(!isEditing)
                }}
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              {!isEditing && (
                <Button variant="default" onClick={exportToMarkdown}>
                  Export to Markdown
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
