import type { Hotel } from '../types';

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return <article className="rounded-lg border p-4">{hotel.name}</article>;
}
