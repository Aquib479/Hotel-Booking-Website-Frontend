import type {
  BooleanTravellerKey,
  CountTravellerKey,
  TravellerSelection,
} from "./types";

export const MAX_TRAVELLERS = 8;

export const DEFAULT_TRAVELLER_SELECTION: TravellerSelection = {
  self: true,
  spouse: true,
  father: false,
  mother: false,
  son: 0,
  daughter: 0,
  relatives: 0,
};

export const BOOLEAN_TRAVELLER_OPTIONS: { key: BooleanTravellerKey; label: string }[] = [
  { key: "self", label: "Self" },
  { key: "spouse", label: "Spouse" },
];

export const COUNT_TRAVELLER_OPTIONS: { key: CountTravellerKey; label: string }[] = [
  { key: "son", label: "Son" },
  { key: "daughter", label: "Daughter" },
];

export const FAMILY_BOOLEAN_OPTIONS: { key: BooleanTravellerKey; label: string }[] = [
  { key: "father", label: "Father" },
  { key: "mother", label: "Mother" },
];

export function countTravellers(selection: TravellerSelection): number {
  return (
    (selection.self ? 1 : 0) +
    (selection.spouse ? 1 : 0) +
    (selection.father ? 1 : 0) +
    (selection.mother ? 1 : 0) +
    selection.son +
    selection.daughter +
    selection.relatives
  );
}

export function formatTravellersLabel(selection: TravellerSelection): string {
  const total = countTravellers(selection);
  return `${total} traveller${total === 1 ? "" : "s"}`;
}

export function parseGuestCountFromLabel(label: string): number {
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : 2;
}

/** Best-effort restore from a guests label; falls back to a matching total. */
export function selectionFromGuestsLabel(label: string): TravellerSelection {
  const total = Math.min(MAX_TRAVELLERS, Math.max(1, parseGuestCountFromLabel(label)));

  if (total === 1) {
    return { ...DEFAULT_TRAVELLER_SELECTION, spouse: false };
  }

  if (total === 2) {
    return { ...DEFAULT_TRAVELLER_SELECTION };
  }

  // Prefer self + spouse, then fill remaining with relatives
  const remaining = total - 2;
  return {
    ...DEFAULT_TRAVELLER_SELECTION,
    relatives: remaining,
  };
}
