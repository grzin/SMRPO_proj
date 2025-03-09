'use client'

import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { UserProvider } from '@/contexts/user-context'
import { User } from '@/payload-types'

export default function Base({ children, user }: { children: React.ReactNode; user: User }) {
  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </UserProvider>
  )
}
