import { Link } from "react-router-dom";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export function ForgotPasswordLink() {
  const { buildAuthPath } = useAuthRedirect();

  return (
    <div className="mt-1.5 text-right">
      <Link
        to={buildAuthPath("/forgot-password")}
        className="text-sm font-medium text-brand hover:underline"
      >
        Forgot password?
      </Link>
    </div>
  );
}
