# Dokumentasi Halaman Riwayat Pesanan Customer

## 1. Deskripsi Fitur

Halaman Riwayat Pesanan merupakan halaman yang digunakan customer untuk melihat seluruh pesanan yang telah dibuat melalui aplikasi SoeSweet.

Customer dapat memeriksa informasi pesanan, produk dan varian rasa, total pembayaran, metode penerimaan pesanan, serta perkembangan status pesanan.

Halaman ini juga menyediakan fitur untuk mengunggah bukti pembayaran sesuai instruksi pembayaran yang diberikan oleh SoeSweet.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Riwayat Pesanan meliputi:

- **Navbar:** Menampilkan navigasi utama aplikasi SoeSweet.
- **Daftar Pesanan:** Menampilkan riwayat pesanan customer.
- **Informasi Pesanan:** Menampilkan nomor pesanan, tanggal, dan status pesanan.
- **Detail Produk:** Menampilkan produk, gambar, varian rasa, dan jumlah pesanan.
- **Rincian Pembayaran:** Menampilkan subtotal, biaya pengiriman, dan total pembayaran.
- **Informasi Penerimaan:** Menampilkan metode pickup atau delivery serta alamat pengiriman jika tersedia.
- **Form Pembayaran:** Digunakan untuk mengunggah bukti pembayaran.
- **Footer:** Menampilkan informasi tambahan aplikasi.

## 3. Fitur yang Tersedia

- Menampilkan seluruh riwayat pesanan customer.
- Melihat nomor dan tanggal pesanan.
- Melihat produk beserta varian rasa yang dipesan.
- Melihat jumlah pesanan dan rincian pembayaran.
- Melihat metode penerimaan pesanan.
- Melihat status terbaru pesanan.
- Mengunggah bukti pembayaran.
- Melihat status pemeriksaan pembayaran.
- Melihat informasi rekening bank dan akun e-wallet SoeSweet.
- Melihat informasi pesanan yang siap diambil atau sedang dikirim.
- Membeli lagi pesanan yang sudah selesai dengan produk, varian, dan jumlah yang sama.
- Mengubah metode pengiriman pada pesanan yang menunggu konfirmasi dan subtotalnya minimal Rp50.000.

## 4. Integrasi API

Halaman Riwayat Pesanan menggunakan API backend SoeSweet untuk mengambil data pesanan customer dan mengirimkan bukti pembayaran.

Proses integrasi meliputi:

- Mengambil daftar pesanan berdasarkan akun customer yang sedang login.
- Mengambil detail pesanan beserta item dan varian rasa.
- Mengirimkan file bukti pembayaran ke backend.
- Memperbarui informasi pesanan setelah pembayaran dikirim atau status pesanan berubah.

Bukti pembayaran dikirim menggunakan format `multipart/form-data`.

Format file yang diperbolehkan:
- JPG
- JPEG
- PNG
- WEBP

Ukuran maksimal file adalah 5 MB.

## 5. Proses Kerja

### Melihat Riwayat Pesanan

1. Customer membuka halaman Riwayat Pesanan.
2. Frontend mengambil data pesanan dari backend.
3. Backend mengirimkan daftar pesanan milik customer.
4. Frontend menampilkan informasi pesanan.
5. Customer dapat membuka detail pesanan untuk melihat informasi lebih lengkap.

### Mengunggah Bukti Pembayaran

1. Customer membuka detail pesanan yang membutuhkan pembayaran.
2. Customer melihat informasi rekening bank atau e-wallet SoeSweet.
3. Customer melakukan pembayaran sesuai instruksi yang tersedia.
4. Customer memilih file bukti pembayaran.
5. Frontend memvalidasi format dan ukuran file.
6. Customer mengirimkan bukti pembayaran.
7. Frontend mengunggah file ke backend.
8. Backend menyimpan bukti pembayaran dan memperbarui status pesanan.
9. Customer dapat melihat perkembangan pemeriksaan pembayaran.

### Membeli Lagi Pesanan Selesai

1. Customer memilih tombol **Beli Lagi** pada pesanan berstatus selesai.
2. Frontend menyiapkan kembali produk, komposisi varian per paket, dan jumlah paket dari pesanan tersebut.
3. Customer diarahkan ke checkout untuk memeriksa ketersediaan dan membuat pesanan baru.
4. Isi keranjang yang sudah ada tidak digabungkan atau dihapus oleh proses beli lagi.

### Mengubah Metode Pengiriman

1. Customer memilih **Ubah Pengiriman** pada pesanan berstatus menunggu konfirmasi dengan subtotal minimal Rp50.000.
2. Customer memilih pickup atau delivery.
3. Jika memilih delivery, customer memasukkan alamat pengiriman.
4. Backend memvalidasi pesanan dan menghitung ulang ongkir serta total pembayaran.
5. Setelah berhasil, halaman menampilkan metode pengiriman dan total terbaru.

## 6. Status Pesanan

Status pesanan yang digunakan dalam aplikasi SoeSweet meliputi:

| Status | Keterangan |
|---|---|
| `menunggu_konfirmasi` | Pesanan menunggu konfirmasi admin. |
| `pesanan_diterima` | Pesanan telah diterima oleh admin. |
| `menunggu_pembayaran` | Customer perlu melakukan pembayaran. |
| `pembayaran_diperiksa` | Bukti pembayaran sedang diperiksa admin. |
| `pembayaran_ditolak` | Bukti pembayaran ditolak. |
| `diproses` | Pesanan sedang dibuat atau dipersiapkan. |
| `siap_diambil` | Pesanan siap diambil customer. |
| `sedang_dikirim` | Pesanan sedang dalam proses pengiriman. |
| `selesai` | Pesanan telah selesai. |
| `dibatalkan` | Pesanan telah dibatalkan. |

## 7. Ketentuan dan Validasi

- Customer hanya dapat melihat pesanan milik akunnya yang sedang login.
- Bukti pembayaran hanya dapat diunggah pada pesanan yang membutuhkan pembayaran.
- File bukti pembayaran harus menggunakan format JPG, JPEG, PNG, atau WEBP.
- Ukuran maksimal bukti pembayaran adalah 5 MB.
- Bukti pembayaran yang telah dikirim akan melalui pemeriksaan admin.
- Status pesanan ditampilkan berdasarkan data terbaru dari backend.
- Fitur yang tersedia pada setiap pesanan mengikuti status pesanan tersebut.
- Metode pengiriman hanya dapat diubah saat pesanan menunggu konfirmasi.
- Delivery mensyaratkan subtotal minimal Rp50.000 dan alamat pengiriman; ongkir dihitung oleh backend.

## 8. Pengelolaan Data Pembayaran

Informasi pembayaran yang ditampilkan pada halaman ini meliputi:

**Rekening Bank**
- Nama bank: SMBC
- Nomor rekening: 1234567890
- Nama pemilik: SoeSweet

**E-Wallet**
- Penyedia: DANA, GoPay, OVO, dan ShopeePay
- Nomor akun: 087654321
- Username: SoeSweet

Informasi pembayaran digunakan sebagai panduan customer ketika melakukan pembayaran pesanan secara manual.

Setelah bukti pembayaran diunggah, admin akan melakukan pemeriksaan sebelum pesanan dilanjutkan ke proses berikutnya.