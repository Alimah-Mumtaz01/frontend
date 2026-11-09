import { apiRequest, extractList } from "./api";
import type { Variant } from "../types/product";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Mengambil seluruh data varian
export const getAdminVarians = async (): Promise<Variant[]> => {
    const response = await apiRequest<ApiResponse<Variant[]>>(
        "/varian"
    );

    return extractList<Variant>(response);
};

// Mengambil detail varian berdasarkan ID
export const getAdminVarianById = async (
    id: number | string
): Promise<Variant> => {
    const response = await apiRequest<ApiResponse<Variant>>(
        `/varian/${id}`
    );

    return response.data;
};

// Menambahkan varian
export const createAdminVarian = async (
    data: {
        nama_varian: string;
        stok: number;
        status: "aktif" | "nonaktif";
    }
): Promise<Variant> => {
    const response = await apiRequest<ApiResponse<Variant>>(
        "/varian",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );

    return response.data;
};

// Memperbarui data varian
export const updateAdminVarian = async (
    id: number | string,
    data: {
        nama_varian: string;
        stok: number;
        status: "aktif" | "nonaktif";
    }
): Promise<Variant> => {
    const response = await apiRequest<ApiResponse<Variant>>(
        `/varian/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    );

    return response.data;
};

// Memperbarui stok varian
export const updateAdminVarianStock = async (
    id: number | string,
    stok: number
): Promise<Variant> => {
    const response = await apiRequest<ApiResponse<Variant>>(
        `/varian/${id}/stok`,
        {
            method: "PATCH",
            body: JSON.stringify({ stok })
        }
    );

    return response.data;
};

// Menghapus varian
export const deleteAdminVarian = async (
    id: number | string
): Promise<void> => {
    await apiRequest<ApiResponse<Variant>>(
        `/varian/${id}`,
        {
            method: "DELETE"
        }
    );
};