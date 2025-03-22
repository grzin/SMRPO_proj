'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useActionState } from 'react'
import { createSprintAction, editSprintAction, deleteSprintAction } from '@/actions/sprint-management-actions'
import { FormError } from '../ui/form'
import { Project, Sprint } from '@/payload-types'
import { useSearchParams } from 'next/navigation'

export default function SprintEdit({
  sprintEdit,
  sprintEditProjects,
  sprints,
  ...props
}: React.ComponentProps<'div'> & { sprintEdit: Sprint | null, sprintEditProjects: Project[], sprints: Sprint[] }) {
  if (sprintEdit == null) {
    return <CreateSprint projects={sprintEditProjects} sprints={sprints} {...props}></CreateSprint>
  } else {
    return (
      <>
        <EditSprint editSprint={sprintEdit} projects={sprintEditProjects} {...props}></EditSprint>
      </>
    )
  }
}

function CreateSprint({
  className,
  projects,
  sprints,
  ...props
}: React.ComponentProps<'div'> & { projects: Project[], sprints: Sprint[] }) {
  const searchParams = useSearchParams()
  const projectId = Number(searchParams.get('projectId'))
  const n_sprints = sprints.filter(s => (s.project as Project).id === projectId).length

  const initialState = {
    name: `Sprint #${n_sprints+1}`,
    startDate: '',
    endDate: '',
    velocity: 0,
    project_id: projectId,
    message: '',
    error: {
      name: '',
      startDate: '',
      endDate: '',
      velocity: '',
      project_id: '',
    },
  }

  const [state, formAction, pending] = useActionState(createSprintAction, initialState)
  state.project_id = projectId

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create new sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder=""
                  required
                  defaultValue={state.name}
                />
                {state.error.name && <FormError>{state.error.name}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  name="startDate"
                  id="startDate"
                  type="date"
                  placeholder=""
                  required
                  defaultValue={state.startDate}
                />
                {state.error.startDate && <FormError>{state.error.startDate.toString()}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="endDate">End date</Label>
                <Input
                  name="endDate"
                  id="endDate"
                  type="date"
                  placeholder=""
                  required
                  defaultValue={state.endDate}
                />
                {state.error.endDate && <FormError>{state.error.endDate.toString()}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="velocity">Velocity (in story points)</Label>
                <Input
                  name="velocity"
                  id="velocity"
                  type="number"
                  placeholder=""
                  min={0}
                  required
                  defaultValue={state.velocity}
                />
                {state.error.velocity && <FormError>{state.error.velocity}</FormError>}
              </div>
              <Input name='project_id'
                     id="project_id"
                     type='number'
                     defaultValue={projectId}
                     hidden/>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={pending}>
                  Create
                </Button>
                {state.message && <FormError>{state.message}</FormError>}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function isSprintActive(sprint: Sprint) {
  const currentDate = new Date()
  return (new Date(sprint.startDate) < currentDate) && (new Date(sprint.endDate) > currentDate)
}

function EditSprint({
  className,
  editSprint,
  projects,
  ...props
}: React.ComponentProps<'div'> & { editSprint: Sprint, projects: Project[] }) {
  const formatDate = (date: string) => new Date(date).toISOString().substring(0, 10)

  const initialState = {
    name: editSprint.name,
    startDate: formatDate(editSprint.startDate),
    endDate: formatDate(editSprint.endDate),
    velocity: editSprint.velocity,
    project_id: editSprint.project,
    message: '',
    error: {
      name: '',
      startDate: '',
      endDate: '',
      velocity: '',
      project_id: '',
    },
  }

  const initialDeleteState = {
    message: '',
  }

  const [state, formAction, pending] = useActionState(editSprintAction, initialState)
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteSprintAction,
    initialDeleteState,
  )

  const currentDate = new Date()
  const activeSprint = new Date(state.startDate) < currentDate && new Date(state.endDate) > currentDate
  const pastSprint = new Date(state.endDate) < currentDate

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Edit sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <input type="hidden" name="id" value={editSprint.id} />
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder=""
                  required
                  defaultValue={state.name}
                  disabled={activeSprint || pastSprint}
                />
                {state.error.name && <FormError>{state.error.name}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  name="startDate"
                  id="startDate"
                  type="date"
                  placeholder=""
                  required
                  defaultValue={state.startDate}
                  disabled={activeSprint || pastSprint}
                />
                {state.error.startDate && <FormError>{state.error.startDate.toString()}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="endDate">End date</Label>
                <Input
                  name="endDate"
                  id="endDate"
                  type="date"
                  placeholder=""
                  required
                  defaultValue={state.endDate}
                  disabled={activeSprint || pastSprint}
                />
                {state.error.endDate && <FormError>{state.error.endDate.toString()}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="velocity">Velocity (in story points)</Label>
                <Input
                  name="velocity"
                  id="velocity"
                  type="number"
                  placeholder=""
                  required
                  defaultValue={state.velocity}
                  disabled={pastSprint}
                />
                {state.error.velocity && <FormError>{state.error.velocity}</FormError>}
              </div>
              <Input name='project_id'
                     id="project_id"
                     type='number'
                     defaultValue={(state.project_id as Project).id}
                     hidden/>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={pending || pastSprint}>
                  Save
                </Button>
                {state.message && <FormError>{state.message}</FormError>}
              </div>
            </div>
          </form>
          <form action={deleteFormAction}>
            <div className="flex flex-col gap-6 mt-8">
              <input type="hidden" name="id" value={editSprint.id} />
              <Button variant={'destructive'} disabled={deletePending || activeSprint || pastSprint}>
                Delete sprint
              </Button>
              {deleteState.message && <FormError>{deleteState.message}</FormError>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
