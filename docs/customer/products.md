# Dokumentasi Halaman Produk Customer

## 1. Deskripsi Fitur

Halaman Produk merupakan halaman yang menampilkan daftar produk kue soes yang tersedia di SoeSweet.

Customer dapat melihat informasi produk, seperti nama produk, harga, jumlah isi dalam kemasan, deskripsi, dan gambar produk. Halaman ini membantu customer memilih produk yang ingin dipesan.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Produk meliputi:

- **Navbar:** Menampilkan navigasi utama aplikasi SoeSweet.
- **Daftar Produk:** Menampilkan kumpulan produk yang tersedia.
- **Kartu Produk:** Menampilkan informasi singkat setiap produk.
- **Pencarian:** Membantu customer menemukan produk berdasarkan kata kunci.
- **Footer:** Menampilkan informasi tambahan aplikasi.

## 3. Fitur yang Tersedia

- Menampilkan daftar produk dari backend.
- Menampilkan gambar produk.
- Menampilkan nama dan deskripsi produk.
- Menampilkan harga produk.
- Menampilkan jumlah isi dalam setiap kemasan.
- Mencari produk berdasarkan kata kunci.
- Membuka halaman detail produk.
- Memilih produk untuk melanjutkan proses pemesanan.

## 4. Integrasi API

Halaman Produk menggunakan API backend SoeSweet untuk memperoleh data produk.

Data yang ditampilkan dapat meliputi:

- `id_product`
- `nama_product`
- `jumlah_isi`
- `harga`
- `deskripsi`
- `gambar`
- `status`

Data produk ditampilkan berdasarkan respons API. Produk yang berstatus aktif dapat ditampilkan kepada customer sesuai ketentuan backend.

## 5. Proses Kerja

1. Customer membuka halaman Produk.
2. Frontend meminta data produk kepada backend.
3. Backend mengirimkan daftar produk.
4. Frontend mengolah dan menampilkan data dalam bentuk kartu produk.
5. Customer dapat mencari produk berdasarkan nama atau kata kunci.
6. Customer memilih salah satu produk.
7. Frontend mengarahkan customer ke halaman Detail Produk.

## 6. Ketentuan dan Validasi

- Produk ditampilkan berdasarkan data yang diterima dari backend.
- Produk yang tidak tersedia atau berstatus nonaktif tidak ditampilkan sebagai produk yang dapat dipesan.
- Harga dan informasi produk mengikuti data dari backend.
- Customer harus login sebelum menggunakan fitur pemesanan.

## 7. Pengelolaan Data

Data produk diperoleh dari backend sehingga perubahan informasi produk yang dilakukan admin dapat ditampilkan pada halaman customer setelah data terbaru berhasil dimuat.

Informasi produk yang ditampilkan digunakan sebagai dasar bagi customer untuk memilih produk sebelum melanjutkan ke halaman Detail Produk.