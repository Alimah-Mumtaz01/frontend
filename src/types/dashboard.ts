export interface DashboardSummary {
  total_produk: number;
  total_varian: number;
  total_pelanggan: number;
  total_pesanan: number;
  pesanan_menunggu: number;
  pesanan_diproses: number;
  pesanan_selesai: number;
  total_penjualan: number;
}

export interface SalesChartItem {
  tanggal: string;
  total: number;
}

export interface DashboardPeriod {
  mulai: string;
  sampai: string;
  total_penjualan: number;
  grafik_penjualan: SalesChartItem[];
}

export interface BestSellingProduct {
  id_product: number;
  nama_product: string;
  jumlah_terjual: number;
}

export interface BestSellingVariant {
  id_varian: number;
  nama_varian: string;
  jumlah_terjual: number;
}

export interface RecentOrder {
  id_order: number;
  id_user: number;
  total_harga: number;
  status_order: string;
  tipe_pengiriman: string;
  createdAt: string;
  user?: {
    id_user: number;
    nama: string;
  };
}

export interface DashboardData {
  ringkasan: DashboardSummary;
  periode: DashboardPeriod;
  produk_terlaris: BestSellingProduct[];
  varian_terlaris: BestSellingVariant[];
  pesanan_terbaru: RecentOrder[];
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}