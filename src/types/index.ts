export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
