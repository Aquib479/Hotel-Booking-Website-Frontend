export const SITE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Saved", href: "/favourites" },
  { label: "Help", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  RestHalf: [
    { label: "About", href: "/about" },
    { label: "How RestHalf works", href: "/faq" },
    { label: "Help Center", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "List your property", href: "/list-property" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;
