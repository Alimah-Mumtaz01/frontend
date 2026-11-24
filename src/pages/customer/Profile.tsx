import { useEffect, useState, type FormEvent } from "react";
import {
  UserRound,
  MapPin,
  Phone,
  Mail,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
  getProfile,
  savePrimaryAddress,
  type CustomerProfile,
} from "../../services/profileService";

interface AddressForm {
  nama_penerima: string;
  no_hp: string;
  alamat: string;
  catatan: string;
}

const initialForm: AddressForm = {
  nama_penerima: "",
  no_hp: "",
  alamat: "",
  catatan: "",
};

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [form, setForm] = useState<AddressForm>(initialForm);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mengambil data akun dan alamat utama dari backend.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getProfile();

        setProfile(result);

        // Jika customer sudah mempunyai alamat, isi form
        // menggunakan alamat yang sebelumnya tersimpan.
        if (result.address) {
          setForm({
            nama_penerima: result.address.nama_penerima || "",
            no_hp: result.address.no_hp || "",
            alamat: result.address.alamat || "",
            catatan: result.address.catatan || "",
          });
        } else {
          // Jika belum mempunyai alamat, gunakan data akun
          // sebagai nilai awal nama dan nomor HP.
          setForm({
            nama_penerima: result.nama || user?.nama || "",
            no_hp: result.no_hp || user?.no_hp || "",
            alamat: "",
            catatan: "",
          });
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.nama, user?.no_hp]);

  // Mengubah nilai input form.
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Menyimpan atau memperbarui alamat utama.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.nama_penerima.trim().length < 3) {
      setError("Nama penerima minimal 3 karakter.");
      return;
    }

    if (!/^[0-9+]{10,20}$/.test(form.no_hp.trim())) {
      setError("Nomor HP harus terdiri dari 10–20 angka atau tanda +.");
      return;
    }

    if (form.alamat.trim().length < 10) {
      setError("Alamat minimal 10 karakter.");
      return;
    }

    try {
      setIsSaving(true);

      const savedAddress = await savePrimaryAddress({
        nama_penerima: form.nama_penerima.trim(),
        no_hp: form.no_hp.trim(),
        alamat: form.alamat.trim(),
        catatan: form.catatan.trim(),
      });

      // Perbarui data profile tanpa perlu memuat ulang halaman.
      setProfile((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          address: savedAddress,
        };
      });

      setSuccess("Alamat utama berhasil disimpan.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan alamat. Silakan coba kembali."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-soe-primary">
          <LoaderCircle className="animate-spin" size={24} />
          <span className="font-medium">Memuat profile...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-soe-light px-5 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Judul halaman */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-soe-primary">
            Akun Saya
          </p>

          <h1 className="text-3xl font-bold text-soe-dark md:text-4xl">
            Profile Saya
          </h1>

          <p className="mt-2 text-sm text-gray-500 md:text-base">
            Kelola informasi akun dan alamat utama untuk pengiriman pesanan.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-[0.8fr_1.2fr]">

          {/* Informasi akun */}
          <div className="h-fit rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-soe-primary">
                <UserRound size={24} />
              </div>

              <div>
                <h2 className="font-bold text-soe-dark">
                  Informasi Akun
                </h2>

                <p className="text-xs text-gray-500">
                  Data akun customer
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Nama Customer
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold text-soe-dark">
                  <UserRound size={17} className="text-soe-primary" />
                  {profile?.nama || user?.nama || "-"}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Email
                </p>

                <div className="flex items-center gap-2 break-all text-sm font-semibold text-soe-dark">
                  <Mail size={17} className="shrink-0 text-soe-primary" />
                  {profile?.email || user?.email || "-"}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Nomor HP Akun
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold text-soe-dark">
                  <Phone size={17} className="text-soe-primary" />
                  {profile?.no_hp || user?.no_hp || "-"}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-pink-50 p-4">
              <p className="text-xs leading-relaxed text-soe-dark">
                Informasi akun ditampilkan dari data customer yang sedang
                login. Untuk saat ini, halaman ini berfokus pada pengelolaan
                alamat utama.
              </p>
            </div>
          </div>

          {/* Form alamat utama */}
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-soe-primary">
                <MapPin size={24} />
              </div>

              <div>
                <h2 className="font-bold text-soe-dark">
                  Alamat Utama
                </h2>

                <p className="text-xs text-gray-500">
                  {profile?.address
                    ? "Perbarui alamat yang sudah tersimpan."
                    : "Tambahkan alamat untuk memudahkan pengiriman."}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nama penerima */}
              <div>
                <label
                  htmlFor="nama_penerima"
                  className="mb-2 block text-sm font-semibold text-soe-dark"
                >
                  Nama Penerima
                </label>

                <input
                  id="nama_penerima"
                  name="nama_penerima"
                  type="text"
                  value={form.nama_penerima}
                  onChange={handleChange}
                  placeholder="Masukkan nama penerima"
                  required
                  minLength={3}
                  maxLength={100}
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-soe-primary focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* Nomor HP */}
              <div>
                <label
                  htmlFor="no_hp"
                  className="mb-2 block text-sm font-semibold text-soe-dark"
                >
                  Nomor HP Penerima
                </label>

                <input
                  id="no_hp"
                  name="no_hp"
                  type="tel"
                  value={form.no_hp}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                  required
                  minLength={10}
                  maxLength={20}
                  className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-soe-primary focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* Alamat */}
              <div>
                <label
                  htmlFor="alamat"
                  className="mb-2 block text-sm font-semibold text-soe-dark"
                >
                  Alamat Lengkap
                </label>

                <textarea
                  id="alamat"
                  name="alamat"
                  value={form.alamat}
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      alamat: event.target.value,
                    }));

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Masukkan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, dan informasi alamat lainnya."
                  required
                  minLength={10}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-soe-primary focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* Catatan */}
              <div>
                <label
                  htmlFor="catatan"
                  className="mb-2 block text-sm font-semibold text-soe-dark"
                >
                  Catatan Alamat
                  <span className="ml-2 font-normal text-gray-400">
                    (Opsional)
                  </span>
                </label>

                <textarea
                  id="catatan"
                  name="catatan"
                  value={form.catatan}
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      catatan: event.target.value,
                    }));

                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Contoh: Rumah pagar putih, dekat minimarket."
                  rows={3}
                  className="w-full resize-y rounded-xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-soe-primary focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* Tombol simpan */}
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-soe-primary px-5 py-3 font-semibold text-white transition hover:bg-soe-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={19} />
                    {profile?.address
                      ? "Perbarui Alamat"
                      : "Simpan Alamat"}
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}