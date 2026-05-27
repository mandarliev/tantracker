// src/data/getTransactionYearsRange.ts
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { db } from '#/db/index.ts'
import { transactions } from '#/db/schema'
import { desc, eq } from 'drizzle-orm'

export const getTransactionYearsRange = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const result = await db
      .selectDistinct({ year: transactions.transactionDate }) // or use sql`EXTRACT(YEAR FROM transactionDate)`
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.transactionDate))

    const years = [
      ...new Set(result.map((row) => new Date(row.year).getFullYear())),
    ]

    return years
  } catch (error) {
    console.error('Failed to fetch years:', error)
    return []
  }
})
