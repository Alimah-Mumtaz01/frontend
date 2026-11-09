import { Link } from "react-router";
import {
    ArrowLeft,
    Heart,
    CakeSlice,
} from "lucide-react";

export default function AdminNotFound() {
    return (
        <main className="relative flex min-h-[65vh] flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFDDE6] px-6 py-12 text-center">

            {/* Decorative Hearts */}

            <Heart
                className="absolute left-[12%] top-[18%] text-[#FF8FA3]"
                size={32}
                fill="currentColor"
            />

            <Heart
                className="absolute right-[13%] top-[25%] text-[#FFB3C1]"
                size={25}
                fill="currentColor"
            />

            <span className="absolute left-[23%] top-[38%] text-4xl font-bold text-[#FF8FA3]/60">
                ?
            </span>

            <span className="absolute right-[22%] top-[35%] text-4xl font-bold text-[#FF8FA3]/60">
                ?
            </span>

            <span className="absolute bottom-[15%] left-[15%] text-2xl text-[#FFB3C1]">
                ✦
            </span>

            <span className="absolute bottom-[20%] right-[15%] text-2xl text-[#FFB3C1]">
                ✦
            </span>

            {/* Cake Illustration */}

            <div className="relative mb-3 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#FFE1E9] to-[#FFB3C1] text-[#C9184A] shadow-xl shadow-pink-200">
                <CakeSlice
                    size={68}
                    strokeWidth={1.5}
                />

                <span className="absolute -right-2 -top-2 text-3xl">
                    🍓
                </span>
            </div>

            {/* Text */}

            <p className="font-semibold tracking-[0.2em] text-[#C9184A]">
                OOPS! PAGE NOT FOUND
            </p>

            <h1 className="mt-2 text-8xl font-extrabold tracking-tight text-[#C9184A] sm:text-9xl">
                404
            </h1>

            <h2 className="mt-3 text-xl font-bold text-[#590D22] sm:text-2xl">
                Halaman Tidak Ditemukan
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-[#98717E]">
                Sepertinya halaman admin yang kamu cari
                tidak tersedia atau mungkin telah dipindahkan.
                Periksa kembali alamat halaman yang kamu buka.
            </p>

            {/* Back to Dashboard */}

            <Link
                to="/admin/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#C9184A] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-300"
            >
                <ArrowLeft size={18} />
                Kembali ke Dashboard
            </Link>

            <p className="mt-8 text-xs font-medium text-[#C18A9B]">
                © {new Date().getFullYear()} SoeSweet Admin Panel
            </p>

        </main>
    );
}