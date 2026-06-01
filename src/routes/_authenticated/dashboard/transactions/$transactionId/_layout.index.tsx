import {
  TransactionForm,
  type TransactionFormData,
} from '#/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { getCategories } from '#/data/getCategories'
import { getTransaction } from '#/data/getTransaction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/transactions/$transactionId/_layout/',
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({ data: { transactionId: Number(params.transactionId) } }),
    ])
    return { transaction, categories }
  },
})

function RouteComponent() {
  const { categories, transaction } = Route.useLoaderData()
  const handleSubmit = async (data: TransactionFormData) => {
    console.log('Submitting edit:', data)
  }
  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <CardTitle>Edit Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          transaction={transaction}
        />
      </CardContent>
    </Card>
  )
}
