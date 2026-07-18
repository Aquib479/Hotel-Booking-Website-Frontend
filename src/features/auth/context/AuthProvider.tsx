import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_STORAGE_KEY, AUTH_TOKEN_KEY } from "../constants";
import type { AuthResult, AuthUser, SignupResult } from "../types";
import { login as apiLogin, signup as apiSignup, verifyOtp as apiVerifyOtp } from "../api";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
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

function readStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function persistSession(user: AuthUser | null, token: string | null) {
  if (user && token) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhoneVerification, setPendingPhoneVerification] = useState(false);

  useEffect(() => {
    persistSession(user, token);
  }, [user, token]);

  const login = useCallback(
    async (phone: string, password: string, rememberMe = false): Promise<AuthResult> => {
      void rememberMe;
      setIsLoading(true);
      try {
        const result = await apiLogin({ phone, password, rememberMe });
        if (result.success) {
          setUser(result.user);
          setToken(result.token);
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
          setToken(result.token);
          setPendingPhoneVerification(result.needsPhoneVerification);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyPhone = useCallback(
    async (code: string): Promise<boolean> => {
      if (!user) return false;
      const ok = await apiVerifyOtp(user.phoneE164, code);
      if (ok) {
        setUser((prev) => (prev ? { ...prev, phoneVerified: true } : prev));
        setPendingPhoneVerification(false);
      }
      return ok;
    },
    [user]
  );

  const skipPhoneVerification = useCallback(() => {
    setPendingPhoneVerification(false);
  }, []);

  const completeSocialSignIn = useCallback(
    (nextUser: AuthUser, needsPhoneVerification: boolean) => {
      setUser(nextUser);
      setPendingPhoneVerification(needsPhoneVerification);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setPendingPhoneVerification(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      signup,
      verifyPhone,
      skipPhoneVerification,
      completeSocialSignIn,
      logout,
      pendingPhoneVerification,
    }),
    [
      user,
      token,
      isLoading,
      login,
      signup,
      verifyPhone,
      skipPhoneVerification,
      completeSocialSignIn,
      logout,
      pendingPhoneVerification,
    ]
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
