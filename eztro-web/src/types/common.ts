export interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  error_log?: any;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  status: number | null;
  response?: any;
}
