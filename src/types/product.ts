
export interface Product {
  id_product: number;
  nama_product: string;
  deskripsi: string;
  harga: number;
  gambar: string | null;
  jumlah_isi: number;
  status: "aktif" | "nonaktif";
}

export interface Variant {
  id_varian: number;
  nama_varian: string;
  stok: number;
  status: "aktif" | "nonaktif";
}
