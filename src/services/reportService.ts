import { apiRequest } from "./api";

import type {
  ReportApiResponse,
  SalesReportData,
  OrdersReportData,
  ProductsReportData,
  VariantsReportData,
} from "../types/report";

export interface ReportParams {
  startDate: string;
  endDate: string;
}

const createReportQuery = (params: ReportParams) => {
  const query = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  return query.toString();
};

export const getSalesReport = async (
  params: ReportParams
): Promise<SalesReportData> => {
  const query = createReportQuery(params);

  const response = await apiRequest<
    ReportApiResponse<SalesReportData>
  >(`/admin/reports/sales?${query}`);

  if (!response.success) {
    throw new Error(
      response.message || "Gagal mengambil laporan penjualan."
    );
  }

  return response.data;
};

export const getOrdersReport = async (
  params: ReportParams
): Promise<OrdersReportData> => {
  const query = createReportQuery(params);

  const response = await apiRequest<
    ReportApiResponse<OrdersReportData>
  >(`/admin/reports/orders?${query}`);

  if (!response.success) {
    throw new Error(
      response.message || "Gagal mengambil laporan pesanan."
    );
  }

  return response.data;
};

export const getProductsReport = async (
  params: ReportParams
): Promise<ProductsReportData> => {
  const query = createReportQuery(params);

  const response = await apiRequest<
    ReportApiResponse<ProductsReportData>
  >(`/admin/reports/products?${query}`);

  if (!response.success) {
    throw new Error(
      response.message || "Gagal mengambil laporan produk."
    );
  }

  return response.data;
};

export const getVariantsReport = async (
  params: ReportParams
): Promise<VariantsReportData> => {
  const query = createReportQuery(params);

  const response = await apiRequest<
    ReportApiResponse<VariantsReportData>
  >(`/admin/reports/variants?${query}`);

  if (!response.success) {
    throw new Error(
      response.message || "Gagal mengambil laporan varian."
    );
  }

  return response.data;
};