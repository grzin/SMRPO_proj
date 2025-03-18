'use client'

import React, { useActionState } from 'react'

import { projectColumns } from './columns'
import { DataTable } from '../data-table'
import { Project } from '@/payload-types'
import { Button } from '../ui/button'
import Link from 'next/link'
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

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const initialState = {
    name: '',
    message: '',
  }
  const [state, formAction, pending] = useActionState(createProjectAction, initialState)

  const Actions = () => {
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
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Project name
                </Label>
                <Input name="name" defaultValue={state.name} className="col-span-3" />
                <FormMessage className="col-span-4">{state.message}</FormMessage>
              </div>
              <Button type="submit" disabled={pending}>
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DataTable
        columns={projectColumns}
        data={projects}
        filterColumnName={'name'}
        filterPlaceholder={'Filter project names...'}
      >
        <Actions />
      </DataTable>
    </div>
  )
}
