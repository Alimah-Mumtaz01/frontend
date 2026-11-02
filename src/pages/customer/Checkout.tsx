
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import type { CartItem } from "../../types/cart";

import {
  getSelectedCartItems,
} from "../../services/cartService";

export default function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getSelectedCartItems());
  }, []);

  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFF8FA] px-5 text-center">

        <ShoppingBag
          size={48}
          className="text-[#C9184A]"
        />

        <h1 className="mt-5 text-2xl font-bold text-[#590D22]">
          Belum Ada Produk untuk Checkout
        </h1>

        <p className="mt-2 text-sm text-[#9B6575]">
          Silakan pilih produk terlebih dahulu dari keranjang.
        </p>

        <button
          onClick={() => navigate("/cart")}
          className="mt-6 rounded-full bg-[#C9184A] px-7 py-3 font-bold text-white"
        >
          Kembali ke Keranjang
        </button>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8FA] px-5 py-12">

      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate("/cart")}
          className="mb-7 flex items-center gap-2 text-sm font-semibold text-[#A4133C]"
        >
          <ArrowLeft size={18} />
          Kembali ke Keranjang
        </button>

        <h1 className="text-3xl font-extrabold text-[#590D22]">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-[#9B6575]">
          Produk yang kamu pilih sudah siap untuk diproses.
        </p>

        <div className="mt-7 rounded-2xl border border-[#FFE0E6] bg-white p-5">

          <h2 className="font-bold">
            Produk Pilihan
          </h2>

          <div className="mt-5 space-y-4">

            {items.map((item, index) => (

              <div
                key={`${item.id_product}-${index}`}
                className="flex items-center justify-between gap-4 border-b border-[#FFE0E6] pb-4 last:border-0"
              >

                <div>
                  <p className="font-semibold">
                    {item.nama_product}
                  </p>

                  <p className="mt-1 text-xs text-[#9B6575]">
                    {item.quantity} paket · {item.jumlah_isi} pcs/paket
                  </p>
                </div>

                <p className="font-bold text-[#C9184A]">
                  Rp{(
                    Number(item.harga) * item.quantity
                  ).toLocaleString("id-ID")}
                </p>

              </div>

            ))}

          </div>

        </div>

        <p className="mt-5 rounded-xl bg-[#FFF0F3] p-4 text-sm leading-6 text-[#86505F]">
          Halaman Checkout lengkap, termasuk pilihan pickup
          atau delivery, alamat pengiriman, catatan, preview
          pesanan, dan konfirmasi pesanan akan dikembangkan
          pada Progress 24.
        </p>

      </div>

    </main>
  );
}
