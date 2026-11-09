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
} from "lucide-react";

import { Link } from "react-router";

const contactInfo = {
  address: "Kp.Gandrung RT04 RW10 No.02 Desa Jambudipa Kec.Cisarua Kab.Bandung Barat Prov.Jawa Barat 40551",

  phoneDisplay: "0858 6240 7212",
  whatsappNumber: "+62 858 6240 7212",

  email: "soesweet@gmail.com",

  instagram: {
    username: "@soesweet",
    url: "https://www.instagram.com/",
  },

  facebook: {
    username: "SoeSweet",
    url: "https://www.facebook.com/",
  },

  tiktok: {
    username: "@soesweet",
    url: "https://www.tiktok.com/",
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
              <span className="text-sm font-semibold text-[#C9184A]">
                Lokasi SoeSweet
              </span>
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

            <p className="mt-3 min-h-[56px] break-all text-sm leading-7 text-[#79505C]">
              {contactInfo.email}
            </p>

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

      {/* SOCIAL MEDIA SECTION */}
      <section className="bg-white py-20 md:py-24">
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
                  className="group rounded-3xl border border-[#F8DDE4] bg-[#FFF9FA] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#FFB3C1] hover:bg-[#FFF0F3] hover:shadow-xl hover:shadow-[#C9184A]/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#C9184A] shadow-sm transition group-hover:bg-[#C9184A] group-hover:text-white">
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