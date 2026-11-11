# Dokumentasi Halaman Admin Laporan

## 1. Deskripsi Halaman

Halaman Admin Laporan merupakan halaman yang digunakan oleh admin untuk melihat dan memantau laporan penjualan SoeSweet. Halaman ini membantu admin mengetahui perkembangan transaksi dan aktivitas penjualan berdasarkan data pesanan yang tersimpan di dalam database.

## 2. Komponen Halaman

Halaman Admin Laporan terdiri dari beberapa komponen utama:

- **Sidebar Admin**: Menampilkan navigasi menuju halaman dashboard, produk, varian, pesanan, pelanggan, ulasan, laporan.
- **Judul Halaman**: Menampilkan judul halaman laporan.
- **Filter Periode**: Digunakan untuk menentukan rentang waktu laporan.
- **Ringkasan Laporan**: Menampilkan informasi ringkas mengenai hasil penjualan.
- **Grafik Laporan**: Menampilkan data penjualan berdasarkan periode yang dipilih.

## 3. Fitur Halaman

### A. Melihat Ringkasan Penjualan

Admin dapat melihat ringkasan informasi penjualan berdasarkan data transaksi yang tersedia.

Informasi yang dapat ditampilkan meliputi:

- Total pendapatan.
- Jumlah pesanan.
- Jumlah produk dan varian terjual.

### B. Melihat Laporan Penjualan

Admin dapat melihat data penjualan untuk mengetahui perkembangan transaksi SoeSweet.

Data laporan disajikan dalam bentuk grafik agar lebih mudah dipahami.

### C. Memfilter Periode Laporan

Admin dapat memilih periode laporan untuk melihat data penjualan berdasarkan rentang waktu tertentu.

Contohnya:
- Harian.
- Mingguan.
- Bulanan.
- Rentang tanggal tertentu.

## 4. Integrasi API

Halaman laporan mengambil data dari backend melalui API laporan yang telah disediakan.

Data yang diterima digunakan untuk menampilkan ringkasan dan informasi penjualan pada halaman admin.

## 5. Sumber Data Laporan

Data laporan berasal dari informasi pesanan dan transaksi yang tersimpan di database SoeSweet.

Data tersebut digunakan untuk menghitung pendapatan dan jumlah pesanan berdasarkan periode laporan.

## 6. Hak Akses

Halaman laporan hanya dapat diakses oleh pengguna dengan role **admin**.

Pengguna yang belum login atau tidak memiliki hak akses admin tidak diperbolehkan mengakses halaman ini.

## 7. Tujuan Halaman

Halaman Admin Laporan dibuat untuk membantu admin:

- Memantau perkembangan penjualan SoeSweet.
- Mengetahui jumlah transaksi.
- Melihat ringkasan pendapatan.
- Mengevaluasi hasil penjualan berdasarkan periode tertentu.