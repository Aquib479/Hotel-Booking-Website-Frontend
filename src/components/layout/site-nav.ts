export const SITE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/search" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const FOOTER_LINKS = {
  Neer: [
    { label: "About", href: "#" },
    { label: "Team", href: "#" },
    { label: "Policies", href: "#", badge: "New" as const },
    { label: "Press", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Releases", href: "#" },
  ],
  Explore: [
    { label: "Book a car", href: "#" },
    { label: "Book a home", href: "/search" },
    { label: "Trust & Safety", href: "#" },
    { label: "News", href: "#" },
    { label: "Media kit", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  Hosting: [
    { label: "Become a host", href: "#host" },
    { label: "All-star hotels", href: "#" },
    { label: "Insurance & Protection", href: "#" },
    { label: "Host Tools", href: "#" },
    { label: "Tutorials", href: "#" },
    { label: "Support", href: "#" },
  ],
} as const;
