'use client'

import { FC } from 'react'
import { User } from '@/payload-types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { UserAvatar } from '../ui/avatar'

export const UserSelect: FC<{
  users: User[]
  currentUser?: User
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}> = ({ users, defaultValue, currentUser, value, onValueChange }) => {
  let selections = users
  if (currentUser != undefined && !users.some((x) => x.id == currentUser.id)) {
    selections = [currentUser, ...users]
  }
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange} name="user">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent>
        {selections.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            <UserAvatar user={user} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
