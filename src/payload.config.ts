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
import { TaskTimes } from './collections/TaskTimes'
import { WallMessages } from './collections/WallMessages'
import { PostgresAdapter } from '@payloadcms/db-postgres/types'
import { SQLiteAdapter } from '@payloadcms/db-sqlite/types'
import { DatabaseAdapterResult } from 'node_modules/payload/dist/database/types'
import { TimeTracking } from './collections/TimeTracking'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let db: DatabaseAdapterResult<PostgresAdapter> | DatabaseAdapterResult<SQLiteAdapter> =
  sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI_LOCAL || '',
    },
  })

if (process.env.DATABASE === 'postgres') {
  db = postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI_POSTGRES || '',
    },
  })
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Projects, Sprints, Stories, TaskTimes, TimeTracking, WallMessages],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: db,
  sharp,
  plugins: [],
})
