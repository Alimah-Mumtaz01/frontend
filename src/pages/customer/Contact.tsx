import {
  MapPin,
  Phone,
  Mail,
  Music2,
  MessageCircle,
  ArrowUpRight,
  Clock,
  Headphones,
  ArrowRight,
  Navigation,
} from "lucide-react";

import { Link } from "react-router";

const contactInfo = {
  address:
    "Kp.Gandrung RT04 RW10 No.02 Desa Jambudipa Kec.Cisarua Kab.Bandung Barat Prov.Jawa Barat 40551",

  phoneDisplay: "+62 858 6240 7212",
  whatsappNumber: "6285862407212",

  email: "mysoesweet@gmail.com",

  // Lokasi Google Maps SoeSweet
  latitude: -6.8178583,
  longitude: 107.5618367,

  // URL untuk menampilkan Google Maps
  mapsEmbedUrl:
    "https://www.google.com/maps?q=-6.8178583,107.5618367&output=embed",

  // URL untuk mengarahkan customer ke Google Maps
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=-6.8178583%2C107.5618367",

  instagram: {
    username: "@soesweet",
    url: "https://www.instagram.com/soess.sweet?jplx=MXVhOGN2aGwxZGpqMw==",
  },

  facebook: {
    username: "SoeSweet",
    url: "https://www.facebook.com/share/16SrLqe2yfA/",
  },

  tiktok: {
    username: "@soesweet",
    url: "https://www.tiktok.com/@soes_sweet?_r=1&_t=ZS-9BiXWwMwNSJ",
  },
};

const socialMedia = [
  {
    name: "Instagram",
    username: contactInfo.instagram.username,
    url: contactInfo.instagram.url,
    icon: "instagram",
    description: "Ikuti berbagai informasi dan produk terbaru kami.",
  },
  {
    name: "Facebook",
    username: contactInfo.facebook.username,
    url: contactInfo.facebook.url,
    icon: "facebook",
    description: "Temukan informasi dan kabar terbaru SoeSweet.",
  },
  {
    name: "TikTok",
    username: contactInfo.tiktok.username,
    url: contactInfo.tiktok.url,
    icon: "tiktok",
    description: "Lihat konten menarik seputar produk SoeSweet.",
  },
];

