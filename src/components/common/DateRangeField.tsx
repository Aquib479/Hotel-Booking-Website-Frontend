import { BookingDateRangeCalendar } from "@/components/common/BookingDateRangeCalendar";
import { cn } from "@/lib/utils";

interface DateRangeFieldProps {
  checkIn?: Date;
  checkOut?: Date;
  onChange: (range: { checkIn?: Date; checkOut?: Date }) => void;
  label?: string;
  className?: string;
  triggerClassName?: string;
}

export function DateRangeField({
  checkIn,
  checkOut,
  onChange,
  label = "Date",
  className,
  triggerClassName,
}: DateRangeFieldProps) {
  return (
    <BookingDateRangeCalendar
      checkIn={checkIn}
      checkOut={checkOut}
      onChange={onChange}
      label={label}
      className={cn(className)}
      triggerClassName={triggerClassName}
    />
  );
}
