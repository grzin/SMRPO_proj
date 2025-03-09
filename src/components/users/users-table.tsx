'use client'

import React from 'react'

import { userColumns } from './columns'
import { DataTable } from '../data-table'
import { User } from '@/payload-types'

export default function Users({ users }: { users: User[] }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DataTable columns={userColumns} data={users} />
    </div>
  )
}
