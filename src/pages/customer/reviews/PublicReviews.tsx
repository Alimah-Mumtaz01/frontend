import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Star,
    MessageSquare,
    CalendarDays,
    Package,
    LoaderCircle,
    AlertCircle,
    RefreshCw,
    ShoppingBag,
    SlidersHorizontal,
} from "lucide-react";

import { getImageUrl } from "../../../services/api";
import {
    getReviews,
    type Review,
} from "../../../services/reviewService";

type RatingFilter = "semua" | "5" | "4" | "3" | "2" | "1";

const formatDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

const formatRupiah = (value: number | string | undefined) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
};

const getReviewImageUrl = (image: string) => {
    const imagePath = image.startsWith("uploads/")
        ? image
        : `uploads/reviews/${image}`;

    return getImageUrl(imagePath);
};

function StarRating({
    value,
    size = 17,
}: {
    value: number;
    size?: number;
}) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={
                        star <= value
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-100 text-gray-300"
                    }
                />
            ))}
        </div>
    );
}

function ReviewImageGallery({
    images,
}: {
    images?: Review["images"];
}) {
    if (!images || images.length === 0) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-3">
            {images.map((image) => (
                <a
                    key={image.id_review_image}
                    href={getReviewImageUrl(image.image)}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-xl border border-pink-100"
                >
                    <img
                        src={getReviewImageUrl(image.image)}
                        alt="Foto ulasan pelanggan"
                        className="h-24 w-24 object-cover transition duration-300 hover:scale-105"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = "/images/hero-soes.png";
                        }}
                    />
                </a>
            ))}
        </div>
    );
}

