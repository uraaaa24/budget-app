import { TransactionForm } from "@/features/dashboard/components/transaction-form"
import { useCategoryQuery } from "@/features/dashboard/hooks/use-category-query"
import { useCreateTransaction } from "@/features/dashboard/hooks/use-create-transaction"
import { useUpdateTransaction } from "@/features/dashboard/hooks/use-update-transaction"
import type { CreateTransactionInput } from "@/features/dashboard/model/types"
import { useAuth } from "@clerk/clerk-expo"
import { Redirect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native"

const TransactionModalScreen = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const params = useLocalSearchParams<{
    id?: string
    type?: string
    amount?: string
    category?: string
    memo?: string
    spentAt?: string
  }>()

  const isEditMode = Boolean(params.id)

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const {
    isSubmitting: isCreating,
    mutationError: createError,
    submitTransaction: createTransaction,
  } = useCreateTransaction()
  const {
    isSubmitting: isUpdating,
    mutationError: updateError,
    submitTransaction: updateTransaction,
  } = useUpdateTransaction()

  const isSubmitting = isCreating || isUpdating
  const mutationError = createError || updateError

  const submitAndClose = useCallback(
    async (input: CreateTransactionInput) => {
      if (isEditMode && params.id) {
        await updateTransaction({
          ...input,
          id: params.id,
        })
      } else {
        await createTransaction(input)
      }
      router.back()
    },
    [router, isEditMode, params.id, createTransaction, updateTransaction],
  )

  if (!isLoaded) return null

  if (!isSignedIn) return <Redirect href="/sign-in" />

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-end bg-black/40"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable className="flex-1" onPress={() => router.back()} />

      <View className="max-h-[85%] rounded-t-3xl bg-slate-50 px-5 pb-8 pt-4">
        <View className="mb-3 items-center">
          <View className="h-1.5 w-12 rounded-full bg-slate-300" />
        </View>

        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-slate-900">
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="font-medium text-slate-600">Close</Text>
          </Pressable>
        </View>
        <Text className="mb-4 text-xs text-slate-500">
          Tap outside to close this sheet
        </Text>

        {categoryQueryError ? (
          <View className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <Text className="text-rose-700">{categoryQueryError}</Text>
          </View>
        ) : null}

        {mutationError ? (
          <View className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <Text className="text-rose-700">{mutationError}</Text>
          </View>
        ) : null}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <TransactionForm
            categories={categories}
            isSubmitting={isSubmitting}
            onSubmit={submitAndClose}
            initialValues={
              isEditMode && params.id
                ? {
                    id: params.id,
                    type: (params.type as "expense" | "income") ?? "expense",
                    amount: params.amount ?? "",
                    category: params.category ?? "",
                    memo: params.memo ?? "",
                    spentAt: params.spentAt,
                  }
                : undefined
            }
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default TransactionModalScreen
