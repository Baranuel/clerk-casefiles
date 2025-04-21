
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
import db from './db/index.js'
import { user } from './db/schema.js'
import { eq } from 'drizzle-orm'
import { highlightMiddleware } from '@highlight-run/hono'
import { createClerkClient } from '@clerk/backend'


type EventType = 'user.created' | 'user.deleted' | 'session.created'

type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
}

type SessionData = {
  id: string;
  user_id: string;
  expires_at: string;
}





type ClerkWebhookData = { data: unknown, type: EventType }




dotenv.config()

const app = new Hono()
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

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

    const { data, type } = await c.req.json<ClerkWebhookData>();
    console.log('Webhook received:', type, data);

    if (type === 'session.created') {
      const userData = data as SessionData
      const user_id = userData.user_id

      const dbUser = await db.select().from(user).where(eq(user.id, user_id)).execute()
      if (!dbUser) {
        const response = await clerkClient.users.getUser(user_id)
        console.log('User not found in DB, creating user:', response)
        
        const createdUser = await db.insert(user).values({
          id: user_id,
          name: `${response.firstName} ${response.lastName}`,
          imageUrl: response.imageUrl,
          tier: 'free',
          maxBoards: 2,
        }).returning();
        console.log('User created:', createdUser);
      }

      console.log('User found:', dbUser);
      return c.json({ success: true, user: dbUser[0] });
    }


    if (type === 'user.created') {
      const userData = data as UserData

      const createdUser = await db.insert(user).values({
        id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        imageUrl: userData.image_url,
        tier: 'free',
        maxBoards: 2,
      }).returning();

      if (!createdUser) {
        throw new Error('Failed to create user');
      }

      console.log('User created:', createdUser);
      return c.json({ success: true, user: createdUser[0] });
    }

    if (type === 'user.deleted') {
      const userData = data as UserData
      const deletedUser = await db
        .delete(user)
        .where(eq(user.id, userData.id))
        .returning();

      if (!deletedUser) {
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
