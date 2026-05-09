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
  const { category, amount, type, memo, emoji } = transaction

  const isIncome = type === "income"
  const hasMemo = memo && memo.trim() !== ""

  return (
    <button
      className="w-full text-left rounded-xl bg-white border border-gray-100 transition-colors px-4 py-3"
      onClick={() => onPress?.(transaction)}
    >
      <div className="flex items-center gap-4">
        {/* Emoji */}
        <div className="shrink-0">
          <TwemojiEmoji emoji={emoji} size={40} />
        </div>

        {/* Category and Memo */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-base font-medium text-foreground line-clamp-1 leading-tight">
            {category}
          </p>
          {hasMemo && (
            <p className="text-xs text-muted-foreground/80 leading-none">
              {memo}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <p
            className={`text-lg font-semibold tabular-nums ${
              isIncome ? "text-green-600" : "text-red-600"
            }`}
          >
            {isIncome ? "+" : ""}¥{amount.toLocaleString()}
          </p>
        </div>
      </div>
    </button>
  )
}

export default TransactionListItem
