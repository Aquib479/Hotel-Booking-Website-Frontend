import type { Hotel } from './types';

export async function getHotels(): Promise<Hotel[]> {
  return [];
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  console.info('Fetching hotel', id);
  return null;
}
