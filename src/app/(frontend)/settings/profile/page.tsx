import { getUser } from '@/actions/login-action'
import { ProfileSettings } from '@/components/profile-settings'
import { UserProvider } from '@/contexts/user-context'

export default async function ProfilePage() {
  const user = await getUser()

  return (
    <UserProvider user={user}>
        <ProfileSettings />
    </UserProvider>
  )
}