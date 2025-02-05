import { createClerkClient } from '@clerk/backend'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
import db  from './db/index.js'
import { user } from './db/schema.js'
import { eq } from 'drizzle-orm'

dotenv.config()

const app = new Hono()

app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))


const clerkSecretKey = process.env.NODE_ENV === 'production' ? process.env.CLERK_SECRET_KEY_PROD : process.env.CLERK_SECRET_KEY

const clerk = createClerkClient({
  secretKey: clerkSecretKey,
})

// Example route to get and create user
app.get('/api/:userId', async (c) => {
  const userId = c.req.param('userId')
  const user = await clerk.users.getUser(userId)
  return c.json(user)
})

app.post('/api/webhook', async (c) => {
  const { data, type } = await c.req.json<{
    data: {
      id: string;
      first_name: string;
      last_name: string;
      image_url: string;  
    };
    type: 'user.created' | 'user.deleted';
  }>();


  if (type === 'user.created') {
    const createdUser = await db.insert(user).values({
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      imageUrl: data.image_url,
      tier: 'free',
      maxBoards: 2,
    }).returning();

    console.log('User created:', createdUser);
    return c.json({ success: true, user: createdUser[0] });
  }

  if (type === 'user.deleted') {
    const deletedUser = await db
      .delete(user)
      .where(eq(user.id, data.id))
      .returning();

    console.log('User deleted:', deletedUser);
    return c.json({ success: true, user: deletedUser[0] });
  }

  return c.json({ success: false, error: 'Unsupported webhook type' }, 400);
})

// Example route to get all users
app.get('/api/users/all', async (c) => {
  const allUsers = await db.select().from(user).execute()
  return c.json(allUsers)
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
