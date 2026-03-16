import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TwemojiEmoji } from "@/components/ui/twemoji-emoji"
import type { Category } from "@/features/transactions/model/types"
import { useMemo } from "react"

type CategoryPickerProps = {
  selectedCategory: string
  availableCategories: Category[]
  onChange: (value: string) => void
  errorMessage?: string
}

export const CategoryPicker = ({
  selectedCategory,
  availableCategories,
  onChange,
  errorMessage,
}: CategoryPickerProps) => {
  const selectedItem = useMemo(
    () =>
      availableCategories.find((category) => category.name === selectedCategory),
    [availableCategories, selectedCategory]
  )

  return (
    <div className="space-y-2">
      <Label>Category</Label>
      <Select
        value={selectedCategory}
        onValueChange={onChange}
        disabled={availableCategories.length === 0}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            {selectedItem && (
              <TwemojiEmoji emoji={selectedItem.emoji} size={18} />
            )}
            <SelectValue placeholder="Select a category" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableCategories.length === 0 ? (
            <SelectItem value="__empty__" disabled>
              No categories available
            </SelectItem>
          ) : (
            availableCategories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                <div className="flex items-center gap-2">
                  <TwemojiEmoji emoji={category.emoji} size={18} />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {availableCategories.length === 0 && (
        <p className="text-sm text-destructive">
          No categories available for this type.
        </p>
      )}
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
