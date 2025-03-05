import { getUser } from '@/actions/login-action'
import Dashboard from './dashboard'

export default async function Page() {
  const user = await getUser()

  return <Dashboard user={user} />
}
