import { useLanguage } from "@/context/LanguageContext";
import { AuthLayout } from "../components/AuthLayout";
import { AuthTabs } from "../components/AuthTabs";
import { SignupForm } from "../components/SignupForm";
import { SocialAuthButtons } from "../components/SocialAuthButtons";

export function SignupPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout title={t("auth.create")} subtitle={t("auth.signupSubtitle")}>
      <AuthTabs active="signup" />
      <SocialAuthButtons />
      <SignupForm />
    </AuthLayout>
  );
}
