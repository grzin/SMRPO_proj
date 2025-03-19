// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Projects } from './collections/Projects'
import { Sprints } from './collections/Sprints'
import { Stories } from './collections/Stories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Projects, Sprints, Stories],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI_LOCAL || '',
    },
  }),
  /*
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI_POSTGRES || '',
    },
  }),
  */
  sharp,
  plugins: [],
})
