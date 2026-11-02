import { Outlet } from "react-router";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Konten halaman */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
