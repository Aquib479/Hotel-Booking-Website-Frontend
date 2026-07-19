import { getAvailableSlots, supportsRestMode } from "@/lib/booking/availability";
import { getPropertyById } from "@/features/property/data";
import { MOCK_PROPERTIES } from "@/features/search/constants";
import type { Property } from "@/features/search/types";
import type { RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";
import {
  MOCK_COMMISSION_RATE,
  MOCK_STAFF_CREDENTIALS,
  STAFF_ROOM_LOCKS_KEY,
  STAFF_WALKINS_STORAGE_KEY,
} from "./constants";
import type {
  CommissionSummary,
  StaffPropertyScope,
  StaffUser,
  WalkInBookingResult,
  WalkInGuestDetails,
  WalkInPaymentMethod,
  WalkInRecord,
  WalkInRoom,
} from "./types";

function propertyLocalCurrency(property: Property): CurrencyCode {
  if (property.country === "India") return "IDR";
  if (property.country === "United Kingdom") return "GBP";
  if (property.country === "UAE") return "USD";
  if (property.country === "Singapore") return "SGD";
  return "USD";
}

function propertySlotRate(property: Property): number {
  const currency = propertyLocalCurrency(property);
  if (currency === "IDR") return property.priceIdr;
  if (currency === "GBP") return Math.round(property.priceUsd * 0.79);
  return property.priceUsd;
}

function toStaffProperty(property: Property): StaffPropertyScope {
  return {
    propertyId: property.id,
    propertyName: property.title,
    city: property.city,
    country: property.country,
    timezone: property.timezone,
    localCurrency: propertyLocalCurrency(property),
    baseSlotRate: propertySlotRate(property),
  };
}

const STAFF_PROPERTY = MOCK_PROPERTIES.find((p) => p.id === "1")!;

export const MOCK_STAFF_USER: StaffUser = {
  id: "staff-1",
  displayName: "Priya Sharma",
  email: MOCK_STAFF_CREDENTIALS.email,
  property: toStaffProperty(STAFF_PROPERTY),
};

function todayYmd(timezone: string): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: timezone });
}

interface RoomLock {
  propertyId: string;
  roomId: string;
  slot: RestSlot;
  dateYmd: string;
}

function readRoomLocks(): RoomLock[] {
  try {
    const raw = localStorage.getItem(STAFF_ROOM_LOCKS_KEY);
    return raw ? (JSON.parse(raw) as RoomLock[]) : [];
  } catch {
    return [];
  }
}

function writeRoomLocks(locks: RoomLock[]) {
  localStorage.setItem(STAFF_ROOM_LOCKS_KEY, JSON.stringify(locks));
}

function readWalkIns(): WalkInRecord[] {
  try {
    const raw = localStorage.getItem(STAFF_WALKINS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WalkInRecord[]) : [];
  } catch {
    return [];
  }
}

function writeWalkIns(records: WalkInRecord[]) {
  localStorage.setItem(STAFF_WALKINS_STORAGE_KEY, JSON.stringify(records));
}

function generateRoomInventory(property: Property, now = new Date()): WalkInRoom[] {
  if (!supportsRestMode(property)) return [];

  const count = property.ringFencedRooms ?? 4;
  const allSlots = getAvailableSlots(now, property.timezone, now);
  const dateYmd = todayYmd(property.timezone);
  const locks = readRoomLocks().filter(
    (l) => l.propertyId === property.id && l.dateYmd === dateYmd
  );

  const currency = propertyLocalCurrency(property);
  const rate = propertySlotRate(property);

  return Array.from({ length: count }, (_, i) => {
    const roomNumber = String(101 + i);
    const roomId = `${property.id}-r${roomNumber}`;
    const lockedSlots = new Set(
      locks.filter((l) => l.roomId === roomId).map((l) => l.slot)
    );
    const availableSlots = allSlots.filter((s) => !lockedSlots.has(s));

    return {
      id: roomId,
      roomNumber,
      label: `Room ${roomNumber}`,
      roomType: property.roomType,
      availableSlots,
      rateAmount: rate,
      rateCurrency: currency,
    };
  }).filter((r) => r.availableSlots.length > 0);
}

