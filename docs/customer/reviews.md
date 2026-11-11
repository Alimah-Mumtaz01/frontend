# Dokumentasi Halaman Ulasan Customer

## 1. Deskripsi Fitur

Halaman Ulasan merupakan halaman yang digunakan customer untuk melihat ulasan dan penilaian dari customer lain terhadap produk SoeSweet.

Ulasan berisi rating, komentar, foto, serta informasi produk dan varian rasa yang terdapat dalam pesanan. Halaman ini membantu customer memperoleh gambaran mengenai pengalaman pembelian customer lainnya.

Customer juga dapat memberikan ulasan setelah pesanan yang dilakukan telah selesai.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Ulasan meliputi:

- **Navbar:** Menampilkan navigasi utama aplikasi SoeSweet.
- **Daftar Ulasan:** Menampilkan kumpulan ulasan customer.
- **Informasi Customer:** Menampilkan nama customer yang memberikan ulasan.
- **Rating:** Menampilkan penilaian menggunakan bintang dengan skala 1–5.
- **Komentar:** Menampilkan pendapat atau pengalaman customer.
- **Foto Ulasan:** Menampilkan foto yang diunggah bersama ulasan.
- **Detail Produk:** Menampilkan produk dan varian rasa yang dipesan.
- **Footer:** Menampilkan informasi tambahan aplikasi.

## 3. Fitur yang Tersedia

- Menampilkan ulasan customer.
- Menampilkan rating dengan skala 1–5.
- Menampilkan komentar ulasan.
- Menampilkan foto yang disertakan dalam ulasan.
- Menampilkan informasi customer yang memberikan ulasan.
- Menampilkan detail produk dan varian rasa dalam pesanan.
- Memberikan ulasan untuk pesanan yang telah selesai melalui fitur yang tersedia.
- Menampilkan rating keseluruhan pesanan pada produk terkait.

## 4. Integrasi API

Halaman Ulasan terhubung dengan backend SoeSweet untuk mengambil dan mengirimkan data ulasan.

Data ulasan yang digunakan meliputi:

- Informasi customer.
- Informasi pesanan.
- Rating pesanan.
- Komentar ulasan.
- Foto ulasan.
- Detail produk dan varian rasa yang dipesan.

Foto ulasan dikirimkan ke backend menggunakan format `multipart/form-data`.

Maksimal foto yang dapat diunggah adalah 3 file dalam satu ulasan.

## 5. Proses Kerja

### Melihat Ulasan

1. Customer membuka halaman Ulasan.
2. Frontend meminta data ulasan kepada backend.
3. Backend mengirimkan data ulasan customer.
4. Frontend menampilkan rating, komentar, foto, dan detail produk.
5. Customer dapat melihat pengalaman pembelian customer lainnya.

### Memberikan Ulasan

1. Customer membuka halaman Riwayat Pesanan.
2. Customer memilih pesanan yang telah selesai.
3. Customer mengakses fitur pemberian ulasan.
4. Customer memberikan rating dengan skala 1–5.
5. Customer mengisi komentar ulasan.
6. Customer dapat menambahkan foto maksimal 3 file.
7. Frontend mengirimkan data ulasan ke backend.
8. Backend menyimpan ulasan.
9. Ulasan dapat ditampilkan pada halaman Ulasan setelah berhasil dimuat.

## 6. Ketentuan dan Validasi

- Customer harus login untuk memberikan ulasan.
- Ulasan hanya dapat diberikan untuk pesanan yang telah selesai.
- Rating menggunakan skala 1–5.
- Satu ulasan diberikan untuk satu pesanan.
- Komentar dan foto ditampilkan sebagai bagian dari ulasan pesanan.
- Maksimal foto yang dapat diunggah adalah 3 file.
- Data ulasan ditampilkan berdasarkan data yang tersimpan di backend.

## 7. Pengelolaan Data Ulasan

Sistem ulasan SoeSweet menggunakan konsep satu ulasan untuk satu pesanan.

Rating keseluruhan dari pesanan dapat ditampilkan pada setiap produk yang terdapat dalam pesanan tersebut. Namun, komentar dan foto ulasan tidak ditampilkan berulang kali pada setiap produk.

Pada halaman Ulasan, rating, komentar, foto, serta detail seluruh produk dan varian rasa dalam pesanan ditampilkan sebagai satu kesatuan ulasan.

Dengan mekanisme ini, satu pesanan hanya memiliki satu ulasan sehingga data penilaian tidak tercatat berulang untuk setiap produk.