import { SearchInput } from "@/components/common/SearchInput";

interface FaqSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FaqSearchBar({ value, onChange, className }: FaqSearchBarProps) {
  return (
    <SearchInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Try "half-day", "cancel", or "WhatsApp"...'
      aria-label="Search FAQ"
      containerClassName={className}
    />
  );
}
