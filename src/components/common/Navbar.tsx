import { useState } from "react";
import {
  CakeSlice,
  Search,
  ShoppingCart,
  UserRound,
  Menu,
  X,
} from "lucide-react";

import { Link, NavLink } from "react-router";

const navItems = [
  { label: "Beranda", path: "/" },
  { label: "Produk", path: "/products" },
  { label: "Tentang", path: "/about" },
  { label: "Kontak", path: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-soe-primary"
        : "text-soe-dark hover:text-soe-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soe-primary text-white">
            <CakeSlice size={25} />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-soe-dark">
              SoeSweet
            </h1>

            <p className="text-[10px] tracking-wider text-gray-500">
              SWEET MOMENTS, DELICIOUS BITES
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="Cari produk"
            className="text-soe-dark transition hover:text-soe-primary"
          >
            <Search size={21} />
          </button>

          <Link
            to="/cart"
            aria-label="Keranjang belanja"
            className="relative text-soe-dark transition hover:text-soe-primary"
          >
            <ShoppingCart size={22} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-soe-primary text-[10px] font-bold text-white">
              0
            </span>
          </Link>

          <Link
            to="/login"
            className="rounded-full bg-soe-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-soe-dark"
          >
            Masuk
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Buka menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-soe-dark md:hidden"
        >
          {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-pink-100 bg-white px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="flex gap-5 border-t border-pink-100 pt-4">
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-soe-dark"
              >
                <ShoppingCart size={18} />
                Keranjang
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-soe-dark"
              >
                <UserRound size={18} />
                Masuk
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
