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
    <>
      <label className="mb-1 text-slate-700">Type</label>
      <div className="mb-3 flex gap-2">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`h-12 flex-1 items-center justify-center rounded-xl px-3 ${
              selectedType === option.value ? "bg-slate-900" : "bg-slate-100"
            }`}
          >
            <span
              className={
                selectedType === option.value
                  ? "font-semibold text-white"
                  : "text-slate-700"
              }
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
