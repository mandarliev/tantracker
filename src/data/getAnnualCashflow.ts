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

      // 1. Fetch individual transaction details matching the user and selected year
      const transactions = await db
        .select({
          id: transactionsTable.id,
          description: transactionsTable.description,
          amount: transactionsTable.amount,
          transactionDate: transactionsTable.transactionDate,
          category: categoriesTable.name,
          transactionType: categoriesTable.type,
          // Extract month as an integer via native PostgreSQL functions
          month: sql<number>`CAST(EXTRACT(MONTH FROM ${transactionsTable.transactionDate}) AS INTEGER)`,
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

      const annualCashflow: {
        month: number
        income: number
        expenses: number
      }[] = []

      // 2. Loop through every calendar month (1 to 12)
      for (let i = 1; i <= 12; i++) {
        // Gather rows that match the target month index
        const monthlyRows = transactions.filter((cf) => Number(cf.month) === i)

        let incomeTotal = 0
        let expensesTotal = 0

        // Accumulate runtime values matching our criteria
        for (const row of monthlyRows) {
          const numericalAmount = Number(row.amount || 0)

          if (row.transactionType === 'income') {
            incomeTotal += numericalAmount
          } else if (row.transactionType === 'expense') {
            expensesTotal += numericalAmount
          }
        }

        annualCashflow.push({
          month: i,
          income: incomeTotal,
          expenses: expensesTotal,
        })
      }

      // 3. Return the calculated map instead of individual rows
      return annualCashflow
    } catch (error) {
      console.error('Failed to fetch annual transactions:', error)
      throw error
    }
  })
