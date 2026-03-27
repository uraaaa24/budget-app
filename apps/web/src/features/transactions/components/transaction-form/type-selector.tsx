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
    <div className="space-y-3">
      <Label className="text-sm text-muted-foreground">種類</Label>
      <ToggleGroup
        type="single"
        value={selectedType}
        onValueChange={(value) => {
          if (value) onSelect(value as TransactionType)
        }}
        className="grid grid-cols-2 gap-3 w-full"
      >
        {typeOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={`w-full h-12 text-base font-medium rounded-lg transition-colors border ${
              option.value === "expense"
                ? "data-[state=on]:bg-red-500/10 data-[state=on]:text-red-600 data-[state=on]:border-red-500/20 data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground data-[state=off]:border-border"
                : "data-[state=on]:bg-green-500/10 data-[state=on]:text-green-600 data-[state=on]:border-green-500/20 data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground data-[state=off]:border-border"
            }`}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
