import type { transactionFormSchema } from '#/components/transaction-form'
import { TransactionForm } from '#/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { createTransaction } from '#/data/createTransaction'
import { getCategories } from '#/data/getCategories'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type z from 'zod'

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
  const navigate = useNavigate()

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    console.log('HANDLE SUBMIT', { data })
    const transaction = await createTransaction({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'), // YYYY-MM-DD
      },
    })

    console.log({ transaction })
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
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  )
}
