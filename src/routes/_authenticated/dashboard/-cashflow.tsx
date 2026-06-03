import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { ChartContainer } from '#/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useNavigate } from '@tanstack/react-router'
import { Bar, BarChart } from 'recharts'

export function CashFlow({
  yearsRange,
  year,
  annualCashflow,
}: {
  yearsRange: number[]
  year: number
  annualCashflow: { month: number; income: number; expenses: number }[]
}) {
  const navigate = useNavigate()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <Select
            defaultValue={year.toString()}
            onValueChange={(value) => {
              navigate({
                to: '/dashboard',
                search: {
                  cfyear: Number(value),
                },
              })
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearsRange.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: { label: 'Income', color: '#84cc16' },
            expenses: { label: 'Expenses', color: 'f97316' },
          }}
          className="w-full h-75"
        >
          <BarChart data={annualCashflow}>
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
