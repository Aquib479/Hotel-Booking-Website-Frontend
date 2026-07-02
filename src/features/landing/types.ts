export interface HeroSearchValues {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: string;
}

export type { LocationSuggestion } from "@/components/common/search";
