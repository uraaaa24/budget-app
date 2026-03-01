import type { TransactionType } from "@/features/dashboard/model/types"
import { Pressable, Text, View } from "react-native"

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
      <Text className="mb-1 text-slate-700">Type</Text>
      <View className="mb-3 flex-row gap-2">
        {typeOptions.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`h-12 flex-1 items-center justify-center rounded-xl px-3 ${
              selectedType === option.value ? "bg-slate-900" : "bg-slate-100"
            }`}
          >
            <Text
              className={
                selectedType === option.value
                  ? "font-semibold text-white"
                  : "text-slate-700"
              }
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  )
}
