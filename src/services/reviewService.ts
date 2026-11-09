import { apiRequest } from "./api";

export interface ReviewImage {
    id_review_image: number;
    image: string;
}

export interface ReviewProduct {
    id_product: number;
    nama_product: string;
    jumlah_isi?: number;
    gambar?: string | null;
}

export interface ReviewVariant {
    id_order_item_variant: number;
    id_varian: number;
    jumlah: number;
    varian?: {
        id_varian: number;
        nama_varian: string;
    };
}

export interface ReviewOrderItem {
    id_order_item: number;
    id_product: number;
    quantity: number;
    harga_satuan: number | string;
    total_harga: number | string;
    product?: ReviewProduct;
    variants?: ReviewVariant[];
}

export interface ReviewOrder {
    id_order: number;
    id_user: number;
    tipe_pengiriman: "pickup" | "delivery";
    alamat_pengiriman?: string | null;
    subtotal: number | string;
    ongkir: number | string;
    total_harga: number | string;
    status_order: string;
    createdAt: string;
    orderItems: ReviewOrderItem[];
}

export interface ReviewUser {
    id_user: number;
    nama: string;
}

export interface Review {
    id_review: number;
    id_user: number;
    id_order: number;
    id_product: number;
    rating: number;
    komentar?: string | null;
    createdAt: string;
    updatedAt?: string;

    user?: ReviewUser;
    product?: ReviewProduct;
    images?: ReviewImage[];
    order?: ReviewOrder;
}

export interface ProductRating {
    id_product: number;
    rata_rata_rating: number;
    jumlah_review: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const getReviews = async (
    id_product?: number
): Promise<Review[]> => {
    const query = id_product
        ? `?id_product=${id_product}`
        : "";

    const response = await apiRequest<ApiResponse<Review[]>>(
        `/reviews${query}`,
        { method: "GET" }
    );

    if (!response.success || !Array.isArray(response.data)) {
        throw new Error(response.message || "Gagal mengambil ulasan.");
    }

    return response.data;
};

export const getMyReviews = async (): Promise<Review[]> => {
    const response = await apiRequest<ApiResponse<Review[]>>(
        "/reviews/my-reviews",
        { method: "GET" }
    );

    if (!response.success || !Array.isArray(response.data)) {
        throw new Error(
            response.message || "Gagal mengambil ulasan saya."
        );
    }

    return response.data;
};

export const getReviewById = async (
    id_review: number
): Promise<Review> => {
    const response = await apiRequest<ApiResponse<Review>>(
        `/reviews/${id_review}`,
        { method: "GET" }
    );

    if (!response.success || !response.data) {
        throw new Error(
            response.message || "Gagal mengambil detail ulasan."
        );
    }

    return response.data;
};

export const getProductRating = async (
    id_product: number
): Promise<ProductRating> => {
    const response = await apiRequest<ApiResponse<ProductRating>>(
        `/reviews/product/${id_product}/rating`,
        { method: "GET" }
    );

    if (!response.success || !response.data) {
        throw new Error(
            response.message || "Gagal mengambil rating produk."
        );
    }

    return response.data;
};

export const createReview = async (
    id_order: number,
    rating: number,
    komentar: string,
    images: File[] = []
): Promise<Review> => {
    const formData = new FormData();

    formData.append("id_order", String(id_order));
    formData.append("rating", String(rating));
    formData.append("komentar", komentar);

    images.forEach((image) => {
        formData.append("gambar", image);
    });

    const response = await apiRequest<ApiResponse<Review>>(
        "/reviews",
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.success || !response.data) {
        throw new Error(
            response.message || "Gagal mengirim ulasan."
        );
    }

    return response.data;
};

export const updateReview = async (
    id_review: number,
    rating: number,
    komentar: string,
    images: File[] = []
): Promise<Review> => {
    const formData = new FormData();

    formData.append("rating", String(rating));
    formData.append("komentar", komentar);

    images.forEach((image) => {
        formData.append("gambar", image);
    });

    const response = await apiRequest<ApiResponse<Review>>(
        `/reviews/${id_review}`,
        {
            method: "PUT",
            body: formData,
        }
    );

    if (!response.success || !response.data) {
        throw new Error(
            response.message || "Gagal memperbarui ulasan."
        );
    }

    return response.data;
};

export const deleteReview = async (
    id_review: number
): Promise<void> => {
    const response = await apiRequest<ApiResponse<null>>(
        `/reviews/${id_review}`,
        { method: "DELETE" }
    );

    if (!response.success) {
        throw new Error(
            response.message || "Gagal menghapus ulasan."
        );
    }
};