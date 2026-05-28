import * as z from 'zod'
import { useForm, formOptions } from '@tanstack/react-form'

import { Field, FieldGroup, FieldLabel } from './ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'
import { addDays, format } from 'date-fns'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import type { categoriesTable } from '#/db/schema'

export const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number<number>().positive('Please select a category'),
  transactionDate: z
    .date()
    .max(addDays(new Date(), 1), 'Transaction date cannot be in the future'),
  amount: z.coerce.number<number>().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 characters')
    .max(300, 'Description must contain a maximum of 300 characters'),
})

type TransactionFormData = z.infer<typeof transactionFormSchema>

const formOpts = formOptions({
  defaultValues: {
    transactionType: 'income',
    categoryId: 0,
    amount: 0,
    description: '',
    transactionDate: new Date(),
  },
  validators: {
    onSubmit: transactionFormSchema,
  },
})

export function TransactionForm({
  categories,
  onSubmit,
}: {
  categories: (typeof categoriesTable.$inferSelect)[]
  onSubmit: (data: TransactionFormData) => Promise<void>
}) {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      await onSubmit(value as TransactionFormData)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup className="grid grid-cols-2 gap-y-5 gap-x-2">
        {/* Transaction Type */}
        <form.Field
          name="transactionType"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form requires children as a render prop
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

        {/* Category ID */}
        <form.Field
          name="categoryId"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form requires children as a render prop
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                {/* 1. Subscribe to the real-time form state value for transactionType */}
                <form.Subscribe
                  selector={(state) => state.values.transactionType}
                >
                  {(currentType) => {
                    // 2. Filter the categories array to match the active type ('income' or 'expense')
                    const filteredCategories = categories.filter(
                      (cat) => cat.type === currentType,
                    )

                    return (
                      <Select
                        name={field.name}
                        value={field.state.value.toString()}
                        onValueChange={(value) =>
                          field.handleChange(Number(value))
                        }
                      >
                        <SelectTrigger aria-invalid={isInvalid}>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {filteredCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }}
                </form.Subscribe>
                {isInvalid && (
                  <p className="text-xs text-destructive mt-1">
                    {field.state.meta.errors
                      .map((err: any) => err.message ?? err)
                      .join(', ')}
                  </p>
                )}
              </Field>
            )
          }}
        />

        {/* Transaction Date */}
        <form.Field
          name="transactionDate"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form requires children as a render prop
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Transaction Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!field.state.value}
                      className="w-full justify-start text-left font-normal aria-invalid:border-destructive data-[empty=true]:text-muted-foreground"
                      aria-invalid={isInvalid}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(field.state.value, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      required
                      selected={field.state.value}
                      onSelect={(date) => field.handleChange(date)}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )
          }}
        />

        {/* Amount Field */}
        <form.Field
          name="amount"
          // biome-ignore lint/correctness/noChildrenProp: TanStack Form requires children as a render prop
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step={0.01}
                  // Convert the number directly to a string without any conditional checks
                  value={String(field.state.value)}
                  onChange={(e) =>
                    field.handleChange(e.target.valueAsNumber || 0)
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />

                {isInvalid && (
                  <p className="text-xs text-destructive mt-1">
                    {field.state.meta.errors
                      .map((err: any) => err.message ?? err)
                      .join(', ')}
                  </p>
                )}
              </Field>
            )
          }}
        />

        {/* Description Wrapper Div spans full width */}
        <div className="col-span-2 w-full">
          <form.Field
            name="description"
            // biome-ignore lint/correctness/noChildrenProp: TanStack Form requires children as a render prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    className="w-full"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <p className="text-xs text-destructive mt-1">
                      {field.state.meta.errors
                        .map((err: any) => err.message ?? err)
                        .join(', ')}
                    </p>
                  )}
                </Field>
              )
            }}
          />
        </div>

        {/* Submit Button Div wrapper spans full width */}
        <div className="col-span-2 w-full">
          <Button
            type="submit"
            disabled={form.state.isSubmitting}
            className="w-full h-10"
          >
            {form.state.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
