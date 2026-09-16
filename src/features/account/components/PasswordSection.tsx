import { useState } from "react";
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter";
import { useLanguage } from "@/context/LanguageContext";
import { FormAlert, FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordSectionProps {
  hasPassword: boolean;
  isSaving: boolean;
  onSubmit: (current: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export function PasswordSection({ hasPassword, isSaving, onSubmit }: PasswordSectionProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirm) {
      setError(t("account.passwordMismatch"));
      return;
    }
    const result = await onSubmit(current, newPassword);
    if (result.success) {
      setSuccess(true);
      setCurrent("");
      setNewPassword("");
      setConfirm("");
    } else {
      setError(
        result.error === "Password must be at least 8 characters"
          ? t("auth.err.passwordMin")
          : t("account.passwordUpdateFail")
      );
    }
  };

  return (
    <SectionCard
      title={hasPassword ? t("account.changePassword") : t("account.setPassword")}
      description={
        hasPassword ? t("account.changePasswordHint") : t("account.setPasswordHint")
      }
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        {hasPassword && (
          <FormField label={t("account.currentPassword")} htmlFor="current-password">
            <Input
              id="current-password"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
            />
          </FormField>
        )}
        <FormField label={t("account.newPassword")} htmlFor="new-password">
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={newPassword} />
        </FormField>
        <FormField
          label={t("account.confirmPassword")}
          htmlFor="confirm-password"
          error={confirm && newPassword !== confirm ? t("account.passwordMismatch") : undefined}
        >
          <Input
            id="confirm-password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!(confirm && newPassword !== confirm)}
          />
        </FormField>
        {error && <FormAlert message={error} />}
        {success && (
          <FormAlert
            variant="success"
            title={t("account.passwordUpdated")}
            message={t("account.passwordUpdatedHint")}
          />
        )}
        <Button
          type="submit"
          variant="brand"
          disabled={isSaving || !newPassword || newPassword !== confirm}
        >
          {isSaving
            ? t("common.saving")
            : hasPassword
              ? t("account.updatePassword")
              : t("account.setPasswordBtn")}
        </Button>
      </form>
    </SectionCard>
  );
}
