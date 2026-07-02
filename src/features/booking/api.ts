import type { BookingFormValues } from './types';

export async function createBooking(values: BookingFormValues) {
  console.info('Creating booking', values);
  return { success: true };
}
