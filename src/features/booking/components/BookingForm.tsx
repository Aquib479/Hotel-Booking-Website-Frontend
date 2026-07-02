import type { BookingFormValues } from '../types';

export function BookingForm({ values }: { values: BookingFormValues }) {
  return <form className="rounded-lg border p-4">{values.hotelId}</form>;
}
