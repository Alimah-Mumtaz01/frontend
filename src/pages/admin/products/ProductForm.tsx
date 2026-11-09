import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import {
    ArrowLeft,
    Upload,
    ImagePlus,
    X,
    Save,
    LoaderCircle,
    Package,
    Info
} from "lucide-react";

import { getImageUrl } from "../../../services/api";

import {
    createAdminProduct,
    getAdminProductById,
    updateAdminProduct
} from "../../../services/productAdminService";

import type { Product } from "../../../types/product";

interface ProductFormData {
    nama_product: string;
    jumlah_isi: string;
    harga: string;
    deskripsi: string;
    status: "aktif" | "nonaktif";
}

const initialForm: ProductFormData = {
    nama_product: "SoeSweet",
    jumlah_isi: "4",
    harga: "20000",
    deskripsi: "",
    status: "aktif"
};

const packageOptions = [
    { jumlah: 1, harga: 5000 },
    { jumlah: 4, harga: 20000 },
    { jumlah: 6, harga: 30000 },
    { jumlah: 8, harga: 40000 },
    { jumlah: 10, harga: 50000 },
    { jumlah: 20, harga: 100000 }
];

const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
};

export default function ProductForm() {
    const { id_product } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id_product);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ProductFormData>(initialForm);

    const [imageFile, setImageFile] = useState<File | null>(null);

    const [preview, setPreview] = useState("");

    const [existingProduct, setExistingProduct] =
        useState<Product | null>(null);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id_product) return;

        let active = true;

        const loadProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const product = await getAdminProductById(
                    id_product
                );

                if (!active) return;

                setExistingProduct(product);

                setForm({
                    nama_product: product.nama_product,
                    jumlah_isi: String(product.jumlah_isi),
                    harga: String(Number(product.harga)),
                    deskripsi: product.deskripsi || "",
                    status: product.status
                });

                setPreview(
                    product.gambar
                        ? getImageUrl(product.gambar)
                        : ""
                );

            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Gagal mengambil data produk"
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadProduct();

        return () => {
            active = false;
        };
    }, [id_product]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handlePackageChange = (value: string) => {
        const selected = packageOptions.find(
            (item) => item.jumlah === Number(value)
        );

        setForm((previous) => ({
            ...previous,
            jumlah_isi: value,
            harga: selected
                ? String(selected.harga)
                : previous.harga
        }));
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Format gambar harus JPEG, JPG, PNG, atau WEBP."
            );

            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Ukuran gambar maksimal 5 MB.");

            e.target.value = "";
            return;
        }

        setError("");
        setImageFile(file);

        setPreview(URL.createObjectURL(file));
    };

    const removeSelectedImage = () => {
        setImageFile(null);

        setPreview(
            existingProduct?.gambar
                ? getImageUrl(existingProduct.gambar)
                : ""
        );

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (form.nama_product.trim().length < 3) {
            setError("Nama produk minimal 3 karakter.");
            return;
        }

        if (
            !Number.isInteger(Number(form.jumlah_isi)) ||
            Number(form.jumlah_isi) < 1
        ) {
            setError("Jumlah isi harus berupa bilangan bulat positif.");
            return;
        }

        if (
            form.harga === "" ||
            !Number.isFinite(Number(form.harga)) ||
            Number(form.harga) < 0
        ) {
            setError("Harga produk tidak valid.");
            return;
        }

        if (form.deskripsi.length > 1000) {
            setError("Deskripsi maksimal 1000 karakter.");
            return;
        }

        if (isEdit && !existingProduct) {
            setError("Data produk belum berhasil dimuat.");
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append(
                "nama_product",
                form.nama_product.trim()
            );

            formData.append(
                "jumlah_isi",
                form.jumlah_isi
            );

            formData.append(
                "harga",
                form.harga
            );

            formData.append(
                "deskripsi",
                form.deskripsi
            );

            formData.append(
                "status",
                form.status
            );

            if (imageFile) {
                formData.append("gambar", imageFile);
            }

            if (isEdit && id_product) {
                await updateAdminProduct(
                    id_product,
                    formData
                );
            } else {
                await createAdminProduct(formData);
            }

            navigate("/admin/products", {
                replace: true,
                state: {
                    successMessage: isEdit
                        ? "Produk berhasil diperbarui."
                        : "Produk berhasil ditambahkan."
                }
            });

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan produk"
            );
        } finally {
            setSaving(false);
        }
    };

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

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* HEADER */}

            <div className="flex items-center gap-3">

                <Link
                    to="/admin/products"
                    className="rounded-xl border border-pink-100 bg-white p-3 text-[#C9184A] transition hover:bg-pink-50"
                >
                    <ArrowLeft size={20} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-[#590D22] sm:text-3xl">
                        {isEdit ? "Edit Produk" : "Tambah Produk"}
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        {isEdit
                            ? "Perbarui informasi produk SoeSweet"
                            : "Tambahkan produk baru ke katalog SoeSweet"}
                    </p>
                </div>

            </div>

            {/* ERROR */}

            {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* IMAGE UPLOAD */}

                    <div className="space-y-4 lg:col-span-1">

                        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">

                            <h2 className="font-bold text-[#590D22]">
                                Gambar Produk
                            </h2>

                            <p className="mt-1 text-xs text-[#98717E]">
                                Upload foto produk SoeSweet
                            </p>

                            <div className="mt-5">

                                <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-pink-200 bg-[#FFF0F3]">

                                    {preview ? (

                                        <img
                                            src={preview}
                                            alt="Preview produk"
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full flex-col items-center justify-center p-5 text-center">

                                            <ImagePlus
                                                size={45}
                                                className="text-[#C9184A]"
                                            />

                                            <p className="mt-3 text-sm font-semibold text-[#590D22]">
                                                Belum ada gambar
                                            </p>

                                            <p className="mt-1 text-xs text-[#98717E]">
                                                Pilih gambar produk
                                            </p>

                                        </div>

                                    )}

                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={removeSelectedImage}
                                            className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow-md hover:bg-red-50"
                                            title="Batalkan gambar baru"
                                        >
                                            <X size={17} />
                                        </button>
                                    )}

                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-[#FFF0F3] py-3 text-sm font-bold text-[#C9184A] transition hover:bg-pink-100"
                                >
                                    <Upload size={18} />
                                    {imageFile ? "Ganti Gambar" : "Pilih Gambar"}
                                </button>

                                <p className="mt-3 text-center text-xs leading-relaxed text-gray-400">
                                    JPEG, PNG, JPG, WEBP
                                    <br />
                                    Maksimal 5 MB
                                </p>

                            </div>

                        </div>

                        {/* INFORMATION */}

                        <div className="rounded-2xl border border-pink-100 bg-[#FFF0F3] p-4">

                            <div className="flex items-center gap-2 text-[#C9184A]">
                                <Info size={18} />
                                <p className="text-sm font-bold">
                                    Informasi
                                </p>
                            </div>

                            <p className="mt-2 text-xs leading-relaxed text-[#98717E]">
                                Gunakan foto produk yang jelas dan sesuai dengan varian paket yang dijual agar pelanggan lebih mudah mengenali produk SoeSweet.
                            </p>

                        </div>

                    </div>

                    {/* PRODUCT INFORMATION */}

                    <div className="space-y-6 lg:col-span-2">

                        <div className="space-y-5 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

                            <div className="flex items-center gap-2 border-b border-pink-100 pb-4">
                                <Package
                                    size={20}
                                    className="text-[#C9184A]"
                                />

                                <h2 className="font-bold text-[#590D22]">
                                    Informasi Produk
                                </h2>
                            </div>

                            {/* NAME */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                    Nama Produk <span className="text-red-500">*</span>
                                </label>

                                <input
                                    name="nama_product"
                                    value={form.nama_product}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={100}
                                    required
                                    placeholder="Contoh: SoeSweet"
                                    className="w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                                />
                            </div>

                            {/* PACKAGE */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                    Jumlah Isi <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="jumlah_isi"
                                    value={form.jumlah_isi}
                                    onChange={(e) => handlePackageChange(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-[#C9184A]"
                                >
                                    {packageOptions.map((item) => (
                                        <option
                                            key={item.jumlah}
                                            value={item.jumlah}
                                        >
                                            {item.jumlah} pcs
                                        </option>
                                    ))}
                                    <option value="custom">
                                        Jumlah custom
                                    </option>
                                </select>

                                {form.jumlah_isi === "custom" && (
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="Masukkan jumlah isi"
                                        onChange={(e) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                jumlah_isi: e.target.value
                                            }))
                                        }
                                        className="mt-3 w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-[#C9184A]"
                                    />
                                )}
                            </div>

                            {/* PRICE */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                    Harga Produk <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#C9184A]">
                                        Rp
                                    </span>

                                    <input
                                        type="number"
                                        name="harga"
                                        value={form.harga}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        required
                                        placeholder="20000"
                                        className="w-full rounded-xl border border-pink-100 py-3 pl-12 pr-4 text-sm outline-none focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                                    />

                                </div>

                                <p className="mt-2 text-xs text-[#98717E]">
                                    Harga saat ini: {formatRupiah(Number(form.harga) || 0)}
                                </p>
                            </div>

                            {/* DESCRIPTION */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-semibold text-[#590D22]">
                                        Deskripsi Produk
                                    </label>

                                    <span className="text-xs text-gray-400">
                                        {form.deskripsi.length}/1000
                                    </span>
                                </div>

                                <textarea
                                    name="deskripsi"
                                    value={form.deskripsi}
                                    onChange={handleChange}
                                    maxLength={1000}
                                    rows={5}
                                    placeholder="Tuliskan deskripsi produk SoeSweet..."
                                    className="w-full resize-y rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                                />
                            </div>

                            {/* STATUS */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                    Status Produk
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-[#C9184A]"
                                >
                                    <option value="aktif">
                                        Aktif
                                    </option>

                                    <option value="nonaktif">
                                        Nonaktif
                                    </option>
                                </select>

                                <p className="mt-2 text-xs text-[#98717E]">
                                    Produk nonaktif tidak seharusnya ditawarkan kepada pelanggan.
                                </p>
                            </div>

                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <Link
                                to="/admin/products"
                                className="rounded-xl border border-pink-200 bg-white px-6 py-3 text-center text-sm font-bold text-[#590D22] transition hover:bg-pink-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-7 py-3 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={18} />
                                )}

                                {saving
                                    ? "Menyimpan..."
                                    : isEdit
                                        ? "Simpan Perubahan"
                                        : "Simpan Produk"}
                            </button>

                        </div>

                    </div>

                </div>

            </form>

        </div>
    );
}