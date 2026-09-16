import type { AppLanguage } from "./languages";

export const UI_COPY = {
  nav: {
    home: { en: "Home", id: "Beranda" },
    saved: { en: "Saved", id: "Tersimpan" },
    contact: { en: "Contact", id: "Kontak" },
  },
  footer: {
    about: { en: "About", id: "Tentang" },
    howItWorks: { en: "How RestHalf works", id: "Cara RestHalf bekerja" },
    contact: { en: "Contact", id: "Kontak" },
    listProperty: { en: "List your property", id: "Daftarkan properti Anda" },
    terms: { en: "Terms of Service", id: "Ketentuan Layanan" },
    cancellation: { en: "Cancellation Policy", id: "Kebijakan Pembatalan" },
    privacy: { en: "Privacy Policy", id: "Kebijakan Privasi" },
    legal: { en: "Legal", id: "Legal" },
  },
  howItWorksCta: {
    search: { en: "Search hotels", id: "Cari hotel" },
    about: { en: "About RestHalf", id: "Tentang RestHalf" },
  },
  aboutCta: {
    contact: { en: "Contact us", id: "Hubungi kami" },
    listProperty: { en: "List your property", id: "Daftarkan properti Anda" },
  },
} as const;

export function t(
  map: Record<AppLanguage, string>,
  language: AppLanguage,
): string {
  return map[language];
}
