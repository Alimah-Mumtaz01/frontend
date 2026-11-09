import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Star,
    MessageSquare,
    RefreshCw,
    LoaderCircle,
    AlertCircle,
    Eye,
    CalendarDays,
    Package,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    X,
    Truck,
    Store,
    Image as ImageIcon,
    UserRound,
} from "lucide-react";

import { getImageUrl } from "../../../services/api";

import {
    getReviews,
    type Review,
} from "../../../services/reviewService";

const ITEMS_PER_PAGE = 8;

const formatRupiah = (value: number | string | undefined) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value || 0);
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

const getReviewImageUrl = (image: string) => {
    const imagePath = image.startsWith("uploads/")
        ? image
        : `uploads/reviews/${image}`;

    return getImageUrl(imagePath);
};

function StarRating({
    rating,
    size = 17,
}: {
    rating: number;
    size?: number;
}) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={
                        star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-100 text-gray-200"
                    }
                />
            ))}
        </div>
    );
}

function SummaryCard({
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
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/60">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#98717E]">
                    {title}
                </p>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconColor}`}
                >
                    <Icon size={21} />
                </div>
            </div>

            <h3 className="mt-4 text-2xl font-bold text-[#590D22]">
                {value}
            </h3>

            <p className="mt-2 text-xs text-[#A56B7D]">
                {description}
            </p>
        </div>
    );
}

function ReviewDetailModal({
    review,
    onClose,
}: {
    review: Review;
    onClose: () => void;
}) {
    const orderItems = review.order?.orderItems || [];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#350511]/50 p-3 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* MODAL HEADER */}

                <div className="flex items-center justify-between border-b border-pink-100 px-5 py-4 sm:px-7">
                    <div>
                        <h2 className="text-lg font-bold text-[#590D22]">
                            Detail Ulasan
                        </h2>

                        <p className="mt-1 text-xs text-[#98717E]">
                            Informasi lengkap ulasan pelanggan SoeSweet.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-[#98717E] transition hover:bg-pink-50 hover:text-[#C9184A]"
                        aria-label="Tutup detail ulasan"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* MODAL CONTENT */}

                <div className="overflow-y-auto p-5 sm:p-7">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">

                        {/* CUSTOMER AND REVIEW */}

                        <div className="space-y-5">

                            {/* CUSTOMER */}

                            <div className="rounded-2xl border border-pink-100 bg-[#FFFAFB] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE0E8] text-[#C9184A]">
                                        <UserRound size={24} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-[#98717E]">
                                            Nama Pelanggan
                                        </p>

                                        <p className="mt-1 truncate font-bold text-[#590D22]">
                                            {review.user?.nama || `Pelanggan #${review.id_user}`}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            ID Pelanggan: #{review.id_user}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* REVIEW */}

                            <div className="rounded-2xl border border-pink-100 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-bold text-[#590D22]">
                                        Rating Pelanggan
                                    </h3>

                                    <span className="text-sm font-bold text-[#C9184A]">
                                        {review.rating}/5
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <StarRating
                                        rating={review.rating}
                                        size={23}
                                    />
                                </div>

                                <div className="mt-5 border-t border-pink-50 pt-4">
                                    <p className="text-xs font-semibold text-[#98717E]">
                                        Komentar Ulasan
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#76515F]">
                                        {review.komentar?.trim()
                                            ? review.komentar
                                            : "Pelanggan tidak menambahkan komentar."}
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center gap-2 border-t border-pink-50 pt-4 text-xs text-[#98717E]">
                                    <CalendarDays size={15} />

                                    {formatDate(review.createdAt)}
                                </div>
                            </div>

                            {/* REVIEW PHOTOS */}

                            <div className="rounded-2xl border border-pink-100 p-5">
                                <div className="flex items-center gap-2">
                                    <ImageIcon
                                        size={18}
                                        className="text-[#C9184A]"
                                    />

                                    <h3 className="font-bold text-[#590D22]">
                                        Foto Ulasan
                                    </h3>

                                    <span className="ml-auto text-xs text-[#98717E]">
                                        {review.images?.length || 0} foto
                                    </span>
                                </div>

                                {review.images && review.images.length > 0 ? (
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        {review.images.map((image) => (
                                            <a
                                                key={image.id_review_image}
                                                href={getReviewImageUrl(image.image)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group aspect-square overflow-hidden rounded-xl border border-pink-100 bg-[#FFF7F9]"
                                                title="Buka foto ulasan"
                                            >
                                                <img
                                                    src={getReviewImageUrl(image.image)}
                                                    alt="Foto ulasan pelanggan"
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-xl bg-[#FFFAFB] px-4 py-7 text-center">
                                        <ImageIcon
                                            size={27}
                                            className="mx-auto text-pink-200"
                                        />

                                        <p className="mt-2 text-xs text-gray-400">
                                            Tidak ada foto yang dilampirkan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ORDER DETAILS */}

                        <div className="space-y-5">

                            {/* ORDER INFORMATION */}

                            <div className="rounded-2xl border border-pink-100 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-[#98717E]">
                                            Nomor Pesanan
                                        </p>

                                        <h3 className="mt-1 text-xl font-extrabold text-[#C9184A]">
                                            #SOE{String(review.id_order).padStart(7, "0")}
                                        </h3>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                        <ShoppingBag size={22} />
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3 border-t border-pink-50 pt-4">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-gray-500">
                                            Tanggal Pesanan
                                        </span>

                                        <span className="text-right font-semibold text-[#590D22]">
                                            {formatDate(review.order?.createdAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-gray-500">
                                            Tipe Pengiriman
                                        </span>

                                        <span className="flex items-center gap-2 font-semibold text-[#590D22]">
                                            {review.order?.tipe_pengiriman === "delivery" ? (
                                                <>
                                                    <Truck size={16} className="text-[#C9184A]" />
                                                    Delivery
                                                </>
                                            ) : (
                                                <>
                                                    <Store size={16} className="text-[#C9184A]" />
                                                    Pickup
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {review.order?.tipe_pengiriman === "delivery" && (
                                        <div className="border-t border-pink-50 pt-3">
                                            <p className="text-xs text-gray-500">
                                                Alamat Pengiriman
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-relaxed text-[#590D22]">
                                                {review.order?.alamat_pengiriman || "-"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ORDER PRODUCTS */}

                            <div className="rounded-2xl border border-pink-100 p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Package
                                            size={19}
                                            className="text-[#C9184A]"
                                        />

                                        <h3 className="font-bold text-[#590D22]">
                                            Produk yang Dibeli
                                        </h3>
                                    </div>

                                    <span className="text-xs text-[#98717E]">
                                        {orderItems.length} jenis
                                    </span>
                                </div>

                                {orderItems.length > 0 ? (
                                    <div className="mt-4 space-y-4">
                                        {orderItems.map((item) => (
                                            <div
                                                key={item.id_order_item}
                                                className="rounded-xl border border-pink-50 bg-[#FFFAFB] p-3"
                                            >
                                                <div className="flex gap-3">
                                                    {item.product?.gambar ? (
                                                        <img
                                                            src={getImageUrl(item.product.gambar)}
                                                            alt={item.product.nama_product}
                                                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                                                            <Package size={25} />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-[#590D22]">
                                                            {item.product?.nama_product || `Produk #${item.id_product}`}
                                                        </p>

                                                        <p className="mt-1 text-xs text-[#98717E]">
                                                            {formatNumber(item.quantity)} paket
                                                        </p>

                                                        <p className="mt-1 text-xs font-semibold text-[#C9184A]">
                                                            {formatRupiah(item.harga_satuan)} / paket
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* VARIANTS */}

                                                {item.variants && item.variants.length > 0 && (
                                                    <div className="mt-3 border-t border-pink-100 pt-3">
                                                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#98717E]">
                                                            Detail Varian Rasa
                                                        </p>

                                                        <div className="space-y-2">
                                                            {item.variants.map((variant) => (
                                                                <div
                                                                    key={variant.id_order_item_variant}
                                                                    className="flex items-center justify-between gap-3 text-xs"
                                                                >
                                                                    <span className="text-[#76515F]">
                                                                        {variant.varian?.nama_varian || `Varian #${variant.id_varian}`}
                                                                    </span>

                                                                    <span className="font-bold text-[#590D22]">
                                                                        {formatNumber(variant.jumlah)} pcs
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-3 flex items-center justify-between border-t border-pink-100 pt-3 text-xs">
                                                    <span className="text-gray-500">
                                                        Subtotal Produk
                                                    </span>

                                                    <span className="font-bold text-[#590D22]">
                                                        {formatRupiah(item.total_harga)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-4 rounded-xl bg-[#FFFAFB] p-5 text-center text-xs text-gray-400">
                                        Detail produk pesanan tidak tersedia.
                                    </p>
                                )}
                            </div>

                            {/* ORDER TOTAL */}

                            <div className="rounded-2xl border border-pink-100 bg-[#FFFAFB] p-5">
                                <h3 className="font-bold text-[#590D22]">
                                    Ringkasan Pembayaran
                                </h3>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">
                                            Subtotal
                                        </span>

                                        <span className="font-medium text-[#590D22]">
                                            {formatRupiah(review.order?.subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">
                                            Ongkir
                                        </span>

                                        <span className="font-medium text-[#590D22]">
                                            {formatRupiah(review.order?.ongkir)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3 border-t border-pink-100 pt-3">
                                        <span className="font-bold text-[#590D22]">
                                            Total Pesanan
                                        </span>

                                        <span className="text-base font-extrabold text-[#C9184A]">
                                            {formatRupiah(review.order?.total_harga)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL FOOTER */}

                <div className="flex justify-end border-t border-pink-100 px-5 py-4 sm:px-7">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-[#C9184A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#800F2F]"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [search, setSearch] = useState("");
    const [filterRating, setFilterRating] = useState("semua");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getReviews();

            setReviews(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil data ulasan."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const keyword = search.trim().toLowerCase();

            const productNames =
                review.order?.orderItems
                    ?.map((item) => item.product?.nama_product || "")
                    .join(" ") || "";

            const variantNames =
                review.order?.orderItems
                    ?.flatMap((item) =>
                        item.variants?.map(
                            (variant) => variant.varian?.nama_varian || ""
                        ) || []
                    )
                    .join(" ") || "";

            const matchesSearch =
                !keyword ||
                String(review.id_review).includes(keyword) ||
                String(review.id_order).includes(keyword) ||
                (review.user?.nama || "").toLowerCase().includes(keyword) ||
                (review.komentar || "").toLowerCase().includes(keyword) ||
                productNames.toLowerCase().includes(keyword) ||
                variantNames.toLowerCase().includes(keyword);

            const matchesRating =
                filterRating === "semua" ||
                review.rating === Number(filterRating);

            return matchesSearch && matchesRating;
        });
    }, [reviews, search, filterRating]);

    const summary = useMemo(() => {
        const total = reviews.length;

        const average =
            total > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
                : 0;

        const distribution = [5, 4, 3, 2, 1].map((rating) => ({
            rating,
            total: reviews.filter((review) => review.rating === rating).length,
        }));

        return {
            total,
            average,
            distribution,
        };
    }, [reviews]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredReviews.length / ITEMS_PER_PAGE)
    );

    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterRating]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#590D22] sm:text-3xl">
                        Kelola Ulasan
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        Lihat dan pantau seluruh ulasan pelanggan SoeSweet.
                    </p>
                </div>

                <button
                    onClick={fetchReviews}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-5 py-3 text-sm font-bold text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={18}
                        className={loading ? "animate-spin" : ""}
                    />

                    Refresh Ulasan
                </button>
            </div>

            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryCard
                    title="Total Ulasan"
                    value={formatNumber(summary.total)}
                    description="Seluruh ulasan pelanggan"
                    icon={MessageSquare}
                    iconColor="bg-[#FFF0F3] text-[#C9184A]"
                />

                <SummaryCard
                    title="Rata-rata Rating"
                    value={summary.total > 0 ? summary.average.toFixed(1) : "0.0"}
                    description="Dari seluruh rating pelanggan"
                    icon={Star}
                    iconColor="bg-amber-50 text-amber-500"
                />

                <SummaryCard
                    title="Ulasan Bintang 5"
                    value={formatNumber(
                        summary.distribution.find((item) => item.rating === 5)?.total || 0
                    )}
                    description="Pelanggan memberikan rating terbaik"
                    icon={ShoppingBag}
                    iconColor="bg-green-50 text-green-600"
                />
            </div>

            {/* RATING DISTRIBUTION */}

            <section className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="font-bold text-[#590D22]">
                            Distribusi Rating
                        </h2>

                        <p className="mt-1 text-xs text-[#98717E]">
                            Jumlah ulasan berdasarkan bintang yang diberikan pelanggan.
                        </p>
                    </div>

                    <Star className="text-amber-400" size={23} />
                </div>

                <div className="mt-5 max-w-2xl space-y-3">
                    {summary.distribution.map((item) => {
                        const percentage =
                            summary.total > 0
                                ? (item.total / summary.total) * 100
                                : 0;

                        return (
                            <div
                                key={item.rating}
                                className="flex items-center gap-3"
                            >
                                <div className="flex w-12 shrink-0 items-center gap-1 text-sm font-semibold text-[#76515F]">
                                    {item.rating}
                                    <Star
                                        size={14}
                                        className="fill-amber-400 text-amber-400"
                                    />
                                </div>

                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-pink-50">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#FF8FA3] to-[#C9184A] transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <span className="w-10 shrink-0 text-right text-xs font-semibold text-[#98717E]">
                                    {item.total}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>

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
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama pelanggan, ID pesanan, produk, varian, atau komentar..."
                        className="w-full rounded-xl border border-pink-100 bg-white py-3 pl-12 pr-4 text-sm text-[#590D22] outline-none transition placeholder:text-pink-300 focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                    />
                </div>

                <select
                    value={filterRating}
                    onChange={(event) => setFilterRating(event.target.value)}
                    className="rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm text-[#590D22] outline-none focus:border-[#C9184A]"
                >
                    <option value="semua">Semua Rating</option>

                    {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                            {rating} Bintang
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
                            Gagal memuat ulasan
                        </p>

                        <p className="mt-1">
                            {error}
                        </p>

                        <button
                            onClick={fetchReviews}
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
                            Memuat data ulasan...
                        </p>
                    </div>
                </div>
            ) : (

                <>
                    {/* REVIEW TABLE */}

                    {paginatedReviews.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

                            <div className="border-b border-pink-100 px-5 py-4">
                                <h2 className="font-bold text-[#590D22]">
                                    Daftar Ulasan Pelanggan
                                </h2>

                                <p className="mt-1 text-xs text-[#98717E]">
                                    Klik tombol detail untuk melihat ulasan dan seluruh produk dalam pesanan.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-left">
                                    <thead className="bg-[#FFF0F3] text-xs uppercase tracking-wide text-[#98717E]">
                                        <tr>
                                            <th className="px-5 py-4 font-bold">
                                                ID Ulasan
                                            </th>

                                            <th className="px-5 py-4 font-bold">
                                                Pelanggan
                                            </th>

                                            <th className="px-5 py-4 font-bold">
                                                Pesanan
                                            </th>

                                            <th className="px-5 py-4 font-bold">
                                                Rating
                                            </th>

                                            <th className="px-5 py-4 font-bold">
                                                Komentar
                                            </th>

                                            <th className="px-5 py-4 font-bold">
                                                Tanggal
                                            </th>

                                            <th className="px-5 py-4 text-center font-bold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-pink-50">
                                        {paginatedReviews.map((review) => (
                                            <tr
                                                key={review.id_review}
                                                className="transition hover:bg-[#FFF9FA]"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-bold text-[#C9184A]">
                                                        #{review.id_review}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-[#590D22]">
                                                        {review.user?.nama || `Pelanggan #${review.id_user}`}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        ID: #{review.id_user}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="font-bold text-[#C9184A]">
                                                        #SOE{String(review.id_order).padStart(7, "0")}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {review.order?.orderItems?.length || 0} jenis produk
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="space-y-1.5">
                                                        <StarRating
                                                            rating={review.rating}
                                                            size={14}
                                                        />

                                                        <span className="text-xs font-bold text-[#76515F]">
                                                            {review.rating}/5
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="max-w-[220px] px-5 py-4">
                                                    <p className="line-clamp-2 text-sm text-[#76515F]">
                                                        {review.komentar?.trim() || "Tidak ada komentar"}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-gray-400">
                                                        {review.images?.length || 0} foto dilampirkan
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-xs text-[#76515F]">
                                                    {formatDate(review.createdAt)}
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedReview(review)}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFF0F3] px-3 py-2.5 text-sm font-bold text-[#C9184A] transition hover:bg-pink-200"
                                                    >
                                                        <Eye size={17} />
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-white p-8 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                                {reviews.length === 0 ? (
                                    <MessageSquare size={30} />
                                ) : (
                                    <Search size={30} />
                                )}
                            </div>

                            <h3 className="mt-4 font-bold text-[#590D22]">
                                {reviews.length === 0
                                    ? "Belum Ada Ulasan"
                                    : "Ulasan Tidak Ditemukan"}
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-gray-500">
                                {reviews.length === 0
                                    ? "Ulasan yang diberikan pelanggan akan ditampilkan di halaman ini."
                                    : "Tidak ada ulasan yang sesuai dengan pencarian atau filter yang dipilih."}
                            </p>

                            {(search || filterRating !== "semua") && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setFilterRating("semua");
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
                            {filteredReviews.length === 0
                                ? 0
                                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            –
                            {Math.min(
                                currentPage * ITEMS_PER_PAGE,
                                filteredReviews.length
                            )}{" "}
                            dari {filteredReviews.length} ulasan
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

            {/* DETAIL MODAL */}

            {selectedReview && (
                <ReviewDetailModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                />
            )}
        </div>
    );
}