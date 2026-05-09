import { TwemojiEmoji } from "#/components/ui/twemoji-emoji"
import type { Transaction } from "../.."

type TransactionWithEmoji = Transaction & {
  emoji: string
}

type TransactionListItemProps = {
  transaction: TransactionWithEmoji
  onPress?: (transaction: TransactionWithEmoji) => void
}

const TransactionListItem = ({
  transaction,
  onPress,
}: TransactionListItemProps) => {
  const isIncome = transaction.type === "income"
  const hasMemo = transaction.memo && transaction.memo.trim() !== ""
  return (
    <button
      className="w-full text-left rounded-xl bg-accent/30 hover:bg-accent/50 active:bg-accent transition-colors px-4 py-3.5"
      onClick={() => onPress?.(transaction)}
    >
      <div className="flex items-center gap-3.5">
        <div className="shrink-0">
          <TwemojiEmoji emoji={transaction.emoji} size={28} />
        </div>

        {hasMemo ? (
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-base font-medium text-foreground line-clamp-1 leading-tight">
              {transaction.category}
            </p>
            <p className="text-xs text-muted-foreground/80 leading-none">
              {transaction.memo}
            </p>
          </div>
        ) : (
          <div className="flex-1 min-w-0 flex items-center h-10">
            <p className="text-base font-medium text-foreground line-clamp-1">
              {transaction.category}
            </p>
          </div>
        )}

        <div className="text-right shrink-0">
          <p
            className={`text-lg font-semibold tabular-nums ${
              isIncome ? "text-green-600" : "text-red-600"
            }`}
          >
            {isIncome ? "+" : ""}¥{transaction.amount.toLocaleString()}
          </p>
        </div>
      </div>
    </button>
  )
}

export default TransactionListItem
