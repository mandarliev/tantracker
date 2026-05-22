import { TransactionForm } from '#/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { getCategories } from '#/data/getCategories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/transactions/new/_layout/',
)({
  loader: async () => {
    const categories = await getCategories()
    return { categories }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { categories } = Route.useLoaderData()
  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} />
      </CardContent>
    </Card>
  )
}
