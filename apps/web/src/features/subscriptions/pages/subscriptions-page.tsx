import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { SubscriptionForm } from "@/features/subscriptions/components/subscription-form"
import { SubscriptionList } from "@/features/subscriptions/components/subscription-list"
import { useCreateSubscription } from "@/features/subscriptions/hooks/use-create-subscription"
import { useSubscriptionQuery } from "@/features/subscriptions/hooks/use-subscription-query"
import { useUpdateSubscription } from "@/features/subscriptions/hooks/use-update-subscription"
import type {
  CreateSubscriptionInput,
  Subscription,
} from "@/features/subscriptions/model/types"
import { Plus } from "lucide-react"
import { useState } from "react"

export const SubscriptionsPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { subscriptions, summary, queryError, isLoading } =
    useSubscriptionQuery()
  const { isSubmitting: isCreating, submitSubscription: createSubscription } =
    useCreateSubscription()
  const { isSubmitting: isUpdating, submitSubscription: updateSubscription } =
    useUpdateSubscription()

  const handleSubscriptionPress = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setIsSheetOpen(true)
  }

  const handleNewSubscription = () => {
    setEditingSubscription(null)
    setIsSheetOpen(true)
  }

  const handleSubmit = async (input: CreateSubscriptionInput) => {
    if (editingSubscription) {
      await updateSubscription({
        ...input,
        id: editingSubscription.id,
      })
    } else {
      await createSubscription(input)
    }
  }

  const handleSuccess = () => {
    setIsSheetOpen(false)
    setEditingSubscription(null)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 2000)
  }

  if (isLoading) {
    return (
      <>
        {/* Summary Section Skeleton */}
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-40" />
            </div>

            <div className="flex gap-6">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-7 w-28" />
              </div>
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-7 w-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Subscription List Skeleton */}
        <section className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-accent/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-7 w-20" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </section>
      </>
    )
  }

  return (
    <>
      {/* Summary Section */}
      <section className="space-y-6">
        {/* Summary Cards */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">月額合計</p>
            <p className="text-3xl font-bold tabular-nums text-foreground">
              ¥{Math.round(summary.monthlyTotal).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-1.5">
              <p className="text-xs text-muted-foreground">年額合計</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                ¥{Math.round(summary.yearlyTotal).toLocaleString()}
              </p>
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="text-xs text-muted-foreground">有効件数</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {summary.activeCount}件
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {queryError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-1">
          <p className="text-sm font-medium text-destructive">
            読み込みに失敗しました
          </p>
          <p className="text-xs text-destructive/80">
            もう一度試してみてください
          </p>
        </div>
      )}

      {/* Subscription List */}
      <section>
        <SubscriptionList
          subscriptions={subscriptions}
          onSubscriptionPress={handleSubscriptionPress}
        />
      </section>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          保存しました
        </div>
      )}

      {/* Subscription Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] px-6 flex flex-col">
          <SheetHeader className="pb-6 border-b border-border">
            <SheetTitle className="text-lg font-medium">
              {editingSubscription
                ? "サブスクリプションを編集"
                : "サブスクリプションを追加"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto flex-1 px-1">
            <SubscriptionForm
              isSubmitting={isCreating || isUpdating}
              onSubmit={handleSubmit}
              onSuccess={handleSuccess}
              initialValues={
                editingSubscription
                  ? (() => {
                      const nextBillingDate = new Date(
                        editingSubscription.nextBillingDate,
                      )
                      return {
                        id: editingSubscription.id,
                        name: editingSubscription.name,
                        amount: editingSubscription.amount.toString(),
                        currency: editingSubscription.currency,
                        billingCycle: editingSubscription.billingCycle,
                        monthlyDay:
                          editingSubscription.billingCycle === "monthly"
                            ? nextBillingDate.getDate()
                            : undefined,
                        yearlyMonth:
                          editingSubscription.billingCycle === "yearly"
                            ? nextBillingDate.getMonth() + 1
                            : undefined,
                        yearlyDay:
                          editingSubscription.billingCycle === "yearly"
                            ? nextBillingDate.getDate()
                            : undefined,
                        weeklyDay:
                          editingSubscription.billingCycle === "weekly"
                            ? nextBillingDate.getDay()
                            : undefined,
                        status: editingSubscription.status,
                        memo: editingSubscription.memo ?? "",
                        paymentMethod: editingSubscription.paymentMethod ?? "",
                      }
                    })()
                  : undefined
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* FAB Button - aligned with max-w-2xl container */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-none">
        <div className="flex justify-end">
          <Button
            onClick={handleNewSubscription}
            className="h-16 w-16 rounded-full transition-all pointer-events-auto"
          >
            <Plus className="size-6" />
          </Button>
        </div>
      </div>
    </>
  )
}
