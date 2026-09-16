import { SearchInput } from "@/components/common/SearchInput";
import { useLanguage } from "@/context/LanguageContext";

interface FaqSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FaqSearchBar({ value, onChange, className }: FaqSearchBarProps) {
  const { t } = useLanguage();

  return (
    <SearchInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("support.faqPlaceholder")}
      aria-label={t("support.searchFaq")}
      containerClassName={className}
    />
  );
}
