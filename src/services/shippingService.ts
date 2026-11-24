import { apiRequest } from "./api";

/**
 * Format request perhitungan ongkir.
 */
export interface ShippingCalculateRequest {
  address: string;
}

/**
 * Format hasil perhitungan ongkir.
 */
export interface ShippingCalculateResponse {
  available: boolean;
  displayName?: string | null;
  distanceKm: number | null;
  shippingCost: number | null;
  message: string;
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
 * Menghitung ongkir berdasarkan alamat customer.
 *
 * Endpoint:
 * POST /shipping/calculate
 */
export const calculateShipping = async (
  address: string
): Promise<ShippingCalculateResponse> => {
  const response = await apiRequest<
    ApiResponse<ShippingCalculateResponse>
  >("/shipping/calculate", {
    method: "POST",
    body: JSON.stringify({
      address,
    }),
  });

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Gagal menghitung ongkir."
    );
  }

  return response.data;
};