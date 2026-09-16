export const SITE_NAV_LINKS = [
  { id: "home", href: "/" },
  { id: "saved", href: "/favourites" },
  { id: "contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  RestHalf: [
    { id: "about", href: "/about" },
    { id: "howItWorks", href: "/how-it-works" },
    { id: "contact", href: "/contact" },
    { id: "listProperty", href: "/list-property" },
  ],
  Legal: [
    { id: "terms", href: "/terms" },
    { id: "cancellation", href: "/cancellation-policy" },
    { id: "privacy", href: "/privacy" },
  ],
} as const;
