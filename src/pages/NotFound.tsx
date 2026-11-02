import { Link } from "react-router";
import { ArrowLeft, Heart, CakeSlice } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-soe-light via-white to-pink-100 px-6 text-center">

      {/* Decorative elements */}
      <Heart
        className="absolute left-[15%] top-[20%] text-soe-pink"
        size={35}
        fill="currentColor"
      />

      <Heart
        className="absolute right-[15%] top-[30%] text-soe-soft"
        size={25}
        fill="currentColor"
      />

      {/* Illustration */}
      <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-white text-soe-primary shadow-lg shadow-pink-100">
        <CakeSlice size={65} strokeWidth={1.4} />
      </div>

      <p className="font-semibold tracking-[0.2em] text-soe-secondary">
        OOPS! SOMETHING WENT WRONG
      </p>

      <h1 className="mt-3 text-8xl font-bold text-soe-primary">
        404
      </h1>

      <h2 className="mt-3 text-2xl font-bold text-soe-dark">
        Halaman Tidak Ditemukan
      </h2>

      <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
        Maaf, halaman yang kamu cari belum tersedia
        atau mungkin alamatnya sudah berubah.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-soe-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-1 hover:bg-soe-dark"
      >
        <ArrowLeft size={18} />
        Kembali ke Home
      </Link>

    </main>
  );
}
