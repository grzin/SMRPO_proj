'use client'

import React, { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { FormMessage } from '../ui/form'
import { editTaskAction } from '@/actions/task-action'
import { Project, Story, User } from '@/payload-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function EditTaskDialog(
    props: {
      project: Project;
      story: Story;
      task: {id: string, description: string, taskedUser: User | null, estimate: number}
    }
) {
  const members = props.project.members ?? []
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    project: Project,
    story: Story,
    taskId: string
  ) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const result = await editTaskAction(formData, project, story, taskId)
    if ('error' in result) {
      setError(result.error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Edit Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={async (event) => await handleSubmit(event, props.project, props.story, props.task.id)}>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input name="description" defaultValue={props.task.description} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="estimate" className="text-right">
                Time Estimate (hrs)
              </Label>
              <Input
                name="estimate"
                type="number"
                step="0.1"
                min="0.0"
                defaultValue={props.task.estimate}
                className="col-span-3"
                required
              />
            </div>
            <div>
              <Select
                name="member"
                defaultValue={props.task.taskedUser?.id.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem
                      key={(member.user as User).id}
                      value={(member.user as User).id.toString() ?? ''}
                    >
                      {(member.user as User).username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Edit Task</Button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
