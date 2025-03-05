import type { Metadata } from 'next'
import localFont from 'next/font/local'
import React from 'react'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head></head>
      <body>{children}</body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'SMRPO 1 - SCRUM',
  description: 'SCRUM app',
}
