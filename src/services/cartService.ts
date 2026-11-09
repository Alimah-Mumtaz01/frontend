import type { CartItem, CartVariant } from "../types/cart";

const CART_KEY = "soesweet_cart";
const SELECTED_CART_KEY = "soesweet_selected_cart_items";

/**
 * Mengambil ID pengguna yang sedang login.
 * Data pengguna berasal dari AuthContext.
 */
const getCurrentUserId = (): string | null => {
  try {
    const storedUser = localStorage.getItem("soesweet_user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    if (!user?.id_user) {
      return null;
    }

    return String(user.id_user);
  } catch (error) {
    console.error("Gagal membaca data pengguna:", error);
    return null;
  }
};

/**
 * Membuat key keranjang berdasarkan ID pengguna.
 */
const getCartStorageKey = (): string | null => {
  const userId = getCurrentUserId();

  if (!userId) {
    return null;
  }

  return `${CART_KEY}_user_${userId}`;
};

/**
 * Membuat key produk terpilih berdasarkan ID pengguna.
 */
const getSelectedCartStorageKey = (): string | null => {
  const userId = getCurrentUserId();

  if (!userId) {
    return null;
  }

  return `${SELECTED_CART_KEY}_user_${userId}`;
};

/**
 * Mengirim pemberitahuan ketika keranjang berubah.
 */
const dispatchCartUpdated = (): void => {
  window.dispatchEvent(new Event("cartUpdated"));
};

/**
 * Mengambil data keranjang milik pengguna yang sedang login.
 */
export const getCart = (): CartItem[] => {
  try {
    const storageKey = getCartStorageKey();

    // Pengguna yang belum login tidak memiliki akses keranjang.
    if (!storageKey) {
      return [];
    }

    const data = localStorage.getItem(storageKey);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Menyesuaikan format data keranjang.
    const migrated: CartItem[] = parsed.map((item) => ({
      id_product: Number(item.id_product),
      nama_product: item.nama_product,
      harga: Number(item.harga),
      jumlah_isi: Number(item.jumlah_isi),
      gambar: item.gambar ?? null,
      quantity: Number(item.quantity),

      variants: Array.isArray(item.variants)
        ? item.variants.map((variant: CartVariant) => ({
            id_varian: Number(variant.id_varian),
            nama_varian: variant.nama_varian,
            jumlah: Number(variant.jumlah),
          }))
        : [],
    }));

    return migrated;
  } catch (error) {
    console.error("Gagal membaca keranjang:", error);
    return [];
  }
};

/**
 * Menyimpan keranjang milik pengguna yang sedang login.
 */
export const saveCart = (cart: CartItem[]): void => {
  const storageKey = getCartStorageKey();

  if (!storageKey) {
    throw new Error("Silakan login terlebih dahulu untuk menggunakan keranjang.");
  }

  localStorage.setItem(storageKey, JSON.stringify(cart));

  dispatchCartUpdated();
};

/**
 * Menghitung jumlah seluruh produk dalam keranjang.
 */
export const getCartCount = (): number => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
};

/**
 * Menghitung subtotal seluruh produk.
 */
export const getCartSubtotal = (
  cart: CartItem[] = getCart()
): number => {
  return cart.reduce(
    (total, item) => total + Number(item.harga) * item.quantity,
    0
  );
};

/**
 * Menghitung total jumlah varian dalam satu produk.
 */
export const getVariantTotal = (
  variants: CartVariant[]
): number => {
  return variants.reduce(
    (total, variant) => total + variant.jumlah,
    0
  );
};

/**
 * Memvalidasi data produk dalam keranjang.
 */
export const validateCartItem = (item: CartItem): boolean => {
  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    return false;
  }

  if (!Array.isArray(item.variants) || item.variants.length === 0) {
    return false;
  }

  const validVariants = item.variants.every(
    (variant) =>
      Number.isInteger(variant.jumlah) &&
      variant.jumlah > 0
  );

  return (
    validVariants &&
    getVariantTotal(item.variants) === item.jumlah_isi
  );
};

/**
 * Menambahkan produk ke keranjang.
 *
 * Produk dengan kombinasi varian yang sama akan menambah quantity.
 * Produk dengan kombinasi varian berbeda akan menjadi item terpisah.
 */
