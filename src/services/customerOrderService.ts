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
    metode_pembayaran: "transfer_bank" | "e-wallet";
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
    tipe_pengiriman: "pickup" | "delivery";
    alamat_pengiriman?: string | null;
    catatan?: string | null;
    subtotal: number;
    ongkir: number;
    total_harga: number;
    status_order: CustomerOrderStatus;
    createdAt: string;
    updatedAt?: string;
    orderItems?: CustomerOrderItem[];
    payment?: CustomerPayment | null;
    review?: CustomerOrderReview | null;
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
 * Mengunggah bukti pembayaran pesanan.
 */
export const uploadMyOrderPayment = async (
    id_order: number,
    metode_pembayaran: "transfer_bank" | "e-wallet",
    bukti_pembayaran: File
): Promise<CustomerPayment> => {
    const formData = new FormData();

    formData.append("metode_pembayaran", metode_pembayaran);
    formData.append("bukti_pembayaran", bukti_pembayaran);

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