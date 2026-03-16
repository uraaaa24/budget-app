import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { TransactionType } from "@/features/transactions/model/types"

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
    <div className="space-y-2">
      <Label>Type</Label>
      <ToggleGroup
        type="single"
        value={selectedType}
        onValueChange={(value) => {
          if (value) onSelect(value as TransactionType)
        }}
        className="grid grid-cols-2 gap-2"
      >
        {typeOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="w-full"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
