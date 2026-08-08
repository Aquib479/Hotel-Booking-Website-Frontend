import type {
  CancellationPolicy,
  RatePlan,
  RatePolicy,
  Recommendation,
  RoomImage,
  RoomRaw,
  RoomsAndRatesHotel,
  RoomsAndRatesResponse,
  StandardizedRoom,
  StandardizedRoomGroup,
} from "@/services/zentrumhub";

export interface DisplayRateOffer {
  title: string;
  description: string;
}

export interface DisplayRatePolicy {
  type: string;
  text: string;
}

export interface DisplayRateOption {
  recommendationId: string;
  rateIds: string[];
  /** Required by Book API roomsAllocations[].roomId */
  roomId: string;
  totalRate: number;
  baseRate?: number;
  publishedRate?: number;
  taxesAmount?: number;
  currency: string;
  boardBasisLabel: string;
  boardBasisType?: string | null;
  refundable: boolean;
  refundability?: string | null;
  providerName?: string | null;
  cancellationText?: string | null;
  includes: string[];
  offers: DisplayRateOffer[];
  policies: DisplayRatePolicy[];
  availability?: number;
  payAtHotel?: boolean;
  cardRequired?: boolean;
  specialRequestSupported?: boolean;
  depositRequired?: boolean;
  needsPriceCheck?: boolean;
  isPackageRate?: boolean;
}

export interface DisplayRoomGroup {
  key: string;
  roomName: string;
  roomTypeLabel: string;
  description?: string;
  maxGuests?: number;
  maxAdults?: number;
  maxChildren?: number;
  bedSummary?: string;
  imageUrl?: string;
  images: string[];
  imageCaptions: string[];
  facilities: string[];
  areaLabel?: string;
  /** @deprecated use areaLabel */
  areaSqm?: number;
  views: string[];
  smokingAllowed?: boolean;
  options: DisplayRateOption[];
}

const IMAGE_SIZE_PRIORITY = ["Standard", "Xxl", "Xs"] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function pickImageUrl(image: RoomImage | string): string | undefined {
  if (typeof image === "string") return image || undefined;
  const links = image.links ?? [];
  if (links.length) {
    for (const size of IMAGE_SIZE_PRIORITY) {
      const match = links.find((l) => l.size === size && l.url);
      if (match?.url) return match.url;
    }
    const first = links.find((l) => l.url);
    if (first?.url) return first.url;
  }
  return image.url ?? undefined;
}

function collectRoomImages(
  room: RoomRaw | StandardizedRoom | undefined
): { urls: string[]; captions: string[] } {
  const images = room?.images;
  if (!images?.length) return { urls: [], captions: [] };

  const urls: string[] = [];
  const captions: string[] = [];
  const seen = new Set<string>();

  for (const img of images) {
    const url = pickImageUrl(img);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
    const caption =
      typeof img === "string" ? "" : (img.caption ?? "").trim();
    captions.push(caption);
  }

  return { urls, captions };
}

function roomImageUrl(
  room: RoomRaw | StandardizedRoom | undefined
): string | undefined {
  return collectRoomImages(room).urls[0];
}

function collectFacilities(
  room: RoomRaw | StandardizedRoom | undefined,
  limit?: number
): string[] {
  const raw = room?.facilities;
  if (!raw?.length) return [];
  const names = raw
    .map((f) => (typeof f === "string" ? f : f?.name))
    .filter((n): n is string => Boolean(n?.trim()));
  const unique = [...new Set(names)];
  return limit ? unique.slice(0, limit) : unique;
}

function formatAreaLabel(
  room: RoomRaw | StandardizedRoom | undefined
): string | undefined {
  if (!room) return undefined;
  const std = room as StandardizedRoom;
  const areaObj = asRecord(std.area);

  const sqm =
    toNumber(std.areaSquareMeters) ??
    toNumber(areaObj?.squareMeters) ??
    (typeof std.area === "number" || typeof std.area === "string"
      ? toNumber(std.area)
      : undefined);
  const sqft = toNumber(areaObj?.squareFeet);

  if (sqft && sqft > 0) return `${Math.round(sqft)} sq ft`;
  if (sqm && sqm > 0) return `${Math.round(sqm)} m²`;
  return undefined;
}

