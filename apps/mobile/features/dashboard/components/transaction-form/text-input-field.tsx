import type { KeyboardTypeOptions, TextStyle } from "react-native"
import { Platform, Text, TextInput, View } from "react-native"

type TextInputFieldProps = {
  label: string
  value: string
  onChangeText: (value: string) => void
  onBlur: () => void
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  errorMessage?: string
}

export const TextInputField = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType,
  errorMessage,
}: TextInputFieldProps) => {
  const webInputStyle: TextStyle | undefined =
    Platform.OS === "web"
      ? { outlineWidth: 0, outlineColor: "transparent", borderWidth: 0 }
      : undefined

  return (
    <>
      <Text className="mb-1 text-slate-700">{label}</Text>
      <View className="mb-1 h-12 justify-center rounded-xl border border-slate-200 bg-slate-50 px-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          placeholder={placeholder}
          className="p-0 text-slate-900"
          placeholderTextColor="#64748b"
          style={webInputStyle}
        />
      </View>
      {errorMessage ? <Text className="mb-3 text-rose-600">{errorMessage}</Text> : null}
    </>
  )
}
