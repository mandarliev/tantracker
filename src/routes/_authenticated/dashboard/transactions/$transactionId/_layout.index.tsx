import { TransactionForm } from '#/components/transaction-form'
import type { transactionFormSchema } from '#/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { getCategories } from '#/data/getCategories'
import { getTransaction } from '#/data/getTransaction'
import { updateTransaction } from '#/data/updateTransaction'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import type { z } from 'zod'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { deleteTransaction } from '#/data/deleteTransaction'
import { useState } from 'react'

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
  const [deleting, setDeleting] = useState(false)
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

    toast.success('Transaction updated')
    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    })
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    await deleteTransaction({
      data: {
        transactionId: transaction.id,
      },
    })

    toast.success('Transaction deleted')

    setDeleting(false)

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: Number(transaction.transactionDate.split('-')[1]),
        year: Number(transaction.transactionDate.split('-')[0]),
      },
    })
  }

  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This transaction will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  variant="destructive"
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
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
