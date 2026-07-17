import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { FormAlert, FormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStaffAuth } from "../hooks/useStaffAuth";
import { STAFF_WALK_IN_PATH, MOCK_STAFF_CREDENTIALS } from "../constants";

export function StaffLoginForm() {
  const { login, isLoading } = useStaffAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      navigate(STAFF_WALK_IN_PATH, { replace: true });
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff sign in</CardTitle>
        <CardDescription>Front-desk terminal · Direct walk-in bookings only</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <FormField label="Staff email" htmlFor="staff-email" required>
            <Input
              id="staff-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Password" htmlFor="staff-password" required>
            <Input
              id="staff-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          {error && <FormAlert message={error} />}

          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign in to desk terminal"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Demo: {MOCK_STAFF_CREDENTIALS.email} / {MOCK_STAFF_CREDENTIALS.password}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
