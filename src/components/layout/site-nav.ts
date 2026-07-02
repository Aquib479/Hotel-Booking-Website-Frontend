export const SITE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Hotels", href: "/search" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
] as const;

export const FOOTER_LINKS = {
  RestHalf: [
    { label: "About", href: "#" },
    { label: "How RestHalf works", href: "#how-it-works" },
    { label: "Policies", href: "#" },
    { label: "Press", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Book: [
    { label: "Rest · 12h slots", href: "/search?mode=rest" },
    { label: "Stay · overnight", href: "/search?mode=stay" },
    { label: "Near airport", href: "/search?category=near-airport" },
    { label: "RestHalf Exclusive", href: "/search?category=resthalf-exclusive" },
    { label: "Partner rates", href: "/search?lane=wholesale" },
    { label: "Contact", href: "#contact" },
  ],
  Partners: [
    { label: "Hotel partners", href: "#" },
    { label: "Supplier integration", href: "#" },
    { label: "API documentation", href: "#" },
    { label: "Partner login", href: "#" },
    { label: "Trust & Safety", href: "#" },
    { label: "Support", href: "#" },
  ],
} as const;
