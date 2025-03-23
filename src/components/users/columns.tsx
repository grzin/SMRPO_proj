'use client'

import { ColumnDef } from '@tanstack/react-table'

import { User } from '@/payload-types'
import { Button } from '../ui/button'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '../ui/avatar'

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: () => <></>,
    cell: () => <></>,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Username
          <ArrowUpDown />
        </Button>
      )
    },
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex flex-row gap-2 items-center">
        <Avatar name={row.getValue('name')} surname={row.getValue('surname')} />
        <Link href={`/users/${row.getValue('id')}`}>{row.getValue('username')}</Link>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {' '}
        <Link href={`/users/${row.getValue('id')}`}>{row.getValue('email')}</Link>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: () => <div>Name</div>,
    cell: ({ row }) => (
      <div className="lowercase">
        {' '}
        <Link href={`/users/${row.getValue('id')}`}>{row.getValue('name')}</Link>
      </div>
    ),
  },
  {
    accessorKey: 'surname',
    header: () => <div>Surname</div>,
    cell: ({ row }) => (
      <div className="lowercase">
        <Link href={`/users/${row.getValue('id')}`}>{row.getValue('surname')}</Link>
      </div>
    ),
  },
]
