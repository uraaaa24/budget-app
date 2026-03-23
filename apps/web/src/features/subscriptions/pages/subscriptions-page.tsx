import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SubscriptionForm } from "@/features/subscriptions/components/subscription-form"
import { SubscriptionList } from "@/features/subscriptions/components/subscription-list"
import { useCreateSubscription } from "@/features/subscriptions/hooks/use-create-subscription"
import { useSubscriptionQuery } from "@/features/subscriptions/hooks/use-subscription-query"
import { useUpdateSubscription } from "@/features/subscriptions/hooks/use-update-subscription"
import type {
  CreateSubscriptionInput,
  Subscription,
} from "@/features/subscriptions/model/types"
import { useAuth } from "@clerk/clerk-react"
import { useState } from "react"

export const SubscriptionsPage = () => {
  const { userId } = useAuth()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { subscriptions, summary, queryError } = useSubscriptionQuery()
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

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-24 space-y-8">
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
            onAddPress={handleNewSubscription}
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
          <SheetContent side="bottom" className="h-[90vh] px-4 sm:px-6">
            <SheetHeader className="pb-4 border-b border-border">
              <SheetTitle className="text-lg font-medium">
                {editingSubscription
                  ? "サブスクリプションを編集"
                  : "サブスクリプションを追加"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto h-[calc(90vh-80px)] px-1">
              <SubscriptionForm
                isSubmitting={isCreating || isUpdating}
                onSubmit={handleSubmit}
                onSuccess={handleSuccess}
                initialValues={
                  editingSubscription
                    ? {
                        id: editingSubscription.id,
                        name: editingSubscription.name,
                        amount: editingSubscription.amount.toString(),
                        currency: editingSubscription.currency,
                        billingCycle: editingSubscription.billingCycle,
                        startDate: new Date(editingSubscription.startDate),
                        nextBillingDate: new Date(
                          editingSubscription.nextBillingDate,
                        ),
                        status: editingSubscription.status,
                        memo: editingSubscription.memo ?? "",
                        paymentMethod: editingSubscription.paymentMethod ?? "",
                      }
                    : undefined
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
