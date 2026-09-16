import type { Property } from "./types";

/** Build /properties/:id query string, including wholesale rate hints for detail. */
export function buildPropertyDetailSearchParams(
  property: Property,
  baseSearchParams?: string,
): string {
  const params = new URLSearchParams(baseSearchParams ?? "");
  if (property.lane === "wholesale") {
    params.set("lane", "wholesale");
    if (property.wholesalePricing) {
      params.set(
        "nightlyAmount",
        String(property.wholesalePricing.supplierBaseAmount),
      );
      params.set(
        "nightlyCurrency",
        property.wholesalePricing.supplierCurrency,
      );
    }
    if (property.supplierName) {
      params.set("supplier", property.supplierName);
    }
  }
  return params.toString();
}

export function buildPropertyDetailUrl(
  property: Property,
  baseSearchParams?: string,
): string {
  const query = buildPropertyDetailSearchParams(property, baseSearchParams);
  return `/properties/${encodeURIComponent(property.id)}${
    query ? `?${query}` : ""
  }`;
}
