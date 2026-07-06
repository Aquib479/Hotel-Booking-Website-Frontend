import type { AuthResult, AuthUser, SignupResult } from "./types";

const MOCK_USERS_KEY = "resthalf-mock-users";

interface MockStoredUser extends AuthUser {
  password: string;
}

function readMockUsers(): MockStoredUser[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    return raw ? (JSON.parse(raw) as MockStoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeMockUsers(users: MockStoredUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function findUser(identifier: string): MockStoredUser | undefined {
  const normalized = identifier.trim().toLowerCase();
  return readMockUsers().find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.phoneE164 === identifier.replace(/\s/g, "") ||
      u.phoneE164 === identifier
  );
}

export async function login(input: {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthResult> {
  await delay(600);
  const user = findUser(input.identifier);
  if (!user || user.password !== input.password) {
    return { success: false, error: "invalid_credentials" };
  }
  const { password: _, ...authUser } = user;
  return {
    success: true,
    user: authUser,
    needsPhoneVerification: !authUser.phoneVerified,
  };
}

export async function signup(
  data: Omit<AuthUser, "id" | "phoneVerified" | "createdAt"> & { password: string }
): Promise<SignupResult> {
  await delay(800);
  const users = readMockUsers();
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: "email_taken" };
  }
  if (users.some((u) => u.phoneE164 === data.phoneE164)) {
    return { success: false, error: "phone_taken" };
  }
  if (data.password.length < 8) {
    return { success: false, error: "weak_password" };
  }

  const newUser: MockStoredUser = {
    id: crypto.randomUUID(),
    fullName: data.fullName,
    email: data.email,
    phoneE164: data.phoneE164,
    phoneVerified: false,
    createdAt: new Date().toISOString(),
    password: data.password,
  };
  writeMockUsers([...users, newUser]);

  const { password: _, ...authUser } = newUser;
  return { success: true, user: authUser, needsPhoneVerification: true };
}

export async function requestPasswordReset(_identifier: string): Promise<void> {
  await delay(500);
}

export async function sendOtp(_phoneE164: string): Promise<{ expiresAt: string }> {
  await delay(400);
  const expiresAt = new Date(Date.now() + OTP_RESEND_COOLDOWN_MS).toISOString();
  return { expiresAt };
}

const OTP_RESEND_COOLDOWN_MS = 30_000;
const MOCK_OTP = "123456";

export async function verifyOtp(_phoneE164: string, code: string): Promise<boolean> {
  await delay(500);
  return code === MOCK_OTP;
}

export async function signInWithGoogle(): Promise<AuthResult> {
  await delay(700);
  const user: AuthUser = {
    id: crypto.randomUUID(),
    fullName: "Google User",
    email: "google.user@example.com",
    phoneE164: "",
    phoneVerified: false,
    hasPassword: false,
    createdAt: new Date().toISOString(),
  };
  return { success: true, user, needsPhoneVerification: true };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
