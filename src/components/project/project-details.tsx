import { Project, Sprint, TaskTime, User, WallMessage } from '@/payload-types'
import { FC, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { isAdminOrMethodologyManager } from './utils'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useUser } from '@/contexts/user-context'
import { useRouter } from 'next/navigation'
import { editProjectDetails } from '@/actions/project-action'

export const ProjectDetails: FC<{
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
  const { project } = props
  const { user } = useUser()
  const router = useRouter()
  // Details
  const [editDetails, setEditDetails] = useState(false)
  const [editName, setEditName] = useState<string>(project.name)
  const [editDescription, setEditDescription] = useState<string>(project.description ?? '')
  const [editError, setEditError] = useState<string>('')

  const isMethodologyManager = isAdminOrMethodologyManager(user, project)

  return (
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
  )
}
