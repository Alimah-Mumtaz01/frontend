import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

import {
    Search,
    RefreshCw,
    LoaderCircle,
    AlertCircle,
    ShoppingBag,
    Package,
    CalendarDays,
    Truck,
    Store,
    ChevronDown,
    ChevronUp,
    CreditCard,
    Upload,
    Image as ImageIcon,
    X,
    CheckCircle,
    Clock,
    FileText,
    Star,
    MessageSquare,
    Pencil,
    Trash2,
    Eye,
    Copy,
} from "lucide-react";

import { getImageUrl } from "../../../services/api";

import {
    getMyOrders,
    uploadMyOrderPayment,
    type CustomerOrder,
    type CustomerOrderStatus,
} from "../../../services/customerOrderService";

import {
    getMyReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    type Review,
} from "../../../services/reviewService";

type OrderTab =
    | "semua"
    | "menunggu_pembayaran"
    | "pembayaran_diperiksa"
    | "diproses"
    | "pengiriman"
    | "selesai"
    | "lainnya";

type MainTab = "pesanan" | "ulasan";
type ReviewModalMode = "create" | "edit" | "view";

const tabs: { value: OrderTab; label: string }[] = [
    { value: "semua", label: "Semua Pesanan" },
    { value: "menunggu_pembayaran", label: "Menunggu Pembayaran" },
    { value: "pembayaran_diperiksa", label: "Pembayaran Diperiksa" },
    { value: "diproses", label: "Diproses" },
    { value: "pengiriman", label: "Dalam Pengiriman" },
    { value: "selesai", label: "Riwayat Pesanan" },
    { value: "lainnya", label: "Lainnya" },
];

const statusLabels: Record<CustomerOrderStatus, string> = {
    menunggu_konfirmasi: "Menunggu Konfirmasi",
    pesanan_diterima: "Pesanan Diterima",
    menunggu_pembayaran: "Menunggu Pembayaran",
    pembayaran_diperiksa: "Pembayaran Diperiksa",
    pembayaran_ditolak: "Pembayaran Ditolak",
    dibatalkan: "Dibatalkan",
    diproses: "Sedang Diproses",
    siap_diambil: "Siap Diambil",
    sedang_dikirim: "Sedang Dikirim",
    selesai: "Selesai",
};

const statusColors: Record<CustomerOrderStatus, string> = {
    menunggu_konfirmasi: "bg-amber-50 text-amber-700",
    pesanan_diterima: "bg-blue-50 text-blue-700",
    menunggu_pembayaran: "bg-orange-50 text-orange-700",
    pembayaran_diperiksa: "bg-purple-50 text-purple-700",
    pembayaran_ditolak: "bg-red-50 text-red-700",
    dibatalkan: "bg-gray-100 text-gray-600",
    diproses: "bg-pink-50 text-[#C9184A]",
    siap_diambil: "bg-teal-50 text-teal-700",
    sedang_dikirim: "bg-indigo-50 text-indigo-700",
    selesai: "bg-green-50 text-green-700",
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
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const matchesTab = (
    order: CustomerOrder,
    tab: OrderTab
): boolean => {
    const status = order.status_order;

    switch (tab) {
        case "semua":
            return true;

        case "menunggu_pembayaran":
            return status === "menunggu_pembayaran";

        case "pembayaran_diperiksa":
            return status === "pembayaran_diperiksa";

        case "diproses":
            return status === "diproses";

        case "pengiriman":
            return (
                status === "siap_diambil" ||
                status === "sedang_dikirim"
            );

        case "selesai":
            return status === "selesai";

        case "lainnya":
            return (
                status === "menunggu_konfirmasi" ||
                status === "pesanan_diterima" ||
                status === "pembayaran_ditolak" ||
                status === "dibatalkan"
            );

        default:
            return true;
    }
};

const getReviewImageUrl = (image: string) => {
    const imagePath = image.startsWith("uploads/")
        ? image
        : `uploads/reviews/${image}`;

    return getImageUrl(imagePath);
};

function StarRating({
    value,
    onChange,
    size = 22,
    disabled = false,
}: {
    value: number;
    onChange?: (value: number) => void;
    size?: number;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled || !onChange}
                    onClick={() => onChange?.(star)}
                    className={`transition ${
                        disabled || !onChange
                            ? "cursor-default"
                            : "cursor-pointer hover:scale-110"
                    }`}
                    aria-label={`Rating ${star}`}
                >
                    <Star
                        size={size}
                        className={
                            star <= value
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-100 text-gray-300"
                        }
                    />
                </button>
            ))}
        </div>
    );
}

function ReviewImages({
    images,
}: {
    images?: Review["images"];
}) {
    if (!images || images.length === 0) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-3">
            {images.map((image) => (
                <img
                    key={image.id_review_image}
                    src={getReviewImageUrl(image.image)}
                    alt="Foto ulasan pelanggan"
                    className="h-24 w-24 rounded-xl border border-pink-100 object-cover"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/hero-soes.png";
                    }}
                />
            ))}
        </div>
    );
}

