# Dokumentasi Halaman Manajemen Varian Admin

## 1. Deskripsi Fitur

Halaman Manajemen Varian merupakan halaman yang digunakan admin untuk mengelola data varian rasa kue soes yang tersedia di SoeSweet.

Admin dapat melihat daftar varian rasa, menambahkan varian baru, mengubah informasi varian, menghapus varian, serta mengatur jumlah stok dan status ketersediaannya.

Varian rasa yang tersedia di SoeSweet meliputi Original, Strawberry, Cokelat, Durian, Matcha, Blueberry, Mangga, dan Tiramisu.

## 2. Komponen Halaman

Komponen yang terdapat pada halaman Manajemen Varian meliputi:

- **Sidebar:** Menampilkan menu navigasi admin.
- **Daftar Varian:** Menampilkan seluruh data varian rasa.
- **Pencarian:** Membantu admin menemukan varian berdasarkan nama.
- **Form Tambah Varian:** Digunakan untuk menambahkan varian rasa baru.
- **Form Edit Varian:** Digunakan untuk memperbarui informasi varian.
- **Informasi Stok:** Menampilkan jumlah stok setiap varian.
- **Status Varian:** Menampilkan status aktif atau nonaktif.

## 3. Fitur yang Tersedia

- Menampilkan daftar varian rasa.
- Mencari varian berdasarkan nama.
- Menambahkan varian rasa baru.
- Mengubah nama varian.
- Mengatur jumlah stok varian.
- Menghapus varian.
- Mengatur status varian menjadi aktif atau nonaktif.
- Menampilkan informasi ketersediaan stok.
- Menampilkan gambar ilustrasi untuk membantu mengenali varian rasa.

## 4. Integrasi API

Halaman Manajemen Varian terhubung dengan backend SoeSweet untuk melakukan pengelolaan data varian.

Data varian yang digunakan meliputi:

- `id_varian`
- `nama_varian`
- `stok`
- `status`

Proses integrasi API meliputi:

- Mengambil daftar varian.
- Menambahkan varian baru.
- Memperbarui data varian.
- Menghapus varian.

Gambar yang ditampilkan pada halaman varian hanya digunakan sebagai ilustrasi frontend dan tidak disimpan sebagai gambar pada database varian.

## 5. Proses Kerja

### Menampilkan Varian

1. Admin membuka halaman Manajemen Varian.
2. Frontend meminta data varian kepada backend.
3. Backend mengirimkan daftar varian.
4. Frontend menampilkan informasi varian beserta stok dan statusnya.

### Menambahkan Varian

1. Admin menekan tombol Tambah Varian.
2. Frontend menampilkan form penambahan varian.
3. Admin mengisi nama varian dan jumlah stok.
4. Admin menyimpan data varian.
5. Frontend mengirimkan data ke backend.
6. Backend memvalidasi dan menyimpan data varian.
7. Daftar varian diperbarui setelah proses berhasil.

### Mengubah Varian

1. Admin memilih varian yang ingin diubah.
2. Frontend menampilkan form edit.
3. Admin memperbarui nama, stok, atau status varian.
4. Admin menyimpan perubahan.
5. Frontend mengirimkan data terbaru ke backend.
6. Daftar varian diperbarui setelah perubahan berhasil.

### Menghapus Varian

1. Admin memilih varian yang ingin dihapus.
2. Frontend menampilkan konfirmasi penghapusan.
3. Admin menyetujui tindakan tersebut.
4. Frontend mengirimkan permintaan penghapusan ke backend.
5. Daftar varian diperbarui setelah penghapusan berhasil.

## 6. Ketentuan dan Validasi

- Halaman hanya dapat diakses oleh admin yang telah login.
- Nama varian wajib diisi.
- Jumlah stok harus berupa angka yang valid.
- Stok tidak boleh bernilai negatif.
- Varian nonaktif tidak dapat dipilih customer untuk pemesanan.
- Ketersediaan varian mengikuti jumlah stok yang tersimpan di backend.
- Penghapusan varian perlu memperhatikan keterkaitannya dengan data pesanan.

## 7. Pengelolaan Data Varian

Data varian disimpan pada database SoeSweet dan dikelola melalui backend.

Admin bertanggung jawab menjaga informasi nama, stok, dan status varian agar selalu sesuai dengan kondisi persediaan toko.

Gambar ilustrasi varian dikelola pada frontend sebagai aset tampilan. Gambar tersebut tidak menjadi bagian dari data yang disimpan pada tabel varian di database.