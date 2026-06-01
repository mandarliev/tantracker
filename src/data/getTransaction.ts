// src/data/getTransaction.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '#/db/index.ts'
import { transactionsTable } from '#/db/schema'
import { and, eq } from 'drizzle-orm'
import { auth } from '@clerk/tanstack-react-start/server'

const schema = z.object({
  transactionId: z.number(),
})

export const getTransaction = createServerFn({
  method: 'GET',
})
  .inputValidator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth()

      if (!userId) {
        throw new Error('Unauthorized')
      }

      const [transaction] = await db
        .select()
        .from(transactionsTable)
        .where(
          and(
            eq(transactionsTable.id, data.transactionId),
            eq(transactionsTable.userId, userId),
          ),
        )

      return transaction
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  })
