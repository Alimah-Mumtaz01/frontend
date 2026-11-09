import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
    ArrowLeft,
    Pencil,
    Package,
    Tag,
    CircleCheck,
    CircleX,
    LoaderCircle,
    ImageOff
} from "lucide-react";

import { getImageUrl } from "../../../services/api";
import { getAdminProductById } from "../../../services/productAdminService";

import type { Product } from "../../../types/product";

const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(value));
};

export default function ProductDetails() {
    const { id_product } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchDetail = async () => {
            try {
                setLoading(true);

                if (!id_product) {
                    throw new Error("ID produk tidak valid.");
                }

                const data = await getAdminProductById(id_product);

                if (active) {
                    setProduct(data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Gagal mengambil detail produk"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchDetail();

        return () => {
            active = false;
        };
    }, [id_product]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoaderCircle
                    size={35}
                    className="animate-spin text-[#C9184A]"
                />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
                <p className="font-semibold text-red-500">
                    {error || "Produk tidak ditemukan"}
                </p>

                <Link
                    to="/admin/products"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#C9184A]"
                >
                    <ArrowLeft size={17} />
                    Kembali ke Produk
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <Link
                        to="/admin/products"
                        className="rounded-xl border border-pink-100 bg-white p-3 text-[#C9184A] hover:bg-pink-50"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold text-[#590D22]">
                            Detail Produk
                        </h1>

                        <p className="mt-1 text-sm text-[#98717E]">
                            Informasi lengkap produk SoeSweet
                        </p>
                    </div>

                </div>

                <Link
                    to={`/admin/products/edit/${product.id_product}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-5 py-3 text-sm font-bold text-white hover:bg-[#A4133C]"
                >
                    <Pencil size={17} />
                    Edit Produk
                </Link>

            </div>

            {/* DETAIL */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* IMAGE */}

                <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">

                    <div className="aspect-square overflow-hidden rounded-xl bg-[#FFF0F3]">

                        {product.gambar ? (
                            <img
                                src={getImageUrl(product.gambar)}
                                alt={product.nama_product}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-[#C9184A]">
                                <ImageOff size={45} />
                                <p className="mt-3 text-sm">
                                    Belum ada gambar produk
                                </p>
                            </div>
                        )}

                    </div>

                </div>

                {/* INFORMATION */}

                <div className="space-y-5 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between gap-3">

                        <span className="rounded-full bg-[#FFF0F3] px-3 py-1.5 text-xs font-bold text-[#C9184A]">
                            ID Produk: #{product.id_product}
                        </span>

                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                                product.status === "aktif"
                                    ? "bg-green-50 text-green-600"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {product.status === "aktif" ? (
                                <CircleCheck size={14} />
                            ) : (
                                <CircleX size={14} />
                            )}

                            {product.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </span>

                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-[#590D22]">
                            {product.nama_product}
                        </h2>

                        <p className="mt-2 text-2xl font-bold text-[#C9184A]">
                            {formatRupiah(product.harga)}
                        </p>
                    </div>

                    <div className="border-t border-pink-100" />

                    <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-[#FFF0F3] p-4">
                            <Package
                                size={20}
                                className="text-[#C9184A]"
                            />

                            <p className="mt-3 text-xs text-[#98717E]">
                                Jumlah Isi
                            </p>

                            <p className="mt-1 font-bold text-[#590D22]">
                                {product.jumlah_isi} pcs
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#FFF0F3] p-4">
                            <Tag
                                size={20}
                                className="text-[#C9184A]"
                            />

                            <p className="mt-3 text-xs text-[#98717E]">
                                Harga
                            </p>

                            <p className="mt-1 font-bold text-[#590D22]">
                                {formatRupiah(product.harga)}
                            </p>
                        </div>

                    </div>

                    <div>
                        <h3 className="font-bold text-[#590D22]">
                            Deskripsi Produk
                        </h3>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#98717E]">
                            {product.deskripsi || "Belum ada deskripsi produk."}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}