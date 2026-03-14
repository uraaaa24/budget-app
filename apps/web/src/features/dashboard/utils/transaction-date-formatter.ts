type DateValue = string | number | Date

type TransactionDateFormatter = {
  formatGroupDate: (value: DateValue) => string
  formatTransactionDateTime: (value: string) => string
  formatRelativeDayLabel: (value: DateValue) => string | null
}

const formatterCache = new Map<string, TransactionDateFormatter>()

const normalizeToDay = (date: Date): Date => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

export const createTransactionDateFormatter = (
  locale: string,
): TransactionDateFormatter => {
  const cached = formatterCache.get(locale)
  if (cached) return cached

  const groupDateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })

  const transactionDateTimeFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const relativeDayFormatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  })

  const formatter: TransactionDateFormatter = {
    formatGroupDate: (value) => groupDateFormatter.format(new Date(value)),
    formatTransactionDateTime: (value) =>
      transactionDateTimeFormatter.format(new Date(value)),
    formatRelativeDayLabel: (value) => {
      const target = normalizeToDay(new Date(value))
      const today = normalizeToDay(new Date())
      const diffDays = Math.round(
        (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
      )

      if (Math.abs(diffDays) > 1) {
        return null
      }

      return relativeDayFormatter.format(diffDays, "day")
    },
  }

  formatterCache.set(locale, formatter)
  return formatter
}
