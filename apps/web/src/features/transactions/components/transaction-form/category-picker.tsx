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
      availableCategories.find(
        (category) => category.name === selectedCategory,
      ),
    [availableCategories, selectedCategory],
  )

  return (
    <div className="space-y-3">
      <Label className="text-sm text-muted-foreground">カテゴリ</Label>
      <Select
        value={selectedCategory}
        onValueChange={onChange}
        disabled={availableCategories.length === 0}
      >
        <SelectTrigger className="w-full h-12 text-base rounded-lg">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent className="max-h-70">
          {availableCategories.length === 0 ? (
            <SelectItem value="__empty__" disabled>
              カテゴリがありません
            </SelectItem>
          ) : (
            availableCategories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.name}
                className="py-3"
              >
                <div className="flex items-center gap-3">
                  <TwemojiEmoji emoji={category.emoji} size={20} />
                  <span className="text-base">{category.name}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {availableCategories.length === 0 && (
        <p className="text-sm text-destructive">
          このタイプのカテゴリがありません
        </p>
      )}
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
