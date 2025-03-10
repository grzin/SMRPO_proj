'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/contexts/user-context'
import { updatePasswordAction, updateProfileAction } from '@/actions/user-actions'

export function ProfileSettings() {
  const { user } = useUser()
  const [error, setError] = useState<string | null>(null)
  const [settingsTriggered, setSettingsTriggered] = useState(false)
  const [passwordTriggered, setPasswordTriggered] = useState(false)

  if (!user) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, action: (formData: FormData) => Promise<any>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const response = await action(formData)
    if (response.error) {
      setError(response.error)
    } else {
      setError(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => {setSettingsTriggered(true); handleSubmit(event, updateProfileAction)}} className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="username">Name</Label>
              <Input
                id = "username"
                name="username" 
                defaultValue={user.username} 
                required 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input 
                name="email" 
                type="email" 
                defaultValue={user.email}
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
          {settingsTriggered && error && <div className="text-red-500">{error}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => {setPasswordTriggered(true); handleSubmit(event, updatePasswordAction)}} className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                name="currentPassword"
                type="text"
                required 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                name="newPassword"
                type="password" 
                required 
              />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
          {passwordTriggered && error && <div className="text-red-500">{error}</div>}
        </CardContent>
      </Card>
    </div>
  )
}