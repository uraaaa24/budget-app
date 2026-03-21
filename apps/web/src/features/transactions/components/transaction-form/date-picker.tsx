import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

type DatePickerProps = {
  value: Date
  onChange: (date: Date | undefined) => void
  errorMessage?: string
}

export const DatePicker = ({ value, onChange, errorMessage }: DatePickerProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">日付</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-10 justify-start text-left font-normal text-base",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2.5 h-4 w-4" />
            {value ? format(value, "yyyy年M月d日") : <span>選択してください</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-lg" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className="rounded-lg"
          />
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
