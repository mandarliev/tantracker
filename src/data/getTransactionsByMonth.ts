import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '#/db/index.ts'
import { transactionsTable } from '#/db/schema'
import { and, eq, gte, lte } from 'drizzle-orm'
import { auth } from '@clerk/tanstack-react-start/server'
import { format } from 'date-fns'

const schema = z.object({
  month: z.number().min(1).max(12),
  year: z
    .number()
    .min(2020)
    .max(new Date().getFullYear() + 1),
})

export const getTransactionsByMonth = createServerFn({
  method: 'GET',
})
  .inputValidator(schema)
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth()
      if (!userId) throw new Error('Unauthorized')

      const earliestDate = format(
        new Date(data.year, data.month - 1, 1),
        'yyyy-MM-dd',
      )

      const latestDate = format(
        new Date(data.year, data.month, 0, 23, 59, 59),
        'yyyy-MM-dd',
      )

      const result = await db
        .select()
        .from(transactionsTable)
        .where(
          and(
            eq(transactionsTable.userId, userId),
            gte(transactionsTable.transactionDate, earliestDate),
            lte(transactionsTable.transactionDate, latestDate),
          ),
        )
        .orderBy(transactionsTable.transactionDate)

      return result
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  })
