import { apiRequest } from "./api";

import type {
    CheckoutRequest,
} from "./checkoutService";

export type OrderStatus =
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

export type PaymentStatus =
    | "pending"
    | "verified"
    | "rejected";

export interface OrderUser {
    id_user: number;
    nama: string;
    email: string;
    no_hp?: string | null;
    role?: string;
}

export interface OrderProduct {
    id_product: number;
    nama_product: string;
    jumlah_isi: number;
    harga: number | string;
    deskripsi?: string | null;
    gambar?: string | null;
    status?: "aktif" | "nonaktif";
}

export interface OrderVariant {
    id_varian: number;
    nama_varian: string;
    stok?: number;
    status?: "aktif" | "nonaktif";
}

export interface OrderItemVariant {
    id_order_item_variant: number;
    id_order_item: number;
    id_varian: number;
    jumlah: number;
    varian?: OrderVariant;
}

export interface OrderItem {
    id_order_item: number;
    id_order: number;
    id_product: number;
    quantity: number;
    harga_satuan: number | string;
    total_harga: number | string;

    product?: OrderProduct;
    variants?: OrderItemVariant[];
}

export interface OrderPayment {
    id_payment: number;
    id_order: number;
    metode_pembayaran: "transfer_bank" | "e-wallet";
    bukti_pembayaran: string | null;
    status_payment: PaymentStatus;
    verified_by?: number | null;
    verified_at?: string | null;
    catatan_verifikasi?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatedOrder {
    id_order: number;
    id_user?: number;
    tipe_pengiriman?: "pickup" | "delivery";
    alamat_pengiriman?: string | null;
    catatan?: string | null;
    subtotal?: number | string;
    ongkir?: number | string;
    total_harga?: number | string;
    status_order?: OrderStatus;
    status_pesanan?: string;
    createdAt?: string;
    updatedAt?: string;
    orderItems?: OrderItem[];
}

export interface AdminOrder extends CreatedOrder {
    user?: OrderUser;
    orderItems?: OrderItem[];
    payment?: OrderPayment | null;
}

export interface VerifyPaymentResult {
    payment: OrderPayment;
    order: AdminOrder;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const getResponseData = <T>(
    response: ApiResponse<T>,
    defaultMessage: string
): T => {
    if (!response.success || response.data === undefined || response.data === null) {
        throw new Error(response.message || defaultMessage);
    }

    return response.data;
};

/**
 * Membuat pesanan baru.
 */
export const createOrder = async (
    payload: CheckoutRequest
): Promise<CreatedOrder> => {
    const response = await apiRequest<ApiResponse<CreatedOrder>>(
        "/orders",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );

    return getResponseData(
        response,
        "Gagal membuat pesanan."
    );
};

/**
 * Mengambil seluruh pesanan pelanggan.
 * Hanya dapat diakses admin.
 */
export const getAdminOrders = async (): Promise<AdminOrder[]> => {
    const response = await apiRequest<ApiResponse<AdminOrder[]>>(
        "/orders",
        {
            method: "GET",
        }
    );

    return getResponseData(
        response,
        "Gagal mengambil daftar pesanan."
    );
};

/**
 * Mengambil detail pesanan berdasarkan id_order.
 * Hanya dapat diakses admin.
 */
export const getAdminOrderDetail = async (
    id_order: number
): Promise<AdminOrder> => {
    const response = await apiRequest<ApiResponse<AdminOrder>>(
        `/orders/${id_order}`,
        {
            method: "GET",
        }
    );

    return getResponseData(
        response,
        "Gagal mengambil detail pesanan."
    );
};

/**
 * Memverifikasi atau menolak pembayaran.
 */
export const verifyAdminPayment = async (
    id_order: number,
    status_payment: "verified" | "rejected",
    catatan_verifikasi: string = ""
): Promise<VerifyPaymentResult> => {
    const response = await apiRequest<ApiResponse<VerifyPaymentResult>>(
        `/orders/${id_order}/payment/verify`,
        {
            method: "PUT",
            body: JSON.stringify({
                status_payment,
                catatan_verifikasi,
            }),
        }
    );

    return getResponseData(
        response,
        "Gagal memproses verifikasi pembayaran."
    );
};

/**
 * Memperbarui status pesanan.
 * Perubahan status akan divalidasi kembali
 * oleh orderService pada backend.
 */
export const updateAdminOrderStatus = async (
    id_order: number,
    status_order: OrderStatus
): Promise<AdminOrder> => {
    const response = await apiRequest<ApiResponse<AdminOrder>>(
        `/orders/${id_order}/status`,
        {
            method: "PUT",
            body: JSON.stringify({
                status_order,
            }),
        }
    );

    return getResponseData(
        response,
        "Gagal memperbarui status pesanan."
    );
};

export interface AdminCustomerOrderHistory {
    customer: {
        id_user: number;
        nama: string;
        email: string;
        no_hp?: string | null;
        role: string;
        createdAt?: string;
    };
    orders: AdminOrder[];
}

export const getAdminCustomerOrderHistory = async (
    id_user: number
): Promise<AdminCustomerOrderHistory> => {
    try {
        const response = await apiRequest<ApiResponse<AdminCustomerOrderHistory>>(
            `/orders/customers/${id_user}/orders`,
            { method: "GET" }
        );

        return getResponseData(
            response,
            "Gagal mengambil riwayat pesanan pelanggan."
        );
    } catch (error: any) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "Gagal mengambil riwayat pesanan pelanggan."
        );
    }
};