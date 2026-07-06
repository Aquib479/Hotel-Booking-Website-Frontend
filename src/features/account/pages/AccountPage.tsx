import { useRequireAuth } from "@/features/bookings/hooks/useRequireAuth";
import { AccountLayout } from "../components/AccountLayout";
import { ProfileInfoSection } from "../components/ProfileInfoSection";
import { PhoneNumberSection } from "../components/PhoneNumberSection";
import { CurrencyPreferenceSection } from "../components/CurrencyPreferenceSection";
import { PasswordSection } from "../components/PasswordSection";
import { SavedPaymentMethodsSection } from "../components/SavedPaymentMethodsSection";
import { NotificationPreferencesSection } from "../components/NotificationPreferencesSection";
import { DeleteAccountSection } from "../components/DeleteAccountSection";
import { useAccountSection } from "../hooks/useAccountSection";
import { useProfile } from "../hooks/useProfile";
import { usePaymentMethods } from "../hooks/usePaymentMethods";

export function AccountPage() {
  const { isAuthenticated } = useRequireAuth("/account");
  const { section } = useAccountSection();
  const profileHook = useProfile();
  const paymentMethods = usePaymentMethods();

  if (!isAuthenticated || !profileHook.profile) return null;

  const { profile } = profileHook;

  return (
    <AccountLayout>
      {section === "profile" && (
        <div className="space-y-6">
          <ProfileInfoSection
            profile={profile}
            isSaving={profileHook.isSaving}
            onSaveName={(name) => profileHook.updateField("fullName", name)}
            onSaveEmail={(email) => profileHook.updateField("email", email)}
          />
          <PhoneNumberSection
            profile={profile}
            onStartChange={profileHook.startPhoneChange}
            onConfirmChange={profileHook.confirmPhoneChange}
            onCancelChange={profileHook.cancelPhoneChange}
          />
          <CurrencyPreferenceSection />
          <PasswordSection
            hasPassword={profile.hasPassword}
            isSaving={profileHook.isSaving}
            onSubmit={profileHook.changePassword}
          />
        </div>
      )}

      {section === "payment" && (
        <SavedPaymentMethodsSection
          methods={paymentMethods.methods}
          isLoading={paymentMethods.isLoading}
          onAdd={paymentMethods.addMethod}
          onRemove={paymentMethods.removeMethod}
          onSetDefault={paymentMethods.setDefault}
        />
      )}

      {section === "notifications" && (
        <NotificationPreferencesSection
          preferences={profile.notifications}
          onChange={profileHook.updateNotifications}
        />
      )}

      {section === "danger" && (
        <DeleteAccountSection
          isDeleting={profileHook.isSaving}
          onDelete={profileHook.deleteAccount}
        />
      )}

      {profileHook.error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {profileHook.error}
        </p>
      )}
    </AccountLayout>
  );
}
