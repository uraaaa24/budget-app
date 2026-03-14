type TextInputFieldProps = {
  label: string
  value: string
  onChangeText: (value: string) => void
  onBlur: () => void
  placeholder: string
  type?: string
  errorMessage?: string
}

export const TextInputField = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  type = "text",
  errorMessage,
}: TextInputFieldProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none"
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-rose-600">{errorMessage}</p>
      )}
    </div>
  )
}
