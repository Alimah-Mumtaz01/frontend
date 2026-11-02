
import type { CartItem, CartVariant } from "../types/cart";

const CART_KEY = "soesweet_cart";
const SELECTED_CART_KEY = "soesweet_selected_cart_items";

// Mengambil data keranjang.

export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(CART_KEY);

    if (!data) return [];

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) return [];

    const migrated: CartItem[] = parsed.map((item) => ({
      id_product: Number(item.id_product),
      nama_product: item.nama_product,
      harga: Number(item.harga),
      jumlah_isi: Number(item.jumlah_isi),
      gambar: item.gambar ?? null,
      quantity: Number(item.quantity),
      variants: Array.isArray(item.variants)
        ? item.variants.map((variant: any) => ({
            id_varian: Number(variant.id_varian),
            nama_varian: variant.nama_varian,
            jumlah: Number(
              variant.jumlah ?? variant.quantity
            ),
          }))
        : [],
    }));

    return migrated;
  } catch (error) {
    console.error("Gagal membaca keranjang:", error);
    return [];
  }
};


// Menyimpan data keranjang.
export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("cartUpdated"));
};

// Menghitung jumlah seluruh paket.
export const getCartCount = (): number => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
};

// Menghitung subtotal seluruh keranjang.
export const getCartSubtotal = (
  cart: CartItem[] = getCart()
): number => {
  return cart.reduce(
    (total, item) =>
      total + Number(item.harga) * item.quantity,
    0
  );
};

// Menghitung jumlah produk berdasarkan varian.
export const getVariantTotal = (
  variants: CartVariant[]
): number => {
  return variants.reduce(
    (total, variant) => total + variant.jumlah,
    0
  );
};

// Memvalidasi komposisi varian satu paket.
export const validateCartItem = (
  item: CartItem
): boolean => {
  if (
    !Number.isInteger(item.quantity) ||
    item.quantity < 1
  ) {
    return false;
  }

  if (
    !Array.isArray(item.variants) ||
    item.variants.length === 0
  ) {
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

// Menambahkan produk baru ke keranjang.
export const addToCart = (newItem: CartItem): CartItem[] => {
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

    return (
      JSON.stringify(oldVariants) ===
      JSON.stringify(newVariants)
    );
  });

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);

  return cart;
};

// Mengubah jumlah paket.
export const updateCartQuantity = (
  id_product: number,
  variants: CartVariant[],
  quantity: number
): CartItem[] => {
  const cart = getCart();

  const index = cart.findIndex(
    (item) =>
      item.id_product === id_product &&
      JSON.stringify(
        [...item.variants].sort(
          (a, b) => a.id_varian - b.id_varian
        )
      ) ===
      JSON.stringify(
        [...variants].sort(
          (a, b) => a.id_varian - b.id_varian
        )
      )
  );

  if (index === -1) return cart;

  if (quantity < 1) return cart;

  cart[index].quantity = quantity;

  saveCart(cart);

  return cart;
};

// Menghapus satu produk berdasarkan komposisi variannya.
export const removeCartItem = (
  id_product: number,
  variants: CartVariant[]
): CartItem[] => {
  const cart = getCart();

  const updatedCart = cart.filter((item) => {
    const sameProduct =
      item.id_product === id_product;

    const sameVariants =
      JSON.stringify(
        [...item.variants].sort(
          (a, b) => a.id_varian - b.id_varian
        )
      ) ===
      JSON.stringify(
        [...variants].sort(
          (a, b) => a.id_varian - b.id_varian
        )
      );

    return !(sameProduct && sameVariants);
  });

  saveCart(updatedCart);

  return updatedCart;
};

// Mengosongkan seluruh keranjang.
export const clearCart = (): void => {
  saveCart([]);
  localStorage.removeItem(SELECTED_CART_KEY);
};

// Menyimpan item yang dipilih untuk checkout.
export const saveSelectedCartItems = (
  items: CartItem[]
): void => {
  localStorage.setItem(
    SELECTED_CART_KEY,
    JSON.stringify(items)
  );
};

// Mengambil item yang dipilih untuk checkout.
export const getSelectedCartItems = (): CartItem[] => {
  try {
    const data = localStorage.getItem(SELECTED_CART_KEY);

    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Menghapus hanya item yang berhasil di-checkout.
export const removeSelectedCartItems = (
  selectedItems: CartItem[]
): CartItem[] => {
  const cart = getCart();

  const remainingCart = cart.filter((item) => {
    return !selectedItems.some(
      (selected) =>
        selected.id_product === item.id_product &&
        JSON.stringify(
          [...selected.variants].sort(
            (a, b) => a.id_varian - b.id_varian
          )
        ) ===
        JSON.stringify(
          [...item.variants].sort(
            (a, b) => a.id_varian - b.id_varian
          )
        )
    );
  });

  saveCart(remainingCart);

  localStorage.removeItem(SELECTED_CART_KEY);

  return remainingCart;
};
