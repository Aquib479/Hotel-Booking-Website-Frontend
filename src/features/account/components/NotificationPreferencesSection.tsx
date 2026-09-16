import { ToggleField } from "@/components/common/ToggleField";
import { SectionCard } from "@/components/common/SectionCard";
import { useLanguage } from "@/context/LanguageContext";
import type { NotificationPreferences } from "../types";

interface NotificationPreferencesSectionProps {
  preferences: NotificationPreferences;
  onChange: (patch: Partial<NotificationPreferences>) => void;
}

export function NotificationPreferencesSection({
  preferences,
  onChange,
}: NotificationPreferencesSectionProps) {
  const { t } = useLanguage();

  return (
    <SectionCard
      title={t("account.section.notifications")}
      description={t("account.notifHint")}
    >
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t("account.whatsapp")}</h3>
          <div className="space-y-2">
            <ToggleField
              id="whatsapp-transactional"
              label={t("account.bookingUpdates")}
              description={t("account.whatsappBookingHint")}
              checked={preferences.whatsappTransactional}
              disabled
              onChange={(v) => onChange({ whatsappTransactional: v })}
            />
            <ToggleField
              id="whatsapp-promotional"
              label={t("account.promotions")}
              description={t("account.whatsappPromoHint")}
              checked={preferences.whatsappPromotional}
              onChange={(v) => onChange({ whatsappPromotional: v })}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">{t("account.emailChannel")}</h3>
          <div className="space-y-2">
            <ToggleField
              id="email-transactional"
              label={t("account.bookingUpdates")}
              description={t("account.emailBookingHint")}
              checked={preferences.emailTransactional}
              disabled
              onChange={(v) => onChange({ emailTransactional: v })}
            />
            <ToggleField
              id="email-promotional"
              label={t("account.newsletter")}
              description={t("account.newsletterHint")}
              checked={preferences.emailPromotional}
              onChange={(v) => onChange({ emailPromotional: v })}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
