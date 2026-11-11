# SoeSweet Frontend

Frontend dari aplikasi **SoeSweet**, yaitu aplikasi penjualan kue soes berbasis web yang menyediakan berbagai pilihan ukuran paket dan varian rasa. Frontend ini berfungsi sebagai antarmuka pengguna untuk mengakses seluruh fitur aplikasi, baik bagi customer maupun admin.

Frontend SoeSweet dikembangkan menggunakan React dan TypeScript dengan Tailwind CSS sebagai framework styling. Komunikasi dengan backend dilakukan melalui REST API untuk mengambil, mengirim, dan mengelola data aplikasi.

## Deskripsi Proyek

SoeSweet merupakan aplikasi penjualan kue soes yang memiliki dua jenis pengguna utama, yaitu customer dan admin.

Frontend SoeSweet menyediakan antarmuka bagi customer untuk melihat produk, memilih varian rasa, melakukan pemesanan, mengunggah bukti pembayaran, melihat riwayat pesanan, serta memberikan ulasan.

Selain itu, frontend menyediakan halaman khusus admin untuk mengelola aktivitas toko, mulai dari produk, varian rasa, pesanan, pembayaran, pelanggan, ulasan, hingga laporan penjualan.

Frontend dan backend dikembangkan secara terpisah dengan komunikasi menggunakan REST API.

## Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| React | Membangun antarmuka pengguna |
| TypeScript | Menambahkan sistem tipe data pada JavaScript |
| Tailwind CSS | Mengatur tampilan dan styling aplikasi |
| Vite | Development server dan proses build |
| React Router | Mengatur navigasi dan routing halaman |
| Lucide React | Menyediakan ikon antarmuka |
| REST API | Menghubungkan frontend dengan backend |
| LocalStorage | Menyimpan data tertentu pada browser |

## Fitur Frontend

### 1. Halaman Customer

Customer dapat mengakses berbagai fitur untuk melakukan pemesanan produk SoeSweet.

**Beranda**
- Menampilkan informasi dan identitas SoeSweet.
- Menampilkan produk unggulan.
- Menyediakan navigasi menuju halaman lainnya.

**Autentikasi**
- Registrasi akun customer.
- Login menggunakan email dan password.
- Menyimpan token autentikasi.
- Mengakses halaman sesuai status login.

**Produk**
- Menampilkan katalog produk.
- Melakukan pencarian produk.
- Melihat detail produk.
- Melihat informasi harga dan ukuran paket.
- Memilih varian rasa sesuai jumlah isi paket.

**Keranjang**
- Menambahkan produk ke keranjang.
- Mengatur jumlah pesanan.
- Memilih produk yang akan di-checkout.
- Menghapus produk dari keranjang.
- Menampilkan ringkasan produk yang dipilih.

**Checkout**
- Menampilkan ringkasan pesanan.
- Memilih metode pengambilan atau pengiriman.
- Mengisi alamat pengiriman.
- Menampilkan perhitungan total pembayaran.
- Melanjutkan proses pembuatan pesanan.

**Riwayat Pesanan**
- Menampilkan daftar pesanan customer.
- Melihat detail pesanan.
- Melihat status pesanan.
- Mengunggah bukti pembayaran.
- Melihat informasi pembayaran dan pesanan.

**Ulasan**
- Memberikan rating dan komentar setelah pesanan selesai.
- Mengunggah foto ulasan.
- Melihat ulasan.
- Melihat informasi produk dan varian yang terdapat dalam pesanan.

### 2. Halaman Admin

Admin memiliki akses terhadap halaman pengelolaan dan pemantauan aktivitas toko SoeSweet.

**Dashboard**
- Menampilkan jumlah pelanggan.
- Menampilkan grafik penjualan.
- Menampilkan produk terlaris.
- Menampilkan varian terlaris.
- Menampilkan pesanan terbaru.

**Manajemen Produk**
- Menampilkan daftar produk.
- Menambahkan produk baru.
- Mengubah informasi produk.
- Menghapus atau menonaktifkan produk.
- Mengelola gambar produk.

**Manajemen Varian**
- Menampilkan daftar varian rasa.
- Menambahkan varian baru.
- Mengubah informasi varian.
- Mengelola stok varian.
- Menghapus atau menonaktifkan varian.

**Manajemen Pesanan**
- Menampilkan daftar pesanan customer.
- Melihat detail pesanan.
- Memperbarui status pesanan.
- Mengelola proses pesanan berdasarkan statusnya.

