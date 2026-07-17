import { ToggleField } from "@/components/common/ToggleField";
import { SectionCard } from "@/components/common/SectionCard";
import type { NotificationPreferences } from "../types";

interface NotificationPreferencesSectionProps {
  preferences: NotificationPreferences;
  onChange: (patch: Partial<NotificationPreferences>) => void;
}

export function NotificationPreferencesSection({
  preferences,
  onChange,
}: NotificationPreferencesSectionProps) {
  return (
    <SectionCard
      title="Notifications"
      description="Control how we reach you — transactional messages may be required for active bookings"
    >
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold">WhatsApp</h3>
          <div className="space-y-2">
            <ToggleField
              id="whatsapp-transactional"
              label="Booking updates"
              description="Confirmations, reminders, and cancellation notices"
              checked={preferences.whatsappTransactional}
              disabled
              onChange={(v) => onChange({ whatsappTransactional: v })}
            />
            <ToggleField
              id="whatsapp-promotional"
              label="Promotions & offers"
              description="Deals and travel tips via WhatsApp"
              checked={preferences.whatsappPromotional}
              onChange={(v) => onChange({ whatsappPromotional: v })}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Email</h3>
          <div className="space-y-2">
            <ToggleField
              id="email-transactional"
              label="Booking updates"
              description="Receipts, itinerary changes, and account security"
              checked={preferences.emailTransactional}
              disabled
              onChange={(v) => onChange({ emailTransactional: v })}
            />
            <ToggleField
              id="email-promotional"
              label="Newsletter & promotions"
              description="RestHalf news and partner offers"
              checked={preferences.emailPromotional}
              onChange={(v) => onChange({ emailPromotional: v })}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
