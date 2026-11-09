import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
    Search,
    Eye,
    RefreshCw,
    LoaderCircle,
    AlertCircle,
    ShoppingBag,
    Clock,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Package,
    Truck,
    Store,
} from "lucide-react";

import {
    getAdminOrders,
    type AdminOrder,
    type OrderStatus,
} from "../../../services/orderService";

const ITEMS_PER_PAGE = 8;

const statusLabels: Record<OrderStatus, string> = {
    menunggu_konfirmasi: "Menunggu Konfirmasi",
    pesanan_diterima: "Pesanan Diterima",
    menunggu_pembayaran: "Menunggu Pembayaran",
    pembayaran_diperiksa: "Pembayaran Diperiksa",
    pembayaran_ditolak: "Pembayaran Ditolak",
    dibatalkan: "Dibatalkan",
    diproses: "Diproses",
    siap_diambil: "Siap Diambil",
    sedang_dikirim: "Sedang Dikirim",
    selesai: "Selesai",
};

const statusColors: Record<OrderStatus, string> = {
    menunggu_konfirmasi: "bg-amber-50 text-amber-700 border-amber-200",
    pesanan_diterima: "bg-blue-50 text-blue-700 border-blue-200",
    menunggu_pembayaran: "bg-orange-50 text-orange-700 border-orange-200",
    pembayaran_diperiksa: "bg-purple-50 text-purple-700 border-purple-200",
    pembayaran_ditolak: "bg-red-50 text-red-700 border-red-200",
    dibatalkan: "bg-gray-100 text-gray-600 border-gray-200",
    diproses: "bg-pink-50 text-[#C9184A] border-pink-200",
    siap_diambil: "bg-teal-50 text-teal-700 border-teal-200",
    sedang_dikirim: "bg-indigo-50 text-indigo-700 border-indigo-200",
    selesai: "bg-green-50 text-green-700 border-green-200",
};

const formatRupiah = (value: number | string | undefined) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
};

const formatDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const getStatus = (order: AdminOrder): OrderStatus => {
    return order.status_order || "menunggu_konfirmasi";
};

