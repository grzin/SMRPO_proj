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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export default function SprintEdit({
  sprintEdit,
  sprintEditProjects,
  ...props
}: React.ComponentProps<'div'> & { sprintEdit: Sprint | null, sprintEditProjects: Project[] }) {
  if (sprintEdit == null) {
    return <CreateSprint projects={sprintEditProjects} {...props}></CreateSprint>
  } else {
    return (
      <>
        <EditSprint editSprint={sprintEdit} {...props}></EditSprint>
      </>
    )
  }
}

function CreateSprint({
  className,
  projects,
  ...props
}: React.ComponentProps<'div'> & { projects: Project[] }) {
  const initialState = {
    name: '',
    startDate: '',
    endDate: '',
    speed: 0,
    project_id: 1,
    message: '',
    error: {
      name: '',
      startDate: '',
      endDate: '',
      speed: '',
      project_id: '',
    },
  }

  const [state, formAction, pending] = useActionState(createSprintAction, initialState)

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
                <Label htmlFor="speed">Speed</Label>
                <Input
                  name="speed"
                  id="speed"
                  type="number"
                  placeholder=""
                  min={0}
                  required
                  defaultValue={state.speed}
                />
                {state.error.speed && <FormError>{state.error.speed}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="role">Project</Label>
                <Select defaultValue={state.project_id.toString()} name="project_id">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                    <SelectItem value={`${project.id}`} key={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state.error.project_id && <FormError>{state.error.project_id}</FormError>}
              </div>
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

function EditSprint({
  className,
  editSprint,
  ...props
}: React.ComponentProps<'div'> & { editSprint: Sprint }) {
  const formatDate = (date: string) => new Date(date).toISOString().substring(0, 10)

  const initialState = {
    name: editSprint.name,
    startDate: formatDate(editSprint.startDate),
    endDate: formatDate(editSprint.endDate),
    speed: editSprint.speed,
    message: '',
    error: {
      name: '',
      startDate: '',
      endDate: '',
      speed: '',
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
                <Label htmlFor="speed">Speed</Label>
                <Input
                  name="speed"
                  id="speed"
                  type="number"
                  placeholder=""
                  required
                  defaultValue={state.speed}
                />
                {state.error.speed && <FormError>{state.error.speed}</FormError>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={pending}>
                  Save
                </Button>
                {state.message && <FormError>{state.message}</FormError>}
              </div>
            </div>
          </form>
          <form action={deleteFormAction}>
            <div className="flex flex-col gap-6 mt-8">
              <input type="hidden" name="id" value={editSprint.id} />
              <Button variant={'destructive'} disabled={deletePending}>
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
