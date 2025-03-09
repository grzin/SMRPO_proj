'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useActionState } from 'react'
import { loginAction } from '@/actions/login-action'
import { FormError } from './ui/form'

import { redirect } from 'next/navigation'
import PasswordInput from './ui/password'

const initialState = {
  username: '',
  password: '',
  message: '',
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  name="username"
                  id="username"
                  type="text"
                  placeholder=""
                  required
                  defaultValue={state.username}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <PasswordInput name="password" />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={pending}>
                  Login
                </Button>
                {state.message && <FormError>{state.message}</FormError>}
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault()
                    redirect('/register')
                  }}
                  className="w-full"
                >
                  Register
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
