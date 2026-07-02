export const searchQueryValidator = (value: string) => value.trim().length >= 2;
export const guestCountValidator = (value: number) => value > 0 && value <= 8;
