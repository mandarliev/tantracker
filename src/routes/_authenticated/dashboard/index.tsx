import { createFileRoute } from '@tanstack/react-router'
import { getRecentTransactions } from '#/data/getRecentTransactions'
import { lazy } from 'react'

const RecentTransactions = lazy(() =>
  import('./-recent-transactions').then((m) => ({ default: m.RecentTransactions }))
)

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
  loader: async () => {
    const transactions = await getRecentTransactions()
    return {
      transactions,
    }
  },
})

function RouteComponent() {
  const { transactions } = Route.useLoaderData()
  return (
    <div className="max-w-7xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <RecentTransactions transactions={transactions} />
    </div>
  )
}
