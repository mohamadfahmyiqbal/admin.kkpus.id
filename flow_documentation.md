# Admin Portal (admin.kkpus.id) - Flow Penggunaan

Dokumentasi alur penggunaan dan operasional untuk panel backoffice Administrator KKPUS.

---

## 1. Ikhtisar Sistem

### 1.1 Struktur Aplikasi
```
┌─────────────────────────────────────────────────────┐
│ admin.kkpus.id  (Frontend PWA)                       │
│ - React 18 + Vite + React Router v6                │
│ - Browser Routing: /:token (Token JWT berenkripsi)   │
│ - Route Protection: EncryptedPage.jsx              │
│ - Role-based access (Admin / Bendahara / Ketua)     │
└─────────────────────────────────────────────────────┘
          │ HTTP API + WebSocket
          ▼
┌─────────────────────────────────────────────────────┐
│ api.kkpus.id  (Backend REST API)                     │
│ - Express 5 + Sequelize                               │
│ - Middleware: JWT Auth, Rate Limit, Helmet           │
│ - Security: OWASP ASVS Level  caretakers               │
└─────────────────────────────────────────────────────┘
          │ Database & Services
          ▼
┌─────────────────────────────────────────────────────┐
│ Database (MySQL / MariaDB)                            │
│ - Backoffice data (anggota, simpanan, pembiayaan, etc)│
│ - Rollback protection, WORM logs                    │
└─────────────────────────────────────────────────────┘
```

---

## 2. Flow Operasional Admin Backoffice

### 2.1 Proses Login & Autentikasi
1. **Pengguna membuka halaman login**
   - URL: `/login`
   - Form input: email, kata sandi
   - Rate limit: `loginLimiter` dari `authRoute.js`

2. **Autentikasi Backend**
   - Endpoint: `POST /api/auth/accountLogin`
   - Verifikasi: username & password hash bcrypt
   - Hasil: JWT token + HTTP-only cookie

3. **Login Frontend**
   - Menyimpan token di `localStorage`
   - Mengatur Bearer Interceptor Axios
   - Mengirim permintaan `GET /api/auth/me`
   - Menyambung Socket.IO via `VITE_SOCKET_URL`

4. **Routing Berbasis Token**
   - Halaman admin root: `/:token` (misal: `/eyJhbGciOiJIUzI1Ni...`)
   - Token berisi payload: `{userId, role, page}`
   - `EncryptedPage.jsx` mengekstrak page dari URL
   - Validasi token expiry & akses control

---

### 2.2 Modul & Workflow Admin

#### A. Dashboard Eksekutif
**Alur Penggunaan**:
1. Admin masuk, membuka dashboard:
   - Beranda: `/eyJhbGci...dashboard...`
2. Dashboard memuat data:
   - Ringkasan Keuangan Harian (saldo total, NPL, omset)
   - Antrean Approval lintas modul (`DashboardApprovalQueue.jsx`)
   - Real-time updates via Socket.io (`useSocketUpdateListener.js`)
3. Penyelesaian Approval:
   - Klik "Review" pada item antrean
   - Validasi data via `DashboardApprovalModals.jsx`
   - Klik "Setujui" atau "Tolak"
   - Backend mencatat `auditLoggingMiddleware` + memperbarui status
   - Frontend memperbarui tabel via socket event

#### B. Manajemen Anggota (`membersPage`)
**Alur Penggunaan**:
1. Navigasi ke anggota:
   - URL: `/eyJhbG...anggota...`
2. Anggota memuat data via React Query:
   - `GET /api/anggota` (dari backend)
   - Filter kolateral (status, role, kota)
3. Proses Verifikasi Anggota:
   - Pilih anggota untuk verifikasi
   - Buka `RegistrationReviewModal.jsx`
   - Upload berkas pendukung (KTP, swafoto)
   - Klik "Approve" -> `POST /api/anggota/verify`
   - Backend verifikasi berkas dan memperbarui `anggota.verified`
4. Aksi Massal:
   - Hard delete dengan konfirmasi password
   - Proses terminasi dengan workflow multi-step (`TerminationReviewModal.jsx`)

#### C. Pengelolaan Simpanan & Tabungan
**Alur Penggunaan**:
1. Akses Simpanan:
   - URL: `/eyJhbG...simpanan...`
2. Dashboard menampilkan:
   - Anggota yang memiliki simpanan
   - Ringkasan simpanan per anggota
3. Proses Tabungan:
   - Klik "Rincian" -> `TabunganPage.jsx`
   - Kelola program tabungans (`ProgramModals.jsx`)
   - Proses tagihan (`MemberBillsTable.jsx`)
   - Verifikasi bukti pembayaran (`MemberPaymentProofSection.jsx`)
4. Approval Penarikan Simpanan:
   - Menampilkan antrean penarikan
   - Menggunakan `SimpananReportPage.jsx`
   - Aksi berdasarkan SOP: Admin → Verifikasi, Bendahara → Approval, Ketua → Final Approval

#### D. Kasir & Jual Beli
**Alur Penggunaan**:
1. Dashboard Penjualan:
   - URL: `/eyJhbG...jualbeli...`
2. Fitur:
   - Entri transaksi tunai & non-tunai
   - Integrasi Midtrans (QRIS, GoPay, Kartu Kredit)
   - Management stok & inventaris
3. Proses:
   - Input produk & qty
   - Checkout melalui `midtrans` endpoint backend
   - Penerbitan struk, pencetakan jurnal
   - Laporan harian & bulanan

#### E. Investasi & Pembiayaan Syariah
**Alur Penggunaan**:
1. Manajemen Sukuk:
   - Katalog produk investasi
   - Pembelian unit & dividen tracking
