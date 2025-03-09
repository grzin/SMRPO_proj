'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="form-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="form-message"
      className={cn('text-secondary-foreground text-sm', className)}
      {...props}
    >
      {props.children}
    </p>
  )
}

function FormError({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p data-slot="form-message" className={cn('text-destructive text-sm', className)} {...props}>
      {props.children}
    </p>
  )
}

export { FormDescription, FormMessage, FormError }
