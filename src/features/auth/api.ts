import { api, ApiError } from "@/services/api";
import type { AuthResult, AuthUser, SignupResult } from "./types";

/** Deployed API returns { id, token }; newer builds may also include profile fields */
type AuthApiResponse = {
  id: string;
  token: string;
  fullName?: string;
  phone?: string;
  email?: string | null;
  createdAt?: string | Date;
};

function decodeJwtPhone(token: string): string {
  try {
    const payload = token.split(".")[1];
    if (!payload) return "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    const data = JSON.parse(json) as { phone?: string };
    return data.phone ?? "";
  } catch {
    return "";
  }
}

function toIsoDate(value: string | Date | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  return value.toISOString();
}

function toAuthUser(
  data: AuthApiResponse,
  fallback: { fullName?: string; email?: string; phone?: string }
): AuthUser {
  return {
    id: data.id,
    fullName: data.fullName ?? fallback.fullName ?? "",
    email: data.email ?? fallback.email ?? "",
    phoneE164: data.phone ?? fallback.phone ?? decodeJwtPhone(data.token),
    phoneVerified: false,
    hasPassword: true,
    createdAt: toIsoDate(data.createdAt),
  };
}

export async function login(input: {
  phone: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthResult> {
  try {
    const data = await api.post<AuthApiResponse>("/auth/guest/login", {
      phone: input.phone,
      password: input.password,
    });
    return {
      success: true,
      user: toAuthUser(data, { phone: input.phone }),
      token: data.token,
      needsPhoneVerification: false,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { success: false, error: "invalid_credentials" };
    }
    return { success: false, error: "network" };
  }
}

export async function signup(
  data: Omit<AuthUser, "id" | "phoneVerified" | "createdAt"> & { password: string }
): Promise<SignupResult> {
  if (data.password.length < 6) {
    return { success: false, error: "weak_password" };
  }

  try {
    const body: {
      fullName: string;
      phone: string;
      password: string;
      email?: string;
    } = {
      fullName: data.fullName,
      phone: data.phoneE164,
      password: data.password,
    };
    const email = data.email.trim();
    if (email) body.email = email;

    const res = await api.post<AuthApiResponse>("/auth/guest/register", body);
    return {
      success: true,
      user: toAuthUser(res, {
        fullName: data.fullName,
        email,
        phone: data.phoneE164,
      }),
      token: res.token,
      needsPhoneVerification: false,
    };
  } catch (err) {
    if (err instanceof ApiError) {
      const msg = err.message.toLowerCase();
      if (err.status === 400 && msg.includes("phone")) {
        return { success: false, error: "phone_taken" };
      }
      if (err.status === 400 && msg.includes("email")) {
        return { success: false, error: "email_taken" };
      }
      if (msg.includes("password")) {
        return { success: false, error: "weak_password" };
      }
    }
    return { success: false, error: "network" };
  }
}

/** Not yet available on the API */
export async function requestPasswordReset(_phone: string): Promise<void> {
  throw new ApiError(501, "Password reset is not available yet");
}

/** Not yet available on the API */
export async function sendOtp(_phoneE164: string): Promise<{ expiresAt: string }> {
  throw new ApiError(501, "OTP verification is not available yet");
}

/** Not yet available on the API */
export async function verifyOtp(_phoneE164: string, _code: string): Promise<boolean> {
  return false;
}

/** Not yet available on the API */
export async function signInWithGoogle(): Promise<AuthResult> {
  return { success: false, error: "network" };
}
