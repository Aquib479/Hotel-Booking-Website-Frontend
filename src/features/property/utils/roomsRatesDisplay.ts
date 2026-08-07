import type {
  RatePlan,
  Recommendation,
  RoomsAndRatesHotel,
  RoomsAndRatesResponse,
  RoomRaw,
  StandardizedRoom,
} from "@/services/zentrumhub";

export interface DisplayRateOption {
  recommendationId: string;
  rateIds: string[];
  /** Required by Book API roomsAllocations[].roomId */
  roomId: string;
  totalRate: number;
  currency: string;
  boardBasisLabel: string;
  refundable: boolean;
  providerName?: string | null;
  cancellationText?: string | null;
}

export interface DisplayRoomGroup {
  key: string;
  roomName: string;
  roomTypeLabel: string;
  description?: string;
  maxGuests?: number;
  bedSummary?: string;
  imageUrl?: string;
  images: string[];
  facilities: string[];
  areaSqm?: number;
  options: DisplayRateOption[];
}

function collectRoomImages(
  room: RoomRaw | StandardizedRoom | undefined
): string[] {
  const images = (room as { images?: Array<{ url?: string | null } | string> | null })
    ?.images;
  if (!images?.length) return [];
  return images
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter((u): u is string => Boolean(u));
}

function roomImageUrl(
  room: RoomRaw | StandardizedRoom | undefined
): string | undefined {
  return collectRoomImages(room)[0];
}

function collectFacilities(
  room: RoomRaw | StandardizedRoom | undefined
): string[] {
  const raw = (room as { facilities?: Array<{ name?: string | null } | string> | null })
    ?.facilities;
  if (!raw?.length) return [];
  return raw
    .map((f) => (typeof f === "string" ? f : f?.name))
    .filter((n): n is string => Boolean(n?.trim()))
    .slice(0, 8);
}

