import { TwemojiEmoji } from "@/components/ui/twemoji-emoji"
import type { Category } from "@/features/dashboard/model/types"
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
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Category
      </label>
      <div className="relative">
        {selectedItem && (
          <div className="pointer-events-none absolute left-3 top-2.5 z-10">
            <TwemojiEmoji emoji={selectedItem.emoji} size={18} />
          </div>
        )}
        <select
          value={selectedCategory}
          onChange={(e) => onChange(e.target.value)}
          disabled={availableCategories.length === 0}
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none"
          style={{ paddingLeft: selectedItem ? "2.5rem" : "0.75rem" }}
        >
          {availableCategories.length === 0 ? (
            <option value="">No categories available</option>
          ) : (
            availableCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))
          )}
        </select>
      </div>

      {availableCategories.length === 0 && (
        <p className="mt-1 text-sm text-rose-600">
          No categories available for this type.
        </p>
      )}
      {errorMessage && <p className="mt-1 text-sm text-rose-600">{errorMessage}</p>}
    </div>
  )
}