/** Keep areaSqm for older UI paths — convert sq ft when needed. */
function roomAreaSqm(
  room: RoomRaw | StandardizedRoom | undefined
): number | undefined {
  if (!room) return undefined;
  const std = room as StandardizedRoom;
  const areaObj = asRecord(std.area);
  const sqm =
    toNumber(std.areaSquareMeters) ?? toNumber(areaObj?.squareMeters);
  if (sqm && sqm > 0) return sqm;
  const sqft = toNumber(areaObj?.squareFeet);
  if (sqft && sqft > 0) return Math.round(sqft * 0.092903);
  if (typeof std.area === "number" || typeof std.area === "string") {
    return toNumber(std.area);
  }
  return undefined;
}

function boardBasisLabel(boardBasis: RatePlan["boardBasis"] | unknown): string {
  if (!boardBasis) return "Room only";
  if (typeof boardBasis === "string") {
    return boardBasis
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ");
  }
  const obj = asRecord(boardBasis);
  if (!obj) return "Room only";
  const description = typeof obj.description === "string" ? obj.description : null;
  const type = typeof obj.type === "string" ? obj.type : null;
  if (description) return description;
  if (!type) return "Room only";
  return type
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ");
}

function boardBasisType(boardBasis: RatePlan["boardBasis"] | unknown): string | null {
  if (!boardBasis) return null;
  if (typeof boardBasis === "string") return boardBasis;
  const obj = asRecord(boardBasis);
  return typeof obj?.type === "string" ? obj.type : null;
}

function isRefundable(rate: RatePlan): boolean {
  if (typeof rate.isRefundable === "boolean") return rate.isRefundable;
  if (typeof rate.refundable === "boolean") return rate.refundable;
  return (rate.refundability ?? "").toLowerCase() === "refundable";
}

function rateTotal(rate: RatePlan | undefined): number {
  if (!rate) return 0;
  if (typeof rate.totalRate === "number" && rate.totalRate > 0) return rate.totalRate;
  if (typeof rate.publishedRate === "number" && rate.publishedRate > 0) {
    return rate.publishedRate;
  }
  if (typeof rate.baseRate === "number" && rate.baseRate > 0) return rate.baseRate;
  return 0;
}

function recommendationTotal(rec: Recommendation, ratesById: Map<string, RatePlan>): number {
  const totals = (rec.rates ?? []).map((id) => rateTotal(ratesById.get(id)));
  return totals.reduce((sum, n) => sum + n, 0);
}

function sumTaxes(rate: RatePlan | undefined): number | undefined {
  if (!rate?.taxes) return undefined;
  if (typeof rate.taxes === "number") return rate.taxes;
  const total = rate.taxes.reduce((sum, t) => sum + (t.amount ?? 0), 0);
  return total > 0 ? total : undefined;
}

function formatCancellationText(
  policies: CancellationPolicy[] | null | undefined
): string | undefined {
  if (!policies?.length) return undefined;
  const withText = policies.find((p) => p.text?.trim());
  if (withText?.text) return stripHtml(withText.text);

  const rules = policies.flatMap((p) => p.rules ?? []);
  if (!rules.length) return undefined;

  return rules
    .map((rule) => {
      const value =
        rule.valueType?.toLowerCase() === "percentage"
          ? `${rule.value}% of stay`
          : rule.estimatedValue != null
            ? `${rule.estimatedValue}`
            : `${rule.value ?? ""}`;
      const end = rule.end ? formatPolicyDate(rule.end) : null;
      if (end) return `Cancellation penalty: ${value} (until ${end})`;
      return `Cancellation penalty: ${value}`;
    })
    .join(" · ");
}

function formatPolicyDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function mapRatePolicies(policies: RatePolicy[] | null | undefined): DisplayRatePolicy[] {
  if (!policies?.length) return [];
  return policies
    .map((p) => ({
      type: (p.type ?? "Policy").trim(),
      text: stripHtml(p.text) ?? "",
    }))
    .filter((p) => p.text);
}

function mapRateOffers(rate: RatePlan | undefined): DisplayRateOffer[] {
  if (!rate?.offers?.length) return [];
  return rate.offers
    .map((o) => ({
      title: (o.title ?? "Offer").trim(),
      description: (o.description ?? "").trim(),
    }))
    .filter((o) => o.title || o.description);
}

function bookingRoomIdFromRate(rate: RatePlan | undefined): string | null {
  if (!rate) return null;
  for (const occ of rate.occupancies ?? []) {
    if (occ.roomId) return String(occ.roomId);
  }
  return null;
}