2. Pembiayaan:
   - Pengajuan pinjaman anggota
   - Approval & pencairan
   - Manajemen cicilan & angsuran
3. Import Data:
   - Template ekspor/ekspor Excel
   - Batch import via `importPinjaman.js`

#### F. Payment & Billing
**Alur Penggunaan**:
1. Module utama:
   - Invoice massal (`createVoluntaryBill.js`)
   - Integration dengan Midtrans (`createMidtransTransaction.js`)
   - Disbursement handler (Iris)
2. Workflow:
   - Generate tagihan
   - Kirim ke anggota via PWA
   - Tracking status pembayaran
   - Sinkronisasi pembayaran manual (`submitManualPayment.js`)

#### G. Training & CMS
**Alur Penggunaan**:
1. Konten Manajemen:
   - Manajemen materi literasi
   - Kuisioner & penilaian
2. Sertifikasi Digital:
   - Generate sertifikat PDF via Exceljs
   - Print kartu peserta training

---

### 2.3 Keamanan & Kontrol Akses

#### 2.3.1 Flow Autentikasi
```
Frontend                     ↔   Backend API
Login Form --> POST /auth/accountLogin --> JWT + Cookie
                                      ↓
                                     --> GET /api/auth/me --> Profil
                                      ↓
                                     --> Socket.IO Join Room

Frontend                     ↔   Frontend (Routing)
/eyJhbG...token --> Decrypt Token --> Validasi --> Render Protected Page
```

#### 2.3.2 Hierarchy Role
| Role    | Hak Akses              | SOP Critical |
|---------|------------------------|--------------|
| Admin   | CRUD anggota, approve penarikan | ✅ |
| Bendahara | Verifikasi simpanan, cek saldo | ✅ |
| Ketua   | Final approval, export data | ✅ |

#### 2.3.3 Audit Trail
- Semua perubahan data melalui `auditLoggingMiddleware`
- Logs disimpan di MySQL/WORM, tidak dapat diedit
- Frontend menampilkan riwayat audit via modal khusus

---

## 3. API Backend Integrasi

### 3.1 Sumber API
- `/api/kasier/` (From API Gateway)
- `/api/anggota/` (Anggota operations)
- `/api/simpanan/` (Simpanan operations)
- `/api/program/` (Program & Financing)

### 3.2 Konsumen Frontend
- `src/utils/api/common.js` (Axios instance)
- Bearer token otomatis disuntikkan
- Error handling secara terpusat di `ErrorHandler.jsx`

---

## 4. Pengembangan & Pengoperasian

### 4.1 Persiapan Environment
```bash
# Development
VITE_API_BASE_URL=https://api.kkpus.id
VITE_SOCKET_URL=https://api.kkpus.id
VITE_ENV=development

# Production
VITE_API_BASE_URL=https://api.kkpus.id
VITE_SOCKET_URL=https://api.kkpus.id
VITE_ENV=production
```

### 4.2 Proses Build & Deploy
1. **Build**:
   ```bash
   npm run build
   ```
2. **Deploy**:
   ```bash
   ./run-deploy.sh
   ```
3. **Health Check**:
   - Backend: `/api/auth/me` dengan service worker
   - Database: monitoring `node_cache`

### 4.3 Monitoring & Observability
- Memory monitoring via cron job (60 detik interval)
- Auto restart jika penggunaan RAM > 512MB
- Logging setiap perubahan status admin via Socket.io

---

## 5. Proses Approval Operasional

### 5.1 Siklus Workflow
1. **Pengajuan**
   - Anggota mengaju ke sistem
   - Status: `PENDING_APPROVAL`
2. **Review Administrator**
   - Admin memverifikasi berkas (`:membersPage`
   - Status: `ADMIN_REVIEW`
3. **Approval Bendahara**
   - Bendahara memverifikasi saldo & faktur
   - Status: `TREASURY_APPROVED`
4. **Final Approval Ketua**
   - Ketua menjalankan dual control
   - Status: `COMPLETED`

### 5.2 Antrean Approval
- Dashboard menampilkan `DashboardApprovalQueue`
- Real-time update via Socket.io
- Admin dapat bertindak langsung tanpa reload
- Catatan audit disimpan setelah setiap perubahan

---

## 6. Testing & QA

### 6.1 Unit Tests
```bash
npm test
```

### 6.2 E2E Tests
```bash
npx playwright test
```

### 6.3 Proses Validasi
- Login flow (Cookie + token validation)
- Permission matrices untuk setiap role
- Security headers via Helmet
- Input validation & sanitization (`DOMPurify`)

---

## 7. Troubleshooting

### 7.1 Masalah Umum
| Gejala | Penyebab | Solusi |
|---------|----------|----------|
| 401 Unauthorized | Token expired | Clear localStorage & re-login |
| 404 Not Found | Page token invalid | Navigate ke dashboard & generate new token |
| 403 Forbidden | Role insufficient | Request role upgrade |*
| WebSocket disconnected | Token invalid | Refresh token & reconnect |

### 7.2 Checklist Recovery
1. Cek environment variables
2. Test auth API endpoint (`/api/auth/me`)
3. Verifikasi Socket.IO connection
4. Bersihkan localStorage, clear browser cache

---

## 8. Dokumentasi Tersedia

- **Frontend:** `admin.kkpus.id/README.md`
- **Backend:** `api.kkpus.id/openapi.yaml`
- **Admin Guide:** `admin.kkpus.id/ADMIN_GUIDE.md`
- **Member:** `kkpusid/README.md`

---

*Dibuat pada: 10 November 2026*
*Dokumentasi ini sesuai dengan SOP KKPUS Ecosystem (ISO 27001:2022, OWASP ASVS Level 2)*