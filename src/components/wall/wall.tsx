'use client'

import { FC, useState, useRef, useEffect } from 'react'
import { Project, WallMessage } from '@/payload-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useUser } from '@/contexts/user-context'
import { postWallMessageAction } from '@/actions/project-action'

export const Wall: FC<{ 
    wallMessages: WallMessage[] | null
    projectId: number
 }> = ({ wallMessages, projectId }) => {
  const { user } = useUser()
  const [newMessage, setNewMessage] = useState('')
  const scrollableRef = useRef<HTMLDivElement>(null) // Ref for the scrollable container

  const handlePostMessage = () => {
    if (!newMessage.trim()) return

    const newId = wallMessages && wallMessages.length > 0
    ? Math.max(...wallMessages.map((msg) => msg.id)) + 1
    : 0

    const message: WallMessage = {
      id: newId,
      username: user?.name || 'Anonymous',
      message: newMessage,
      createdAt: new Date().toLocaleString(),
      project: projectId,
      updatedAt: new Date().toLocaleString(),
    }

    postWallMessageAction(projectId, newMessage, user?.name || '').then((response) => {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({
          top: scrollableRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    });
    if(!wallMessages) {
      wallMessages = []
    }
    wallMessages.push(message)
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
          {wallMessages && wallMessages.length > 0 && (
          <div
            ref={scrollableRef}
            className="flex flex-col gap-4 p-4 border rounded-lg max-h-[400px] overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {wallMessages?.map((message) => (
                <div key={message.id} className="p-2 border-b">
                  <p className="text-sm font-semibold">{message.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
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