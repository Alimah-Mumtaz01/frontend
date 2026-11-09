import { useEffect, useMemo, useState } from "react";
import {
    Link,
    useLocation,
} from "react-router";

import {
    Plus,
    Search,
    RefreshCw,
    Pencil,
    Trash2,
    Layers,
    Package,
    PackageCheck,
    PackageX,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    AlertCircle,
    CheckCircle2,
    X,
    Minus,
    ImageOff,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";

import {
    getAdminVarians,
    deleteAdminVarian,
    updateAdminVarian,
    updateAdminVarianStock
} from "../../../services/varianAdminService";

import { getVariantImage } from "../../../utils/variantImage";

import type { Variant } from "../../../types/product";

type StatusFilter = "semua" | "aktif" | "nonaktif";

const ITEMS_PER_PAGE = 8;

export default function VariantList() {
    const location = useLocation();

    const [varians, setVarians] = useState<Variant[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("semua");

    const [currentPage, setCurrentPage] = useState(1);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(
        (location.state as { successMessage?: string } | null)
            ?.successMessage || ""
    );

    const [selectedVariant, setSelectedVariant] =
        useState<Variant | null>(null);

    const [deleting, setDeleting] = useState(false);

    const [processingId, setProcessingId] =
        useState<number | null>(null);

    const loadVarians = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const data = await getAdminVarians();

            setVarians(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil data varian."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadVarians();

    }, []);

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat("id-ID").format(value);
    };

    const filteredVarians = useMemo(() => {
        return varians.filter((item) => {
            const matchesSearch = item.nama_varian
                .toLowerCase()
                .includes(search.trim().toLowerCase());

            const matchesStatus =
                statusFilter === "semua" ||
                item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [varians, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredVarians.length / ITEMS_PER_PAGE)
    );

    const paginatedVarians = useMemo(() => {
        const startIndex =
            (currentPage - 1) * ITEMS_PER_PAGE;

        return filteredVarians.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    }, [filteredVarians, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const totalStok = varians.reduce(
        (total, item) => total + Number(item.stok),
        0
    );

    const totalAktif = varians.filter(
        (item) => item.status === "aktif"
    ).length;

    const totalNonaktif = varians.filter(
        (item) => item.status === "nonaktif"
    ).length;

    const handleStockChange = async (
        item: Variant,
        change: number
    ) => {
        const newStock = Number(item.stok) + change;

        if (newStock < 0) {
            return;
        }

        try {
            setProcessingId(item.id_varian);
            setError("");
            setSuccess("");

            await updateAdminVarianStock(
                item.id_varian,
                newStock
            );

            setVarians((previous) =>
                previous.map((variant) =>
                    variant.id_varian === item.id_varian
                        ? { ...variant, stok: newStock }
                        : variant
                )
            );

            setSuccess(
                `Stok ${item.nama_varian} berhasil diperbarui.`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memperbarui stok varian."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleToggleStatus = async (item: Variant) => {
        const newStatus =
            item.status === "aktif" ? "nonaktif" : "aktif";

        try {
            setProcessingId(item.id_varian);
            setError("");
            setSuccess("");

            await updateAdminVarian(
                item.id_varian,
                {
                    nama_varian: item.nama_varian,
                    stok: Number(item.stok),
                    status: newStatus
                }
            );

            setVarians((previous) =>
                previous.map((variant) =>
                    variant.id_varian === item.id_varian
                        ? {
                            ...variant,
                            status: newStatus
                        }
                        : variant
                )
            );

            setSuccess(
                `Status ${item.nama_varian} berhasil diubah menjadi ${newStatus}.`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengubah status varian."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async () => {
        if (!selectedVariant) return;

        try {
            setDeleting(true);
            setError("");
            setSuccess("");

            await deleteAdminVarian(
                selectedVariant.id_varian
            );

            setVarians((previous) =>
                previous.filter(
                    (item) =>
                        item.id_varian !==
                        selectedVariant.id_varian
                )
            );

            setSuccess(
                `Varian ${selectedVariant.nama_varian} berhasil dihapus.`
            );

            setSelectedVariant(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menghapus varian. Varian mungkin sudah digunakan dalam pesanan."
            );

            setSelectedVariant(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement>
    ) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src =
            "/images/variants/default.png";
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoaderCircle
                    size={38}
                    className="animate-spin text-[#C9184A]"
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">

            {/* HEADER */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <div className="flex items-center gap-2 text-sm text-[#98717E]">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="font-semibold text-[#C9184A]">
                            Varian Rasa
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-bold text-[#590D22] sm:text-3xl">
                        Manajemen Varian
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        Kelola varian rasa dan persediaan produk SoeSweet.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">

                    <button
                        type="button"
                        onClick={() => loadVarians(false)}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing ? "animate-spin" : ""
                            }
                        />
                        Muat Ulang
                    </button>

                    <Link
                        to="/admin/variants/add"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:bg-[#A4133C]"
                    >
                        <Plus size={19} />
                        Tambah Varian
                    </Link>

                </div>

            </div>

            {/* ALERT */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <p className="flex-1">{error}</p>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                    <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <p className="flex-1">{success}</p>

                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {/* STATISTICS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Total Varian
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-[#590D22]">
                                {formatNumber(varians.length)}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-[#FFF0F3] p-3 text-[#C9184A]">
                            <Layers size={23} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Total Stok
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-[#590D22]">
                                {formatNumber(totalStok)}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-500">
                            <Package size={23} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Varian Aktif
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-green-600">
                                {formatNumber(totalAktif)}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-green-50 p-3 text-green-500">
                            <PackageCheck size={23} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#98717E]">
                                Varian Nonaktif
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-gray-500">
                                {formatNumber(totalNonaktif)}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-gray-100 p-3 text-gray-500">
                            <PackageX size={23} />
                        </div>
                    </div>
                </div>

            </div>

            {/* FILTER */}

            <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <h2 className="font-bold text-[#590D22]">
                            Daftar Varian Rasa
                        </h2>

                        <p className="mt-1 text-xs text-[#98717E]">
                            {filteredVarians.length} varian ditemukan
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">

                        {/* SEARCH */}

                        <div className="relative sm:w-72">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B36B7F]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Cari nama varian..."
                                className="w-full rounded-xl border border-pink-100 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                            />
                        </div>

                        {/* STATUS FILTER */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as StatusFilter
                                )
                            }
                            className="rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9184A]"
                        >
                            <option value="semua">
                                Semua Status
                            </option>

                            <option value="aktif">
                                Aktif
                            </option>

                            <option value="nonaktif">
                                Nonaktif
                            </option>
                        </select>

                    </div>

                </div>

            </div>

            {/* VARIANT CARDS */}

            {paginatedVarians.length > 0 ? (

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

                    {paginatedVarians.map((item) => {

                        const isProcessing =
                            processingId === item.id_varian;

                        return (
                            <div
                                key={item.id_varian}
                                className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* IMAGE */}

                                <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF0F3]">

                                    <img
                                        src={getVariantImage(item.nama_varian)}
                                        alt={`Varian ${item.nama_varian}`}
                                        onError={handleImageError}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute left-3 top-3">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                item.status === "aktif"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {item.status === "aktif"
                                                ? "Aktif"
                                                : "Nonaktif"}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#590D22] shadow-sm">
                                        ID #{item.id_varian}
                                    </div>

                                </div>

                                {/* CONTENT */}

                                <div className="space-y-4 p-4">

                                    <div>
                                        <h3 className="text-lg font-bold capitalize text-[#590D22]">
                                            {item.nama_varian}
                                        </h3>

                                        <p className="mt-1 text-xs text-[#98717E]">
                                            Varian rasa SoeSweet
                                        </p>
                                    </div>

                                    {/* STOCK */}

                                    <div className="rounded-xl bg-[#FFF7F9] p-3">

                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-[#98717E]">
                                                Persediaan Stok
                                            </span>

                                            <span className="text-sm font-bold text-[#590D22]">
                                                {formatNumber(Number(item.stok))} pcs
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStockChange(item, -1)
                                                }
                                                disabled={
                                                    isProcessing ||
                                                    Number(item.stok) <= 0
                                                }
                                                aria-label="Kurangi stok"
                                                className="flex h-9 w-10 items-center justify-center rounded-lg border border-pink-200 bg-white text-[#C9184A] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {isProcessing ? (
                                                    <LoaderCircle
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Minus size={17} />
                                                )}
                                            </button>

                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-pink-100">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#FF758F] to-[#C9184A]"
                                                    style={{
                                                        width: `${
                                                            Number(item.stok) > 0
                                                                ? Math.min(
                                                                    (Number(item.stok) / 100) * 100,
                                                                    100
                                                                )
                                                                : 0
                                                        }%`
                                                    }}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStockChange(item, 1)
                                                }
                                                disabled={isProcessing}
                                                aria-label="Tambah stok"
                                                className="flex h-9 w-10 items-center justify-center rounded-lg border border-pink-200 bg-white text-[#C9184A] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <Plus size={17} />
                                            </button>

                                        </div>

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="grid grid-cols-2 gap-2">

                                        <Link
                                            to={`/admin/variants/edit/${item.id_varian}`}
                                            className="flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-[#FFF0F3] py-2.5 text-xs font-bold text-[#C9184A] transition hover:bg-pink-100"
                                        >
                                            <Pencil size={15} />
                                            Edit
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedVariant(item)
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-100"
                                        >
                                            <Trash2 size={15} />
                                            Hapus
                                        </button>

                                    </div>

                                    {/* STATUS */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggleStatus(item)
                                        }
                                        disabled={isProcessing}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-pink-100 py-2.5 text-xs font-semibold text-[#754052] transition hover:bg-[#FFF0F3] disabled:opacity-50"
                                    >
                                        {item.status === "aktif" ? (
                                            <ToggleRight
                                                size={18}
                                                className="text-green-500"
                                            />
                                        ) : (
                                            <ToggleLeft
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        )}

                                        {item.status === "aktif"
                                            ? "Nonaktifkan Varian"
                                            : "Aktifkan Varian"}
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>

            ) : (

                <div className="rounded-2xl border border-dashed border-pink-200 bg-white px-5 py-16 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                        {search || statusFilter !== "semua" ? (
                            <Search size={30} />
                        ) : (
                            <ImageOff size={30} />
                        )}
                    </div>

                    <h3 className="mt-4 font-bold text-[#590D22]">
                        {search || statusFilter !== "semua"
                            ? "Varian Tidak Ditemukan"
                            : "Belum Ada Varian"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm text-[#98717E]">
                        {search || statusFilter !== "semua"
                            ? "Coba gunakan kata kunci atau filter status yang berbeda."
                            : "Tambahkan varian rasa pertama untuk mulai mengelola persediaan SoeSweet."}
                    </p>

                    {!search && statusFilter === "semua" && (
                        <Link
                            to="/admin/variants/add"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C]"
                        >
                            <Plus size={18} />
                            Tambah Varian
                        </Link>
                    )}

                </div>

            )}

            {/* PAGINATION */}

            {filteredVarians.length > 0 && (

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-pink-100 bg-white p-4 sm:flex-row">

                    <p className="text-xs text-[#98717E]">
                        Menampilkan{" "}
                        <span className="font-bold text-[#590D22]">
                            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>
                        {" "}sampai{" "}
                        <span className="font-bold text-[#590D22]">
                            {Math.min(
                                currentPage * ITEMS_PER_PAGE,
                                filteredVarians.length
                            )}
                        </span>
                        {" "}dari{" "}
                        <span className="font-bold text-[#590D22]">
                            {filteredVarians.length}
                        </span>
                        {" "}varian
                    </p>

                    <div className="flex items-center gap-2">

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((previous) =>
                                    Math.max(1, previous - 1)
                                )
                            }
                            disabled={currentPage === 1}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-pink-100 text-[#C9184A] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`h-9 w-9 rounded-lg text-sm font-bold transition ${
                                    currentPage === page
                                        ? "bg-[#C9184A] text-white shadow-md shadow-pink-200"
                                        : "border border-pink-100 text-[#754052] hover:bg-pink-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((previous) =>
                                    Math.min(totalPages, previous + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-pink-100 text-[#C9184A] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={18} />
                        </button>

                    </div>

                </div>

            )}

            {/* DELETE MODAL */}

            {selectedVariant && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#590D22]/40 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <Trash2 size={25} />
                        </div>

                        <h3 className="mt-4 text-center text-lg font-bold text-[#590D22]">
                            Hapus Varian?
                        </h3>

                        <p className="mt-2 text-center text-sm leading-relaxed text-[#98717E]">
                            Apakah kamu yakin ingin menghapus varian{" "}
                            <span className="font-bold text-[#590D22]">
                                {selectedVariant.nama_varian}
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
                            Catatan: varian yang sudah digunakan pada detail pesanan dapat ditolak penghapusannya oleh database.
                        </p>

                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedVariant(null)
                                }
                                disabled={deleting}
                                className="flex-1 rounded-xl border border-pink-200 py-3 text-sm font-bold text-[#754052] transition hover:bg-pink-50 disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? (
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Trash2 size={17} />
                                )}

                                {deleting
                                    ? "Menghapus..."
                                    : "Ya, Hapus"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}