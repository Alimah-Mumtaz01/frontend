import { apiRequest } from "./api";

import type {
  CustomerApiResponse,
  CustomerParams,
} from "../types/customer";

export const getCustomers = async (
  params: CustomerParams = {}
) => {
  const query = new URLSearchParams({
    page: String(params.page || 1),
    limit: String(params.limit || 8),
    search: params.search || "",
  });

  const response = await apiRequest<CustomerApiResponse>(
    `/admin/customers?${query.toString()}`
  );

  if (!response.success) {
    throw new Error(
      response.message || "Gagal mengambil data pelanggan."
    );
  }

  return response.data;
};