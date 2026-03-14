import { ScreenContainer } from "@/components/screen-container"
import { TransactionList } from "@/features/dashboard/components/transaction-list"
import { useCategoryQuery } from "@/features/dashboard/hooks/use-category-query"
import { useTransactionQuery } from "@/features/dashboard/hooks/use-transaction-query"
import type { Transaction } from "@/features/dashboard/model/types"
import { useAuth, useClerk } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { useCallback } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"

export const DashboardScreen = () => {
  const { userId } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()

  const { categories, queryError: categoryQueryError } = useCategoryQuery()
  const { transactions, summary, queryError } = useTransactionQuery()

  const error = queryError ?? categoryQueryError

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      router.push({
        pathname: "/transaction-modal",
        params: {
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount.toString(),
          category: transaction.category,
          memo: transaction.memo ?? "",
          spentAt: transaction.spentAt,
        },
      })
    },
    [router],
  )

  return (
    <ScreenContainer>
      {/* <View className="mb-6">
        <Text className="text-3xl font-bold text-slate-900">Budget App</Text>
        <Text className="mt-2 text-slate-600">
          Record both expenses and incomes from this form.
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          Signed in as: {userId}
        </Text>
        <Pressable className="mt-3 self-start" onPress={() => signOut()}>
          <Text className="font-medium text-slate-700">Sign out</Text>
        </Pressable>
      </View> */}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 112, gap: 16 }}
      >
        {error ? (
          <View className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <Text className="text-rose-700">{error}</Text>
          </View>
        ) : null}

        <TransactionList
          categories={categories}
          transactions={transactions}
          income={summary.income}
          expense={summary.expense}
          balance={summary.balance}
          onTransactionPress={handleTransactionPress}
        />
      </ScrollView>

      <Pressable
        onPress={() => router.push("/transaction-modal")}
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full border border-slate-800 bg-slate-900"
      >
        <Text className="text-2xl font-semibold text-white">+</Text>
      </Pressable>
    </ScreenContainer>
  )
}
