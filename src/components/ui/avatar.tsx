'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
import { useUser } from '@/contexts/user-context'
import { User } from '@/payload-types'

function stringToHslColor(str: string, s: number, l: number) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = hash % 360
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)'
}

function UserAvatar({ user, ...props }: { user: User }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Avatar name={user.name} surname={user.surname} {...props} />
      {user.username}
    </div>
  )
}

function Avatar({
  className,
  name = '',
  surname = '',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { name?: string; surname?: string }) {
  const user = useUser().user
  if (!name && !surname) {
    name = user?.name ?? ''
    surname = user?.surname ?? ''
  }
  const firstLetter = name[0].toUpperCase() || ''
  const secondLetter = surname[0].toUpperCase() || ''

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      <div
        style={{
          backgroundColor: stringToHslColor(name + surname, 50, 80),
        }}
        className="flex size-full items-center justify-center rounded-full font-bold"
      >
        {firstLetter + '' + secondLetter}
      </div>
    </AvatarPrimitive.Root>
  )
}

export { Avatar, UserAvatar }
