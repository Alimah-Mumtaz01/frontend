# Dokumentasi Halaman Login dan Register Customer

## 1. Deskripsi Fitur

Halaman Login dan Register digunakan oleh customer untuk masuk ke akun SoeSweet atau membuat akun baru.

Customer yang sudah memiliki akun dapat melakukan login, sedangkan customer baru dapat melakukan registrasi terlebih dahulu sebelum menggunakan fitur pemesanan.

## 2. Halaman Login

Halaman Login digunakan untuk mengautentikasi customer menggunakan email dan password.

### Fitur yang Tersedia
- Memasukkan email yang telah terdaftar.
- Memasukkan password akun.
- Validasi data sebelum login.
- Menyimpan token autentikasi dan informasi pengguna setelah login berhasil.
- Mengarahkan customer ke halaman yang sesuai setelah berhasil login.

## 3. Halaman Register

Halaman Register digunakan untuk membuat akun customer baru.

### Fitur yang Tersedia
- Mengisi nama customer.
- Mengisi alamat email.
- Mengisi nomor telepon.
- Mengisi password.
- Mengonfirmasi password.
- Validasi data sebelum registrasi.

## 4. Integrasi API

Halaman Login dan Register terhubung dengan backend SoeSweet untuk proses autentikasi dan pembuatan akun.

Proses yang dilakukan meliputi:
- Mengirim data login ke backend.
- Mengirim data registrasi ke backend.
- Menerima respons dari backend.
- Menyimpan token autentikasi dan informasi pengguna setelah login berhasil.

## 5. Proses Kerja

### Login
1. Customer membuka halaman Login.
2. Customer memasukkan email dan password.
3. Frontend melakukan validasi data.
4. Data dikirim ke backend.
5. Backend memeriksa kecocokan akun.
6. Jika berhasil, frontend menyimpan token dan informasi pengguna.
7. Customer diarahkan ke halaman sesuai hak aksesnya.

### Register
1. Customer membuka halaman Register.
2. Customer mengisi data pendaftaran.
3. Frontend melakukan validasi data.
4. Data dikirim ke backend.
5. Backend memproses pendaftaran akun.
6. Frontend menampilkan hasil proses registrasi.

## 6. Ketentuan dan Validasi

- Email harus diisi dengan format yang sesuai.
- Password wajib diisi.
- Data pendaftaran harus memenuhi ketentuan validasi.
- Akun yang digunakan untuk login harus sudah terdaftar.
- Fitur pemesanan hanya dapat digunakan setelah customer login.
- Akses halaman admin ditentukan berdasarkan role pengguna.

## 7. Pengelolaan Autentikasi

Token autentikasi digunakan untuk mengidentifikasi pengguna ketika mengakses fitur yang membutuhkan login.

Informasi autentikasi disimpan pada penyimpanan browser sesuai implementasi frontend. Token juga digunakan untuk membantu mengirim permintaan ke backend yang membutuhkan autentikasi.