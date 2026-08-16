export const ABOUT_CONTENT = {
  title: "About RestHalf.com",
  intro:
    "RestHalf helps travelers book hotel rest slots and overnight stays — with instant confirmation on RestHalf Exclusive rates and partner inventory when you need more options.",
  sections: [
    {
      id: "mission",
      title: "Our mission",
      body: "Give every traveler a place to rest between flights, meetings, or long days — without booking a full night when you only need a few hours.",
    },
    {
      id: "how",
      title: "How RestHalf works",
      body: "Search by city or airport, pick Rest or Stay, and book. RestHalf Exclusive inventory is confirmed by us. Partner rates come from suppliers with their own confirmation and policies.",
    },
    {
      id: "where",
      title: "Where we work",
      body: "Headquartered in Jakarta, Indonesia, with an office in Hyderabad, India — supporting guests and hotel partners across the region.",
    },
  ],
} as const;

export const LIST_PROPERTY_CONTENT = {
  title: "List your property",
  intro:
    "Partner with RestHalf to offer rest slots and overnight stays to travelers who need flexible hotel access near airports and city centers.",
  benefits: [
    "Reach travelers looking for daytime rest and short stays",
    "Keep control of inventory windows and rates",
    "Dedicated partner support from Jakarta and Hyderabad teams",
  ],
} as const;

export const RATE_APP_CONTENT = {
  title: "Rate this app",
  intro: "Your feedback helps us improve RestHalf for every traveler.",
  storeLinks: [
    { id: "ios", label: "Rate on the App Store", href: "#" },
    { id: "android", label: "Rate on Google Play", href: "#" },
  ],
} as const;
