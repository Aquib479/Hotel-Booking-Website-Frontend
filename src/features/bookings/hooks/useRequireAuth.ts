import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { AUTH_REDIRECT_PARAM } from "@/features/auth/constants";

export function useRequireAuth(redirectPath: string) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?${AUTH_REDIRECT_PARAM}=${encodeURIComponent(redirectPath)}`, {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  return { isAuthenticated };
}