**Manajemen Pembayaran**
- Menampilkan informasi pembayaran.
- Memeriksa bukti pembayaran customer.
- Menyetujui atau menolak pembayaran.

**Manajemen Pelanggan**
- Menampilkan daftar pelanggan.
- Melihat informasi pelanggan.
- Melihat riwayat pesanan setiap pelanggan.

**Manajemen Ulasan**
- Menampilkan ulasan customer.
- Melihat rating dan komentar.
- Melihat foto ulasan.
- Melihat detail produk dan varian yang dipesan.

**Laporan**
- Menampilkan informasi laporan penjualan.
- Menampilkan data pesanan.
- Menyediakan ringkasan transaksi berdasarkan periode.

## Struktur Folder

Berikut gambaran struktur folder frontend SoeSweet.

```text
frontend-soesweet/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── customer/
│   │   └── admin/
│   │
│   ├── services/
│   │
│   ├── types/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── docs/
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

**Keterangan:**

| Folder/File | Fungsi |
|---|---|
| `public/` | Menyimpan aset statis yang diakses secara langsung |
| `assets/` | Menyimpan gambar, ikon, dan aset aplikasi |
| `components/` | Menyimpan komponen antarmuka yang digunakan kembali |
| `layouts/` | Mengatur layout halaman customer dan admin |
| `pages/` | Menyimpan halaman aplikasi |
| `services/` | Mengelola komunikasi dan request ke backend API |
| `types/` | Menyimpan definisi tipe data TypeScript |
| `App.tsx` | Komponen utama aplikasi |
| `main.tsx` | Entry point aplikasi React |

## Integrasi Backend

Frontend SoeSweet berkomunikasi dengan backend melalui REST API.

Konfigurasi komunikasi API dilakukan menggunakan environment variable `VITE_API_BASE_URL`.

Beberapa kelompok endpoint yang digunakan meliputi:

| Modul | Fungsi |
|---|---|
| Authentication | Registrasi dan login pengguna |
| Users | Mengakses informasi pengguna |
| Products | Mengambil dan mengelola data produk |
| Variants | Mengambil dan mengelola data varian |
| Checkout | Mengambil preview checkout |
| Orders | Membuat dan mengelola pesanan |
| Reviews | Mengambil dan mengelola ulasan |
| Dashboard | Mengambil data dashboard admin |
| Reports | Mengambil data laporan |

Frontend menggunakan service API untuk mengirim request dan menerima respons dari backend.

Token JWT disertakan pada request yang membutuhkan autentikasi.

## Pengelolaan Data pada Browser

Frontend SoeSweet menggunakan LocalStorage untuk menyimpan beberapa informasi aplikasi.

| Key | Fungsi |
|---|---|
| `soesweet_token` | Menyimpan token autentikasi pengguna |
| `soesweet_user` | Menyimpan informasi pengguna |
| `soesweet_cart` | Menyimpan data keranjang belanja |
| `soesweet_selected_cart_items` | Menyimpan produk yang dipilih untuk checkout |

Selain itu, frontend menggunakan event `cartUpdated` untuk membantu memperbarui informasi keranjang pada komponen yang berkaitan.

Data yang disimpan di browser digunakan untuk mendukung interaksi aplikasi. Data utama seperti produk, stok, pesanan, pembayaran, dan ulasan tetap dikelola melalui backend.

## Autentikasi dan Proteksi Halaman

Frontend SoeSweet menerapkan sistem autentikasi menggunakan JWT yang diperoleh setelah pengguna berhasil login.

Beberapa ketentuan autentikasi meliputi:

- Customer harus login untuk menggunakan fitur pemesanan.
- Admin harus login menggunakan akun dengan role admin.
- Token digunakan untuk mengakses endpoint backend yang memerlukan autentikasi.
- Pengguna diarahkan ke halaman sesuai role dan status autentikasinya.

Validasi autentikasi dan otorisasi tetap dilakukan oleh backend sebagai bagian dari keamanan aplikasi.

## Dokumentasi

Dokumentasi teknis frontend SoeSweet disimpan di dalam folder `docs`.

Folder tersebut berisi penjelasan mengenai halaman customer, halaman admin, komponen, integrasi API, pengelolaan data, pengujian, dan deployment.

Setiap fitur didokumentasikan secara terpisah agar lebih mudah dipahami, diperbarui, dan dikembangkan.

---

**SoeSweet Frontend**

*Frontend application untuk aplikasi penjualan kue SoeSweet.*