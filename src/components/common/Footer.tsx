import {
  CakeSlice,
  Camera,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-soe-dark text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-soe-primary">
              <CakeSlice size={25} />
            </div>

            <h2 className="font-serif text-2xl font-bold">
              SoeSweet
            </h2>
          </div>

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
            <li><Link to="/" className="hover:text-white">Beranda</Link></li>
            <li><Link to="/products" className="hover:text-white">Produk</Link></li>
            <li><Link to="/about" className="hover:text-white">Tentang Kami</Link></li>
            <li><Link to="/contact" className="hover:text-white">Kontak</Link></li>
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
              <Camera size={19} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-soe-primary"
            >
              <Globe size={19} />
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
