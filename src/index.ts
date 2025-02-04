import { createClerkClient } from '@clerk/backend'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'

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

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

app.get('/api/:userId', async (c) => {
  const userId = c.req.param('userId')
  console.log(userId)
  const user = await clerk.users.getUser(userId)
  return c.json(user)
})
const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
