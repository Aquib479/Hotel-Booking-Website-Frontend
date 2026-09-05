import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export function ForgotPasswordLink() {
  const { t } = useLanguage();
  const { buildAuthPath } = useAuthRedirect();

  return (
    <div className="mt-1.5 text-right">
      <Link
        to={buildAuthPath("/forgot-password")}
        className="text-sm font-medium text-brand hover:underline"
      >
        {t("auth.forgot")}
      </Link>
    </div>
  );
}
