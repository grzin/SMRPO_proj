'use client'
import { FC, useActionState, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { TableRow } from '../ui/table'

import { Project, Sprint, TaskTime, User, WallMessage } from '@/payload-types'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader } from '../ui/table'
import { UserAvatar } from '../ui/avatar'
import { addUserAction, deleteMember, editUserAction } from '@/actions/project-action'
import { UserSelect } from './user-select'
import { RoleSelect } from './role-select'
import { isAdminOrMethodologyManager } from './utils'
import { useUser } from '@/contexts/user-context'
import { useRouter } from 'next/navigation'

const roleNames = {
  scrum_master: 'Scrum master',
  scrum_master_developer: 'Scrum master & Developer',
  product_owner: 'Product owner',
  product_owner_developer: 'Product owner & Developer',
  developer: 'Developer',
}

export const ProjectMembers: FC<{
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
}> = ({ project, users }) => {
  const { user } = useUser()
  const router = useRouter()
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

  const [addMember, setAddMembers] = useState(false)

  const initialState = {
    message: '',
  }
  const [state, formAction, pending] = useActionState(addUserAction, initialState)

  const usersToSelect = users.filter(
    (user) => !project.members?.some((x) => (x.user as User).id === user.id),
  )

  const isMethodologyManager = isAdminOrMethodologyManager(user, project)

  return (
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
  )
}
