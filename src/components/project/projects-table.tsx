'use client'

import React, { FC, useState } from 'react'

import { projectColumns } from './columns'
import { DataTable } from '../data-table'
import { Project, User } from '@/payload-types'
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
import { createProjectAction } from '@/actions/project-action'
import { useUser } from '@/contexts/user-context'
import { Textarea } from '../ui/textarea'

export default function ProjectsTable({ projects, users }: { projects: Project[]; users: User[] }) {
  const { isAdmin } = useUser()
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DataTable
        columns={projectColumns}
        data={projects}
        filterColumnName={'name'}
        filterPlaceholder={'Filter project names...'}
      >
        {isAdmin && <Actions users={users} />}
      </DataTable>
    </div>
  )
}

const Actions: FC<{ users: User[] }> = ({ users }) => {
  const [error, setError] = useState('')
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create project</Button>
      </DialogTrigger>
      <DialogContent className="w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Project name
            </Label>
            <Input
              name="name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value)
              }}
              className="col-span-3"
            />
            <Label htmlFor="name" className="text-right">
              Project description
            </Label>
            <Textarea
              name="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              className="col-span-3"
            />
            <Label htmlFor="name" className="text-right">
              Members
            </Label>
            <FormMessage className="col-span-4">{error}</FormMessage>
          </div>
          <Button
            type="submit"
            onClick={async (e) => {
              const res = await createProjectAction(projectName, description)
              setError(res.message)
              e.preventDefault()
              return false
            }}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
