import { detectCardBrand } from "@/features/checkout/hooks/usePaymentForms";
import type { CardPaymentValues } from "@/features/checkout/types";
import type { SavedPaymentMethod } from "../types";
import { fetchSavedPaymentMethods, persistPaymentMethods } from "../api";

const BRAND_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  rupay: "RuPay",
  jcb: "JCB",
  unknown: "Card",
};

/** Tokenized display fields only — never store full PAN or CVV. */
export function cardValuesToSavedMethod(
  values: Pick<CardPaymentValues, "cardNumber" | "expiry" | "holderName">
): Omit<SavedPaymentMethod, "id"> {
  const digits = values.cardNumber.replace(/\D/g, "");
  const brand = detectCardBrand(digits);
  return {
    type: "card",
    label: BRAND_LABELS[brand] ?? "Card",
    maskedIdentifier: `•••• ${digits.slice(-4)}`,
    expiry: values.expiry,
    holderName: values.holderName.trim() || undefined,
  };
}

export async function saveCardFromPayment(
  userId: string,
  values: Pick<CardPaymentValues, "cardNumber" | "expiry" | "holderName">
): Promise<SavedPaymentMethod> {
  const existing = await fetchSavedPaymentMethods(userId);
  const candidate = cardValuesToSavedMethod(values);
  const duplicate = existing.find(
    (m) =>
      m.type === "card" &&
      m.maskedIdentifier === candidate.maskedIdentifier &&
      m.expiry === candidate.expiry
  );
  if (duplicate) return duplicate;

  const entry: SavedPaymentMethod = {
    ...candidate,
    id: crypto.randomUUID(),
  };
  const next = [...existing, entry];
  persistPaymentMethods(userId, next);
  return entry;
}
