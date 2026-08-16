import type { ReactNode } from "react";
import { AccountMenuNav } from "./AccountMenuNav";
import { useAccountSection } from "../hooks/useAccountSection";

interface AccountLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AccountLayout({
  children,
  title = "Account settings",
  description = "Manage your profile, preferences, and RestHalf account",
}: AccountLayoutProps) {
  const { section, setSection } = useAccountSection();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="overflow-x-auto lg:overflow-visible">
          <AccountMenuNav activeSection={section} onSectionChange={setSection} />
        </aside>
        <div className="mt-6 min-w-0 lg:mt-0">{children}</div>
      </div>
    </div>
  );
}
