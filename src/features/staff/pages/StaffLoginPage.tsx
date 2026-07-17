import { StaffLoginForm } from "../components/StaffLoginForm";

export function StaffLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-md">
        <StaffLoginForm />
      </div>
    </main>
  );
}
