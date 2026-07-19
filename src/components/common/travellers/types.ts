export interface TravellerSelection {
  self: boolean;
  spouse: boolean;
  father: boolean;
  mother: boolean;
  son: number;
  daughter: number;
  relatives: number;
}

export type BooleanTravellerKey = "self" | "spouse" | "father" | "mother";
export type CountTravellerKey = "son" | "daughter" | "relatives";
