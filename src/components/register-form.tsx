'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useActionState } from 'react'
import { registerAction } from '@/actions/login-action'
import { FormError } from './ui/form'
import { redirect } from 'next/navigation'
import PasswordInput from './ui/password'

const initialState = {
  username: '',
  password: '',
  passwordRepeat: '',
  name: '',
  surname: '',
  email: '',
  message: '',
  error: {
    username: '',
    password: '',
    passwordRepeat: '',
    name: '',
    surname: '',
    email: '',
  },
}

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, pending] = useActionState(registerAction, initialState)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register new account</CardTitle>
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
                {state.error.username && <FormError>{state.error.username}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder=""
                  required
                  defaultValue={state.name}
                />
                {state.error.name && <FormError>{state.error.name}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="surname">Surname</Label>
                <Input
                  name="surname"
                  id="surname"
                  type="text"
                  placeholder=""
                  required
                  defaultValue={state.surname}
                />
                {state.error.surname && <FormError>{state.error.surname}</FormError>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  name="email"
                  id="email"
                  type="text"
                  placeholder=""
                  required
                  defaultValue={state.email}
                />
                {state.error.email && <FormError>{state.error.email}</FormError>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <PasswordInput name="password" defaultValue={state.password} />
                {state.error.password && <FormError>{state.error.password}</FormError>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Re-enter password</Label>
                </div>
                <PasswordInput name="password-repeat" defaultValue={state.passwordRepeat} />
                {state.error.passwordRepeat && <FormError>{state.error.passwordRepeat}</FormError>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={pending}>
                  Register
                </Button>
                {state.message && <FormError>{state.message}</FormError>}
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault()
                    redirect('/login')
                  }}
                  className="w-full"
                >
                  Back to login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
