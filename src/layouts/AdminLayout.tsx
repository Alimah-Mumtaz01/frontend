import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  MessageSquare,
  ChartNoAxesCombined,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserRound,
} from "lucide-react";

import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router";

import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Produk",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Varian",
    path: "/admin/variants",
    icon: Layers,
  },
  {
    label: "Pesanan",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Pelanggan",
    path: "/admin/customers",
    icon: Users,
  },
  {
    label: "Ulasan",
    path: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    label: "Laporan",
    path: "/admin/reports",
    icon: ChartNoAxesCombined,
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFF7F9] text-[#590D22]">

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <button
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#590D22]/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-pink-100 bg-white shadow-sm transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[82px] items-center justify-between border-b border-pink-100 px-6">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <div>
              <img
                src="/images/logo-soesweet.png"
                alt="SoeSweet"
                className="h-20 w-auto max-w-[250px] object-contain"
              />
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-[#800F2F] lg:hidden"
          >
            <X size={23} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF4D6D] to-[#C9184A] text-white shadow-md shadow-pink-200"
                      : "text-[#754052] hover:bg-[#FFF0F3] hover:text-[#C9184A]"
                  }`
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-pink-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#754052] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen lg:pl-[260px]">

        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-pink-100 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-7">

          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
            className="rounded-lg p-2 text-[#590D22] transition hover:bg-pink-50 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-pink-50 sm:gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE0E8] text-[#C9184A]">
                  <UserRound size={22} />
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-28 truncate text-sm font-bold text-[#590D22]">
                    {user?.nama || "Admin"}
                  </p>

                  <p className="text-xs text-gray-400">
                    Administrator
                  </p>
                </div>

                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-52 rounded-xl border border-pink-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-pink-100 px-3 py-2">
                    <p className="truncate text-sm font-bold">
                      {user?.nama}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page */}
        <main className="p-4 sm:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}