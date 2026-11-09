import { useCallback, useEffect, useState } from "react";

import {
  ShoppingCart,
  Users,
  Wallet,
  Package,
  RefreshCw,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  LoaderCircle,
  AlertCircle,
  CakeSlice,
  Star,
} from "lucide-react";

import { Link } from "react-router";

import { getDashboardData } from "../../services/dashboardService";

import type {
  DashboardData,
  RecentOrder,
  SalesChartItem,
} from "../../types/dashboard";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value || 0);

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatChartDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
  }).format(parsed);
};

const formatRelativeTime = (date: string) => {
  const difference = Math.max(
    0,
    Date.now() - new Date(date).getTime()
  );

  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);

  return `${days} hari lalu`;
};

const getOrderStatus = (status: string) => {
  const statuses: Record<
    string,
    { label: string; className: string }
  > = {
    menunggu_konfirmasi: {
      label: "Menunggu Konfirmasi",
      className: "bg-amber-50 text-amber-700",
    },
    pesanan_diterima: {
      label: "Pesanan Diterima",
      className: "bg-blue-50 text-blue-700",
    },
    menunggu_pembayaran: {
      label: "Menunggu Pembayaran",
      className: "bg-orange-50 text-orange-700",
    },
    pembayaran_diperiksa: {
      label: "Pembayaran Diperiksa",
      className: "bg-purple-50 text-purple-700",
    },
    pembayaran_ditolak: {
      label: "Pembayaran Ditolak",
      className: "bg-red-50 text-red-700",
    },
    diproses: {
      label: "Diproses",
      className: "bg-blue-50 text-blue-700",
    },
    siap_diambil: {
      label: "Siap Diambil",
      className: "bg-indigo-50 text-indigo-700",
    },
    sedang_dikirim: {
      label: "Sedang Dikirim",
      className: "bg-cyan-50 text-cyan-700",
    },
    selesai: {
      label: "Selesai",
      className: "bg-green-50 text-green-700",
    },
    dibatalkan: {
      label: "Dibatalkan",
      className: "bg-gray-100 text-gray-600",
    },
  };

  return statuses[status] || {
    label: status.replaceAll("_", " "),
    className: "bg-gray-100 text-gray-600",
  };
};

