import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '#/db/index.ts'
import { categoriesTable, transactionsTable } from '#/db/schema'
import { and, eq, desc, sql } from 'drizzle-orm'

const schema = z.object({
  year: z
    .number()
    .min(2020)
    .max(new Date().getFullYear() + 1),
})

export const getAnnualCashflow = createServerFn({
  method: 'GET',
})
  .inputValidator(schema)
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth()
      if (!userId) throw new Error('Unauthorized')

      const transactions = await db
        .select({
          id: transactionsTable.id,
          description: transactionsTable.description,
          amount: transactionsTable.amount,
          transactionDate: transactionsTable.transactionDate,
          category: categoriesTable.name,
          transactionType: categoriesTable.type,
          month: sql<number>`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`,
        })
        .from(transactionsTable)
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id),
        )
        .where(
          and(
            eq(transactionsTable.userId, userId),
            sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${data.year}`,
          ),
        )
        .orderBy(desc(transactionsTable.transactionDate))

      return transactions
    } catch (error) {
      console.error('Failed to fetch annual transactions:', error)
      throw error
    }
  })
