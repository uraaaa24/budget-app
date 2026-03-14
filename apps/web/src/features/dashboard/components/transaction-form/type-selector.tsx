import type { TransactionType } from "@/features/dashboard/model/types"

type TypeSelectorProps = {
  selectedType: TransactionType
  onSelect: (type: TransactionType) => void
}

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
]

export const TypeSelector = ({ selectedType, onSelect }: TypeSelectorProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Type
      </label>
      <div className="flex gap-2">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`h-11 flex-1 rounded-lg text-sm font-medium transition-colors ${
              selectedType === option.value
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
