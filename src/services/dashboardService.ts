import { apiRequest } from "./api";
import type { DashboardApiResponse } from "../types/dashboard";

interface DashboardParams {
  startDate: string;
  endDate: string;
}

export const getDashboardData = async (
  params: DashboardParams
) => {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  const response = await apiRequest<DashboardApiResponse>(
    `/admin/dashboard?${query.toString()}`
  );

  if (!response.success) {
    throw new Error(
      response.message || "Gagal mengambil data dashboard."
    );
  }

  return response.data;
};