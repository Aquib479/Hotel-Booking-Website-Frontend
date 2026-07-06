export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const E164_RE = /^\+[1-9]\d{7,14}$/;

export function toE164(countryCode: string, nationalNumber: string): string {
  return `${countryCode}${nationalNumber.replace(/\D/g, "")}`;
}

export function isValidE164(countryCode: string, nationalNumber: string): boolean {
  return E164_RE.test(toE164(countryCode, nationalNumber));
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Detect whether a login identifier looks like email vs phone */
export function detectIdentifierType(value: string): "email" | "phone" | "unknown" {
  const trimmed = value.trim();
  if (!trimmed) return "unknown";
  if (trimmed.includes("@")) return "email";
  if (/^\+?\d[\d\s-]{5,}$/.test(trimmed)) return "phone";
  return "unknown";
}

export function normalizePhoneIdentifier(value: string): string {
  return value.replace(/[\s-]/g, "");
}
