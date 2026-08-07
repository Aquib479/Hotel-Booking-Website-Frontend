/**
 * ZentrumHub credentials — fill these in `.env.local` (not committed).
 *
 *   VITE_ZENTRUMHUB_API_KEY=...
 *   VITE_ZENTRUMHUB_ACCOUNT_ID=...
 *   VITE_ZENTRUMHUB_CHANNEL_ID=...
 */
export const zentrumConfig = {
  apiKey: (import.meta.env.VITE_ZENTRUMHUB_API_KEY as string | undefined)?.trim() ?? "",
  accountId: (import.meta.env.VITE_ZENTRUMHUB_ACCOUNT_ID as string | undefined)?.trim() ?? "",
  channelId: (import.meta.env.VITE_ZENTRUMHUB_CHANNEL_ID as string | undefined)?.trim() ?? "",
  culture: (import.meta.env.VITE_ZENTRUMHUB_CULTURE as string | undefined)?.trim() || "en-US",
  defaultCurrency:
    (import.meta.env.VITE_ZENTRUMHUB_CURRENCY as string | undefined)?.trim() || "USD",
  /** Dev: Vite proxies. Prod: set absolute URLs if needed. */
  nexusBase:
    (import.meta.env.VITE_ZENTRUMHUB_NEXUS_URL as string | undefined)?.replace(/\/$/, "") ||
    "/zh-nexus",
  autosuggestBase:
    (import.meta.env.VITE_ZENTRUMHUB_AUTOSUGGEST_URL as string | undefined)?.replace(/\/$/, "") ||
    "/zh-autosuggest",
  pollIntervalMs: 500,
  circularRadiusKm: 5,
} as const;

export function isZentrumConfigured(): boolean {
  return Boolean(
    zentrumConfig.apiKey && zentrumConfig.accountId && zentrumConfig.channelId
  );
}

export function assertZentrumConfigured(): void {
  if (!isZentrumConfigured()) {
    throw new Error(
      "ZentrumHub credentials missing. Set VITE_ZENTRUMHUB_API_KEY, VITE_ZENTRUMHUB_ACCOUNT_ID, and VITE_ZENTRUMHUB_CHANNEL_ID in .env.local"
    );
  }
}
