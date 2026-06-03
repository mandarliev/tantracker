import { createFileRoute } from '@tanstack/react-router'
import { getRecentTransactions } from '#/data/getRecentTransactions'
import { getAnnualCashflow } from '#/data/getAnnualCashflow'
import { lazy } from 'react'
import { getTransactionYearsRange } from '#/data/getTransactionYearsRange'
import { CashFlow } from './-cashflow'
import { z } from 'zod'

const RecentTransactions = lazy(() =>
  import('./-recent-transactions').then((m) => ({
    default: m.RecentTransactions,
  })),
)

const today = new Date()

const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
})

export const Route = createFileRoute('/_authenticated/dashboard/')({
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ cfyear: search.cfyear }),

  loader: async ({ deps }) => {
    const [transactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({
        data: { year: deps.cfyear ?? today.getFullYear() }, // ← Use current year dynamically
      }),
      getTransactionYearsRange(),
    ])

    return {
      cfyear: deps.cfyear ?? today.getFullYear(),
      cashflow,
      transactions,
      yearsRange,
    }
  },
})

function RouteComponent() {
  const { transactions, cashflow, yearsRange, cfyear } = Route.useLoaderData()

  console.log({ cashflow }) // for debugging

  return (
    <div className="max-w-7xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>

      <CashFlow
        year={cfyear}
        yearsRange={yearsRange}
        annualCashflow={cashflow}
      />

      <RecentTransactions transactions={transactions} />
    </div>
  )
}
