import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STAFF_AUTH_STORAGE_KEY } from "../constants";
import { staffLogin as apiStaffLogin } from "../api";
import type { StaffUser } from "../types";

interface StaffAuthContextValue {
  staff: StaffUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null);

function readStoredStaff(): StaffUser | null {
  try {
    const raw = localStorage.getItem(STAFF_AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffUser;
  } catch {
    return null;
  }
}

function persistStaff(staff: StaffUser | null) {
  if (staff) {
    localStorage.setItem(STAFF_AUTH_STORAGE_KEY, JSON.stringify(staff));
  } else {
    localStorage.removeItem(STAFF_AUTH_STORAGE_KEY);
  }
}

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffUser | null>(() => readStoredStaff());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    persistStaff(staff);
  }, [staff]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await apiStaffLogin(email, password);
      if (result.success) {
        setStaff(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setStaff(null);
  }, []);

  const value = useMemo(
    () => ({
      staff,
      isAuthenticated: !!staff,
      isLoading,
      login,
      logout,
    }),
    [staff, isLoading, login, logout]
  );

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}
