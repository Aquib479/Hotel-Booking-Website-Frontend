export const api = {
  get: async <T>(url: string): Promise<T> => {
    console.info('GET', url);
    return [] as T;
  },
  post: async <T>(url: string, data: unknown): Promise<T> => {
    console.info('POST', url, data);
    return { success: true } as T;
  },
};
