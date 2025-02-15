import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = new Hono()

app.get('/', async (c) => {
  const data = await prisma.requestLog.findMany({
    orderBy: {
      id: 'desc'
    }
  })

  return c.json(data)
})

app.post('/', async (c) => {
  const body = await c.req.json()

  await prisma.requestLog.create({
    data: {
      'payload': body
    }
  })

  return c.text('Done!')
})

app.post('/iclock/cdata', async (c) => {
  const body = await c.req.json()

  await prisma.requestLog.create({
    data: {
      'payload': body
    }
  })

  return c.text('Done!')
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
