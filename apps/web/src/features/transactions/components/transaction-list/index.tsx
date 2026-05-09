import type { Transaction } from "@/features/transactions/model/types"
import TransactionListItem from "./transaction-list-item"
import { useTransactionList } from "./use-transaction-list"

type TransactionListProps = {
  transactions: Transaction[]
  onTransactionPress?: (transaction: Transaction) => void
}

const TransactionList = ({
  transactions,
  onTransactionPress,
}: TransactionListProps) => {
  const { groupedTransactions } = useTransactionList(transactions)

  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-base text-foreground/70">さあ、今日から</p>
        <p className="text-sm text-muted-foreground">
          右下のボタンから始めてみましょう
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groupedTransactions.map((group) => {
        return (
          <div key={group.dateLabel} className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {group.dateLabel}
            </p>

            <div className="space-y-2">
              {group.items.map((item) => {
                return (
                  <TransactionListItem
                    key={item.id}
                    transaction={item}
                    onPress={() => onTransactionPress?.(item)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TransactionList
