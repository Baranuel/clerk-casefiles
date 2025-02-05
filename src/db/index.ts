import { drizzle } from 'drizzle-orm/node-postgres'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const db = drizzle(process.env.DATABASE_URL);

export default db;