import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { db } from '#/db/index.ts'
import { categoriesTable, transactionsTable } from '#/db/schema'
import { desc, eq } from 'drizzle-orm'

export const getRecentTransactions = createServerFn({
  method: 'GET',
}).handler(async () => {
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
      })
      .from(transactionsTable)
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id),
      )
      .where(eq(transactionsTable.userId, userId))
      .orderBy(desc(transactionsTable.transactionDate))
      .limit(5) // Increased to 5 for better UX
      .execute()

    return transactions
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error)
    throw error
  }
})
