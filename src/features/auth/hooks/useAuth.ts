export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    login: async () => undefined,
    logout: () => undefined,
  };
}
