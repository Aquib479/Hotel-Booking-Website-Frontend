import type { Hotel } from '../types';
import { HotelCard } from './HotelCard';

export function HotelList({ hotels }: { hotels: Hotel[] }) {
  return (
    <div className="space-y-3">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
