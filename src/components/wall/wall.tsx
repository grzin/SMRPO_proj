'use client'

import { FC, useState, useRef, useEffect } from 'react'
import { Project, WallMessage, User } from '@/payload-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useUser } from '@/contexts/user-context'
import { postWallMessageAction } from '@/actions/project-action'

export const Wall: FC<{
  wallMessages: WallMessage[] | null
  project: Project
}> = ({ wallMessages, project }) => {
  const { user } = useUser()
  const [newMessage, setNewMessage] = useState('')
  const scrollableRef = useRef<HTMLDivElement>(null)

  const [wall, setWall] = useState<WallMessage[]>(wallMessages ?? [])

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [wall])

  const handlePostMessage = () => {
    if (!newMessage.trim()) return

    const userRoleOnProject = project?.members
      ?.find((member) => (member.user as User).id === user?.id)
      ?.role?.replace(/_/g, ' ')

    const messageName = `${user?.name || 'Anonymous'} (${user?.role == 'admin' ? 'Admin' : userRoleOnProject})`

    const newId = wall && wall.length > 0 ? Math.max(...wall.map((msg) => msg.id)) + 1 : 0

    const message: WallMessage = {
      id: newId,
      username: messageName,
      message: newMessage,
      createdAt: new Date().toDateString(),
      project: project.id,
      updatedAt: new Date().toDateString(),
    }

    postWallMessageAction(project.id, newMessage, messageName).then((response) => {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({
          top: scrollableRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
    setWall((prevWall) => [...prevWall, message])
    setNewMessage('')
  }

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <Card>
        <CardHeader>
          <CardTitle>Project Wall</CardTitle>
          <CardDescription>Wall where users can post comments</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {wall && wall.length > 0 && (
            <div
              ref={scrollableRef}
              className="flex flex-col gap-4 p-4 border rounded-lg max-h-[400px] overflow-y-auto"
            >
              <div className="flex flex-col gap-2">
                {wall?.map((message) => (
                  <div key={message.id} className="p-2 border-b">
                    <p className="text-sm font-semibold">{message.username}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString('sl-SI')}
                    </p>
                    <p>{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handlePostMessage()
                }
              }}
              placeholder="Write a message..."
              className="flex-1"
            />
            <Button onClick={handlePostMessage}>Post</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
