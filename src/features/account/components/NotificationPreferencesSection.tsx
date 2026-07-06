import type { NotificationPreferences } from "../types";

interface NotificationPreferencesSectionProps {
  preferences: NotificationPreferences;
  onChange: (patch: Partial<NotificationPreferences>) => void;
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 rounded-xl border border-border px-4 py-3 ${
        disabled ? "opacity-60" : "cursor-pointer"
      }`}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 accent-brand"
      />
    </label>
  );
}

export function NotificationPreferencesSection({
  preferences,
  onChange,
}: NotificationPreferencesSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control how we reach you — transactional messages may be required for active bookings
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">WhatsApp</h3>
        <div className="space-y-2">
          <ToggleRow
            label="Booking updates"
            description="Confirmations, reminders, and cancellation notices"
            checked={preferences.whatsappTransactional}
            disabled
            onChange={(v) => onChange({ whatsappTransactional: v })}
          />
          <ToggleRow
            label="Promotions & offers"
            description="Deals and travel tips via WhatsApp"
            checked={preferences.whatsappPromotional}
            onChange={(v) => onChange({ whatsappPromotional: v })}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Email</h3>
        <div className="space-y-2">
          <ToggleRow
            label="Booking updates"
            description="Receipts, itinerary changes, and account security"
            checked={preferences.emailTransactional}
            disabled
            onChange={(v) => onChange({ emailTransactional: v })}
          />
          <ToggleRow
            label="Newsletter & promotions"
            description="RestHalf news and partner offers"
            checked={preferences.emailPromotional}
            onChange={(v) => onChange({ emailPromotional: v })}
          />
        </div>
      </div>
    </section>
  );
}
