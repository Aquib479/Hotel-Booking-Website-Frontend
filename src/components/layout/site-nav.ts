export const SITE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Hotels", href: "/search" },
  { label: "Help", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  RestHalf: [
    { label: "About", href: "#" },
    { label: "How RestHalf works", href: "/faq" },
    { label: "Help Center", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "#" },
  ],
  Book: [
    { label: "Rest · 12h slots", href: "/search?mode=rest" },
    { label: "Stay · overnight", href: "/search?mode=stay" },
    { label: "Near airport", href: "/search?category=near-airport" },
    { label: "RestHalf Exclusive", href: "/search?category=resthalf-exclusive" },
    { label: "Partner rates", href: "/search?lane=wholesale" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;
