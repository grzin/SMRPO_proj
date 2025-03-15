'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useActionState } from 'react'
import { registerAction } from '@/actions/login-action'
import { FormError } from '../ui/form'
import PasswordInput from '../ui/password'
import { User } from '@/payload-types'

export default function UserEdit({
  className,
  user,
  ...props
}: React.ComponentProps<'div'> & { user: User | null }) {
  let initialState = {
    id: -1,
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
  if (user !== null) {
    initialState = {
      id: user.id,
      username: user.username,
      password: '',
      passwordRepeat: '',
      name: user.name,
      surname: user.surname,
      email: user.email ?? '',
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
  }

  const [state, formAction, pending] = useActionState(registerAction, initialState)

  const title = user == null ? 'Create new account' : 'Edit account'
  const action = user == null ? 'Create' : 'Edit'

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
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
                  {action}
                </Button>
                {state.message && <FormError>{state.message}</FormError>}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
