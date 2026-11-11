# Dokumentasi Halaman Manajemen Ulasan Admin

## 1. Deskripsi Halaman

Halaman Manajemen Ulasan Admin merupakan halaman yang digunakan oleh admin untuk melihat dan memantau ulasan pelanggan terhadap produk SoeSweet.

Ulasan diberikan oleh pelanggan setelah pesanan berstatus selesai. Setiap ulasan mewakili satu pesanan dan dapat berisi penilaian, komentar, foto, serta daftar produk dan varian rasa yang dipesan.

## 2. Komponen Halaman

Halaman Manajemen Ulasan Admin terdiri dari beberapa komponen utama:

- **Sidebar Admin**: Menampilkan navigasi menuju halaman dashboard, produk, varian, pesanan,  pelanggan, ulasan, laporan.
- **Judul Halaman**: Menampilkan judul halaman manajemen ulasan.
- **Daftar Ulasan**: Menampilkan ulasan yang telah diberikan oleh pelanggan.
- **Informasi Pelanggan**: Menampilkan identitas pelanggan yang memberikan ulasan.
- **Rating**: Menampilkan penilaian pelanggan dalam skala 1–5.
- **Komentar Ulasan**: Menampilkan komentar yang ditulis pelanggan.
- **Foto Ulasan**: Menampilkan foto yang diunggah pelanggan.
- **Detail Pesanan**: Menampilkan produk dan varian rasa yang terdapat dalam pesanan yang diulas.

## 3. Fitur Halaman

### A. Melihat Daftar Ulasan

Admin dapat melihat seluruh ulasan pelanggan yang telah tersimpan di dalam sistem.

Setiap ulasan menampilkan informasi seperti:

- Nama pelanggan.
- Rating atau penilaian.
- Komentar pelanggan.
- Foto ulasan apabila tersedia.
- Informasi pesanan.

### B. Melihat Detail Ulasan

Admin dapat melihat informasi lebih lengkap dari setiap ulasan, termasuk detail produk dan varian rasa yang dipesan oleh pelanggan.

Dengan demikian, admin dapat mengetahui produk apa saja yang termasuk dalam pesanan yang mendapatkan ulasan tersebut.

### C. Melihat Rating Pesanan

Rating diberikan dalam skala 1–5 bintang.

Satu pesanan hanya memiliki satu ulasan dan satu rating keseluruhan. Rating tersebut dapat ditampilkan pada setiap produk yang terdapat dalam pesanan agar penilaian produk tetap dapat ditampilkan pada halaman produk.

### D. Melihat Komentar dan Foto

Admin dapat melihat komentar serta foto yang diberikan pelanggan sebagai bagian dari ulasan.

Pelanggan dapat memberikan maksimal tiga foto dalam satu ulasan. Komentar dan foto ditampilkan sebagai satu kesatuan ulasan pesanan, bukan sebagai ulasan terpisah untuk setiap produk.

## 4. Ketentuan Ulasan

Sistem ulasan SoeSweet memiliki beberapa ketentuan:

1. Pelanggan hanya dapat memberikan ulasan setelah pesanan selesai.
2. Satu pesanan hanya dapat memiliki satu ulasan.
3. Rating menggunakan skala 1–5 bintang.
4. Pelanggan dapat menambahkan komentar.
5. Pelanggan dapat mengunggah maksimal tiga foto.
6. Satu ulasan menampilkan seluruh produk dan varian rasa yang terdapat dalam pesanan tersebut.

## 5. Integrasi API

Halaman Manajemen Ulasan Admin mengambil data ulasan dari backend melalui API ulasan yang telah disediakan.

Data yang diterima digunakan untuk menampilkan informasi pelanggan, rating, komentar, foto, serta detail produk dan varian rasa dalam pesanan.

## 6. Hak Akses

Halaman Manajemen Ulasan hanya dapat diakses oleh pengguna dengan role **admin**.

Pelanggan tidak dapat mengakses halaman manajemen ulasan admin.

## 7. Tujuan Halaman

Halaman Manajemen Ulasan Admin dibuat untuk membantu admin:

- Memantau penilaian pelanggan terhadap SoeSweet.
- Mengetahui komentar dan tanggapan pelanggan.
- Melihat dokumentasi foto dari pelanggan.
- Mengetahui produk dan varian rasa yang terdapat dalam pesanan yang diulas.
- Mengevaluasi kualitas produk dan pelayanan berdasarkan ulasan pelanggan.