import type { Metadata } from 'next'
import { getUser } from '@/actions/login-action'
import React from 'react'
import Base from '@/components/base'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  return <Base user={user}>{children}</Base>
}

export const metadata: Metadata = {
  title: 'SMRPO 1 - SCRUM',
  description: 'SCRUM app',
}
