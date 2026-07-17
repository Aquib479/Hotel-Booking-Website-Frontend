import { useStaffAuth } from "../hooks/useStaffAuth";
import { useCommissionSummary } from "../hooks/useCommissionSummary";
import { StaffDailySummary } from "../components/StaffDailySummary";
import { RecentWalkInsList } from "../components/RecentWalkInsList";

export function StaffDashboardPage() {
  const { staff } = useStaffAuth();
  const { summary, recentWalkIns, isLoading } = useCommissionSummary();

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Today&apos;s summary</h1>
        <p className="mt-1 text-sm text-slate-500">
          {staff?.displayName} · {staff?.property.propertyName}
        </p>
      </header>

      <StaffDailySummary summary={summary} isLoading={isLoading} />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Recent walk-ins</h2>
        <RecentWalkInsList walkIns={recentWalkIns} isLoading={isLoading} />
      </section>
    </main>
  );
}
