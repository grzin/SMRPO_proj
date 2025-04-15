'use client'

import React, { useState } from 'react'

import { projectColumns } from './columns'
import { DataTable } from '../data-table'
import { Project } from '@/payload-types'
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

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const { isAdmin } = useUser()
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DataTable
        columns={projectColumns}
        data={projects}
        filterColumnName={'name'}
        filterPlaceholder={'Filter project names...'}
      >
        {isAdmin && <Actions />}
      </DataTable>
    </div>
  )
}

const Actions = () => {
  const [error, setError] = useState('')
  const [projectName, setProjectName] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            <FormMessage className="col-span-4">{error}</FormMessage>
          </div>
          <Button
            type="submit"
            onClick={async (e) => {
              const res = await createProjectAction(projectName)
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
