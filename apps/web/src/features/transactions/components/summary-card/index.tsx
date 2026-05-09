import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"

type SummaryCardProps = {
  type: "income" | "expense"
  amount: number
}

type SummaryStyle = {
  bgColor: string
  textColor: string
  Icon: LucideIcon
  label: string
}

const SummaryCard = ({ type, amount }: SummaryCardProps) => {
  const getSummaryCardStyle = (type: "income" | "expense"): SummaryStyle => {
    switch (type) {
      case "income":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          Icon: ArrowUpRight,
          label: "Income",
        }
      case "expense":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          Icon: ArrowDownRight,
          label: "Expense",
        }
    }
  }
  const { bgColor, textColor, Icon, label } = getSummaryCardStyle(type)

  return (
    <div className="flex flex-col gap-2 items-center mx-auto">
      <div className={`flex items-center gap-2`}>
        <span
          className={`flex rounded-full items-center justify-center h-6 w-6 shrink-0 ${bgColor} ${textColor}`}
        >
          <Icon size={16} className={`mx-auto ${textColor}`} />
        </span>
        <p className={`text-sm tabular-nums ${textColor}`}>{label}</p>
      </div>

      <p className={`text-2xl font-semibold tabular-nums text-center`}>
        {amount.toLocaleString()}
      </p>
    </div>
  )
}

export default SummaryCard
