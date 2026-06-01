import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '#/db/index.ts'
import { transactionsTable } from '#/db/schema'
import { and, eq } from 'drizzle-orm'

const schema = z.object({
  transactionId: z.number(),
})

export const deleteTransaction = createServerFn({
  method: 'POST',
})
  .inputValidator(schema)
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth()
      if (!userId) throw new Error('Unauthorized')

      await db
        .delete(transactionsTable)
        .where(
          and(
            eq(transactionsTable.id, data.transactionId),
            eq(transactionsTable.userId, userId),
          ),
        )
    } catch (error) {
      console.error('Delete transaction failed:', error)
      throw error
    }
  })
