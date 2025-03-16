'use client'

import * as React from 'react'
import { BookOpen, Settings2, SquareKanban } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
