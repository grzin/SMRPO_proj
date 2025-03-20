'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Project, User } from '@/payload-types'
import { Button } from '../ui/button'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { Avatar, UserAvatar } from '../ui/avatar'

export const projectColumns: ColumnDef<User>[] = [
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
          Project name
          <ArrowUpDown />
        </Button>
      )
    },
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize flex flex-row gap-2 items-center">
        <Link href={`/projects/${row.getValue('id')}`}>{row.getValue('name')}</Link>
      </div>
    ),
  },
  {
    accessorKey: 'members',
    header: ({ column }) => {
      return <div>Members</div>
    },
    cell: ({ row }) => {
      const members = row.getValue('members') as
        | {
            user: User
            role: 'methodology_manager' | 'product_manager' | 'developer'
            id?: string | null
          }[]
        | null
      return (
        <div className="lowercase flex flex-row flex-wrap gap-6">
          {members?.map((member) => <UserAvatar key={member.id} user={member.user} />)}
        </div>
      )
    },
  },
]
