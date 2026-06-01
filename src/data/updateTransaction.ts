import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '#/db/index.ts'
import { transactionsTable } from '#/db/schema'
import { and, eq } from 'drizzle-orm'
import { auth } from '@clerk/tanstack-react-start/server'

const schema = z.object({
  id: z.number(),
  categoryId: z.number().positive(),
  transactionDate: z.string(),
  amount: z.number().positive(),
  description: z.string().min(3).max(300).optional(),
})

export const updateTransaction = createServerFn({
  method: 'POST',
})
  .inputValidator(schema)
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth()
      if (!userId) throw new Error('Unauthorized')

      const result = await db
        .update(transactionsTable)
        .set({
          amount: data.amount.toString(), // Keep as number (don't convert to string)
          categoryId: data.categoryId,
          transactionDate: data.transactionDate,
          description: data.description,
          // updatedAt: new Date(),      // Add this if you have the column
        })
        .where(
          and(
            eq(transactionsTable.id, data.id),
            eq(transactionsTable.userId, userId),
          ),
        )
        .returning()

      if (result.length === 0) {
        throw new Error('Transaction not found or you are not authorized')
      }

      return result[0]
    } catch (error) {
      console.error('Update transaction failed:', error)
      throw error
    }
  })
