export function useBooking() {
  return {
    submitBooking: async () => ({ success: true }),
    isSubmitting: false,
  };
}
