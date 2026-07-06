import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_STORAGE_KEY } from "../constants";
import type { AuthResult, AuthUser, SignupResult } from "../types";
import { login as apiLogin, signup as apiSignup, verifyOtp as apiVerifyOtp } from "../api";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  signup: (
    data: Omit<AuthUser, "id" | "phoneVerified" | "createdAt"> & { password: string }
  ) => Promise<SignupResult>;
  verifyPhone: (code: string) => Promise<boolean>;
  skipPhoneVerification: () => void;
  completeSocialSignIn: (user: AuthUser, needsPhoneVerification: boolean) => void;
  logout: () => void;
  pendingPhoneVerification: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhoneVerification, setPendingPhoneVerification] = useState(false);

  useEffect(() => {
    persistUser(user);
  }, [user]);

  const login = useCallback(
    async (identifier: string, password: string, rememberMe = false): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await apiLogin({ identifier, password, rememberMe });
        if (result.success) {
          setUser(result.user);
          setPendingPhoneVerification(Boolean(result.needsPhoneVerification));
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (
      data: Omit<AuthUser, "id" | "phoneVerified" | "createdAt"> & { password: string }
    ): Promise<SignupResult> => {
      setIsLoading(true);
      try {
        const result = await apiSignup(data);
        if (result.success) {
          setUser(result.user);
          setPendingPhoneVerification(result.needsPhoneVerification);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyPhone = useCallback(async (code: string): Promise<boolean> => {
    if (!user) return false;
    const ok = await apiVerifyOtp(user.phoneE164, code);
    if (ok) {
      setUser((prev) => (prev ? { ...prev, phoneVerified: true } : prev));
      setPendingPhoneVerification(false);
    }
    return ok;
  }, [user]);

  const skipPhoneVerification = useCallback(() => {
    setPendingPhoneVerification(false);
  }, []);

  const completeSocialSignIn = useCallback((nextUser: AuthUser, needsPhoneVerification: boolean) => {
    setUser(nextUser);
    setPendingPhoneVerification(needsPhoneVerification);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPendingPhoneVerification(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      signup,
      verifyPhone,
      skipPhoneVerification,
      completeSocialSignIn,
      logout,
      pendingPhoneVerification,
    }),
    [user, isLoading, login, signup, verifyPhone, skipPhoneVerification, completeSocialSignIn, logout, pendingPhoneVerification]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
