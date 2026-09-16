import type { MemberProfileDetails, NotificationPreferences, SavedPaymentMethod } from "./types";
import { DEFAULT_MEMBER_PROFILE, DEFAULT_NOTIFICATION_PREFERENCES } from "./constants";

const NOTIFICATIONS_KEY = "resthalf-notification-prefs";
const PAYMENT_METHODS_KEY = "resthalf-saved-payment-methods";
const MEMBER_PROFILE_KEY = "resthalf-member-profile";

export function readNotificationPrefs(userId: string): NotificationPreferences {
  try {
    const raw = localStorage.getItem(`${NOTIFICATIONS_KEY}-${userId}`);
    if (raw) return JSON.parse(raw) as NotificationPreferences;
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_NOTIFICATION_PREFERENCES };
}

export function writeNotificationPrefs(userId: string, prefs: NotificationPreferences) {
  localStorage.setItem(`${NOTIFICATIONS_KEY}-${userId}`, JSON.stringify(prefs));
}

export function readMemberProfile(userId: string): MemberProfileDetails {
  try {
    const raw = localStorage.getItem(`${MEMBER_PROFILE_KEY}-${userId}`);
    if (raw) return { ...DEFAULT_MEMBER_PROFILE, ...(JSON.parse(raw) as MemberProfileDetails) };
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_MEMBER_PROFILE };
}

export function writeMemberProfile(userId: string, details: MemberProfileDetails) {
  localStorage.setItem(`${MEMBER_PROFILE_KEY}-${userId}`, JSON.stringify(details));
}

export async function fetchSavedPaymentMethods(userId: string): Promise<SavedPaymentMethod[]> {
  await new Promise((r) => setTimeout(r, 300));
  try {
    const raw = localStorage.getItem(`${PAYMENT_METHODS_KEY}-${userId}`);
    if (raw) return JSON.parse(raw) as SavedPaymentMethod[];
  } catch {
    /* ignore */
  }
  return [];
}

export function persistPaymentMethods(userId: string, methods: SavedPaymentMethod[]) {
  localStorage.setItem(`${PAYMENT_METHODS_KEY}-${userId}`, JSON.stringify(methods));
}

export async function requestEmailChange(
  _userId: string,
  newEmail: string
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 500));
  void newEmail;
  return { success: true };
}

export async function changePasswordApi(
  _userId: string,
  _currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  await new Promise((r) => setTimeout(r, 600));
  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }
  return { success: true };
}

export async function setPasswordApi(
  _userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  return changePasswordApi(_userId, "", newPassword);
}

export async function deleteAccountApi(_userId: string): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 700));
  return { success: true };
}
