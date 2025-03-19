'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter, redirect } from 'next/navigation'
import { FC } from 'react'

export const Stories: FC<{ project: Project; canAddStory: boolean }> = ({ project, canAddStory }) => {
  const router = useRouter()

  const handleGoToAdd = () => {
    router.push(`/stories/add?projectId=${project.id}`)
  }

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>User Stories</CardTitle>
          <CardDescription>Define and assign user stories of this project</CardDescription>
          <div className="flex">
            {canAddStory && <Button onClick={handleGoToAdd}>Add User Story</Button>}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p>-- Story here --</p>
        </CardContent>
      </Card>
    </div>
  )
}