export const addToCart = (newItem: CartItem): CartItem[] => {
  if (!getCurrentUserId()) {
    throw new Error("Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.");
  }

  if (!validateCartItem(newItem)) {
    throw new Error("Data produk atau jumlah varian tidak valid.");
  }

  const cart = getCart();

  const existingIndex = cart.findIndex((item) => {
    if (item.id_product !== newItem.id_product) {
      return false;
    }

    const oldVariants = [...item.variants].sort(
      (a, b) => a.id_varian - b.id_varian
    );

    const newVariants = [...newItem.variants].sort(
      (a, b) => a.id_varian - b.id_varian
    );

    return JSON.stringify(oldVariants) === JSON.stringify(newVariants);
  });

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);

  return cart;
};

/**
 * Mengubah jumlah produk dalam keranjang.
 */
export const updateCartQuantity = (
  id_product: number,
  variants: CartVariant[],
  quantity: number
): CartItem[] => {
  const cart = getCart();

  const index = cart.findIndex((item) => {
    const oldVariants = [...item.variants].sort(
      (a, b) => a.id_varian - b.id_varian
    );

    const selectedVariants = [...variants].sort(
      (a, b) => a.id_varian - b.id_varian
    );

    return (
      item.id_product === id_product &&
      JSON.stringify(oldVariants) === JSON.stringify(selectedVariants)
    );
  });

  if (index === -1 || !Number.isInteger(quantity) || quantity < 1) {
    return cart;
  }

  cart[index].quantity = quantity;

  saveCart(cart);

  return cart;
};

/**
 * Menghapus satu item produk dari keranjang.
 */
export const removeCartItem = (
  id_product: number,
  variants: CartVariant[]
): CartItem[] => {
  const cart = getCart();

  const updatedCart = cart.filter((item) => {
    const sameProduct = item.id_product === id_product;

    const oldVariants = [...item.variants].sort(
      (a, b) => a.id_varian - b.id_varian
    );

    const selectedVariants = [...variants].sort(
      (a, b) => a.id_varian - b.id_varian
    );

    const sameVariants =
      JSON.stringify(oldVariants) === JSON.stringify(selectedVariants);

    return !(sameProduct && sameVariants);
  });

  saveCart(updatedCart);

  return updatedCart;
};

/**
 * Mengosongkan keranjang pengguna yang sedang login.
 */
export const clearCart = (): void => {
  const storageKey = getCartStorageKey();
  const selectedStorageKey = getSelectedCartStorageKey();

  if (!storageKey) {
    return;
  }

  localStorage.removeItem(storageKey);

  if (selectedStorageKey) {
    localStorage.removeItem(selectedStorageKey);
  }

  dispatchCartUpdated();
};

/**
 * Menyimpan produk yang dipilih untuk checkout.
 */
export const saveSelectedCartItems = (
  items: CartItem[]
): void => {
  const storageKey = getSelectedCartStorageKey();

  if (!storageKey) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  localStorage.setItem(storageKey, JSON.stringify(items));
};

/**
 * Mengambil produk yang dipilih untuk checkout.
 */
export const getSelectedCartItems = (): CartItem[] => {
  try {
    const storageKey = getSelectedCartStorageKey();

    if (!storageKey) {
      return [];
    }

    const data = localStorage.getItem(storageKey);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Gagal membaca produk pilihan:", error);
    return [];
  }
};

/**
 * Menghapus produk yang sudah berhasil diproses dari keranjang.
 * Produk yang tidak dipilih tetap berada di keranjang.
 */
export const removeSelectedCartItems = (
  selectedItems: CartItem[]
): CartItem[] => {
  const cart = getCart();

  const remainingCart = cart.filter((item) => {
    return !selectedItems.some((selected) => {
      const sameProduct =
        selected.id_product === item.id_product;

      const selectedVariants = [...selected.variants].sort(
        (a, b) => a.id_varian - b.id_varian
      );

      const itemVariants = [...item.variants].sort(
        (a, b) => a.id_varian - b.id_varian
      );

      const sameVariants =
        JSON.stringify(selectedVariants) ===
        JSON.stringify(itemVariants);

      return sameProduct && sameVariants;
    });
  });

  saveCart(remainingCart);

  const selectedStorageKey = getSelectedCartStorageKey();

  if (selectedStorageKey) {
    localStorage.removeItem(selectedStorageKey);
  }

  return remainingCart;
};