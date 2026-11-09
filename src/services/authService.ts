import { apiRequest } from "./api";

export interface AuthUser {
  id_user: number;
  nama: string;
  email: string;
  no_hp: string;
  role: "user" | "admin";
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface RegisterPayload {
  nama: string;
  email: string;
  no_hp: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  user: AuthUser;
}

// Registrasi pelanggan baru.

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthUser> => {
  const response = await apiRequest<ApiResponse<AuthUser>>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// Login pelanggan menggunakan email dan password.

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResult> => {
  const response = await apiRequest<ApiResponse<LoginResult>>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};