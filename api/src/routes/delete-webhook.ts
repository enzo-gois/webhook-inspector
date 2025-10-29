import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { webhooks } from '@/db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

export const deleteWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Delete a specific webhook by ID',
        tags: ['Webhooks'],
        querystring: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: z.void(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await db
        .select()
        .from(webhooks)
        .where(eq(webhooks.id, id))
        .limit(1)

      if (result.length === 0) {
        return reply.status(404).send({ message: 'Webhook not found' })
      }

      return reply.send(result[0])
    },
  )
}