function stdRoomIdFromRate(rate: RatePlan | undefined): string | null {
  if (!rate) return null;
  for (const occ of rate.occupancies ?? []) {
    if (occ.stdRoomId) return String(occ.stdRoomId);
  }
  if (rate.standardizedRoomId) return String(rate.standardizedRoomId);
  return null;
}

function inferRoomTypeLabel(roomName: string, explicitType?: string | null): string {
  const source = `${explicitType ?? ""} ${roomName}`.toLowerCase();
  if (source.includes("suite")) return "Suite";
  if (source.includes("family")) return "Family room";
  if (source.includes("superior")) return "Superior";
  if (source.includes("single") || source.includes("twin")) return "Single / Twin";
  if (source.includes("deluxe")) return "Deluxe";
  if (source.includes("standard")) return "Standard";
  if (source.includes("executive")) return "Executive";
  if (source.includes("studio")) return "Studio";
  if (source.includes("apartment")) return "Apartment";
  if (source.includes("double") || source.includes("queen") || source.includes("king")) {
    return "Double";
  }
  return explicitType?.trim() || "Guest room";
}

function bedSummary(
  room: RoomRaw | StandardizedRoom | undefined
): string | undefined {
  const std = room as StandardizedRoom | undefined;
  if (std?.bedInfo?.trim()) {
    return std.bedInfo
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/Bed$/i, " bed");
  }
  const beds = room?.beds;
  if (!beds?.length) return undefined;
  return beds
    .map((b) => {
      const count = b.count ?? 1;
      const type = (b.type ?? "Bed").replace(/([a-z])([A-Z])/g, "$1 $2");
      return `${count}× ${type}`;
    })
    .join(", ");
}

function stripHtml(html?: string | null): string | undefined {
  if (!html) return undefined;
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div|h[1-6])>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
  return text || undefined;
}

function parseGuestCount(...values: Array<number | string | null | undefined>): number | undefined {
  for (const v of values) {
    const n = toNumber(v);
    if (n != null && n > 0) return Math.round(n);
  }
  return undefined;
}

function collectViews(
  ...rooms: Array<RoomRaw | StandardizedRoom | undefined>
): string[] {
  const views = rooms.flatMap((r) => r?.views ?? []);
  return [...new Set(views.filter(Boolean))];
}

function buildRateOption(params: {
  recommendationId: string;
  rateIds: string[];
  roomId: string;
  totalRate: number;
  currency: string;
  primaryRate?: RatePlan;
}): DisplayRateOption {
  const { recommendationId, rateIds, roomId, totalRate, currency, primaryRate } =
    params;
  return {
    recommendationId,
    rateIds,
    roomId,
    totalRate,
    baseRate: primaryRate?.baseRate,
    publishedRate: primaryRate?.publishedRate,
    taxesAmount: sumTaxes(primaryRate),
    currency: primaryRate?.currency || currency,
    boardBasisLabel: boardBasisLabel(primaryRate?.boardBasis),
    boardBasisType: boardBasisType(primaryRate?.boardBasis),
    refundable: primaryRate ? isRefundable(primaryRate) : false,
    refundability: primaryRate?.refundability,
    providerName: primaryRate?.providerName,
    cancellationText: formatCancellationText(primaryRate?.cancellationPolicies),
    includes: [...(primaryRate?.includes ?? [])],
    offers: mapRateOffers(primaryRate),
    policies: mapRatePolicies(primaryRate?.policies),
    availability: toNumber(primaryRate?.availability),
    payAtHotel: primaryRate?.payAtHotel,
    cardRequired: primaryRate?.cardRequired,
    specialRequestSupported: primaryRate?.specialRequestSupported,
    depositRequired: primaryRate?.depositRequired,
    needsPriceCheck: primaryRate?.needsPriceCheck,
    isPackageRate: primaryRate?.isPackageRate,
  };
}

