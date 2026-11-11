# Flow Penggunaan Aplikasi KKPUS Ecosystem

Dokumentasi alur integrasi frontend portal anggota (`kkpusid`) dan backend REST API (`api.kkpus.id`).

---

## 1. Arsitektur Komunikasi

```
Pengguna (Browser / Mobile PWA)
               │
               ▼
   [kkpusid: Frontend React 18 + Vite]
         (Port 3000 / HTTPS)
               │
               ├────────────────────────────────────────┐
               │ HTTPS (REST API - Axios + JWT/Cookie)   │ WSS (Socket.IO Events)
               ▼                                        ▼
    [api.kkpus.id: Backend Express 5 + Sequelize]
         (Port 3000 HTTP / 3445 HTTPS)
               │
               ├─▶ Database (MySQL / MariaDB)
               ├─▶ Payment Gateway (Midtrans / DOKU)
               ├─▶ Web Push & Email Notification (Nodemailer)
               └─▶ Background Cron Jobs (Penagihan, Reminder)
```

---

## 2. Alur Penggunaan End-to-End

### A. Autentikasi & Onboarding Anggota (KYC)
1. **Pendaftaran (Registration)**:
   - Pengguna buka form registrasi di `kkpusid` (`/register`).
   - Input nama lengkap, nomor HP, email, kata sandi.
   - Frontend panggil `POST /api/auth/register`.
   - Backend memvalidasi format, hash password dengan `bcrypt`, dan mencatat profil status awal `PENDING_VERIFICATION`.
2. **Masuk (Login) & Pengelolaan Sesi**:
   - Pengguna input kredensial pada `/login`.
   - Frontend kirim `POST /api/auth/accountLogin`.
   - Backend memverifikasi akun, membuat JWT token, dan memasang HttpOnly Cookie.
   - Frontend menerima token, menyimpannya untuk Axios Bearer Interceptor, dan meminta data sesi via `GET /api/auth/me`.
3. **Verifikasi Identitas (KYC)**:
   - Pengguna masuk menu Verifikasi / Profil.
   - Mengambil foto KTP dan Swafoto via modul kamera `react-webcam` atau unggah berkas.
   - Dikirim ke backend `POST /api/anggota/profile` (diproses `multer` & `sharp`).
   - Berkas masuk antrean peninjauan oleh admin/pengurus di `api.kkpus.id`.

---

### B. Simpanan & Tabungan Syariah
1. **Penyetoran Simpanan (Pokok / Wajib / Sukarela)**:
   - Anggota memilih jenis simpanan dan nominal pada antarmuka simpanan `kkpusid`.
   - Frontend panggil `POST /api/billing/create-deposit` atau endpoint Midtrans `POST /api/billing/midtrans-transaction`.
   - Backend menerbitkan Snap Token / Virtual Account / QRIS.
   - Anggota menyelesaikan pembayaran melalui payment gateway.
   - Webhook backend (`POST /webhooks/midtrans`) menerima callback sukses dan memutakhirkan saldo buku besar (`ledgerHelper.js`).
2. **Penarikan Simpanan Sukarela (Withdrawal)**:
   - Anggota mengajukan penarikan pada form penarikan: nominal, rekening tujuan, metode transfer.
   - Frontend panggil `POST /api/savings/request-withdrawal`.
   - Backend memeriksa kecukupan saldo minimal dan membuat tiket penarikan berstatus `PENDING`.
   - Bendahara memverifikasi dan mengeksekusi pencairan via `POST /api/savings/disburse/:withdrawal_id` (opsi otomatis via IRIS/Midtrans Disbursement atau transfer manual dengan unggah bukti transfer).

---

### C. Pembiayaan Syariah & Program Pinjaman
1. **Pengajuan Pembiayaan**:
   - Anggota memilih produk (Murabahah, Mudharabah, Ijarah, Qardh), menentukan tenor dan plafon pinjaman.
   - Frontend mengirim data ke `POST /api/financing/apply`.
   - Backend memvalidasi limit risiko pembiayaan anggota.
