import { createContext, useContext, useState, type ReactNode } from "react"

interface MonthContextType {
  selectedYear: number
  selectedMonth: number
  setSelectedYear: (year: number) => void
  setSelectedMonth: (month: number) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  isCurrentMonth: boolean
}

const MonthContext = createContext<MonthContextType | undefined>(undefined)

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const isCurrentMonth =
    selectedYear === now.getFullYear() && selectedMonth === now.getMonth()

  return (
    <MonthContext.Provider
      value={{
        selectedYear,
        selectedMonth,
        setSelectedYear,
        setSelectedMonth,
        goToPreviousMonth,
        goToNextMonth,
        isCurrentMonth,
      }}
    >
      {children}
    </MonthContext.Provider>
  )
}

export const useMonth = () => {
  const context = useContext(MonthContext)
  if (context === undefined) {
    throw new Error("useMonth must be used within a MonthProvider")
  }
  return context
}
