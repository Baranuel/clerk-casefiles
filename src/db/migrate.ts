import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  const db = drizzle(pool)

  console.log('⏳ Running migrations...')
  
  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('✅ Migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed!', error)
    process.exit(1)
  }

  await pool.end()
  process.exit(0)
}

runMigrations().catch((err) => {
  console.error('❌ Migration script failed!', err)
  process.exit(1)
}) 