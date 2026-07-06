import { useState } from "react";
import type { UserProfile } from "../types";

interface ProfileInfoSectionProps {
  profile: UserProfile;
  isSaving: boolean;
  onSaveName: (name: string) => Promise<void>;
  onSaveEmail: (email: string) => Promise<void>;
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function ProfileInfoSection({
  profile,
  isSaving,
  onSaveName,
  onSaveEmail,
}: ProfileInfoSectionProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [nameDirty, setNameDirty] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-white p-5">
      <h2 className="text-lg font-semibold text-foreground">Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your name and contact email</p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setNameDirty(true);
            }}
            className={inputClass}
          />
          {nameDirty && (
            <button
              type="button"
              disabled={isSaving || fullName.trim() === profile.fullName}
              onClick={() => {
                void onSaveName(fullName).then(() => setNameDirty(false));
              }}
              className="mt-2 text-sm font-medium text-brand disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save name"}
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailDirty(true);
            }}
            className={inputClass}
          />
          {profile.pendingEmail && (
            <p className="mt-1.5 text-xs text-amber-700">
              Confirmation sent to {profile.pendingEmail}. Your email won&apos;t change until you
              confirm.
            </p>
          )}
          {emailDirty && (
            <button
              type="button"
              disabled={isSaving || email.trim() === profile.email}
              onClick={() => {
                void onSaveEmail(email).then(() => setEmailDirty(false));
              }}
              className="mt-2 text-sm font-medium text-brand disabled:opacity-50"
            >
              {isSaving ? "Sending…" : "Save email"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
