import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    PackageOpen,
    RefreshCw,
    AlertCircle,
    ToggleLeft,
    ToggleRight
} from "lucide-react";

import { getImageUrl } from "../../../services/api";

import {
    getAdminProducts,
    deleteAdminProduct,
    updateProductStatus
} from "../../../services/productAdminService";

import type { Product } from "../../../types/product";

const ITEMS_PER_PAGE = 8;

const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(value));
};

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("semua");
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    const [deleting, setDeleting] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminProducts();

            setProducts(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil data produk"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.nama_product
                .toLowerCase()
                .includes(search.toLowerCase().trim());

            const matchesStatus =
                filterStatus === "semua" ||
                product.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [products, search, filterStatus]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    );

    const paginatedProducts = filteredProducts.slice(
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

    const handleDelete = async () => {
        if (!selectedProduct) return;

        try {
            setDeleting(true);

            await deleteAdminProduct(
                selectedProduct.id_product
            );

            setProducts((previous) =>
                previous.filter(
                    (item) =>
                        item.id_product !== selectedProduct.id_product
                )
            );

            setSelectedProduct(null);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Gagal menghapus produk"
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleStatus = async (product: Product) => {
        const newStatus =
            product.status === "aktif" ? "nonaktif" : "aktif";

        try {
            setActionLoading(product.id_product);

            const updated = await updateProductStatus(
                product.id_product,
                newStatus
            );

            setProducts((previous) =>
                previous.map((item) =>
                    item.id_product === product.id_product
                        ? updated
                        : item
                )
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Gagal mengubah status produk"
            );
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-[#590D22] sm:text-3xl">
                        Kelola Produk
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        Atur produk kue soes SoeSweet
                    </p>
                </div>

                <Link
                    to="/admin/products/add"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:bg-[#A4133C]"
                >
                    <Plus size={19} />
                    Tambah Produk
                </Link>

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
                        placeholder="Cari produk..."
                        className="w-full rounded-xl border border-pink-100 bg-white py-3 pl-12 pr-4 text-sm text-[#590D22] outline-none transition placeholder:text-pink-300 focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                    />

                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm text-[#590D22] outline-none focus:border-[#C9184A]"
                >
                    <option value="semua">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                </select>

                <button
                    onClick={fetchProducts}
                    disabled={loading}
                    title="Muat ulang produk"
                    className="flex items-center justify-center rounded-xl border border-pink-100 bg-white px-4 py-3 text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={18}
                        className={loading ? "animate-spin" : ""}
                    />
                </button>

            </div>

            {/* ERROR */}

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    <AlertCircle size={20} />
                    <span>{error}</span>
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
                            Memuat data produk...
                        </p>
                    </div>
                </div>

            ) : (

                <>

                    {/* PRODUCT GRID */}

                    {paginatedProducts.length > 0 ? (

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

                            {paginatedProducts.map((product) => (

                                <div
                                    key={product.id_product}
                                    className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100"
                                >

                                    {/* IMAGE */}

                                    <div className="relative aspect-square overflow-hidden bg-[#FFF0F3]">

                                        <img
                                            src={getImageUrl(product.gambar)}
                                            alt={product.nama_product}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/images/hero-soes.png";
                                            }}
                                        />

                                        <span
                                            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                                                product.status === "aktif"
                                                    ? "bg-[#C9184A] text-white"
                                                    : "bg-gray-500 text-white"
                                            }`}
                                        >
                                            {product.status === "aktif"
                                                ? "Aktif"
                                                : "Nonaktif"}
                                        </span>

                                    </div>

                                    {/* PRODUCT INFO */}

                                    <div className="p-4">

                                        <p className="font-bold text-[#590D22]">
                                            {product.nama_product}
                                        </p>

                                        <p className="mt-2 text-sm text-[#98717E]">
                                            Isi {product.jumlah_isi}
                                        </p>

                                        <p className="mt-2 text-lg font-bold text-[#C9184A]">
                                            {formatRupiah(product.harga)}
                                        </p>

                                        <div className="my-4 border-t border-pink-100" />

                                        {/* ACTIONS */}

                                        <div className="flex items-center justify-between gap-2">

                                            <Link
                                                to={`/admin/products/edit/${product.id_product}`}
                                                title="Edit produk"
                                                className="flex flex-1 items-center justify-center rounded-xl border border-pink-100 bg-[#FFF0F3] py-2.5 text-[#C9184A] transition hover:bg-pink-200"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                title="Hapus produk"
                                                className="flex flex-1 items-center justify-center rounded-xl border border-pink-100 bg-[#FFF0F3] py-2.5 text-[#C9184A] transition hover:bg-pink-200"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            <Link
                                                to={`/admin/products/detail/${product.id_product}`}
                                                title="Detail produk"
                                                className="flex flex-1 items-center justify-center rounded-xl border border-pink-100 bg-[#FFF0F3] py-2.5 text-[#590D22] transition hover:bg-pink-200"
                                            >
                                                <Eye size={18} />
                                            </Link>

                                            <button
                                                onClick={() => handleToggleStatus(product)}
                                                disabled={actionLoading === product.id_product}
                                                title={product.status === "aktif" ? "Nonaktifkan produk" : "Aktifkan produk"}
                                                className="flex flex-1 items-center justify-center rounded-xl border border-pink-100 bg-[#FFF0F3] py-2.5 text-[#C9184A] transition hover:bg-pink-200 disabled:opacity-50"
                                            >
                                                {actionLoading === product.id_product ? (
                                                    <LoaderCircle size={18} className="animate-spin" />
                                                ) : product.status === "aktif" ? (
                                                    <ToggleRight size={19} />
                                                ) : (
                                                    <ToggleLeft size={19} />
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-white p-8 text-center">

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                                <PackageOpen size={32} />
                            </div>

                            <h3 className="mt-4 font-bold text-[#590D22]">
                                Produk tidak ditemukan
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-gray-500">
                                Belum ada produk yang sesuai dengan pencarian atau filter yang dipilih.
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

                    {/* FOOTER AND PAGINATION */}

                    <div className="flex flex-col gap-4 border-t border-pink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-[#98717E]">
                            Menampilkan{" "}
                            {filteredProducts.length === 0
                                ? 0
                                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            –
                            {Math.min(
                                currentPage * ITEMS_PER_PAGE,
                                filteredProducts.length
                            )}{" "}
                            dari {filteredProducts.length} produk
                        </p>

                        <div className="flex items-center justify-center gap-2">

                            <button
                                onClick={() => setCurrentPage((p) => p - 1)}
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
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-xl border border-pink-100 bg-white p-2.5 text-[#C9184A] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={19} />
                            </button>

                        </div>

                    </div>

                </>

            )}

            {/* DELETE CONFIRMATION MODAL */}

            {selectedProduct && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <Trash2 size={27} />
                        </div>

                        <h2 className="mt-5 text-center text-xl font-bold text-[#590D22]">
                            Hapus Produk?
                        </h2>

                        <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
                            Apakah kamu yakin ingin menghapus produk{" "}
                            <span className="font-bold text-[#C9184A]">
                                {selectedProduct.nama_product}
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <div className="mt-7 flex gap-3">

                            <button
                                onClick={() => setSelectedProduct(null)}
                                disabled={deleting}
                                className="flex-1 rounded-xl border border-pink-100 py-3 text-sm font-bold text-[#590D22] transition hover:bg-pink-50"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                            >
                                {deleting ? "Menghapus..." : "Ya, Hapus"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}