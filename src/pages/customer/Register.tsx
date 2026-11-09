import { useState, type FormEvent } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Phone,
  CakeSlice,
  Heart,
} from "lucide-react";

import { Link, useNavigate } from "react-router";
import { registerUser } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!nama.trim() || !email.trim() || !noHp.trim() || !password) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal terdiri dari 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      setIsSubmitting(true);

      await registerUser({
        nama: nama.trim(),
        email: email.trim(),
        no_hp: noHp.trim(),
        password,
      });

      setSuccess("Registrasi berhasil! Silakan masuk menggunakan akun kamu.");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registrasi gagal. Silakan coba kembali."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-pink-100 via-[#FFF0F3] to-pink-200 px-4 py-8 md:px-8">
      <div className="mx-auto grid min-h-[650px] max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-pink-200/60 md:grid-cols-2">

        {/* Panel Ilustrasi */}
        <section className="relative flex min-h-[260px] flex-col justify-center overflow-hidden bg-gradient-to-br from-[#FFD6E0] via-[#FFC2D1] to-[#FF9FB5] px-8 py-10 md:min-h-full md:px-12">
          <div className="absolute right-8 top-8 text-4xl text-pink-500/70">
            ♥
          </div>

          <Heart className="absolute right-12 top-28 rotate-12 text-pink-500" size={30} />

          <div className="relative z-10 max-w-sm">
            <p className="font-serif text-3xl font-bold italic leading-tight text-[#590D22] md:text-4xl">
              Bergabung dengan
              <br />
              SoeSweet
            </p>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#590D22]">
              Dapatkan pengalaman belanja lebih istimewa dengan akun
              SoeSweet!
            </p>

            <div className="mt-8 flex items-center gap-4 text-7xl md:text-8xl">
              <span>🫐</span>
              <span>🥭</span>
              <span>🍫</span>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#800F2F]">
              <CakeSlice size={18} />
              Sweet Moments, Delicious Bites
            </div>
          </div>
        </section>

        {/* Panel Form Register */}
        <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 md:px-12">
          <div className="w-full max-w-md">

            <div className="mb-7 text-center">
              <h1 className="font-serif text-3xl font-bold text-[#590D22]">
                Daftar Akun
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Isi data berikut untuk membuat akun
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nama */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-medium text-[#590D22]"
                >
                  Nama Lengkap
                </label>

                <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFFAFB] px-4 transition focus-within:border-[#C9184A] focus-within:ring-2 focus-within:ring-pink-100">
                  <UserRound size={18} className="shrink-0 text-[#C9184A]" />

                  <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChange={(event) => setNama(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-[#590D22] outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-medium text-[#590D22]"
                >
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFFAFB] px-4 transition focus-within:border-[#C9184A] focus-within:ring-2 focus-within:ring-pink-100">
                  <Mail size={18} className="shrink-0 text-[#C9184A]" />

                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-[#590D22] outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Nomor HP */}
              <div>
                <label
                  htmlFor="register-phone"
                  className="mb-2 block text-sm font-medium text-[#590D22]"
                >
                  Nomor HP
                </label>

                <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFFAFB] px-4 transition focus-within:border-[#C9184A] focus-within:ring-2 focus-within:ring-pink-100">
                  <Phone size={18} className="shrink-0 text-[#C9184A]" />

                  <input
                    id="register-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Contoh: 081234567890"
                    value={noHp}
                    onChange={(event) => setNoHp(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-[#590D22] outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-medium text-[#590D22]"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFFAFB] px-4 transition focus-within:border-[#C9184A] focus-within:ring-2 focus-within:ring-pink-100">
                  <LockKeyhole size={18} className="shrink-0 text-[#C9184A]" />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-[#590D22] outline-none placeholder:text-gray-400"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="text-gray-400 transition hover:text-[#C9184A]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-medium text-[#590D22]"
                >
                  Konfirmasi Password
                </label>

                <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFFAFB] px-4 transition focus-within:border-[#C9184A] focus-within:ring-2 focus-within:ring-pink-100">
                  <LockKeyhole size={18} className="shrink-0 text-[#C9184A]" />

                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-[#590D22] outline-none placeholder:text-gray-400"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="text-gray-400 transition hover:text-[#C9184A]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  role="status"
                  className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#C9184A] py-3 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sedang mendaftar..." : "Daftar Sekarang"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-bold text-[#C9184A] transition hover:text-[#800F2F]"
              >
                Masuk di sini
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} SoeSweet
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}