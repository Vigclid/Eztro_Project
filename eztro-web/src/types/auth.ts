export interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  roleName?: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: any;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: any;
}
