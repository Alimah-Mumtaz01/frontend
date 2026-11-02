
import type { Product } from "../types/product";

export interface CartVariant {
  id_varian: number;
  nama_varian: string;
  quantity: number;
}

export interface CartItem {
  id_product: number;
  nama_product: string;
  harga: number;
  jumlah_isi: number;
  gambar: string | null;
  quantity: number;
  variants: CartVariant[];
}

const CART_KEY = "soesweet_cart";

export const getCart = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("cartUpdated"));
};

export const addToCart = (
  product: Product,
  variant: CartVariant
) => {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) =>
      item.id_product === product.id_product &&
      item.variants.length === 1 &&
      item.variants[0].id_varian === variant.id_varian
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
    cart[existingIndex].variants[0].quantity +=
      product.jumlah_isi;
  } else {
    cart.push({
      id_product: product.id_product,
      nama_product: product.nama_product,
      harga: Number(product.harga),
      jumlah_isi: product.jumlah_isi,
      gambar: product.gambar,
      quantity: 1,
      variants: [
        {
          id_varian: variant.id_varian,
          nama_varian: variant.nama_varian,
          quantity: product.jumlah_isi,
        },
      ],
    });
  }

  saveCart(cart);

  return cart;
};

export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
};

export const getCartTotal = () => {
  return getCart().reduce(
    (total, item) => total + item.harga * item.quantity,
    0
  );
};

export const removeFromCart = (id_product: number) => {
  const cart = getCart().filter(
    (item) => item.id_product !== id_product
  );

  saveCart(cart);
  return cart;
};
