import { AuthLayout } from "../components/AuthLayout";
import { AuthTabs } from "../components/AuthTabs";
import { SignupForm } from "../components/SignupForm";
import { SocialAuthButtons } from "../components/SocialAuthButtons";

export function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Phone number required for WhatsApp booking updates">
      <AuthTabs active="signup" />
      <SocialAuthButtons />
      <SignupForm />
    </AuthLayout>
  );
}