export default function MyOrders() {

    const [orders, setOrders] = useState<CustomerOrder[]>([]);
    const [activeTab, setActiveTab] = useState<OrderTab>("semua");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const [mainTab, setMainTab] = useState<MainTab>("pesanan");

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");

    const [reviewModalMode, setReviewModalMode] =
        useState<ReviewModalMode | null>(null);

    const [selectedReview, setSelectedReview] =
        useState<Review | null>(null);

    const [reviewToDelete, setReviewToDelete] =
        useState<Review | null>(null);

    const [reviewOrder, setReviewOrder] =
        useState<CustomerOrder | null>(null);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [reviewFiles, setReviewFiles] = useState<File[]>([]);
    const [reviewPreviews, setReviewPreviews] = useState<string[]>([]);
    const [reviewFileError, setReviewFileError] = useState("");

    const [savingReview, setSavingReview] = useState(false);
    const [deletingReview, setDeletingReview] = useState(false);

    const reviewFileInputRef = useRef<HTMLInputElement>(null);

    const [selectedOrder, setSelectedOrder] =
        useState<CustomerOrder | null>(null);

    const [paymentMethod, setPaymentMethod] = useState<
        "transfer_bank" | "e-wallet"
    >("transfer_bank");

    const [selectedEwallet, setSelectedEwallet] = useState<
        "DANA" | "GoPay" | "OVO" | "ShopeePay"
    >("DANA");

    const [copiedValue, setCopiedValue] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState("");
    const [fileError, setFileError] = useState("");

    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchOrders = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getMyOrders();

            setOrders(
                [...data].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil daftar pesanan."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setReviewLoading(true);
            setReviewError("");

            const data = await getMyReviews();

            setReviews(
                [...data].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
            );
        } catch (err) {
            setReviewError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil daftar ulasan."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchReviews();
    }, []);

    const refreshAll = async () => {
        setRefreshing(true);

        await Promise.all([
            fetchOrders(true),
            fetchReviews(),
        ]);

        setRefreshing(false);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                String(order.id_order).includes(search.trim());

            return (
                matchesTab(order, activeTab) &&
                matchesSearch
            );
        });
    }, [orders, activeTab, search]);

    const getTabCount = (tab: OrderTab) => {
        return orders.filter((order) => matchesTab(order, tab)).length;
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        setFileError("");
        setSelectedFile(null);

        if (filePreview) {
            URL.revokeObjectURL(filePreview);
        }

        setFilePreview("");

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setFileError(
                "Format file harus JPG, JPEG, PNG, atau WEBP."
            );

            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFileError("Ukuran gambar maksimal 5 MB.");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
        setFilePreview(URL.createObjectURL(file));
    };

    const handleCopyPaymentInfo = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);

            setCopiedValue(value);

            window.setTimeout(() => {
                setCopiedValue("");
            }, 1500);
        } catch {
            window.alert("Gagal menyalin informasi. Silakan salin secara manual.");
        }
    };

    const openPaymentModal = (order: CustomerOrder) => {
        setSelectedOrder(order);
        setPaymentMethod("transfer_bank");
        setSelectedEwallet("DANA");
        setCopiedValue("");
        setSelectedFile(null);
        setFilePreview("");
        setFileError("");
        setSuccessMessage("");
    };

    const closePaymentModal = () => {
        if (uploading) return;

        if (filePreview) {
            URL.revokeObjectURL(filePreview);
        }

        setSelectedOrder(null);
        setSelectedFile(null);
        setFilePreview("");
        setFileError("");
    };

    const handleUploadPayment = async () => {
        if (!selectedOrder) return;

        if (!selectedFile) {
            setFileError("Silakan pilih bukti pembayaran terlebih dahulu.");
            return;
        }

        try {
            setUploading(true);
            setFileError("");
            setError("");

            await uploadMyOrderPayment(
                selectedOrder.id_order,
                paymentMethod,
                selectedFile
            );

            setOrders((previous) =>
                previous.map((order) =>
                    order.id_order === selectedOrder.id_order
                        ? {
                            ...order,
                            status_order: "pembayaran_diperiksa",
                            payment: {
                                id_payment:
                                    order.payment?.id_payment || 0,
                                id_order: order.id_order,
                                metode_pembayaran: paymentMethod,
                                bukti_pembayaran: selectedFile.name,
                                status_payment: "pending",
                            },
                        }
                        : order
                )
            );

            if (filePreview) {
                URL.revokeObjectURL(filePreview);
            }

            setSelectedOrder(null);
            setSelectedFile(null);
            setFilePreview("");

            setSuccessMessage(
                `Bukti pembayaran pesanan #${selectedOrder.id_order} berhasil diunggah dan sedang diperiksa admin.`
            );

            await fetchOrders(true);
        } catch (err) {
            setFileError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengunggah bukti pembayaran."
            );
        } finally {
            setUploading(false);
        }
    };

    const openCreateReviewModal = (order: CustomerOrder) => {
        setReviewOrder(order);
        setSelectedReview(null);
        setRating(5);
        setComment("");
        setReviewFiles([]);
        setReviewFileError("");
        setReviewModalMode("create");
        setReviewPreviews([]);
    };

    const openReviewModal = async (
        reviewId: number,
        mode: "view" | "edit"
    ) => {
        try {
            setReviewError("");

            let review = reviews.find(
                (item) => item.id_review === reviewId
            );

            if (!review) {
                review = await getReviewById(reviewId);
            }

            setSelectedReview(review);
            setReviewOrder(null);
            setRating(review.rating);
            setComment(review.komentar || "");
            setReviewFiles([]);
            setReviewPreviews([]);
            setReviewFileError("");
            setReviewModalMode(mode);
        } catch (err) {
            setReviewError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil detail ulasan."
            );
        }
    };

    const closeReviewModal = () => {
        if (savingReview) return;

        reviewPreviews.forEach((preview) => {
            URL.revokeObjectURL(preview);
        });

        setReviewModalMode(null);
        setSelectedReview(null);
        setReviewOrder(null);
        setReviewFiles([]);
        setReviewPreviews([]);
        setReviewFileError("");
        setRating(5);
        setComment("");

        if (reviewFileInputRef.current) {
            reviewFileInputRef.current.value = "";
        }
    };

    const handleReviewFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(event.target.files || []);

        setReviewFileError("");

        if (selectedFiles.length === 0) return;

        const existingImageCount =
            reviewModalMode === "edit"
                ? selectedReview?.images?.length || 0
                : 0;

        const totalImages =
            existingImageCount +
            reviewFiles.length +
            selectedFiles.length;

        if (totalImages > 3) {
            setReviewFileError(
                `Maksimal 3 foto untuk satu ulasan. Foto yang sudah ada: ${existingImageCount}.`
            );

            event.target.value = "";
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const invalidFile = selectedFiles.find(
            (file) => !allowedTypes.includes(file.type)
        );

        if (invalidFile) {
            setReviewFileError(
                "Format foto harus JPG, JPEG, PNG, atau WEBP."
            );

            event.target.value = "";
            return;
        }

        const oversizedFile = selectedFiles.find(
            (file) => file.size > 5 * 1024 * 1024
        );

        if (oversizedFile) {
            setReviewFileError(
                "Ukuran setiap foto maksimal 5 MB."
            );

            event.target.value = "";
            return;
        }

        const newPreviews = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );

        setReviewFiles((previous) => [
            ...previous,
            ...selectedFiles,
        ]);

        setReviewPreviews((previous) => [
            ...previous,
            ...newPreviews,
        ]);

        event.target.value = "";
    };

    const removeReviewFile = (index: number) => {
        const preview = reviewPreviews[index];

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setReviewFiles((previous) =>
            previous.filter((_, fileIndex) => fileIndex !== index)
        );

        setReviewPreviews((previous) =>
            previous.filter((_, previewIndex) => previewIndex !== index)
        );
    };

    const handleSaveReview = async () => {
        if (rating < 1 || rating > 5) {
            setReviewFileError("Silakan pilih rating terlebih dahulu.");
            return;
        }

        try {
            setSavingReview(true);
            setReviewFileError("");
            setReviewError("");

            if (reviewModalMode === "create") {
                if (!reviewOrder) return;

                await createReview(
                    reviewOrder.id_order,
                    rating,
                    comment,
                    reviewFiles
                );

                setSuccessMessage(
                    `Ulasan untuk pesanan #${reviewOrder.id_order} berhasil dikirim. Terima kasih atas ulasanmu!`
                );
            } else if (
                reviewModalMode === "edit" &&
                selectedReview
            ) {
                await updateReview(
                    selectedReview.id_review,
                    rating,
                    comment,
                    reviewFiles
                );

                setSuccessMessage("Ulasan berhasil diperbarui.");
            }

            closeReviewModal();

            await Promise.all([
                fetchOrders(true),
                fetchReviews(),
            ]);
        } catch (err) {
            setReviewFileError(
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan ulasan."
            );
        } finally {
            setSavingReview(false);
        }
    };

    const handleDeleteReview = (review: Review) => {
        setReviewError("");
        setReviewToDelete(review);
    };

    const confirmDeleteReview = async () => {
        if (!reviewToDelete) return;

        const review = reviewToDelete;

        try {
            setDeletingReview(true);
            setReviewError("");

            await deleteReview(review.id_review);

            setSuccessMessage(
                `Ulasan untuk pesanan #${review.id_order} berhasil dihapus.`
            );

            setReviewModalMode(null);
            setSelectedReview(null);
            setReviewToDelete(null);

            await Promise.all([
                fetchOrders(true),
                fetchReviews(),
            ]);
        } catch (err) {
            setReviewError(
                err instanceof Error
                    ? err.message
                    : "Gagal menghapus ulasan."
            );
        } finally {
            setDeletingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-[#FFFAFB]">
                <div className="text-center">
                    <LoaderCircle
                        size={38}
                        className="mx-auto animate-spin text-[#C9184A]"
                    />

                    <p className="mt-3 text-sm text-[#98717E]">
                        Memuat pesanan kamu...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFAFB]">

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <p className="mb-2 text-sm font-semibold text-[#C9184A]">
                            SOESWEET
                        </p>

                        <h1 className="text-3xl font-bold text-[#590D22] sm:text-4xl">
                            {mainTab === "pesanan"
                                ? "Pesanan Saya"
                                : "Ulasan Saya"}
                        </h1>

                        <p className="mt-2 text-sm text-[#98717E]">
                            {mainTab === "pesanan"
                                ? "Pantau pesanan dan pembayaran kamu di sini."
                                : "Lihat dan kelola ulasan yang sudah kamu berikan."}
                        </p>
                    </div>

                    <button
                        onClick={refreshAll}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-5 py-3 text-sm font-bold text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Muat Ulang
                    </button>

                </div>

                {/* SUCCESS */}

                {successMessage && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                        <CheckCircle size={20} className="shrink-0" />
                        <p>{successMessage}</p>

                        <button
                            onClick={() => setSuccessMessage("")}
                            className="ml-auto"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* ORDER ERROR */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* REVIEW ERROR */}

                {reviewError && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>{reviewError}</p>

                        <button
                            onClick={() => setReviewError("")}
                            className="ml-auto"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* MAIN TABS */}

                <div className="mb-8 grid grid-cols-2 gap-3 rounded-2xl border border-pink-100 bg-white p-2 shadow-sm">

                    <button
                        onClick={() => setMainTab("pesanan")}
                        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                            mainTab === "pesanan"
                                ? "bg-[#C9184A] text-white shadow-md shadow-pink-100"
                                : "text-[#98717E] hover:bg-[#FFF0F3] hover:text-[#C9184A]"
                        }`}
                    >
                        <ShoppingBag size={18} />
                        Pesanan Saya
                        <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
                            {orders.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setMainTab("ulasan")}
                        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                            mainTab === "ulasan"
                                ? "bg-[#C9184A] text-white shadow-md shadow-pink-100"
                                : "text-[#98717E] hover:bg-[#FFF0F3] hover:text-[#C9184A]"
                        }`}
                    >
                        <MessageSquare size={18} />
                        Ulasan Saya
                        <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
                            {reviews.length}
                        </span>
                    </button>

                </div>

                {mainTab === "pesanan" && (
                    <>
                        {/* SUMMARY */}

                        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

                            <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                    <ShoppingBag size={20} />
                                </div>

                                <p className="mt-3 text-2xl font-bold text-[#590D22]">
                                    {orders.length}
                                </p>

                                <p className="mt-1 text-xs text-[#98717E]">
                                    Total Pesanan
                                </p>
                            </div>

                            <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                                    <CreditCard size={20} />
                                </div>

                                <p className="mt-3 text-2xl font-bold text-[#590D22]">
                                    {getTabCount("menunggu_pembayaran")}
                                </p>

                                <p className="mt-1 text-xs text-[#98717E]">
                                    Belum Dibayar
                                </p>
                            </div>

                            <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                    <Clock size={20} />
                                </div>

                                <p className="mt-3 text-2xl font-bold text-[#590D22]">
                                    {getTabCount("pembayaran_diperiksa")}
                                </p>

                                <p className="mt-1 text-xs text-[#98717E]">
                                    Diperiksa
                                </p>
                            </div>

                            <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                    <CheckCircle size={20} />
                                </div>

                                <p className="mt-3 text-2xl font-bold text-[#590D22]">
                                    {getTabCount("selesai")}
                                </p>

                                <p className="mt-1 text-xs text-[#98717E]">
                                    Selesai
                                </p>
                            </div>

                        </div>

                        {/* SEARCH */}

                        <div className="relative mb-5">

                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B17D8F]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan nomor pesanan..."
                                className="w-full rounded-xl border border-pink-100 bg-white py-3 pl-12 pr-4 text-sm text-[#590D22] outline-none transition placeholder:text-pink-300 focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                            />

                        </div>

                        {/* ORDER STATUS TABS */}

                        <div className="mb-6 overflow-x-auto">
                            <div className="flex min-w-max gap-2 border-b border-pink-100 pb-3">

                                {tabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setActiveTab(tab.value)}
                                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                            activeTab === tab.value
                                                ? "bg-[#C9184A] text-white shadow-md shadow-pink-200"
                                                : "bg-white text-[#98717E] hover:bg-[#FFF0F3] hover:text-[#C9184A]"
                                        }`}
                                    >
                                        {tab.label}

                                        <span
                                            className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                                activeTab === tab.value
                                                    ? "bg-white/20 text-white"
                                                    : "bg-[#FFF0F3] text-[#C9184A]"
                                            }`}
                                        >
                                            {getTabCount(tab.value)}
                                        </span>
                                    </button>
                                ))}

                            </div>
                        </div>

                        {/* ORDER LIST */}

                        {filteredOrders.length > 0 ? (
                            <div className="space-y-5">

                                {filteredOrders.map((order) => {
                                    const status = order.status_order;
                                    const expanded =
                                        expandedOrder === order.id_order;

                                    const items = order.orderItems || [];
                                    const hasReview = Boolean(order.review);

                                    return (
                                        <article
                                            key={order.id_order}
                                            className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:shadow-md"
                                        >

                                            {/* CARD HEADER */}

                                            <div className="flex flex-col gap-3 border-b border-pink-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-bold text-[#590D22]">
                                                            Pesanan #{order.id_order}
                                                        </span>

                                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[status]}`}>
                                                            {statusLabels[status]}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 flex items-center gap-2 text-xs text-[#98717E]">
                                                        <CalendarDays size={14} />
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-[#98717E]">
                                                    {order.tipe_pengiriman === "delivery" ? (
                                                        <Truck size={17} className="text-[#C9184A]" />
                                                    ) : (
                                                        <Store size={17} className="text-[#C9184A]" />
                                                    )}

                                                    {order.tipe_pengiriman === "delivery"
                                                        ? "Delivery"
                                                        : "Pickup"}
                                                </div>

                                            </div>

                                            {/* CARD BODY */}

                                            <div className="p-5">

                                                <div className="space-y-4">

                                                    {items.slice(0, expanded ? items.length : 2).map((item) => (
                                                        <div
                                                            key={item.id_order_item}
                                                            className="flex gap-4"
                                                        >

                                                            <img
                                                                src={getImageUrl(item.product?.gambar)}
                                                                alt={item.product?.nama_product || "Produk SoeSweet"}
                                                                className="h-20 w-20 shrink-0 rounded-xl border border-pink-100 bg-[#FFF0F3] object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = "/images/hero-soes.png";
                                                                }}
                                                            />

                                                            <div className="min-w-0 flex-1">

                                                                <h3 className="font-bold text-[#590D22]">
                                                                    {item.product?.nama_product || `Produk #${item.id_product}`}
                                                                </h3>

                                                                <p className="mt-1 text-xs text-[#98717E]">
                                                                    {item.quantity} paket
                                                                    {" · "}
                                                                    Isi {item.product?.jumlah_isi || "-"} pcs
                                                                </p>

                                                                <p className="mt-2 text-sm font-bold text-[#C9184A]">
                                                                    {formatRupiah(item.total_harga)}
                                                                </p>

                                                                {item.variants && item.variants.length > 0 && (
                                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                                        {item.variants.map((variant) => (
                                                                            <span
                                                                                key={variant.id_order_item_variant}
                                                                                className="rounded-md bg-[#FFF0F3] px-2 py-1 text-[11px] text-[#800F2F]"
                                                                            >
                                                                                {variant.varian?.nama_varian || `Varian #${variant.id_varian}`}
                                                                                {" × "}
                                                                                {variant.jumlah}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                            </div>

                                                        </div>
                                                    ))}

                                                </div>

                                                {items.length > 2 && (
                                                    <button
                                                        onClick={() =>
                                                            setExpandedOrder(
                                                                expanded ? null : order.id_order
                                                            )
                                                        }
                                                        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#C9184A]"
                                                    >
                                                        {expanded ? (
                                                            <>
                                                                Tampilkan lebih sedikit
                                                                <ChevronUp size={15} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                Lihat {items.length - 2} produk lainnya
                                                                <ChevronDown size={15} />
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {/* TOTAL */}

                                                <div className="mt-5 flex flex-col gap-3 border-t border-pink-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                                                    <div>
                                                        <p className="text-xs text-[#98717E]">
                                                            Total Pembayaran
                                                        </p>

                                                        <p className="mt-1 text-xl font-bold text-[#C9184A]">
                                                            {formatRupiah(order.total_harga)}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col gap-2 sm:flex-row">

                                                        {status === "menunggu_pembayaran" && (
                                                            <button
                                                                onClick={() => openPaymentModal(order)}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-100 transition hover:bg-[#A4133C]"
                                                            >
                                                                <Upload size={17} />
                                                                Bayar Sekarang
                                                            </button>
                                                        )}

                                                        {/* REVIEW BUTTON */}

                                                        {status === "selesai" && (
                                                            hasReview ? (
                                                                <button
                                                                    onClick={() =>
                                                                        openReviewModal(
                                                                            order.review!.id_review,
                                                                            "view"
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9184A] bg-white px-5 py-3 text-sm font-bold text-[#C9184A] transition hover:bg-[#FFF0F3]"
                                                                >
                                                                    <Eye size={17} />
                                                                    Lihat Ulasan
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => openCreateReviewModal(order)}
                                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-100 transition hover:bg-[#A4133C]"
                                                                >
                                                                    <Star size={17} />
                                                                    Beri Ulasan
                                                                </button>
                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                                {/* PAYMENT STATUS */}

                                                {status === "pembayaran_diperiksa" && (
                                                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4">
                                                        <Clock
                                                            size={19}
                                                            className="mt-0.5 shrink-0 text-purple-600"
                                                        />

                                                        <div>
                                                            <p className="text-sm font-bold text-purple-800">
                                                                Pembayaran Sedang Diperiksa
                                                            </p>

                                                            <p className="mt-1 text-xs leading-relaxed text-purple-700">
                                                                Bukti pembayaran sudah diterima. Silakan tunggu pemeriksaan admin.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {status === "pembayaran_ditolak" && (
                                                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                                                        <p className="text-sm font-bold text-red-700">
                                                            Pembayaran Ditolak
                                                        </p>

                                                        <p className="mt-1 text-xs leading-relaxed text-red-600">
                                                            {order.payment?.catatan_verifikasi ||
                                                                "Silakan periksa informasi pembayaran dan hubungi admin jika membutuhkan bantuan."}
                                                        </p>
                                                    </div>
                                                )}

                                                {status === "selesai" && (
                                                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-xs font-medium text-green-700">
                                                        <CheckCircle size={17} />
                                                        Pesanan telah selesai. Terima kasih telah berbelanja di SoeSweet!
                                                    </div>
                                                )}

                                            </div>

                                        </article>
                                    );
                                })}

                            </div>
                        ) : (
                            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-white p-8 text-center">

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                                    <Package size={32} />
                                </div>

                                <h2 className="mt-4 font-bold text-[#590D22]">
                                    {orders.length === 0
                                        ? "Belum Ada Pesanan"
                                        : "Pesanan Tidak Ditemukan"}
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#98717E]">
                                    {orders.length === 0
                                        ? "Kamu belum memiliki pesanan. Yuk, pilih kue soes favoritmu!"
                                        : "Tidak ada pesanan yang sesuai dengan tab atau pencarian ini."}
                                </p>

                                {orders.length === 0 ? (
                                    <Link
                                        to="/products"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C]"
                                    >
                                        <ShoppingBag size={17} />
                                        Lihat Produk
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setActiveTab("semua");
                                        }}
                                        className="mt-5 text-sm font-bold text-[#C9184A]"
                                    >
                                        Reset Pencarian dan Tab
                                    </button>
                                )}

                            </div>
                        )}
                    </>
                )}

                {mainTab === "ulasan" && (
                    <>
                        {reviewLoading ? (
                            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-pink-100 bg-white">
                                <div className="text-center">
                                    <LoaderCircle
                                        size={34}
                                        className="mx-auto animate-spin text-[#C9184A]"
                                    />

                                    <p className="mt-3 text-sm text-[#98717E]">
                                        Memuat ulasan kamu...
                                    </p>
                                </div>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="space-y-5">

                                {reviews.map((review) => (
                                    <article
                                        key={review.id_review}
                                        className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm"
                                    >

                                        <div className="flex flex-col gap-3 border-b border-pink-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                                            <div>
                                                <p className="text-sm font-bold text-[#590D22]">
                                                    Ulasan Pesanan #{review.id_order}
                                                </p>

                                                <p className="mt-1 flex items-center gap-2 text-xs text-[#98717E]">
                                                    <CalendarDays size={14} />
                                                    {formatDate(review.createdAt)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <StarRating
                                                    value={review.rating}
                                                    disabled
                                                    size={18}
                                                />

                                                <span className="text-sm font-bold text-[#590D22]">
                                                    {review.rating}/5
                                                </span>
                                            </div>

                                        </div>

                                        <div className="p-5">

                                            {review.komentar ? (
                                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#76515E]">
                                                    {review.komentar}
                                                </p>
                                            ) : (
                                                <p className="text-sm italic text-[#B17D8F]">
                                                    Tidak ada komentar.
                                                </p>
                                            )}

                                            <ReviewImages images={review.images} />

                                            {/* ORDER PRODUCTS */}

                                            {review.order?.orderItems && (
                                                <div className="mt-5 border-t border-pink-100 pt-4">

                                                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#98717E]">
                                                        Produk dalam Pesanan
                                                    </p>

                                                    <div className="space-y-3">
                                                        {review.order.orderItems.map((item) => (
                                                            <div
                                                                key={item.id_order_item}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <img
                                                                    src={getImageUrl(item.product?.gambar)}
                                                                    alt={item.product?.nama_product || "Produk SoeSweet"}
                                                                    className="h-14 w-14 rounded-xl border border-pink-100 bg-[#FFF0F3] object-cover"
                                                                    onError={(event) => {
                                                                        event.currentTarget.onerror = null;
                                                                        event.currentTarget.src = "/images/hero-soes.png";
                                                                    }}
                                                                />

                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-bold text-[#590D22]">
                                                                        {item.product?.nama_product || `Produk #${item.id_product}`}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-[#98717E]">
                                                                        {item.quantity} paket
                                                                    </p>

                                                                    {item.variants && item.variants.length > 0 && (
                                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                                            {item.variants.map((variant) => (
                                                                                <span
                                                                                    key={variant.id_order_item_variant}
                                                                                    className="rounded-md bg-[#FFF0F3] px-2 py-1 text-[10px] text-[#800F2F]"
                                                                                >
                                                                                    {variant.varian?.nama_varian || `Varian #${variant.id_varian}`}
                                                                                    {" × "}
                                                                                    {variant.jumlah}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                            )}

                                            {/* REVIEW ACTIONS */}

                                            <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-pink-100 pt-4">

                                                <button
                                                    onClick={() =>
                                                        openReviewModal(review.id_review, "view")
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl border border-pink-100 px-4 py-2.5 text-xs font-bold text-[#800F2F] transition hover:bg-[#FFF0F3]"
                                                >
                                                    <Eye size={15} />
                                                    Detail
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openReviewModal(review.id_review, "edit")
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl border border-[#C9184A] px-4 py-2.5 text-xs font-bold text-[#C9184A] transition hover:bg-[#FFF0F3]"
                                                >
                                                    <Pencil size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteReview(review)}
                                                    disabled={deletingReview}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    {deletingReview ? (
                                                        <LoaderCircle size={15} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                    Hapus
                                                </button>

                                            </div>

                                        </div>

                                    </article>
                                ))}

                            </div>
                        ) : (
                            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-white p-8 text-center">

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                                    <MessageSquare size={30} />
                                </div>

                                <h2 className="mt-4 font-bold text-[#590D22]">
                                    Belum Ada Ulasan
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#98717E]">
                                    Kamu belum memberikan ulasan. Setelah pesanan selesai, kamu bisa memberikan rating dan berbagi pengalaman berbelanja di SoeSweet.
                                </p>

                                <button
                                    onClick={() => setMainTab("pesanan")}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C]"
                                >
                                    <ShoppingBag size={17} />
                                    Lihat Pesanan
                                </button>

                            </div>
                        )}
                    </>
                )}

            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">

                    <div className="my-auto w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-7">

                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#C9184A]">
                                    Pembayaran SoeSweet
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-[#590D22]">
                                    Upload Bukti Pembayaran
                                </h2>

                                <p className="mt-1 text-sm text-[#98717E]">
                                    Pesanan #{selectedOrder.id_order}
                                </p>
                            </div>

                            <button
                                onClick={closePaymentModal}
                                disabled={uploading}
                                className="rounded-xl p-2 text-gray-400 transition hover:bg-pink-50 hover:text-[#C9184A] disabled:opacity-50"
                            >
                                <X size={21} />
                            </button>

                        </div>

                        <div className="mt-5 rounded-2xl bg-[#FFF0F3] p-4">
                            <p className="text-xs text-[#98717E]">
                                Total yang harus dibayar
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#C9184A]">
                                {formatRupiah(selectedOrder.total_harga)}
                            </p>
                        </div>

                        <div className="mt-6">
                            <label className="mb-3 block text-sm font-bold text-[#590D22]">
                                Pilih Metode Pembayaran
                            </label>

                            <div className="grid grid-cols-2 gap-3">

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("transfer_bank")}
                                    disabled={uploading}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        paymentMethod === "transfer_bank"
                                            ? "border-[#C9184A] bg-[#FFF0F3] ring-2 ring-pink-100"
                                            : "border-pink-100 bg-white hover:bg-pink-50"
                                    }`}
                                >
                                    <CreditCard
                                        size={23}
                                        className="text-[#C9184A]"
                                    />

                                    <p className="mt-2 text-sm font-bold text-[#590D22]">
                                        Transfer Bank
                                    </p>

                                    <p className="mt-1 text-xs text-[#98717E]">
                                        Pembayaran melalui bank
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("e-wallet")}
                                    disabled={uploading}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        paymentMethod === "e-wallet"
                                            ? "border-[#C9184A] bg-[#FFF0F3] ring-2 ring-pink-100"
                                            : "border-pink-100 bg-white hover:bg-pink-50"
                                    }`}
                                >
                                    <CreditCard
                                        size={23}
                                        className="text-[#C9184A]"
                                    />

                                    <p className="mt-2 text-sm font-bold text-[#590D22]">
                                        E-Wallet
                                    </p>

                                    <p className="mt-1 text-xs text-[#98717E]">
                                        Pembayaran dompet digital
                                    </p>
                                </button>

                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-pink-100 bg-white p-4">

                            {paymentMethod === "transfer_bank" ? (
                                <>
                                    <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                            <CreditCard size={23} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#98717E]">
                                                Transfer Bank
                                            </p>
                                            <h3 className="text-lg font-bold text-[#590D22]">
                                                SMBC
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4">

                                        <div>
                                            <p className="text-xs text-[#98717E]">
                                                Nomor Rekening
                                            </p>

                                            <div className="mt-1 flex items-center justify-between gap-3">
                                                <p className="text-lg font-bold tracking-wide text-[#590D22]">
                                                    1234567890
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyPaymentInfo("1234567890")}
                                                    disabled={uploading}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF0F3] px-3 py-2 text-xs font-bold text-[#C9184A] transition hover:bg-pink-100"
                                                >
                                                    {copiedValue === "1234567890" ? (
                                                        <>
                                                            <CheckCircle size={15} />
                                                            Tersalin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={15} />
                                                            Salin
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-pink-50 pt-3">
                                            <p className="text-xs text-[#98717E]">
                                                Nama Pemilik Rekening
                                            </p>

                                            <div className="mt-1 flex items-center justify-between gap-3">
                                                <p className="font-bold text-[#590D22]">
                                                    soesweet
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyPaymentInfo("soesweet")}
                                                    disabled={uploading}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF0F3] px-3 py-2 text-xs font-bold text-[#C9184A] transition hover:bg-pink-100"
                                                >
                                                    {copiedValue === "soesweet" ? (
                                                        <>
                                                            <CheckCircle size={15} />
                                                            Tersalin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={15} />
                                                            Salin
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 border-b border-pink-100 pb-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                            <CreditCard size={23} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#98717E]">
                                                Pembayaran Dompet Digital
                                            </p>
                                            <h3 className="text-lg font-bold text-[#590D22]">
                                                E-Wallet
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mb-3 mt-4 text-xs font-semibold text-[#98717E]">
                                        Pilih Penyedia E-Wallet
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {(["DANA", "GoPay", "OVO", "ShopeePay"] as const).map(
                                            (provider) => (
                                                <button
                                                    key={provider}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEwallet(provider);
                                                        setCopiedValue("");
                                                    }}
                                                    disabled={uploading}
                                                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                                                        selectedEwallet === provider
                                                            ? "border-[#C9184A] bg-[#FFF0F3] text-[#C9184A] ring-2 ring-pink-100"
                                                            : "border-pink-100 bg-white text-[#98717E] hover:bg-pink-50"
                                                    }`}
                                                >
                                                    {provider}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-4 space-y-4 rounded-xl bg-[#FFF9FA] p-3">

                                        <div>
                                            <p className="text-xs text-[#98717E]">
                                                Nomor Akun {selectedEwallet}
                                            </p>

                                            <div className="mt-1 flex items-center justify-between gap-3">
                                                <p className="text-lg font-bold tracking-wide text-[#590D22]">
                                                    087654321
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyPaymentInfo("087654321")}
                                                    disabled={uploading}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF0F3] px-3 py-2 text-xs font-bold text-[#C9184A] transition hover:bg-pink-100"
                                                >
                                                    {copiedValue === "087654321" ? (
                                                        <>
                                                            <CheckCircle size={15} />
                                                            Tersalin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={15} />
                                                            Salin
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-pink-100 pt-3">
                                            <p className="text-xs text-[#98717E]">
                                                Username
                                            </p>

                                            <div className="mt-1 flex items-center justify-between gap-3">
                                                <p className="font-bold text-[#590D22]">
                                                    soesweet
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyPaymentInfo("soesweet")}
                                                    disabled={uploading}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF0F3] px-3 py-2 text-xs font-bold text-[#C9184A] transition hover:bg-pink-100"
                                                >
                                                    {copiedValue === "soesweet" ? (
                                                        <>
                                                            <CheckCircle size={15} />
                                                            Tersalin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={15} />
                                                            Salin
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            )}

                            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                                <AlertCircle
                                    size={16}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />

                                <p className="text-xs leading-relaxed text-amber-800">
                                    Pastikan kamu melakukan pembayaran sesuai metode yang dipilih
                                    dan nominal total pesanan. Setelah transfer, unggah bukti
                                    pembayaran pada bagian berikut.
                                </p>
                            </div>

                        </div>


                        <div className="mt-6">

                            <label className="mb-2 block text-sm font-bold text-[#590D22]">
                                Bukti Pembayaran
                                <span className="text-red-500"> *</span>
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="hidden"
                            />

                            {filePreview ? (
                                <div className="overflow-hidden rounded-2xl border border-pink-100">

                                    <div className="flex items-center justify-between bg-[#FFF9FA] p-3">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <ImageIcon
                                                size={18}
                                                className="shrink-0 text-[#C9184A]"
                                            />

                                            <span className="truncate text-xs font-semibold text-[#590D22]">
                                                {selectedFile?.name}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (filePreview) {
                                                    URL.revokeObjectURL(filePreview);
                                                }

                                                setSelectedFile(null);
                                                setFilePreview("");

                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            }}
                                            disabled={uploading}
                                            className="ml-2 rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>

                                    <img
                                        src={filePreview}
                                        alt="Preview bukti pembayaran"
                                        className="max-h-64 w-full bg-[#FFF9FA] object-contain"
                                    />

                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-[#FFF9FA] px-5 py-9 text-center transition hover:border-[#C9184A] hover:bg-[#FFF0F3]"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                        <Upload size={23} />
                                    </div>

                                    <p className="mt-3 text-sm font-bold text-[#590D22]">
                                        Pilih Gambar Bukti Pembayaran
                                    </p>

                                    <p className="mt-1 text-xs text-[#98717E]">
                                        JPG, JPEG, PNG, atau WEBP · Maksimal 5 MB
                                    </p>
                                </button>
                            )}

                            {fileError && (
                                <p className="mt-2 flex items-center gap-2 text-xs text-red-500">
                                    <AlertCircle size={15} />
                                    {fileError}
                                </p>
                            )}

                        </div>

                        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                            <FileText
                                size={17}
                                className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <p className="text-xs leading-relaxed text-amber-800">
                                Pastikan gambar bukti pembayaran jelas dan nominalnya sesuai dengan total pesanan. Setelah diunggah, pembayaran akan diperiksa oleh admin.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                            <button
                                onClick={closePaymentModal}
                                disabled={uploading}
                                className="flex-1 rounded-xl border border-pink-100 py-3 text-sm font-bold text-[#590D22] transition hover:bg-pink-50 disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUploadPayment}
                                disabled={uploading || !selectedFile}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C9184A] py-3 text-sm font-bold text-white shadow-md shadow-pink-100 transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading ? (
                                    <>
                                        <LoaderCircle
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Mengunggah...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Kirim Bukti Pembayaran
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {reviewModalMode && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">

                    <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#C9184A]">
                                    SOESWEET
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-[#590D22]">
                                    {reviewModalMode === "create"
                                        ? "Berikan Ulasan"
                                        : reviewModalMode === "edit"
                                            ? "Edit Ulasan"
                                            : "Detail Ulasan"}
                                </h2>

                                <p className="mt-1 text-sm text-[#98717E]">
                                    {reviewModalMode === "create"
                                        ? `Pesanan #${reviewOrder?.id_order}`
                                        : `Pesanan #${selectedReview?.id_order}`}
                                </p>
                            </div>

                            <button
                                onClick={closeReviewModal}
                                disabled={savingReview}
                                className="rounded-xl p-2 text-gray-400 transition hover:bg-pink-50 hover:text-[#C9184A] disabled:opacity-50"
                            >
                                <X size={21} />
                            </button>

                        </div>

                        {/* RATING */}

                        <div className="mt-6 rounded-2xl bg-[#FFF0F3] p-5 text-center">

                            <p className="text-sm font-bold text-[#590D22]">
                                {reviewModalMode === "view"
                                    ? "Rating yang kamu berikan"
                                    : "Bagaimana pengalaman belanjamu?"}
                            </p>

                            <div className="mt-3 flex justify-center">
                                <StarRating
                                    value={rating}
                                    onChange={setRating}
                                    size={32}
                                    disabled={reviewModalMode === "view"}
                                />
                            </div>

                            <p className="mt-2 text-xs text-[#98717E]">
                                {rating} dari 5 bintang
                            </p>

                        </div>

                        {/* COMMENT */}

                        <div className="mt-6">

                            <label className="mb-2 block text-sm font-bold text-[#590D22]">
                                Komentar Ulasan
                            </label>

                            {reviewModalMode === "view" ? (
                                <div className="min-h-24 rounded-xl border border-pink-100 bg-[#FFFAFB] p-4 text-sm leading-relaxed text-[#76515E]">
                                    {comment || "Tidak ada komentar."}
                                </div>
                            ) : (
                                <textarea
                                    value={comment}
                                    onChange={(event) => setComment(event.target.value)}
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Ceritakan pengalaman kamu saat membeli produk SoeSweet..."
                                    className="w-full resize-y rounded-xl border border-pink-100 bg-white p-4 text-sm text-[#590D22] outline-none transition placeholder:text-pink-300 focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                                />
                            )}

                            {reviewModalMode !== "view" && (
                                <p className="mt-1 text-right text-xs text-[#B17D8F]">
                                    {comment.length}/1000 karakter
                                </p>
                            )}

                        </div>

                        {/* EXISTING REVIEW IMAGES */}

                        {reviewModalMode !== "create" &&
                            selectedReview?.images &&
                            selectedReview.images.length > 0 && (
                                <div className="mt-6">

                                    <p className="mb-3 text-sm font-bold text-[#590D22]">
                                        Foto Ulasan
                                    </p>

                                    <ReviewImages images={selectedReview.images} />

                                    {reviewModalMode === "edit" && (
                                        <p className="mt-2 text-xs text-[#98717E]">
                                            Foto yang sudah diunggah tetap tersimpan. Kamu hanya dapat menambahkan foto baru.
                                        </p>
                                    )}

                                </div>
                            )}

                        {/* NEW REVIEW IMAGES */}

                        {reviewModalMode !== "view" && (
                            <div className="mt-6">

                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-bold text-[#590D22]">
                                        Tambahkan Foto
                                    </label>

                                    <span className="text-xs text-[#98717E]">
                                        Maksimal 3 foto
                                    </span>
                                </div>

                                <input
                                    ref={reviewFileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleReviewFileChange}
                                    className="hidden"
                                />

                                <div className="grid grid-cols-3 gap-3">

                                    {reviewPreviews.map((preview, index) => (
                                        <div
                                            key={preview}
                                            className="group relative aspect-square overflow-hidden rounded-xl border border-pink-100"
                                        >
                                            <img
                                                src={preview}
                                                alt={`Foto ulasan ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeReviewFile(index)}
                                                className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white transition hover:bg-red-600"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                    ))}

                                    {(
                                        (reviewModalMode === "edit"
                                            ? selectedReview?.images?.length || 0
                                            : 0) +
                                        reviewFiles.length
                                    ) < 3 && (
                                        <button
                                            type="button"
                                            onClick={() => reviewFileInputRef.current?.click()}
                                            className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-pink-200 bg-[#FFF9FA] text-[#C9184A] transition hover:border-[#C9184A] hover:bg-[#FFF0F3]"
                                        >
                                            <Upload size={23} />

                                            <span className="mt-2 text-xs font-bold">
                                                Tambah Foto
                                            </span>
                                        </button>
                                    )}

                                </div>

                                <p className="mt-2 text-xs text-[#98717E]">
                                    Format JPG, PNG, atau WEBP. Maksimal 5 MB per foto.
                                </p>

                                {reviewFileError && (
                                    <p className="mt-2 flex items-center gap-2 text-xs text-red-500">
                                        <AlertCircle size={15} />
                                        {reviewFileError}
                                    </p>
                                )}

                            </div>
                        )}

                        {/* PRODUCTS IN ORDER */}

                        {(reviewOrder?.orderItems ||
                            selectedReview?.order?.orderItems) && (
                            <div className="mt-6 border-t border-pink-100 pt-5">

                                <p className="mb-3 text-sm font-bold text-[#590D22]">
                                    Produk dalam Pesanan
                                </p>

                                <div className="space-y-3">
                                    {(reviewOrder?.orderItems ||
                                        selectedReview?.order?.orderItems ||
                                        []).map((item) => (
                                        <div
                                            key={item.id_order_item}
                                            className="flex items-center gap-3"
                                        >
                                            <img
                                                src={getImageUrl(item.product?.gambar)}
                                                alt={item.product?.nama_product || "Produk SoeSweet"}
                                                className="h-14 w-14 rounded-xl border border-pink-100 bg-[#FFF0F3] object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.onerror = null;
                                                    event.currentTarget.src = "/images/hero-soes.png";
                                                }}
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-[#590D22]">
                                                    {item.product?.nama_product || `Produk #${item.id_product}`}
                                                </p>

                                                <p className="mt-1 text-xs text-[#98717E]">
                                                    {item.quantity} paket
                                                </p>

                                                {item.variants?.map((variant) => (
                                                    <span
                                                        key={variant.id_order_item_variant}
                                                        className="mr-1 mt-1 inline-block rounded-md bg-[#FFF0F3] px-2 py-1 text-[10px] text-[#800F2F]"
                                                    >
                                                        {variant.varian?.nama_varian || `Varian #${variant.id_varian}`}
                                                        {" × "}
                                                        {variant.jumlah}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}

                        {/* MODAL ACTIONS */}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">

                            <button
                                onClick={closeReviewModal}
                                disabled={savingReview}
                                className="flex-1 rounded-xl border border-pink-100 py-3 text-sm font-bold text-[#590D22] transition hover:bg-pink-50 disabled:opacity-50"
                            >
                                {reviewModalMode === "view" ? "Tutup" : "Batal"}
                            </button>

                            {reviewModalMode === "view" && selectedReview && (
                                <>
                                    <button
                                        onClick={() => openReviewModal(selectedReview.id_review, "edit")}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#C9184A] py-3 text-sm font-bold text-[#C9184A] transition hover:bg-[#FFF0F3]"
                                    >
                                        <Pencil size={17} />
                                        Edit Ulasan
                                    </button>

                                    <button
                                        onClick={() => handleDeleteReview(selectedReview)}
                                        disabled={deletingReview}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                    >
                                        {deletingReview ? (
                                            <LoaderCircle size={17} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={17} />
                                        )}
                                        Hapus
                                    </button>
                                </>
                            )}

                            {reviewModalMode !== "view" && (
                                <button
                                    onClick={handleSaveReview}
                                    disabled={savingReview}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C9184A] py-3 text-sm font-bold text-white shadow-md shadow-pink-100 transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingReview ? (
                                        <>
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} />
                                            {reviewModalMode === "create"
                                                ? "Kirim Ulasan"
                                                : "Simpan Perubahan"}
                                        </>
                                    )}
                                </button>
                            )}

                        </div>

                    </div>

                </div>
            )}

            {reviewToDelete && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={(event) => {
                        if (event.target === event.currentTarget && !deletingReview) {
                            setReviewToDelete(null);
                        }
                    }}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-review-title"
                        aria-describedby="delete-review-description"
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <Trash2 size={26} />
                        </div>

                        <h2
                            id="delete-review-title"
                            className="mt-5 text-xl font-bold text-[#590D22]"
                        >
                            Hapus ulasan?
                        </h2>
                        <p
                            id="delete-review-description"
                            className="mt-2 text-sm leading-relaxed text-[#98717E]"
                        >
                            Ulasan untuk pesanan #{reviewToDelete.id_order} akan dihapus
                            secara permanen dan tidak dapat dikembalikan.
                        </p>

                        {reviewError && (
                            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                <p>{reviewError}</p>
                            </div>
                        )}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setReviewToDelete(null)}
                                disabled={deletingReview}
                                className="rounded-xl border border-pink-100 px-5 py-3 text-sm font-bold text-[#590D22] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteReview}
                                disabled={deletingReview}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deletingReview ? (
                                    <>
                                        <LoaderCircle size={17} className="animate-spin" />
                                        Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={17} />
                                        Ya, Hapus
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}