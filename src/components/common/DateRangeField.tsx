import { BookingDateRangeCalendar } from "@/components/common/BookingDateRangeCalendar";
import { useLanguage } from "@/context/LanguageContext";
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
  label,
  className,
  triggerClassName,
}: DateRangeFieldProps) {
  const { t } = useLanguage();

  return (
    <BookingDateRangeCalendar
      checkIn={checkIn}
      checkOut={checkOut}
      onChange={onChange}
      label={label ?? t("common.date")}
      className={cn(className)}
      triggerClassName={triggerClassName}
    />
  );
}
