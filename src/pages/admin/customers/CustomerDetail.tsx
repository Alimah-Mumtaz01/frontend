import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import {
    ArrowLeft,
    RefreshCw,
    LoaderCircle,
    AlertCircle,
    UserRound,
    Mail,
    Phone,
    CalendarDays,
    ShoppingBag,
    CheckCircle,
    Clock,
    Package,
    Eye,
    Truck,
    Store,
    Receipt,
} from "lucide-react";

import {
    getAdminCustomerOrderHistory,
    type AdminCustomerOrderHistory,
} from "../../../services/orderService";

import type { AdminOrder, OrderStatus } from "../../../services/orderService";

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

const formatDate = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const getStatus = (order: AdminOrder): OrderStatus => {
    return order.status_order || "menunggu_konfirmasi";
};

export default function CustomerDetail() {
    const { id_user } = useParams();

    const customerId = Number(id_user);

    const [data, setData] = useState<AdminCustomerOrderHistory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCustomerDetail = useCallback(async () => {
        if (!Number.isInteger(customerId) || customerId <= 0) {
            setError("ID pelanggan tidak valid.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await getAdminCustomerOrderHistory(customerId);

            setData(result);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil detail pelanggan."
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchCustomerDetail();
    }, [fetchCustomerDetail]);

    const orders = data?.orders || [];

    const summary = useMemo(() => {
        return {
            total: orders.length,
            completed: orders.filter(
                (order) => getStatus(order) === "selesai"
            ).length,
            ongoing: orders.filter((order) =>
                [
                    "menunggu_konfirmasi",
                    "pesanan_diterima",
                    "menunggu_pembayaran",
                    "pembayaran_diperiksa",
                    "diproses",
                    "siap_diambil",
                    "sedang_dikirim",
                ].includes(getStatus(order))
            ).length,
            totalTransaction: orders
    .filter((order) => getStatus(order) === "selesai")
    .reduce(
        (total, order) => total + Number(order.total_harga || 0),
        0
    ),
        };
    }, [orders]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <LoaderCircle
                        size={38}
                        className="mx-auto animate-spin text-[#C9184A]"
                    />
                    <p className="mt-3 text-sm text-gray-500">
                        Memuat detail pelanggan...
                    </p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="space-y-5">
                <Link
                    to="/admin/customers"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#C9184A] hover:text-[#800F2F]"
                >
                    <ArrowLeft size={18} />
                    Kembali ke Data Pelanggan
                </Link>

                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white p-8 text-center">
                    <AlertCircle size={35} className="text-red-500" />

                    <h2 className="mt-4 text-lg font-bold text-[#590D22]">
                        Detail Pelanggan Tidak Ditemukan
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-gray-500">
                        {error || "Data pelanggan tidak tersedia."}
                    </p>

                    <button
                        onClick={fetchCustomerDetail}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C]"
                    >
                        <RefreshCw size={17} />
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    const customer = data.customer;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        to="/admin/customers"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#C9184A] transition hover:text-[#800F2F]"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Data Pelanggan
                    </Link>

                    <h1 className="text-2xl font-bold text-[#590D22] sm:text-3xl">
                        Detail Pelanggan
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        Informasi pelanggan dan seluruh riwayat pesanannya.
                    </p>
                </div>

                <button
                    onClick={fetchCustomerDetail}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-5 py-3 text-sm font-bold text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-50"
                >
                    <RefreshCw size={18} />
                    Refresh Data
                </button>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* CUSTOMER PROFILE */}
            <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                        <UserRound size={32} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#98717E]">
                            Profil Pelanggan
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#590D22]">
                            {customer.nama}
                        </h2>

                        <p className="mt-1 text-sm text-[#98717E]">
                            ID Pelanggan: #{customer.id_user}
                        </p>
                    </div>

                    <span className="w-fit rounded-full border border-pink-200 bg-[#FFF0F3] px-4 py-2 text-xs font-bold text-[#C9184A]">
                        Pelanggan
                    </span>
                </div>

                <div className="my-5 border-t border-pink-100" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-3">
                        <Mail size={19} className="mt-0.5 text-[#C9184A]" />
                        <div className="min-w-0">
                            <p className="text-xs text-[#98717E]">Email</p>
                            <p className="mt-1 break-all text-sm font-semibold text-[#590D22]">
                                {customer.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone size={19} className="mt-0.5 text-[#C9184A]" />
                        <div>
                            <p className="text-xs text-[#98717E]">Nomor HP</p>
                            <p className="mt-1 text-sm font-semibold text-[#590D22]">
                                {customer.no_hp || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <CalendarDays
                            size={19}
                            className="mt-0.5 text-[#C9184A]"
                        />
                        <div>
                            <p className="text-xs text-[#98717E]">
                                Bergabung Sejak
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#590D22]">
                                {formatDate(customer.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUMMARY */}
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
                                Pesanan Berjalan
                            </p>
                            <p className="mt-2 text-2xl font-bold text-amber-600">
                                {summary.ongoing}
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

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Total Transaksi
                            </p>
                            <p className="mt-2 text-lg font-bold text-[#C9184A]">
                                {formatRupiah(summary.totalTransaction)}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                            <Receipt size={23} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ORDER HISTORY */}
            <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
                <div className="border-b border-pink-100 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                            <Package size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-[#590D22]">
                                Riwayat Pesanan
                            </h2>
                            <p className="mt-1 text-xs text-[#98717E]">
                                Seluruh pesanan yang pernah dibuat pelanggan.
                            </p>
                        </div>
                    </div>
                </div>

                {orders.length > 0 ? (
                    <div className="divide-y divide-pink-50">
                        {orders.map((order) => {
                            const status = getStatus(order);

                            return (
                                <div
                                    key={order.id_order}
                                    className="p-5 transition hover:bg-[#FFF9FA] sm:px-6"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="font-bold text-[#C9184A]">
                                                    Pesanan #{order.id_order}
                                                </h3>

                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${statusColors[status]}`}
                                                >
                                                    {statusLabels[status]}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#98717E]">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays size={15} />
                                                    {formatDate(order.createdAt)}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    {order.tipe_pengiriman === "delivery" ? (
                                                        <Truck size={15} />
                                                    ) : (
                                                        <Store size={15} />
                                                    )}

                                                    {order.tipe_pengiriman === "delivery"
                                                        ? "Delivery"
                                                        : "Pickup"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Package size={15} />
                                                    {order.orderItems?.length || 0} jenis produk
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <div className="sm:mr-4">
                                                <p className="text-xs text-[#98717E]">
                                                    Total Pembayaran
                                                </p>
                                                <p className="mt-1 font-bold text-[#590D22]">
                                                    {formatRupiah(order.total_harga)}
                                                </p>
                                            </div>

                                            <Link
                                                to={`/admin/orders/detail/${order.id_order}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF0F3] px-4 py-2.5 text-sm font-bold text-[#C9184A] transition hover:bg-pink-200"
                                            >
                                                <Eye size={17} />
                                                Detail Pesanan
                                            </Link>
                                        </div>
                                    </div>

                                    {/* ORDER ITEMS */}
                                    {order.orderItems && order.orderItems.length > 0 && (
                                        <div className="mt-4 rounded-xl bg-[#FFF9FA] p-4">
                                            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#98717E]">
                                                Produk yang dipesan
                                            </p>

                                            <div className="space-y-3">
                                                {order.orderItems.map((item) => (
                                                    <div
                                                        key={item.id_order_item}
                                                        className="flex flex-col gap-2 border-b border-pink-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#590D22]">
                                                                {item.product?.nama_product ||
                                                                    `Produk #${item.id_product}`}
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#98717E]">
                                                                {item.quantity} paket
                                                                {" · "}
                                                                Isi {item.product?.jumlah_isi || "-"} pcs per paket
                                                            </p>

                                                            {item.variants && item.variants.length > 0 && (
                                                                <p className="mt-1 text-xs text-[#98717E]">
                                                                    Varian:{" "}
                                                                    {item.variants
                                                                        .map((variant) =>
                                                                            `${variant.varian?.nama_varian || `Varian #${variant.id_varian}`} (${variant.jumlah})`
                                                                        )
                                                                        .join(", ")}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <p className="text-sm font-bold text-[#C9184A]">
                                                            {formatRupiah(item.total_harga)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                            <ShoppingBag size={30} />
                        </div>

                        <h3 className="mt-4 font-bold text-[#590D22]">
                            Belum Ada Riwayat Pesanan
                        </h3>

                        <p className="mt-2 max-w-sm text-sm text-gray-500">
                            Pelanggan ini belum pernah membuat pesanan di SoeSweet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}