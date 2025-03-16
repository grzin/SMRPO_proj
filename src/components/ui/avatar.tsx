'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
import { useUser } from '@/contexts/user-context'

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
      <div className="bg-muted flex size-full items-center justify-center rounded-full">
        {firstLetter + '' + secondLetter}
      </div>
    </AvatarPrimitive.Root>
  )
}

export { Avatar }
