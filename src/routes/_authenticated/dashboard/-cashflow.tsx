import { Card, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useNavigate } from '@tanstack/react-router'

export function CashFlow({
  yearsRange,
  year,
}: {
  yearsRange: number[]
  year: number
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
    </Card>
  )
}
