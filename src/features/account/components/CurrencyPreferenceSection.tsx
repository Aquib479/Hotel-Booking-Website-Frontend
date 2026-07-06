import { useCurrency } from "@/context/CurrencyContext";
import { CURRENCY_HELPER_TEXT } from "../constants";

export function CurrencyPreferenceSection() {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <section className="rounded-2xl border border-border bg-white p-5">
      <h2 className="text-lg font-semibold text-foreground">Display currency</h2>
      <p className="mt-1 text-sm text-muted-foreground">{CURRENCY_HELPER_TEXT}</p>

      <div className="mt-4">
        <label htmlFor="currency-select" className="mb-1.5 block text-sm font-medium">
          Preferred currency
        </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as typeof currency)}
          className="w-full max-w-xs rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.label} ({c.code})
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
