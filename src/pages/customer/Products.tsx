
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Heart,
  ShoppingBag,
  X,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  CakeSlice,
} from "lucide-react";

import { apiRequest, extractList, getImageUrl } from "../../services/api";

import type { Product, Variant } from "../../types/product";

import { addToCart } from "../../utils/cart";

type FilterType = "Semua" | "Paket" | "Varian Rasa";

const filters: FilterType[] = [
  "Semua",
  "Paket",
  "Varian Rasa",
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("Semua");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notification, setNotification] = useState("");

  const [selectedVariant, setSelectedVariant] =
    useState<Variant | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  // Mengambil produk dan varian dari backend.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, variantResponse] =
          await Promise.all([
            apiRequest("/products"),
            apiRequest("/varian"),
          ]);

        const productData = extractList<Product>(
          productResponse,
          "products"
        );

        const variantData = extractList<Variant>(
          variantResponse,
          "variants"
        );

        setProducts(
          productData.filter(
            (product) => product.status === "aktif"
          )
        );

        setVariants(
          variantData.filter(
            (variant) => variant.status === "aktif"
          )
        );
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data produk."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mencari produk berdasarkan nama.
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        product.nama_product.toLowerCase().includes(keyword);

      const matchesFilter =
        activeFilter === "Semua" ||
        activeFilter === "Paket";

      const matchesPackage =
        activeFilter !== "Paket" ||
        product.jumlah_isi > 1;

      return (
        matchesSearch &&
        matchesFilter &&
        matchesPackage
      );
    });
  }, [products, search, activeFilter]);

  // Pencarian varian rasa.
  const filteredVariants = useMemo(() => {
    return variants.filter((variant) =>
      variant.nama_varian
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [variants, search]);

  // Menampilkan notifikasi sementara.
  const showNotification = (message: string) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  // Membuka pilihan rasa sebelum menambahkan produk.
  const handleAddProduct = (product: Product) => {
    const availableVariants = variants.filter(
      (variant) => variant.stok >= product.jumlah_isi
    );

    if (availableVariants.length === 0) {
      showNotification(
        "Maaf, stok varian rasa untuk produk ini tidak mencukupi."
      );
      return;
    }

    setSelectedProduct(product);
    setSelectedVariant(availableVariants[0]);
  };

  // Menambahkan produk dan rasa ke keranjang.
  const confirmAddToCart = () => {
    if (!selectedProduct || !selectedVariant) return;

    if (selectedVariant.stok < selectedProduct.jumlah_isi) {
      showNotification("Stok varian tidak mencukupi.");
      return;
    }

    addToCart(selectedProduct, {
      id_varian: selectedVariant.id_varian,
      nama_varian: selectedVariant.nama_varian,
      quantity: selectedProduct.jumlah_isi,
    });

    showNotification(
      `${selectedProduct.nama_product} berhasil ditambahkan ke keranjang.`
    );

    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // Gambar produk dari backend.
  const getProductImage = (gambar: string | null) => {
    return getImageUrl(gambar);
  };

  return (
    <main className="min-h-screen bg-[#FFF8FA] text-[#590D22]">

      {/* HEADER HALAMAN */}
      <section className="px-5 pt-12 pb-8 text-center sm:pt-14">

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9184A]">
          Freshly Baked With Love
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Produk Kami
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#86505F] sm:text-base">
          Kue soes lezat dengan berbagai pilihan rasa
          dan paket untuk menemani hari istimewamu.
        </p>

      </section>

      {/* PENCARIAN DAN FILTER */}
      <section className="mx-auto mb-9 flex max-w-6xl flex-col items-center gap-5 px-5">

        {/* SEARCH */}
        <div className="relative w-full max-w-md">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9184A]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk atau varian rasa..."
            className="w-full rounded-full border border-[#FFCCD5] bg-white py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[#C9184A] focus:ring-2 focus:ring-[#FFCCD5]"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4133C]"
              aria-label="Hapus pencarian"
            >
              <X size={17} />
            </button>
          )}

        </div>

        {/* FILTER BUTTON */}
        <div className="flex flex-wrap justify-center gap-3">

          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-7 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-[#C9184A] text-white shadow-lg shadow-[#C9184A]/20"
                  : "border border-[#FFD6DE] bg-white text-[#590D22] hover:border-[#C9184A] hover:text-[#C9184A]"
              }`}
            >
              {filter}
            </button>
          ))}

        </div>

      </section>

      {/* NOTIFIKASI */}
      {notification && (
        <div className="fixed right-5 top-24 z-[80] flex max-w-sm items-center gap-3 rounded-xl border border-[#FFCCD5] bg-white px-5 py-4 text-sm font-medium text-[#590D22] shadow-xl">

          <CheckCircle2
            size={20}
            className="shrink-0 text-[#C9184A]"
          />

          {notification}

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24">

          <LoaderCircle
            size={38}
            className="animate-spin text-[#C9184A]"
          />

          <p className="mt-4 text-sm text-[#86505F]">
            Sedang memuat produk SoeSweet...
          </p>

        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center">

          <AlertCircle
            size={42}
            className="text-[#C9184A]"
          />

          <h2 className="mt-4 text-lg font-bold">
            Gagal Memuat Produk
          </h2>

          <p className="mt-2 text-sm text-[#86505F]">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-full bg-[#C9184A] px-6 py-2.5 text-sm font-semibold text-white"
          >
            Coba Lagi
          </button>

        </div>
      )}

      {/* DAFTAR PRODUK */}
      {!loading && !error && activeFilter !== "Varian Rasa" && (

        <section className="mx-auto max-w-6xl px-5 pb-12">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                {activeFilter === "Paket"
                  ? "Pilihan Paket"
                  : "Semua Produk"}
              </h2>

              <p className="mt-1 text-sm text-[#9B6575]">
                {filteredProducts.length} produk tersedia
              </p>
            </div>

          </div>

          {filteredProducts.length === 0 ? (

            <div className="rounded-2xl border border-[#FFE0E6] bg-white px-5 py-16 text-center">

              <CakeSlice
                size={45}
                className="mx-auto text-[#FF8FA3]"
              />

              <h3 className="mt-4 font-bold">
                Produk tidak ditemukan
              </h3>

              <p className="mt-2 text-sm text-[#9B6575]">
                Coba gunakan kata kunci pencarian yang berbeda.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map((product, index) => {

                const originalVariant = variants.find(
                  (variant) =>
                    variant.nama_varian.toLowerCase() === "original" &&
                    variant.stok >= product.jumlah_isi
                );

                const image = getProductImage(product.gambar);

                return (
                  <article
                    key={product.id_product}
                    className="group relative overflow-hidden rounded-2xl border border-[#FFE0E6] bg-white shadow-[0_5px_20px_rgba(89,13,34,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(89,13,34,0.13)]"
                  >

                    {/* IMAGE */}
                    <div className="relative h-52 overflow-hidden bg-[#FFE8ED]">

                      <img
                        src={image}
                        alt={product.nama_product}
                        loading={index < 3 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                      <button
                        type="button"
                        aria-label="Produk favorit"
                        className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#C9184A] shadow-sm transition hover:bg-[#C9184A] hover:text-white"
                      >
                        <Heart size={18} />
                      </button>

                      {product.jumlah_isi === 1 && (
                        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#C9184A]">
                          Satuan
                        </span>
                      )}

                    </div>

                    {/* PRODUCT INFORMATION */}
                    <div className="p-4">

                      <h3 className="text-base font-bold text-[#590D22]">
                        {product.nama_product}
                      </h3>

                      <p className="mt-1 text-sm text-[#9B6575]">
                        {product.jumlah_isi} pcs
                      </p>

                      {product.deskripsi && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#A87987]">
                          {product.deskripsi}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-lg font-extrabold text-[#C9184A]">
                          {formatRupiah(Number(product.harga))}
                        </span>

                        <button
                          type="button"
                          disabled={!originalVariant}
                          onClick={() => handleAddProduct(product)}
                          aria-label={`Tambah ${product.nama_product} ke keranjang`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9184A] text-white shadow-md transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          <Plus size={22} />
                        </button>

                      </div>

                      {!originalVariant && (
                        <p className="mt-2 text-xs text-[#B45365]">
                          Varian Original sedang tidak tersedia.
                        </p>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

      )}

      {/* DAFTAR VARIAN RASA */}
      {!loading && !error && activeFilter === "Varian Rasa" && (

        <section className="mx-auto max-w-6xl px-5 pb-12">

          <div className="mb-6">

            <h2 className="text-xl font-bold">
              Pilihan Varian Rasa
            </h2>

            <p className="mt-1 text-sm text-[#9B6575]">
              Pilih rasa favoritmu dari berbagai varian SoeSweet.
            </p>

          </div>

          {filteredVariants.length === 0 ? (

            <div className="rounded-2xl border border-[#FFE0E6] bg-white py-16 text-center">

              <CakeSlice
                size={40}
                className="mx-auto text-[#FF8FA3]"
              />

              <p className="mt-4 font-semibold">
                Varian rasa tidak ditemukan.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {filteredVariants.map((variant) => (

                <article
                  key={variant.id_varian}
                  className="rounded-2xl border border-[#FFE0E6] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3] text-[#C9184A]">
                    <CakeSlice size={28} />
                  </div>

                  <h3 className="font-bold">
                    {variant.nama_varian}
                  </h3>

                  <p className="mt-2 text-sm text-[#9B6575]">
                    Stok: {variant.stok} pcs
                  </p>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      variant.stok > 0
                        ? "bg-[#E9F8EE] text-[#25834B]"
                        : "bg-[#FFE5E8] text-[#C9184A]"
                    }`}
                  >
                    {variant.stok > 0 ? "Tersedia" : "Habis"}
                  </span>

                </article>

              ))}

            </div>

          )}

        </section>

      )}

      {/* PROMOTION BANNER */}
      {!loading && !error && activeFilter !== "Varian Rasa" && (
        <section className="mx-auto max-w-6xl px-5 pb-16">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFB3C1] via-[#FFCCD5] to-[#FFF0F3] px-7 py-10 sm:px-12 sm:py-14">

            <Heart
              size={30}
              className="absolute right-8 top-8 rotate-12 text-[#C9184A]/50"
            />

            <div className="relative z-10 max-w-lg">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A4133C]">
                Sweet Moments
              </span>

              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#590D22] sm:text-4xl">
                Cemilan Manis
                <br />
                untuk Segala Suasana
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#86505F]">
                Nikmati kelembutan kue soes dengan
                berbagai pilihan rasa favoritmu.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("Semua");
                  setSearch("");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="mt-6 rounded-full bg-[#C9184A] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#A4133C]"
              >
                Belanja Sekarang
              </button>

            </div>

            <div className="pointer-events-none absolute -bottom-12 -right-10 h-56 w-56 rounded-full bg-white/30 blur-2xl" />

          </div>

        </section>
      )}

      {/* VARIANT SELECTION MODAL */}
      {selectedProduct && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#390817]/50 px-4 backdrop-blur-sm"
          onClick={() => {
            setSelectedProduct(null);
            setSelectedVariant(null);
          }}
        >

          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Pilih Varian Rasa
              </h2>

              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedVariant(null);
                }}
                aria-label="Tutup"
                className="rounded-full p-2 text-[#A4133C] hover:bg-[#FFF0F3]"
              >
                <X size={20} />
              </button>

            </div>

            <p className="mt-2 text-sm text-[#9B6575]">
              {selectedProduct.nama_product} ·{" "}
              {selectedProduct.jumlah_isi} pcs
            </p>

            <div className="mt-5 space-y-3">

              {variants.map((variant) => {

                const isAvailable =
                  variant.stok >= selectedProduct.jumlah_isi;

                return (
                  <button
                    key={variant.id_varian}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                      selectedVariant?.id_varian === variant.id_varian
                        ? "border-[#C9184A] bg-[#FFF0F3]"
                        : "border-[#FFE0E6] hover:border-[#FF8FA3]"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >

                    <div>

                      <p className="font-semibold">
                        {variant.nama_varian}
                      </p>

                      <p className="mt-1 text-xs text-[#9B6575]">
                        Stok {variant.stok} pcs
                      </p>

                    </div>

                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        selectedVariant?.id_varian === variant.id_varian
                          ? "border-[#C9184A] bg-[#C9184A] ring-2 ring-[#FFCCD5]"
                          : "border-[#FFB3C1]"
                      }`}
                    />

                  </button>
                );
              })}

            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#FFE0E6] pt-5">

              <div>
                <p className="text-xs text-[#9B6575]">
                  Total harga
                </p>

                <p className="text-lg font-extrabold text-[#C9184A]">
                  {formatRupiah(Number(selectedProduct.harga))}
                </p>
              </div>

              <button
                disabled={!selectedVariant}
                onClick={confirmAddToCart}
                className="rounded-full bg-[#C9184A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Tambahkan
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}
