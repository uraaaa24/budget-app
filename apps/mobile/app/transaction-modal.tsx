import { TransactionForm } from "@/features/dashboard/components/transaction-form"
import { useCategoryQuery } from "@/features/dashboard/hooks/use-category-query"
import { useCreateTransaction } from "@/features/dashboard/hooks/use-create-transaction"
import { useAuth } from "@clerk/clerk-expo"
import { Redirect, useRouter } from "expo-router"
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

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const { isSubmitting, mutationError, submitTransaction } =
    useCreateTransaction()

  const submitAndClose = useCallback(
    async (...args: Parameters<typeof submitTransaction>) => {
      await submitTransaction(...args)
      router.back()
    },
    [router, submitTransaction],
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
            Add Transaction
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
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default TransactionModalScreen
