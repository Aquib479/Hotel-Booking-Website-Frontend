import type { ReactNode } from "react";
import { AccountNavTabs } from "./AccountNavTabs";
import { useAccountSection } from "../hooks/useAccountSection";

interface AccountLayoutProps {
  children: ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const { section, setSection, sections } = useAccountSection();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Account settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, bookings, preferences, and payment methods
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        <AccountNavTabs active={section} sections={sections} onChange={setSection} />
        <div className="mt-6 min-w-0 lg:mt-0">{children}</div>
      </div>
    </div>
  );
}
