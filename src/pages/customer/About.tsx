import { Link } from "react-router";
import kueSoesImage from "../../assets/images/illustration/kue-soes-aesthetic.png";
import bahanSoesImage from "../../assets/images/illustration/bahan-soes.png";
import {
  ArrowRight,
  Heart,
  CakeSlice,
  Sparkles,
  PackageCheck,
  Leaf,
  Star,
} from "lucide-react";

const advantages = [
  {
    icon: CakeSlice,
    title: "Pilihan Rasa Beragam",
    description:
      "Nikmati berbagai pilihan rasa yang dapat disesuaikan dengan selera dan kesukaanmu.",
  },
  {
    icon: Heart,
    title: "Dibuat dengan Sepenuh Hati",
    description:
      "Setiap produk SoeSweet dibuat dengan perhatian terhadap rasa dan kualitas.",
  },
  {
    icon: PackageCheck,
    title: "Kemasan Menarik",
    description:
      "Produk dikemas dengan rapi agar tetap nyaman dinikmati maupun dijadikan hadiah.",
  },
  {
    icon: Sparkles,
    title: "Pengalaman Menyenangkan",
    description:
      "Kami ingin menghadirkan pengalaman menikmati kue soes yang istimewa untuk setiap pelanggan.",
  },
];

export default function About() {
  return (
    <div className="overflow-hidden bg-[#FFF9FA] text-[#590D22]">

      {/* HERO SECTION */}
      <section className="relative bg-[#FFF0F3]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">

          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#C9184A] shadow-sm">
              <Heart size={16} />
              Cerita di Balik SoeSweet
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Mengenal Lebih Dekat{" "}
              <span className="text-[#C9184A]">SoeSweet</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#79505C] sm:text-lg">
              Selamat datang di SoeSweet! Kami hadir untuk memberikan
              pengalaman menikmati kue soes dengan berbagai pilihan rasa
              yang lezat, menarik, dan menyenangkan.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#C9184A] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#C9184A]/20 transition hover:-translate-y-1 hover:bg-[#A4133C]"
              >
                Lihat Produk
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center rounded-full border border-[#C9184A]/30 bg-white px-7 py-3.5 font-semibold text-[#C9184A] transition hover:bg-[#FFF0F3]"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#FFB3C1]/50 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-[#590D22]/10">
              <img
                src={kueSoesImage}
                alt="Kue soes aesthetic"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-5 shadow-xl sm:left-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F3] text-[#C9184A]">
                  <Heart size={24} fill="currentColor" />
                </div>

                <div>
                  <p className="font-bold text-[#590D22]">
                    Made with Love
                  </p>
                  <p className="text-sm text-[#9B7180]">
                    Dari SoeSweet untukmu
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9184A]">
            Tentang Kami
          </span>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Lebih dari Sekadar Kue Soes
          </h2>

          <p className="mt-6 text-base leading-8 text-[#79505C]">
            SoeSweet merupakan usaha yang berfokus pada penyediaan kue soes
            dengan pilihan rasa yang beragam. Kami ingin menjadikan kue soes
            sebagai camilan yang dapat dinikmati kapan saja, baik saat
            bersantai sendiri maupun ketika berkumpul bersama orang-orang
            tersayang.
          </p>

          <p className="mt-4 text-base leading-8 text-[#79505C]">
            Melalui SoeSweet, kami berusaha menghadirkan produk yang
            mengutamakan cita rasa, tampilan menarik, dan kemudahan dalam
            melakukan pemesanan.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl bg-[#FFF0F3] p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#C9184A]">
              <CakeSlice size={27} />
            </div>
            <h3 className="mt-5 text-lg font-bold">Kue Soes</h3>
            <p className="mt-2 text-sm leading-7 text-[#79505C]">
              Produk utama dengan tekstur lembut dan isian yang menggugah selera.
            </p>
          </div>

          <div className="rounded-3xl bg-[#FFF0F3] p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#C9184A]">
              <Sparkles size={27} />
            </div>
            <h3 className="mt-5 text-lg font-bold">Beragam Varian</h3>
            <p className="mt-2 text-sm leading-7 text-[#79505C]">
              Tersedia pilihan rasa yang bisa dipilih sesuai selera pelanggan.
            </p>
          </div>

          <div className="rounded-3xl bg-[#FFF0F3] p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#C9184A]">
              <Heart size={27} />
            </div>
            <h3 className="mt-5 text-lg font-bold">Penuh Perhatian</h3>
            <p className="mt-2 text-sm leading-7 text-[#79505C]">
              Mengutamakan pengalaman pelanggan dalam setiap proses pemesanan.
            </p>
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 md:grid-cols-2">

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src={bahanSoesImage}
                alt="Bahan-bahan untuk membuat kue soes"
                className="h-[340px] w-full object-cover sm:h-[440px]"
              />
            </div>

            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-[#C9184A] px-6 py-5 text-white shadow-xl sm:right-5">
              <p className="text-sm font-medium text-white/80">
                Our Little Sweet Story
              </p>
              <p className="mt-1 text-xl font-extrabold">
                Sweet Moments
              </p>
            </div>
          </div>

          <div className="pt-5 md:pt-0">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9184A]">
              Cerita Kami
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Berawal dari Kecintaan terhadap Camilan Manis
            </h2>

            <p className="mt-6 leading-8 text-[#79505C]">
              SoeSweet hadir dari keinginan untuk menghadirkan camilan manis
              yang dapat memberikan kebahagiaan sederhana dalam setiap
              kesempatan.
            </p>

            <p className="mt-4 leading-8 text-[#79505C]">
              Kami percaya bahwa makanan bukan hanya tentang rasa, tetapi
              juga tentang momen yang tercipta saat menikmatinya. Karena itu,
              SoeSweet terus berupaya menghadirkan kue soes yang menarik
              untuk menemani berbagai momen spesial.
            </p>

            <div className="mt-7 flex items-center gap-3 text-[#C9184A]">
              <Star size={21} fill="currentColor" />
              <span className="font-semibold">
                A Little Sweetness in Every Moment
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ADVANTAGES SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9184A]">
            Mengapa SoeSweet?
          </span>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Hal yang Membuat SoeSweet Istimewa
          </h2>

          <p className="mt-5 leading-8 text-[#79505C]">
            Kami ingin memberikan lebih dari sekadar produk, tetapi juga
            pengalaman yang menyenangkan bagi setiap pelanggan.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-[#F8DDE4] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-[#FFB3C1] hover:shadow-xl hover:shadow-[#C9184A]/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A] transition group-hover:bg-[#C9184A] group-hover:text-white">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#79505C]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMMITMENT SECTION */}
      <section className="bg-[#590D22] px-5 py-20 text-center text-white sm:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[#FFB3C1]">
            <Leaf size={30} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
            Manisnya Momen Bersama SoeSweet
          </h2>

          <p className="mt-6 leading-8 text-white/75">
            Kami berkomitmen untuk terus mengembangkan produk dan memberikan
            pelayanan yang baik agar SoeSweet dapat menjadi pilihan camilan
            favorit untuk berbagai momen.
          </p>

          <Link
            to="/products"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#FF758F] px-8 py-3.5 font-bold text-white transition hover:bg-[#FF4D6D]"
          >
            Temukan Produk Kami
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}