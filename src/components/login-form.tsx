'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { loginAction } from '@/actions/login-action'
import { FormMessage } from './ui/form'

import { redirect } from 'next/navigation'

const initialState = {
  message: '',
  username: '',
  password: '',
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction] = useActionState(loginAction, initialState)

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
                <Input name="username" id="username" type="text" placeholder="" required />
                {state.username && <FormMessage>{state.username}</FormMessage>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input name="password" id="password" type="password" required />
                {state.password && <FormMessage>{state.password}</FormMessage>}
              </div>
              <div className="flex flex-col gap-3">
                <SubmitButton></SubmitButton>
                {state.message && <FormMessage>{state.message}</FormMessage>}
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

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      Login
    </Button>
  )
}
