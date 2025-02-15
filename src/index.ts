import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = new Hono()

app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`)
  console.log(`Headers:`, c.req.header())

  // Try to log request body if possible
  if (c.req.method !== 'GET') {
    try {
      const rawBody = await c.req.text()
      console.log(`Body:`, rawBody)

      const url = c.req.url
      const query = c.req.query()
      const contentType = c.req.header('content-type') || 'unknown'

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
    } catch (error) {
      console.log(`Body: (could not read)`)
    }
  }

  await next()
})

app.get('/', async (c) => {
  const data = await prisma.requestLog.findMany({
    orderBy: {
      id: 'desc'
    }
  })

  return c.json(data)
})

app.post('/', async (c) => {
  return c.text('Done!')
})

// Handle GET requests to /iclock/cdata
app.get('/iclock/cdata', async (c) => {
  console.log('Received GET request to /iclock/cdata')
  return c.text('OK')
})

// Handle POST requests to /iclock/cdata
app.post('/iclock/cdata', async (c) => {
  console.log('Received POST request to /iclock/cdata')
  return c.text('OK')
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
