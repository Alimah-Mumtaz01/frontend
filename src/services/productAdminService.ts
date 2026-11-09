import { apiRequest, extractList } from "./api";
import type { Product } from "../types/product";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Mengambil seluruh produk
export const getAdminProducts = async (): Promise<Product[]> => {
    const response = await apiRequest<ApiResponse<Product[]>>(
        "/products"
    );

    return extractList<Product>(response);
};

// Mengambil detail produk
export const getAdminProductById = async (
    id: number | string
): Promise<Product> => {
    const response = await apiRequest<ApiResponse<Product>>(
        `/products/${id}`
    );

    return response.data;
};

// Menambahkan produk
export const createAdminProduct = async (
    formData: FormData
): Promise<Product> => {
    const response = await apiRequest<ApiResponse<Product>>(
        "/products",
        {
            method: "POST",
            body: formData
        }
    );

    return response.data;
};

// Memperbarui produk
export const updateAdminProduct = async (
    id: number | string,
    formData: FormData
): Promise<Product> => {
    const response = await apiRequest<ApiResponse<Product>>(
        `/products/${id}`,
        {
            method: "PUT",
            body: formData
        }
    );

    return response.data;
};

// Menghapus produk
export const deleteAdminProduct = async (
    id: number | string
): Promise<void> => {
    await apiRequest<ApiResponse<Product>>(
        `/products/${id}`,
        {
            method: "DELETE"
        }
    );
};

// Mengubah status produk
export const updateProductStatus = async (
    id: number | string,
    status: "aktif" | "nonaktif"
): Promise<Product> => {
    const formData = new FormData();

    formData.append("status", status);

    return updateAdminProduct(id, formData);
};