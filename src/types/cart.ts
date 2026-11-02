export interface CartVariant {
  id_varian: number;
  nama_varian: string;

  // Jumlah kue untuk satu paket.
  jumlah: number;
}

export interface CartItem {
  id_product: number;
  nama_product: string;
  harga: number;
  jumlah_isi: number;
  gambar: string | null;

  // Jumlah paket yang dibeli.
  quantity: number;

  // Komposisi rasa untuk satu paket.
  variants: CartVariant[];
}

export interface CheckoutCartData {
  items: CartItem[];
}
