import {
  TransactionForm,
  transactionFormSchema,
} from '#/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { getCategories } from '#/data/getCategories'
import { getTransaction } from '#/data/getTransaction'
import { updateTransaction } from '#/data/updateTransaction'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { z } from 'zod'
import { toast } from 'sonner'

export const Route = createFileRoute(
  '/_authenticated/dashboard/transactions/$transactionId/_layout/',
)({
  component: RouteComponent,
  errorComponent: () => {
    return (
      <div className="text-3xl text-muted-foreground">
        Oops! Transaction not found.
      </div>
    )
  },
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
  const navigate = useNavigate()
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
        categoryId: data.categoryId,
        description: data.description,
      },
    })

    toast.success('Transaction created')
    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    })
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
