import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { TransactionType } from "@/features/transactions/model/types"

type TypeSelectorProps = {
  selectedType: TransactionType
  onSelect: (type: TransactionType) => void
}

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "支出" },
  { value: "income", label: "収入" },
]

export const TypeSelector = ({ selectedType, onSelect }: TypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">種類</Label>
      <ToggleGroup
        type="single"
        value={selectedType}
        onValueChange={(value) => {
          if (value) onSelect(value as TransactionType)
        }}
        className="grid grid-cols-2 gap-2 w-full"
      >
        {typeOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={`w-full h-10 text-base font-medium transition-all ${
              option.value === "expense"
                ? "data-[state=on]:bg-rose-100 data-[state=on]:text-rose-700 dark:data-[state=on]:bg-rose-950/50 dark:data-[state=on]:text-rose-400"
                : "data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-700 dark:data-[state=on]:bg-emerald-950/50 dark:data-[state=on]:text-emerald-400"
            }`}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
