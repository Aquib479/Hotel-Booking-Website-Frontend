import { useState } from "react";
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter";
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
      setError("Passwords don't match");
      return;
    }
    const result = await onSubmit(current, newPassword);
    if (result.success) {
      setSuccess(true);
      setCurrent("");
      setNewPassword("");
      setConfirm("");
    } else {
      setError(result.error ?? "Couldn't update password");
    }
  };

  return (
    <SectionCard
      title={hasPassword ? "Change password" : "Set a password"}
      description={
        hasPassword
          ? "Update your password for email or phone login"
          : "You signed in with Google — add a password to log in without social auth"
      }
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        {hasPassword && (
          <FormField label="Current password" htmlFor="current-password">
            <Input
              id="current-password"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
            />
          </FormField>
        )}
        <FormField label="New password" htmlFor="new-password">
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
          label="Confirm new password"
          htmlFor="confirm-password"
          error={confirm && newPassword !== confirm ? "Passwords don't match" : undefined}
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
          <FormAlert variant="success" title="Password updated" message="Your password has been saved." />
        )}
        <Button
          type="submit"
          variant="brand"
          disabled={isSaving || !newPassword || newPassword !== confirm}
        >
          {isSaving ? "Saving…" : hasPassword ? "Update password" : "Set password"}
        </Button>
      </form>
    </SectionCard>
  );
}
