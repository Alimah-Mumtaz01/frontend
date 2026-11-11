# Dokumentasi Halaman Manajemen Pesanan Admin

## 1. Deskripsi Fitur

Halaman Manajemen Pesanan merupakan halaman yang digunakan admin untuk melihat dan mengelola seluruh pesanan yang dibuat oleh customer melalui aplikasi SoeSweet.

Admin dapat memeriksa detail pesanan, melihat informasi customer, memeriksa produk dan varian rasa yang dipesan, serta memperbarui status pesanan sesuai dengan tahapan pemrosesan.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Manajemen Pesanan meliputi:

- **Sidebar:** Menampilkan menu navigasi admin.
- **Daftar Pesanan:** Menampilkan seluruh pesanan customer.
- **Pencarian:** Membantu admin menemukan pesanan berdasarkan informasi yang tersedia.
- **Filter Status:** Membantu admin menyaring pesanan berdasarkan statusnya.
- **Detail Pesanan:** Menampilkan informasi lengkap pesanan.
- **Informasi Customer:** Menampilkan identitas customer yang melakukan pemesanan.
- **Detail Produk:** Menampilkan produk, varian rasa, dan jumlah pesanan.
- **Rincian Pembayaran:** Menampilkan subtotal, biaya pengiriman, dan total pembayaran.
- **Informasi Pengiriman:** Menampilkan metode penerimaan pesanan dan alamat pengiriman jika menggunakan delivery.
- **Pengelolaan Status:** Digunakan untuk memperbarui status pesanan.

## 3. Fitur yang Tersedia

- Menampilkan seluruh pesanan customer.
- Mencari pesanan berdasarkan informasi yang tersedia.
- Memfilter pesanan berdasarkan status.
- Melihat detail pesanan.
- Melihat informasi customer.
- Melihat produk dan varian rasa yang dipesan.
- Melihat jumlah dan total pembayaran.
- Melihat metode pickup atau delivery.
- Memeriksa bukti pembayaran.
- Memperbarui status pesanan.
- Memantau perkembangan pesanan hingga selesai atau dibatalkan.

## 4. Integrasi API

Halaman Manajemen Pesanan terhubung dengan backend SoeSweet untuk mengambil data pesanan dan memperbarui statusnya.

Data pesanan yang digunakan meliputi:

- `id_order`
- Informasi customer.
- Tanggal pesanan.
- Daftar produk dan varian rasa.
- Jumlah pesanan.
- Subtotal.
- Biaya pengiriman.
- Total pembayaran.
- Metode penerimaan.
- Alamat pengiriman jika tersedia.
- Status pesanan.

Proses integrasi API meliputi:

- Mengambil daftar pesanan.
- Mengambil detail pesanan.
- Memperbarui status pesanan.
- Memuat kembali data setelah perubahan berhasil.

## 5. Proses Kerja

### Menampilkan Pesanan

1. Admin membuka halaman Manajemen Pesanan.
2. Frontend meminta daftar pesanan kepada backend.
3. Backend mengirimkan data pesanan.
4. Frontend menampilkan daftar pesanan.
5. Admin dapat menggunakan pencarian atau filter status.

### Melihat Detail Pesanan

1. Admin memilih salah satu pesanan.
2. Frontend mengambil atau menampilkan detail pesanan.
3. Admin melihat informasi customer, produk, varian, jumlah, dan pembayaran.
4. Admin memeriksa metode penerimaan pesanan serta informasi pengiriman.

### Memperbarui Status Pesanan

1. Admin memilih pesanan yang ingin diperbarui.
2. Admin membuka pengelolaan status.
3. Admin memilih status berikutnya sesuai kondisi pesanan.
4. Frontend mengirimkan perubahan status ke backend.
5. Backend memvalidasi dan menyimpan perubahan.
6. Frontend memperbarui informasi pesanan setelah proses berhasil.

## 6. Status Pesanan

Status pesanan yang digunakan dalam aplikasi SoeSweet meliputi:

| Status | Keterangan |
|---|---|
| `menunggu_konfirmasi` | Pesanan menunggu konfirmasi admin. |
| `pesanan_diterima` | Pesanan telah diterima oleh admin. |
| `menunggu_pembayaran` | Customer perlu melakukan pembayaran. |
| `pembayaran_diperiksa` | Bukti pembayaran sedang diperiksa. |
| `pembayaran_ditolak` | Bukti pembayaran ditolak. |
| `diproses` | Pesanan sedang dibuat atau dipersiapkan. |
| `siap_diambil` | Pesanan siap diambil customer. |
| `sedang_dikirim` | Pesanan sedang dikirim kepada customer. |
| `selesai` | Pesanan telah selesai. |
| `dibatalkan` | Pesanan telah dibatalkan. |

## 7. Ketentuan dan Validasi

- Halaman hanya dapat diakses oleh admin yang telah login.
- Admin dapat melihat seluruh pesanan customer.
- Perubahan status harus mengikuti alur pemrosesan pesanan.
- Status pesanan diperbarui melalui backend.
- Informasi pesanan ditampilkan berdasarkan data terbaru dari database.
- Metode pickup dan delivery memiliki informasi penerimaan yang berbeda.
- Pesanan yang telah selesai atau dibatalkan mengikuti ketentuan perubahan status yang diterapkan backend.

## 8. Pengelolaan Data Pesanan

Seluruh data pesanan disimpan pada database SoeSweet dan dikelola melalui backend.

Admin menggunakan halaman ini untuk memantau pesanan mulai dari pesanan diterima hingga selesai.

Setiap perubahan status akan digunakan untuk memperbarui informasi perkembangan pesanan yang ditampilkan pada halaman Riwayat Pesanan customer.