export async function staffLogin(
  email: string,
  password: string
): Promise<{ success: true; user: StaffUser } | { success: false; error: string }> {
  await new Promise((r) => setTimeout(r, 500));

  if (
    email.trim().toLowerCase() === MOCK_STAFF_CREDENTIALS.email &&
    password === MOCK_STAFF_CREDENTIALS.password
  ) {
    return { success: true, user: MOCK_STAFF_USER };
  }

  return { success: false, error: "Invalid staff credentials" };
}

export async function fetchAvailableRooms(
  propertyId: string,
  now = new Date()
): Promise<WalkInRoom[]> {
  await new Promise((r) => setTimeout(r, 300));

  const property = MOCK_PROPERTIES.find((p) => p.id === propertyId);
  if (!property || property.id !== propertyId) return [];

  return generateRoomInventory(property, now);
}

export async function submitWalkInBooking(params: {
  staff: StaffUser;
  room: WalkInRoom;
  slot: RestSlot;
  guest: WalkInGuestDetails;
  paymentMethod: WalkInPaymentMethod;
}): Promise<WalkInBookingResult> {
  await new Promise((r) => setTimeout(r, 700));

  const { staff, room, slot, guest, paymentMethod } = params;
  const dateYmd = todayYmd(staff.property.timezone);
  const id = `wi-${Date.now()}`;
  const confirmationCode = `RH-W${id.slice(-6).toUpperCase()}`;

  const commissionAmount = Math.round(room.rateAmount * MOCK_COMMISSION_RATE);

  const locks = readRoomLocks();
  locks.push({
    propertyId: staff.property.propertyId,
    roomId: room.id,
    slot,
    dateYmd,
  });
  writeRoomLocks(locks);

  const record: WalkInRecord = {
    id,
    confirmationCode,
    guestName: guest.fullName,
    roomNumber: room.roomNumber,
    slot,
    slotDate: new Date().toISOString(),
    amount: room.rateAmount,
    currency: room.rateCurrency,
    paymentMethod,
    commissionAmount,
    staffId: staff.id,
    staffName: staff.displayName,
    propertyId: staff.property.propertyId,
    createdAt: new Date().toISOString(),
  };

  const existing = readWalkIns();
  writeWalkIns([record, ...existing]);

  return {
    success: true,
    bookingId: id,
    confirmationCode,
    commissionAmount,
    commissionCurrency: room.rateCurrency,
  };
}

export async function fetchCommissionSummary(
  staff: StaffUser,
  now = new Date()
): Promise<CommissionSummary> {
  await new Promise((r) => setTimeout(r, 250));

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const todayWalkIns = readWalkIns().filter(
    (w) =>
      w.staffId === staff.id &&
      w.propertyId === staff.property.propertyId &&
      new Date(w.createdAt) >= todayStart
  );

  const totalRevenue = todayWalkIns.reduce((sum, w) => sum + w.amount, 0);
  const totalCommission = todayWalkIns.reduce((sum, w) => sum + w.commissionAmount, 0);

  return {
    walkInCount: todayWalkIns.length,
    totalRevenue,
    totalCommission,
    currency: staff.property.localCurrency,
    periodLabel: "Today",
  };
}

export async function fetchRecentWalkIns(
  staff: StaffUser,
  limit = 10
): Promise<WalkInRecord[]> {
  await new Promise((r) => setTimeout(r, 200));

  return readWalkIns()
    .filter((w) => w.staffId === staff.id && w.propertyId === staff.property.propertyId)
    .slice(0, limit);
}

export function getStaffPropertyDetail(propertyId: string) {
  return getPropertyById(propertyId);
}
