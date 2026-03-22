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
  const today = new Date()

  return (
    <div className="space-y-3">
      <Label className="text-sm text-muted-foreground">日付</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-12 justify-start text-left font-normal text-base rounded-lg",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-4 w-4" />
            {value ? format(value, "yyyy年M月d日") : <span>選択してください</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className="rounded-lg"
            disabled={(date) => date > today}
            toDate={today}
          />
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
