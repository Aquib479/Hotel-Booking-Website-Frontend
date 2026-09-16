export const APP_LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "id", label: "Bahasa", short: "ID" },
] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: AppLanguage = "en";

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return value === "en" || value === "id";
}

export function dateLocaleCode(language: AppLanguage): string {
  return language === "id" ? "id-ID" : "en-US";
}
