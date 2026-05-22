import * as z from 'zod'
import { useForm } from '@tanstack/react-form'
import type { FormOptions } from '@tanstack/react-form'
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
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'

const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number<number>().positive('Please select a category'),
  transactionDate: z
    .date()
    .max(new Date(), 'Transaction date cannot be in the future'),
  amount: z.coerce.number<number>().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 characters')
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

  const handleSubmit = (data: z.infer<typeof transactionFormSchema>) => {
    console.log(data)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit(handleSubmit)
      }}
    >
      <FieldGroup className="grid grid-cols-2 gap-y-5 gap-x-2">
        {/* Transaction Type */}
        <form.Field
          name="transactionType"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Transaction Type</FieldLabel>
                <Select
                  disabled={form.state.isSubmitting}
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
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value.toString()}
                  onValueChange={(value) => field.handleChange(Number(value))}
                  disabled={form.state.isSubmitting}
                >
                  <SelectTrigger aria-invalid={isInvalid}>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {/* Options */}
                  </SelectContent>
                </Select>
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
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Transaction Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={form.state.isSubmitting}
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
                  disabled={form.state.isSubmitting}
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
                    disabled={form.state.isSubmitting}
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
