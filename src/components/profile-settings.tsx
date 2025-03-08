'use client'

import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormMessage } from '@/components/ui/form'
import { useUser } from '@/contexts/user-context'
import { updatePasswordAction, updateProfileAction } from '@/actions/user-actions'

export function ProfileSettings() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updatePasswordAction} className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  )
}