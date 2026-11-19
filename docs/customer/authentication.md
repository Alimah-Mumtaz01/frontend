# Dokumentasi Halaman Login dan Register Customer

## 1. Deskripsi Fitur

Halaman Login customer dan Register digunakan untuk masuk ke akun customer SoeSweet atau membuat akun customer baru. Admin menggunakan halaman login khusus.

Customer yang sudah memiliki akun dapat melakukan login, sedangkan customer baru dapat melakukan registrasi terlebih dahulu sebelum menggunakan fitur pemesanan.

## 2. Halaman Login

Halaman Login digunakan untuk mengautentikasi customer menggunakan email dan password.

### Fitur yang Tersedia
- Memasukkan email yang telah terdaftar.
- Memasukkan password akun.
- Validasi data sebelum login.
- Menyimpan token autentikasi dan informasi pengguna setelah login berhasil.
- Mengarahkan customer ke halaman tujuan setelah berhasil login.
- Menolak akun dengan role `admin` menggunakan pesan umum **“Email atau password salah.”**

Halaman login customer tersedia di `/login` dan hanya menerima akun dengan role `user`.

### Login Admin

Admin masuk melalui halaman khusus di `/secretloginadminsoesweet`. URL ini tidak ditampilkan pada navigasi umum. Halaman tersebut hanya menerima akun dengan role `admin`; akun dengan role lain ditolak dengan pesan **“Email atau password salah.”** Setelah berhasil login, admin diarahkan ke halaman yang dituju atau dashboard admin.

URL khusus hanya memisahkan alur antarmuka login dan bukan mekanisme otorisasi. Akses ke fitur admin tetap harus dilindungi validasi role dan token oleh backend.

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
7. Jika role akun adalah `user`, frontend menyimpan token dan informasi pengguna lalu mengarahkan customer ke halaman tujuan.
8. Jika role akun bukan `user`, frontend menolak login dan menampilkan pesan **“Email atau password salah.”**

### Login Admin
1. Admin membuka `/secretloginadminsoesweet`.
2. Admin memasukkan email dan password.
3. Frontend mengirim data login ke backend dan memeriksa bahwa role akun adalah `admin`.
4. Jika role sesuai, frontend menyimpan token dan informasi pengguna lalu mengarahkan admin ke halaman tujuan atau dashboard.
5. Jika role tidak sesuai, login ditolak dengan pesan **“Email atau password salah.”**

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
- `/login` hanya menerima role `user`, sedangkan `/secretloginadminsoesweet` hanya menerima role `admin`.
- Akses halaman admin tetap ditentukan dan divalidasi berdasarkan role pengguna serta token autentikasi.

## 7. Pengelolaan Autentikasi

Token autentikasi digunakan untuk mengidentifikasi pengguna ketika mengakses fitur yang membutuhkan login.

Informasi autentikasi disimpan pada penyimpanan browser sesuai implementasi frontend. Token juga digunakan untuk membantu mengirim permintaan ke backend yang membutuhkan autentikasi.