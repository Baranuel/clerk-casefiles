import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull().default(''),
  imageUrl: text('imageUrl').notNull().default(''),
  tier: varchar('tier', { length: 255 }).notNull().default('free'),
  maxBoards: integer('maxBoards').notNull().default(2),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

