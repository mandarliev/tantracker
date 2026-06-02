import { createFileRoute } from '@tanstack/react-router'
import { getRecentTransactions } from '#/data/getRecentTransactions'
import { getAnnualCashflow } from '#/data/getAnnualCashflow'
import { lazy } from 'react'

const RecentTransactions = lazy(() =>
  import('./-recent-transactions').then((m) => ({
    default: m.RecentTransactions,
  })),
)

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,

  loader: async () => {
    const currentYear = new Date().getFullYear()

    const [transactions, cashflow] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({
        data: { year: currentYear }, // ← Use current year dynamically
      }),
    ])

    return {
      cashflow,
      transactions,
    }
  },
})

function RouteComponent() {
  const { transactions, cashflow } = Route.useLoaderData()

  console.log({ cashflow }) // for debugging

  return (
    <div className="max-w-7xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>

      {/* You can add a Cashflow summary here later */}
      {cashflow.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-3">Annual Cashflow</h2>
          {/* TODO: Add chart or summary cards here */}
        </div>
      )}

      <RecentTransactions transactions={transactions} />
    </div>
  )
}
