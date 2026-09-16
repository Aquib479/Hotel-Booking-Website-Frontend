import { cn } from "@/lib/utils";
import type { CardPaymentValues } from "../types";
import { detectCardBrand } from "../hooks/usePaymentForms";
import { useLanguage } from "@/context/LanguageContext";

interface PaymentCardPreviewProps {
  values: CardPaymentValues;
  flipped?: boolean;
  className?: string;
}

const BRAND_LABEL: Record<ReturnType<typeof detectCardBrand>, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
  rupay: "RuPay",
  jcb: "JCB",
  unknown: "CARD",
};

function displayNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  if (!digits) return "•••• •••• •••• ••••";
  const padded = digits.padEnd(16, "•").slice(0, 16);
  return padded.replace(/(.{4})/g, "$1 ").trim();
}

export function PaymentCardPreview({ values, flipped = false, className }: PaymentCardPreviewProps) {
  const { t } = useLanguage();
  const brand = detectCardBrand(values.cardNumber);
  const name = values.holderName.trim().toUpperCase() || t("checkout.yourName");
  const expiry = values.expiry || "MM/YY";

  return (
    <div className={cn("perspective-[1200px]", className)}>
      <div
        className={cn(
          "relative h-[200px] w-full max-w-[340px] transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-2xl p-5 text-white shadow-xl",
            "bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_42%,#4c1d95_100%)]",
            "[backface-visibility:hidden]"
          )}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-brand/40 blur-3xl"
            aria-hidden
          />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 shadow-sm" />
              <span className="text-xs font-semibold tracking-[0.2em] text-white/80">
                {BRAND_LABEL[brand]}
              </span>
            </div>

            <p className="font-mono text-lg tracking-[0.18em] drop-shadow-sm sm:text-xl">
              {displayNumber(values.cardNumber)}
            </p>

            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-white/55">{t("checkout.cardHolderShort")}</p>
                <p className="truncate text-sm font-semibold tracking-wide">{name}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/55">{t("checkout.expires")}</p>
                <p className="font-mono text-sm font-semibold">{expiry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-2xl shadow-xl",
            "bg-[linear-gradient(135deg,#111827_0%,#312e81_100%)]",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]"
          )}
        >
          <div className="mt-6 h-10 w-full bg-black/70" />
          <div className="mt-6 px-5">
            <div className="flex items-center justify-end gap-2 rounded-md bg-white/90 px-3 py-2">
              <span className="mr-auto text-[10px] uppercase tracking-wider text-slate-500">
                CVV
              </span>
              <span className="font-mono text-base font-bold tracking-widest text-slate-900">
                {values.cvv ? values.cvv.replace(/\d/g, "•") : "•••"}
              </span>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-white/65">
              {t("checkout.cvvNeverStored")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
