import { Pressable, ScrollView, Text, View } from 'react-native'
import { useAuth, useClerk } from '@clerk/clerk-expo'
import { ScreenContainer } from '@/components/screen-container'
import { SignInForm } from '@/features/auth'
import { TransactionForm } from '@/features/dashboard/components/transaction-form'
import { TransactionList } from '@/features/dashboard/components/transaction-list'
import { useCreateTransaction } from '@/features/dashboard/hooks/use-create-transaction'
import { useTransactionQuery } from '@/features/dashboard/hooks/use-transaction-query'

export function DashboardScreen() {
  const { isSignedIn, userId } = useAuth()
  const { signOut } = useClerk()

  const { transactions, summary, queryError } = useTransactionQuery()
  const { isSubmitting, mutationError, submitTransaction } = useCreateTransaction()

  const error = mutationError ?? queryError

  if (!isSignedIn) {
    return (
      <ScreenContainer>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-slate-900">Budget App</Text>
          <Text className="mt-2 text-slate-600">Sign in with Clerk to access your data.</Text>
        </View>

        <SignInForm />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-slate-900">Budget App</Text>
        <Text className="mt-2 text-slate-600">Record both expenses and incomes from this form.</Text>
        <Text className="mt-1 text-xs text-slate-500">Signed in as: {userId}</Text>
        <Pressable className="mt-3 self-start" onPress={() => signOut()}>
          <Text className="font-medium text-slate-700">Sign out</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32, gap: 16 }}>
        <TransactionForm isSubmitting={isSubmitting} onSubmit={submitTransaction} />

        {error ? (
          <View className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <Text className="text-rose-700">{error}</Text>
          </View>
        ) : null}

        <TransactionList
          transactions={transactions}
          income={summary.income}
          expense={summary.expense}
          balance={summary.balance}
        />
      </ScrollView>
    </ScreenContainer>
  )
}
