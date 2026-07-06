import { Link } from "react-router-dom";
import { AUTH_REDIRECT_PARAM } from "@/features/auth/constants";

interface GuestCheckoutPromptProps {
  onContinueAsGuest: () => void;
}

export function GuestCheckoutPrompt({ onContinueAsGuest }: GuestCheckoutPromptProps) {
  const loginHref = `/login?${AUTH_REDIRECT_PARAM}=${encodeURIComponent("/checkout")}`;
  const signupHref = `/signup?${AUTH_REDIRECT_PARAM}=${encodeURIComponent("/checkout")}&fromBooking=1`;

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">How would you like to continue?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to save your details, or check out as a guest — no account required.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="rounded-xl border-2 border-brand bg-brand/5 px-4 py-4 text-left transition-colors hover:bg-brand/10"
        >
          <span className="block text-sm font-semibold text-foreground">Continue as guest</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Enter your details on the next step
          </span>
        </button>

        <div className="flex flex-col gap-2 rounded-xl border-2 border-border px-4 py-4">
          <span className="text-sm font-semibold text-foreground">Log in or sign up</span>
          <span className="text-xs text-muted-foreground">
            Faster checkout and booking history
          </span>
          <div className="mt-auto flex gap-2 pt-2">
            <Link
              to={loginHref}
              className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-medium hover:bg-muted/50"
            >
              Log in
            </Link>
            <Link
              to={signupHref}
              className="flex-1 rounded-lg bg-brand py-2 text-center text-sm font-medium text-white hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
