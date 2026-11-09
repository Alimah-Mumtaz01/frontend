import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingCart,
  ShoppingBag,
  Package,
  CakeSlice,
  Star,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import {
  apiRequest,
  extractList,
  getImageUrl,
} from "../../services/api";

import type {
  Product,
  Variant,
} from "../../types/product";

import {
  getProductRating,
  type ProductRating,
} from "../../services/reviewService";

import { addToCart } from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";
import { getVariantImage } from "../../utils/variantImage";

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface VariantResponse {
  success: boolean;
  message: string;
  data: Variant[];
}

export default function ProductDetail() {
  const { id_product } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [productRating, setProductRating] =
  useState<ProductRating | null>(null);

  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, number>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error"
  >("success");

  const [addingToCart, setAddingToCart] = useState(false);

  // Mengambil detail produk dan daftar varian dari backend.
  useEffect(() => {
    let isMounted = true;

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id_product || !/^\d+$/.test(id_product)) {
          throw new Error("ID produk tidak valid.");
        }

        const [productResponse, variantResponse, ratingData] =
          await Promise.all([
            apiRequest<ProductResponse>(`/products/${id_product}`),
            apiRequest<VariantResponse>("/varian"),
            getProductRating(Number(id_product)).catch((err) => {
              console.error("Gagal mengambil rating produk:", err);
              return null;
            }),
          ]);

        if (!isMounted) return;

        const productData = productResponse.data;

        if (!productData) {
          throw new Error("Data produk tidak ditemukan.");
        }

        if (productData.status !== "aktif") {
          throw new Error("Produk ini sedang tidak tersedia.");
        }

        const variantData = extractList<Variant>(
          variantResponse,
          "variants"
        );

        setProduct(productData);
        setProductRating(ratingData);

        setVariants(
          variantData.filter(
            (variant) => variant.status === "aktif"
          )
        );
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil detail produk."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductDetail();

    return () => {
      isMounted = false;
    };
  }, [id_product]);

  // Menghitung total jumlah varian yang dipilih.
  const totalSelected = useMemo(() => {
    return Object.values(selectedVariants).reduce(
      (total, quantity) => total + quantity,
      0
    );
  }, [selectedVariants]);

  // Menghitung sisa kue yang perlu dipilih.
  const remainingQuantity = product
    ? product.jumlah_isi - totalSelected
    : 0;

  // Memastikan komposisi dan stok sudah valid.
  const isCompositionValid =
    product !== null &&
    totalSelected === product.jumlah_isi &&
    Object.entries(selectedVariants).every(([id, quantity]) => {
      const variant = variants.find(
        (item) => item.id_varian === Number(id)
      );

      return (
        variant !== undefined &&
        quantity >= 0 &&
        quantity <= variant.stok
      );
    });

  // Mengubah jumlah varian.
  const handleVariantChange = (
    variant: Variant,
    change: number
  ) => {
    setSelectedVariants((previous) => {
      const currentQuantity =
        previous[variant.id_varian] || 0;

      const nextQuantity = currentQuantity + change;

      // Jumlah tidak boleh negatif.
      if (nextQuantity < 0) {
        return previous;
      }

      // Jumlah tidak boleh melebihi stok.
      if (nextQuantity > variant.stok) {
        return previous;
      }

      const updated = {
        ...previous,
        [variant.id_varian]: nextQuantity,
      };

      if (nextQuantity === 0) {
        delete updated[variant.id_varian];
      }

      return updated;
    });
  };

  // Menampilkan notifikasi.
  const showNotification = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotification(message);
    setNotificationType(type);
  };

  // Menambahkan produk ke keranjang.
  const handleAddToCart = (buyNow = false) => {
    if (!product) return;

    if (authLoading) {
      return;
    }

    // Pengguna harus login untuk menggunakan keranjang.
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/products/${product.id_product}`,
          },
        },
      });

      return;
    }

    // Validasi komposisi paket.
    if (totalSelected !== product.jumlah_isi) {
      showNotification(
        `Pilih tepat ${product.jumlah_isi} kue sebelum melanjutkan.`,
        "error"
      );

      return;
    }

    // Validasi stok setiap varian.
    const selectedItems = Object.entries(selectedVariants)
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => {
        const variant = variants.find(
          (item) => item.id_varian === Number(id)
        );

        return {
          id_varian: Number(id),
          nama_varian: variant?.nama_varian || "",
          jumlah: quantity,
        };
      });

    const invalidStock = selectedItems.some((item) => {
      const variant = variants.find(
        (v) => v.id_varian === item.id_varian
      );

      return !variant || item.jumlah > variant.stok;
    });

    if (invalidStock) {
      showNotification(
        "Jumlah pilihan melebihi stok varian yang tersedia.",
        "error"
      );

      return;
    }

    try {
      setAddingToCart(true);

      addToCart({
        id_product: product.id_product,
        nama_product: product.nama_product,
        harga: Number(product.harga),
        jumlah_isi: product.jumlah_isi,
        gambar: product.gambar,
        quantity: 1,
        variants: selectedItems,
      });

      if (buyNow) {
        navigate("/cart");
        return;
      }

      showNotification(
        "Produk berhasil ditambahkan ke keranjang!",
        "success"
      );
    } catch (err) {
      showNotification(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan produk ke keranjang.",
        "error"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // Tampilan ketika sedang mengambil data.
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFF8FA]">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-[#C9184A]"
          />

          <p className="mt-4 text-sm text-[#9B6575]">
            Memuat detail produk...
          </p>
        </div>
      </main>
    );
  }

  // Tampilan ketika terjadi kesalahan.
  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFF8FA] px-5">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <AlertCircle
            size={48}
            className="mx-auto text-[#C9184A]"
          />

          <h2 className="mt-4 text-xl font-bold text-[#590D22]">
            Produk Tidak Tersedia
          </h2>

          <p className="mt-2 text-sm text-[#9B6575]">
            {error || "Produk yang kamu cari tidak ditemukan."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C9184A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A4133C]"
          >
            <ArrowLeft size={17} />
            Kembali ke Produk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8FA] pb-16">
      {/* Notifikasi */}
      {notification && (
        <div
          className={`fixed right-5 top-24 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg ${
            notificationType === "success"
              ? "border-green-200 bg-white text-green-700"
              : "border-red-200 bg-white text-red-600"
          }`}
        >
          {notificationType === "success" ? (
            <CheckCircle2 size={21} className="shrink-0" />
          ) : (
            <AlertCircle size={21} className="shrink-0" />
          )}

          <p className="text-sm font-medium">
            {notification}
          </p>

          <button
            type="button"
            onClick={() => setNotification("")}
            className="ml-2 text-gray-400 hover:text-gray-700"
            aria-label="Tutup notifikasi"
          >
            ×
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#9B6575]">
          <Link
            to="/"
            className="transition hover:text-[#C9184A]"
          >
            Beranda
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="transition hover:text-[#C9184A]"
          >
            Produk
          </Link>

          <span>/</span>

          <span className="font-semibold text-[#590D22]">
            {product.nama_product}
          </span>
        </div>

        {/* Tombol kembali */}
        <Link
          to="/products"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#C9184A] transition hover:text-[#590D22]"
        >
          <ArrowLeft size={18} />
          Kembali ke Produk
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Kolom gambar produk */}
          <section>
            <div className="overflow-hidden rounded-[28px] border border-pink-100 bg-white p-4 shadow-sm md:p-6">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#FFF0F3]">
                {product.gambar ? (
                  <img
                    src={getImageUrl(product.gambar)}
                    alt={product.nama_product}
                    className="h-full w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#C9184A]">
                    <CakeSlice size={76} strokeWidth={1.2} />

                    <p className="text-sm font-medium">
                      Gambar produk belum tersedia
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-pink-100 bg-white p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0F3] text-[#C9184A]">
                <Package size={21} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#590D22]">
                  Freshly Made with Love
                </p>

                <p className="mt-1 text-xs text-[#9B6575]">
                  Dibuat dengan bahan pilihan untuk menemani momen manismu.
                </p>
              </div>
            </div>
          </section>

          {/* Kolom informasi dan pilihan varian */}
          <section className="rounded-[28px] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0F3] px-4 py-2 text-xs font-semibold text-[#C9184A]">
                <CakeSlice size={15} />
                Kue Soes SoeSweet
              </span>

              <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#590D22] md:text-4xl">
                {product.nama_product}
              </h1>

              <p className="mt-2 text-sm text-[#9B6575]">
                Paket isi {product.jumlah_isi} pcs
              </p>

              <p className="mt-5 text-3xl font-bold text-[#C9184A]">
                Rp
                {Number(product.harga).toLocaleString("id-ID")}
              </p>

              {/* RATING PRODUK */}
              <div className="mt-3 flex flex-wrap items-center gap-2">

                {productRating && productRating.jumlah_review > 0 ? (
                  <>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          size={18}
                          className={
                            index < Math.round(
                              Number(productRating.rata_rata_rating)
                            )
                              ? "fill-[#F5B942] text-[#F5B942]"
                              : "text-[#E5CBD1]"
                          }
                        />
                      ))}
                    </div>

                    <span className="text-sm font-bold text-[#590D22]">
                      {Number(productRating.rata_rata_rating).toFixed(1)}
                    </span>

                    <span className="text-sm text-[#9B6575]">
                      ({productRating.jumlah_review} ulasan)
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-[#B58A96]">
                    Belum ada ulasan untuk produk ini.
                  </span>
                )}

              </div>
            </div>

            <div className="border-t border-pink-100 pt-5">
              <h2 className="text-base font-bold text-[#590D22]">
                Deskripsi Produk
              </h2>

              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#87616E]">
                {product.deskripsi || "Belum ada deskripsi produk."}
              </p>
            </div>

            {/* Pemilihan varian */}
            <div className="mt-7 border-t border-pink-100 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#590D22]">
                    Pilih Varian Rasa
                  </h2>

                  <p className="mt-1 text-xs text-[#9B6575]">
                    Tentukan komposisi rasa untuk paketmu.
                  </p>
                </div>

                <span className="rounded-full bg-[#FFF0F3] px-4 py-2 text-sm font-bold text-[#C9184A]">
                  {totalSelected} / {product.jumlah_isi} pcs
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {variants.map((variant) => {
                  const quantity =
                    selectedVariants[variant.id_varian] || 0;

                  const isOutOfStock = variant.stok <= 0;

                  return (
                    <div
                      key={variant.id_varian}
                      className={`relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border p-4 transition ${
                        quantity > 0
                          ? "border-[#FF758F]"
                          : "border-pink-100"
                      }`}
                    >
                      <img
                        src={getVariantImage(variant.nama_varian)}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 ${
                          quantity > 0
                            ? "bg-[#FFF8FA]/75"
                            : "bg-white/75"
                        }`}
                      />

                      <div className="relative z-10 min-w-0">
                        <p className="font-semibold text-[#590D22]">
                          {variant.nama_varian}
                        </p>

                        <p
                          className={`mt-1 text-xs ${
                            isOutOfStock
                              ? "text-red-500"
                              : "text-[#9B6575]"
                          }`}
                        >
                          {isOutOfStock
                            ? "Stok habis"
                            : `Stok tersedia: ${variant.stok} pcs`}
                        </p>
                      </div>

                      <div className="relative z-10 flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Kurangi ${variant.nama_varian}`}
                          disabled={quantity <= 0}
                          onClick={() =>
                            handleVariantChange(variant, -1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-200 text-[#C9184A] transition hover:bg-[#FFF0F3] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-5 text-center text-sm font-bold text-[#590D22]">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Tambah ${variant.nama_varian}`}
                          disabled={
                            isOutOfStock ||
                            quantity >= variant.stok
                          }
                          onClick={() =>
                            handleVariantChange(variant, 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9184A] text-white transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {variants.length === 0 && (
                  <div className="rounded-2xl bg-[#FFF8FA] p-5 text-center">
                    <p className="text-sm text-[#9B6575]">
                      Belum ada varian rasa yang tersedia.
                    </p>
                  </div>
                )}
              </div>

              {/* Informasi jumlah pilihan */}
              <div
                className={`mt-5 rounded-2xl p-4 ${
                  totalSelected === product.jumlah_isi
                    ? "bg-green-50"
                    : totalSelected > product.jumlah_isi
                      ? "bg-red-50"
                      : "bg-[#FFF0F3]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {totalSelected === product.jumlah_isi ? (
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-green-600"
                    />
                  ) : (
                    <AlertCircle
                      size={20}
                      className="shrink-0 text-[#C9184A]"
                    />
                  )}

                  <div>
                    <p
                      className={`text-sm font-bold ${
                        totalSelected === product.jumlah_isi
                          ? "text-green-700"
                          : totalSelected > product.jumlah_isi
                            ? "text-red-600"
                            : "text-[#C9184A]"
                      }`}
                    >
                      {totalSelected === product.jumlah_isi
                        ? "Komposisi sudah sesuai!"
                        : totalSelected > product.jumlah_isi
                          ? "Jumlah varian melebihi kapasitas paket."
                          : `Pilih ${remainingQuantity} pcs lagi.`}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#9B6575]">
                      Total varian yang dipilih harus tepat{" "}
                      {product.jumlah_isi} pcs untuk satu paket.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol pembelian */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={
                  addingToCart ||
                  authLoading ||
                  !isCompositionValid
                }
                onClick={() => handleAddToCart(false)}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-[#C9184A] px-5 py-3.5 text-sm font-bold text-[#C9184A] transition hover:bg-[#FFF0F3] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {addingToCart ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <ShoppingCart size={18} />
                )}

                Tambah Keranjang
              </button>

              <button
                type="button"
                disabled={
                  addingToCart ||
                  authLoading ||
                  !isCompositionValid
                }
                onClick={() => handleAddToCart(true)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#C9184A] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#A4133C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {addingToCart ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <ShoppingBag size={18} />
                )}

                Beli Sekarang
              </button>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-[#9B6575]">
              Silakan pilih komposisi rasa sesuai jumlah isi paket
              sebelum menambahkan produk ke keranjang.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}