import { createClerkClient } from '@clerk/backend'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
import db  from './db/index.js'
import { user } from './db/schema.js'
import { eq } from 'drizzle-orm'
import { highlightMiddleware } from '@highlight-run/hono'

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

// Initialize the Highlight middleware
app.use(highlightMiddleware({
  projectID: 'jgo9j4yg'
}))

   

// Example route to get and create user
app.get('/api/:userId', async (c) => {
  throw new Error('Failed Call');
})

app.post('/api/webhook', async (c) => {
  try {
    const { data, type } = await c.req.json<{
      data: {
        id: string;
        first_name: string;
        last_name: string;
        image_url: string;  
      };
      type: 'user.created' | 'user.deleted';
    }>();

    console.log('Webhook received:', type, data);

    if (type === 'user.created') {
      const createdUser = await db.insert(user).values({
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
        tier: 'free',
        maxBoards: 2,
      }).returning();

      if(!createdUser) {
        throw new Error('Failed to create user');
      }

      console.log('User created:', createdUser);
      return c.json({ success: true, user: createdUser[0] });
    }

    if (type === 'user.deleted') {
      const deletedUser = await db
        .delete(user)
        .where(eq(user.id, data.id))
        .returning();

      if(!deletedUser) {
        throw new Error('Failed to delete user');
      }

      console.log('User deleted:', deletedUser);
      return c.json({ success: true, user: deletedUser[0] });
    }

    throw new Error('Unsupported webhook type');
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
})

// Example route to get all users
app.get('/api/users/all', async (c) => {
  try {
    const allUsers = await db.select().from(user).execute()
    return c.json(allUsers)
  } catch (error) {
    throw error;
  }
})

const port = 1111
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
