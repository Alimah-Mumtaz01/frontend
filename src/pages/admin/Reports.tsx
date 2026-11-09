import { useCallback, useEffect, useState } from "react";

import {
  Wallet,
  ShoppingCart,
  TrendingUp,
  CalendarDays,
  Filter,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CakeSlice,
  Package,
  ChartColumnIncreasing,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import {
  getSalesReport,
  getOrdersReport,
  getProductsReport,
  getVariantsReport,
} from "../../services/reportService";

import type {
  SalesReportData,
  OrdersReportData,
  ProductsReportData,
  VariantsReportData,
  SalesChartItem,
  BestSellingProduct,
} from "../../types/report";
import { getImageUrl } from "../../services/api";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value || 0);

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - 6);

  return {
    startDate: formatDateInput(startDate),
    endDate: formatDateInput(endDate),
  };
};

const formatDisplayDate = (date: string) => {
  if (!date) return "-";

  const parsed = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const formatChartDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
  }).format(parsed);
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/70">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconColor}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <h3 className="mt-4 break-words text-xl font-bold tracking-tight text-[#590D22] sm:text-2xl">
        {value}
      </h3>

      <p className="mt-2 text-xs font-medium text-[#A56B7D]">
        {description}
      </p>
    </div>
  );
}

function SalesChart({
  data,
}: {
  data: SalesChartItem[];
}) {
  const maxValue = Math.max(
    ...data.map((item) => item.total_penjualan),
    1
  );

  const formatAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toLocaleString("id-ID", {
        maximumFractionDigits: 1,
      })} jt`;
    }

    if (value >= 1000) {
      return `${Math.round(value / 1000)} rb`;
    }

    return String(Math.round(value));
  };

  const gridValues = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="mt-5">
      {data.length > 0 ? (
        <div className="w-full overflow-x-auto pb-2">
          <div className="min-w-[500px]">
            <div className="relative h-[230px]">

              {/* GRID */}
              {gridValues.map((value) => (
                <div
                  key={value}
                  className="absolute right-0 left-0 flex items-center gap-3"
                  style={{
                    top: `${(1 - value) * 100}%`,
                  }}
                >
                  <span className="w-10 shrink-0 text-right text-[10px] text-[#9B7180]">
                    {formatAxis(maxValue * value)}
                  </span>

                  <div className="h-px flex-1 border-t border-dashed border-pink-100" />
                </div>
              ))}

              {/* BARS */}
              <div className="absolute top-0 right-0 bottom-0 left-[52px] flex items-end justify-around gap-3">
                {data.map((item, index) => {
                  const percentage =
                    (item.total_penjualan / maxValue) * 100;

                  return (
                    <div
                      key={item.tanggal}
                      className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      <div className="relative flex h-full w-full items-end justify-center">

                        {/* TOOLTIP */}
                        <div className="pointer-events-none absolute bottom-full z-20 mb-2 hidden whitespace-nowrap rounded-lg bg-[#590D22] px-3 py-2 text-[10px] text-white shadow-lg group-hover:block">
                          <p className="font-semibold">
                            {formatDisplayDate(item.tanggal)}
                          </p>

                          <p className="mt-1">
                            {formatCurrency(item.total_penjualan)}
                          </p>

                          <p>
                            {formatNumber(item.jumlah_pesanan)} pesanan
                          </p>
                        </div>

                        {/* BAR */}
                        <div
                          className={`w-full max-w-[42px] rounded-t-md transition-all duration-300 group-hover:opacity-80 ${
                            index % 2 === 0
                              ? "bg-gradient-to-t from-[#C9184A] to-[#FF758F]"
                              : "bg-gradient-to-t from-[#FF8FA3] to-[#FFB3C1]"
                          }`}
                          style={{
                            height: `${Math.max(percentage, 1)}%`,
                          }}
                        />
                      </div>

                      {/* LABEL */}
                      <span className="mt-3 whitespace-nowrap text-[10px] font-medium text-[#795565] sm:text-xs">
                        {formatChartDate(item.tanggal)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center">
          <ChartColumnIncreasing
            size={42}
            className="text-pink-200"
          />

          <p className="mt-3 text-sm text-gray-400">
            Belum ada data penjualan.
          </p>
        </div>
      )}
    </div>
  );
}

function BestProductCard({
  products,
  totalProducts,
}: {
  products: BestSellingProduct[];
  totalProducts: number;
}) {
  const bestProduct = products[0];

  if (!bestProduct) {
    return (
      <div className="flex min-h-[180px] flex-col items-center justify-center">
        <CakeSlice size={40} className="text-pink-200" />

        <p className="mt-3 text-sm text-gray-400">
          Belum ada produk terjual.
        </p>
      </div>
    );
  }

  const percentage =
    totalProducts > 0
      ? (bestProduct.jumlah_paket_terjual / totalProducts) * 100
      : 0;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-4">

        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-pink-100 bg-[#FFF0F3]">
          {bestProduct.gambar ? (
            <img
              src={getImageUrl(bestProduct.gambar)}
              alt={bestProduct.nama_product}
              className="h-full w-full object-cover"
            />
          ) : (
            <CakeSlice
              size={43}
              className="text-[#C9184A]"
            />
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#FFF0F3] px-2.5 py-1 text-[10px] font-bold text-[#C9184A]">
            <CheckCircle2 size={11} />
            Produk Terlaris
          </div>

          <h3 className="mt-2 text-sm font-bold text-[#590D22] sm:text-base">
            {bestProduct.nama_product}
          </h3>

          <p className="mt-1 text-2xl font-extrabold text-[#C9184A]">
            {percentage.toFixed(1)}%
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatNumber(bestProduct.jumlah_paket_terjual)} paket terjual
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-gray-500">
            Kontribusi penjualan produk
          </span>

          <span className="font-bold text-[#C9184A]">
            {percentage.toFixed(1)}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-pink-50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF8FA3] to-[#C9184A] transition-all duration-500"
            style={{
              width: `${Math.min(percentage, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ProductRanking({
  products,
}: {
  products: BestSellingProduct[];
}) {
  const maxValue = Math.max(
    ...products.map((item) => item.jumlah_paket_terjual),
    1
  );

  return (
    <div className="mt-5 space-y-4">
      {products.length > 0 ? (
        products.slice(0, 5).map((product, index) => {
          const percentage =
            (product.jumlah_paket_terjual / maxValue) * 100;

          return (
            <div
              key={product.id_product}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-sm font-bold text-[#C9184A]">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#590D22]">
                  {product.nama_product}
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF8FA3] to-[#C9184A]"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              <span className="shrink-0 text-xs font-bold text-[#800F2F]">
                {formatNumber(product.jumlah_paket_terjual)} paket
              </span>
            </div>
          );
        })
      ) : (
        <p className="py-8 text-center text-sm text-gray-400">
          Belum ada data produk terlaris.
        </p>
      )}
    </div>
  );
}

function VariantRanking({
  variants,
}: {
  variants: VariantsReportData["varian_terlaris"];
}) {
  const maxValue = Math.max(
    ...variants.map((item) => item.jumlah_terjual),
    1
  );

  return (
    <div className="mt-5 space-y-4">
      {variants.length > 0 ? (
        variants.slice(0, 5).map((variant, index) => {
          const percentage =
            (variant.jumlah_terjual / maxValue) * 100;

          return (
            <div
              key={variant.id_varian}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-sm font-bold text-[#C9184A]">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#590D22]">
                  {variant.nama_varian}
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFB3C1] to-[#C9184A]"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              <span className="shrink-0 text-xs font-bold text-[#800F2F]">
                {formatNumber(variant.jumlah_terjual)} pcs
              </span>
            </div>
          );
        })
      ) : (
        <p className="py-8 text-center text-sm text-gray-400">
          Belum ada data varian terlaris.
        </p>
      )}
    </div>
  );
}

export default function Reports() {

  const [dateRange, setDateRange] = useState(
  getDefaultDateRange
);

const [appliedDateRange, setAppliedDateRange] = useState(
  getDefaultDateRange
);

  const [sales, setSales] =
    useState<SalesReportData | null>(null);

  const [orders, setOrders] =
    useState<OrdersReportData | null>(null);

  const [products, setProducts] =
    useState<ProductsReportData | null>(null);

  const [variants, setVariants] =
    useState<VariantsReportData | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const fetchReports = useCallback(
    async (showRefresh = false) => {
      try {
        setError("");

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [
        salesData,
        ordersData,
        productsData,
        variantsData,
        ] = await Promise.all([
        getSalesReport(appliedDateRange),
        getOrdersReport(appliedDateRange),
        getProductsReport(appliedDateRange),
        getVariantsReport(appliedDateRange),
        ]);

        setSales(salesData);
        setOrders(ordersData);
        setProducts(productsData);
        setVariants(variantsData);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat laporan penjualan."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [appliedDateRange]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setDateRange((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleFilter = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
        setError("Silakan pilih tanggal mulai dan tanggal akhir.");
        return;
    }

    if (dateRange.startDate > dateRange.endDate) {
        setError(
        "Tanggal mulai tidak boleh melebihi tanggal akhir."
        );
        return;
    }

    setError("");
    setAppliedDateRange({ ...dateRange });
    };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-[#C9184A]"
          />

          <p className="mt-4 text-sm text-[#9B6575]">
            Memuat laporan penjualan SoeSweet...
          </p>
        </div>
      </div>
    );
  }

  if (error && !sales) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle
            size={42}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 font-bold text-[#590D22]">
            Laporan gagal dimuat
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() => fetchReports()}
            className="mt-5 rounded-xl bg-[#C9184A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#800F2F]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const totalSales = Number(sales?.total_penjualan || 0);

  const totalOrders = Number(orders?.total_pesanan || 0);

  const averageOrder = Number(
    sales?.rata_rata_transaksi || 0
  );

  const totalProducts = Number(
    products?.total_produk_terjual || 0
  );

  const bestProducts = products?.produk_terlaris || [];

  const bestVariants = variants?.varian_terlaris || [];

  return (
    <div className="space-y-6">

      <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#590D22] sm:text-3xl">
            Laporan Penjualan
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Lihat laporan penjualan dan statistik SoeSweet.
          </p>
        </div>

        {/* DATE FILTER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label
                htmlFor="startDate"
                className="mb-1.5 block text-xs font-semibold text-[#795565]"
              >
                Tanggal Mulai
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C9184A]"
                />

                <input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  max={dateRange.endDate}
                  onChange={(event) =>
                    handleDateChange(
                      "startDate",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-pink-200 bg-white py-2.5 pl-9 pr-2 text-xs font-medium text-[#590D22] outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100 sm:w-[155px]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-1.5 block text-xs font-semibold text-[#795565]"
              >
                Tanggal Akhir
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C9184A]"
                />

                <input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  min={dateRange.startDate}
                  onChange={(event) =>
                    handleDateChange(
                      "endDate",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-pink-200 bg-white py-2.5 pl-9 pr-2 text-xs font-medium text-[#590D22] outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100 sm:w-[155px]"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleFilter}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9184A] to-[#FF4D6D] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-gray-400">
          Periode laporan:
          <span className="ml-1 font-semibold text-[#800F2F]">
            {formatDisplayDate(appliedDateRange.startDate)}
            {" - "}
            {formatDisplayDate(appliedDateRange.endDate)}
          </span>
        </p>

        <button
          onClick={() => fetchReports(true)}
          disabled={refreshing}
          className="flex items-center gap-2 text-xs font-semibold text-[#C9184A] transition hover:text-[#800F2F] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Memperbarui..." : "Perbarui Data"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Penjualan"
          value={formatCurrency(totalSales)}
          description={`${formatNumber(sales?.jumlah_transaksi_selesai || 0)} transaksi selesai`}
          icon={Wallet}
          iconColor="bg-[#FFE5EC] text-[#C9184A]"
        />

        <StatCard
          title="Jumlah Pesanan"
          value={formatNumber(totalOrders)}
          description="Seluruh pesanan dalam periode"
          icon={ShoppingCart}
          iconColor="bg-[#FCE4F0] text-[#A4133C]"
        />

        <StatCard
          title="Rata-rata Order"
          value={formatCurrency(averageOrder)}
          description="Rata-rata transaksi yang selesai"
          icon={TrendingUp}
          iconColor="bg-[#FFE8E1] text-[#E36B47]"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">

        {/* SALES CHART */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                  <ChartColumnIncreasing size={19} />
                </div>

                <h2 className="font-bold text-[#590D22]">
                  Grafik Penjualan
                </h2>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Penjualan dari pesanan yang selesai
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-2xl font-extrabold text-[#590D22]">
              {formatCurrency(totalSales)}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Total penjualan periode terpilih
            </p>
          </div>

          <SalesChart
            data={sales?.grafik_penjualan || []}
          />

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#C9184A]" />
            Total penjualan per hari
          </div>
        </div>

        {/* BEST SELLING PRODUCT */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
              <CakeSlice size={19} />
            </div>

            <h2 className="font-bold text-[#590D22]">
              Produk Terlaris
            </h2>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Produk dengan jumlah paket terjual tertinggi
          </p>

          <BestProductCard
            products={bestProducts}
            totalProducts={totalProducts}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* ALL BEST SELLING PRODUCTS */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
              <Package size={21} />
            </div>

            <div>
              <h2 className="font-bold text-[#590D22]">
                Peringkat Produk
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Berdasarkan jumlah paket terjual
              </p>
            </div>
          </div>

          <ProductRanking products={bestProducts} />
        </div>

        {/* ALL BEST SELLING VARIANTS */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
              <CakeSlice size={21} />
            </div>

            <div>
              <h2 className="font-bold text-[#590D22]">
                Varian Rasa Terlaris
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Berdasarkan jumlah varian terjual
              </p>
            </div>
          </div>

          <VariantRanking variants={bestVariants} />
        </div>
      </section>

      <section className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
            <ShoppingCart size={21} />
          </div>

          <div>
            <h2 className="font-bold text-[#590D22]">
              Statistik Status Pesanan
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Ringkasan status seluruh pesanan dalam periode terpilih
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(orders?.statistik_status || {}).map(
            ([status, count]) => (
              <div
                key={status}
                className="rounded-xl border border-pink-50 bg-[#FFFAFB] p-4"
              >
                <p className="text-xs capitalize text-gray-500">
                  {status.replaceAll("_", " ")}
                </p>

                <p className="mt-2 text-xl font-bold text-[#800F2F]">
                  {formatNumber(count)}
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Pesanan
                </p>
              </div>
            )
          )}

          {Object.keys(orders?.statistik_status || {}).length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-gray-400">
              Belum ada data pesanan.
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-pink-100 pt-5">

        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} SoeSweet Admin Reports
        </p>

        <div className="flex items-center gap-2 text-xs font-medium text-[#A56B7D]">
          <ArrowUpRight size={14} />
          Data laporan berdasarkan periode terpilih
        </div>
      </div>
    </div>
  );
}