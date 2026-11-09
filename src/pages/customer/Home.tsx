import { useEffect, useState } from "react";

import {
  ArrowRight,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Award,
  CakeSlice,
  Plus,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router";
import heroImage from "../../assets/images/background/hero-soes.png";

import {
  apiRequest,
  extractList,
  getImageUrl,
} from "../../services/api";

import type {
  Product,
  Variant,
} from "../../types/product";
import { getVariantThumbnail } from "../../utils/variantImage";

/* =========================================
   API ENDPOINT
========================================= */

const PRODUCTS_ENDPOINT =
  import.meta.env.VITE_PRODUCTS_ENDPOINT || "/products";

const VARIANTS_ENDPOINT =
  import.meta.env.VITE_VARIANTS_ENDPOINT || "/variants";

/* =========================================
   FORMAT RUPIAH
========================================= */

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/* =========================================
   KEUNGGULAN SOESWEET
========================================= */

const advantages = [
  {
    icon: Award,
    title: "Kualitas Terbaik",
    description: "Bahan pilihan dan rasa yang lezat",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Pilihan pickup dan delivery",
  },
  {
    icon: ShieldCheck,
    title: "Pembayaran Aman",
    description: "Pembayaran melalui verifikasi admin",
  },
];

/* =========================================
   HOME COMPONENT
========================================= */

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingVariants, setLoadingVariants] = useState(true);

  const [productError, setProductError] = useState("");
  const [variantError, setVariantError] = useState("");

  /* =====================================
     FETCH PRODUCTS
  ====================================== */

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductError("");

      const response = await apiRequest<unknown>(
        PRODUCTS_ENDPOINT
      );

      const result = extractList<Product>(
        response,
        "products"
      );

      const activeProducts = result.filter(
        (product) => product.status === "aktif"
      );

      // Tampilkan maksimal 3 produk unggulan.
      setProducts(activeProducts.slice(0, 3));
    } catch (error) {
      console.error("Gagal mengambil produk:", error);

      setProductError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data produk."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  /* =====================================
     FETCH VARIANTS
  ====================================== */

  const fetchVariants = async () => {
    try {
      setLoadingVariants(true);
      setVariantError("");

      const response = await apiRequest<unknown>(
        VARIANTS_ENDPOINT
      );

      const result = extractList<Variant>(
        response,
        "variants"
      );

      const activeVariants = result.filter(
        (variant) => variant.status === "aktif"
      );

      setVariants(activeVariants);
    } catch (error) {
      console.error("Gagal mengambil varian:", error);

      setVariantError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data varian."
      );
    } finally {
      setLoadingVariants(false);
    }
  };

  /* =====================================
     LOAD DATA
  ====================================== */

  useEffect(() => {
    fetchProducts();
    fetchVariants();
  }, []);

  /* =====================================
     COMPONENT
  ====================================== */

  return (
    <div className="overflow-hidden bg-white">

      {/* =================================
          HERO SECTION
      ================================== */}

      <section className="relative isolate min-h-[560px] overflow-hidden bg-soe-light">

        {/* Background Image */}
        <div className="absolute inset-0 -z-20">
          <img
            src={heroImage}
            alt="Kue soes strawberry SoeSweet"
            className="h-full w-full object-cover object-[center_65%]"
          />
        </div>

        {/* Overlay agar teks terbaca */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/40 via-white/15 to-transparent" />

        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-16 lg:px-10">

          <div className="max-w-xl">

            {/* Brand */}
            <h1 className="font-serif text-5xl font-bold tracking-tight text-soe-dark md:text-7xl">
              SoeSweet
            </h1>

            {/* Heading */}
            <h2 className="mt-4 text-3xl font-bold leading-tight text-soe-dark md:text-5xl">
              Delicious Soes for

              <span className="block text-soe-primary">
                Your Sweet Moments
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-lg text-sm leading-7 text-soe-dark md:text-base">
              Nikmati kelezatan kue soes dengan berbagai
              pilihan paket dan varian rasa favorit dari
              SoeSweet.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-soe-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-300 transition hover:-translate-y-1 hover:bg-soe-dark"
              >
                <ShoppingCart size={18} />

                Belanja Sekarang
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border-2 border-soe-primary bg-white/80 px-7 py-3.5 text-sm font-bold text-soe-primary transition hover:bg-soe-light"
              >
                Tentang Kami
                <ArrowRight size={17} />
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* =================================
          ADVANTAGES SECTION
      ================================== */}

      <section className="relative z-10 border-y border-pink-100 bg-white">

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-3">

          {advantages.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center justify-center gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-soe-light text-soe-primary">
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-soe-dark">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* =================================
          FEATURED PRODUCTS
      ================================== */}

      <section className="bg-gradient-to-b from-white to-soe-light/60 px-6 py-20">

        <div className="mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="mb-10 text-center">

            <span className="text-xs font-bold tracking-[0.25em] text-soe-primary">
              OUR SPECIAL PRODUCTS
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-soe-dark md:text-4xl">
              Produk Unggulan Kami
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
              Temukan pilihan paket kue soes favorit
              yang cocok untuk menemani setiap momen.
            </p>

          </div>

          {/* Loading */}
          {loadingProducts && (
            <div className="grid gap-6 md:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="h-52 bg-pink-100" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded bg-pink-100" />
                    <div className="h-4 w-1/2 rounded bg-pink-100" />
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Error */}
          {!loadingProducts && productError && (
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">

              <p className="text-sm text-red-600">
                {productError}
              </p>

              <button
                type="button"
                onClick={fetchProducts}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-soe-primary px-5 py-2.5 text-sm font-semibold text-white"
              >
                <RefreshCw size={16} />
                Coba Lagi
              </button>

            </div>
          )}

          {/* Empty */}
          {!loadingProducts &&
            !productError &&
            products.length === 0 && (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

                <CakeSlice
                  size={45}
                  className="mx-auto text-soe-secondary"
                />

                <h3 className="mt-4 font-bold text-soe-dark">
                  Belum Ada Produk
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Produk unggulan akan ditampilkan
                  setelah tersedia di database.
                </p>

              </div>
            )}

          {/* Product Cards */}
          {!loadingProducts &&
            !productError &&
            products.length > 0 && (

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {products.map((product) => (
                  <article
                    key={product.id_product}
                    className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-100"
                  >

                    {/* Product Image */}
                    <Link
                      to={`/products/${product.id_product}`}
                      className="relative block h-56 overflow-hidden bg-soe-light"
                    >

                      <img
                        src={getImageUrl(product.gambar)}
                        alt={product.nama_product}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />

                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-soe-primary shadow-sm">
                        SoeSweet
                      </span>

                    </Link>

                    {/* Product Information */}
                    <div className="p-5">

                      <p className="text-xs font-medium text-soe-secondary">
                        Paket {product.jumlah_isi} pcs
                      </p>

                      <h3 className="mt-2 text-lg font-bold text-soe-dark">
                        {product.nama_product}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                        {product.deskripsi}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3">

                        <p className="font-bold text-soe-primary">
                          {formatRupiah(product.harga)}
                        </p>

                        <Link
                          to={`/products/${product.id_product}`}
                          aria-label={`Lihat ${product.nama_product}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-soe-primary text-white transition hover:bg-soe-dark"
                        >
                          <Plus size={20} />
                        </Link>

                      </div>
                    </div>

                  </article>
                ))}

              </div>
            )}

          {/* View All */}
          <div className="mt-10 text-center">

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-soe-primary px-7 py-3 text-sm font-bold text-soe-primary transition hover:bg-soe-primary hover:text-white"
            >
              Lihat Semua Produk
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>
      </section>

      {/* =================================
          VARIANTS SECTION
      ================================== */}

      <section className="bg-white px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">

            <span className="text-xs font-bold tracking-[0.25em] text-soe-primary">
              OUR FAVORITE FLAVORS
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-soe-dark md:text-4xl">
              Pilihan Varian Rasa
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
              Pilih rasa favoritmu dan nikmati
              kelezatan kue soes dari SoeSweet.
            </p>

          </div>

          {/* Loading */}
          {loadingVariants && (
            <div className="flex flex-wrap justify-center gap-4">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-12 w-36 animate-pulse rounded-full bg-pink-100"
                />
              ))}

            </div>
          )}

          {/* Error */}
          {!loadingVariants && variantError && (
            <div className="rounded-xl bg-soe-light p-6 text-center">

              <p className="text-sm text-red-600">
                {variantError}
              </p>

              <button
                type="button"
                onClick={fetchVariants}
                className="mt-3 text-sm font-bold text-soe-primary"
              >
                Coba Lagi
              </button>

            </div>
          )}

          {/* Empty */}
          {!loadingVariants &&
            !variantError &&
            variants.length === 0 && (
              <p className="text-center text-sm text-gray-500">
                Belum ada varian rasa yang tersedia.
              </p>
            )}

          {/* Variant List */}
          {!loadingVariants &&
            !variantError &&
            variants.length > 0 && (

              <div className="flex flex-wrap justify-center gap-4">

                {variants.map((variant) => {
                  const isOutOfStock = variant.stok <= 0;

                  return (
                    <div
                      key={variant.id_varian}
                      className="flex min-w-36 items-center gap-3 rounded-full border border-pink-100 bg-soe-light px-5 py-3 shadow-sm transition hover:-translate-y-1 hover:border-soe-secondary"
                    >

                      <img
                        src={getVariantThumbnail(variant.nama_varian)}
                        alt={`Varian ${variant.nama_varian}`}
                        className="h-9 w-9 rounded-full border border-white object-cover shadow-sm"
                      />

                      <div>
                        <p className="text-sm font-bold text-soe-dark">
                          {variant.nama_varian}
                        </p>

                        <p
                          className={`mt-0.5 text-xs ${
                            isOutOfStock
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {isOutOfStock
                            ? "Habis"
                            : "Tersedia"}
                        </p>
                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>
      </section>

      {/* =================================
          PROMOTION BANNER
      ================================== */}

      <section className="bg-soe-light px-6 py-16">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-soe-primary to-soe-secondary px-8 py-12 text-center shadow-xl shadow-pink-200 md:px-16">

          <Heart
            className="absolute left-10 top-8 text-white/20"
            size={55}
            fill="currentColor"
          />

          <Heart
            className="absolute bottom-8 right-10 text-white/20"
            size={75}
            fill="currentColor"
          />

          <div className="relative">

            <span className="text-xs font-bold tracking-[0.25em] text-pink-100">
              SWEET MOMENTS START HERE
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold text-white md:text-4xl">
              Camilan Manis untuk
              <span className="block">
                Segala Suasana
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/90">
              Temukan paket kue soes favoritmu dan
              buat setiap momen menjadi lebih istimewa
              bersama SoeSweet.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-soe-primary transition hover:-translate-y-1 hover:bg-soe-light"
            >
              Belanja Sekarang
              <ArrowRight size={17} />
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}