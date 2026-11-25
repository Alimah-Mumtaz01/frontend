import { apiRequest, extractList } from "./api";

/**
 * Jenis metode pembayaran.
 */
export type PaymentMethodType =
  | "transfer_bank"
  | "e-wallet";

/**
 * Status metode pembayaran.
 */
export type PaymentMethodStatus =
  | "aktif"
  | "nonaktif";

/**
 * Struktur data metode pembayaran.
 */
export interface PaymentMethod {
  id_metode_pembayaran: number;
  jenis_metode: PaymentMethodType;
  nama_bank: string | null;
  jenis_e_wallet: string | null;
  nomor_rekening: string;
  username: string;
  status: PaymentMethodStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Data yang dikirim ketika menambahkan
 * atau mengubah metode pembayaran.
 */
export interface PaymentMethodInput {
  jenis_metode: PaymentMethodType;
  nama_bank?: string | null;
  jenis_e_wallet?: string | null;
  nomor_rekening: string;
  username: string;
}

/**
 * Data untuk mengubah status metode pembayaran.
 */
export interface PaymentMethodStatusInput {
  status: PaymentMethodStatus;
}

/**
 * Bentuk response API.
 */
interface PaymentMethodResponse {
  message?: string;
  data?: PaymentMethod;
}

/**
 * Mengambil seluruh metode pembayaran.
 * Endpoint khusus admin.
 */
export async function getAllPaymentMethods(): Promise<
  PaymentMethod[]
> {
  const response = await apiRequest<unknown>(
    "/payment-methods",
    {
      method: "GET",
    }
  );

  return extractList<PaymentMethod>(response);
}

/**
 * Menambahkan metode pembayaran baru.
 */
export async function createPaymentMethod(
  data: PaymentMethodInput
): Promise<PaymentMethodResponse> {
  return apiRequest<PaymentMethodResponse>(
    "/payment-methods",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Mengubah data metode pembayaran.
 */
export async function updatePaymentMethod(
  id_metode_pembayaran: number,
  data: PaymentMethodInput
): Promise<PaymentMethodResponse> {
  return apiRequest<PaymentMethodResponse>(
    `/payment-methods/${id_metode_pembayaran}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Mengaktifkan atau menonaktifkan metode pembayaran.
 */
export async function updatePaymentMethodStatus(
  id_metode_pembayaran: number,
  data: PaymentMethodStatusInput
): Promise<PaymentMethodResponse> {
  return apiRequest<PaymentMethodResponse>(
    `/payment-methods/${id_metode_pembayaran}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Menghapus metode pembayaran.
 */
export async function deletePaymentMethod(
  id_metode_pembayaran: number
): Promise<{ message?: string }> {
  return apiRequest<{ message?: string }>(
    `/payment-methods/${id_metode_pembayaran}`,
    {
      method: "DELETE",
    }
  );
}