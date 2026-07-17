import { getSlotWindowLabel } from "@/features/checkout/constants";
import { formatPrice } from "@/lib/currency/format";
import type { WalkInRecord } from "../types";

interface RecentWalkInsListProps {
  walkIns: WalkInRecord[];
  isLoading: boolean;
}

export function RecentWalkInsList({ walkIns, isLoading }: RecentWalkInsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    );
  }

  if (walkIns.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No walk-in bookings yet today. Completed bookings appear here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {walkIns.map((w) => (
        <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="font-medium text-slate-900">{w.guestName}</p>
            <p className="text-xs text-slate-500">
              Room {w.roomNumber} · {getSlotWindowLabel(w.slot)} ·{" "}
              <span className="font-mono">{w.confirmationCode}</span>
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-900">
              {formatPrice(w.amount, w.currency)}
            </p>
            <p className="text-xs text-emerald-700">
              +{formatPrice(w.commissionAmount, w.currency)} commission
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
