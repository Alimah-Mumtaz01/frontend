import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  CakeSlice,
  Heart,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      await login(email.trim(), password);

      const loggedInUser = JSON.parse(
        localStorage.getItem("soesweet_user") || "null"
      );

      // Arahkan pengguna berdasarkan role.
      if (loggedInUser?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(redirectTo.startsWith("/admin") ? "/" : redirectTo, {
          replace: true,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal. Silakan coba kembali."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-pink-100 via-[#FFF0F3] to-pink-200 px-4 py-8 md:px-8">
      <div className="mx-auto grid min-h-[620px] max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-pink-200/60 md:grid-cols-2">

        {/* Panel Ilustrasi */}
        <section className="relative flex min-h-[260px] flex-col justify-center overflow-hidden bg-gradient-to-br from-[#FFD6E0] via-[#FFC2D1] to-[#FF9FB5] px-8 py-10 md:min-h-full md:px-12">
          <div className="absolute right-8 top-8 text-4xl text-pink-500/70">
            ♥
          </div>

          <div className="absolute bottom-8 left-8 text-3xl text-pink-500/60">
            ♥
          </div>

          <Heart className="absolute right-12 top-28 rotate-12 text-pink-500" size={30} />

          <div className="relative z-10 max-w-sm">
            <p className="font-serif text-3xl font-bold italic leading-tight text-[#590D22] md:text-4xl">
              Selamat Datang
              <br />
              di SoeSweet!
            </p>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#590D22]">
              Masuk untuk melanjutkan belanja dan menikmati lebih banyak
              kelezatan.
            </p>

            <div className="mt-8 flex items-center gap-3 text-7xl md:text-8xl">
              <span>🫐</span>
              <span className="-mt-8">🍓</span>
              <span>🥭</span>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#800F2F]">
              <CakeSlice size={18} />
              Sweet Moments, Delicious Bites
            </div>
          </div>
        </section>

        {/* Panel Form Login */}
        <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 md:px-12">
          <div className="w-full max-w-md">

            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl font-bold text-[#590D22]">
                Masuk Akun
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Masukkan email dan password kamu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-medium text-[#590D22]"
                >
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFFAFB] px-4 transition focus-within:border-[#C9184A] focus-within:ring-2 focus-within:ring-pink-100">
                  <Mail size={18} className="shrink-0 text-[#C9184A]" />

                  <input
                    id="login-email"
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

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium text-[#590D22]"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFFAFB] px-4 transition focus-within:border-[#C9184A] focus-within:ring-2 focus-within:ring-pink-100">
                  <LockKeyhole size={18} className="shrink-0 text-[#C9184A]" />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
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

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#C9184A] py-3 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sedang masuk..." : "Masuk"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-pink-100" />
              <span className="text-xs text-gray-400">atau</span>
              <div className="h-px flex-1 bg-pink-100" />
            </div>

            <p className="text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-bold text-[#C9184A] transition hover:text-[#800F2F]"
              >
                Daftar di sini
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} SoeSweet
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}