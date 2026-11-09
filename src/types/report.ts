export interface ReportPeriod {
  mulai: string;
  sampai: string;
}

// SALES REPORT

export interface SalesChartItem {
  tanggal: string;
  jumlah_pesanan: number;
  total_penjualan: number;
}

export interface SalesReportData {
  periode: ReportPeriod;
  jumlah_transaksi_selesai: number;
  total_penjualan: number;
  rata_rata_transaksi: number;
  grafik_penjualan: SalesChartItem[];
}

// ORDERS REPORT

export interface OrderCustomer {
  nama: string;
  email: string;
}

export interface ReportOrder {
  id_order: number;
  pelanggan: OrderCustomer | null;
  tipe_pengiriman: string;
  total_harga: number;
  status_order: string;
  createdAt: string;
}

export interface OrdersReportData {
  periode: ReportPeriod;
  total_pesanan: number;
  statistik_status: Record<string, number>;
  daftar_pesanan: ReportOrder[];
}

// PRODUCTS REPORT

export interface BestSellingProduct {
  id_product: number;
  nama_product: string;
  gambar: string | null;
  jumlah_paket_terjual: number;
  total_penjualan: number;
}

export interface ProductsReportData {
  periode: ReportPeriod;
  total_produk_terjual: number;
  produk_terlaris: BestSellingProduct[];
}

// VARIANTS REPORT

export interface BestSellingVariant {
  id_varian: number;
  nama_varian: string;
  jumlah_terjual: number;
  stok_tersedia: number;
}

export interface VariantsReportData {
  periode: ReportPeriod;
  varian_terlaris: BestSellingVariant[];
}

// API RESPONSE

export interface ReportApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
