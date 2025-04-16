'use client'

import { FC } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export const RoleSelect: FC<{
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}> = ({ defaultValue = 'developer', value, onValueChange }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange} name="role">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Project" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="scrum_master">Scrum master</SelectItem>
        <SelectItem value="scrum_master_developer">Scrum master & Developer</SelectItem>
        <SelectItem value="product_owner">Product owner</SelectItem>
        <SelectItem value="product_owner_developer">Product owner & Developer</SelectItem>
        <SelectItem value="developer">Developer</SelectItem>
      </SelectContent>
    </Select>
  )
}
