# 📋 Panduan Operasional Pengurus — Admin Portal (admin.kkpus.id)

## Dokumentasi Operasi & Konfigurasi

---

## 1. Ikhtisar & Pendahuluan

### 1.1 Tujuan Dokumen
- Menyediakan panduan lengkap bagi tim pengurus **Admin Portal** KKPUS Ecosystem
- Memastikan operasional yang konsisten, aman, dan sesuai SOP

### 1.2 Lingkup
- Admin Backoffice (`https://admin.kkpus.id`)
- Backend Core API (`https://api.kkpus.id`)
- Integritas sistem & tindakan operasional

### 1.3 Target Audiens
- **Pengurus (Admin):** Pengelola data anggota, laporan keuangan, persetujuan
- **Bendahara:** Proses approval penarikan simpanan & penerbitan invoice
- **Ketua:** Persetujuan tingkat tertinggi (final approval)

---

## 2. Menjalankan Admin Portal

### 2.1 Environment Variables
```bash
# .env.development / .env.production
VITE_API_BASE_URL=https://api.kkpus.id
VITE_SOCKET_URL=https://api.kkpus.id
VITE_ENV=production|development
```

### 2.2 Setup Local Development
```bash
npm install
npm run dev

npm run build
npm test
```

### 2.3 Build & Deploy
```bash
npm run build
./run-deploy.sh
```

---

## 3. Arsitektur & Routing

### 3.1 Frontend Architecture
- **Framework:** React + Vite + React Router v6
- **Data Fetch:** Apollo Client (GraphQL) + TanStack React Query
- **State:** React Context + localStorage (encrypted tokens)

### 3.2 Routing Security Model
- **Base Path:** `/:token` - Token-based encrypted routing
- **Token Format:** JWT dengan `page` parameter (e.g., `dashboard`, `membersPage`)
- **Protected Routes:** `isProtected: true` di `PageRoutes.jsx`
- **Token Validation:** `isJwtExpired()` check di `EncryptedPage.jsx`

### 3.3 Access Control
- **Dashboard:** Protected (Admin/Bendahara/Ketua)
- **Members:** Protected
- **Savings:** Protected
- **Jual Beli:** Protected
- **Akad Config:** Protected
- **Reports:** Protected
- **Training:** Protected

---

## 4. Fitur & Modul

### 4.1 Dashboard Eksekutif
- Metrik keuangan harian (dana simpanan, NPL, kas, omset)
- Antrean approval lintas modul (`DashboardApprovalQueue`)
- Real-time updates via Socket.io

### 4.2 Manajemen Anggota (`membersPage`)
- Manajemen anggota, filter multi-kolom, role assignment
- Hard delete dengan konfirmasi password
- KYC verification

### 4.3 Savings & Tabungan
- Entri simpanan manual
- Approval workflow penarikan
- Tabungan program terencana

### 4.4 Jual Beli / Kasir POS
- Dashboard penjualan
- Laporan transaksi & jurnal akuntansi
- Management stok

### 4.5 Investasi & Pendanaan Syariah
- Sukuk management (catalog, issue, order, portfolio, report)
- Investasi & Pendanaan import (Excel)

### 4.6 Payment & Billing
- Invoice massal bulanan
- Midtrans integration (VA, QRIS, GoPay, Kartu)
- Midtrans Iris payout

### 4.7 Training & CMS
- Materi literasi, kuis, sertifikat digital
- Konten CMS

---

## 5. Keamanan & Kontrol Akses

### 5.1 Authentication Flow
1. Login via `authLogin` page
2. Token JWT generated & stored (cookie + localStorage)
3. Token digunakan untuk API calls & Socket.io
4. Protected routes validate token expiry

### 5.2 Role-Based Access
- **Role:** Admin / Bendahara / Ketua
- Access to critical actions requires dual control
- Audit trail logging on all mutations

### 5.3 Security Standards
- ✅ OWASP ASVS Level 2 implemented
- ✅ Helmet security headers
- ✅ Rate limiting on auth endpoints
- ✅ Input validation on all endpoints
- ✅ File upload validation
- ✅ Error message sanitization

---

## 6. Testing

### 6.1 Frontend Tests
```bash
npm test
```

### 6.2 Backend Tests
```bash
# api.kkpus.id
cd api.kkpus.id
npm test
npm run test:ci
```

### 6.3 E2E Tests
```bash
# Playwright
npx playwright test
```

---

## 7. Operational Procedures

### 7.1 Approval Workflow
1. **Admin Staff:** Verifikasi berkas anggota / penyelesaian pembayaran
2. **Bendahara:** Approval pencairan dana / persetujuan penarikan
3. **Ketua:** Final approval (dual control)

### 7.2 Audit Trail
- Semua aksi mutasi tercatat via `auditLoggingMiddleware`
- Logs immutable & WORM storage (per SOP)

### 7.3 Backup & Recovery
- Cron backup harian (retensi 30 hari)
- Monitoring & error tracking setup

---

## 8. Troubleshooting

### 8.1 Routing Issues
- Token expired → Clear localStorage & login ulang
- Wrong page → Re-encode token dengan `page` parameter yang valid

### 8.2 API Integration
- Check `VITE_API_BASE_URL` environment
- Socket connection: `VITE_SOCKET_URL`

### 8.3 Common Errors
- 401 Unauthorized → Token invalid/expired → re-login
- 404 Not Found → Invalid page token → navigate ke dashboard
- 403 Forbidden → Insufficient role → request role upgrade

---

## 9. Kontak & Dukungan

- **Developer:** Mohamad Fahmy Iqbal (Fullstack Developer)
- **QA Lead:** QA Reviewer
- **Product Owner:** Budi Santoso (KKPUS)

---

*Operasional manual ini disusun untuk mendukung implementasi KKPUS Ecosystem. Perbaruan berlaku berdasarkan SOP perubahan internal.*

## 10. Checklist Operasional

- [x] Menjalankan development server
- [x] Build produksi berhasil
- [x] Unit tests lulus
- [x] E2E tests lulus
- [x] Security headers valid
- [x] Authentication flow teruji
- [x] Approval workflow teruji
- [x] Backup & monitoring terkonfigurasi

---

## 11. Dokumentasi Tersedia

- **Backend API:** `api.kkpus.id/openapi.yaml`
- **Core API:** `api.kkpus.id/README.md`
- **Admin:** `admin.kkpus.id/README.md`
- **Member:** `kkpusid/README.md`

---

*Dokumentasi ini dibuat pada: November 10, 2026*
*Dokumen ini merefleksikan status operasional KKPUS Ecosystem pada tahap pengembangan.*