function buildRoomGroupMeta(params: {
  key: string;
  stdRoom?: StandardizedRoom;
  room?: RoomRaw;
}): Omit<DisplayRoomGroup, "options"> {
  const { key, stdRoom, room } = params;
  const roomName =
    stdRoom?.name ||
    room?.name ||
    stdRoom?.type ||
    room?.type ||
    "Guest room";
  const roomTypeLabel = inferRoomTypeLabel(
    roomName,
    stdRoom?.type || room?.type
  );

  const stdImages = collectRoomImages(stdRoom);
  const rawImages = collectRoomImages(room);
  // Prefer standardized room-type images (provider room photos).
  const images = [...new Set([...stdImages.urls, ...rawImages.urls])];
  const imageCaptions =
    stdImages.urls.length > 0 ? stdImages.captions : rawImages.captions;

  const facilities = [
    ...new Set([...collectFacilities(stdRoom), ...collectFacilities(room)]),
  ];

  return {
    key,
    roomName,
    roomTypeLabel,
    description: stripHtml(stdRoom?.description ?? room?.description ?? undefined),
    maxGuests: parseGuestCount(
      stdRoom?.maxGuestAllowed,
      stdRoom?.maxOccupancy,
      room?.maxGuestAllowed
    ),
    maxAdults: parseGuestCount(stdRoom?.maxAdultAllowed, room?.maxAdultAllowed),
    maxChildren: parseGuestCount(
      stdRoom?.maxChildrenAllowed,
      room?.maxChildrenAllowed
    ),
    bedSummary: bedSummary(stdRoom ?? room),
    imageUrl: roomImageUrl(stdRoom) || roomImageUrl(room),
    images,
    imageCaptions,
    facilities,
    areaLabel: formatAreaLabel(stdRoom) ?? formatAreaLabel(room),
    areaSqm: roomAreaSqm(stdRoom) ?? roomAreaSqm(room),
    views: collectViews(stdRoom, room),
    smokingAllowed:
      typeof room?.smokingAllowed === "boolean"
        ? room.smokingAllowed
        : typeof stdRoom?.smokingAllowed === "boolean"
          ? stdRoom.smokingAllowed
          : undefined,
  };
}

function sortGroups(groups: DisplayRoomGroup[]): DisplayRoomGroup[] {
  return groups
    .map((group) => ({
      ...group,
      options: [...group.options].sort((a, b) => a.totalRate - b.totalRate),
    }))
    .sort((a, b) => (a.options[0]?.totalRate ?? 0) - (b.options[0]?.totalRate ?? 0));
}