2. **Persetujuan Komite (Multi-Level Approvals)**:
   - Pengurus/komite memeriksa pengajuan melalui antrean `/api/approvals`.
   - Status diperbarui berjenjang (Disetujui / Ditolak / Butuh Revisi).
3. **Pencairan & Pembayaran Angsuran**:
   - Setelah akad disetujui, dana dicairkan.
   - Cron job harian/bulanan menerbitkan tagihan angsuran ke modul billing (`/api/billing`).
   - Anggota membayar cicilan melalui portal atau transfer bank manual.

---

### D. Program Arisan & Komunitas
1. **Pendaftaran Batch Arisan**:
   - Anggota melihat daftar arisan aktif via `GET /api/program/arisan/available`.
   - Memilih slot nomor undian dan mengonfirmasi keikutsertaan via `POST /api/program/arisan/batches/:batchId/participants`.
2. **Pembayaran Iuran & Undian (Draw)**:
   - Iuran dibayarkan berkala melalui modul payment billing.
   - Pengurus menjalankan kocokan/undian: `POST /api/program/arisan/batches/:batchId/draws`.
   - Bukti transfer pemenang diunggah oleh pengurus, notifikasi pemenang didorong secara real-time ke aplikasi via Socket.IO dan Web Push.

---

### E. Kasir POS & Jual Beli Koperasi
1. **Katalog & Keranjang**:
   - Anggota/kasir memilih barang dari katalog koperasi.
2. **Checkout Transaksi**:
   - Frontend mengirim pesanan ke `POST /api/jualbeli/checkout`.
   - Backend mengeksekusi pengurangan stok secara aman dalam transaksi database (`deductStockFromInventory.js`), menghitung total belanja, dan mencetak invoice/struk digital.

---

### F. Notifikasi & Real-time Update
1. **Socket.IO Connection**:
   - Frontend menghubungkan socket client ke backend saat terautentikasi.
   - Update status approval, perubahan saldo, status transaksi langsung tercermin di UI tanpa reload.
2. **Push Notification (PWA)**:
   - Service worker mendaftarkan VAPID public key ke `POST /api/push/subscribe`.
   - Notifikasi tagihan jatuh tempo dan info arisan dikirim via Web Push.

---

## 3. Matriks Endpoint Utama

| Kategori | Metode | Endpoint API | Deskripsi | Akses |
|---|---|---|---|---|
| **Auth** | POST | `/api/auth/register` | Pendaftaran akun baru | Publik |
| **Auth** | POST | `/api/auth/accountLogin` | Login & penerbitan token | Publik |
| **Auth** | GET | `/api/auth/me` | Ambil identitas pengguna aktif | Bearer / Cookie |
| **Auth** | POST | `/api/auth/logout` | Logout & revocasi sesi | Bearer / Cookie |
| **Anggota** | GET | `/api/anggota/profile` | Ambil data profil & status KYC | Anggota |
| **Simpanan**| POST | `/api/savings/apply` | Pengajuan buka simpanan | Anggota |
| **Simpanan**| POST | `/api/savings/request-withdrawal` | Pengajuan tarik sukarela | Anggota |
| **Simpanan**| POST | `/api/savings/disburse/:id` | Pencairan penarikan | Pengurus/Bendahara |
| **Financing**| POST | `/api/financing/apply` | Pengajuan pembiayaan syariah | Anggota |
| **Program** | GET | `/api/program/arisan/available` | Cek program arisan tersedia | Anggota |
| **Billing**  | POST | `/api/billing/create-midtrans-transaction` | Pembuatan transaksi Snap/VA | Anggota |
| **POS**      | POST | `/api/jualbeli/checkout` | Checkout belanja barang koperasi | Anggota/Kasir |
| **Dashboard**| GET | `/api/dashboard/stats` | Statistik & indikator performa | Terproteksi |
