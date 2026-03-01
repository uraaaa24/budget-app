import type { Category } from "@/features/dashboard/model/types"
import { Picker } from "@react-native-picker/picker"
import { Platform, Text, View } from "react-native"

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
  return (
    <>
      <Text className="mb-1 text-slate-700">Category</Text>
      <View className="mb-1 h-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 px-1">
        <Picker
          mode={Platform.OS === "android" ? "dropdown" : undefined}
          selectedValue={selectedCategory}
          enabled={availableCategories.length > 0}
          dropdownIconColor="#334155"
          style={[
            { color: "#0f172a", height: 48 },
            Platform.OS === "web"
              ? ({
                  outlineStyle: "none",
                  outlineWidth: 0,
                  outlineColor: "transparent",
                  borderWidth: 0,
                  backgroundColor: "transparent",
                  boxShadow: "none",
                } as const as any)
              : null,
          ]}
          onValueChange={(value) => onChange(String(value))}
        >
          {availableCategories.length === 0 ? (
            <Picker.Item label="No categories available" value="" />
          ) : (
            availableCategories.map((category) => (
              <Picker.Item
                key={category.id}
                label={`${category.emoji} ${category.name}`}
                value={category.name}
              />
            ))
          )}
        </Picker>
      </View>
      {availableCategories.length === 0 ? (
        <Text className="mb-3 text-rose-600">
          No categories available for this type.
        </Text>
      ) : null}
      {errorMessage ? (
        <Text className="mb-3 text-rose-600">{errorMessage}</Text>
      ) : null}
    </>
  )
}
