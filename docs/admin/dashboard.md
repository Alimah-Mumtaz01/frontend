# Dokumentasi Halaman Dashboard Admin

## 1. Deskripsi Fitur

Dashboard Admin merupakan halaman utama yang ditampilkan setelah admin berhasil login ke aplikasi SoeSweet.

Halaman ini digunakan untuk memantau kondisi toko secara keseluruhan melalui informasi ringkasan penjualan, pesanan, pelanggan, dan produk.

Dashboard membantu admin memperoleh gambaran aktivitas toko tanpa harus membuka setiap halaman pengelolaan data.

## 2. Komponen Halaman

Komponen yang terdapat pada Dashboard Admin meliputi:

- **Sidebar:** Menampilkan menu navigasi untuk mengakses halaman pengelolaan admin.
- **Kartu Statistik:** Menampilkan ringkasan data toko.
- **Grafik Penjualan:** Menampilkan perkembangan penjualan berdasarkan periode tertentu.
- **Informasi Pesanan:** Menampilkan ringkasan aktivitas pesanan.
- **Informasi Produk:** Menampilkan ringkasan data produk.
- **Informasi Pelanggan:** Menampilkan ringkasan jumlah pelanggan.

## 3. Fitur yang Tersedia

- Menampilkan ringkasan statistik toko.
- Menampilkan informasi jumlah produk.
- Menampilkan informasi jumlah pelanggan.
- Menampilkan informasi pesanan.
- Menampilkan grafik penjualan.
- Memilih periode grafik penjualan, seperti 7 hari atau 30 hari.
- Mengakses halaman pengelolaan melalui sidebar.

## 4. Integrasi API

Dashboard Admin terhubung dengan backend SoeSweet untuk memperoleh data statistik dan laporan ringkas toko.

Data yang digunakan meliputi:

- Jumlah produk.
- Jumlah pelanggan.
- Jumlah pesanan.
- Total penjualan.
- Data penjualan berdasarkan periode.

Data ditampilkan berdasarkan respons API dashboard yang disediakan oleh backend.

## 5. Proses Kerja

1. Admin melakukan login menggunakan akun admin.
2. Frontend memeriksa autentikasi dan hak akses pengguna.
3. Admin diarahkan ke halaman Dashboard.
4. Frontend meminta data statistik kepada backend.
5. Backend mengirimkan data ringkasan toko.
6. Frontend menampilkan statistik dan grafik penjualan.
7. Admin dapat memilih periode grafik untuk melihat perkembangan penjualan.
8. Admin dapat menggunakan sidebar untuk membuka halaman pengelolaan lainnya.

## 6. Ketentuan dan Validasi

- Dashboard hanya dapat diakses oleh pengguna dengan role admin.
- Admin harus login terlebih dahulu.
- Data statistik ditampilkan berdasarkan data yang diterima dari backend.
- Grafik penjualan menyesuaikan periode yang dipilih.

## 7. Pengelolaan Data Dashboard

Data pada Dashboard Admin bersumber dari database SoeSweet melalui backend.

Dashboard berfungsi sebagai pusat informasi untuk membantu admin memantau aktivitas toko, sedangkan proses penambahan, perubahan, penghapusan, dan pemeriksaan data dilakukan melalui halaman pengelolaan masing-masing.