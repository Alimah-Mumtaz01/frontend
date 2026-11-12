import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getImageUrl } from "../../services/api";
import heroImage from "../../assets/images/background/hero-soes.png";

import {
  ArrowLeft,
  ShoppingBag,
  Package,
  Truck,
  Store,
  MapPin,
  FileText,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

import type { CartItem } from "../../types/cart";

import {
  getSelectedCartItems,
  removeSelectedCartItems,
  validateCartItem,
} from "../../services/cartService";

import {
  previewCheckout,
  mapCartToCheckoutItems,
  type CheckoutPreview,
  type CheckoutRequest,
  type ShippingType,
} from "../../services/checkoutService";

import {
  createOrder,
  type CreatedOrder,
} from "../../services/orderService";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);

  const [shippingType, setShippingType] =
    useState<ShippingType>("pickup");

  const [address, setAddress] = useState("");

  const [note, setNote] = useState("");

  const [preview, setPreview] =
    useState<CheckoutPreview | null>(null);

  const [isLoadingItems, setIsLoadingItems] = useState(true);

  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const [successOrder, setSuccessOrder] =
    useState<CreatedOrder | null>(null);

  useEffect(() => {
    const selectedItems = getSelectedCartItems();

    setItems(selectedItems);
    setIsLoadingItems(false);
  }, []);

  const invalidItem = items.find(
    (item) => !validateCartItem(item)
  );

  const isCartValid =
    items.length > 0 && !invalidItem;

  const buildCheckoutPayload = (): CheckoutRequest => {
    return {
      tipe_pengiriman: shippingType,

      alamat_pengiriman:
        shippingType === "delivery"
          ? address.trim()
          : null,

      catatan: note.trim() || null,

      items: mapCartToCheckoutItems(items),
    };
  };

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      if (!isCartValid) {
        setPreview(null);
        return;
      }

      if (
        shippingType === "delivery" &&
        !address.trim()
      ) {
        setPreview(null);
        setErrorMessage("");
        return;
      }

      setIsPreviewLoading(true);
      setErrorMessage("");
      setPreview(null);

      try {
        const result = await previewCheckout(
          buildCheckoutPayload()
        );

        if (!cancelled) {
          setPreview(result);
        }
      } catch (error) {
        if (!cancelled) {
          setPreview(null);

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Gagal memproses preview checkout."
          );
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [items, shippingType, address, note, isCartValid]);

  const handleShippingChange = (
    type: ShippingType
  ) => {
    setShippingType(type);
    setErrorMessage("");
  };

  const handleConfirmOrder = async () => {
    if (!preview || !isCartValid) {
      return;
    }

    if (
      shippingType === "delivery" &&
      !address.trim()
    ) {
      setErrorMessage(
        "Silakan masukkan alamat pengiriman terlebih dahulu."
      );
      setShowConfirmation(false);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = buildCheckoutPayload();

      // Membuat pesanan melalui backend.
      const result = await createOrder(payload);

      // Menghapus hanya produk yang berhasil dipesan.
      removeSelectedCartItems(items);

      setSuccessOrder(result);

      setShowConfirmation(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat pesanan."
      );

      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingItems) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFF8FA]">

        <LoaderCircle
          size={38}
          className="animate-spin text-[#C9184A]"
        />

      </main>
    );
  }

  if (items.length === 0 && !successOrder) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFF8FA] px-5 text-center">

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF0F3]">

          <ShoppingBag
            size={45}
            className="text-[#C9184A]"
          />

        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-[#590D22]">
          Belum Ada Produk untuk Checkout
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#9B6575]">
          Silakan pilih produk terlebih dahulu dari
          keranjang belanja kamu.
        </p>

        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mt-6 flex items-center gap-2 rounded-full bg-[#C9184A] px-7 py-3 font-bold text-white transition hover:bg-[#A4133C]"
        >
          <ArrowLeft size={18} />
          Kembali ke Keranjang
        </button>

      </main>
    );
  }

  if (successOrder) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF8FA] px-5 py-12">

        <section className="w-full max-w-lg rounded-3xl border border-[#FFE0E6] bg-white p-7 text-center shadow-lg sm:p-10">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF0F3]">

            <CheckCircle2
              size={54}
              className="text-[#C9184A]"
            />

          </div>

          <span className="mt-6 inline-block rounded-full bg-[#FFF0F3] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#C9184A]">
            Pesanan Berhasil
          </span>

          <h1 className="mt-4 text-2xl font-extrabold text-[#590D22] sm:text-3xl">
            Terima Kasih!
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9B6575]">
            Pesanan kamu berhasil dibuat dan sedang menunggu
            konfirmasi dari admin SoeSweet.
          </p>

          <div className="mt-7 rounded-2xl border border-[#FFE0E6] bg-[#FFFBFC] p-5 text-left">

            <div className="flex items-center justify-between gap-3">

              <span className="text-sm text-[#9B6575]">
                Nomor Pesanan
              </span>

              <span className="font-extrabold text-[#C9184A]">
                {successOrder.id_order
                  ? `#${successOrder.id_order}`
                  : "Berhasil dibuat"}
              </span>

            </div>

            <div className="my-4 border-t border-dashed border-[#FFD6DE]" />

            <div className="flex items-center justify-between gap-3">

              <span className="text-sm text-[#9B6575]">
                Status Pesanan
              </span>

              <span className="rounded-full bg-[#FFF0F3] px-3 py-1 text-xs font-bold text-[#C9184A]">
                {successOrder.status_pesanan ||
                  "menunggu_konfirmasi"}
              </span>

            </div>

            {successOrder.total_harga !== undefined && (
              <div className="mt-4 flex items-center justify-between gap-3">

                <span className="text-sm text-[#9B6575]">
                  Total Pembayaran
                </span>

                <span className="font-extrabold text-[#590D22]">
                  {formatRupiah(Number(successOrder.total_harga))}
                </span>

              </div>
            )}

            {successOrder.orderItems && successOrder.orderItems.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-dashed border-[#FFD6DE] pt-4">
                {successOrder.orderItems.map((item) => (
                  <div
                    key={item.id_order_item}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={
                        item.product?.gambar
                          ? getImageUrl(item.product.gambar)
                          : heroImage
                      }
                      alt={item.product?.nama_product || "Produk pesanan"}
                      className="h-14 w-14 shrink-0 rounded-lg border border-pink-100 object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = heroImage;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#590D22]">
                        {item.product?.nama_product || `Produk #${item.id_product}`}
                      </p>
                      <p className="text-xs text-[#9B6575]">
                        {item.quantity} paket
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#FFF0F3] p-4 text-left">

            <ShieldCheck
              size={21}
              className="shrink-0 text-[#C9184A]"
            />

            <p className="text-xs leading-5 text-[#86505F]">
              Silakan tunggu konfirmasi admin sebelum
              melanjutkan proses pembayaran.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("/my-orders")}
            className="mt-7 w-full rounded-xl bg-[#C9184A] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#A4133C]"
          >
            Lihat Pesanan Saya
          </button>

        </section>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8FA] text-[#590D22]">

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-12">

        {/* PAGE HEADING */}

        <section className="mb-8">

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#A4133C] transition hover:text-[#C9184A]"
          >
            <ArrowLeft size={18} />
            Kembali ke Keranjang
          </button>

          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#C9184A]">
            Complete Your Order
          </span>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#9B6575] sm:text-base">
            Lengkapi informasi pesanan kamu sebelum
            melakukan konfirmasi.
          </p>

        </section>

        {/* ERROR NOTIFICATION */}

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="leading-6">
              {errorMessage}
            </p>

          </div>
        )}

        {/* INVALID CART */}

        {!isCartValid && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {invalidItem
              ? `Komposisi varian produk ${invalidItem.nama_product} tidak valid. Silakan kembali ke keranjang.`
              : "Tidak ada produk valid untuk checkout."}

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="ml-2 font-bold underline"
            >
              Kembali
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.7fr_0.95fr]">

          <div className="space-y-6">

            {/* PRODUCT LIST */}

            <section className="rounded-3xl border border-[#FFE0E6] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                  <Package size={23} />
                </div>

                <div>

                  <h2 className="text-lg font-extrabold">
                    Produk Pesanan
                  </h2>

                  <p className="text-xs text-[#9B6575]">
                    {items.length} jenis produk dipilih
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                {items.map((item, index) => (

                  <article
                    key={`${item.id_product}-${index}`}
                    className="border-b border-[#FFE0E6] pb-5 last:border-0 last:pb-0"
                  >

                    <div className="flex items-start gap-4">
                      <img
                        src={
                          preview?.items[index]?.product.gambar || item.gambar
                            ? getImageUrl(
                                preview?.items[index]?.product.gambar || item.gambar
                              )
                            : heroImage
                        }
                        alt={item.nama_product}
                        className="h-16 w-16 shrink-0 rounded-xl border border-pink-100 object-cover sm:h-20 sm:w-20"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = heroImage;
                        }}
                      />

                      <div className="min-w-0 flex-1">

                        <h3 className="font-bold text-[#590D22]">
                          {item.nama_product}
                        </h3>

                        <p className="mt-1 text-xs text-[#9B6575]">
                          {item.quantity} paket · {item.jumlah_isi} pcs/paket
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                          {item.variants.map((variant) => (

                            <span
                              key={variant.id_varian}
                              className="rounded-full bg-[#FFF0F3] px-3 py-1.5 text-[11px] font-medium text-[#A4133C]"
                            >
                              {variant.nama_varian}: {variant.jumlah * item.quantity} pcs
                            </span>

                          ))}

                        </div>

                      </div>

                      <div className="shrink-0 text-right">

                        <p className="text-sm font-extrabold text-[#C9184A]">
                          {formatRupiah(
                            Number(item.harga) * item.quantity
                          )}
                        </p>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            </section>

            {/* SHIPPING METHOD */}

            <section className="rounded-3xl border border-[#FFE0E6] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                  <Truck size={23} />
                </div>

                <div>

                  <h2 className="text-lg font-extrabold">
                    Metode Pengiriman
                  </h2>

                  <p className="text-xs text-[#9B6575]">
                    Pilih cara menerima pesanan
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* PICKUP */}

                <button
                  type="button"
                  onClick={() => handleShippingChange("pickup")}
                  className={`relative rounded-2xl border p-5 text-left transition ${
                    shippingType === "pickup"
                      ? "border-[#C9184A] bg-[#FFF0F3] ring-1 ring-[#C9184A]"
                      : "border-[#FFE0E6] bg-white hover:bg-[#FFFBFC]"
                  }`}
                >

                  {shippingType === "pickup" && (
                    <CheckCircle2
                      size={20}
                      className="absolute right-4 top-4 text-[#C9184A]"
                    />
                  )}

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#C9184A] shadow-sm">

                    <Store size={25} />

                  </div>

                  <h3 className="mt-4 font-extrabold">
                    Pickup
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#9B6575]">
                    Ambil pesanan secara langsung.
                  </p>

                  <p className="mt-3 text-sm font-extrabold text-[#C9184A]">
                    Gratis Ongkir
                  </p>

                </button>

                {/* DELIVERY */}

                <button
                  type="button"
                  onClick={() => handleShippingChange("delivery")}
                  className={`relative rounded-2xl border p-5 text-left transition ${
                    shippingType === "delivery"
                      ? "border-[#C9184A] bg-[#FFF0F3] ring-1 ring-[#C9184A]"
                      : "border-[#FFE0E6] bg-white hover:bg-[#FFFBFC]"
                  }`}
                >

                  {shippingType === "delivery" && (
                    <CheckCircle2
                      size={20}
                      className="absolute right-4 top-4 text-[#C9184A]"
                    />
                  )}

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#C9184A] shadow-sm">

                    <Truck size={25} />

                  </div>

                  <h3 className="mt-4 font-extrabold">
                    Delivery
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#9B6575]">
                    Pesanan diantarkan ke alamat kamu.
                  </p>

                  <p className="mt-3 text-sm font-extrabold text-[#C9184A]">
                    Ongkir sesuai ketentuan
                  </p>

                </button>

              </div>

              {/* DELIVERY ADDRESS */}

              {shippingType === "delivery" && (

                <div className="mt-6">

                  <label
                    htmlFor="alamat_pengiriman"
                    className="mb-2 flex items-center gap-2 text-sm font-bold"
                  >

                    <MapPin
                      size={18}
                      className="text-[#C9184A]"
                    />

                    Alamat Pengiriman

                  </label>

                  <textarea
                    id="alamat_pengiriman"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="Masukkan alamat lengkap, nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, dan patokan..."
                    rows={4}
                    maxLength={500}
                    className="w-full resize-y rounded-xl border border-[#FFD6DE] bg-[#FFFBFC] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#C49BA6] focus:border-[#C9184A] focus:ring-2 focus:ring-[#C9184A]/10"
                  />

                  <div className="mt-2 flex items-center justify-between gap-3">

                    <p className="text-xs text-[#9B6575]">
                      Pastikan alamat sudah benar dan lengkap.
                    </p>

                    <span className="shrink-0 text-xs text-[#9B6575]">
                      {address.length}/500
                    </span>

                  </div>

                  <div className="mt-4 rounded-xl bg-[#FFF0F3] p-4">

                    <p className="text-xs leading-6 text-[#86505F]">
                      <strong>Ketentuan Delivery:</strong>
                      {" "}Minimal pembelian Rp50.000.
                      Biaya pengiriman dihitung berdasarkan
                      konfigurasi ongkir backend SoeSweet.
                    </p>

                  </div>

                </div>

              )}

            </section>

            {/* ORDER NOTE */}

            <section className="rounded-3xl border border-[#FFE0E6] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                  <FileText size={23} />
                </div>

                <div>

                  <h2 className="text-lg font-extrabold">
                    Catatan Pesanan
                  </h2>

                  <p className="text-xs text-[#9B6575]">
                    Tambahkan informasi jika diperlukan
                  </p>

                </div>

              </div>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="Contoh: Pesanan akan diambil besok pukul 10.00..."
                rows={3}
                maxLength={500}
                className="w-full resize-y rounded-xl border border-[#FFD6DE] bg-[#FFFBFC] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#C49BA6] focus:border-[#C9184A] focus:ring-2 focus:ring-[#C9184A]/10"
              />

              <p className="mt-2 text-right text-xs text-[#9B6575]">
                {note.length}/500
              </p>

            </section>

          </div>


          <aside className="lg:sticky lg:top-24">

            <section className="rounded-3xl border border-[#FFE0E6] bg-white p-5 shadow-[0_8px_30px_rgba(89,13,34,0.06)] sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#C9184A]">
                  <Receipt size={23} />
                </div>

                <div>

                  <h2 className="text-lg font-extrabold">
                    Ringkasan Pesanan
                  </h2>

                  <p className="text-xs text-[#9B6575]">
                    Detail pembayaran kamu
                  </p>

                </div>

              </div>

              {/* PRODUCT SUMMARY */}

              <div className="space-y-3">

                {items.map((item, index) => (

                  <div
                    key={`${item.id_product}-${index}`}
                    className="flex justify-between gap-3 text-sm"
                  >

                    <span className="min-w-0 text-[#86505F]">
                      {item.nama_product} × {item.quantity}
                    </span>

                    <span className="shrink-0 font-semibold">
                      {formatRupiah(
                        Number(item.harga) * item.quantity
                      )}
                    </span>

                  </div>

                ))}

              </div>

              <div className="my-5 border-t border-dashed border-[#FFD6DE]" />

              {/* SUBTOTAL */}

              <div className="flex justify-between gap-3 text-sm">

                <span className="text-[#86505F]">
                  Subtotal
                </span>

                <span className="font-bold">
                  {preview
                    ? formatRupiah(Number(preview.subtotal))
                    : "—"}
                </span>

              </div>

              {/* SHIPPING COST */}

              <div className="mt-4 flex justify-between gap-3 text-sm">

                <span className="text-[#86505F]">
                  Biaya Pengiriman
                </span>

                <span className="font-bold text-[#C9184A]">
                  {preview
                    ? formatRupiah(Number(preview.ongkir))
                    : shippingType === "pickup"
                      ? formatRupiah(0)
                      : "—"}
                </span>

              </div>

              <div className="my-5 border-t border-dashed border-[#FFD6DE]" />

              {/* TOTAL */}

              <div className="flex items-center justify-between gap-3">

                <span className="font-extrabold">
                  Total Pembayaran
                </span>

                <span className="text-xl font-extrabold text-[#C9184A]">

                  {preview
                    ? formatRupiah(Number(preview.total_harga))
                    : "—"}

                </span>

              </div>

              {/* PREVIEW LOADING */}

              {isPreviewLoading && (

                <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#FFF0F3] p-4">

                  <LoaderCircle
                    size={19}
                    className="animate-spin text-[#C9184A]"
                  />

                  <p className="text-xs font-medium text-[#86505F]">
                    Memeriksa pesanan dan menghitung total...
                  </p>

                </div>

              )}

              {/* PREVIEW STATUS */}

              {!isPreviewLoading && preview && (

                <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#FFF0F3] p-4">

                  <ClipboardCheck
                    size={20}
                    className="shrink-0 text-[#C9184A]"
                  />

                  <p className="text-xs leading-5 text-[#86505F]">
                    Pesanan berhasil divalidasi dan siap
                    dikonfirmasi.
                  </p>

                </div>

              )}

              {/* PREVIEW NOT READY */}

              {!isPreviewLoading && !preview && (
                <div className="mt-5 rounded-xl border border-[#FFE0E6] bg-[#FFFBFC] p-4">

                  <p className="text-xs leading-5 text-[#9B6575]">
                    {shippingType === "delivery" && !address.trim()
                      ? "Masukkan alamat pengiriman untuk menghitung total pesanan."
                      : "Menunggu hasil validasi checkout dari server."}
                  </p>

                </div>
              )}

              {/* CONFIRM BUTTON */}

              <button
                type="button"
                disabled={
                  !preview ||
                  !isCartValid ||
                  isPreviewLoading ||
                  isSubmitting
                }
                onClick={() => setShowConfirmation(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9184A] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#C9184A]/20 transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >

                <ShoppingBag size={19} />

                Konfirmasi Pesanan

              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#9B6575]">
                Pastikan seluruh informasi pesanan sudah benar
                sebelum melakukan konfirmasi.
              </p>

              {/* SECURITY INFORMATION */}

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#FFF0F3] p-4">

                <ShieldCheck
                  size={21}
                  className="shrink-0 text-[#C9184A]"
                />

                <p className="text-xs leading-5 text-[#86505F]">
                  Data harga dan stok akan diperiksa kembali
                  oleh backend sebelum pesanan disimpan.
                </p>

              </div>

            </section>

          </aside>

        </div>

      </div>


      {showConfirmation && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#390817]/55 px-4 py-6 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F3]">

              <ShoppingBag
                size={30}
                className="text-[#C9184A]"
              />

            </div>

            <h2 className="mt-5 text-center text-xl font-extrabold text-[#590D22]">
              Konfirmasi Pesanan?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-[#9B6575]">
              Apakah kamu yakin ingin membuat pesanan
              ini? Pastikan seluruh informasi sudah benar.
            </p>

            <div className="mt-6 rounded-xl bg-[#FFF8FA] p-4">

              <div className="flex justify-between gap-3 text-sm">

                <span className="text-[#9B6575]">
                  Metode Pengiriman
                </span>

                <span className="font-bold text-[#590D22]">
                  {shippingType === "pickup"
                    ? "Pickup"
                    : "Delivery"}
                </span>

              </div>

              <div className="mt-3 flex justify-between gap-3 text-sm">

                <span className="text-[#9B6575]">
                  Total Pembayaran
                </span>

                <span className="font-extrabold text-[#C9184A]">
                  {formatRupiah(
                    Number(preview?.total_harga || 0)
                  )}
                </span>

              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-full border border-[#FFD6DE] px-4 py-3 text-sm font-bold text-[#A4133C] transition hover:bg-[#FFF0F3] disabled:opacity-50"
              >
                Periksa Lagi
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmOrder}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#C9184A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Memproses
                  </>
                ) : (
                  "Ya, Pesan"
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}