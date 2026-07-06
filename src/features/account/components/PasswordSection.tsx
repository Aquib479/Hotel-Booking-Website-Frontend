import { useState } from "react";
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter";
import { cn } from "@/lib/utils";

interface PasswordSectionProps {
  hasPassword: boolean;
  isSaving: boolean;
  onSubmit: (current: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

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
    <section className="rounded-2xl border border-border bg-white p-5">
      <h2 className="text-lg font-semibold text-foreground">
        {hasPassword ? "Change password" : "Set a password"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasPassword
          ? "Update your password for email or phone login"
          : "You signed in with Google — add a password to log in without social auth"}
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-4">
        {hasPassword && (
          <div>
            <label className="mb-1.5 block text-sm font-medium">Current password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={newPassword} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Confirm new password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={cn(inputClass, confirm && newPassword !== confirm && "border-red-400")}
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">Password updated.</p>}
        <button
          type="submit"
          disabled={isSaving || !newPassword || newPassword !== confirm}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSaving ? "Saving…" : hasPassword ? "Update password" : "Set password"}
        </button>
      </form>
    </section>
  );
}