export default function OrderList() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("semua");
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminOrders();

            setOrders(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil daftar pesanan."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const keyword = search.trim().toLowerCase();
            const idKeyword = keyword.replace(/^(?:pesanan\s*)?#?\s*/, "");

            const matchesSearch =
                !keyword ||
                (/^\d+$/.test(idKeyword) &&
                    String(order.id_order).includes(idKeyword)) ||
                (order.user?.nama || "").toLowerCase().includes(keyword) ||
                (order.user?.email || "").toLowerCase().includes(keyword) ||
                (order.user?.no_hp || "").toLowerCase().includes(keyword);

            const matchesStatus =
                filterStatus === "semua" ||
                getStatus(order) === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, filterStatus]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
    );

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterStatus]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const summary = useMemo(() => {
        return {
            total: orders.length,

            waiting: orders.filter((order) =>
                [
                    "menunggu_konfirmasi",
                    "menunggu_pembayaran",
                    "pembayaran_diperiksa",
                ].includes(getStatus(order))
            ).length,

            processing: orders.filter((order) =>
                [
                    "diproses",
                    "siap_diambil",
                    "sedang_dikirim",
                ].includes(getStatus(order))
            ).length,

            completed: orders.filter(
                (order) => getStatus(order) === "selesai"
            ).length,
        };
    }, [orders]);

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#590D22] sm:text-3xl">
                        Kelola Pesanan
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        Pantau dan kelola seluruh pesanan pelanggan SoeSweet.
                    </p>
                </div>

                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-5 py-3 text-sm font-bold text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={18}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh Pesanan
                </button>
            </div>

            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Total Pesanan
                            </p>
                            <p className="mt-2 text-2xl font-bold text-[#590D22]">
                                {summary.total}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                            <ShoppingBag size={23} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Perlu Perhatian
                            </p>
                            <p className="mt-2 text-2xl font-bold text-amber-600">
                                {summary.waiting}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock size={23} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Sedang Diproses
                            </p>
                            <p className="mt-2 text-2xl font-bold text-blue-600">
                                {summary.processing}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Package size={23} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Pesanan Selesai
                            </p>
                            <p className="mt-2 text-2xl font-bold text-green-600">
                                {summary.completed}
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CheckCircle size={23} />
                        </div>
                    </div>
                </div>

            </div>

            {/* SEARCH AND FILTER */}

            <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">
                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B17D8F]"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari ID pesanan (#123), nama, email, atau nomor HP..."
                        className="w-full rounded-xl border border-pink-100 bg-white py-3 pl-12 pr-4 text-sm text-[#590D22] outline-none transition placeholder:text-pink-300 focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm text-[#590D22] outline-none focus:border-[#C9184A]"
                >
                    <option value="semua">Semua Status</option>

                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

            </div>

            {/* ERROR */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="font-semibold">
                            Gagal memuat pesanan
                        </p>
                        <p className="mt-1">{error}</p>

                        <button
                            onClick={fetchOrders}
                            className="mt-2 font-bold underline"
                        >
                            Coba lagi
                        </button>
                    </div>
                </div>
            )}

            {/* LOADING */}

            {loading ? (
                <div className="flex min-h-[350px] items-center justify-center">
                    <div className="text-center">
                        <LoaderCircle
                            size={35}
                            className="mx-auto animate-spin text-[#C9184A]"
                        />

                        <p className="mt-3 text-sm text-gray-500">
                            Memuat data pesanan...
                        </p>
                    </div>
                </div>
            ) : (

                <>

                    {/* ORDER TABLE */}

                    {paginatedOrders.length > 0 ? (

                        <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

                            <div className="border-b border-pink-100 px-5 py-4">
                                <h2 className="font-bold text-[#590D22]">
                                    Daftar Pesanan
                                </h2>

                                <p className="mt-1 text-xs text-[#98717E]">
                                    Klik detail untuk melihat informasi lengkap pesanan.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[950px] text-left">
                                    <thead className="bg-[#FFF0F3] text-xs uppercase tracking-wide text-[#98717E]">
                                        <tr>
                                            <th className="px-5 py-4 font-bold">
                                                ID Pesanan
                                            </th>
                                            <th className="px-5 py-4 font-bold">
                                                Pelanggan
                                            </th>
                                            <th className="px-5 py-4 font-bold">
                                                Tanggal
                                            </th>
                                            <th className="px-5 py-4 font-bold">
                                                Pengiriman
                                            </th>
                                            <th className="px-5 py-4 font-bold">
                                                Total
                                            </th>
                                            <th className="px-5 py-4 font-bold">
                                                Status
                                            </th>
                                            <th className="px-5 py-4 text-center font-bold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-pink-50">
                                        {paginatedOrders.map((order) => {
                                            const status = getStatus(order);

                                            return (
                                                <tr
                                                    key={order.id_order}
                                                    className="transition hover:bg-[#FFF9FA]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="font-bold text-[#C9184A]">
                                                            #{order.id_order}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {order.orderItems?.length || 0} jenis produk
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold text-[#590D22]">
                                                            {order.user?.nama || "Pelanggan"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-[#98717E]">
                                                            {order.user?.email || "-"}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-[#76515F]">
                                                        {formatDate(order.createdAt)}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-[#76515F]">
                                                            {order.tipe_pengiriman === "delivery" ? (
                                                                <Truck size={17} className="text-[#C9184A]" />
                                                            ) : (
                                                                <Store size={17} className="text-[#C9184A]" />
                                                            )}

                                                            {order.tipe_pengiriman === "delivery"
                                                                ? "Delivery"
                                                                : "Pickup"}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#590D22]">
                                                        {formatRupiah(order.total_harga)}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${statusColors[status]}`}
                                                        >
                                                            {statusLabels[status]}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-center">
                                                        <Link
                                                            to={`/admin/orders/detail/${order.id_order}`}
                                                            title="Lihat detail pesanan"
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF0F3] px-3 py-2.5 text-sm font-bold text-[#C9184A] transition hover:bg-pink-200"
                                                        >
                                                            <Eye size={17} />
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    ) : (

                        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-white p-8 text-center">

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                                {orders.length === 0 ? (
                                    <ShoppingBag size={30} />
                                ) : (
                                    <Search size={30} />
                                )}
                            </div>

                            <h3 className="mt-4 font-bold text-[#590D22]">
                                {orders.length === 0
                                    ? "Belum Ada Pesanan"
                                    : "Pesanan Tidak Ditemukan"}
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-gray-500">
                                {orders.length === 0
                                    ? "Pesanan pelanggan yang masuk akan ditampilkan di halaman ini."
                                    : "Tidak ada pesanan yang sesuai dengan pencarian atau filter yang dipilih."}
                            </p>

                            {(search || filterStatus !== "semua") && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setFilterStatus("semua");
                                    }}
                                    className="mt-4 text-sm font-bold text-[#C9184A]"
                                >
                                    Reset Filter
                                </button>
                            )}

                        </div>

                    )}

                    {/* PAGINATION */}

                    <div className="flex flex-col gap-4 border-t border-pink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-[#98717E]">
                            Menampilkan{" "}
                            {filteredOrders.length === 0
                                ? 0
                                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            –
                            {Math.min(
                                currentPage * ITEMS_PER_PAGE,
                                filteredOrders.length
                            )}{" "}
                            dari {filteredOrders.length} pesanan
                        </p>

                        <div className="flex items-center justify-center gap-2">

                            <button
                                onClick={() => setCurrentPage((page) => page - 1)}
                                disabled={currentPage === 1}
                                className="rounded-xl border border-pink-100 bg-white p-2.5 text-[#C9184A] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={19} />
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                                        currentPage === page
                                            ? "bg-[#C9184A] text-white shadow-md shadow-pink-200"
                                            : "border border-pink-100 bg-white text-[#590D22] hover:bg-pink-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((page) => page + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-xl border border-pink-100 bg-white p-2.5 text-[#C9184A] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={19} />
                            </button>

                        </div>

                    </div>

                </>
            )}

        </div>
    );
}