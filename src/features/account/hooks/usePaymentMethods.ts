import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthProvider";
import type { SavedPaymentMethod } from "../types";
import { fetchSavedPaymentMethods, persistPaymentMethods } from "../api";

export function usePaymentMethods() {
  const { user } = useAuth();
  const [methods, setMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await fetchSavedPaymentMethods(user.id);
      setMethods(data);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const removeMethod = useCallback(
    (id: string) => {
      if (!user) return;
      const next = methods.filter((m) => m.id !== id);
      setMethods(next);
      persistPaymentMethods(user.id, next);
    },
    [user, methods]
  );

  const setDefault = useCallback(
    (id: string) => {
      if (!user) return;
      const next = methods.map((m) => ({ ...m, isDefault: m.id === id }));
      setMethods(next);
      persistPaymentMethods(user.id, next);
    },
    [user, methods]
  );

  const addMethod = useCallback(
    (method: Omit<SavedPaymentMethod, "id">) => {
      if (!user) return;
      const entry: SavedPaymentMethod = {
        ...method,
        id: crypto.randomUUID(),
        isDefault: methods.length === 0,
      };
      const next = [...methods, entry];
      setMethods(next);
      persistPaymentMethods(user.id, next);
    },
    [user, methods]
  );

  return { methods, isLoading, addMethod, removeMethod, setDefault, reload: load };
}