export default function PublicReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] =
        useState<RatingFilter>("semua");

    const fetchReviews = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getReviews();

            setReviews(
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
                    : "Gagal mengambil ulasan pelanggan."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;

        const total = reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
        );

        return total / reviews.length;
    }, [reviews]);

    const getRatingCount = (rating: number) => {
        return reviews.filter(
            (review) => Number(review.rating) === rating
        ).length;
    };

    const getRatingPercentage = (rating: number) => {
        if (reviews.length === 0) return 0;

        return (
            (getRatingCount(rating) / reviews.length) * 100
        );
    };

    const filteredReviews = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return reviews.filter((review) => {
            const productNames =
                review.order?.orderItems
                    ?.map((item) => item.product?.nama_product || "")
                    .join(" ") || review.product?.nama_product || "";

            const variantNames =
                review.order?.orderItems
                    ?.flatMap((item) =>
                        item.variants?.map(
                            (variant) => variant.varian?.nama_varian || ""
                        ) || []
                    )
                    .join(" ") || "";

            const searchableText = [
                review.user?.nama || "",
                review.komentar || "",
                productNames,
                variantNames,
                `pesanan ${review.id_order}`,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                keyword === "" || searchableText.includes(keyword);

            const matchesRating =
                ratingFilter === "semua" ||
                Number(review.rating) === Number(ratingFilter);

            return matchesSearch && matchesRating;
        });
    }, [reviews, search, ratingFilter]);

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-[#FFFAFB]">
                <div className="text-center">
                    <LoaderCircle
                        size={38}
                        className="mx-auto animate-spin text-[#C9184A]"
                    />

                    <p className="mt-3 text-sm text-[#98717E]">
                        Memuat ulasan pelanggan...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFAFB]">

            <section className="relative overflow-hidden bg-gradient-to-br from-[#590D22] via-[#800F2F] to-[#C9184A]">

                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-pink-300/10 blur-2xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

                    <div className="max-w-2xl">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-pink-100">
                            <MessageSquare size={15} />
                            CERITA PELANGGAN SOESWEET
                        </div>

                        <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
                            Kata Mereka Tentang
                            <span className="block text-[#FFCCD5]">
                                SoeSweet
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-relaxed text-pink-100 sm:text-base">
                            Setiap cerita dan pengalaman pelanggan menjadi
                            bagian berharga dari perjalanan SoeSweet.
                            Yuk, lihat pengalaman mereka menikmati kue soes kami!
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">

                            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white">
                                <Star
                                    size={18}
                                    className="fill-amber-300 text-amber-300"
                                />
                                <span>
                                    {averageRating.toFixed(1)} / 5.0
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white">
                                <MessageSquare size={18} />
                                <span>
                                    {reviews.length} Ulasan
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* ERROR */}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                        <AlertCircle size={20} className="shrink-0" />

                        <p>{error}</p>

                        <button
                            onClick={() => fetchReviews(true)}
                            className="ml-auto shrink-0 font-bold underline"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* SUMMARY */}

                <section className="mb-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">

                    {/* AVERAGE RATING */}

                    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">

                        <p className="text-sm font-bold text-[#98717E]">
                            Rating Pelanggan
                        </p>

                        <div className="mt-4 flex items-end gap-3">
                            <span className="text-5xl font-bold text-[#590D22]">
                                {averageRating.toFixed(1)}
                            </span>

                            <span className="mb-1 text-sm text-[#98717E]">
                                dari 5
                            </span>
                        </div>

                        <div className="mt-3">
                            <StarRating value={Math.round(averageRating)} size={23} />
                        </div>

                        <p className="mt-3 text-xs text-[#98717E]">
                            Berdasarkan {reviews.length} ulasan pelanggan
                        </p>

                    </div>

                    {/* RATING DISTRIBUTION */}

                    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="font-bold text-[#590D22]">
                                Ringkasan Rating
                            </h2>

                            <SlidersHorizontal
                                size={18}
                                className="text-[#C9184A]"
                            />
                        </div>

                        <div className="space-y-3">

                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div
                                    key={rating}
                                    className="flex items-center gap-3"
                                >

                                    <div className="flex w-12 shrink-0 items-center gap-1 text-sm font-semibold text-[#76515E]">
                                        {rating}
                                        <Star
                                            size={13}
                                            className="fill-amber-400 text-amber-400"
                                        />
                                    </div>

                                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#FFF0F3]">
                                        <div
                                            className="h-full rounded-full bg-[#C9184A] transition-all"
                                            style={{
                                                width: `${getRatingPercentage(rating)}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="w-8 text-right text-xs text-[#98717E]">
                                        {getRatingCount(rating)}
                                    </span>

                                </div>
                            ))}

                        </div>

                    </div>

                </section>

                {/* REVIEW SECTION HEADER */}

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <p className="text-sm font-semibold text-[#C9184A]">
                            CUSTOMER REVIEWS
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-[#590D22] sm:text-3xl">
                            Ulasan Pelanggan
                        </h2>

                        <p className="mt-2 text-sm text-[#98717E]">
                            Pengalaman nyata pelanggan setelah berbelanja di SoeSweet.
                        </p>
                    </div>

                    <button
                        onClick={() => fetchReviews(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-100 bg-white px-4 py-2.5 text-sm font-bold text-[#C9184A] transition hover:bg-[#FFF0F3] disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Muat Ulang
                    </button>

                </div>

                {/* SEARCH AND FILTER */}

                <section className="mb-7 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-4 md:flex-row">

                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B17D8F]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nama pelanggan, produk, varian, atau komentar..."
                                className="w-full rounded-xl border border-pink-100 bg-[#FFFAFB] py-3 pl-11 pr-4 text-sm text-[#590D22] outline-none transition placeholder:text-pink-300 focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                            />

                        </div>

                        {/* RATING FILTER */}

                        <div className="flex items-center gap-2">

                            <label
                                htmlFor="rating-filter"
                                className="shrink-0 text-xs font-semibold text-[#98717E]"
                            >
                                Rating:
                            </label>

                            <select
                                id="rating-filter"
                                value={ratingFilter}
                                onChange={(event) =>
                                    setRatingFilter(
                                        event.target.value as RatingFilter
                                    )
                                }
                                className="min-w-32 rounded-xl border border-pink-100 bg-[#FFFAFB] px-3 py-3 text-sm text-[#590D22] outline-none focus:border-[#C9184A]"
                            >
                                <option value="semua">Semua Rating</option>
                                <option value="5">5 Bintang</option>
                                <option value="4">4 Bintang</option>
                                <option value="3">3 Bintang</option>
                                <option value="2">2 Bintang</option>
                                <option value="1">1 Bintang</option>
                            </select>

                        </div>

                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-[#98717E]">
                        <span>
                            Menampilkan {filteredReviews.length} dari {reviews.length} ulasan
                        </span>

                        {(search || ratingFilter !== "semua") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setRatingFilter("semua");
                                }}
                                className="font-bold text-[#C9184A] hover:underline"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                </section>

                {/* REVIEW LIST */}

                {filteredReviews.length > 0 ? (
                    <div className="grid gap-5">

                        {filteredReviews.map((review) => {
                            const orderItems =
                                review.order?.orderItems || [];

                            return (
                                <article
                                    key={review.id_review}
                                    className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:shadow-md"
                                >

                                    {/* REVIEW HEADER */}

                                    <div className="flex flex-col gap-4 border-b border-pink-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F3] text-lg font-bold text-[#C9184A]">
                                                {(review.user?.nama || "P")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-[#590D22]">
                                                    {review.user?.nama || "Pelanggan SoeSweet"}
                                                </h3>

                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#98717E]">
                                                    <CalendarDays size={13} />
                                                    {formatDate(review.createdAt)}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-2 self-start rounded-xl bg-[#FFF9E8] px-3 py-2 sm:self-center">
                                            <StarRating
                                                value={review.rating}
                                                size={16}
                                            />

                                            <span className="text-sm font-bold text-[#76515E]">
                                                {review.rating}.0
                                            </span>
                                        </div>

                                    </div>

                                    {/* REVIEW BODY */}

                                    <div className="p-5 sm:p-6">

                                        {/* COMMENT */}

                                        {review.komentar ? (
                                            <div className="flex gap-3">
                                                <MessageSquare
                                                    size={18}
                                                    className="mt-0.5 shrink-0 text-[#C9184A]"
                                                />

                                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#76515E]">
                                                    {review.komentar}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm italic text-[#B17D8F]">
                                                Pelanggan memberikan rating tanpa komentar.
                                            </p>
                                        )}

                                        {/* REVIEW PHOTOS */}

                                        <ReviewImageGallery images={review.images} />

                                        {/* ORDER DETAILS */}

                                        <div className="mt-6 rounded-2xl bg-[#FFFAFB] p-4 sm:p-5">

                                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                                                <div className="flex items-center gap-2">
                                                    <Package
                                                        size={17}
                                                        className="text-[#C9184A]"
                                                    />

                                                    <h4 className="text-sm font-bold text-[#590D22]">
                                                        Produk yang Dipesan
                                                    </h4>
                                                </div>

                                                <span className="rounded-lg bg-[#FFF0F3] px-3 py-1 text-xs font-bold text-[#C9184A]">
                                                    Pesanan #{review.id_order}
                                                </span>

                                            </div>

                                            {orderItems.length > 0 ? (
                                                <div className="space-y-4">

                                                    {orderItems.map((item) => (
                                                        <div
                                                            key={item.id_order_item}
                                                            className="flex gap-3"
                                                        >

                                                            <img
                                                                src={getImageUrl(item.product?.gambar)}
                                                                alt={item.product?.nama_product || "Produk SoeSweet"}
                                                                className="h-20 w-20 shrink-0 rounded-xl border border-pink-100 bg-[#FFF0F3] object-cover"
                                                                onError={(event) => {
                                                                    event.currentTarget.onerror = null;
                                                                    event.currentTarget.src = "/images/hero-soes.png";
                                                                }}
                                                            />

                                                            <div className="min-w-0 flex-1">

                                                                <h5 className="font-bold text-[#590D22]">
                                                                    {item.product?.nama_product ||
                                                                        `Produk #${item.id_product}`}
                                                                </h5>

                                                                <p className="mt-1 text-xs text-[#98717E]">
                                                                    {item.quantity} paket
                                                                    {" · "}
                                                                    Isi {item.product?.jumlah_isi || "-"} pcs
                                                                </p>

                                                                <p className="mt-1 text-sm font-bold text-[#C9184A]">
                                                                    {formatRupiah(item.total_harga)}
                                                                </p>

                                                                {item.variants &&
                                                                    item.variants.length > 0 && (
                                                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                                                            {item.variants.map((variant) => (
                                                                                <span
                                                                                    key={variant.id_order_item_variant}
                                                                                    className="rounded-md bg-[#FFF0F3] px-2 py-1 text-[11px] text-[#800F2F]"
                                                                                >
                                                                                    {variant.varian?.nama_varian ||
                                                                                        `Varian #${variant.id_varian}`}
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
                                            ) : (
                                                <p className="text-xs text-[#98717E]">
                                                    Detail produk pesanan tidak tersedia.
                                                </p>
                                            )}

                                            {/* ORDER TOTAL */}

                                            {review.order && (
                                                <div className="mt-4 flex items-center justify-between border-t border-pink-100 pt-4">
                                                    <span className="text-xs text-[#98717E]">
                                                        Total Pesanan
                                                    </span>

                                                    <span className="text-sm font-bold text-[#C9184A]">
                                                        {formatRupiah(review.order.total_harga)}
                                                    </span>
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                ) : (
                    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-pink-200 bg-white p-8 text-center">

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

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#98717E]">
                            {reviews.length === 0
                                ? "Belum ada pelanggan yang memberikan ulasan. Ulasan pelanggan akan tampil di halaman ini."
                                : "Tidak ada ulasan yang sesuai dengan pencarian atau filter rating yang dipilih."}
                        </p>

                        {reviews.length > 0 && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setRatingFilter("semua");
                                }}
                                className="mt-5 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C]"
                            >
                                Reset Filter
                            </button>
                        )}

                    </div>
                )}

                {/* BOTTOM INFORMATION */}

                <div className="mt-10 rounded-3xl border border-pink-100 bg-gradient-to-r from-[#FFF0F3] to-white p-6 text-center sm:p-8">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#C9184A] shadow-sm">
                        <ShoppingBag size={23} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#590D22]">
                        Terima Kasih Telah Memilih SoeSweet!
                    </h3>

                    <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#98717E]">
                        Setiap ulasan membantu kami terus memberikan
                        produk dan pelayanan terbaik. Semoga setiap
                        gigitan selalu membawa kebahagiaan!
                    </p>

                </div>

            </main>

        </div>
    );
}