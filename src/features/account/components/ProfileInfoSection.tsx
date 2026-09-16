import { useState } from "react";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/context/LanguageContext";
import type { UserProfile } from "../types";

interface ProfileInfoSectionProps {
  profile: UserProfile;
  isSaving: boolean;
  onSaveName: (name: string) => Promise<void>;
  onSaveEmail: (email: string) => Promise<void>;
}

export function ProfileInfoSection({
  profile,
  isSaving,
  onSaveName,
  onSaveEmail,
}: ProfileInfoSectionProps) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [nameDirty, setNameDirty] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);

  return (
    <SectionCard title={t("account.profileTitle")} description={t("account.profileHint")}>
      <div className="space-y-4">
        <FormField label={t("auth.fullName")} htmlFor="profile-name">
          <Input
            id="profile-name"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setNameDirty(true);
            }}
          />
          {nameDirty && (
            <Button
              type="button"
              variant="link"
              className="mt-2 h-auto p-0 text-brand"
              disabled={isSaving || fullName.trim() === profile.fullName}
              onClick={() => void onSaveName(fullName).then(() => setNameDirty(false))}
            >
              {isSaving ? t("common.saving") : t("account.saveName")}
            </Button>
          )}
        </FormField>

        <FormField label={t("account.email")} htmlFor="profile-email">
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailDirty(true);
            }}
          />
          {profile.pendingEmail && (
            <Alert className="mt-2 border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-800">
                {t("account.emailPending", { email: profile.pendingEmail })}
              </AlertDescription>
            </Alert>
          )}
          {emailDirty && (
            <Button
              type="button"
              variant="link"
              className="mt-2 h-auto p-0 text-brand"
              disabled={isSaving || email.trim() === profile.email}
              onClick={() => void onSaveEmail(email).then(() => setEmailDirty(false))}
            >
              {isSaving ? t("common.sending") : t("account.saveEmail")}
            </Button>
          )}
        </FormField>
      </div>
    </SectionCard>
  );
}
