import { useMonth } from "@/contexts/month-context"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

/**
 * MonthSelect component allows users to navigate between months and displays the currently selected month and year. It uses the useMonth hook to manage month navigation and state.
 */
const MonthSelect = () => {
  const {
    selectedYear,
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    isCurrentMonth,
  } = useMonth()

  return (
    <section className="flex items-center justify-between">
      <button
        onClick={goToPreviousMonth}
        className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center gap-1"
      >
        <ArrowLeft className="size-4" />
        <span>前月</span>
      </button>

      <p className="text-xl font-bold hover:text-muted-foreground transition-colors px-4 py-2">
        {selectedYear}.{String(selectedMonth + 1).padStart(2, "0")}
      </p>

      <button
        onClick={goToNextMonth}
        disabled={isCurrentMonth}
        className={cn(
          "text-sm font-semibold text-muted-foreground hover:text-foreground transition-opacity px-2 py-1 flex items-center gap-1 disabled:cursor-not-allowed disabled:hover:text-muted-foreground",
          isCurrentMonth && "opacity-0 pointer-events-none",
        )}
      >
        <span>次月</span>
        <ArrowLeft className="size-4 rotate-180" />
      </button>
    </section>
  )
}

export default MonthSelect
