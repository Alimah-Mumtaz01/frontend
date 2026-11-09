import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

import {
  Search,
  Plus,
  Heart,
  X,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  CakeSlice,
  Star,
} from "lucide-react";

import { apiRequest, extractList, getImageUrl } from "../../services/api";

import type { Product, Variant } from "../../types/product";

import { addToCart } from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";
import {
  getVariantImage,
  getVariantThumbnail,
} from "../../utils/variantImage";

import {
  getProductRating,
  type ProductRating,
} from "../../services/reviewService";

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
  const navigate = useNavigate();

  // Mengambil status autentikasi pengguna.
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [productRatings, setProductRatings] = useState<
    Record<number, ProductRating>
  >({});

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("Semua");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notification, setNotification] = useState("");

  // Menyimpan jumlah masing-masing varian yang dipilih.
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, number>
  >({});

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

        const activeProducts = productData.filter(
          (product) => product.status === "aktif"
        );

        setProducts(activeProducts);

        // Mengambil rating masing-masing produk.
        const ratingResults = await Promise.all(
          activeProducts.map(async (product) => {
            try {
              const rating = await getProductRating(
                product.id_product
              );

              return {
                id_product: product.id_product,
                rating,
              };
            } catch (err) {
              console.error(
                `Gagal mengambil rating produk ${product.id_product}:`,
                err
              );

              return {
                id_product: product.id_product,
                rating: null,
              };
            }
          })
        );

        // Menyimpan rating berdasarkan ID produk.
        const ratingMap: Record<number, ProductRating> = {};

        ratingResults.forEach((result) => {
          if (result.rating) {
            ratingMap[result.id_product] = result.rating;
          }
        });

        setProductRatings(ratingMap);

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

  // Total seluruh varian yang sudah dipilih.
  const totalSelectedVariants = Object.values(
    selectedVariants
  ).reduce((total, quantity) => total + quantity, 0);

  // Sisa jumlah kue yang masih harus dipilih.
  const remainingVariants = selectedProduct
    ? selectedProduct.jumlah_isi - totalSelectedVariants
    : 0;

  // Membuka modal pemilihan rasa.
  const handleAddProduct = (product: Product) => {
    // Tunggu sampai pemeriksaan autentikasi selesai.
    if (authLoading) {
      return;
    }

    // Jika belum login, arahkan ke halaman Login.
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: {
            pathname: "/products",
          },
        },
      });

      return;
    }

    // Jika sudah login, periksa ketersediaan varian.
    const availableVariants = variants.filter(
      (variant) => Number(variant.stok) > 0
    );

    if (availableVariants.length === 0) {
      showNotification(
        "Maaf, seluruh stok varian rasa sedang habis."
      );
      return;
    }

    // Buka modal pemilihan varian.
    setSelectedProduct(product);
    setSelectedVariants({});
  };

  // Mengatur jumlah pcs untuk masing-masing varian.
  const handleVariantQuantityChange = (
    variant: Variant,
    change: number
  ) => {
    setSelectedVariants((previous) => {
      const currentQuantity = previous[variant.id_varian] || 0;
      const newQuantity = currentQuantity + change;

      // Jumlah pilihan tidak boleh negatif.
      if (newQuantity < 0) return previous;

      // Jumlah pilihan tidak boleh melebihi stok.
      if (newQuantity > Number(variant.stok)) return previous;

      const currentTotal = Object.values(previous).reduce(
        (total, quantity) => total + quantity,
        0
      );

      const newTotal =
        currentTotal - currentQuantity + newQuantity;

      // Total pilihan tidak boleh melebihi isi paket.
      if (
        !selectedProduct ||
        newTotal > selectedProduct.jumlah_isi
      ) {
        return previous;
      }

      const updated = { ...previous };

      if (newQuantity === 0) {
        delete updated[variant.id_varian];
      } else {
        updated[variant.id_varian] = newQuantity;
      }

      return updated;
    });
  };

  // Menambahkan produk dengan kombinasi varian ke keranjang.
  const confirmAddToCart = () => {
    if (!selectedProduct) return;

    // Pastikan pengguna masih login.
    if (!isAuthenticated) {
      setSelectedProduct(null);
      setSelectedVariants({});

      navigate("/login", {
        state: {
          from: {
            pathname: "/products",
          },
        },
      });

      return;
    }

    // Pastikan jumlah rasa tepat sama dengan isi paket.
    if (
      totalSelectedVariants !== selectedProduct.jumlah_isi
    ) {
      showNotification(
        `Silakan pilih tepat ${selectedProduct.jumlah_isi} pcs varian rasa.`
      );
      return;
    }

    // Bentuk data varian sesuai struktur cartService.
    const selectedVariantItems = variants
      .filter(
        (variant) => (selectedVariants[variant.id_varian] || 0) > 0
      )
      .map((variant) => ({
        id_varian: variant.id_varian,
        nama_varian: variant.nama_varian,
        jumlah: selectedVariants[variant.id_varian],
      }));

    // Validasi stok terakhir sebelum dimasukkan ke keranjang.
    const insufficientStock = selectedVariantItems.find((selected) => {
      const variant = variants.find(
        (item) => item.id_varian === selected.id_varian
      );

      return !variant || selected.jumlah > Number(variant.stok);
    });

    if (insufficientStock) {
      showNotification(
        `Stok ${insufficientStock.nama_varian} tidak mencukupi.`
      );
      return;
    }

    try {
      addToCart({
        id_product: selectedProduct.id_product,
        nama_product: selectedProduct.nama_product,
        harga: Number(selectedProduct.harga),
        jumlah_isi: selectedProduct.jumlah_isi,
        gambar: selectedProduct.gambar,
        quantity: 1,
        variants: selectedVariantItems,
      });

      showNotification(
        `${selectedProduct.nama_product} berhasil ditambahkan ke keranjang.`
      );

      setSelectedProduct(null);
      setSelectedVariants({});
    } catch (err) {
      showNotification(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan produk ke keranjang."
      );
    }
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

                // Tombol aktif jika minimal ada satu varian yang stoknya tersedia.
                const hasAvailableVariant = variants.some(
                  (variant) => Number(variant.stok) > 0
                );

                const image = getProductImage(product.gambar);
                const rating = productRatings[product.id_product];

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

                      {/* RATING PRODUK */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        {rating && rating.jumlah_review > 0 ? (
                          <>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                  key={index}
                                  size={15}
                                  className={
                                    index < Math.round(
                                      Number(rating.rata_rata_rating)
                                    )
                                      ? "fill-[#F5B942] text-[#F5B942]"
                                      : "text-[#E5CBD1]"
                                  }
                                />
                              ))}
                            </div>

                            <span className="text-xs font-bold text-[#590D22]">
                              {Number(rating.rata_rata_rating).toFixed(1)}
                            </span>

                            <span className="text-xs text-[#9B6575]">
                              ({rating.jumlah_review} ulasan)
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-[#B58A96]">
                            Belum ada ulasan
                          </span>
                        )}

                      </div>

                      {product.deskripsi && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#A87987]">
                          {product.deskripsi}
                        </p>
                      )}

                      <Link
                        to={`/products/${product.id_product}`}
                        className="inline-flex items-center justify-center rounded-full border border-[#C9184A] px-5 py-2.5 text-sm font-semibold text-[#C9184A] transition hover:bg-[#C9184A] hover:text-white"
                      >
                        Lihat Detail
                      </Link>

                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-lg font-extrabold text-[#C9184A]">
                          {formatRupiah(Number(product.harga))}
                        </span>

                        <button
                          type="button"
                          disabled={!hasAvailableVariant || authLoading}
                          onClick={() => handleAddProduct(product)}
                          aria-label={`Tambah ${product.nama_product} ke keranjang`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9184A] text-white shadow-md transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          <Plus size={22} />
                        </button>

                      </div>

                      {!hasAvailableVariant && (
                        <p className="mt-2 text-xs text-[#B45365]">
                          Stok seluruh varian rasa sedang habis.
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
                  className="relative overflow-hidden rounded-2xl border border-[#FFE0E6] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={getVariantImage(variant.nama_varian)}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-white/75" />

                  <img
                    src={getVariantThumbnail(variant.nama_varian)}
                    alt={`Varian ${variant.nama_varian}`}
                    className="relative z-10 mb-4 h-14 w-14 rounded-2xl border border-white/80 object-cover shadow-sm"
                  />

                  <h3 className="relative z-10 font-bold">
                    {variant.nama_varian}
                  </h3>

                  <p className="relative z-10 mt-2 text-sm text-[#9B6575]">
                    Stok: {variant.stok} pcs
                  </p>

                  <span
                    className={`relative z-10 mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
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

      {/* MODAL PILIH VARIAN */}
      {selectedProduct && (
        <div className="
          fixed inset-0 z-[100]
          flex items-center justify-center
          overflow-y-auto
          bg-[#390817]/50
          px-4 py-4
          backdrop-blur-sm
        ">

          {/* CONTAINER MODAL */}
          <div className="
            flex w-full max-w-md
            max-h-[calc(100dvh-2rem)]
            flex-col
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-2xl
          ">

            {/* HEADER */}
            <div className="shrink-0 border-b border-[#FFE0E6] px-6 py-5">

              <h2 className="text-xl font-extrabold text-[#590D22]">
                Pilih Varian Rasa
              </h2>

              <p className="mt-1 text-sm text-[#9B6575]">
                Pilih varian rasa untuk {selectedProduct.nama_product}.
              </p>

            </div>

            {/* DAFTAR VARIAN */}
            <div className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-6
              py-4
              space-y-3
            ">

              {variants.map((variant) => {
                const selectedQuantity =
                  selectedVariants[variant.id_varian] || 0;

                const isSelected = selectedQuantity > 0;
                const isOutOfStock = Number(variant.stok) <= 0;

                const cannotAddMore =
                  totalSelectedVariants >= selectedProduct.jumlah_isi ||
                  selectedQuantity >= Number(variant.stok);

                return (
                  <div
                    key={variant.id_varian}
                    className={`relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-[#C9184A]"
                        : "border-[#FFE0E6]"
                    } ${isOutOfStock ? "opacity-60" : ""}`}
                  >
                    <img
                      src={getVariantImage(variant.nama_varian)}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 ${
                        isSelected ? "bg-[#FFF0F3]/75" : "bg-white/75"
                      }`}
                    />

                    {/* INFORMASI VARIAN */}
                    <div className="relative z-10 min-w-0 flex-1">

                      <h3 className="font-bold text-[#590D22]">
                        {variant.nama_varian}
                      </h3>

                      <p className="mt-1 text-sm text-[#9B6575]">
                        Stok {variant.stok} pcs
                      </p>

                      {isSelected && (
                        <p className="mt-1 text-xs font-semibold text-[#C9184A]">
                          Dipilih: {selectedQuantity} pcs
                        </p>
                      )}

                      {isOutOfStock && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          Stok habis
                        </p>
                      )}

                    </div>

                    {/* PENGATUR JUMLAH VARIAN */}
                    <div className="relative z-10 flex shrink-0 items-center gap-2">

                      {/* TOMBOL KURANG */}
                      <button
                        type="button"
                        onClick={() =>
                          handleVariantQuantityChange(variant, -1)
                        }
                        disabled={selectedQuantity === 0}
                        aria-label={`Kurangi ${variant.nama_varian}`}
                        className="
                          flex h-9 w-9 items-center justify-center
                          rounded-full border border-[#FFD6DE]
                          text-lg font-bold text-[#C9184A]
                          transition hover:bg-[#FFE0E6]
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                      >
                        −
                      </button>

                      {/* JUMLAH */}
                      <span className="
                        min-w-6 text-center
                        text-sm font-bold text-[#590D22]
                      ">
                        {selectedQuantity}
                      </span>

                      {/* TOMBOL TAMBAH */}
                      <button
                        type="button"
                        onClick={() =>
                          handleVariantQuantityChange(variant, 1)
                        }
                        disabled={isOutOfStock || cannotAddMore}
                        aria-label={`Tambah ${variant.nama_varian}`}
                        className="
                          flex h-9 w-9 items-center justify-center
                          rounded-full bg-[#C9184A]
                          text-lg font-bold text-white
                          transition hover:bg-[#A4133C]
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                      >
                        +
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* FOOTER */}
            <div className="
              shrink-0
              border-t border-[#FFE0E6]
              bg-white
              px-6 py-5
            ">

              {/* JUMLAH VARIAN YANG DIPILIH */}
              <div className="mb-4 rounded-xl bg-[#FFF0F3] p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-[#590D22]">
                    Jumlah varian dipilih
                  </span>

                  <span className="text-sm font-bold text-[#C9184A]">
                    {totalSelectedVariants} / {selectedProduct.jumlah_isi} pcs
                  </span>

                </div>

                {/* PROGRESS BAR */}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#FFD6DE]">

                  <div
                    className="h-full rounded-full bg-[#C9184A] transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (totalSelectedVariants /
                          selectedProduct.jumlah_isi) * 100,
                        100
                      )}%`,
                    }}
                  />

                </div>

                <p className="mt-2 text-xs text-[#9B6575]">
                  {remainingVariants > 0
                    ? `Silakan pilih ${remainingVariants} pcs lagi.`
                    : "Jumlah varian sudah sesuai dengan isi paket."}
                </p>

              </div>

              {/* HARGA PRODUK */}
              <div className="mb-4 flex items-center justify-between">

                <span className="text-sm text-[#9B6575]">
                  Harga Produk
                </span>

                <span className="text-lg font-extrabold text-[#C9184A]">
                  {formatRupiah(Number(selectedProduct.harga))}
                </span>

              </div>

              {/* TOMBOL TAMBAHKAN */}
              <button
                type="button"
                onClick={confirmAddToCart}
                disabled={
                  totalSelectedVariants !== selectedProduct.jumlah_isi
                }
                className="
                  w-full rounded-xl
                  bg-[#C9184A] px-5 py-3.5
                  font-bold text-white
                  transition hover:bg-[#A4133C]
                  disabled:cursor-not-allowed
                  disabled:bg-gray-300
                  disabled:shadow-none
                "
              >
                Tambahkan ke Keranjang
              </button>

              {/* TOMBOL BATAL */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedVariants({});
                }}
                className="
                  mt-2 w-full rounded-xl
                  border border-[#FFD6DE]
                  px-5 py-3
                  text-sm font-semibold text-[#A4133C]
                  transition hover:bg-[#FFF0F3]
                "
              >
                Batal
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}