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

export interface AppLog {
  _id: string;
  timestamp: string;
  level: string;
  message: string;
  meta: {
    method: string;
    url: string;
    status: number;
    response_time: number;
    ip: string;
    origin: string;
    host: string;
    userAgent: string;
    body: any;
  };
}
