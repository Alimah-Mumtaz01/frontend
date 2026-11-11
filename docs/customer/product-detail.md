# Dokumentasi Halaman Detail Produk Customer

## 1. Deskripsi Fitur

Halaman Detail Produk merupakan halaman yang menampilkan informasi lebih lengkap mengenai produk kue soes yang dipilih oleh customer.

Pada halaman ini, customer dapat melihat detail produk, memilih varian rasa, menentukan jumlah pesanan, dan menambahkan produk ke keranjang.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Detail Produk meliputi:

- **Navbar:** Menampilkan navigasi utama aplikasi SoeSweet.
- **Gambar Produk:** Menampilkan foto produk yang dipilih.
- **Informasi Produk:** Menampilkan nama, harga, jumlah isi kemasan, dan deskripsi produk.
- **Pilihan Varian Rasa:** Menampilkan pilihan varian rasa yang tersedia.
- **Jumlah Pesanan:** Mengatur jumlah kemasan yang ingin dibeli.
- **Tombol Tambah ke Keranjang:** Menambahkan produk beserta varian yang dipilih ke keranjang.
- **Footer:** Menampilkan informasi tambahan aplikasi.

## 3. Fitur yang Tersedia

- Menampilkan detail produk berdasarkan ID produk.
- Menampilkan gambar dan deskripsi produk.
- Menampilkan harga serta jumlah isi kemasan.
- Menampilkan pilihan varian rasa yang tersedia.
- Memilih varian rasa sesuai jumlah isi dalam kemasan.
- Mengatur jumlah kemasan yang ingin dipesan.
- Menambahkan produk ke keranjang.
- Mengarahkan customer ke halaman keranjang setelah memilih produk sesuai navigasi yang tersedia.

## 4. Integrasi API

Halaman Detail Produk menggunakan API backend SoeSweet untuk memperoleh informasi produk dan varian rasa.

Data yang digunakan meliputi:

**Data Produk**
- `id_product`
- `nama_product`
- `jumlah_isi`
- `harga`
- `deskripsi`
- `gambar`
- `status`

**Data Varian**
- `id_varian`
- `nama_varian`
- `stok`
- `status`

Data tersebut digunakan untuk menampilkan informasi produk dan pilihan varian rasa yang dapat dipesan.

## 5. Proses Kerja

1. Customer memilih produk dari halaman Produk.
2. Frontend membuka halaman Detail Produk berdasarkan ID produk.
3. Frontend mengambil informasi produk dan varian rasa dari backend.
4. Customer melihat informasi produk yang dipilih.
5. Customer memilih varian rasa sesuai jumlah isi kemasan.
6. Customer menentukan jumlah kemasan yang ingin dipesan.
7. Customer menekan tombol Tambah ke Keranjang.
8. Frontend menyimpan produk beserta pilihan variannya ke keranjang.

## 6. Ketentuan dan Validasi

- Produk harus tersedia agar dapat dipesan.
- Customer harus login sebelum menambahkan produk ke keranjang.
- Jumlah varian rasa yang dipilih harus sesuai dengan jumlah isi kemasan produk.
- Varian yang dipilih harus tersedia dan memiliki stok yang mencukupi.
- Customer tidak dapat menambahkan produk apabila pilihan varian belum sesuai.

## 7. Pengelolaan Keranjang

Data produk yang ditambahkan ke keranjang mencakup informasi produk, jumlah kemasan, dan pilihan varian rasa beserta jumlahnya.

Data keranjang disimpan pada penyimpanan browser agar pilihan produk customer tetap tersedia ketika berpindah halaman.

Data tersebut selanjutnya digunakan pada halaman Keranjang dan proses Checkout.