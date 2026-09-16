import { useLanguage } from "@/context/LanguageContext";
import { AuthLayout } from "../components/AuthLayout";
import { AuthTabs } from "../components/AuthTabs";
import { LoginForm } from "../components/LoginForm";
import { SocialAuthButtons } from "../components/SocialAuthButtons";

export function LoginPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout title={t("auth.welcome")} subtitle={t("auth.loginSubtitle")}>
      <AuthTabs active="login" />
      <SocialAuthButtons />
      <LoginForm />
    </AuthLayout>
  );
}
