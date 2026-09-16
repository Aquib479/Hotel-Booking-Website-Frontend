/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ZENTRUMHUB_API_KEY?: string;
  readonly VITE_ZENTRUMHUB_ACCOUNT_ID?: string;
  readonly VITE_ZENTRUMHUB_CHANNEL_ID?: string;
  readonly VITE_ZENTRUMHUB_CULTURE?: string;
  readonly VITE_ZENTRUMHUB_CURRENCY?: string;
  readonly VITE_ZENTRUMHUB_NEXUS_URL?: string;
  readonly VITE_ZENTRUMHUB_AUTOSUGGEST_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