export default function Contact() {
  return (
    <div className="overflow-hidden bg-[#FFF9FA] text-[#590D22]">

      {/* HERO SECTION */}
      <section className="relative bg-[#FFF0F3]">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 md:py-24">

          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#C9184A] shadow-sm">
            <MessageCircle size={16} />
            Kami Siap Membantu
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Mari Terhubung dengan{" "}
            <span className="text-[#C9184A]">SoeSweet</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#79505C] sm:text-lg">
            Punya pertanyaan mengenai produk atau ingin melakukan pemesanan?
            Jangan ragu untuk menghubungi kami melalui informasi kontak di
            bawah ini.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={`https://wa.me/${contactInfo.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9184A] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#C9184A]/20 transition hover:-translate-y-1 hover:bg-[#A4133C]"
            >
              <MessageCircle size={19} />
              Hubungi via WhatsApp
              <ArrowUpRight size={17} />
            </a>
          </div>

        </div>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24">

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9184A]">
            Informasi Kontak
          </span>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Hubungi Kami
          </h2>

          <p className="mt-5 leading-8 text-[#79505C]">
            Berikut beberapa cara untuk menghubungi dan menemukan SoeSweet.
            Kami senang dapat membantu kebutuhanmu.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {/* ADDRESS */}
          <div className="rounded-3xl border border-[#F8DDE4] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
              <MapPin size={27} />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              Alamat
            </h3>

            <p className="mt-3 min-h-[56px] text-sm leading-7 text-[#79505C]">
              {contactInfo.address}
            </p>

            <div className="mt-6 border-t border-[#F8DDE4] pt-5">
              <a
                href={contactInfo.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9184A] transition hover:text-[#800F2F]"
              >
                Lihat Lokasi
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* PHONE */}
          <div className="rounded-3xl border border-[#F8DDE4] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
              <Phone size={27} />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              Nomor Telepon
            </h3>

            <p className="mt-3 min-h-[56px] text-sm leading-7 text-[#79505C]">
              {contactInfo.phoneDisplay}
            </p>

            <div className="mt-6 border-t border-[#F8DDE4] pt-5">
              <a
                href={`https://wa.me/${contactInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9184A] transition hover:text-[#800F2F]"
              >
                Hubungi WhatsApp
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* EMAIL */}
          <div className="rounded-3xl border border-[#F8DDE4] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
              <Mail size={27} />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              Email
            </h3>

            <a
              href={`mailto:${contactInfo.email}`}
              className="mt-3 inline-block min-h-[56px] break-all text-sm leading-7 text-[#79505C] transition hover:text-[#C9184A] hover:underline"
            >
              {contactInfo.email}
            </a>

            <div className="mt-6 border-t border-[#F8DDE4] pt-5">
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9184A] transition hover:text-[#800F2F]"
              >
                Kirim Email
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* GOOGLE MAPS LOCATION SECTION */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          {/* SECTION HEADING */}
          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9184A]">
              Lokasi Kami
            </span>

            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Temukan Lokasi{" "}
              <span className="text-[#C9184A]">SoeSweet</span>
            </h2>

            <p className="mt-5 leading-8 text-[#79505C]">
              Ingin mengambil pesanan secara langsung? Kunjungi lokasi
              SoeSweet melalui peta di bawah ini dan temukan rute perjalanan
              menuju tempat pickup pesananmu.
            </p>

          </div>

          {/* MAP CONTAINER */}
          <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-3xl border border-[#F8DDE4] bg-white shadow-lg shadow-[#C9184A]/5">

            {/* MAP HEADER */}
            <div className="flex flex-col gap-4 bg-[#FFF0F3] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#C9184A] shadow-sm">
                  <MapPin size={25} />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    SoeSweet
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#79505C]">
                    {contactInfo.address}
                  </p>
                </div>

              </div>

              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#C9184A] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#C9184A]" />
                Lokasi Pickup
              </span>

            </div>

            {/* GOOGLE MAPS EMBED */}
            <div className="relative h-[350px] w-full sm:h-[450px]">

              <iframe
                title="Lokasi Pickup SoeSweet di Google Maps"
                src={contactInfo.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

            </div>

            {/* MAP FOOTER */}
            <div className="flex flex-col items-center justify-between gap-5 border-t border-[#F8DDE4] p-6 sm:flex-row sm:p-8">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                  <Navigation size={21} />
                </div>

                <div>
                  <h4 className="font-bold">
                    Ingin Berkunjung ke SoeSweet?
                  </h4>

                  <p className="mt-1 text-xs leading-6 text-[#79505C]">
                    Dapatkan petunjuk arah menuju lokasi pickup kami.
                  </p>
                </div>
              </div>

              <a
                href={contactInfo.mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9184A] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#C9184A]/20 transition hover:-translate-y-1 hover:bg-[#A4133C] sm:w-auto"
              >
                <Navigation size={18} />
                Petunjuk Arah ke SoeSweet
                <ArrowUpRight size={17} />
              </a>

            </div>

          </div>

          {/* PICKUP INFORMATION */}
          <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-[#F8DDE4] bg-[#FFF9FA] p-6">

            <div className="flex items-start gap-3">
              <MapPin size={21} className="mt-1 shrink-0 text-[#C9184A]" />

              <div>
                <h4 className="font-bold">
                  Informasi Pengambilan Pesanan
                </h4>

                <p className="mt-2 text-sm leading-7 text-[#79505C]">
                  Customer yang memilih metode pengiriman pickup dapat
                  menggunakan peta ini sebagai panduan menuju lokasi
                  SoeSweet. Pastikan untuk menghubungi kami terlebih dahulu
                  apabila membutuhkan informasi lebih lanjut mengenai
                  pengambilan pesanan.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section className="bg-[#FFF9FA] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9184A]">
              Media Sosial
            </span>

            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Ikuti Keseruan SoeSweet
            </h2>

            <p className="mt-5 leading-8 text-[#79505C]">
              Jangan lewatkan informasi, produk terbaru, dan berbagai
              aktivitas menarik dari SoeSweet melalui media sosial kami.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {socialMedia.map((social) => {
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-3xl border border-[#F8DDE4] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-[#FFB3C1] hover:bg-[#FFF0F3] hover:shadow-xl hover:shadow-[#C9184A]/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF9FA] text-[#C9184A] shadow-sm transition group-hover:bg-[#C9184A] group-hover:text-white">
                      {social.icon === "instagram" ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-[27px] w-[27px]"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle
                            cx="17.5"
                            cy="6.5"
                            r=".75"
                            fill="currentColor"
                          />
                        </svg>
                      ) : social.icon === "facebook" ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-[27px] w-[27px]"
                        >
                          <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.8v8h3.7z" />
                        </svg>
                      ) : (
                        <Music2 size={27} />
                      )}
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="text-[#C9184A] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {social.name}
                  </h3>

                  <p className="mt-2 font-semibold text-[#C9184A]">
                    {social.username}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#79505C]">
                    {social.description}
                  </p>
                </a>
              );
            })}
          </div>

        </div>
      </section>

      {/* CUSTOMER SERVICE SECTION */}
      <section className="px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 rounded-[2rem] bg-[#590D22] p-8 text-center text-white sm:p-12 md:flex-row md:text-left">

          <div className="max-w-xl">
            <div className="flex items-center justify-center gap-2 text-[#FFB3C1] md:justify-start">
              <Headphones size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">
                Customer Service
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
              Ada yang ingin ditanyakan?
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/75">
              Kami siap membantu memberikan informasi mengenai produk,
              pemesanan, dan berbagai hal lainnya seputar SoeSweet.
            </p>
          </div>

          <a
            href={`https://wa.me/${contactInfo.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF758F] px-7 py-3.5 font-bold text-white transition hover:bg-[#FF4D6D]"
          >
            <MessageCircle size={19} />
            Hubungi Kami
            <ArrowUpRight size={17} />
          </a>

        </div>
      </section>

      {/* BACK TO PRODUCTS */}
      <section className="pb-20 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-[#9B7180]">
          <Clock size={16} />
          Terima kasih telah mengenal SoeSweet!
        </div>

        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-2 font-bold text-[#C9184A] transition hover:gap-3"
        >
          Jelajahi Produk Kami
          <ArrowRight size={18} />
        </Link>
      </section>

    </div>
  );
}