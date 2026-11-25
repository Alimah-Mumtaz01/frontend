import { apiRequest } from "./api";

export type CustomerOrderStatus =
    | "menunggu_konfirmasi"
    | "pesanan_diterima"
    | "menunggu_pembayaran"
    | "pembayaran_diperiksa"
    | "pembayaran_ditolak"
    | "dibatalkan"
    | "diproses"
    | "siap_diambil"
    | "sedang_dikirim"
    | "selesai";

/**
 * Tipe metode pembayaran.
 */
export type PaymentMethodType = "transfer_bank" | "e-wallet";

/**
 * Data metode pembayaran dari database.
 */
export interface CustomerPaymentMethod {
    id_metode_pembayaran: number;
    jenis_metode: PaymentMethodType;
    nama_bank?: string | null;
    jenis_e_wallet?: string | null;
    nomor_rekening: string;
    username: string;
    status: "aktif" | "nonaktif";
    createdAt?: string;
    updatedAt?: string;
}

export interface CustomerOrderVariant {
    id_order_item_variant: number;
    id_varian: number;
    jumlah: number;
    varian?: {
        id_varian: number;
        nama_varian: string;
    };
}

export interface CustomerOrderItem {
    id_order_item: number;
    id_product: number;
    quantity: number;
    harga_satuan: number;
    total_harga: number;
    product?: {
        id_product: number;
        nama_product: string;
        jumlah_isi: number;
        gambar?: string | null;
    };
    variants?: CustomerOrderVariant[];
}

export interface CustomerPayment {
    id_payment: number;
    id_order: number;
    id_metode_pembayaran?: number | null;
    metode_pembayaran: PaymentMethodType;

    // Snapshot detail metode pembayaran.
    nama_metode_snapshot?: string | null;
    nomor_rekening_snapshot?: string | null;
    username_snapshot?: string | null;

    bukti_pembayaran?: string | null;
    status_payment: "pending" | "verified" | "rejected";
    verified_at?: string | null;
    catatan_verifikasi?: string | null;
}

export interface CustomerOrderReview {
    id_review: number;
    rating: number;
}

export interface CustomerOrder {
    id_order: number;
    id_user: number;

    // Informasi pengiriman.
    tipe_pengiriman: "pickup" | "delivery";
    nama_penerima?: string | null;
    no_hp_penerima?: string | null;
    alamat_pengiriman?: string | null;
    catatan_alamat_pengiriman?: string | null;

    // Snapshot koordinat dan jarak pengiriman.
    latitude_pengiriman?: number | string | null;
    longitude_pengiriman?: number | string | null;
    jarak_pengiriman?: number | string | null;

    // Informasi pembayaran.
    catatan?: string | null;
    subtotal: number;
    ongkir: number;
    total_harga: number;

    status_order: CustomerOrderStatus;
    alasan_pembatalan?: string | null;
    createdAt: string;
    updatedAt?: string;

    orderItems?: CustomerOrderItem[];
    payment?: CustomerPayment | null;
    review?: CustomerOrderReview | null;
}

export interface CustomerOrderShippingUpdate {
    id_order: number;
    tipe_pengiriman: "pickup" | "delivery";
    nama_penerima?: string | null;
    no_hp_penerima?: string | null;
    alamat_pengiriman: string | null;
    catatan_alamat_pengiriman?: string | null;
    jarak_pengiriman?: number | string | null;
    subtotal: number;
    ongkir: number;
    total_harga: number;
}

export interface CustomerOrderShippingRequest {
    tipe_pengiriman: "pickup" | "delivery";
    address_source?: "profile" | "custom";
    nama_penerima?: string | null;
    no_hp_penerima?: string | null;
    alamat_pengiriman?: string | null;
    catatan_alamat_pengiriman?: string | null;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Mengambil seluruh pesanan milik customer yang sedang login.
 */
export const getMyOrders = async (): Promise<CustomerOrder[]> => {
    const response = await apiRequest<ApiResponse<CustomerOrder[]>>(
        "/orders/my-orders",
        {
            method: "GET",
        }
    );

    if (!response.success || !Array.isArray(response.data)) {
        throw new Error(
            response.message || "Gagal mengambil daftar pesanan."
        );
    }

    return response.data;
};

/**
 * Memperbarui metode dan alamat pengiriman pesanan.
 */
export const updateMyOrderShipping = async (
    id_order: number,
    payload: CustomerOrderShippingRequest
): Promise<CustomerOrderShippingUpdate> => {
    const response = await apiRequest<ApiResponse<CustomerOrderShippingUpdate>>(
        `/orders/my-orders/${id_order}/shipping`,
        {
            method: "PUT",
            body: JSON.stringify(payload),
        }
    );

    if (!response.success || !response.data) {
        throw new Error(
            response.message || "Gagal memperbarui metode pengiriman."
        );
    }

    return response.data;
};

/**
 * Mengambil metode pembayaran aktif dari database.
 */
export const getActivePaymentMethods = async (): Promise<
    CustomerPaymentMethod[]
> => {
    const response = await apiRequest<ApiResponse<CustomerPaymentMethod[]>>(
        "/payment-methods/active",
        {
            method: "GET",
        }
    );

    if (!response.success || !Array.isArray(response.data)) {
        throw new Error(
            response.message || "Gagal mengambil metode pembayaran."
        );
    }

    return response.data;
};

/**
 * Mengunggah bukti pembayaran menggunakan ID metode pembayaran.
 */
export const uploadMyOrderPayment = async (
    id_order: number,
    id_metode_pembayaran: number,
    bukti_pembayaran: File
): Promise<CustomerPayment> => {
    const formData = new FormData();

    formData.append(
        "id_metode_pembayaran",
        String(id_metode_pembayaran)
    );

    formData.append(
        "bukti_pembayaran",
        bukti_pembayaran
    );

    const response = await apiRequest<ApiResponse<CustomerPayment>>(
        `/orders/${id_order}/payment`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.success || !response.data) {
        throw new Error(
            response.message || "Gagal mengunggah bukti pembayaran."
        );
    }

    return response.data;
};