import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema.ts'

// biome-ignore lint/style/noNonNullAssertion: Database URL is verified by environment configs
export const db = drizzle(process.env.DATABASE_URL!, { schema })
