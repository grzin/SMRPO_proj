'use client'

import * as React from 'react'
import { Settings2, SquareKanban } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useUser } from '@/contexts/user-context'

const data = {
  navMain: [
    {
      title: 'Scrum',
      url: '/projects',
      icon: SquareKanban,
      isActive: true,
      items: [
        {
          title: 'My projects',
          url: '/projects',
          isActive: true,
        },
        {
          title: 'My sprints',
          url: '/sprints',
          isActive: true,
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      isActive: true,
      isAdmin: true,
      items: [
        {
          title: 'Users',
          url: '/users',
          isActive: true,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
        {state === 'expanded' && (
          <span className="truncate text-xs">
            Last login: {user?.lastLoginDate ?? user?.loginDate}
          </span>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
