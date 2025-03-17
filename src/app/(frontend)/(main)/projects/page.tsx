import { Payload, getPayload } from 'payload'
import { Project } from '@/payload-types'
import config from '@/payload.config'
import Projects from './projects'
import { getUser } from '@/actions/login-action'

export default async function Page() {
  const payload: Payload = await getPayload({ config })
  const user = await getUser()
  const projects = await payload.find({
    collection: 'projects',
    limit: 10000,
    overrideAccess: false,
    user: user,
  })

  return <Projects projects={projects.docs} />
}
