import {
  Music2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-soe-dark text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <img
            src="/images/logo-soesweet.png"
            alt="SoeSweet"
            className="mb-4 h-20 w-auto max-w-[250px] object-contain"
          />

          <p className="max-w-xs text-sm leading-7 text-pink-100">
            Nikmati kelezatan kue soes dengan berbagai pilihan
            paket dan varian rasa favorit dari SoeSweet.
          </p>

          <p className="mt-4 text-sm italic text-pink-200">
            Sweet Moments, Delicious Bites.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 font-semibold">Navigasi</h3>

          <ul className="space-y-3 text-sm text-pink-100">
            {[
              { label: "Beranda", path: "/" },
              { label: "Produk", path: "/products" },
              { label: "Tentang Kami", path: "/about" },
              { label: "Kontak", path: "/contact" },
              { label: "Ulasan", path: "/reviews" },
            ].map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `inline-flex items-center border-l-2 pl-2 transition-colors ${
                      isActive
                        ? "border-[#FF8FA3] font-bold text-white"
                        : "border-transparent hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 font-semibold">Hubungi Kami</h3>

          <ul className="space-y-4 text-sm text-pink-100">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0" />
              <span>Kp.Gandrung RT04 RW10 No.02 Desa Jambudipa Kec.Cisarua Kab.Bandung Barat Prov.Jawa Barat 40551</span>
            </li>

            <li className="flex items-center gap-3">
              <Phone size={18} />
              <span>+62 858 6240 7212</span>
            </li>

            <li className="flex items-center gap-3">
              <Mail size={18} />
              <span>soesweet@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-5 font-semibold">Ikuti Kami</h3>

          <p className="mb-5 text-sm leading-7 text-pink-100">
            Ikuti media sosial SoeSweet untuk mendapatkan
            informasi produk dan promo terbaru.
          </p>

          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-soe-primary"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-[19px] w-[19px]"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-soe-primary"
            >
              <Music2 size={19} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-soe-primary"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[19px] w-[19px]"
              >
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.8v8h3.7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/15 px-6 py-5 text-center text-xs text-pink-200">
        © {new Date().getFullYear()} SoeSweet. All Rights Reserved.
      </div>

    </footer>
  );
}
