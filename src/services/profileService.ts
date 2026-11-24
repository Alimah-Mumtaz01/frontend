import { apiRequest } from "./api";

/**
 * Format alamat utama customer.
 */
export interface PrimaryAddress {
  id_address: number;
  id_user: number;
  nama_penerima: string;
  no_hp: string;
  alamat: string;
  latitude: number | null;
  longitude: number | null;
  catatan: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Format data profil customer.
 */
export interface CustomerProfile {
  id_user: number;
  nama: string;
  email: string;
  no_hp?: string | null;
  role: string;
  address: PrimaryAddress | null;
}

/**
 * Format data untuk menyimpan alamat utama.
 */
export interface SaveAddressRequest {
  nama_penerima: string;
  no_hp: string;
  alamat: string;
  latitude?: number | null;
  longitude?: number | null;
  catatan?: string | null;
}

/**
 * Format response API.
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Mengambil profil customer yang sedang login.
 *
 * Endpoint:
 * GET /profile
 */
export const getProfile = async (): Promise<CustomerProfile> => {
  const response = await apiRequest<ApiResponse<CustomerProfile>>(
    "/profile",
    {
      method: "GET",
    }
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Gagal mengambil data profil."
    );
  }

  return response.data;
};

/**
 * Menyimpan atau memperbarui alamat utama customer.
 *
 * Endpoint:
 * PUT /profile/address
 */
export const savePrimaryAddress = async (
  payload: SaveAddressRequest
): Promise<PrimaryAddress> => {
  const response = await apiRequest<ApiResponse<PrimaryAddress>>(
    "/profile/address",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Gagal menyimpan alamat."
    );
  }

  return response.data;
};