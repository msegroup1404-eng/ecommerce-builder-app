import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { plugins } from './plugins'
import { Tenants } from './collections/tenants'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages/Pages'
import { Templates } from './collections/templates'
import { Products } from './collections/Products/Products'
import { Collections } from './collections/Collections'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Tenants,
    // Orders,
    Collections,
    Categories,
    Products,
    Users,
    Media,
    Templates,
    // Policies,
    // GiftCards,
    Pages,
    // Payments,
    // Locations,
    // Shipping,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  // onInit: async (args) => {
  //   if (process.env.SEED_DB) {
  //     await seed(args)
  //   }
  // },
  sharp,
  plugins: [
    ...plugins
  ],
})
