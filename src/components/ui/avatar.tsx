'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
import { useUser } from '@/contexts/user-context'

function stringToHslColor(str: string, s: number, l: number) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = hash % 360
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)'
}

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  const user = useUser().user
  const firstLetter = user?.name[0].toUpperCase() || ''
  const secondLetter = user?.surname[0].toUpperCase() || ''

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      <div
        style={{
          backgroundColor: stringToHslColor(user?.name ?? '' + user?.surname ?? '', 50, 80),
        }}
        className="flex size-full items-center justify-center rounded-full font-bold"
      >
        {firstLetter + '' + secondLetter}
      </div>
    </AvatarPrimitive.Root>
  )
}

export { Avatar }
