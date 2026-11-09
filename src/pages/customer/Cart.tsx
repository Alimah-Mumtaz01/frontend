import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Heart,
  LoaderCircle,
  PackageCheck,
  ShoppingBasket,
  Check,
  AlertCircle,
} from "lucide-react";

import type { CartItem } from "../../types/cart";
import type { Product } from "../../types/product";

import {
  apiRequest,
  extractList,
  getImageUrl,
} from "../../services/api";

import {
  getCart,
  saveCart,
  getCartSubtotal,
  saveSelectedCartItems,
  validateCartItem,
} from "../../services/cartService";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const getItemKey = (item: CartItem) => {
  const variants = [...item.variants]
    .sort((a, b) => a.id_varian - b.id_varian)
    .map((variant) => `${variant.id_varian}:${variant.jumlah}`)
    .join("|");

  return `${item.id_product}-${variants}`;
};

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedItems, setSelectedItems] =
    useState<string[]>([]);

  const [ready, setReady] = useState(false);

  const [notification, setNotification] = useState("");

  const [showClearConfirmation, setShowClearConfirmation] =
    useState(false);

  // Mengambil data keranjang saat halaman dibuka.
  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      const data = getCart();

      setCart(data);

      // Secara default seluruh produk dipilih.
      setSelectedItems(data.map(getItemKey));

      setReady(true);

      if (data.length === 0) return;

      try {
        const response = await apiRequest<unknown>("/products");
        const products = extractList<Product>(response, "products");
        const productsById = new Map(
          products.map((product) => [product.id_product, product])
        );
        const refreshedCart = data.map((item) => {
          const product = productsById.get(item.id_product);

          return product
            ? { ...item, gambar: product.gambar }
            : item;
        });

        if (isMounted) {
          setCart(refreshedCart);
          saveCart(refreshedCart);
        }
      } catch (error) {
        console.error("Gagal memperbarui foto produk keranjang:", error);
      }
    };

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  // Menyinkronkan perubahan keranjang dari komponen lain.
  useEffect(() => {
    const handleCartUpdate = () => {
      const data = getCart();

      setCart(data);

      setSelectedItems((previous) =>
        previous.filter((key) =>
          data.some((item) => getItemKey(item) === key)
        )
      );
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );
    };
  }, []);

  // Menampilkan notifikasi.
  const showNotification = (message: string) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  // Produk yang sedang dipilih.
  const selectedCart = useMemo(() => {
    return cart.filter((item) =>
      selectedItems.includes(getItemKey(item))
    );
  }, [cart, selectedItems]);

  // Menghitung subtotal produk yang dipilih.
  const subtotal = useMemo(() => {
    return getCartSubtotal(selectedCart);
  }, [selectedCart]);

  const allSelected =
    cart.length > 0 &&
    selectedItems.length === cart.length;

  // Memilih atau membatalkan pilihan seluruh produk.
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(getItemKey));
    }
  };

  // Memilih satu produk.
  const handleSelectItem = (item: CartItem) => {
    const key = getItemKey(item);

    setSelectedItems((previous) =>
      previous.includes(key)
        ? previous.filter((itemKey) => itemKey !== key)
        : [...previous, key]
    );
  };

  // Menyimpan perubahan jumlah paket.
  const handleQuantityChange = (
    item: CartItem,
    change: number
  ) => {
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;

    const updatedCart = cart.map((cartItem) =>
      getItemKey(cartItem) === getItemKey(item)
        ? {
            ...cartItem,
            quantity: newQuantity,
          }
        : cartItem
    );

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Menghapus produk dari keranjang.
  const handleRemoveItem = (item: CartItem) => {
    const updatedCart = cart.filter(
      (cartItem) =>
        getItemKey(cartItem) !== getItemKey(item)
    );

    setCart(updatedCart);

    setSelectedItems((previous) =>
      previous.filter((key) => key !== getItemKey(item))
    );

    saveCart(updatedCart);

    showNotification("Produk berhasil dihapus dari keranjang.");
  };

  // Menghapus seluruh produk.
  const handleClearCart = () => {
    setCart([]);
    setSelectedItems([]);

    saveCart([]);

    setShowClearConfirmation(false);

    showNotification("Keranjang berhasil dikosongkan.");
  };

  // Melanjutkan ke halaman checkout.
  const handleCheckout = () => {
    if (selectedCart.length === 0) {
      showNotification(
        "Pilih minimal satu produk untuk checkout."
      );
      return;
    }

    const invalidItem = selectedCart.find(
      (item) => !validateCartItem(item)
    );

    if (invalidItem) {
      showNotification(
        `Komposisi varian ${invalidItem.nama_product} tidak valid.`
      );
      return;
    }

    // Hanya menyimpan produk yang dipilih.
    saveSelectedCartItems(selectedCart);

    navigate("/checkout");
  };

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle
          size={38}
          className="animate-spin text-[#C9184A]"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8FA] text-[#590D22]">

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-12">

        {/* PAGE HEADING */}
        <section className="relative mb-8 overflow-hidden rounded-2xl">

          <div className="relative z-10 max-w-2xl py-2">

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9184A]">
              Your Sweet Selection
            </span>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Keranjang Belanja
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#86505F] sm:text-base">
              Periksa kembali pesanan kamu sebelum checkout.
            </p>

          </div>

          {/* DECORATION */}
          <div className="pointer-events-none absolute -right-3 -top-12 hidden h-48 w-48 items-center justify-center rounded-full bg-[#FFE0E8] sm:flex">

            <div className="absolute inset-5 rounded-full bg-[#FFCCD5]/70" />

            <ShoppingBag
              size={115}
              strokeWidth={1.4}
              className="relative z-10 text-[#C9184A]/70"
            />

            <Heart
              size={32}
              className="absolute bottom-10 z-20 fill-[#C9184A] text-[#C9184A]"
            />

          </div>

        </section>

        {/* NOTIFICATION */}
        {notification && (
          <div className="fixed right-5 top-24 z-[90] flex max-w-sm items-center gap-3 rounded-xl border border-[#FFCCD5] bg-white px-5 py-4 text-sm font-medium shadow-xl">

            <Check
              size={20}
              className="shrink-0 text-[#C9184A]"
            />

            {notification}

          </div>
        )}

        {/* EMPTY CART */}
        {cart.length === 0 ? (

          <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-[#FFE0E6] bg-white px-5 py-12 text-center shadow-sm">

            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#FFF0F3]">

              <ShoppingBasket
                size={55}
                strokeWidth={1.4}
                className="text-[#C9184A]"
              />

            </div>

            <h2 className="mt-6 text-2xl font-extrabold">
              Keranjang Masih Kosong
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#9B6575]">
              Sepertinya kamu belum menambahkan kue soes
              favoritmu. Yuk, temukan pilihan rasa yang kamu suka!
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-7 flex items-center gap-2 rounded-full bg-[#C9184A] px-7 py-3 font-bold text-white shadow-lg shadow-[#C9184A]/20 transition hover:bg-[#A4133C]"
            >
              <ShoppingCart size={18} />
              Mulai Belanja
            </button>

          </section>

        ) : (

          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.9fr_0.95fr]">

            {/* LEFT: CART ITEMS */}
            <section>

              {/* SELECT ALL */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#FFE0E6] bg-white px-5 py-4 shadow-sm">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 accent-[#C9184A]"
                  />

                  <span className="text-sm font-semibold">
                    Pilih Semua ({cart.length} produk)
                  </span>

                </label>

                <button
                  type="button"
                  onClick={() => setShowClearConfirmation(true)}
                  className="text-xs font-semibold text-[#C9184A] transition hover:text-[#800F2F]"
                >
                  Kosongkan Keranjang
                </button>

              </div>

              {/* CART LIST */}
              <div className="space-y-4">

                {cart.map((item) => {

                  const key = getItemKey(item);

                  const isSelected =
                    selectedItems.includes(key);

                  const image = item.gambar
                    ? getImageUrl(item.gambar)
                    : null;

                  const itemSubtotal =
                    Number(item.harga) * item.quantity;

                  return (
                    <article
                      key={key}
                      className={`relative rounded-2xl border bg-white p-4 shadow-[0_5px_20px_rgba(89,13,34,0.05)] transition sm:p-5 ${
                        isSelected
                          ? "border-[#FFD6DE]"
                          : "border-[#FFE0E6] opacity-75"
                      }`}
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                        {/* CHECKBOX */}
                        <div className="flex shrink-0 items-center">

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectItem(item)}
                            aria-label={`Pilih ${item.nama_product}`}
                            className="h-4 w-4 accent-[#C9184A]"
                          />

                        </div>

                        {/* PRODUCT IMAGE */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FFF0F3] sm:h-28 sm:w-28">

                          {image ? (
                            <img
                              src={image}
                              alt={item.nama_product}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#C9184A]">
                              <ShoppingBag size={30} />
                            </div>
                          )}

                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className="min-w-0 flex-1">

                          <h3 className="font-bold text-[#590D22]">
                            {item.nama_product}
                          </h3>

                          <p className="mt-1 text-sm text-[#9B6575]">
                            {item.jumlah_isi} pcs
                          </p>

                          <div className="mt-2 flex flex-wrap gap-1.5">

                            {item.variants.map((variant) => (
                              <span
                                key={variant.id_varian}
                                className="rounded-full bg-[#FFF0F3] px-2.5 py-1 text-[11px] font-medium text-[#A4133C]"
                              >
                                {variant.nama_varian}: {variant.jumlah} pcs
                              </span>
                            ))}

                          </div>

                          <p className="mt-3 text-base font-extrabold text-[#C9184A] sm:hidden">
                            {formatRupiah(itemSubtotal)}
                          </p>

                        </div>

                        {/* PRICE */}
                        <div className="hidden min-w-[115px] text-right sm:block">

                          <p className="text-base font-extrabold text-[#590D22]">
                            {formatRupiah(itemSubtotal)}
                          </p>

                          {item.quantity > 1 && (
                            <p className="mt-1 text-xs text-[#9B6575]">
                              {formatRupiah(Number(item.harga))} / paket
                            </p>
                          )}

                        </div>

                        {/* QUANTITY AND DELETE */}
                        <div className="flex items-center justify-between gap-3 sm:justify-end">

                          <div className="flex items-center rounded-full border border-[#FFE0E6] bg-[#FFF8FA] p-1">

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(item, -1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Kurangi jumlah"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-[#C9184A] transition hover:bg-[#FFE0E6] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="min-w-8 text-center text-sm font-bold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(item, 1)
                              }
                              aria-label="Tambah jumlah"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-[#C9184A] transition hover:bg-[#FFE0E6]"
                            >
                              <Plus size={17} />
                            </button>

                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item)}
                            aria-label={`Hapus ${item.nama_product}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#C9184A] transition hover:bg-[#FFE5E8]"
                          >
                            <Trash2 size={21} />
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

              {/* CONTINUE SHOPPING */}
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-[#A4133C] transition hover:text-[#C9184A]"
              >
                <ArrowLeft size={17} />
                Lanjut Belanja
              </button>

            </section>

            {/* RIGHT: SUMMARY */}
            <aside className="lg:sticky lg:top-24">

              <div className="rounded-3xl border border-[#FFE0E6] bg-white p-5 shadow-[0_8px_30px_rgba(89,13,34,0.07)] sm:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                    <ShoppingBag size={23} />
                  </div>

                  <div>

                    <h2 className="text-lg font-extrabold">
                      Ringkasan Belanja
                    </h2>

                    <p className="text-xs text-[#9B6575]">
                      {selectedCart.length} produk dipilih
                    </p>

                  </div>

                </div>

                {/* SUBTOTAL */}
                <div className="flex items-center justify-between rounded-xl border border-[#FFE0E6] bg-[#FFFBFC] px-4 py-4">

                  <span className="text-sm text-[#86505F]">
                    Subtotal
                  </span>

                  <span className="text-base font-extrabold text-[#C9184A]">
                    {formatRupiah(subtotal)}
                  </span>

                </div>

                {/* SHIPPING INFORMATION */}
                <p className="mt-4 text-xs leading-5 text-[#9B6575]">
                  Biaya pengiriman akan dihitung pada halaman
                  checkout setelah kamu memilih metode pengiriman.
                </p>

                {/* CHECKOUT BUTTON */}
                <button
                  type="button"
                  disabled={selectedCart.length === 0}
                  onClick={handleCheckout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#C9184A]/20 transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                >
                  <ShoppingBag size={19} />
                  Checkout ({selectedCart.length})
                </button>

                {/* CONTINUE SHOPPING */}
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#FFD6DE] bg-white px-5 py-3.5 text-sm font-bold text-[#A4133C] transition hover:bg-[#FFF0F3]"
                >
                  <ArrowLeft size={17} />
                  Lanjut Belanja
                </button>

                {/* INFORMATION */}
                <div className="mt-6 flex gap-3 rounded-xl bg-[#FFF0F3] p-4">

                  <PackageCheck
                    size={21}
                    className="shrink-0 text-[#C9184A]"
                  />

                  <p className="text-xs leading-5 text-[#86505F]">
                    Pesanan akan diperiksa ketersediaan stoknya
                    sebelum dikonfirmasi oleh admin SoeSweet.
                  </p>

                </div>

              </div>

            </aside>

          </div>

        )}

      </div>

      {/* CLEAR CART CONFIRMATION */}
      {showClearConfirmation && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#390817]/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F3] text-[#C9184A]">
              <AlertCircle size={29} />
            </div>

            <h2 className="mt-4 text-center text-lg font-extrabold">
              Kosongkan Keranjang?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-[#9B6575]">
              Seluruh produk yang ada di keranjang akan dihapus.
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() => setShowClearConfirmation(false)}
                className="flex-1 rounded-full border border-[#FFD6DE] px-4 py-3 text-sm font-bold text-[#A4133C] hover:bg-[#FFF0F3]"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleClearCart}
                className="flex-1 rounded-full bg-[#C9184A] px-4 py-3 text-sm font-bold text-white hover:bg-[#A4133C]"
              >
                Ya, Hapus
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}