function groupFromStandardizedRoomGroups(
  hotel: RoomsAndRatesHotel,
  currency: string,
  groups: StandardizedRoomGroup[]
): DisplayRoomGroup[] {
  const ratesById = new Map(
    (hotel.rates ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );
  const roomsById = new Map(
    (hotel.rooms ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );
  const stdById = new Map(
    (hotel.standardizedRooms ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );
  const recsById = new Map(
    (hotel.recommendations ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );

  const result: DisplayRoomGroup[] = [];

  for (const group of groups) {
    const stdId =
      group.standardRoomIds?.[0] ||
      group.standardRoom?.id ||
      group.options?.[0]?.standardRooms?.[0]?.standardRoomId;
    if (!stdId) continue;

    const stdRoom = stdById.get(String(stdId)) || group.standardRoom;
    if (!stdRoom) continue;

    const options: DisplayRateOption[] = [];

    for (const opt of group.options ?? []) {
      if (!opt.recommendationId) continue;
      const rec = recsById.get(opt.recommendationId);
      const rateIds =
        opt.standardRooms?.[0]?.rateIds ??
        rec?.rates ??
        [];
      if (!rateIds.length) continue;

      const primaryRate = rateIds.map((id) => ratesById.get(id)).find(Boolean);
      const bookingRoomId =
        bookingRoomIdFromRate(primaryRate) ||
        String(stdId);

      const total =
        opt.totalRate ??
        opt.total ??
        opt.standardRooms?.[0]?.totalRate ??
        (rec ? recommendationTotal(rec, ratesById) : rateTotal(primaryRate));

      options.push(
        buildRateOption({
          recommendationId: opt.recommendationId,
          rateIds,
          roomId: bookingRoomId,
          totalRate: total,
          currency,
          primaryRate,
        })
      );
    }

    if (!options.length) continue;

    // Prefer matching rooms[] entry via first rate occupancy for smoking/views merge.
    const firstRate = ratesById.get(options[0].rateIds[0]);
    const room = bookingRoomIdFromRate(firstRate)
      ? roomsById.get(bookingRoomIdFromRate(firstRate)!)
      : undefined;

    result.push({
      ...buildRoomGroupMeta({
        key: `std-${stdId}`,
        stdRoom,
        room,
      }),
      options,
    });
  }

  return sortGroups(result);
}

/**
 * Build UI-friendly room groups from ZentrumHub rooms + rates + recommendations.
 * Prefers standardizedRoomGroups + standardizedRooms (correct room-type images).
 */
export function buildDisplayRoomGroups(
  response: RoomsAndRatesResponse | null | undefined
): DisplayRoomGroup[] {
  const hotel = response?.hotel;
  if (!hotel) return [];

  const currency = response?.currency ?? "USD";

  if (hotel.standardizedRoomGroups?.length && hotel.standardizedRooms?.length) {
    const fromGroups = groupFromStandardizedRoomGroups(
      hotel,
      currency,
      hotel.standardizedRoomGroups
    );
    if (fromGroups.length) return fromGroups;
  }

  const ratesById = new Map(
    (hotel.rates ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );
  const roomsById = new Map(
    (hotel.rooms ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );
  const stdById = new Map(
    (hotel.standardizedRooms ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );

  const recommendations = hotel.recommendations ?? [];
  if (!recommendations.length && hotel.rates?.length) {
    return groupFromRates(hotel, currency);
  }

  const grouped = new Map<string, DisplayRoomGroup>();

  for (const rec of recommendations) {
    if (!rec.id) continue;
    const rateIds = rec.rates ?? [];
    const primaryRate = rateIds.map((id) => ratesById.get(id)).find(Boolean);

    const stdId =
      stdRoomIdFromRate(primaryRate) ||
      (rec.roomId && stdById.has(String(rec.roomId))
        ? String(rec.roomId)
        : null);
    const bookingRoomId =
      bookingRoomIdFromRate(primaryRate) ||
      (rec.roomId && roomsById.has(String(rec.roomId))
        ? String(rec.roomId)
        : null) ||
      stdId;

    if (!bookingRoomId) continue;

    const room = roomsById.get(bookingRoomId);
    const stdRoom = (stdId && stdById.get(stdId)) || undefined;
    const groupKey = stdId ? `std-${stdId}` : `room-${bookingRoomId}`;

    const option = buildRateOption({
      recommendationId: rec.id,
      rateIds,
      roomId: bookingRoomId,
      totalRate: recommendationTotal(rec, ratesById),
      currency,
      primaryRate,
    });

    const existing = grouped.get(groupKey);
    if (existing) {
      existing.options.push(option);
    } else {
      grouped.set(groupKey, {
        ...buildRoomGroupMeta({
          key: groupKey,
          stdRoom,
          room,
        }),
        options: [option],
      });
    }
  }

  return sortGroups(Array.from(grouped.values()));
}

function groupFromRates(
  hotel: RoomsAndRatesHotel,
  currency: string
): DisplayRoomGroup[] {
  const roomsById = new Map(
    (hotel.rooms ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );
  const stdById = new Map(
    (hotel.standardizedRooms ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );
  const grouped = new Map<string, DisplayRoomGroup>();

  for (const rate of hotel.rates ?? []) {
    if (!rate.id) continue;
    const stdId = stdRoomIdFromRate(rate);
    const bookingRoomId = bookingRoomIdFromRate(rate) || stdId;
    if (!bookingRoomId) continue;

    const room = roomsById.get(bookingRoomId);
    const stdRoom = (stdId && stdById.get(stdId)) || undefined;
    const groupKey = stdId ? `std-${stdId}` : `room-${bookingRoomId}`;

    const option = buildRateOption({
      recommendationId: rate.id,
      rateIds: [rate.id],
      roomId: bookingRoomId,
      totalRate: rateTotal(rate),
      currency,
      primaryRate: rate,
    });

    const existing = grouped.get(groupKey);
    if (existing) existing.options.push(option);
    else {
      grouped.set(groupKey, {
        ...buildRoomGroupMeta({ key: groupKey, stdRoom, room }),
        options: [option],
      });
    }
  }

  return sortGroups(Array.from(grouped.values()));
}

export function findDisplayOption(
  groups: DisplayRoomGroup[],
  recommendationId: string
): { group: DisplayRoomGroup; option: DisplayRateOption } | null {
  for (const group of groups) {
    const option = group.options.find((o) => o.recommendationId === recommendationId);
    if (option) return { group, option };
  }
  return null;
}

/** Unique house-rule style policies extracted from all rates (for Policies tab). */
export function extractRatePolicies(
  response: RoomsAndRatesResponse | null | undefined
): DisplayRatePolicy[] {
  const rates = response?.hotel?.rates ?? [];
  const byType = new Map<string, DisplayRatePolicy>();
  for (const rate of rates) {
    for (const policy of mapRatePolicies(rate.policies)) {
      if (!byType.has(policy.type)) byType.set(policy.type, policy);
    }
  }
  return Array.from(byType.values());
}
