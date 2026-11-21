# API Specification

**Project:** KKPUS Platform  
**Style / version:** REST / 1.0.0  
**Base URL:** https://api.kkpus.id  
**Authentication:** JWT Bearer token (header `Authorization: Bearer <token>` + cookie `auth_token`)

## 1. Contract conventions

- **Media type:** `application/json` (request/response), `multipart/form-data` (file uploads)
- **Versioning:** URL prefix `/api/v1/` — saat ini menggunakan `/api/` tanpa prefix versi; migrasi ke `/api/v1/` direncanakan (PRD-001, backward-compatible)
- **Pagination / filtering / sorting:** Query params `?page=1&limit=20&sort=created_at&order=desc&search=<term>&status=<status>`
- **Idempotency:** `transaction_id` untuk verifikasi pembayaran (mencegah double-verify); form submission registrasi tidak idempoten (natural duplicate prevention via unique NIK/email)
- **Error envelope:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "email", "reason": "already exists" }]
  }
}
```

## 2. Common errors

| HTTP status | Code | Meaning | Client action |
| --- | --- | --- | --- |
| 400 | VALIDATION_ERROR | Input gagal validasi server | Tampilkan pesan per field |
| 401 | UNAUTHORIZED | Token tidak ada / tidak valid / revoked | Redirect ke login |
| 403 | FORBIDDEN | Role tidak sesuai | Tampilkan pesan akses ditolak |
| 404 | NOT_FOUND | Resource tidak ditemukan | Tampilkan pesan tidak ditemukan |
| 409 | CONFLICT | Duplikat / state konflik (NIK/email sudah ada, approval sudah final) | Refresh data |
| 410 | GONE | Resource kedaluwarsa (OTP expired) | Minta OTP baru |
| 413 | PAYLOAD_TOO_LARGE | File > 5MB | Kompres / pilih file lain |
| 422 | UNPROCESSABLE_ENTITY | File magic byte tidak valid | Pilih file dengan format benar |
| 423 | ACCOUNT_LOCKED | Akun terkunci sementara (15 menit) | Tunggu & coba lagi |
| 429 | RATE_LIMITED | Terlalu banyak request | Tunggu & coba lagi |
| 500 | INTERNAL_ERROR | Error server tak terduga | Hubungi support |

## 3. Endpoints

> **Kontrak aktual (2026-11-22, TASK-008).** §3 ini ditulis ulang mengikuti implementasi `api.kkpus.id/routes/*.js` (branch `rollback/2026-11-02`). API-001..050 adalah kontrak v1 yang **dipertahankan sebagai ID** — setiap ID dipetakan ke route aktualnya (acuan matriks §6.1); ID yang tidak memiliki padanan aktual ditandai **— (removed)**. ID baru (API-051+) hanya untuk endpoint kritis yang belum tercakup. Inventaris lengkap seluruh ~213 route (termasuk endpoint tanpa ID) ada di §4.

**Notation auth:** `(publik)` = tanpa token · `(auth)` = `MidAnggota` · `(role: X)` = `MidAnggota` + `MidRole([...])` · `(rate)` = rate-limited.

---

### M-AUTH — Authentication (`/api/auth`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-001 | POST | `/api/auth/accountLogin` | (publik, rate) | Login email/Nomor HP + password → JWT (cookie `auth_token` HttpOnly + `data.token`) + data user. Body: `{ emailHp, password }`. 401 kredensial salah, 429 account lockout |
| API-002 | POST | `/api/auth/logout` | (auth) | Logout, revoke token (jti / token_version) |
| API-003 | POST | `/api/auth/forgot-password/send-otp` | (publik, rate) | Kirim OTP reset password |
| API-004 | POST | `/api/auth/forgot-password/verify-otp` | (publik, rate) | Verifikasi OTP |
| API-005 | POST | `/api/auth/forgot-password/reset` | (publik, rate) | Reset password dengan OTP tervalidasi |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `POST /api/auth/register` (publik), `POST /api/auth/forgot-password/resend-otp` (publik, rate).

---

### M-MEMBER — Member Management (`/api/anggota`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-006 | POST | `/api/anggota/pendaftaran` | (auth) | Ajukan pendaftaran anggota baru (was: publik di v1) |
| API-007 | GET | `/api/anggota/all` | (auth) | Daftar seluruh anggota (was: `/api/anggota`) |
| API-008 | — | — | — | **Removed** — `GET /api/anggota/:id` tidak diimplementasikan (detail via `/all` + `/profil`) |
| API-009 | PUT | `/api/anggota/:member_id/role` | (role: Pengurus) | Ubah role anggota |
| API-010 | DELETE | `/api/anggota/:member_id` | (role: Pengurus) | Hapus anggota (**hard delete** — was: archive) |
| API-011 | — | — | — | **Removed** — restore tidak ada (hard delete permanen) |
| API-012 | POST | `/api/anggota/berhenti-keanggotaan` | (auth) | Ajukan berhenti keanggotaan |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET/PUT /profil` (auth), `GET /getRegistrationStatus` (auth), `GET /berhenti-keanggotaan/status` (auth), `POST /berhenti-keanggotaan/konfirmasi` (auth), `GET /roles` (auth), `GET /template-import` + `POST /import` (role), `POST /batch-delete` (role).

---

### M-APPROVAL — Approval Engine (`/api/approvals`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-013 | GET | `/api/approvals/pendaftaran/pending` | (auth) | Daftar approval pending — **per-entitas** (pendaftaran; entitas lain punya endpoint serupa di §4) |
| API-014 | — | — | — | **Removed** — `GET /api/approvals/:id` tidak ada |
| API-015 | PUT | `/api/approvals/{pendaftaran\|penarikan\|tabungan_penarikan\|financing\|tabungan\|sukuk}/approve/:entityId` | (role per entitas) | Keputusan approval (approve/reject). Body: `{ action, notes }`. Diproses `processApproval(entityRef)` — was: `POST /approvals/:id/decision` |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `POST /process/:entityRef/:entityId` (generik, auth), `POST /penarikan/pembayaran/:entityId` (role: Bendahara), `POST /tabungan_penarikan/pembayaran/:entityId` (role: Bendahara).

---

### M-SAVINGS — Simpanan (`/api/simpanan`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-016 | GET | `/api/simpanan/account-detail` | (auth) | Detail rekening simpanan anggota (was: `/api/simpanan`) |
| API-017 | GET | `/api/simpanan/riwayat` | (auth) | Riwayat transaksi simpanan (was: `/api/simpanan/:id/transactions`) |
| API-018 | POST | `/api/simpanan/penarikan/request` | (auth) | Ajukan penarikan simpanan (was: `/api/simpanan/withdrawals`) |
| API-019 | GET | `/api/simpanan/config` | (role: Ketua/Bendahara/Pengawas) | Konfigurasi nominal & akad simpanan |
| API-020 | PUT | `/api/simpanan/config` | (role: Ketua/Bendahara/Pengawas) | Update konfigurasi. Body: `{ configs: [{ bill_type_id, default_amount }] }` (DEC-006) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /products`, `PUT /products/:id/akad`, `GET /features`, `PUT /features/:id/akad`, `GET /penarikan/history`, `GET /transactions/:invoiceNumber`, `GET /penarikan/detail/:withdrawalId`, `POST /penarikan/:withdrawal_id/disburse` (role: Ketua/Bendahara/Pengawas).

---

### M-SAVINGS-ALT — Simpanan paralel (`/api/savings`) — dipakai frontend

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| — | POST | `/api/savings/apply` | (auth) | Ajukan target simpanan. Body: `{ saving_target_id, monthly_deposit, term_months }` |
| — | GET | `/api/savings/history` | (auth) | Riwayat |
| — | GET | `/api/savings/options` | (auth) | Opsi program |
| — | GET | `/api/savings/summary` | (auth) | Ringkasan |
| — | GET | `/api/savings/admin-summary` · `/admin-transactions` · `/admin-report` · `/admin-export` | (role) | Panel admin |
| — | GET | `/api/savings/template-import` · `POST /api/savings/import` | (auth / role) | Import Excel |
| — | GET | `/api/savings/:id` | (auth) | Detail |

---

### M-BILLING — Billing & Payments (`/api/billing`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-021 | GET | `/api/billing/list/pending` | (auth) | Daftar tagihan pending (was: `/api/billing`) |
| API-022 | POST | `/api/billing/manual-payment` | (auth) | Upload bukti transfer manual. `multipart/form-data`: `bill_id`, `bill_item_ids[]`, `amount`, `tx_category`, `financing_id?`, `bank_id`, `sender_name`, `sender_bank`, `sender_account_no`, file bukti (validasi magic byte) |
| API-023 | POST | `/api/billing/verify-manual-payment` | (role: Pengawas/Ketua/Bendahara) | Verifikasi pembayaran manual (was: `PUT /billing/:id/verify`) |
| API-024 | POST | `/api/billing/create-voluntary-bill` | (auth) | Buat tagihan sukarela (was: `/billing/voluntary`) |
| API-048 | GET | `/api/billing/payment-fees` | (publik) | Konfigurasi biaya admin (was: `/billing/fee-config`) |
| API-049 | PUT | `/api/billing/payment-fees` | (role: Pengawas/Ketua/Bendahara) | Update biaya admin (DEC-006) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /cooperative-banks` (publik), `GET /manual-verifications` (role), `GET /list/history`, `POST /invoice/details`, `POST /create-deposit`, `POST /process-payment` (buat tagihan + transaksi PENDING → transfer manual; BLK-006), `POST /process-savings`, `POST /manual-sync-summary` (role).

---

### M-FINANCING — Pembiayaan (`/api/financing`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-030 | POST | `/api/financing/apply` | (auth) | Ajukan pembiayaan |
| API-028 | GET | `/api/financing/sukuk/catalog` | (auth) | Katalog sukuk (was: `/financing/sukuk`) |
| API-029 | POST | `/api/financing/sukuk/order` | (auth) | Pesan sukuk (was: `/financing/sukuk/orders`) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /loan-products`, `GET /report/pinjaman`, `GET /report/pendanaan`, `GET /history`, `POST /apply-arisan`, `GET /detail/:id`, `GET /options`, `GET /terms`, `sukuk/issue` CRUD (4), `GET /sukuk/portfolio`, `GET /sukuk/detail/:id`, `GET /sukuk/members/:id`, `GET /sukuk/order/:id`, `GET /sukuk/report`, `POST /sukuk/withdraw/:orderId` (+ `/proof`), `investasi/pendanaan` import (2), `POST /evidence/:financingId`, `GET /evidence/:financingId/download`, `DELETE /evidence/:financingId`, `GET /receipt/:id`.

---

### M-FINANCIAL — Pembiayaan/finansial (`/api/financial`) — dipakai frontend

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-026 | POST | `/api/financial/apply` | (auth) | Ajukan pinjaman (was: `/api/program/apply` — pindah modul) |
| — | GET | `/api/financial/summary` · `/history` · `/report/pinjaman` · `/report/arisan` · `/detail/:id` | (auth) | Laporan & ringkasan |
| — | GET | `/api/financial/options` · `/terms` | (publik) | Opsi & termin |
| — | GET | `/api/financial/pelunasan-items/:id` | (auth) | Item pelunasan |
| — | POST | `/api/financial/hutang/create` · `/aktiva-tetap/create` | (auth) | Hutang / aktiva tetap |

---

### M-JUALBELI — Jual Beli (`/api/jualbeli`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-025 | POST | `/api/jualbeli/create` | (auth) | Buat transaksi jual beli (was: `/jualbeli/apply`) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /report`, `GET /history`, `GET /:id`, `GET /template-import` + `POST /import` (role), `GET /template-import-cicilan` + `POST /import-cicilan` (role), `POST /batch-delete` (role), `DELETE /:id` (role).

---

### M-PROGRAM — Pinjaman & Arisan (`/api/program`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-027 | POST | `/api/program/pinjaman/modal` | (role) | Tambah modal pinjaman (was: `/program/modal`) |
| API-031 | POST | `/api/program/arisan/batches` | (role) | Buat batch arisan |
| API-032 | PUT | `/api/program/arisan/batches/:id/status` | (role) | Ubah status batch (aktifkan/selesaikan) — was: `POST .../activate` |
| API-033 | POST | `/api/program/arisan/batches/:batchId/draws` | (role) | Undian penerima manfaat (was: `.../draw`) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /pinjaman`, `GET /pinjaman/produk` (publik), `GET /arisan/available`, `GET /arisan/detail/:id`, `GET /arisan`, `GET /arisan/batches`, `PUT/DELETE /arisan/batches/:id`, `GET /arisan/batches/:batchId/participants`, `PUT /arisan/participants/:id/status` · `/no`, `GET/POST /arisan/batches/:batchId/payments`, `GET /arisan/batches/:batchId/draws`, `PUT /arisan/draws/:id/status`, `GET /options` (publik), `pinjaman/arisan` import (6).

---

### M-TABUNGAN — Tabungan Bertarget (`/api/tabungan`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-034 | GET | `/api/tabungan/admin/programs` | (role) | Daftar program tabungan (was: `/tabungan/targets`) |
| API-035 | POST | `/api/tabungan/admin/programs` | (role) | Buat program tabungan (was: `/tabungan/targets`) |
| API-036 | POST | `/api/tabungan/pengajuan/:id/withdraw` | (auth) | Ajukan penarikan tabungan (was: `/tabungan/withdrawals`) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /programs`, `POST /pengajuan`, `GET /pengajuan/detail/:id`, `GET /pengajuan/check`, `GET /pengajuan/:id/tagihan`, `GET /admin`, `GET /admin/export`, `GET /admin/transactions`, `GET /admin/pengajuan/:id/tagihan`, `PUT/DELETE /admin/programs/:id`, `GET /admin/template-import`, `POST /admin/import` + `/admin/import-transaksi` (role).

---

### M-TRAINING — Training & Evaluasi (`/api/training`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-037 | GET | `/api/training/curriculums` | (auth) | Daftar kurikulum |
| API-038 | GET | `/api/training/curriculums/:curriculum_id/materials` | (auth) | Materi kurikulum (param: `curriculum_id`) |
| API-039 | POST | `/api/training/evaluations` | (auth) | Submit evaluasi (was: `/evaluations/:id/submit`) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /materials/:material_id`, `POST /notes`, `GET /rankings`, `GET /my-ranking`, admin CRUD `curriculums` / `materials` / `evaluations` (12, `adminAuth`), `GET /admin/rankings`.

---

### M-DASHBOARD — Dashboard (`/api/dashboard`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-040 | GET | `/api/dashboard/` | (auth) | Statistik dashboard (was: `/dashboard/stats`) |
| API-041 | GET | `/api/dashboard/admin` | (role) | Data dashboard admin (was: `/dashboard/approval-queue`) |

---

### M-NOTIFICATION & M-PUSH — Notifikasi (`/api/notifikasi`, `/api/push`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-042 | GET | `/api/notifikasi/list` | (auth) | Daftar notifikasi (identity hanya dari token — BLK-008) |
| API-043 | POST | `/api/notifikasi/update-status` | (auth) | Tandai dibaca. Body: `{ id \| all, status }` |
| API-044 | POST | `/api/push/subscribe` | (auth) | Simpan subscription push (BLK-008: identity dari token) |
| — | GET | `/api/push/vapid-public-key` | (publik) | Kunci VAPID publik |
| — | POST | `/api/push/test-push` | (auth) | Test push ke member sendiri (BLK-008) |

---

### M-CONTENT & M-LANDING — Landing & Content (`/api/landing`, `/api/content`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-045 | GET | `/api/landing/services` · `/stats` · `/about` · `/contact` · `/content` | (publik) | Konten landing (dipecah dari `/api/landing` v1) |
| API-046 | GET | `/api/content/articles` | (publik) | Artikel |
| API-047 | POST | `/api/landing/contact-form` | (publik) | Form kontak (was: `/landing/contact`) |

**Endpoint tambahan modul ini (tanpa ID — lihat §4):** `GET /api/content/landing-text`.

---

### M-REGION — Data Wilayah (`/api/regions`) — BARU (API-051..054)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-051 | GET | `/api/regions/provinces` | (publik) | Daftar provinsi (proxy data wilayah) |
| API-052 | GET | `/api/regions/regencies/:provinceId` | (publik) | Kabupaten/kota per provinsi |
| API-053 | GET | `/api/regions/districts/:regencyId` | (publik) | Kecamatan per kabupaten |
| API-054 | GET | `/api/regions/villages/:districtId` | (publik) | Desa/kelurahan per kecamatan |

---

### M-FILES — File Download (`/api/files`)

| ID | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| API-050 | GET | `/api/files/*filePath` | (auth) | Unduh file privat (storage di luar web root). Path traversal guard (`resolveStoredPath`) — was: `/api/files/:filename` |

---

### 3.1 Catatan arah pengembangan (kontrak idealis v1 — arsip)

Kontrak v1 idealis (50 endpoint, sebelum verifikasi implementasi) diarsipkan di §6.1 (matriks pemetaan) dan git history. Perbedaan utama yang **tidak diadopsi** (implementasi lebih tepat / tidak dijadwalkan):
- Approval generik `POST /approvals/:id/decision` → aktual per-entitas (domain model lebih benar: tiap entitas punya rantai approval & role berbeda)
- `PUT /anggota/:id/archive|restore` → aktual hard delete (perilaku data anggota diputuskan Product)
- Path idealis (`/login`, `/fee-config`, `/targets`, dll) → path aktual dipertahankan (frontend sudah stabil; rename = breaking change tanpa nilai pengguna)

Jika di masa depan ingin merapikan konvensi (mis. migrasi `/api/v1/` per §1), jadwalkan sebagai proyek tersendiri dengan ADR — bukan mengubah kontrak yang sedang berjalan.

## 4. Endpoint summary (inventaris aktual — 2026-11-22)

> Sumber: `api.kkpus.id/routes/*.js` + `app.js` (branch `rollback/2026-11-02`). Semua path relatif terhadap mount point. Tanda `*` = butuh autentikasi (`MidAnggota`); role-specific ditandai `MidRole([...])`.

| Modul | Mount | Routes aktual |
| --- | --- | --- |
| M-AUTH (authRoute) | `/api/auth` | `POST /register` (publik), `POST /accountLogin` (publik), `POST /logout` * |
| M-AUTH (forgotPasswordRoute) | `/api/auth/forgot-password` | `POST /send-otp`, `POST /verify-otp`, `POST /reset`, `POST /resend-otp` (semua publik, rate-limited) |
| M-APPROVAL (approvalsRoute) | `/api/approvals` | `POST /process/:entityRef/:entityId` *, `GET /pendaftaran/pending` *, `PUT /pendaftaran/approve/:entityId` * (Pengawas/Ketua/Bendahara), `PUT /penarikan/approve/:entityId` *, `POST /penarikan/pembayaran/:entityId` * (Bendahara), `PUT /tabungan_penarikan/approve/:entityId` *, `POST /tabungan_penarikan/pembayaran/:entityId` * (Bendahara), `PUT /financing/approve/:entityId` *, `PUT /tabungan/approve/:entityId` *, `PUT /sukuk/approve/:entityId` * |
| M-MEMBER (anggotaRoute) | `/api/anggota` | `GET/PUT /profil` *, `POST /pendaftaran` *, `GET /getRegistrationStatus` *, `POST /berhenti-keanggotaan` *, `GET /berhenti-keanggotaan/status` *, `POST /berhenti-keanggotaan/konfirmasi` *, `GET /all` *, `GET /template-import` *, `POST /import` * (role), `PUT /:member_id/role` * (role), `GET /roles` *, `POST /batch-delete` * (role), `DELETE /:member_id` * (role) |
| M-SAVINGS (simpananRoute) | `/api/simpanan` | `GET /products` *, `PUT /products/:id/akad` *, `GET /features` *, `PUT /features/:id/akad` *, `GET /account-detail` *, `GET /riwayat` *, `POST /penarikan/request` *, `GET /penarikan/history` *, `GET /transactions/:invoiceNumber` *, `GET /penarikan/detail/:withdrawalId` *, `POST /penarikan/:withdrawal_id/disburse` * (Ketua/Bendahara/Pengawas), `GET/PUT /config` * (Ketua/Bendahara/Pengawas) |
| M-SAVINGS-alt (savingsRoute) | `/api/savings` | `POST /apply` *, `GET /history` *, `GET /options` *, `GET /summary` *, `GET /admin-summary` * (role), `GET /admin-transactions` * (role), `GET /admin-report` * (role), `GET /admin-export` * (role), `GET /template-import` *, `POST /import` * (role), `GET /:id` * |
| M-BILLING (billingRoute) | `/api/billing` | `GET/PUT /payment-fees` (GET publik; PUT * Pengawas/Ketua/Bendahara), `GET /cooperative-banks` (publik), `GET /manual-verifications` * (role), `POST /verify-manual-payment` * (Pengawas/Ketua/Bendahara), `GET /list/pending` *, `GET /list/history` *, `POST /invoice/details` *, `POST /create-voluntary-bill` *, `POST /create-deposit` *, `POST /process-payment` * (buat tagihan + transaksi PENDING → transfer manual; BLK-006 resolved), `POST /manual-payment` *, `POST /process-savings` *, `POST /manual-sync-summary` * |
| M-FINANCING (financingRoute) | `/api/financing` | `GET /loan-products` *, `GET /report/pinjaman` *, `GET /report/pendanaan` *, `GET /history` *, `POST /apply` *, `POST /apply-arisan` *, `GET /detail/:id` *, `GET /options` *, `GET /terms` *, `GET /sukuk/issue/all` *, `POST /sukuk/issue` *, `PUT /sukuk/issue/:id` *, `DELETE /sukuk/issue/:id` *, `GET /sukuk/catalog` *, `GET /sukuk/portfolio` *, `GET /sukuk/detail/:id` *, `GET /sukuk/members/:id` *, `POST /sukuk/order` *, `GET /sukuk/order/:id` *, `GET /sukuk/report` *, `POST /sukuk/withdraw/:orderId` *, `POST /sukuk/withdraw/:orderId/proof` *, `GET /investasi/template-import` *, `POST /investasi/import` * (role), `GET /pendanaan/template-import` *, `POST /pendanaan/import` * (role), `POST /evidence/:financingId` *, `GET /evidence/:financingId/download` *, `DELETE /evidence/:financingId` *, `GET /receipt/:id` * |
| M-FINANCING-alt (financialRoute) | `/api/financial` | `GET /summary` *, `GET /history` *, `GET /report/pinjaman` *, `GET /report/arisan` *, `POST /apply` *, `GET /detail/:id` *, `GET /options` (publik), `GET /terms` (publik), `GET /pelunasan-items/:id` *, `POST /hutang/create` *, `POST /aktiva-tetap/create` * |
| M-FINANCING-jualbeli (jualbeliRoute) | `/api/jualbeli` | `GET /report` *, `POST /create` *, `GET /history` *, `GET /template-import` *, `POST /import` * (role), `GET /template-import-cicilan` *, `POST /import-cicilan` * (role), `POST /batch-delete` * (role), `DELETE /:id` * (role), `GET /:id` * |
| M-ARISAN+PINJAMAN (programRoute) | `/api/program` | `GET /pinjaman` *, `POST /pinjaman/modal` *, `GET /pinjaman/produk` (publik), `GET /arisan/available` *, `GET /arisan/detail/:id` *, `GET /arisan` *, `GET /arisan/batches` *, `POST /arisan/batches` *, `PUT /arisan/batches/:id/status` *, `PUT /arisan/batches/:id` *, `DELETE /arisan/batches/:id` *, `GET /arisan/batches/:batchId/participants` *, `PUT /arisan/participants/:id/status` *, `PUT /arisan/participants/:id/no` *, `GET /arisan/batches/:batchId/payments` *, `POST /arisan/batches/:batchId/payments` *, `GET /arisan/batches/:batchId/draws` *, `POST /arisan/batches/:batchId/draws` *, `PUT /arisan/draws/:id/status` *, `GET /options` (publik), `GET /pinjaman/template-import` *, `POST /pinjaman/import` * (role), `GET /pinjaman/template-import-transaksi` *, `POST /pinjaman/import-transaksi` * (role), `GET /arisan/template-import` *, `POST /arisan/import` * (role) |
| M-TABUNGAN (tabunganRoute) | `/api/tabungan` | `GET /programs` *, `POST /pengajuan` *, `GET /pengajuan/detail/:id` *, `GET /pengajuan/check` *, `POST /pengajuan/:id/withdraw` *, `GET /pengajuan/:id/tagihan` *, `GET /admin` * (role), `GET /admin/export` * (role), `GET /admin/transactions` * (role), `GET /admin/pengajuan/:id/tagihan` * (role), `GET/POST /admin/programs` * (role), `PUT/DELETE /admin/programs/:id` * (role), `GET /admin/template-import` *, `POST /admin/import` * (role), `POST /admin/import-transaksi` * (role) |
| M-TRAINING (trainingRoute) | `/api/training` | `GET /curriculums` *, `GET /curriculums/:curriculum_id/materials` *, `GET /materials/:material_id` *, `POST /notes` *, `POST /evaluations` *, `GET /rankings` *, `GET /my-ranking` *, `GET/POST /admin/curriculums` (adminAuth), `PUT/DELETE /admin/curriculums/:id`, `GET/POST /admin/materials`, `PUT/DELETE /admin/materials/:id`, `GET/POST /admin/evaluations`, `PUT/DELETE /admin/evaluations/:id`, `GET /admin/rankings` |
| M-DASHBOARD (dashboardRoute) | `/api/dashboard` | `GET /` *, `GET /admin` * (role) |
| M-NOTIFICATION (notificationRoute) | `/api/notifikasi` | `GET /list` (publik? tanpa MidAnggota — *lihat catatan §6*), `POST /update-status` |
| M-PUSH (pushRoutes) | `/api/push` (+alias `/push`) | `GET /vapid-public-key`, `POST /subscribe` *, `POST /test-push` |
| M-CONTENT (contentRoute) | `/api/content` | `GET /landing-text`, `GET /articles` |
| M-CONTENT (landingRoute) | `/api/landing` | `GET /services`, `GET /stats`, `GET /about`, `GET /contact`, `POST /contact-form`, `GET /content` |
| M-REGION (regionRoutes) — **baru, belum ada di spec v1** | `/api/regions` | `GET /provinces`, `GET /regencies/:provinceId`, `GET /districts/:regencyId`, `GET /villages/:districtId` (publik, data wilayah referensi) |
| M-FILES (app.js) | `/api/files` | `GET /*filePath` * (auth + traversal guard, `resolveStoredPath`) |

**Total: ~213 route aktual** (vs 50 di kontrak v1 §3). Perbedaan utama: approval per-entitas (bukan generik), modul ganda simpanan (`/api/simpanan` + `/api/savings`) & pembiayaan (`/api/financing` + `/api/financial` + `/api/jualbeli`), CRUD admin training, manajemen issue sukuk, modul regions, dan endpoint DOKU/Midtrans yang masih aktif di backend.

---

## 5. Traceability matrix

| TSD Module | API IDs | FSD Modules | PRD Requirements |
| --- | --- | --- | --- |
| M-AUTH | API-001..005 | F-01 | PRD-001, PRD-002 |
| M-MEMBER | API-006..012 | F-02 | PRD-003, PRD-005, PRD-006 |
| M-APPROVAL | API-013..015 | F-03 | PRD-004 |
| M-SAVINGS | API-016..018, API-019..020 | F-04, F-18 | PRD-007, PRD-024, PRD-025 |
| M-BILLING | API-021..024, API-048..049 | F-05, F-18 | PRD-008, PRD-009 |
| M-FINANCING | API-025..030 | F-06, F-07, F-10, F-11 | PRD-010, PRD-011, PRD-014, PRD-015 |
| M-ARISAN | API-031..033 | F-08 | PRD-012 |
| M-TABUNGAN | API-034..036 | F-09 | PRD-013 |
| M-TRAINING | API-037..039 | F-12 | PRD-016 |
| M-DASHBOARD | API-040..041 | F-14 | PRD-018 |
| M-NOTIFICATION | API-042..044 | F-13 | PRD-017 |
| M-CONTENT | API-045..047 | F-17 | PRD-023 |
| M-CONFIG | API-019, API-020, API-048, API-049 | F-18 | PRD-009, PRD-024, PRD-025 |
| M-SAVINGS-ALT | (tanpa ID — §3 M-SAVINGS-ALT) | F-04 | PRD-007, PRD-024 |
| M-REGION | API-051..054 | — (baru; dipakai form registrasi) | PRD-003 |
| M-FILES | API-050 | F-16 | PRD-021 |
| M-CRON | (internal, no API) | F-19 | PRD-026 |

> **Coverage check:** 16 TSD modules (+M-SAVINGS-ALT, +M-REGION) → 50 API v1 (10 MATCH / 37 CHANGED / 3 removed, §6.1) + 4 API baru (API-051..054) + 1 internal cron. Semua 19 FSD modules tercakup. Semua 26 PRD requirements tercermin di endpoint atau internal process. ✅

## 6. Implementation reconciliation (2026-11-22)

> Verifikasi `06_API_SPEC.md` v1 (50 endpoint) terhadap routes aktual `api.kkpus.id/routes/*.js` (branch `rollback/2026-11-02`, ~213 route). Hasil: **10 MATCH, 37 CHANGED, 3 MISSING** dari 50 endpoint v1. Detail §3 tetap sebagai kontrak v1; §4 adalah inventaris aktual.

### 6.1 Matriks per endpoint v1

| Spec ID | Spec v1 | Actual route | Status |
| --- | --- | --- | --- |
| API-001 | POST /api/auth/login | POST /api/auth/accountLogin | CHANGED — path |
| API-002 | POST /api/auth/logout | POST /api/auth/logout | ✅ MATCH |
| API-003 | POST /api/auth/forgot-password | POST /api/auth/forgot-password/send-otp | CHANGED — path |
| API-004 | POST /api/auth/verify-otp | POST /api/auth/forgot-password/verify-otp | CHANGED — path |
| API-005 | POST /api/auth/reset-password | POST /api/auth/forgot-password/reset | CHANGED — path |
| API-006 | POST /api/anggota/registration (Public) | POST /api/anggota/pendaftaran (MidAnggota) | CHANGED — path + auth |
| API-007 | GET /api/anggota | GET /api/anggota/all | CHANGED — path |
| API-008 | GET /api/anggota/:id | — (tidak ada; hanya GET /all & /profil) | **MISSING** |
| API-009 | PUT /api/anggota/:id/role | PUT /api/anggota/:member_id/role | ✅ MATCH* (param name beda, shape sama) |
| API-010 | PUT /api/anggota/:id/archive | DELETE /api/anggota/:member_id | CHANGED — method + semantik (hard delete) |
| API-011 | PUT /api/anggota/:id/restore | — (tidak ada restore) | **MISSING** |
| API-012 | POST /api/anggota/termination | POST /api/anggota/berhenti-keanggotaan (+ /status, /konfirmasi) | CHANGED — path |
| API-013 | GET /api/approvals | GET /api/approvals/pendaftaran/pending (+ per-entitas lain) | CHANGED — per-entitas |
| API-014 | GET /api/approvals/:id | — (tidak ada) | **MISSING** |
| API-015 | POST /api/approvals/:id/decision | PUT /api/approvals/{pendaftaran,penarikan,financing,tabungan,sukuk}/approve/:entityId | CHANGED — method + per-entitas |
| API-016 | GET /api/simpanan | GET /api/simpanan/account-detail | CHANGED — path |
| API-017 | GET /api/simpanan/:id/transactions | GET /api/simpanan/riwayat | CHANGED — path |
| API-018 | POST /api/simpanan/withdrawals | POST /api/simpanan/penarikan/request | CHANGED — path |
| API-019 | GET /api/simpanan/config | GET /api/simpanan/config | ✅ MATCH |
| API-020 | PUT /api/simpanan/config (Bendahara) | PUT /api/simpanan/config (Ketua/Bendahara/Pengawas) | CHANGED — role lebih longgar → RESOLVED (DEC-006: spec diselaraskan) |
| API-021 | GET /api/billing | GET /api/billing/list/pending | CHANGED — path |
| API-022 | POST /api/billing/:id/proof | POST /api/billing/manual-payment (bill_id di body) | CHANGED — path |
| API-023 | PUT /api/billing/:id/verify | POST /api/billing/verify-manual-payment | CHANGED — method + path |
| API-024 | POST /api/billing/voluntary | POST /api/billing/create-voluntary-bill | CHANGED — path |
| API-025 | POST /api/jualbeli/apply | POST /api/jualbeli/create | CHANGED — path |
| API-026 | POST /api/program/apply | POST /api/financial/apply atau /api/financing/apply | CHANGED — pindah modul |
| API-027 | POST /api/program/modal | POST /api/program/pinjaman/modal | CHANGED — path |
| API-028 | GET /api/financing/sukuk | GET /api/financing/sukuk/catalog | CHANGED — path |
| API-029 | POST /api/financing/sukuk/orders | POST /api/financing/sukuk/order | CHANGED — path |
| API-030 | POST /api/financing/apply | POST /api/financing/apply | ✅ MATCH |
| API-031 | POST /api/program/arisan/batches | POST /api/program/arisan/batches | ✅ MATCH |
| API-032 | POST .../arisan/batches/:id/activate | PUT /api/program/arisan/batches/:id/status | CHANGED — method + path |
| API-033 | POST .../arisan/batches/:id/draw | POST /api/program/arisan/batches/:batchId/draws | CHANGED — path |
| API-034 | GET /api/tabungan/targets | GET /api/tabungan/admin/programs | CHANGED — path |
| API-035 | POST /api/tabungan/targets | POST /api/tabungan/admin/programs | CHANGED — path |
| API-036 | POST /api/tabungan/withdrawals | POST /api/tabungan/pengajuan/:id/withdraw | CHANGED — path |
| API-037 | GET /api/training/curriculums | GET /api/training/curriculums | ✅ MATCH |
| API-038 | GET /api/training/curriculums/:id/materials | GET /api/training/curriculums/:curriculum_id/materials | ✅ MATCH* (param name beda) |
| API-039 | POST /api/training/evaluations/:id/submit | POST /api/training/evaluations | CHANGED — path |
| API-040 | GET /api/dashboard/stats | GET /api/dashboard/ | CHANGED — path |
| API-041 | GET /api/dashboard/approval-queue | GET /api/dashboard/admin | CHANGED — path |
| API-042 | GET /api/notifikasi | GET /api/notifikasi/list | CHANGED — path |
| API-043 | PUT /api/notifikasi/:id/read | POST /api/notifikasi/update-status | CHANGED — method + path |
| API-044 | POST /api/push/subscribe | POST /api/push/subscribe | ✅ MATCH |
| API-045 | GET /api/landing | GET /api/landing/services, /stats, /about, /contact, /content | CHANGED — dipecah |
| API-046 | GET /api/content/articles | GET /api/content/articles | ✅ MATCH |
| API-047 | POST /api/landing/contact | POST /api/landing/contact-form | CHANGED — path |
| API-048 | GET /api/billing/fee-config | GET /api/billing/payment-fees (publik!) | CHANGED — path + auth |
| API-049 | PUT /api/billing/fee-config (Bendahara) | PUT /api/billing/payment-fees (Pengawas/Ketua/Bendahara) | CHANGED — path + role → RESOLVED (DEC-006: role diselaraskan; path tetap di §4) |
| API-050 | GET /api/files/:filename | GET /api/files/*filePath | ✅ MATCH* (wildcard + auth + traversal guard) |

**Ringkasan:** ✅ MATCH = 10 (API-002, 009, 019, 030, 031, 037, 038, 044, 046, 050) · CHANGED = 37 · MISSING = 3 (API-008, API-011, API-014).

### 6.2 Route aktual yang tidak tercakup spec v1 (highlight per modul)

| Modul | Jumlah route tambahan | Contoh |
| --- | --- | --- |
| M-MEMBER | +8 | `GET/PUT /profil`, `getRegistrationStatus`, `berhenti-keanggotaan/*` (3), `template-import`, `import`, `roles`, `batch-delete`, `DELETE /:member_id` |
| M-APPROVAL | +8 | `process/:entityRef/:entityId` (generik), per-entitas approve/pembayaran (penarikan, tabungan_penarikan, financing, tabungan, sukuk) |
| M-SAVINGS-alt (`/api/savings`) | +11 | modul paralel: `apply`, `history`, `options`, `summary`, `admin-*` (4), `template-import`, `import`, `:id` |
| M-FINANCING-alt (`/api/financial`) | +11 | `summary`, `history`, `report/pinjaman`, `report/arisan`, `apply`, `detail/:id`, `options`, `terms`, `pelunasan-items/:id`, `hutang/create`, `aktiva-tetap/create` |
| M-FINANCING (financing) | +20 | `loan-products`, `report/*` (2), `history`, `apply-arisan`, `detail/:id`, `options`, `terms`, `sukuk/issue` CRUD (4), `sukuk/portfolio`, `sukuk/detail/:id`, `sukuk/members/:id`, `sukuk/order/:id`, `sukuk/report`, `sukuk/withdraw/*` (2), `investasi/*` (2), `pendanaan/*` (2), `evidence` (3), `receipt/:id` |
| M-ARISAN+PINJAMAN (program) | +22 | `pinjaman` (GET), `pinjaman/produk`, `arisan/available`, `arisan/detail/:id`, `arisan` (GET), `batches/:id` (PUT/DELETE), `participants` (3), `payments` (2), `draws/:id/status`, `options`, `pinjaman/*` import (4), `arisan/*` import (2) |
| M-TABUNGAN | +13 | `programs`, `pengajuan` (POST), `pengajuan/detail/:id`, `pengajuan/check`, `pengajuan/:id/tagihan`, `admin` (GET), `admin/export`, `admin/transactions`, `admin/pengajuan/:id/tagihan`, `admin/programs` CRUD (4), `admin/import*` (2) |
| M-TRAINING | +13 | `materials/:material_id`, `notes`, `rankings`, `my-ranking`, admin CRUD curriculums/materials/evaluations (12), `admin/rankings` |
| M-BILLING | +10 | `cooperative-banks`, `manual-verifications`, `list/history`, `invoice/details`, `create-deposit`, `process-payment` (DOKU), `manual-payment`, `process-savings`, `sync-status` (Midtrans), `manual-sync-summary` |
| M-REGION | +4 | `provinces`, `regencies/:provinceId`, `districts/:regencyId`, `villages/:districtId` (publik) |
| Lainnya | +6 | `auth/register`, `auth/forgot-password/resend-otp`, `push/vapid-public-key`, `push/test-push`, `landing/stats|about|contact|content`, `content/landing-text` |

### 6.3 Temuan & keputusan

| ID | Temuan | Dampak | Keputusan / tindak lanjut |
| --- | --- | --- | --- |
| REC-1 | ~~Frontend (admin & public) sudah memakai endpoint **aktual** (mis. `UBilling` → `/billing/list/pending`, `/billing/manual-payment`, `/billing/cooperative-banks`) — bukan endpoint spec v1~~ **RESOLVED 2026-11-22 (TASK-008)** — §3 ditulis ulang mengikuti implementasi aktual (path/method/auth), API-001..050 dipertahankan sebagai ID yang dipetakan ke route aktual, API-051..054 baru untuk `/api/regions`; ideal v1 diarsipkan di §3.1 + git history | — | Selesai — lihat `10_DEV_LOG.md` TASK-008 |
| REC-2 | ~~Backend masih memiliki DOKU & Midtrans aktif~~ **RESOLVED 2026-11-22 (BLK-006)** — endpoint `POST /api/billing/sync-status` + controller `syncMidtransStatus` dihapus; `POST /api/billing/process-payment` dipertahankan (masih dipakai kedua frontend) tapi dibersihkan: controller rename `createDokuTransaction.js` → `createPaymentBill.js`, `payment_type: "doku"` → `"transfer_manual"`, metadata DOKU dihapus; model `MidtransDisbursement` + associations + `generateDokuSnapKeys.js` dihapus | — | Selesai — lihat `10_DEV_LOG.md` BLK-006 |
| REC-3 | ~~Role divergence: spec v1 "Bendahara only" untuk config simpanan & fee-config, aktual "Pengawas/Ketua/Bendahara"; disburse simpanan aktual "Ketua/Bendahara/Pengawas"~~ **RESOLVED 2026-11-22 (BLK-007 / DEC-006)** — spec **dilonggarkan** mengikuti implementasi: konfigurasi keuangan (simpanan & fee) = Ketua/Bendahara/Pengawas; disburse simpanan tetap Ketua/Bendahara/Pengawas. Tanpa perubahan kode; risiko SoD diterima tertulis (mitigasi: audit log) | — | Selesai — lihat `10_DEV_LOG.md` BLK-007 |
| REC-4 | ~~`GET /api/notifikasi/list` & `POST /api/notifikasi/update-status` tanpa `MidAnggota`~~ **RESOLVED 2026-11-22 (BLK-008)** — route ternyata sudah pakai `MidAnggota` (`router.use`), tapi audit lanjutan menemukan **IDOR**: `getNotificationList` menerima `req.query.member_id` & `pushController` menerima `member_id` dari body → siapa pun login bisa baca/tandai notifikasi member lain & subscribe/test-push ke member lain. Diperbaiki: query/body `member_id` dihapus, identity hanya dari `req.userId`; `pushRoutes` `/subscribe` & `/test-push` ditambah `MidAnggota` | — | Selesai — lihat `10_DEV_LOG.md` BLK-008 |
| REC-5 | Modul ganda: simpanan (`/api/simpanan` + `/api/savings`) dan pembiayaan (`/api/financing` + `/api/financial` + `/api/jualbeli`) | Duplikasi logika & risiko divergensi perhitungan | Catat untuk triase: konsolidasi pasca-TASK-008 (arsitektur, bukan blocker) |
| REC-6 | `GET /api/billing/payment-fees` publik (tanpa auth) | Nominal biaya admin bukan rahasia, tapi konsistensi auth | Terima (data konfigurasi publik) — catat di TASK-008 |

**Kesimpulan BLK-003:** Verifikasi selesai — divergensi terdokumentasi penuh di §6. Blocker BLK-003 dianggap **RESOLVED** dengan tindak lanjut BLK-006 (P0), BLK-007, BLK-008, dan NEW-001/TASK-008.