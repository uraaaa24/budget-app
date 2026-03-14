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
    <>
      <label className="mb-1 text-slate-700">{label}</label>
      <div className="mb-1">
        <input
          type={type}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      {errorMessage && <p className="mb-3 text-rose-600">{errorMessage}</p>}
    </>
  )
}
