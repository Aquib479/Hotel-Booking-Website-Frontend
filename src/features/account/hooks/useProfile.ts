import { useCallback, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/features/auth/types";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { verifyOtp as apiVerifyOtp, sendOtp } from "@/features/auth/api";
import type { NotificationPreferences, ProfileField, UserProfile } from "../types";
import {
  deleteAccountApi,
  changePasswordApi,
  requestEmailChange,
  readNotificationPrefs,
  setPasswordApi,
  writeNotificationPrefs,
} from "../api";

function toProfile(user: AuthUser, notifications: NotificationPreferences): UserProfile {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    pendingEmail: user.pendingEmail,
    phoneE164: user.phoneE164,
    pendingPhoneE164: user.pendingPhoneE164,
    phoneVerified: user.phoneVerified,
    hasPassword: user.hasPassword !== false,
    notifications,
  };
}

export function useProfile() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationPreferences>(() =>
    user ? readNotificationPrefs(user.id) : readNotificationPrefs("")
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<AuthUser | null>(user);

  useEffect(() => {
    setLocalUser(user);
    if (user) setNotifications(readNotificationPrefs(user.id));
  }, [user]);

  const persistAuthUser = useCallback((next: AuthUser) => {
    setLocalUser(next);
    localStorage.setItem("resthalf-auth-user", JSON.stringify(next));
  }, []);

  const profile = useMemo(
    () => (localUser ? toProfile(localUser, notifications) : null),
    [localUser, notifications]
  );

  const updateField = useCallback(
    async (field: ProfileField, value: string) => {
      if (!localUser) return;
      setIsSaving(true);
      setError(null);
      try {
        if (field === "fullName") {
          persistAuthUser({ ...localUser, fullName: value.trim() });
        } else if (field === "email") {
          const result = await requestEmailChange(localUser.id, value.trim());
          if (!result.success) throw new Error("Failed to send confirmation");
          persistAuthUser({ ...localUser, pendingEmail: value.trim() });
        }
      } catch {
        setError("Couldn't save changes. Please try again.");
      } finally {
        setIsSaving(false);
      }
    },
    [localUser, persistAuthUser]
  );

  const startPhoneChange = useCallback(
    (phoneE164: string) => {
      if (!localUser) return;
      persistAuthUser({
        ...localUser,
        pendingPhoneE164: phoneE164,
        phoneVerified: false,
      });
    },
    [localUser, persistAuthUser]
  );

  const confirmPhoneChange = useCallback(
    async (phoneE164: string, code: string) => {
      const ok = await apiVerifyOtp(phoneE164, code);
      if (!ok || !localUser) return false;
      persistAuthUser({
        ...localUser,
        phoneE164,
        pendingPhoneE164: undefined,
        phoneVerified: true,
      });
      return true;
    },
    [localUser, persistAuthUser]
  );

  const cancelPhoneChange = useCallback(() => {
    if (!localUser) return;
    persistAuthUser({
      ...localUser,
      pendingPhoneE164: undefined,
      phoneVerified: Boolean(localUser.phoneE164),
    });
  }, [localUser, persistAuthUser]);

  const updateNotifications = useCallback(
    (patch: Partial<NotificationPreferences>) => {
      if (!localUser) return;
      const next = { ...notifications, ...patch };
      setNotifications(next);
      writeNotificationPrefs(localUser.id, next);
    },
    [localUser, notifications]
  );

  const changePassword = useCallback(
    async (current: string, newPassword: string) => {
      if (!localUser) return { success: false, error: "Not signed in" };
      setIsSaving(true);
      try {
        const result =
          localUser.hasPassword === false
            ? await setPasswordApi(localUser.id, newPassword)
            : await changePasswordApi(localUser.id, current, newPassword);
        if (result.success) {
          persistAuthUser({ ...localUser, hasPassword: true });
        }
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [localUser, persistAuthUser]
  );

  const deleteAccount = useCallback(async () => {
    if (!localUser) return false;
    setIsSaving(true);
    try {
      const result = await deleteAccountApi(localUser.id);
      if (result.success) logout();
      return result.success;
    } finally {
      setIsSaving(false);
    }
  }, [localUser, logout]);

  return {
    profile,
    updateField,
    startPhoneChange,
    confirmPhoneChange,
    cancelPhoneChange,
    sendPhoneOtp: sendOtp,
    updateNotifications,
    changePassword,
    deleteAccount,
    isSaving,
    error,
  };
}
