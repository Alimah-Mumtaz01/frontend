# Dokumentasi Halaman Keranjang Customer

## 1. Deskripsi Fitur

Halaman Keranjang merupakan halaman yang digunakan customer untuk melihat dan mengelola produk yang telah dipilih dari halaman Detail Produk sebelum melanjutkan ke proses Checkout.

Customer dapat memeriksa produk, varian rasa, jumlah, dan subtotal harga dari setiap produk yang dimasukkan ke keranjang.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Keranjang meliputi:

- **Navbar:** Menampilkan navigasi utama aplikasi SoeSweet.
- **Daftar Keranjang:** Menampilkan produk yang telah ditambahkan customer.
- **Informasi Produk:** Menampilkan nama produk, gambar, dan harga.
- **Detail Varian:** Menampilkan pilihan varian rasa beserta jumlahnya.
- **Pengaturan Jumlah:** Mengatur jumlah produk.
- **Subtotal:** Menampilkan total harga produk.
- **Ringkasan Keranjang:** Menampilkan jumlah dan total harga produk yang dipilih.
- **Tombol Checkout:** Mengarahkan customer ke halaman Checkout.
- **Footer:** Menampilkan informasi tambahan aplikasi.

## 3. Fitur yang Tersedia

- Menampilkan daftar produk yang telah ditambahkan ke keranjang.
- Menampilkan gambar dan informasi produk.
- Menampilkan pilihan varian rasa beserta jumlahnya.
- Mengubah jumlah kemasan produk.
- Menghapus produk dari keranjang.
- Memilih produk tertentu untuk dilanjutkan ke Checkout.
- Memilih seluruh produk dalam keranjang.
- Menampilkan subtotal setiap produk.
- Menghitung total harga produk yang dipilih.
- Melanjutkan produk terpilih ke halaman Checkout.

## 4. Integrasi API dan Penyimpanan Data

Data keranjang dikelola pada frontend menggunakan penyimpanan browser (`localStorage`).

Data keranjang disimpan dengan key:

- `soesweet_cart`: Menyimpan daftar produk yang terdapat dalam keranjang.
- `soesweet_selected_cart_items`: Menyimpan ID produk keranjang yang dipilih untuk Checkout.

Event `cartUpdated` digunakan untuk membantu memperbarui informasi keranjang ketika terjadi perubahan data.

Halaman Keranjang tidak langsung membuat pesanan ke backend. Data produk yang dipilih akan digunakan pada proses Checkout.

## 5. Proses Kerja

1. Customer membuka halaman Keranjang.
2. Frontend mengambil data keranjang dari `localStorage`.
3. Frontend menampilkan daftar produk beserta varian rasa dan jumlahnya.
4. Customer dapat mengubah jumlah produk atau menghapus produk.
5. Customer memilih produk yang ingin dibeli.
6. Frontend menghitung subtotal dan total harga produk terpilih.
7. Customer menekan tombol Checkout.
8. Frontend meneruskan data produk terpilih ke halaman Checkout.

## 6. Ketentuan dan Validasi

- Customer harus login untuk menggunakan fitur pemesanan.
- Produk yang ditampilkan berasal dari data keranjang customer.
- Jumlah harus memenuhi ketentuan pemesanan.
- Jumlah varian rasa harus tetap sesuai dengan jumlah isi produk.
- Total harga dihitung berdasarkan harga produk dan jumlahnya.
- Hanya produk yang dipilih customer yang diteruskan ke proses Checkout.
- Produk yang tidak dipilih tetap tersimpan di keranjang.

## 7. Pengelolaan Data Keranjang

Data keranjang digunakan sebagai tempat penyimpanan sementara produk yang ingin dibeli customer.

Data tersebut mencakup informasi produk, jumlah kemasan, serta pilihan varian rasa dan jumlah masing-masing varian.

Ketika customer melanjutkan ke halaman Checkout, hanya produk yang dipilih yang akan diproses. Produk lainnya tetap berada di keranjang agar dapat dibeli pada kesempatan berikutnya.