'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useActionState } from 'react'
import {
  createUserAction,
  editUserAction,
  changePasswordAction,
  deleteUserAction,
} from '@/actions/user-management-actions'
import { FormError } from '../ui/form'
import PasswordInput from '../ui/password'
import { User } from '@/payload-types'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../ui/select'

export default function UserEdit({
  editUser,
  ...props
}: React.ComponentProps<'div'> & { editUser: User | null }) {
  if (editUser == null) {
    return <CreateUser {...props}></CreateUser>
  } else {
    return (
      <>
        <EditUser editUser={editUser} {...props}></EditUser>
        <ChangePassword editUser={editUser} {...props}></ChangePassword>
      </>
    )
  }
}

function CreateUser({ className, ...props }: React.ComponentProps<'div'>) {
  const initialState = {
    id: -1,
    username: '',
    password: '',
    passwordRepeat: '',
    name: '',
    surname: '',
    email: '',
    role: 'user',
    message: '',
    error: {
      username: '',
      password: '',
      passwordRepeat: '',
      name: '',
      surname: '',
      email: '',
      role: '',
    },
  }

  const [state, formAction, pending] = useActionState(createUserAction, initialState)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create new user</CardTitle>
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
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={state.role} name="role">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {state.error.role && <FormError>{state.error.role}</FormError>}
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
                  Create
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

function EditUser({
  className,
  editUser,
  ...props
}: React.ComponentProps<'div'> & { editUser: User }) {
  const initialState = {
    username: editUser.username,
    password: '',
    passwordRepeat: '',
    name: editUser.name,
    surname: editUser.surname,
    email: editUser.email ?? '',
    role: editUser.role ?? 'user',
    message: '',
    error: {
      username: '',
      password: '',
      passwordRepeat: '',
      name: '',
      surname: '',
      email: '',
      role: '',
    },
  }

  const initialDeleteState = {
    message: '',
  }

  const [state, formAction, pending] = useActionState(editUserAction, initialState)
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteUserAction,
    initialDeleteState,
  )

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Edit user</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <input type="hidden" name="id" value={editUser.id} />
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
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={state.role} name="role">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {state.error.role && <FormError>{state.error.role}</FormError>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={pending}>
                  Save
                </Button>
                {state.message && <FormError>{state.message}</FormError>}
              </div>
            </div>
          </form>
          <form action={deleteFormAction}>
            <div className="flex flex-col gap-6 mt-8">
              <input type="hidden" name="id" value={editUser.id} />
              <Button variant={'destructive'} disabled={deletePending}>
                Delete user
              </Button>
              {deleteState.message && <FormError>{deleteState.message}</FormError>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function ChangePassword({
  className,
  editUser,
  ...props
}: React.ComponentProps<'div'> & { editUser: User }) {
  const initialState = {
    password: '',
    message: '',
    error: {
      id: '',
      password: '',
    },
  }

  const [state, formAction, pending] = useActionState(changePasswordAction, initialState)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <input type="hidden" name="id" value={editUser.id} />
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">New password</Label>
                </div>
                <PasswordInput name="password" defaultValue={state.password} />
                {state.error.password && <FormError>{state.error.password}</FormError>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={pending}>
                  Change password
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
