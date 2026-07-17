import { CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/currency/format";
import type { CommissionSummary } from "../types";

interface StaffDailySummaryProps {
  summary: CommissionSummary | null;
  isLoading: boolean;
}

export function StaffDailySummary({ summary, isLoading }: StaffDailySummaryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Walk-ins {summary.periodLabel.toLowerCase()}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{summary.walkInCount}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Revenue {summary.periodLabel.toLowerCase()}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {formatPrice(summary.totalRevenue, summary.currency)}
        </p>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
          Commission {summary.periodLabel.toLowerCase()}
        </p>
        <p className="mt-2 text-3xl font-bold text-emerald-800">
          {formatPrice(summary.totalCommission, summary.currency)}
        </p>
      </div>
    </div>
  );
}

export function StaffSuccessBanner({
  confirmationCode,
  onDismiss,
}: {
  confirmationCode: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-emerald-900">Booking confirmed</p>
        <p className="text-sm text-emerald-800">
          Reference <span className="font-mono font-bold">{confirmationCode}</span> — WhatsApp
          confirmation sent (mock).
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-sm font-medium text-emerald-700 hover:underline"
      >
        New walk-in
      </button>
    </div>
  );
}
