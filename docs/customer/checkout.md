# Dokumentasi Halaman Checkout Customer

## 1. Deskripsi Fitur

Halaman Checkout merupakan halaman yang digunakan customer untuk memeriksa dan mengonfirmasi pesanan sebelum pesanan dibuat.

Pada halaman ini, customer dapat memeriksa produk dan varian rasa yang dipilih, menentukan metode penerimaan pesanan, mengisi alamat pengiriman jika memilih delivery, serta melihat rincian biaya dan total pembayaran.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Checkout meliputi:

- **Navbar:** Menampilkan navigasi utama aplikasi SoeSweet.
- **Ringkasan Pesanan:** Menampilkan produk, varian rasa, jumlah, dan harga.
- **Metode Penerimaan:** Menyediakan pilihan pengambilan langsung (*pickup*) atau pengiriman (*delivery*).
- **Alamat Pengiriman:** Menampilkan form alamat apabila customer memilih delivery.
- **Rincian Pembayaran:** Menampilkan subtotal, biaya pengiriman, dan total pembayaran.
- **Tombol Buat Pesanan:** Mengirimkan pesanan untuk diproses oleh backend.
- **Footer:** Menampilkan informasi tambahan aplikasi.

## 3. Fitur yang Tersedia

- Menampilkan produk yang dipilih dari halaman Keranjang.
- Menampilkan detail varian rasa dan jumlah pesanan.
- Memilih metode penerimaan pesanan.
- Mengisi alamat pengiriman untuk metode delivery.
- Menghitung subtotal pesanan.
- Menghitung biaya pengiriman.
- Menampilkan total pembayaran.
- Melakukan preview pesanan sebelum dikonfirmasi.
- Membuat pesanan setelah customer melakukan konfirmasi.

## 4. Integrasi API

Halaman Checkout terhubung dengan backend SoeSweet melalui dua proses utama:

### Preview Checkout

Menggunakan endpoint:

`POST /api/checkout/preview`

Proses ini digunakan untuk memeriksa rincian pesanan sebelum dibuat. Preview tidak membuat pesanan baru dan tidak mengurangi stok varian.

### Pembuatan Pesanan

Setelah customer mengonfirmasi pesanan, frontend mengirimkan data pesanan melalui:

`POST /api/orders`

Backend memproses pesanan dan menyimpannya ke database dengan status awal `menunggu_konfirmasi`.

## 5. Proses Kerja

1. Customer membuka halaman Checkout dari Keranjang.
2. Frontend mengambil data produk yang telah dipilih.
3. Customer memeriksa rincian produk dan varian rasa.
4. Customer memilih metode pickup atau delivery.
5. Jika memilih delivery, customer mengisi alamat pengiriman.
6. Frontend mengirimkan data ke backend untuk preview checkout.
7. Backend mengembalikan rincian pesanan.
8. Frontend menampilkan subtotal, biaya pengiriman, dan total pembayaran.
9. Customer memeriksa kembali pesanan.
10. Customer mengonfirmasi pesanan.
11. Frontend mengirimkan permintaan pembuatan pesanan ke backend.
12. Jika berhasil, customer diarahkan ke halaman riwayat pesanan.

## 6. Ketentuan dan Validasi

- Customer harus login sebelum melakukan Checkout.
- Produk yang diproses hanya produk yang dipilih dari keranjang.
- Pilihan varian rasa harus sesuai dengan jumlah isi.
- Stok varian harus mencukupi.
- Metode penerimaan pesanan harus dipilih.
- Alamat pengiriman wajib diisi apabila memilih delivery.
- Pesanan delivery memiliki minimum pembelian Rp50.000.
- Biaya pickup adalah Rp0.
- Biaya delivery mengikuti konfigurasi biaya pengiriman aplikasi.
- Preview Checkout tidak membuat pesanan dan tidak mengurangi stok.
- Pesanan baru dibuat setelah customer melakukan konfirmasi.

## 7. Pengelolaan Data Pesanan

Data yang dikirimkan saat pembuatan pesanan mencakup informasi produk, varian rasa, jumlah pesanan, metode penerimaan, alamat pengiriman jika diperlukan, serta rincian pembayaran.

Setelah pesanan berhasil dibuat, data pesanan disimpan oleh backend dan dapat dilihat customer melalui halaman Riwayat Pesanan.

Keranjang akan diperbarui sesuai mekanisme pengelolaan item terpilih setelah proses pembuatan pesanan berhasil.