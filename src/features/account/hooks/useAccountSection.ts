import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ACCOUNT_SECTION_PARAM, ACCOUNT_SECTIONS, DEFAULT_ACCOUNT_SECTION } from "../constants";
import type { AccountSection } from "../types";

function parseSection(value: string | null): AccountSection {
  if (value === "payment" || value === "notifications" || value === "danger") return value;
  return DEFAULT_ACCOUNT_SECTION;
}

export function useAccountSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = useMemo(
    () => parseSection(searchParams.get(ACCOUNT_SECTION_PARAM)),
    [searchParams]
  );

  const setSection = useCallback(
    (next: AccountSection) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === DEFAULT_ACCOUNT_SECTION) params.delete(ACCOUNT_SECTION_PARAM);
          else params.set(ACCOUNT_SECTION_PARAM, next);
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return { section, setSection, sections: ACCOUNT_SECTIONS };
}
