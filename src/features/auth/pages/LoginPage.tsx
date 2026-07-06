import { AuthLayout } from "../components/AuthLayout";
import { AuthTabs } from "../components/AuthTabs";
import { LoginForm } from "../components/LoginForm";
import { SocialAuthButtons } from "../components/SocialAuthButtons";

export function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage bookings and finish checkout faster">
      <AuthTabs active="login" />
      <SocialAuthButtons />
      <LoginForm />
    </AuthLayout>
  );
}
