import { Link } from "react-router-dom";
import { AUTH_REDIRECT_PARAM } from "@/features/auth/constants";
import { SelectableCard } from "@/components/common/SelectableCard";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GuestCheckoutPromptProps {
  onContinueAsGuest: () => void;
}

export function GuestCheckoutPrompt({ onContinueAsGuest }: GuestCheckoutPromptProps) {
  const loginHref = `/login?${AUTH_REDIRECT_PARAM}=${encodeURIComponent("/checkout")}`;
  const signupHref = `/signup?${AUTH_REDIRECT_PARAM}=${encodeURIComponent("/checkout")}&fromBooking=1`;

  return (
    <SectionCard
      title="How would you like to continue?"
      description="Sign in to save your details, or check out as a guest — no account required."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectableCard selected onClick={onContinueAsGuest} className="border-2 border-brand">
          <span className="block text-sm font-semibold text-foreground">Continue as guest</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Enter your details on the next step
          </span>
        </SelectableCard>

        <Card className="border-2">
          <CardContent className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Log in or sign up</span>
            <span className="text-xs text-muted-foreground">
              Faster checkout and booking history
            </span>
            <div className="mt-auto flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={loginHref}>Log in</Link>
              </Button>
              <Button variant="brand" className="flex-1" asChild>
                <Link to={signupHref}>Sign up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionCard>
  );
}
