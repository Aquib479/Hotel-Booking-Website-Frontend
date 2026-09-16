import { SearchInput } from "@/components/common/SearchInput";
import { useLanguage } from "@/context/LanguageContext";

interface BookingsSearchAndFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function BookingsSearchAndFilter({
  search,
  onSearchChange,
}: BookingsSearchAndFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("bookings.search")}
        aria-label={t("bookings.searchAria")}
        containerClassName="max-w-md flex-1"
      />
    </div>
  );
}
