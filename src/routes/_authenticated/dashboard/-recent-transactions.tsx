import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import numeral from 'numeral'

export function RecentTransactions({
  transactions,
}: {
  transactions: {
    id: number
    description: string
    amount: string
    transactionDate: string
    category: string | null
    transactionType: 'income' | 'expense' | null
  }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Recent Transactions</span>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/transactions">View all</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/transactions/new">Create new </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!!transactions.length && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(transaction.transactionDate, 'do MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <span>{transaction.description}</span>
                  </TableCell>
                  <TableCell className="capitalize">
                    <Badge
                      className={
                        transaction.transactionType === 'income'
                          ? 'bg-lime-500'
                          : 'bg-orange-500'
                      }
                    >
                      {transaction.transactionType}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    ${numeral(transaction.amount).format('0,0[.]00')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
