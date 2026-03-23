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
import {
  subscriptionFormSchema,
  type SubscriptionFormSchema,
} from "@/features/subscriptions/model/schemas"
import type { CreateSubscriptionInput } from "@/features/subscriptions/model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
      ? initialValues
      : {
          name: "",
          amount: "",
          currency: "JPY",
          billingCycle: "monthly",
          monthlyDay: new Date().getDate(), // Default to today's day
          yearlyMonth: new Date().getMonth() + 1,
          yearlyDay: new Date().getDate(),
          weeklyDay: new Date().getDay(),
          status: "active",
          memo: "",
          paymentMethod: "",
        },
  })

  const billingCycle = form.watch("billingCycle")

  const handleSubmit = async (values: SubscriptionFormSchema) => {
    const parsedAmount = Number(values.amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    // Calculate next billing date based on billing cycle
    const now = new Date()
    let nextBillingDate: Date

    switch (values.billingCycle) {
      case "monthly": {
        const day = values.monthlyDay ?? now.getDate()
        nextBillingDate = new Date(now.getFullYear(), now.getMonth(), day)
        // If the date has already passed this month, move to next month
        if (nextBillingDate < now) {
          nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, day)
        }
        break
      }
      case "yearly": {
        const month = (values.yearlyMonth ?? now.getMonth() + 1) - 1 // Convert to 0-indexed
        const day = values.yearlyDay ?? now.getDate()
        nextBillingDate = new Date(now.getFullYear(), month, day)
        // If the date has already passed this year, move to next year
        if (nextBillingDate < now) {
          nextBillingDate = new Date(now.getFullYear() + 1, month, day)
        }
        break
      }
      case "weekly": {
        const targetDay = values.weeklyDay ?? now.getDay()
        const currentDay = now.getDay()
        let daysUntilNext = targetDay - currentDay
        if (daysUntilNext <= 0) {
          daysUntilNext += 7
        }
        nextBillingDate = new Date(now)
        nextBillingDate.setDate(now.getDate() + daysUntilNext)
        break
      }
    }

    try {
      await onSubmit({
        name: values.name,
        amount: parsedAmount,
        currency: values.currency || "JPY",
        billingCycle: values.billingCycle,
        startDate: now.toISOString(),
        nextBillingDate: nextBillingDate.toISOString(),
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

          {/* Billing Date - Monthly */}
          {billingCycle === "monthly" && (
            <FormField
              control={form.control}
              name="monthlyDay"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    引き落とし日
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="日を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          毎月{day}日
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Billing Date - Yearly */}
          {billingCycle === "yearly" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="yearlyMonth"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      引き落とし月
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="月を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {month}月
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearlyDay"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      引き落とし日
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="日を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}日
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Billing Date - Weekly */}
          {billingCycle === "weekly" && (
            <FormField
              control={form.control}
              name="weeklyDay"
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    引き落とし曜日
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="曜日を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">毎週日曜日</SelectItem>
                      <SelectItem value="1">毎週月曜日</SelectItem>
                      <SelectItem value="2">毎週火曜日</SelectItem>
                      <SelectItem value="3">毎週水曜日</SelectItem>
                      <SelectItem value="4">毎週木曜日</SelectItem>
                      <SelectItem value="5">毎週金曜日</SelectItem>
                      <SelectItem value="6">毎週土曜日</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
