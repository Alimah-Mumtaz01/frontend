# Dokumentasi Halaman Manajemen Pelanggan Admin

## 1. Deskripsi Fitur

Halaman Manajemen Pelanggan merupakan halaman yang digunakan admin untuk melihat informasi seluruh customer yang telah terdaftar pada aplikasi SoeSweet.

Admin dapat melihat data pelanggan dan membuka detail pelanggan untuk mengetahui informasi akun serta riwayat pesanan yang pernah dilakukan.

Halaman ini membantu admin memantau data pelanggan dan melihat aktivitas pemesanan setiap customer.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Manajemen Pelanggan meliputi:

- **Sidebar:** Menampilkan menu navigasi admin.
- **Daftar Pelanggan:** Menampilkan seluruh data customer.
- **Pencarian:** Membantu admin menemukan pelanggan berdasarkan informasi yang tersedia.
- **Detail Pelanggan:** Menampilkan informasi lengkap akun customer.
- **Riwayat Pesanan:** Menampilkan daftar pesanan yang pernah dilakukan pelanggan.
- **Detail Pesanan:** Menampilkan informasi produk, varian rasa, total pembayaran, dan status pesanan.

## 3. Fitur yang Tersedia

- Menampilkan daftar seluruh pelanggan.
- Mencari pelanggan berdasarkan informasi yang tersedia.
- Melihat detail informasi pelanggan.
- Melihat nama dan email pelanggan.
- Melihat nomor telepon apabila tersedia.
- Melihat tanggal pendaftaran akun.
- Melihat riwayat pesanan setiap pelanggan.
- Melihat detail pesanan pelanggan.
- Memantau status pesanan yang pernah dilakukan pelanggan.

## 4. Integrasi API

Halaman Manajemen Pelanggan terhubung dengan backend SoeSweet untuk memperoleh data akun customer dan riwayat pesanan.

Data pelanggan yang digunakan meliputi:

- `id_user`
- `nama`
- `email`
- `no_hp`
- `role`
- `createdAt`

Selain data pelanggan, halaman ini juga menggunakan data pesanan yang berkaitan dengan akun customer.

Proses integrasi API meliputi:

- Mengambil daftar pelanggan.
- Mengambil detail informasi pelanggan.
- Mengambil riwayat pesanan berdasarkan ID pelanggan.
- Menampilkan detail pesanan pelanggan.

## 5. Proses Kerja

### Menampilkan Daftar Pelanggan

1. Admin membuka halaman Manajemen Pelanggan.
2. Frontend meminta daftar pelanggan kepada backend.
3. Backend mengirimkan data pelanggan.
4. Frontend menampilkan daftar customer.
5. Admin dapat mencari pelanggan berdasarkan informasi yang tersedia.

### Melihat Detail Pelanggan

1. Admin memilih salah satu pelanggan.
2. Frontend mengambil informasi detail pelanggan.
3. Backend mengirimkan data akun dan riwayat pesanan pelanggan.
4. Frontend menampilkan informasi pelanggan.
5. Admin dapat melihat seluruh pesanan yang pernah dilakukan pelanggan.
6. Admin dapat membuka detail pesanan untuk melihat informasi lebih lengkap.

## 6. Ketentuan dan Validasi

- Halaman hanya dapat diakses oleh admin yang telah login.
- Data pelanggan diambil dari backend.
- Informasi pelanggan ditampilkan berdasarkan akun yang terdaftar.
- Riwayat pesanan hanya menampilkan pesanan milik pelanggan yang dipilih.
- Password pelanggan tidak ditampilkan pada halaman ini.
- Halaman ini digunakan untuk melihat informasi pelanggan dan riwayat pesanan, bukan untuk mengelola status pesanan.

## 7. Pengelolaan Data Pelanggan

Data pelanggan disimpan pada database SoeSweet dan dikelola melalui backend.

Halaman Manajemen Pelanggan berfungsi sebagai pusat informasi akun customer bagi admin.

Melalui halaman ini, admin dapat mengetahui identitas pelanggan serta melihat aktivitas pemesanan yang telah dilakukan tanpa perlu membuka halaman Manajemen Pesanan secara terpisah.