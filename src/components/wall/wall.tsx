'use client'

import { FC, useState } from 'react'
import { Project, WallMessage } from '@/payload-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useUser } from '@/contexts/user-context'
import { postWallMessageAction } from '@/actions/project-action'

interface Message {
  id: number
  username: string
  text: string
  timestamp: string
}

export const Wall: FC<{ 
    wallMessages: WallMessage[] | null
    projectId: number
 }> = ({ wallMessages, projectId }) => {
  const { user } = useUser()
  const [messages, setMessages] = useState<WallMessage[]>(wallMessages || [])
  const [newMessage, setNewMessage] = useState('')

  const handlePostMessage = () => {
    console.log('Posting message:', newMessage)
    if (!newMessage.trim()) return

    const message: WallMessage = {
      id: wallMessages ? wallMessages.length : 0,
      username: user?.name || 'Anonymous',
      message: newMessage,
      createdAt: new Date().toLocaleString(),
      project: projectId,
      updatedAt: new Date().toLocaleString(),
    }

    postWallMessageAction(projectId, newMessage, user?.name || '')
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
          <div className="flex flex-col gap-4 p-4 border rounded-lg max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {wallMessages?.map((message) => (
                <div key={message.id} className="p-2 border-b">
                  <p className="font-semibold">{message.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                  <p className="text-lg">{message.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1"
              />
              <Button onClick={handlePostMessage}>Post</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}