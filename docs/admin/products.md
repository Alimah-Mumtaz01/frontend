# Dokumentasi Halaman Manajemen Produk Admin

## 1. Deskripsi Fitur

Halaman Manajemen Produk merupakan halaman yang digunakan admin untuk mengelola seluruh data produk kue soes yang tersedia di aplikasi SoeSweet.

Admin dapat melihat daftar produk, menambahkan produk baru, mengubah informasi produk, menghapus produk, serta mengatur status ketersediaan produk.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Manajemen Produk meliputi:

- **Sidebar:** Menampilkan menu navigasi admin.
- **Daftar Produk:** Menampilkan seluruh data produk.
- **Pencarian:** Membantu admin menemukan produk berdasarkan kata kunci.
- **Form Tambah Produk:** Digunakan untuk memasukkan data produk baru.
- **Form Edit Produk:** Digunakan untuk memperbarui informasi produk.
- **Upload Gambar:** Digunakan untuk menambahkan atau mengganti foto produk.
- **Status Produk:** Menampilkan status aktif atau nonaktif produk.

## 3. Fitur yang Tersedia

- Menampilkan daftar produk.
- Mencari produk berdasarkan nama.
- Menambahkan produk baru.
- Mengubah informasi produk.
- Menghapus produk.
- Mengunggah gambar produk.
- Mengganti gambar produk.
- Mengatur status produk menjadi aktif atau nonaktif.
- Menampilkan informasi harga dan jumlah isi kemasan.
- Menampilkan deskripsi produk.

## 4. Integrasi API

Halaman Manajemen Produk terhubung dengan backend SoeSweet untuk melakukan pengelolaan data produk.

Data produk yang digunakan meliputi:

- `id_product`
- `nama_product`
- `jumlah_isi`
- `harga`
- `deskripsi`
- `gambar`
- `status`

Proses integrasi API meliputi:

- Mengambil daftar produk.
- Menambahkan produk baru.
- Memperbarui data produk.
- Menghapus produk.
- Mengunggah gambar produk.

## 5. Proses Kerja

### Menampilkan Produk

1. Admin membuka halaman Manajemen Produk.
2. Frontend meminta daftar produk kepada backend.
3. Backend mengirimkan data produk.
4. Frontend menampilkan produk dalam bentuk daftar atau tabel.

### Menambahkan Produk

1. Admin menekan tombol Tambah Produk.
2. Frontend menampilkan form penambahan produk.
3. Admin mengisi nama, harga, jumlah isi, deskripsi, dan gambar produk.
4. Admin menyimpan data produk.
5. Frontend mengirimkan data ke backend.
6. Backend memvalidasi dan menyimpan produk.
7. Frontend memperbarui daftar produk setelah proses berhasil.

### Mengubah Produk

1. Admin memilih produk yang ingin diubah.
2. Frontend menampilkan form edit dengan data produk sebelumnya.
3. Admin mengubah informasi yang diperlukan.
4. Admin menyimpan perubahan.
5. Frontend mengirimkan data terbaru ke backend.
6. Daftar produk diperbarui setelah perubahan berhasil.

### Menghapus Produk

1. Admin memilih produk yang ingin dihapus.
2. Frontend menampilkan konfirmasi penghapusan.
3. Admin menyetujui tindakan tersebut.
4. Frontend mengirimkan permintaan penghapusan ke backend.
5. Daftar produk diperbarui setelah penghapusan berhasil.

## 6. Ketentuan dan Validasi

- Halaman hanya dapat diakses oleh admin yang telah login.
- Nama produk wajib diisi.
- Harga produk harus berupa nilai yang valid.
- Jumlah isi kemasan harus sesuai dengan pilihan yang tersedia.
- Gambar produk harus menggunakan format yang didukung backend.
- Data produk harus memenuhi validasi sebelum disimpan.
- Produk nonaktif tidak ditampilkan sebagai produk yang dapat dipesan oleh customer.
- Perubahan data produk akan memengaruhi informasi produk yang ditampilkan pada halaman customer.

## 7. Pengelolaan Data Produk

Data produk disimpan pada database SoeSweet dan dikelola melalui backend.

Admin dapat mengatur informasi produk sesuai kebutuhan toko. Gambar produk disimpan melalui mekanisme upload backend, sedangkan informasi lokasi gambar disimpan pada data produk.

Perubahan data produk akan digunakan oleh halaman customer untuk menampilkan informasi produk terbaru.