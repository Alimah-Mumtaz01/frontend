import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Wallet,
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  LoaderCircle,
  RefreshCw,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  updatePaymentMethodStatus,
  deletePaymentMethod,
  type PaymentMethod,
  type PaymentMethodInput,
  type PaymentMethodType,
} from "../../../services/paymentMethodService";

const initialForm: PaymentMethodInput = {
  jenis_metode: "transfer_bank",
  nama_bank: "",
  jenis_e_wallet: "",
  nomor_rekening: "",
  username: "",
};

export default function PaymentMethodList() {
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethod[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] =
    useState<PaymentMethod | null>(null);
  const [statusChangeMethod, setStatusChangeMethod] =
    useState<PaymentMethod | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [methodToDelete, setMethodToDelete] =
    useState<PaymentMethod | null>(null);
  const [deletingMethod, setDeletingMethod] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [form, setForm] =
    useState<PaymentMethodInput>(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Mengambil seluruh metode pembayaran dari backend.
   */
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAllPaymentMethods();

      setPaymentMethods(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data metode pembayaran."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  /**
   * Menyaring metode pembayaran berdasarkan pencarian.
   */
  const filteredMethods = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return paymentMethods;
    }

    return paymentMethods.filter((method) => {
      const name =
        method.jenis_metode === "transfer_bank"
          ? method.nama_bank
          : method.jenis_e_wallet;

      return (
        name?.toLowerCase().includes(keyword) ||
        method.nomor_rekening
          ?.toLowerCase()
          .includes(keyword) ||
        method.username
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [paymentMethods, search]);

  /**
   * Menghitung jumlah metode aktif dan nonaktif.
   */
  const activeCount = paymentMethods.filter(
    (method) => method.status === "aktif"
  ).length;

  const inactiveCount = paymentMethods.filter(
    (method) => method.status === "nonaktif"
  ).length;

  /**
   * Mengambil nama metode pembayaran.
   */
  const getMethodName = (method: PaymentMethod) => {
    if (method.jenis_metode === "transfer_bank") {
      return method.nama_bank || "Bank";
    }

    return method.jenis_e_wallet || "E-Wallet";
  };

  /**
   * Membuka modal tambah metode pembayaran.
   */
  const handleAdd = () => {
    setEditingMethod(null);
    setForm({ ...initialForm });
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  /**
   * Membuka modal edit metode pembayaran.
   */
  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);

    setForm({
      jenis_metode: method.jenis_metode,
      nama_bank: method.nama_bank || "",
      jenis_e_wallet: method.jenis_e_wallet || "",
      nomor_rekening: method.nomor_rekening,
      username: method.username,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  /**
   * Menutup modal.
   */
  const handleCloseModal = () => {
    if (submitting) return;

    setModalOpen(false);
    setEditingMethod(null);
    setForm({ ...initialForm });
    setError("");
  };

  /**
   * Mengubah jenis metode pembayaran.
   */
  const handleMethodTypeChange = (
    type: PaymentMethodType
  ) => {
    setForm({
      ...initialForm,
      jenis_metode: type,
    });
  };

  /**
   * Menangani perubahan input.
   */
  const handleChange = (
    field: keyof PaymentMethodInput,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /**
   * Validasi sederhana sebelum mengirim data.
   */
  const validateForm = () => {
    if (
      form.jenis_metode === "transfer_bank" &&
      !form.nama_bank?.trim()
    ) {
      return "Nama bank wajib diisi.";
    }

    if (
      form.jenis_metode === "e-wallet" &&
      !form.jenis_e_wallet?.trim()
    ) {
      return "Jenis e-wallet wajib diisi.";
    }

    if (!form.nomor_rekening.trim()) {
      return "Nomor rekening atau nomor akun wajib diisi.";
    }

    if (!form.username.trim()) {
      return "Nama pemilik rekening atau akun wajib diisi.";
    }

    return "";
  };

  /**
   * Menambahkan atau memperbarui metode pembayaran.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload: PaymentMethodInput = {
        jenis_metode: form.jenis_metode,
        nama_bank:
          form.jenis_metode === "transfer_bank"
            ? form.nama_bank?.trim()
            : null,
        jenis_e_wallet:
          form.jenis_metode === "e-wallet"
            ? form.jenis_e_wallet?.trim()
            : null,
        nomor_rekening: form.nomor_rekening.trim(),
        username: form.username.trim(),
      };

      if (editingMethod) {
        await updatePaymentMethod(
          editingMethod.id_metode_pembayaran,
          payload
        );

        setSuccess(
          "Metode pembayaran berhasil diperbarui."
        );
      } else {
        await createPaymentMethod(payload);

        setSuccess(
          "Metode pembayaran berhasil ditambahkan."
        );
      }

      setModalOpen(false);
      setEditingMethod(null);
      setForm({ ...initialForm });

      await fetchPaymentMethods();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan metode pembayaran."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Mengubah status aktif/nonaktif.
   */
  const handleToggleStatus = (method: PaymentMethod) => {
    setStatusChangeMethod(method);
    setStatusError("");
    setError("");
    setSuccess("");
  };

  const handleConfirmStatusChange = async () => {
    if (!statusChangeMethod || updatingStatus) return;

    const nextStatus =
      statusChangeMethod.status === "aktif"
        ? "nonaktif"
        : "aktif";

    try {
      setUpdatingStatus(true);
      setStatusError("");

      await updatePaymentMethodStatus(
        statusChangeMethod.id_metode_pembayaran,
        { status: nextStatus }
      );

      setSuccess(
        `Metode pembayaran berhasil ${
          nextStatus === "aktif"
            ? "diaktifkan"
            : "dinonaktifkan"
        }.`
      );

      setStatusChangeMethod(null);
      await fetchPaymentMethods();
    } catch (err) {
      setStatusError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status metode pembayaran."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /**
   * Menghapus metode pembayaran.
   */
  const handleDelete = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setDeleteError("");
    setError("");
    setSuccess("");
  };

  const handleConfirmDelete = async () => {
    if (!methodToDelete || deletingMethod) return;

    try {
      setDeletingMethod(true);
      setDeleteError("");

      const result = await deletePaymentMethod(
        methodToDelete.id_metode_pembayaran
      );

      setSuccess(result.message || "Metode pembayaran berhasil diproses.");
      setMethodToDelete(null);

      await fetchPaymentMethods();
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus metode pembayaran."
      );
    } finally {
      setDeletingMethod(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#590D22]">
            Metode Pembayaran
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola rekening bank dan e-wallet untuk pembayaran pelanggan.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#C9184A] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:opacity-90"
        >
          <Plus size={19} />
          Tambah Metode
        </button>
      </div>

      {/* Notifikasi */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={20} className="shrink-0" />
          <p>{success}</p>

          <button
            onClick={() => setSuccess("")}
            className="ml-auto"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {error && !modalOpen && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error}</p>

          <button
            onClick={() => setError("")}
            className="ml-auto"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Metode
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#590D22]">
                {paymentMethods.length}
              </h2>
            </div>

            <div className="rounded-xl bg-pink-50 p-3 text-[#C9184A]">
              <CreditCard size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Metode Aktif
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {activeCount}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Metode Nonaktif
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-500">
                {inactiveCount}
              </h2>
            </div>

            <div className="rounded-xl bg-gray-100 p-3 text-gray-500">
              <Power size={25} />
            </div>
          </div>
        </div>

      </div>

      {/* Daftar Metode */}
      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-pink-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-[#590D22]">
              Daftar Metode Pembayaran
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Informasi rekening dan akun pembayaran SoeSweet.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari metode pembayaran..."
                className="w-full rounded-xl border border-pink-100 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#FF758F] focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <button
              onClick={fetchPaymentMethods}
              disabled={loading}
              title="Muat ulang"
              className="rounded-xl border border-pink-100 p-2.5 text-[#C9184A] transition hover:bg-pink-50 disabled:opacity-50"
            >
              <RefreshCw
                size={19}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Konten */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <LoaderCircle
              size={32}
              className="animate-spin text-[#C9184A]"
            />

            <p className="text-sm text-gray-400">
              Memuat metode pembayaran...
            </p>
          </div>
        ) : filteredMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-full bg-pink-50 p-5 text-[#C9184A]">
              <CreditCard size={35} />
            </div>

            <h3 className="mt-4 font-bold text-[#590D22]">
              {search
                ? "Metode tidak ditemukan"
                : "Belum Ada Metode Pembayaran"}
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-400">
              {search
                ? "Coba gunakan kata kunci pencarian yang berbeda."
                : "Tambahkan rekening bank atau e-wallet agar pelanggan dapat melakukan pembayaran."}
            </p>

            {!search && (
              <button
                onClick={handleAdd}
                className="mt-5 flex items-center gap-2 rounded-xl bg-[#C9184A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A4133C]"
              >
                <Plus size={18} />
                Tambah Metode
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tampilan Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-[#FFF7F9] text-xs uppercase text-[#754052]">
                  <tr>
                    <th className="px-6 py-4">Metode</th>
                    <th className="px-6 py-4">Nomor Rekening / Akun</th>
                    <th className="px-6 py-4">Pemilik</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-pink-50">
                  {filteredMethods.map((method) => (
                    <tr
                      key={method.id_metode_pembayaran}
                      className="transition hover:bg-[#FFF9FA]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-pink-50 p-3 text-[#C9184A]">
                            {method.jenis_metode === "transfer_bank" ? (
                              <Building2 size={21} />
                            ) : (
                              <Wallet size={21} />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-[#590D22]">
                              {getMethodName(method)}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {method.jenis_metode === "transfer_bank"
                                ? "Transfer Bank"
                                : "E-Wallet"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {method.nomor_rekening}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {method.username}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            method.status === "aktif"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {method.status === "aktif"
                            ? "Aktif"
                            : "Nonaktif"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(method)}
                            title="Edit metode"
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleToggleStatus(method)
                            }
                            title={
                              method.status === "aktif"
                                ? "Nonaktifkan"
                                : "Aktifkan"
                            }
                            className={`rounded-lg p-2 transition ${
                              method.status === "aktif"
                                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            <Power size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(method)}
                            title="Hapus metode"
                            className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tampilan Mobile */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredMethods.map((method) => (
                <div
                  key={method.id_metode_pembayaran}
                  className="rounded-xl border border-pink-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-pink-50 p-3 text-[#C9184A]">
                        {method.jenis_metode === "transfer_bank" ? (
                          <Building2 size={21} />
                        ) : (
                          <Wallet size={21} />
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-[#590D22]">
                          {getMethodName(method)}
                        </p>

                        <p className="text-xs text-gray-400">
                          {method.jenis_metode === "transfer_bank"
                            ? "Transfer Bank"
                            : "E-Wallet"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        method.status === "aktif"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {method.status === "aktif"
                        ? "Aktif"
                        : "Nonaktif"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-pink-50 pt-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400">
                        Nomor rekening
                      </span>

                      <span className="break-all text-right font-semibold text-gray-700">
                        {method.nomor_rekening}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400">
                        Pemilik
                      </span>

                      <span className="text-right text-gray-700">
                        {method.username}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-pink-50 pt-3">
                    <button
                      onClick={() => handleEdit(method)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-sm font-semibold text-blue-600"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggleStatus(method)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-50 py-2 text-sm font-semibold text-amber-600"
                    >
                      <Power size={15} />
                      {method.status === "aktif"
                        ? "Nonaktifkan"
                        : "Aktifkan"}
                    </button>

                    <button
                      onClick={() => handleDelete(method)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-red-500"
                      title="Hapus metode"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        {!loading && filteredMethods.length > 0 && (
          <div className="border-t border-pink-100 px-5 py-4 text-xs text-gray-400">
            Menampilkan {filteredMethods.length} dari{" "}
            {paymentMethods.length} metode pembayaran.
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#590D22]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-pink-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#590D22]">
                  {editingMethod
                    ? "Edit Metode Pembayaran"
                    : "Tambah Metode Pembayaran"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Lengkapi informasi pembayaran SoeSweet.
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-pink-50 hover:text-[#C9184A]"
              >
                <X size={21} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">

                {/* Error Modal */}
                {error && (
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Jenis Metode */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                    Jenis Pembayaran
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleMethodTypeChange("transfer_bank")
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                        form.jenis_metode === "transfer_bank"
                          ? "border-[#C9184A] bg-pink-50 text-[#C9184A]"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Building2 size={19} />
                      Transfer Bank
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleMethodTypeChange("e-wallet")
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                        form.jenis_metode === "e-wallet"
                          ? "border-[#C9184A] bg-pink-50 text-[#C9184A]"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Wallet size={19} />
                      E-Wallet
                    </button>
                  </div>
                </div>

                {/* Nama Bank */}
                {form.jenis_metode === "transfer_bank" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                      Nama Bank
                    </label>

                    <input
                      type="text"
                      value={form.nama_bank || ""}
                      onChange={(event) =>
                        handleChange(
                          "nama_bank",
                          event.target.value
                        )
                      }
                      placeholder="Contoh: BCA, BRI, BNI, Mandiri"
                      className="w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none transition focus:border-[#FF758F] focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                )}

                {/* Nama E-Wallet */}
                {form.jenis_metode === "e-wallet" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                      Nama E-Wallet
                    </label>

                    <input
                      type="text"
                      value={form.jenis_e_wallet || ""}
                      onChange={(event) =>
                        handleChange(
                          "jenis_e_wallet",
                          event.target.value
                        )
                      }
                      placeholder="Contoh: DANA, GoPay, OVO"
                      className="w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none transition focus:border-[#FF758F] focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                )}

                {/* Nomor Rekening */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                    {form.jenis_metode === "transfer_bank"
                      ? "Nomor Rekening"
                      : "Nomor E-Wallet"}
                  </label>

                  <input
                    type="text"
                    value={form.nomor_rekening}
                    onChange={(event) =>
                      handleChange(
                        "nomor_rekening",
                        event.target.value
                      )
                    }
                    placeholder="Masukkan nomor rekening atau akun"
                    className="w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none transition focus:border-[#FF758F] focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                {/* Pemilik */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#590D22]">
                    {form.jenis_metode === "transfer_bank"
                      ? "Nama Pemilik Rekening"
                      : "Nama Pemilik Akun"}
                  </label>

                  <input
                    type="text"
                    value={form.username}
                    onChange={(event) =>
                      handleChange(
                        "username",
                        event.target.value
                      )
                    }
                    placeholder="Masukkan nama pemilik"
                    className="w-full rounded-xl border border-pink-100 px-4 py-3 text-sm outline-none transition focus:border-[#FF758F] focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <p className="rounded-xl bg-[#FFF7F9] p-3 text-xs leading-relaxed text-[#754052]">
                  Pastikan nama bank atau e-wallet, nomor rekening,
                  dan nama pemilik sudah benar agar pelanggan dapat
                  melakukan pembayaran dengan tepat.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-pink-100 bg-[#FFFAFB] px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="rounded-xl border border-pink-200 px-5 py-2.5 text-sm font-semibold text-[#754052] transition hover:bg-pink-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#C9184A] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      {editingMethod ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingMethod
                        ? "Simpan Perubahan"
                        : "Tambah Metode"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statusChangeMethod && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#590D22]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !updatingStatus
            ) {
              setStatusChangeMethod(null);
              setStatusError("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-status-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                statusChangeMethod.status === "aktif"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              <Power size={25} />
            </div>

            <h2
              id="payment-status-title"
              className="mt-4 text-center text-lg font-bold text-[#590D22]"
            >
              {statusChangeMethod.status === "aktif"
                ? "Nonaktifkan Metode Pembayaran?"
                : "Aktifkan Metode Pembayaran?"}
            </h2>

            <p className="mt-2 text-center text-sm leading-relaxed text-[#98717E]">
              Ubah status{" "}
              <span className="font-bold text-[#590D22]">
                {getMethodName(statusChangeMethod)}
              </span>
              {" "}dengan nomor{" "}
              <span className="font-semibold text-[#590D22]">
                {statusChangeMethod.nomor_rekening}
              </span>
              ?
            </p>

            <p className="mt-3 rounded-xl bg-[#FFF7F9] p-3 text-xs leading-relaxed text-[#754052]">
              {statusChangeMethod.status === "aktif"
                ? "Metode nonaktif tidak akan muncul sebagai pilihan pembayaran untuk pelanggan."
                : "Metode aktif akan tersedia kembali sebagai pilihan pembayaran untuk pelanggan."}
            </p>

            {statusError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{statusError}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStatusChangeMethod(null);
                  setStatusError("");
                }}
                disabled={updatingStatus}
                className="flex-1 rounded-xl border border-pink-200 py-3 text-sm font-bold text-[#754052] transition hover:bg-pink-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={updatingStatus}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  statusChangeMethod.status === "aktif"
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {updatingStatus ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Power size={17} />
                    {statusChangeMethod.status === "aktif"
                      ? "Ya, Nonaktifkan"
                      : "Ya, Aktifkan"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {methodToDelete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#590D22]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingMethod
            ) {
              setMethodToDelete(null);
              setDeleteError("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2 size={25} />
            </div>

            <h2
              id="payment-delete-title"
              className="mt-4 text-center text-lg font-bold text-[#590D22]"
            >
              Hapus Metode Pembayaran?
            </h2>

            <p className="mt-2 text-center text-sm leading-relaxed text-[#98717E]">
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-bold text-[#590D22]">
                {getMethodName(methodToDelete)}
              </span>
              {" "}dengan nomor{" "}
              <span className="font-semibold text-[#590D22]">
                {methodToDelete.nomor_rekening}
              </span>
              ?
            </p>

            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
              Jika metode sudah digunakan pada transaksi, sistem akan
              menonaktifkannya agar riwayat pembayaran tetap terjaga.
              Jika belum digunakan, data akan dihapus.
            </p>

            {deleteError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{deleteError}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMethodToDelete(null);
                  setDeleteError("");
                }}
                disabled={deletingMethod}
                className="flex-1 rounded-xl border border-pink-200 py-3 text-sm font-bold text-[#754052] transition hover:bg-pink-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingMethod}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingMethod ? (
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