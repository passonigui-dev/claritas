
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateFilterProps {
  onDateChange?: (from: Date | undefined, to: Date | undefined) => void;
}

export function DateFilter({ onDateChange }: DateFilterProps) {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [dateRange, setDateRange] = useState("last30Days");

  const handleRangeChange = (value: string) => {
    setDateRange(value);
    
    const now = new Date();
    let from: Date | undefined;
    
    switch (value) {
      case "today":
        from = now;
        break;
      case "yesterday":
        from = new Date(now.setDate(now.getDate() - 1));
        break;
      case "last7Days":
        from = new Date(now.setDate(now.getDate() - 7));
        break;
      case "last30Days":
        from = new Date(now.setDate(now.getDate() - 30));
        break;
      case "thisMonth":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "lastMonth":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        setDate({ from, to: lastDay });
        if (onDateChange) onDateChange(from, lastDay);
        return;
      case "custom":
        // Do nothing, wait for custom selection
        return;
    }
    
    const to = new Date();
    setDate({ from, to });
    if (onDateChange) onDateChange(from, to);
  };

  const formatDateRange = () => {
    if (!date.from) {
      return "Select date range";
    }
    
    if (!date.to) {
      return format(date.from, "PP", { locale: ptBR });
    }
    
    return `${format(date.from, "dd/MM/yy", { locale: ptBR })} - ${format(date.to, "dd/MM/yy", { locale: ptBR })}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <Select value={dateRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7Days">Last 7 days</SelectItem>
          <SelectItem value="last30Days">Last 30 days</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
          <SelectItem value="lastMonth">Last month</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>
      
      {dateRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDateRange()}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date.from}
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                if (onDateChange) onDateChange(selectedDate?.from, selectedDate?.to);
              }}
              numberOfMonths={2}
            />
            <div className="p-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <strong>From:</strong> {date.from ? format(date.from, "PP", { locale: ptBR }) : "Not set"}
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="text-sm">
                  <strong>To:</strong> {date.to ? format(date.to, "PP", { locale: ptBR }) : "Not set"}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
