import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  subscriptionFormSchema,
  type SubscriptionFormSchema,
} from "@/features/subscriptions/model/schemas"
import type { CreateSubscriptionInput } from "@/features/subscriptions/model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type SubscriptionFormProps = {
  isSubmitting: boolean
  onSubmit: (input: CreateSubscriptionInput) => Promise<void>
  onSuccess?: () => void
  initialValues?: Partial<SubscriptionFormSchema> & { id?: string }
}

export const SubscriptionForm = ({
  isSubmitting,
  onSubmit,
  onSuccess,
  initialValues,
}: SubscriptionFormProps) => {
  const form = useForm<SubscriptionFormSchema>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          startDate: initialValues.startDate ?? new Date(),
          nextBillingDate: initialValues.nextBillingDate ?? new Date(),
        }
      : {
          name: "",
          amount: "",
          currency: "JPY",
          billingCycle: "monthly",
          startDate: new Date(),
          nextBillingDate: new Date(),
          status: "active",
          memo: "",
          paymentMethod: "",
        },
  })

  const handleSubmit = async (values: SubscriptionFormSchema) => {
    const parsedAmount = Number(values.amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    try {
      await onSubmit({
        name: values.name,
        amount: parsedAmount,
        currency: values.currency || "JPY",
        billingCycle: values.billingCycle,
        startDate: values.startDate.toISOString(),
        nextBillingDate: values.nextBillingDate.toISOString(),
        status: values.status,
        memo: values.memo.trim() || undefined,
        paymentMethod: values.paymentMethod.trim() || undefined,
      })
      form.reset()
      onSuccess?.()
    } catch {
      // parent hook owns error state
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2.5">
              <FormLabel className="text-sm font-medium text-muted-foreground">
                サービス名
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Netflix, Spotify など"
                  className="h-12 text-base"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-2.5">
              <FormLabel className="text-sm font-medium text-muted-foreground">
                金額
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    className="h-16 text-3xl font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 tabular-nums"
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                    円
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Basic Details */}
        <div className="space-y-5">
          {/* Billing Cycle */}
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem className="space-y-2.5">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  支払いのタイミング
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">毎月</SelectItem>
                    <SelectItem value="yearly">毎年</SelectItem>
                    <SelectItem value="weekly">毎週</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Next Billing Date */}
          <FormField
            control={form.control}
            name="nextBillingDate"
            render={({ field }) => (
              <FormItem className="space-y-2.5">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  次回の引き落とし日
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal text-base",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "yyyy年M月d日", { locale: ja })
                        ) : (
                          <span>日付を選択</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-2.5">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  状態
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">利用中</SelectItem>
                    <SelectItem value="paused">一時停止中</SelectItem>
                    <SelectItem value="canceled">解約済み</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Details */}
        <div className="space-y-5 pt-2">
          <p className="text-xs font-medium text-muted-foreground/80">
            追加情報（任意）
          </p>

          {/* Payment Method */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-2.5">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  支払い方法
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="クレジットカード、口座振替 など"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Memo */}
          <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem className="space-y-2.5">
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  メモ
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="プラン名やその他メモ"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
