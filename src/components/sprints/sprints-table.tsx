'use client'

import React from 'react'

import { sprintColumns } from './columns'
import { DataTable } from '../data-table'
import { Sprint } from '@/payload-types'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function Sprints({ sprints }: { sprints: Sprint[] }) {
  const Actions = () => {
    return (
      <Button>
        <Link href="/sprints/-1">Create sprint</Link>
      </Button>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DataTable
        columns={sprintColumns}
        data={sprints}
        filterColumnName={'name'}
        filterPlaceholder={'Filter sprint names...'}
      >
        <Actions />
      </DataTable>
    </div>
  )
}
