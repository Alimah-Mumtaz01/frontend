import { useEffect, useState } from "react";
import {
  ShoppingCart,
  UserRound,
  Menu,
  X,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router";
import { getCartCount } from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Beranda", path: "/" },
  { label: "Produk", path: "/products" },
  { label: "Tentang", path: "/about" },
  { label: "Kontak", path: "/contact" },
  {
    label: "Ulasan",
    path: "/reviews",
  }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [isAuthenticated, user?.id_user]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative w-fit border-l-2 pl-2 text-sm transition-colors md:border-l-0 md:pl-0 md:pb-1 md:after:absolute md:after:bottom-0 md:after:left-0 md:after:h-0.5 md:after:w-full md:after:origin-left md:after:bg-soe-primary md:after:transition-transform md:after:content-[''] ${
      isActive
        ? "border-soe-primary font-bold text-soe-primary md:after:scale-x-100"
        : "border-transparent font-medium text-soe-dark hover:text-soe-primary md:after:scale-x-0"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div>
            <img
              src="/images/logo-soesweet.png"
              alt="SoeSweet"
              className="h-20 w-auto max-w-[250px] object-contain"
            />
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
          {/* Keranjang */}
          <Link
            to="/cart"
            aria-label="Keranjang belanja"
            className="relative text-soe-dark transition hover:text-soe-primary"
          >
            <ShoppingCart size={22} />

            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-soe-primary text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </Link>

          {/* Status Login */}
          {!isLoading && (
            isAuthenticated && user ? (
              <div className="flex items-center gap-3">

                {/* Pesanan Saya */}
                <NavLink
                  to="/my-orders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-pink-100 text-soe-primary"
                        : "text-soe-dark hover:bg-pink-50 hover:text-soe-primary"
                    }`
                  }
                >
                  <ClipboardList size={18} />
                  Pesanan Saya
                </NavLink>

                {/* Informasi Customer */}
                <div className="flex items-center gap-2 text-soe-dark">
                  <UserRound size={19} className="text-soe-primary" />

                  <span className="max-w-28 truncate text-sm font-semibold">
                    {user.nama}
                  </span>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-pink-200 px-4 py-2 text-sm font-semibold text-soe-primary transition hover:bg-pink-50"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-soe-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-soe-dark"
              >
                Masuk
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
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

            {/* Menu Navigasi */}
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

            <div className="flex flex-wrap items-center gap-5 border-t border-pink-100 pt-4">

              {/* Keranjang Mobile */}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-soe-dark"
              >
                <ShoppingCart size={18} />
                Keranjang ({cartCount})
              </Link>

              {/* Status Login Mobile */}
              {!isLoading && (
                isAuthenticated && user ? (
                  <>
                    {/* Pesanan Saya Mobile */}
                    <NavLink
                      to="/my-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 text-sm font-semibold transition ${
                          isActive
                            ? "text-soe-primary"
                            : "text-soe-dark hover:text-soe-primary"
                        }`
                      }
                    >
                      <ClipboardList size={18} />
                      Pesanan Saya
                    </NavLink>

                    {/* Informasi Customer */}
                    <div className="flex items-center gap-2 text-sm font-medium text-soe-dark">
                      <UserRound size={18} className="text-soe-primary" />

                      <span>{user.nama}</span>
                    </div>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm text-soe-primary"
                    >
                      <LogOut size={18} />
                      Keluar
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-soe-dark"
                  >
                    <UserRound size={18} />
                    Masuk
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
