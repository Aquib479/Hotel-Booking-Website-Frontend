import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { AccountSection } from "../types";

interface AccountNavTabsProps {
  active: AccountSection;
  sections: { id: AccountSection; label: string }[];
  onChange: (section: AccountSection) => void;
}

export function AccountNavTabs({ active, sections, onChange }: AccountNavTabsProps) {
  return (
    <nav aria-label="Account sections">
      <ul className="flex gap-1 overflow-x-auto border-b border-border lg:flex-col lg:gap-0 lg:border-0">
        <li className="shrink-0 lg:shrink">
          <Link
            to="/bookings"
            className={cn(
              "block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors",
              "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            My Bookings
          </Link>
        </li>
        {sections.map((item) => (
          <li key={item.id} className="shrink-0 lg:shrink">
            <button
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors",
                active === item.id
                  ? "bg-brand/10 text-brand lg:bg-muted"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                item.id === "danger" && active !== item.id && "text-red-600/80"
              )}
              aria-current={active === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
