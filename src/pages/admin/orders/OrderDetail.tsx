import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
    ArrowLeft,
    RefreshCw,
    LoaderCircle,
    AlertCircle,
    CheckCircle,
    XCircle,
    Package,
    UserRound,
    MapPin,
    Truck,
    Store,
    CreditCard,
    Image as ImageIcon,
    ClipboardList,
    CalendarDays,
    Phone,
    Mail,
    FileText,
    Check,
} from "lucide-react";

import { getImageUrl } from "../../../services/api";

import {
    getAdminOrderDetail,
    verifyAdminPayment,
    updateAdminOrderStatus,
    type AdminOrder,
    type OrderStatus,
} from "../../../services/orderService";

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

const allowedTransitions: Partial<
    Record<OrderStatus, OrderStatus[]>
> = {
    menunggu_konfirmasi: [
        "pesanan_diterima",
        "dibatalkan",
    ],

    pesanan_diterima: [
        "menunggu_pembayaran",
        "dibatalkan",
    ],

    menunggu_pembayaran: [
        "dibatalkan",
    ],

    diproses: [
        "siap_diambil",
        "sedang_dikirim",
    ],

    siap_diambil: [
        "selesai",
    ],

    sedang_dikirim: [
        "selesai",
    ],
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

const getPaymentStatusLabel = (status?: string) => {
    switch (status) {
        case "pending":
            return "Menunggu Pemeriksaan";
        case "verified":
            return "Terverifikasi";
        case "rejected":
            return "Ditolak";
        default:
            return "Belum Ada Pembayaran";
    }
};

const getPaymentStatusColor = (status?: string) => {
    switch (status) {
        case "verified":
            return "bg-green-50 text-green-700 border-green-200";
        case "rejected":
            return "bg-red-50 text-red-700 border-red-200";
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-200";
        default:
            return "bg-gray-100 text-gray-600 border-gray-200";
    }
};

type ConfirmationAction = "status" | "verifyPayment";

export default function OrderDetail() {
    const { id_order } = useParams();

    const orderId = Number(id_order);

    const [order, setOrder] = useState<AdminOrder | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [actionLoading, setActionLoading] = useState(false);
    const [confirmationAction, setConfirmationAction] =
        useState<ConfirmationAction | null>(null);

    const [selectedStatus, setSelectedStatus] =
        useState<OrderStatus | "">("");

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectNote, setRejectNote] = useState("");
    const [rejectError, setRejectError] = useState("");

    const fetchOrder = useCallback(async () => {
        if (!Number.isInteger(orderId) || orderId <= 0) {
            setError("ID pesanan tidak valid.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getAdminOrderDetail(orderId);

            setOrder(data);
            setSelectedStatus("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil detail pesanan."
            );
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleUpdateStatus = () => {
        if (!order || !selectedStatus) return;

        const currentStatus = getStatus(order);

        const availableStatuses =
            allowedTransitions[currentStatus] || [];

        if (!availableStatuses.includes(selectedStatus)) {
            setError("Perubahan status tersebut tidak diizinkan.");
            return;
        }

        setError("");
        setConfirmationAction("status");
    };

    const confirmUpdateStatus = async () => {
        if (!order || !selectedStatus) return;
        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            await updateAdminOrderStatus(
                order.id_order,
                selectedStatus
            );

            setSuccess("Status pesanan berhasil diperbarui.");
            setConfirmationAction(null);

            setSelectedStatus("");

            await fetchOrder();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memperbarui status pesanan."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleVerifyPayment = () => {
        if (!order) return;

        setError("");
        setConfirmationAction("verifyPayment");
    };

    const confirmVerifyPayment = async () => {
        if (!order) return;
        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            await verifyAdminPayment(
                order.id_order,
                "verified"
            );

            setSuccess(
                "Pembayaran berhasil diverifikasi. Pesanan masuk ke tahap diproses."
            );
            setConfirmationAction(null);

            await fetchOrder();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memverifikasi pembayaran."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectPayment = async () => {
        if (!order) return;

        const note = rejectNote.trim();

        if (!note) {
            setRejectError(
                "Catatan penolakan wajib diisi."
            );
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");
            setRejectError("");

            await verifyAdminPayment(
                order.id_order,
                "rejected",
                note
            );

            setShowRejectModal(false);
            setRejectNote("");

            setSuccess(
                "Pembayaran berhasil ditolak. Catatan penolakan telah disimpan."
            );

            await fetchOrder();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menolak pembayaran."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[450px] items-center justify-center">
                <div className="text-center">
                    <LoaderCircle
                        size={38}
                        className="mx-auto animate-spin text-[#C9184A]"
                    />

                    <p className="mt-3 text-sm text-gray-500">
                        Memuat detail pesanan...
                    </p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="space-y-5">

                <Link
                    to="/admin/orders"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#C9184A] transition hover:text-[#800F2F]"
                >
                    <ArrowLeft size={18} />
                    Kembali ke Pesanan
                </Link>

                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white p-8 text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <AlertCircle size={32} />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-[#590D22]">
                        Pesanan Tidak Ditemukan
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-gray-500">
                        {error || "Data pesanan tidak tersedia."}
                    </p>

                    <button
                        onClick={fetchOrder}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C]"
                    >
                        <RefreshCw size={17} />
                        Coba Lagi
                    </button>

                </div>
            </div>
        );
    }

    const status = getStatus(order);

    const availableStatuses =
        allowedTransitions[status] || [];

    const payment = order.payment;
    const paymentProofPath = payment?.bukti_pembayaran
        ? payment.bukti_pembayaran.startsWith("uploads/")
            ? payment.bukti_pembayaran
            : `uploads/payments/${payment.bukti_pembayaran}`
        : null;

    const canVerifyPayment =
        status === "pembayaran_diperiksa" &&
        payment?.status_payment === "pending" &&
        Boolean(payment.bukti_pembayaran);

    const orderItems = order.orderItems || [];

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <Link
                        to="/admin/orders"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#C9184A] transition hover:text-[#800F2F]"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Daftar Pesanan
                    </Link>

                    <h1 className="text-2xl font-bold text-[#590D22] sm:text-3xl">
                        Detail Pesanan #{order.id_order}
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        Informasi lengkap dan pengelolaan pesanan pelanggan.
                    </p>
                </div>

                <button
                    onClick={fetchOrder}
                    disabled={loading || actionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-5 py-3 text-sm font-bold text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-50"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>

            </div>

            {/* ALERTS */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                    <CheckCircle size={20} className="mt-0.5 shrink-0" />
                    <p>{success}</p>
                </div>
            )}

            {/* ORDER SUMMARY */}

            <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="text-sm text-[#98717E]">
                            Nomor Pesanan
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-[#C9184A]">
                            #{order.id_order}
                        </h2>

                        <div className="mt-3 flex items-center gap-2 text-sm text-[#98717E]">
                            <CalendarDays size={16} />
                            {formatDate(order.createdAt)}
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#98717E]">
                            Status Pesanan
                        </span>

                        <span
                            className={`rounded-full border px-4 py-2 text-sm font-bold ${statusColors[status]}`}
                        >
                            {statusLabels[status]}
                        </span>
                    </div>

                </div>

                <div className="my-5 border-t border-pink-100" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-xl bg-[#FFF9FA] p-4">
                        <p className="text-xs text-[#98717E]">
                            Jenis Pengiriman
                        </p>

                        <div className="mt-2 flex items-center gap-2 font-bold text-[#590D22]">
                            {order.tipe_pengiriman === "delivery" ? (
                                <Truck size={19} className="text-[#C9184A]" />
                            ) : (
                                <Store size={19} className="text-[#C9184A]" />
                            )}

                            {order.tipe_pengiriman === "delivery"
                                ? "Delivery"
                                : "Pickup"}
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#FFF9FA] p-4">
                        <p className="text-xs text-[#98717E]">
                            Jumlah Jenis Produk
                        </p>

                        <div className="mt-2 flex items-center gap-2 font-bold text-[#590D22]">
                            <Package size={19} className="text-[#C9184A]" />
                            {orderItems.length} jenis produk
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#FFF9FA] p-4">
                        <p className="text-xs text-[#98717E]">
                            Total Pembayaran
                        </p>

                        <p className="mt-2 text-lg font-bold text-[#C9184A]">
                            {formatRupiah(order.total_harga)}
                        </p>
                    </div>

                </div>

            </div>

            {/* MAIN CONTENT */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* LEFT COLUMN */}

                <div className="space-y-6 xl:col-span-2">

                    {/* CUSTOMER INFORMATION */}

                    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                <UserRound size={22} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#590D22]">
                                    Informasi Pelanggan
                                </h2>

                                <p className="text-xs text-[#98717E]">
                                    Data pelanggan yang membuat pesanan
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div>
                                <p className="text-xs text-[#98717E]">
                                    Nama Pelanggan
                                </p>

                                <p className="mt-1 font-semibold text-[#590D22]">
                                    {order.user?.nama || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#98717E]">
                                    Email
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-[#590D22]">
                                    <Mail size={15} className="text-[#C9184A]" />
                                    {order.user?.email || "-"}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-[#98717E]">
                                    Nomor HP
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-sm font-medium text-[#590D22]">
                                    <Phone size={15} className="text-[#C9184A]" />
                                    {order.user?.no_hp || "-"}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-[#98717E]">
                                    ID Pelanggan
                                </p>

                                <p className="mt-1 font-semibold text-[#590D22]">
                                    #{order.id_user || order.user?.id_user || "-"}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* SHIPPING INFORMATION */}

                    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                {order.tipe_pengiriman === "delivery" ? (
                                    <Truck size={22} />
                                ) : (
                                    <Store size={22} />
                                )}
                            </div>

                            <div>
                                <h2 className="font-bold text-[#590D22]">
                                    Informasi Pengiriman
                                </h2>

                                <p className="text-xs text-[#98717E]">
                                    Detail metode penerimaan pesanan
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">

                            <div>
                                <p className="text-xs text-[#98717E]">
                                    Metode Pengiriman
                                </p>

                                <p className="mt-1 font-semibold text-[#590D22]">
                                    {order.tipe_pengiriman === "delivery"
                                        ? "Delivery / Diantar"
                                        : "Pickup / Diambil Sendiri"}
                                </p>
                            </div>

                            {order.tipe_pengiriman === "delivery" && (
                                <div>
                                    <p className="text-xs text-[#98717E]">
                                        Alamat Pengiriman
                                    </p>

                                    <div className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#590D22]">
                                        <MapPin
                                            size={17}
                                            className="mt-0.5 shrink-0 text-[#C9184A]"
                                        />

                                        <p>
                                            {order.alamat_pengiriman || "Alamat belum tersedia."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-xs text-[#98717E]">
                                    Catatan Pesanan
                                </p>

                                <div className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#590D22]">
                                    <FileText
                                        size={17}
                                        className="mt-0.5 shrink-0 text-[#C9184A]"
                                    />

                                    <p>
                                        {order.catatan || "Tidak ada catatan dari pelanggan."}
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* ORDER ITEMS */}

                    <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

                        <div className="flex items-center gap-3 border-b border-pink-100 p-5 sm:p-6">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                <ShoppingBagIcon />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#590D22]">
                                    Produk yang Dipesan
                                </h2>

                                <p className="text-xs text-[#98717E]">
                                    Rincian produk dan varian pesanan
                                </p>
                            </div>
                        </div>

                        {orderItems.length > 0 ? (
                            <div className="divide-y divide-pink-50">

                                {orderItems.map((item) => (
                                    <div
                                        key={item.id_order_item}
                                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:p-6"
                                    >

                                        <img
                                            src={getImageUrl(item.product?.gambar)}
                                            alt={item.product?.nama_product || "Produk SoeSweet"}
                                            className="h-24 w-24 shrink-0 rounded-xl border border-pink-100 bg-[#FFF0F3] object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/images/hero-soes.png";
                                            }}
                                        />

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="font-bold text-[#590D22]">
                                                        {item.product?.nama_product || `Produk #${item.id_product}`}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-[#98717E]">
                                                        Isi {item.product?.jumlah_isi || "-"} pcs per paket
                                                    </p>
                                                </div>

                                                <p className="font-bold text-[#C9184A]">
                                                    {formatRupiah(item.total_harga)}
                                                </p>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-lg bg-[#FFF0F3] px-3 py-1.5 text-xs font-semibold text-[#C9184A]">
                                                    {item.quantity} paket
                                                </span>

                                                <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                                                    Harga satuan: {formatRupiah(item.harga_satuan)}
                                                </span>
                                            </div>

                                            {/* VARIANTS */}

                                            <div className="mt-4">
                                                <p className="mb-2 text-xs font-bold text-[#98717E]">
                                                    Rincian Varian Rasa
                                                </p>

                                                {item.variants && item.variants.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.variants.map((variant) => (
                                                            <span
                                                                key={variant.id_order_item_variant}
                                                                className="rounded-lg border border-pink-100 bg-white px-3 py-1.5 text-xs text-[#590D22]"
                                                            >
                                                                {variant.varian?.nama_varian || `Varian #${variant.id_varian}`}
                                                                {" × "}
                                                                <span className="font-bold text-[#C9184A]">
                                                                    {variant.jumlah}
                                                                </span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400">
                                                        Rincian varian tidak tersedia.
                                                    </p>
                                                )}
                                            </div>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-gray-500">
                                Tidak ada rincian produk pada pesanan ini.
                            </div>
                        )}

                    </div>

                </div>

                {/* RIGHT COLUMN */}

                <div className="space-y-6">

                    {/* PAYMENT INFORMATION */}

                    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                <CreditCard size={22} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#590D22]">
                                    Informasi Pembayaran
                                </h2>

                                <p className="text-xs text-[#98717E]">
                                    Status dan bukti pembayaran
                                </p>
                            </div>
                        </div>

                        {payment ? (
                            <div className="space-y-4">

                                <div>
                                    <p className="text-xs text-[#98717E]">
                                        Metode Pembayaran
                                    </p>

                                    <p className="mt-1 font-semibold text-[#590D22]">
                                        {payment.metode_pembayaran === "transfer_bank"
                                            ? "Transfer Bank"
                                            : "E-Wallet"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-[#98717E]">
                                        Status Pembayaran
                                    </p>

                                    <span
                                        className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getPaymentStatusColor(payment.status_payment)}`}
                                    >
                                        {getPaymentStatusLabel(payment.status_payment)}
                                    </span>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs text-[#98717E]">
                                        Bukti Pembayaran
                                    </p>

                                    {paymentProofPath ? (
                                        <a
                                            href={getImageUrl(paymentProofPath)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative block overflow-hidden rounded-xl border border-pink-100 bg-[#FFF0F3]"
                                        >
                                            <img
                                                src={getImageUrl(paymentProofPath)}
                                                alt={`Bukti pembayaran pesanan ${order.id_order}`}
                                                className="max-h-[300px] w-full object-contain transition group-hover:scale-[1.02]"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />

                                            <div className="flex items-center justify-center gap-2 border-t border-pink-100 bg-white px-3 py-3 text-xs font-bold text-[#C9184A]">
                                                <ImageIcon size={16} />
                                                Buka Bukti Pembayaran
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-pink-200 bg-[#FFF9FA] p-6 text-center">
                                            <ImageIcon
                                                size={30}
                                                className="text-pink-300"
                                            />

                                            <p className="mt-2 text-xs text-gray-500">
                                                Belum ada bukti pembayaran.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {payment.verified_at && (
                                    <div>
                                        <p className="text-xs text-[#98717E]">
                                            Waktu Pemeriksaan
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#590D22]">
                                            {formatDate(payment.verified_at)}
                                        </p>
                                    </div>
                                )}

                                {payment.catatan_verifikasi && (
                                    <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                                        <p className="text-xs font-bold text-red-700">
                                            Catatan Verifikasi
                                        </p>

                                        <p className="mt-1 text-sm leading-relaxed text-red-600">
                                            {payment.catatan_verifikasi}
                                        </p>
                                    </div>
                                )}

                                {/* PAYMENT ACTIONS */}

                                {canVerifyPayment && (
                                    <div className="space-y-3 border-t border-pink-100 pt-4">

                                        <p className="text-xs leading-relaxed text-[#98717E]">
                                            Periksa bukti pembayaran terlebih dahulu sebelum mengambil tindakan.
                                        </p>

                                        <button
                                            onClick={handleVerifyPayment}
                                            disabled={actionLoading}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {actionLoading ? (
                                                <LoaderCircle size={18} className="animate-spin" />
                                            ) : (
                                                <Check size={18} />
                                            )}
                                            Verifikasi Pembayaran
                                        </button>

                                        <button
                                            onClick={() => {
                                                setRejectNote("");
                                                setRejectError("");
                                                setShowRejectModal(true);
                                            }}
                                            disabled={actionLoading}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                        >
                                            <XCircle size={18} />
                                            Tolak Pembayaran
                                        </button>

                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-pink-200 bg-[#FFF9FA] p-6 text-center">
                                <CreditCard
                                    size={30}
                                    className="mx-auto text-pink-300"
                                />

                                <p className="mt-3 text-sm font-semibold text-[#590D22]">
                                    Belum Ada Pembayaran
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Informasi pembayaran akan muncul setelah pelanggan mengunggah bukti pembayaran.
                                </p>
                            </div>
                        )}

                    </div>

                    {/* ORDER TOTAL */}

                    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                <ClipboardList size={22} />
                            </div>

                            <h2 className="font-bold text-[#590D22]">
                                Rincian Pembayaran
                            </h2>
                        </div>

                        <div className="space-y-3 text-sm">

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[#98717E]">
                                    Subtotal
                                </span>

                                <span className="font-semibold text-[#590D22]">
                                    {formatRupiah(order.subtotal)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[#98717E]">
                                    Ongkos Kirim
                                </span>

                                <span className="font-semibold text-[#590D22]">
                                    {formatRupiah(order.ongkir)}
                                </span>
                            </div>

                            <div className="border-t border-dashed border-pink-200 pt-4">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-bold text-[#590D22]">
                                        Total
                                    </span>

                                    <span className="text-lg font-bold text-[#C9184A]">
                                        {formatRupiah(order.total_harga)}
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* UPDATE ORDER STATUS */}

                    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                <RefreshCw size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#590D22]">
                                    Kelola Status
                                </h2>

                                <p className="text-xs text-[#98717E]">
                                    Perbarui tahap pesanan
                                </p>
                            </div>
                        </div>

                        {availableStatuses.length > 0 ? (
                            <div className="space-y-3">

                                <label className="block text-xs font-semibold text-[#98717E]">
                                    Status Selanjutnya
                                </label>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(
                                            e.target.value as OrderStatus | ""
                                        )
                                    }
                                    disabled={actionLoading}
                                    className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm text-[#590D22] outline-none focus:border-[#C9184A] disabled:opacity-50"
                                >
                                    <option value="">
                                        Pilih status baru
                                    </option>

                                    {availableStatuses.map((nextStatus) => (
                                        <option
                                            key={nextStatus}
                                            value={nextStatus}
                                        >
                                            {statusLabels[nextStatus]}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={!selectedStatus || actionLoading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <LoaderCircle size={18} className="animate-spin" />
                                    ) : (
                                        <CheckCircle size={18} />
                                    )}

                                    Simpan Status
                                </button>

                            </div>
                        ) : (
                            <div className="rounded-xl bg-[#FFF9FA] p-4 text-center">
                                <CheckCircle
                                    size={25}
                                    className="mx-auto text-[#C9184A]"
                                />

                                <p className="mt-2 text-sm font-semibold text-[#590D22]">
                                    Tidak Ada Perubahan Status
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Pesanan saat ini tidak memiliki transisi status berikutnya yang tersedia.
                                </p>
                            </div>
                        )}

                    </div>

                </div>

            </div>

            {/* REJECT PAYMENT MODAL */}

            {confirmationAction && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onClick={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !actionLoading
                        ) {
                            setConfirmationAction(null);
                            setError("");
                        }
                    }}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="order-confirmation-title"
                        aria-describedby="order-confirmation-description"
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                    >
                        <div
                            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                                confirmationAction === "verifyPayment"
                                    ? "bg-green-50 text-green-600"
                                    : selectedStatus === "dibatalkan"
                                      ? "bg-red-50 text-red-500"
                                      : "bg-[#FFF0F3] text-[#C9184A]"
                            }`}
                        >
                            {confirmationAction === "verifyPayment" ? (
                                <CheckCircle size={28} />
                            ) : selectedStatus === "dibatalkan" ? (
                                <XCircle size={28} />
                            ) : (
                                <ClipboardList size={28} />
                            )}
                        </div>

                        <h2
                            id="order-confirmation-title"
                            className="mt-5 text-center text-xl font-bold text-[#590D22]"
                        >
                            {confirmationAction === "verifyPayment"
                                ? "Verifikasi Pembayaran?"
                                : selectedStatus === "dibatalkan"
                                  ? "Batalkan Pesanan?"
                                  : "Ubah Status Pesanan?"}
                        </h2>

                        <p
                            id="order-confirmation-description"
                            className="mt-2 text-center text-sm leading-relaxed text-gray-500"
                        >
                            {confirmationAction === "verifyPayment"
                                ? `Pastikan bukti pembayaran pesanan #${order.id_order} sudah sesuai. Status pembayaran akan diubah menjadi terverifikasi dan pesanan masuk ke tahap diproses.`
                                : `Status pesanan #${order.id_order} akan diubah menjadi "${statusLabels[selectedStatus as OrderStatus]}".`}
                        </p>

                        {error && (
                            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmationAction(null);
                                    setError("");
                                }}
                                disabled={actionLoading}
                                className="flex-1 rounded-xl border border-pink-100 py-3 text-sm font-bold text-[#590D22] transition hover:bg-pink-50 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={
                                    confirmationAction === "verifyPayment"
                                        ? confirmVerifyPayment
                                        : confirmUpdateStatus
                                }
                                disabled={actionLoading}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    confirmationAction === "verifyPayment"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : selectedStatus === "dibatalkan"
                                          ? "bg-red-500 hover:bg-red-600"
                                          : "bg-[#C9184A] hover:bg-[#A4133C]"
                                }`}
                            >
                                {actionLoading ? (
                                    <LoaderCircle size={17} className="animate-spin" />
                                ) : confirmationAction === "verifyPayment" ? (
                                    <Check size={17} />
                                ) : (
                                    <ClipboardList size={17} />
                                )}
                                {actionLoading
                                    ? "Memproses..."
                                    : confirmationAction === "verifyPayment"
                                      ? "Ya, Verifikasi"
                                      : "Ya, Ubah Status"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <XCircle size={28} />
                        </div>

                        <h2 className="mt-5 text-center text-xl font-bold text-[#590D22]">
                            Tolak Pembayaran?
                        </h2>

                        <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">
                            Masukkan alasan penolakan agar pelanggan mengetahui alasan pembayaran tidak diterima.
                        </p>

                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                Catatan Penolakan
                                <span className="text-red-500"> *</span>
                            </label>

                            <textarea
                                value={rejectNote}
                                onChange={(e) => {
                                    setRejectNote(e.target.value);
                                    setRejectError("");
                                }}
                                rows={4}
                                maxLength={1000}
                                placeholder="Contoh: Bukti pembayaran tidak jelas atau nominal tidak sesuai."
                                disabled={actionLoading}
                                className="w-full resize-none rounded-xl border border-pink-100 px-4 py-3 text-sm text-[#590D22] outline-none placeholder:text-pink-300 focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100 disabled:opacity-50"
                            />

                            <div className="mt-1 flex items-center justify-between">
                                {rejectError ? (
                                    <p className="text-xs text-red-500">
                                        {rejectError}
                                    </p>
                                ) : (
                                    <p className="text-xs text-[#98717E]">
                                        Catatan wajib diisi.
                                    </p>
                                )}

                                <p className="text-xs text-gray-400">
                                    {rejectNote.length}/1000
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectNote("");
                                    setRejectError("");
                                }}
                                disabled={actionLoading}
                                className="flex-1 rounded-xl border border-pink-100 py-3 text-sm font-bold text-[#590D22] transition hover:bg-pink-50 disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleRejectPayment}
                                disabled={actionLoading}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <LoaderCircle size={17} className="animate-spin" />
                                ) : (
                                    <XCircle size={17} />
                                )}

                                Tolak Pembayaran
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

function ShoppingBagIcon() {
    return <Package size={22} />;
}