import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router";

import {
    ArrowLeft,
    Layers,
    Package,
    Save,
    LoaderCircle,
    Info,
    AlertCircle,
    Plus,
    Minus,
} from "lucide-react";

import {
    createAdminVarian,
    getAdminVarianById,
    updateAdminVarian
} from "../../../services/varianAdminService";

import type { Variant } from "../../../types/product";

interface VariantFormData {
    nama_varian: string;
    stok: string;
    status: "aktif" | "nonaktif";
}

const initialForm: VariantFormData = {
    nama_varian: "",
    stok: "0",
    status: "aktif"
};

export default function VariantForm() {
    const { id_varian } = useParams();
    const navigate = useNavigate();

    const isEdit = Boolean(id_varian);

    const [form, setForm] =
        useState<VariantFormData>(initialForm);

    const [existingVariant, setExistingVariant] =
        useState<Variant | null>(null);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        if (!id_varian) return;

        let active = true;

        const loadVariant = async () => {
            try {
                setLoading(true);
                setError("");

                const variant = await getAdminVarianById(
                    id_varian
                );

                if (!active) return;

                setExistingVariant(variant);

                setForm({
                    nama_varian: variant.nama_varian,
                    stok: String(variant.stok),
                    status: variant.status
                });

            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Gagal mengambil data varian."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadVariant();

        return () => {
            active = false;
        };
    }, [id_varian]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleStockChange = (change: number) => {
        setForm((previous) => {
            const currentStock = Number(previous.stok) || 0;

            const newStock = Math.max(
                0,
                currentStock + change
            );

            return {
                ...previous,
                stok: String(newStock)
            };
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        const namaVarian = form.nama_varian.trim();

        if (namaVarian.length < 3) {
            setError(
                "Nama varian minimal 3 karakter."
            );
            return;
        }

        if (namaVarian.length > 100) {
            setError(
                "Nama varian maksimal 100 karakter."
            );
            return;
        }

        if (
            form.stok.trim() === "" ||
            !Number.isInteger(Number(form.stok)) ||
            Number(form.stok) < 0
        ) {
            setError(
                "Stok harus berupa bilangan bulat dan tidak boleh kurang dari 0."
            );
            return;
        }

        if (
            form.status !== "aktif" &&
            form.status !== "nonaktif"
        ) {
            setError("Status varian tidak valid.");
            return;
        }

        if (isEdit && !existingVariant) {
            setError(
                "Data varian belum berhasil dimuat."
            );
            return;
        }

        try {
            setSaving(true);

            const data = {
                nama_varian: namaVarian,
                stok: Number(form.stok),
                status: form.status
            };

            if (isEdit && id_varian) {
                await updateAdminVarian(
                    id_varian,
                    data
                );
            } else {
                await createAdminVarian(data);
            }

            navigate("/admin/variants", {
                replace: true,
                state: {
                    successMessage: isEdit
                        ? "Varian berhasil diperbarui."
                        : "Varian berhasil ditambahkan."
                }
            });

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal menyimpan data varian."
            );
        } finally {
            setSaving(false);
        }
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
        <div className="mx-auto max-w-5xl space-y-6">

            {/* HEADER */}

            <div className="flex items-center gap-3">

                <Link
                    to="/admin/variants"
                    className="rounded-xl border border-pink-100 bg-white p-3 text-[#C9184A] transition hover:bg-pink-50"
                >
                    <ArrowLeft size={20} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-[#590D22] sm:text-3xl">
                        {isEdit
                            ? "Edit Varian"
                            : "Tambah Varian"}
                    </h1>

                    <p className="mt-1 text-sm text-[#98717E]">
                        {isEdit
                            ? "Perbarui informasi varian rasa SoeSweet."
                            : "Tambahkan varian rasa baru ke persediaan SoeSweet."}
                    </p>
                </div>

            </div>

            {/* ERROR */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">

                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <p>{error}</p>

                </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit}>

                <div className="space-y-6">

                        <div className="space-y-5 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

                            {/* SECTION HEADER */}

                            <div className="flex items-center gap-2 border-b border-pink-100 pb-4">

                                <Layers
                                    size={21}
                                    className="text-[#C9184A]"
                                />

                                <h2 className="font-bold text-[#590D22]">
                                    Informasi Varian
                                </h2>

                            </div>

                            {/* NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                    Nama Varian{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="nama_varian"
                                    value={form.nama_varian}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={100}
                                    required
                                    placeholder="Contoh: Original"
                                    className="w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                                />

                                <p className="mt-2 text-xs text-[#98717E]">
                                    {form.nama_varian.length}/100 karakter.
                                    Minimal 3 karakter.
                                </p>

                            </div>

                            {/* STOCK */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                    Jumlah Stok{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <div className="flex items-center gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStockChange(-1)
                                        }
                                        disabled={
                                            Number(form.stok) <= 0
                                        }
                                        aria-label="Kurangi stok"
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-200 bg-[#FFF0F3] text-[#C9184A] transition hover:bg-pink-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus size={19} />
                                    </button>

                                    <div className="relative flex-1">

                                        <Package
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9184A]"
                                        />

                                        <input
                                            type="number"
                                            name="stok"
                                            value={form.stok}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            required
                                            placeholder="0"
                                            className="w-full rounded-xl border border-pink-100 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                                        />

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStockChange(1)
                                        }
                                        aria-label="Tambah stok"
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-200 bg-[#FFF0F3] text-[#C9184A] transition hover:bg-pink-100"
                                    >
                                        <Plus size={19} />
                                    </button>

                                </div>

                                <p className="mt-2 text-xs text-[#98717E]">
                                    Masukkan jumlah stok dalam bilangan bulat. Nilai minimum adalah 0.
                                </p>

                            </div>

                            {/* STATUS */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                                    Status Varian
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-pink-100"
                                >
                                    <option value="aktif">
                                        Aktif
                                    </option>

                                    <option value="nonaktif">
                                        Nonaktif
                                    </option>
                                </select>

                                <p className="mt-2 text-xs leading-relaxed text-[#98717E]">
                                    Varian nonaktif sebaiknya tidak ditawarkan kepada pelanggan.
                                </p>

                            </div>

                        </div>

                        {/* INFORMATION */}

                        <div className="rounded-2xl border border-pink-100 bg-[#FFF0F3] p-4">

                            <div className="flex items-center gap-2 text-[#C9184A]">

                                <Info size={18} />

                                <p className="text-sm font-bold">
                                    Catatan Pengelolaan Varian
                                </p>

                            </div>

                            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#98717E]">

                                <li>
                                    • Nama varian harus unik dan minimal 3 karakter.
                                </li>

                                <li>
                                    • Stok tidak boleh bernilai negatif.
                                </li>

                                <li>
                                    • Perubahan stok akan langsung tersimpan di database.
                                </li>

                                <li>
                                    • Varian yang sudah digunakan dalam pesanan mungkin tidak dapat dihapus.
                                </li>

                            </ul>

                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                            <Link
                                to="/admin/variants"
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
                                        : "Simpan Varian"}

                            </button>

                        </div>

                    </div>

            </form>

        </div>
    );
}