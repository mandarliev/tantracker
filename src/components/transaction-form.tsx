import * as z from 'zod'
import { useForm } from '@tanstack/react-form' // 1. Runtime code import
import type { FormOptions } from '@tanstack/react-form' // 2. Separate, top-level type import
import { Field, FieldGroup, FieldLabel } from './ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number<number>().positive('Please select a category'),
  transactionDate: z
    .date()
    .max(new Date(), 'Transaction date cannot be in the future'),
  amount: z.coerce.number<number>().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 charachters')
    .max(300, 'Description must contain a maximum of 300 characters'),
})

const formConfig = {
  defaultValues: {
    transactionType: 'income',
    amount: 0,
    categoryId: 0,
    description: '',
    transactionDate: new Date(),
  },
  validators: {
    onSubmit: transactionFormSchema,
  },
} satisfies FormOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export function TransactionForm() {
  const form = useForm(formConfig)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup className="grid grid-cols-2 gap-y-5 gap-x-2">
        <form.Field
          name="transactionType"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Transaction Type</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )
          }}
        />
      </FieldGroup>
    </form>
  )
}
