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
  const url = c.req.url
  const query = c.req.query()
  const contentType = c.req.header('content-type') || 'unknown'
  const rawBody = await c.req.text()

  console.log(`Received request: URL=${url}, Query=${JSON.stringify(query)}, Content-Type=${contentType}`)
  console.log('Raw Body:', rawBody)

  await prisma.requestLog.create({
    data: {
      'payload': {
        'queryParams': query,
        'headers': { contentType },
        'payload': rawBody
      }
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