function roomAreaSqm(
  room: RoomRaw | StandardizedRoom | undefined
): number | undefined {
  const area = (room as { area?: number | string | null; areaSquareMeters?: number | null })
    ?.areaSquareMeters ?? (room as { area?: number | string | null })?.area;
  if (typeof area === "number" && area > 0) return area;
  if (typeof area === "string") {
    const n = Number.parseFloat(area);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function boardBasisLabel(boardBasis: RatePlan["boardBasis"] | unknown): string {
  if (!boardBasis) return "Room only";
  if (typeof boardBasis === "string") return boardBasis;
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

function isRefundable(rate: RatePlan): boolean {
  if (typeof rate.isRefundable === "boolean") return rate.isRefundable;
  const raw = rate as RatePlan & { refundable?: boolean; refundability?: string };
  if (typeof raw.refundable === "boolean") return raw.refundable;
  return (raw.refundability ?? "").toLowerCase() === "refundable";
}

function rateTotal(rate: RatePlan | undefined): number {
  if (!rate) return 0;
  if (typeof rate.totalRate === "number" && rate.totalRate > 0) return rate.totalRate;
  if (typeof rate.publishedRate === "number" && rate.publishedRate > 0) return rate.publishedRate;
  if (typeof rate.baseRate === "number" && rate.baseRate > 0) return rate.baseRate;
  return 0;
}

function recommendationTotal(rec: Recommendation, ratesById: Map<string, RatePlan>): number {
  const totals = (rec.rates ?? []).map((id) => rateTotal(ratesById.get(id)));
  return totals.reduce((sum, n) => sum + n, 0);
}

function roomIdFromRate(rate: RatePlan | undefined): string | null {
  if (!rate) return null;
  const occupancies = rate.occupancies ?? [];
  for (const occ of occupancies) {
    const id = occ.roomId || occ.stdRoomId;
    if (id) return String(id);
  }
  if (rate.standardizedRoomId) return String(rate.standardizedRoomId);
  return null;
}

function resolveRoomId(
  rec: Recommendation | undefined,
  rate: RatePlan | undefined
): string | null {
  if (rec?.roomId) return String(rec.roomId);
  return roomIdFromRate(rate);
}

function inferRoomTypeLabel(roomName: string, explicitType?: string | null): string {
  const source = `${explicitType ?? ""} ${roomName}`.toLowerCase();
  if (source.includes("suite")) return "Suite";
  if (source.includes("family")) return "Family room";
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

function bedSummary(room: RoomRaw | StandardizedRoom | undefined): string | undefined {
  const beds = (room as { beds?: Array<{ type?: string | null; count?: number | string | null }> })
    ?.beds;
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
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text || undefined;
}

/**
 * Build UI-friendly room groups from ZentrumHub rooms + rates + recommendations.
 * Prices live on rates; recommendations only reference rate ids.
 */
export function buildDisplayRoomGroups(
  response: RoomsAndRatesResponse | null | undefined
): DisplayRoomGroup[] {
  const hotel = response?.hotel;
  if (!hotel) return [];

  const currency = response?.currency ?? "USD";
  const ratesById = new Map((hotel.rates ?? []).filter((r) => r.id).map((r) => [r.id!, r]));
  const roomsById = new Map((hotel.rooms ?? []).filter((r) => r.id).map((r) => [r.id!, r]));
  const stdById = new Map(
    (hotel.standardizedRooms ?? []).filter((r) => r.id).map((r) => [r.id!, r])
  );

  const recommendations = hotel.recommendations ?? [];
  if (!recommendations.length && hotel.rates?.length) {
    // Fallback: treat each rate as its own option
    return groupFromRates(hotel, currency);
  }

  const grouped = new Map<string, DisplayRoomGroup>();

  for (const rec of recommendations) {
    if (!rec.id) continue;
    const rateIds = rec.rates ?? [];
    const primaryRate = rateIds.map((id) => ratesById.get(id)).find(Boolean);
    const roomId =
      resolveRoomId(rec, primaryRate) ||
      (hotel.rooms?.length === 1 && hotel.rooms[0]?.id
        ? String(hotel.rooms[0].id)
        : null) ||
      (hotel.standardizedRooms?.length === 1 && hotel.standardizedRooms[0]?.id
        ? String(hotel.standardizedRooms[0].id)
        : null);
    if (!roomId) continue;

    const room = roomsById.get(roomId) || stdById.get(roomId) || undefined;
    const stdRoom =
      (primaryRate?.standardizedRoomId && stdById.get(primaryRate.standardizedRoomId)) ||
      stdById.get(roomId);

    const roomName =
      stdRoom?.name ||
      room?.name ||
      (room as { type?: string } | undefined)?.type ||
      "Guest room";
    const roomTypeLabel = inferRoomTypeLabel(
      roomName,
      (room as { type?: string | null } | undefined)?.type
    );
    const key = roomId || stdRoom?.id || roomName;

    const option: DisplayRateOption = {
      recommendationId: rec.id,
      rateIds,
      roomId,
      totalRate: recommendationTotal(rec, ratesById),
      currency: (primaryRate as { currency?: string } | undefined)?.currency || currency,
      boardBasisLabel: boardBasisLabel(primaryRate?.boardBasis),
      refundable: primaryRate ? isRefundable(primaryRate) : false,
      providerName: primaryRate?.providerName,
      cancellationText: primaryRate?.cancellationPolicies?.[0]?.text,
    };

    const existing = grouped.get(key);
    if (existing) {
      existing.options.push(option);
    } else {
      grouped.set(key, {
        key,
        roomName,
        roomTypeLabel,
        description: stripHtml(room?.description ?? undefined),
        maxGuests:
          (room as { maxGuestAllowed?: number } | undefined)?.maxGuestAllowed ??
          (stdRoom as { maxGuestAllowed?: number } | undefined)?.maxGuestAllowed ??
          undefined,
        bedSummary: bedSummary(stdRoom ?? room),
        imageUrl: roomImageUrl(room) || roomImageUrl(stdRoom),
        images: [
          ...new Set([
            ...collectRoomImages(room),
            ...collectRoomImages(stdRoom),
          ]),
        ],
        facilities: [
          ...new Set([
            ...collectFacilities(room),
            ...collectFacilities(stdRoom),
          ]),
        ].slice(0, 8),
        areaSqm: roomAreaSqm(room) ?? roomAreaSqm(stdRoom),
        options: [option],
      });
    }
  }

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      options: [...group.options].sort((a, b) => a.totalRate - b.totalRate),
    }))
    .sort((a, b) => (a.options[0]?.totalRate ?? 0) - (b.options[0]?.totalRate ?? 0));
}

function groupFromRates(hotel: RoomsAndRatesHotel, currency: string): DisplayRoomGroup[] {
  const roomsById = new Map((hotel.rooms ?? []).filter((r) => r.id).map((r) => [r.id!, r]));
  const grouped = new Map<string, DisplayRoomGroup>();

  for (const rate of hotel.rates ?? []) {
    if (!rate.id) continue;
    const roomId = roomIdFromRate(rate);
    if (!roomId) continue;
    const room = roomsById.get(roomId);
    const roomName = room?.name || "Guest room";
    const key = roomId || rate.id;
    const option: DisplayRateOption = {
      recommendationId: rate.id,
      rateIds: [rate.id],
      roomId,
      totalRate: rateTotal(rate),
      currency: (rate as { currency?: string }).currency || currency,
      boardBasisLabel: boardBasisLabel(rate.boardBasis),
      refundable: isRefundable(rate),
      providerName: rate.providerName,
    };
    const existing = grouped.get(key);
    if (existing) existing.options.push(option);
    else {
      grouped.set(key, {
        key,
        roomName,
        roomTypeLabel: inferRoomTypeLabel(roomName, (room as { type?: string })?.type),
        description: stripHtml(room?.description),
        imageUrl: roomImageUrl(room),
        images: collectRoomImages(room),
        facilities: collectFacilities(room),
        areaSqm: roomAreaSqm(room),
        options: [option],
      });
    }
  }

  return Array.from(grouped.values());
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
