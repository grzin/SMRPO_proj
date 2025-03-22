'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Sprint } from '@/payload-types'
import { Button } from '../ui/button'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'

export const sprintColumns: ColumnDef<Sprint>[] = [
  {
    accessorKey: 'id',
    header: () => <></>,
    cell: () => <></>,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        {' '}
        <Link href={`/sprints/${row.getValue('id')}`}>{row.getValue('name')}</Link>
      </div>
    ),
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start date
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        {' '}
        <Link href={`/sprints/${row.getValue('id')}`}>{new Date(row.getValue('startDate')).toLocaleString()}</Link>
      </div>
    ),
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End date
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        {' '}
        <Link href={`/sprints/${row.getValue('id')}`}>{new Date(row.getValue('endDate')).toLocaleString()}</Link>
      </div>
    ),
  },
  {
    accessorKey: 'velocity',
    header: () => <div>Velocity</div>,
    cell: ({ row }) => (
      <div>
        <Link href={`/sprints/${row.getValue('id')}`}>{row.getValue('velocity')}</Link>
      </div>
    ),
  },
]
