import { apiRequest } from "./api";

import type { CartItem } from "../types/cart";

/**
 * Tipe metode pengiriman.
 */
export type ShippingType = "pickup" | "delivery";

/**
 * Sumber alamat pengiriman.
 * profile = menggunakan alamat utama dari profil.
 * custom = menggunakan alamat khusus untuk pesanan ini.
 */
export type AddressSource = "profile" | "custom";

/**
 * Format varian untuk request checkout.
 */
export interface CheckoutVariantRequest {
  id_varian: number;
  jumlah: number;
}

/**
 * Format item untuk request checkout.
 */
export interface CheckoutItemRequest {
  id_product: number;
  quantity: number;
  variants: CheckoutVariantRequest[];
}

/**
 * Format request preview checkout.
 */
export interface CheckoutRequest {
  tipe_pengiriman: ShippingType;

  // Pilihan sumber alamat.
  address_source?: AddressSource | null;

  // Digunakan jika address_source = custom.
  nama_penerima?: string | null;
  no_hp_penerima?: string | null;
  alamat_pengiriman?: string | null;
  catatan_alamat_pengiriman?: string | null;

  catatan: string | null;
  items: CheckoutItemRequest[];
}

/**
 * Response varian dari backend.
 */
export interface CheckoutVariantResponse {
  id_varian: number;
  nama_varian: string;
  jumlah: number;
  stok: number;
}

/**
 * Response produk dari backend.
 */
export interface CheckoutProductResponse {
  id_product: number;
  nama_product: string;
  gambar?: string | null;
  jumlah_isi: number;
  quantity: number;
  harga_satuan: number;
  total_harga: number;
  variants: CheckoutVariantResponse[];
}

/**
 * Response hasil preview checkout.
 */
export interface CheckoutPreview {
  tipe_pengiriman: ShippingType;
  address_source?: AddressSource | null;

  nama_penerima?: string | null;
  no_hp_penerima?: string | null;
  alamat_pengiriman: string | null;
  catatan_alamat_pengiriman?: string | null;

  jarak_pengiriman?: number | null;
  displayName?: string | null;

  catatan: string | null;
  subtotal: number;
  ongkir: number;
  total_harga: number;

  items: {
    product: CheckoutProductResponse;
  }[];
}

/**
 * Format response API.
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const mapCartToCheckoutItems = (
  cartItems: CartItem[]
): CheckoutItemRequest[] => {
  return cartItems.map((item) => ({
    id_product: item.id_product,
    quantity: item.quantity,

    variants: item.variants.map((variant) => ({
      id_varian: variant.id_varian,
      jumlah: variant.jumlah * item.quantity,
    })),
  }));
};

/**
 * Membuat request preview checkout.
 *
 * Endpoint:
 * POST /checkout/preview
 *
 * Tidak membuat pesanan dan tidak mengurangi stok.
 */
export const previewCheckout = async (
  payload: CheckoutRequest
): Promise<CheckoutPreview> => {
  const response = await apiRequest<ApiResponse<CheckoutPreview>>(
    "/checkout/preview",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Gagal menghitung checkout."
    );
  }

  return response.data;
};