import { useState } from "react";
import { Coins } from "lucide-react";
import { useRequireAuth } from "@/features/bookings/hooks/useRequireAuth";
import { useLanguage } from "@/context/LanguageContext";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { AccountLayout } from "../components/AccountLayout";
import {
  COINS_DEMO_BALANCE,
  COINS_DEMO_PENDING,
  COINS_HISTORY,
  REDEEM_OPTIONS,
} from "../constants/rewards";

export function CoinsPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useRequireAuth("/coins");
  const [balance, setBalance] = useState(COINS_DEMO_BALANCE);
  const [redeemedId, setRedeemedId] = useState<string | null>(null);

  if (!isAuthenticated) return null;

  return (
    <AccountLayout
      title={t("account.coinsTitle")}
      description={t("account.coinsHint")}
    >
      <div className="space-y-6">
        <SectionCard title={t("account.coinsBalance")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <Coins className="size-7 text-brand" aria-hidden />
                {balance.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("account.coinsPending", { n: COINS_DEMO_PENDING.toLocaleString() })}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("account.coinsRedeem")} description={t("account.coinsRedeemHint")}>
          <ul className="space-y-3">
            {REDEEM_OPTIONS.map((opt) => {
              const canAfford = balance >= opt.cost;
              const justRedeemed = redeemedId === opt.id;
              return (
                <li
                  key={opt.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{t(`account.coins.redeem.${opt.id}`)}</p>
                    <p className="text-xs text-muted-foreground">{t("account.coinsCost", { n: opt.cost.toLocaleString() })}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-lg"
                    disabled={!canAfford || justRedeemed}
                    onClick={() => {
                      setBalance((b) => b - opt.cost);
                      setRedeemedId(opt.id);
                    }}
                  >
                    {justRedeemed ? t("account.redeemed") : t("account.redeem")}
                  </Button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard title={t("account.coinsActivity")}>
          <ul className="divide-y divide-border">
            {COINS_HISTORY.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm text-foreground">{t(`account.coins.history.${row.id}`)}</p>
                  <p className="text-xs text-muted-foreground">{row.date}</p>
                </div>
                <p
                  className={
                    row.amount >= 0
                      ? "text-sm font-semibold text-emerald-600"
                      : "text-sm font-semibold text-foreground"
                  }
                >
                  {row.amount >= 0 ? "+" : ""}
                  {row.amount.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AccountLayout>
  );
}