function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  description,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/70">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${iconColor}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#590D22]">
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
    ...data.map((item) => item.total),
    1
  );

  const width = 700;
  const height = 240;

  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 38;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((item, index) => {
    const x =
      data.length <= 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft +
          (index / (data.length - 1)) * chartWidth;

    const y =
      paddingTop +
      chartHeight -
      (item.total / maxValue) * chartHeight;

    return { x, y, item };
  });

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${
        paddingTop + chartHeight
      } L ${points[0].x} ${paddingTop + chartHeight} Z`
    : "";

  const gridValues = [1, 0.75, 0.5, 0.25, 0];

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

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto min-w-[450px] w-full"
        role="img"
        aria-label="Grafik penjualan berdasarkan tanggal"
      >
        <defs>
          <linearGradient
            id="salesGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#FF4D6D"
              stopOpacity="0.32"
            />

            <stop
              offset="100%"
              stopColor="#FF4D6D"
              stopOpacity="0.02"
            />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridValues.map((value) => {
          const y =
            paddingTop +
            chartHeight -
            value * chartHeight;

          return (
            <g key={value}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={y}
                y2={y}
                stroke="#FCE4EA"
                strokeDasharray="4 4"
              />

              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#9B7180"
              >
                {formatAxis(maxValue * value)}
              </text>
            </g>
          );
        })}

        {/* Area */}
        {points.length > 0 && (
          <path d={areaPath} fill="url(#salesGradient)" />
        )}

        {/* Line */}
        {points.length > 0 && (
          <path
            d={linePath}
            fill="none"
            stroke="#C9184A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data Points */}
        {points.map((point) => (
          <g key={point.item.tanggal}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#C9184A"
              stroke="white"
              strokeWidth="2"
            />

            <title>
              {point.item.tanggal}: {formatCurrency(point.item.total)}
            </title>
          </g>
        ))}

        {/* X Labels */}
        {points.map((point) => (
          <text
            key={point.item.tanggal}
            x={point.x}
            y={height - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#795565"
          >
            {formatChartDate(point.item.tanggal)}
          </text>
        ))}
      </svg>

      {data.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          Belum ada data penjualan.
        </p>
      )}
    </div>
  );
}

function RecentOrderCard({
  order,
}: {
  order: RecentOrder;
}) {
  const status = getOrderStatus(order.status_order);

  return (
    <div className="flex items-center gap-3 border-b border-pink-50 py-4 last:border-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
        <CakeSlice size={23} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#590D22]">
          #SOE{String(order.id_order).padStart(7, "0")}
        </p>

        <p className="mt-1 truncate text-xs text-gray-500">
          {order.user?.nama || `Pelanggan #${order.id_user}`}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {formatRelativeTime(order.createdAt)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`max-w-[125px] rounded-full px-2.5 py-1 text-center text-[10px] font-semibold ${status.className}`}
        >
          {status.label}
        </span>

        <span className="text-xs font-bold text-[#800F2F]">
          {formatCurrency(Number(order.total_harga))}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [period, setPeriod] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(
    async (showRefresh = false) => {
      try {
        setError("");

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const endDate = new Date();
        const startDate = new Date();

        startDate.setDate(
          startDate.getDate() - (period - 1)
        );

        const result = await getDashboardData({
          startDate: formatDateInput(startDate),
          endDate: formatDateInput(endDate),
        });

        setDashboard(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat dashboard."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [period]
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-[#C9184A]"
          />

          <p className="mt-4 text-sm text-[#9B6575]">
            Memuat dashboard SoeSweet...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle
            size={42}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 font-bold text-[#590D22]">
            Dashboard gagal dimuat
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={() => fetchDashboard()}
            className="mt-5 rounded-xl bg-[#C9184A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#800F2F]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const summary = dashboard!.ringkasan;

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFE1E9] via-[#FFD3DE] to-[#FFB5C7] px-6 py-8 sm:px-9 sm:py-10">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#C9184A]">
            <Star size={13} />
            SOESWEET ADMIN PANEL
          </span>

          <h1 className="mt-4 text-2xl font-extrabold text-[#590D22] sm:text-3xl">
            Selamat Datang, Admin!
          </h1>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#754052]">
            Kelola bisnis SoeSweet dengan mudah dan efisien.
            Pantau pesanan, penjualan, dan perkembangan tokomu.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#C9184A]">
            Sweet Moments, Delicious Bites
            <span>✨</span>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-3 -bottom-10 hidden text-[180px] opacity-90 sm:block">
          🍓
        </div>

        <span className="absolute right-44 top-8 text-3xl text-[#FF4D6D]/50">
          ♥
        </span>

        <span className="absolute right-20 top-6 text-xl text-[#FF4D6D]/50">
          ♥
        </span>
      </section>

      {/* Statistik */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Pesanan"
          value={formatNumber(summary.total_pesanan)}
          icon={ShoppingCart}
          iconColor="bg-[#FFE5EC] text-[#C9184A]"
          description={`${formatNumber(summary.pesanan_menunggu)} menunggu konfirmasi`}
        />

        <StatCard
          title="Total Pelanggan"
          value={formatNumber(summary.total_pelanggan)}
          icon={Users}
          iconColor="bg-[#FCE4F0] text-[#A4133C]"
          description="Pelanggan terdaftar"
        />

        <StatCard
          title="Total Penjualan"
          value={formatCurrency(summary.total_penjualan)}
          icon={Wallet}
          iconColor="bg-[#FFE8E1] text-[#E36B47]"
          description={`${formatNumber(summary.pesanan_selesai)} pesanan selesai`}
        />

        <StatCard
          title="Total Produk"
          value={formatNumber(summary.total_produk)}
          icon={Package}
          iconColor="bg-[#F0E5FF] text-[#8653B5]"
          description={`${formatNumber(summary.total_varian)} varian rasa`}
        />
      </section>

      {/* Status Pesanan */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Pesanan Menunggu
            </p>

            <h3 className="mt-1 text-xl font-bold">
              {formatNumber(summary.pesanan_menunggu)}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Truck size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Pesanan Diproses
            </p>

            <h3 className="mt-1 text-xl font-bold">
              {formatNumber(summary.pesanan_diproses)}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Pesanan Selesai
            </p>

            <h3 className="mt-1 text-xl font-bold">
              {formatNumber(summary.pesanan_selesai)}
            </h3>
          </div>
        </div>
      </section>

      {/* Grafik dan Pesanan */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">

        {/* Sales Chart */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#590D22]">
                Grafik Penjualan
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Penjualan dari pesanan yang selesai
              </p>
            </div>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(Number(event.target.value) as 7 | 30)
              }
              className="rounded-xl border border-pink-200 bg-[#FFFAFB] px-3 py-2 text-sm font-semibold text-[#800F2F] outline-none focus:border-[#C9184A]"
            >
              <option value={7}>7 Hari</option>
              <option value={30}>30 Hari</option>
            </select>
          </div>

          <div className="mt-5">
            <p className="text-2xl font-bold text-[#590D22]">
              {formatCurrency(
                dashboard!.periode.total_penjualan
              )}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Total penjualan periode terpilih
            </p>
          </div>

          <div className="mt-5">
            <SalesChart
              data={dashboard!.periode.grafik_penjualan}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-[#590D22]">
                Pesanan Terbaru
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Aktivitas pesanan pelanggan
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#C9184A] hover:text-[#800F2F]"
            >
              Lihat Semua
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="mt-3">
            {dashboard!.pesanan_terbaru.length > 0 ? (
              dashboard!.pesanan_terbaru
                .slice(0, 5)
                .map((order) => (
                  <RecentOrderCard
                    key={order.id_order}
                    order={order}
                  />
                ))
            ) : (
              <div className="py-12 text-center">
                <ShoppingCart
                  size={35}
                  className="mx-auto text-pink-200"
                />

                <p className="mt-3 text-sm text-gray-400">
                  Belum ada pesanan.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Produk dan Varian Terlaris */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Best Products */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#590D22]">
            Produk Terlaris
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Berdasarkan jumlah produk pada pesanan selesai
          </p>

          <div className="mt-4 space-y-4">
            {dashboard!.produk_terlaris.length > 0 ? (
              dashboard!.produk_terlaris.map((product, index) => (
                <div
                  key={product.id_product}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0F3] font-bold text-[#C9184A]">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {product.nama_product}
                    </p>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF8FA3] to-[#C9184A]"
                        style={{
                          width: `${
                            (product.jumlah_terjual /
                              Math.max(
                                ...dashboard!.produk_terlaris.map(
                                  (item) => item.jumlah_terjual
                                ),
                                1
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-[#800F2F]">
                    {formatNumber(product.jumlah_terjual)} terjual
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                Belum ada data produk terlaris.
              </p>
            )}
          </div>
        </div>

        {/* Best Variants */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#590D22]">
            Varian Terlaris
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Berdasarkan jumlah varian yang terjual
          </p>

          <div className="mt-4 space-y-4">
            {dashboard!.varian_terlaris.length > 0 ? (
              dashboard!.varian_terlaris.map((variant, index) => (
                <div
                  key={variant.id_varian}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0F3] font-bold text-[#C9184A]">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {variant.nama_varian}
                    </p>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FFB3C1] to-[#C9184A]"
                        style={{
                          width: `${
                            (variant.jumlah_terjual /
                              Math.max(
                                ...dashboard!.varian_terlaris.map(
                                  (item) => item.jumlah_terjual
                                ),
                                1
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-[#800F2F]">
                    {formatNumber(variant.jumlah_terjual)} pcs
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                Belum ada data varian terlaris.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-pink-100 pt-5">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} SoeSweet Admin Dashboard
        </p>

        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2 text-xs font-semibold text-[#C9184A] transition hover:bg-[#FFF0F3] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Memperbarui..." : "Perbarui Data"}
        </button>
      </div>

      {/* Refresh Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}