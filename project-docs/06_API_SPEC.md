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

> **⚠️ Status rekonsiliasi (2026-11-22):** Detail endpoint di bawah ini adalah **kontrak v1 (idealis)** yang disusun sebelum verifikasi implementasi. Verifikasi terhadap `api.kkpus.id/routes/` menemukan divergensi besar (path, method, dan cakupan berbeda). **Rujukan yang akurat adalah §4 (inventaris aktual) dan §6 (matriks rekonsiliasi).** Rewrite detail §3 dijadwalkan sebagai TASK-008.

---

### M-AUTH — Authentication

#### [API-001] POST /api/auth/login

**Purpose:** Autentikasi pengguna, terbitkan JWT + cookie.  
**Authorization:** Public  
**Idempotency:** N/A

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | identifier | string | yes | Email atau nomor HP terdaftar | Email/HP pengguna |
| body | password | string | yes | Min 8 char | Password plaintext |

```json
{ "identifier": "member@example.com", "password": "SecurePass123" }
```

| Status | When | Body |
| --- | --- | --- |
| 200 | Login berhasil | `{ "token": "eyJ...", "user": { "member_id": "...", "role": 5, "name": "..." } }` + cookie `auth_token` |
| 401 | Kredensial salah | `INVALID_CREDENTIALS` |
| 423 | Akun terkunci | `ACCOUNT_LOCKED` — `locked_until` timestamp |
| 429 | Rate limit (5/menit) | `RATE_LIMITED` |

**Side effects:** `login_attempts` record; `account_lockouts` jika gagal 5×; Socket.IO auth init.  
**Related:** PRD-001, UC-01.01, TEST-001

---

#### [API-002] POST /api/auth/logout

**Purpose:** Cabut token, hapus sesi.  
**Authorization:** Authenticated

| Status | When | Body |
| --- | --- | --- |
| 200 | Logout berhasil | `{ "message": "Logged out" }` + cookie cleared |

**Side effects:** Token ditambahkan ke denylist (`tokenRevocationService`).  
**Related:** PRD-001, UC-01.02, TEST-001

---

#### [API-003] POST /api/auth/forgot-password

**Purpose:** Kirim OTP untuk reset password.  
**Authorization:** Public  
**Idempotency:** N/A (rate-limited 3/menit per IP)

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | identifier | string | yes | Email atau HP terdaftar | Email/HP pengguna |

| Status | When | Body |
| --- | --- | --- |
| 200 | OTP terkirim | `{ "message": "OTP sent to your email/phone" }` |
| 404 | Pengguna tidak ditemukan | `NOT_FOUND` |
| 429 | Rate limit | `RATE_LIMITED` |

**Side effects:** `forgotPasswordSession` record; OTP 6-digit dikirim via email/SMS.  
**Related:** PRD-002, UC-01.03, TEST-002

---

#### [API-004] POST /api/auth/verify-otp

**Purpose:** Verifikasi OTP.  
**Authorization:** Public

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | identifier | string | yes | Email/HP | Email/HP pengguna |
| body | otp | string | yes | 6 digit, numerik | Kode OTP |

| Status | When | Body |
| --- | --- | --- |
| 200 | OTP valid | `{ "reset_token": "uuid", "expires_at": "ISO-8601" }` |
| 400 | OTP salah | `OTP_INVALID` — sisa percobaan |
| 410 | OTP kedaluwarsa | `OTP_EXPIRED` |

**Side effects:** `forgotPasswordSession.verified_at` di-set.  
**Related:** PRD-002, UC-01.03, TEST-002

---

#### [API-005] POST /api/auth/reset-password

**Purpose:** Set password baru setelah verifikasi OTP.  
**Authorization:** Public (dengan valid reset_token)

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | reset_token | string (UUID) | yes | Token valid & belum kedaluwarsa | Reset token dari API-004 |
| body | new_password | string | yes | Min 8 char, uppercase, lowercase, angka | Password baru |

| Status | When | Body |
| --- | --- | --- |
| 200 | Password direset | `{ "message": "Password updated successfully" }` |
| 400 | Password tidak memenuhi kompleksitas | `VALIDATION_ERROR` |

**Side effects:** Password di-hash (bcrypt); `passwordResetToken` record dibuat; session dihapus.  
**Related:** PRD-002, UC-01.03, TEST-002

---

### M-MEMBER — Member Management

#### [API-006] POST /api/anggota/registration

**Purpose:** Registrasi calon anggota baru (8-step form).  
**Authorization:** Public  
**Idempotency:** NIK unik, email unik

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | full_name | string | yes | Min 3 char | Nama lengkap |
| body | email | string | yes | Format email, unik | Email |
| body | password | string | yes | Min 8 char, upper, lower, number | Password awal |
| body | nik_ktp | string | yes | 16 digit, unik | NIK |
| body | ktp_photo | file | yes | JPG/PNG/PDF, ≤5MB, magic byte | Foto KTP |
| body | selfie | file | yes | JPG/PNG, ≤5MB, magic byte | Foto selfie |
| body | phone_number | string | yes | Format nomor Indonesia | No. HP |
| body | gender | string | yes | `male` / `female` | Jenis kelamin |
| body | date_of_birth | date | yes | Format YYYY-MM-DD, usia ≥17 | Tanggal lahir |
| body | province_id | string (UUID) | yes | Wilayah valid | Provinsi |
| body | city_id | string (UUID) | yes | Wilayah valid | Kabupaten/Kota |
| body | district_id | string (UUID) | yes | Wilayah valid | Kecamatan |
| body | subdistrict_id | string (UUID) | yes | Wilayah valid | Kelurahan/Desa |
| body | address | string | yes | Min 10 char | Alamat lengkap |
| body | rt / rw | string | yes | 3 digit | RT/RW |
| body | employment | object | yes | — | Data pekerjaan |
| body | emergency_contact | object | yes | — | Kontak darurat |
| body | bank_account | object | yes | — | Rekening bank |

| Status | When | Body |
| --- | --- | --- |
| 201 | Registrasi berhasil (PENDING) | `{ "registration_id": "...", "status": "PENDING" }` |
| 400 | Validasi gagal | `VALIDATION_ERROR` |
| 409 | NIK/email sudah terdaftar | `NIK_DUPLICATE` / `EMAIL_DUPLICATE` |
| 422 | File tidak valid | `FILE_INVALID` |

**Side effects:** `member_registrations` record; approval flow dibuat (3 step); Socket.IO `REGISTRATION_UPDATED`.  
**Related:** PRD-003, UC-02.01, TEST-003

---

#### [API-007] GET /api/anggota

**Purpose:** List anggota dengan pagination & filter.  
**Authorization:** Pengawas, Ketua, Bendahara

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | page | int | no | Default 1 |
| query | limit | int | no | Default 20, max 100 |
| query | search | string | no | Cari nama/NIK/email |
| query | status | string | no | `active` / `archived` / `pending` |

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "total": 150, "page": 1, "total_pages": 8 }` |
| 403 | Akses ditolak | `FORBIDDEN` |

**Related:** PRD-003, PRD-020

---

#### [API-008] GET /api/anggota/:id

**Purpose:** Detail anggota.  
**Authorization:** Anggota sendiri, atau Pengawas/Ketua/Bendahara

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | Member object (NIK/HP di-mask sesuai peran) |
| 404 | Anggota tidak ditemukan | `NOT_FOUND` |

**Related:** PRD-022, UC-02.01

---

#### [API-009] PUT /api/anggota/:id/role

**Purpose:** Assign peran pengurus ke anggota.  
**Authorization:** Pengawas, Ketua, Bendahara

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | role_id | string (UUID) | yes | `pengawas` / `ketua` / `bendahara` | Peran yang di-assign |
| body | start_date | date | yes | Format YYYY-MM-DD | Mulai berlaku |

| Status | When | Body |
| --- | --- | --- |
| 200 | Role berhasil di-assign | `{ "assignment_id": "...", "role": "pengawas" }` |
| 400 | Anggota tipe Luar Biasa | `MEMBER_TYPE_INVALID` |
| 409 | Anggota sudah punya role aktif | `ROLE_ASSIGNED` |

**Side effects:** `member_role_assignments` record; `activity_logs` entry.  
**Related:** PRD-005, UC-02.02, TEST-005

---

#### [API-010] PUT /api/anggota/:id/archive

**Purpose:** Arsip (soft-delete) anggota.  
**Authorization:** Pengawas, Ketua, Bendahara

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | password | string | yes | Password admin untuk konfirmasi (re-auth) |

| Status | When | Body |
| --- | --- | --- |
| 200 | Anggota diarsipkan | `{ "message": "Member archived" }` |
| 401 | Password salah | `PASSWORD_INVALID` |

**Side effects:** `deleted_at` di-set; `activity_logs` entry.  
**Related:** PRD-006, UC-02.03, TEST-006

---

#### [API-011] PUT /api/anggota/:id/restore

**Purpose:** Restore anggota yang diarsipkan.  
**Authorization:** Pengawas, Ketua, Bendahara

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | password | string | yes | Password admin untuk konfirmasi (re-auth) |

| Status | When | Body |
| --- | --- | --- |
| 200 | Anggota di-restore | `{ "message": "Member restored" }` |
| 401 | Password salah | `PASSWORD_INVALID` |

**Side effects:** `deleted_at` di-clear; `activity_logs` entry.  
**Related:** PRD-006, UC-02.03, TEST-006

---

#### [API-012] POST /api/anggota/termination

**Purpose:** Ajukan terminasi/pengunduran diri.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | reason | string | yes | Alasan pengunduran diri |

| Status | When | Body |
| --- | --- | --- |
| 201 | Pengajuan terminasi dibuat | `{ "termination_id": "...", "status": "PENDING" }` |
| 400 | Ada tagihan pending / aset dipegang | `PENDING_BILLS_EXIST` / `ASSETS_HELD` |

**Side effects:** `membership_terminations` record; approval flow dibuat.  
**Related:** PRD-003, UC-02.04, TEST-004

---

### M-APPROVAL — Approval Engine

#### [API-013] GET /api/approvals

**Purpose:** List approval queue (pending approvals).  
**Authorization:** Pengawas, Ketua, Bendahara

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | entity_type | string | no | Filter per jenis (registration, withdrawal, jualbeli, dll.) |
| query | status | string | no | Default `PENDING` |
| query | page | int | no | Default 1 |
| query | limit | int | no | Default 20 |

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "total": 5, "page": 1 }` |

**Related:** PRD-004, UC-03.01, TEST-007

---

#### [API-014] GET /api/approvals/:id

**Purpose:** Detail approval beserta step-stepnya.  
**Authorization:** Pengawas, Ketua, Bendahara

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | Approval object + steps array |
| 404 | Tidak ditemukan | `NOT_FOUND` |

**Related:** PRD-004, UC-03.01, TEST-007

---

#### [API-015] POST /api/approvals/:id/decision

**Purpose:** Approve atau reject step approval.  
**Authorization:** Pengawas (step 1), Ketua (step 2), Bendahara (step 3)

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | decision | string | yes | `APPROVE` / `REJECT` | Keputusan |
| body | note | string | no (required jika REJECT) | Min 5 char jika reject | Catatan/alasan |

| Status | When | Body |
| --- | --- | --- |
| 200 | Step berhasil di-approve | `{ "step": 2, "next_step": 3, "status": "PENDING" }` |
| 200 | Final approval (step 3) | `{ "status": "APPROVED", "final_action": "executed" }` |
| 200 | Ditolak | `{ "status": "REJECTED", "note": "..." }` |
| 403 | Bukan step-nya | `INVALID_ROLE` |
| 403 | Self-approval | `SELF_APPROVAL` |
| 409 | Sudah approve step lain | `DUPLICATE_APPROVAL` |
| 409 | Sudah final | `ALREADY_FINALIZED` |

**Side effects:** Step di-update; `EntityStepApproval` record; jika final → `performFinalAction()`; Socket.IO `APPROVAL_UPDATE`; `activity_logs`.  
**Related:** PRD-004, UC-03.01, TEST-007, TEST-007a, TEST-007b, TEST-007c

---

### M-SAVINGS — Simpanan

#### [API-016] GET /api/simpanan

**Purpose:** List simpanan anggota (pokok/wajib/sukarela).  
**Authorization:** Anggota sendiri, atau Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "total_savings": 5000000, "total_pokok": 100000, "total_wajib": 2400000 }` |

**Related:** PRD-007, UC-04.01, TEST-008

---

#### [API-017] GET /api/simpanan/:id/transactions

**Purpose:** Mutasi transaksi simpanan.  
**Authorization:** Anggota sendiri, atau Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "total": 12 }` |

**Related:** PRD-007, UC-04.01, TEST-008

---

#### [API-018] POST /api/simpanan/withdrawals

**Purpose:** Ajukan pencairan simpanan sukarela.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | amount | decimal | yes | > 0, ≤ saldo tersedia | Nominal pencairan |
| body | reason | string | yes | Min 10 char | Alasan pencairan |

| Status | When | Body |
| --- | --- | --- |
| 201 | Pengajuan dibuat | `{ "withdrawal_id": "...", "status": "PENDING" }` |
| 400 | Saldo tidak cukup | `INSUFFICIENT_BALANCE` |
| 409 | Sudah ada pending withdrawal | `PENDING_WITHDRAWAL_EXISTS` |

**Side effects:** `savings_withdrawals` record; approval flow dibuat.  
**Related:** PRD-007, UC-04.02, TEST-009

---

#### [API-019] GET /api/simpanan/config

**Purpose:** Lihat konfigurasi nominal simpanan & akad.  
**Authorization:** Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "pokok": { "amount": 100000, "akad": "Wadiah" }, "wajib": { "amount": 200000, "akad": "Wadiah" } }` |

**Related:** PRD-024, PRD-025, UC-04.03, TEST-010

---

#### [API-020] PUT /api/simpanan/config

**Purpose:** Update konfigurasi nominal simpanan & akad.  
**Authorization:** Bendahara

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | product | string | yes | `pokok` / `wajib` / `sukarela` | Jenis simpanan |
| body | amount | decimal | yes | > 0 | Nominal |
| body | akad | string | yes | `Wadiah` / `Mudharabah` / `Musyarakah` / `Murabahah` / `Qardh` / `Wakalah` | Akad |
| body | effective_date | date | yes | Format YYYY-MM-DD, ≥ hari ini | Tanggal efektif |

| Status | When | Body |
| --- | --- | --- |
| 200 | Konfigurasi di-update | `{ "message": "Config updated" }` |
| 400 | Nominal ≤ 0 / tanggal lewat | `INVALID_NOMINAL` / `PAST_EFFECTIVE_DATE` |

**Side effects:** `feature_configs` di-update.  
**Related:** PRD-024, PRD-025, UC-04.03, TEST-010

---

### M-BILLING — Billing & Payments

#### [API-021] GET /api/billing

**Purpose:** List tagihan anggota.  
**Authorization:** Anggota sendiri, atau Pengurus

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | status | string | no | `PENDING` / `PENDING_VERIFICATION` / `LUNAS` / `OVERDUE` |

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "total": 3, "total_amount": 5000000 }` |

**Related:** PRD-008, UC-05.01, TEST-011

---

#### [API-022] POST /api/billing/:id/proof

**Purpose:** Upload bukti transfer pembayaran.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | proof_file | file | yes | JPG/PNG/PDF, ≤5MB, magic byte | Bukti transfer |
| body | bank_account_id | string (UUID) | yes | Rekening koperasi valid | Rekening tujuan transfer |
| body | amount | decimal | yes | > 0, = tagihan amount + fee | Nominal ditransfer |

| Status | When | Body |
| --- | --- | --- |
| 200 | Bukti di-upload | `{ "transaction_id": "...", "status": "PENDING_VERIFICATION" }` |
| 400 | File tidak valid | `FILE_INVALID` |
| 400 | Nominal tidak cocok | `AMOUNT_MISMATCH` |
| 409 | Sudah diverifikasi | `ALREADY_VERIFIED` |

**Side effects:** `transactions` record (PENDING_VERIFICATION); `bills` status di-update; Socket.IO `TRANSACTION_UPDATED`.  
**Related:** PRD-008, UC-05.01, TEST-011

---

#### [API-023] PUT /api/billing/:id/verify

**Purpose:** Verifikasi pembayaran oleh Bendahara.  
**Authorization:** Bendahara

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | decision | string | yes | `APPROVE` / `REJECT` | Keputusan verifikasi |
| body | note | string | no (required jika REJECT) | Min 5 char jika reject | Catatan |

| Status | When | Body |
| --- | --- | --- |
| 200 | Pembayaran disetujui | `{ "status": "LUNAS", "bill_status": "LUNAS" }` |
| 200 | Pembayaran ditolak | `{ "status": "REJECTED", "bill_status": "PENDING" }` |
| 409 | Sudah diverifikasi | `ALREADY_VERIFIED` |

**Side effects:** `transactions` status di-update; saldo/ledger ter-update; Socket.IO `TRANSACTION_UPDATED`; `activity_logs`.  
**Related:** PRD-008, UC-05.01, TEST-011

---

#### [API-024] POST /api/billing/voluntary

**Purpose:** Buat tagihan sukarela.  
**Authorization:** Bendahara

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | member_id | string (UUID) | yes | Anggota valid | ID anggota |
| body | amount | decimal | yes | > 0 | Nominal tagihan |
| body | description | string | yes | Min 5 char | Deskripsi tagihan |
| body | due_date | date | yes | ≥ hari ini | Jatuh tempo |

| Status | When | Body |
| --- | --- | --- |
| 201 | Tagihan dibuat | `{ "bill_id": "...", "status": "PENDING" }` |

**Related:** PRD-008, UC-05.02, TEST-012

---

### M-FINANCING — Pembiayaan

#### [API-025] POST /api/jualbeli/apply

**Purpose:** Ajukan pembiayaan jual beli (murabahah).  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | barang | string | yes | Min 3 char | Nama barang |
| body | harga_pokok | decimal | yes | > 0 | Harga pokok |
| body | dp | decimal | yes | ≥ 0, < harga_jual | Down payment |
| body | tenor_months | int | yes | 1-60 | Tenor angsuran |
| body | margin_percent | decimal | yes | > 0 | Persentase laba |

| Status | When | Body |
| --- | --- | --- |
| 201 | Pengajuan dibuat | `{ "jualbeli_id": "...", "angsuran": 250000, "harga_jual": 3000000, "status": "PENDING" }` |
| 400 | Input tidak valid | `INVALID_AMOUNT` / `INVALID_TENOR` |

**Side effects:** `jual_beli` record; approval flow dibuat.  
**Related:** PRD-010, UC-06.01, TEST-013

---

#### [API-026] POST /api/program/apply

**Purpose:** Ajukan pinjaman lunak.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | amount | decimal | yes | > 0 | Jumlah pinjaman |
| body | tenor_months | int | yes | 1-60 | Tenor |
| body | purpose | string | yes | Min 10 char | Tujuan pinjaman |

| Status | When | Body |
| --- | --- | --- |
| 201 | Pengajuan dibuat | `{ "loan_id": "...", "status": "PENDING" }` |
| 400 | Input tidak valid | `INVALID_AMOUNT` |

**Side effects:** `member_loans` record; approval flow dibuat.  
**Related:** PRD-011, UC-07.01, TEST-014

---

#### [API-027] POST /api/program/modal

**Purpose:** Input modal koperasi (debet/kredit).  
**Authorization:** Bendahara

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | type | string | yes | `DEBET` / `KREDIT` | Tipe modal |
| body | amount | decimal | yes | > 0 | Nominal |
| body | description | string | yes | Min 5 char | Deskripsi |

| Status | When | Body |
| --- | --- | --- |
| 201 | Modal dicatat | `{ "id": "...", "type": "DEBET", "amount": 5000000 }` |

**Side effects:** `pinjaman_modal` record; ledger ter-update.  
**Related:** PRD-011, UC-07.02, TEST-015

---

#### [API-028] GET /api/financing/sukuk

**Purpose:** List katalog sukuk.  
**Authorization:** Anggota, Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...] }` |

**Related:** PRD-014, UC-10.01, TEST-020

---

#### [API-029] POST /api/financing/sukuk/orders

**Purpose:** Ajukan investasi sukuk.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | issue_id | string (UUID) | yes | Sukuk issue valid & status OPEN | ID issue |
| body | amount | decimal | yes | > 0, ≤ sisa kuota | Jumlah investasi |

| Status | When | Body |
| --- | --- | --- |
| 201 | Order dibuat | `{ "order_id": "...", "status": "PENDING" }` |
| 400 | Melebihi kuota | `QUOTA_EXCEEDED` |

**Side effects:** `sukuk_orders` record; approval flow dibuat.  
**Related:** PRD-014, UC-10.01, TEST-020

---

#### [API-030] POST /api/financing/apply

**Purpose:** Ajukan pendanaan syariah.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | category_id | string (UUID) | yes | Kategori pembiayaan valid | ID kategori |
| body | amount | decimal | yes | > 0 | Jumlah pendanaan |
| body | tenor_months | int | yes | 1-60 | Tenor |
| body | purpose | string | yes | Min 10 char | Tujuan |
| body | akad | string | yes | `Mudharabah` / `Musyarakah` / dll | Akad syariah |

| Status | When | Body |
| --- | --- | --- |
| 201 | Pengajuan dibuat | `{ "application_id": "...", "status": "PENDING" }` |

**Side effects:** `financing_applications` record; approval flow dibuat.  
**Related:** PRD-015, UC-11.01, TEST-021

---

### M-ARISAN — Arisan

#### [API-031] POST /api/program/arisan/batches

**Purpose:** Buat batch arisan.  
**Authorization:** Bendahara

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | program_id | string (UUID) | yes | Program arisan valid | ID program |
| body | quota | int | yes | > 0 | Kuota peserta |
| body | target_amount | decimal | yes | > 0 | Target per angsuran |
| body | monthly_installment | decimal | yes | > 0 | Angsuran bulanan |
| body | tenor_months | int | yes | > 0 | Tenor (bulan) |
| body | start_date | date | yes | ≥ hari ini | Mulai berlaku |

| Status | When | Body |
| --- | --- | --- |
| 201 | Batch dibuat | `{ "batch_id": "...", "status": "DRAFT" }` |

**Related:** PRD-012, UC-08.01, TEST-016

---

#### [API-032] POST /api/program/arisan/batches/:id/activate

**Purpose:** Aktivasi batch arisan.  
**Authorization:** Bendahara

| Status | When | Body |
| --- | --- | --- |
| 200 | Batch diaktifkan | `{ "status": "ACTIVE" }` |

**Related:** PRD-012, UC-08.01, TEST-016

---

#### [API-033] POST /api/program/arisan/batches/:id/draw

**Purpose:** Jalankan kocokan/draw bulanan.  
**Authorization:** Bendahara

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | period | string | yes | Periode bulan (contoh: `2026-11`) |

| Status | When | Body |
| --- | --- | --- |
| 200 | Draw berhasil | `{ "draw_id": "...", "winner_participant_id": "...", "period": "2026-11" }` |
| 400 | Angsuran belum lunas | `INSTALLMENTS_UNPAID` |

**Side effects:** `arisan_draws` record; `arisan_participants.status` → WON. RNG kriptografis (BR-08.04).  
**Related:** PRD-012, UC-08.02, TEST-017

---

### M-TABUNGAN — Tabungan Bertarget

#### [API-034] GET /api/tabungan/targets

**Purpose:** List master program tabungan.  
**Authorization:** Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...] }` |

**Related:** PRD-013, UC-09.01, TEST-018

---

#### [API-035] POST /api/tabungan/targets

**Purpose:** Buat master program tabungan baru.  
**Authorization:** Pengurus

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | program_name | string | yes | Min 3 char | Nama program |
| body | target_amount | decimal | yes | > 0 | Target nominal |
| body | category | string | yes | Kategori tabungan | Kategori |
| body | year | int | yes | 4 digit | Tahun |

| Status | When | Body |
| --- | --- | --- |
| 201 | Program dibuat | `{ "target_id": "...", "status": "ACTIVE" }` |

**Related:** PRD-013, UC-09.01, TEST-018

---

#### [API-036] POST /api/tabungan/withdrawals

**Purpose:** Ajukan penarikan tabungan.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | target_id | string (UUID) | yes | Program tabungan valid | ID target |
| body | amount | decimal | yes | > 0, ≤ saldo | Nominal penarikan |
| body | reason | string | yes | Min 10 char | Alasan |

| Status | When | Body |
| --- | --- | --- |
| 201 | Pengajuan dibuat | `{ "withdrawal_id": "...", "status": "PENDING" }` |
| 400 | Saldo tidak cukup | `INSUFFICIENT_BALANCE` |

**Side effects:** `savings_withdrawals` (tipe TABUNGAN); approval flow dibuat.  
**Related:** PRD-013, UC-09.02, TEST-019

---

### M-TRAINING — Training & Evaluasi

#### [API-037] GET /api/training/curriculums

**Purpose:** List kurikulum pelatihan.  
**Authorization:** Anggota, Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...] }` |

**Related:** PRD-016, UC-12.01, TEST-022

---

#### [API-038] GET /api/training/curriculums/:id/materials

**Purpose:** List materi dalam kurikulum.  
**Authorization:** Anggota, Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "curriculum": {...} }` |

**Related:** PRD-016, UC-12.01, TEST-022

---

#### [API-039] POST /api/training/evaluations/:id/submit

**Purpose:** Submit jawaban kuis/evaluasi.  
**Authorization:** Anggota sendiri

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | answers | array | yes | Format `{ question_id, answer_index }` | Jawaban kuis |

| Status | When | Body |
| --- | --- | --- |
| 200 | Nilai tersimpan | `{ "score": 85, "rank": 3, "total_points": 100 }` |
| 400 | Jawaban tidak lengkap | `VALIDATION_ERROR` |

**Side effects:** `rankings` record; Socket.IO notifikasi.  
**Related:** PRD-016, UC-12.01, TEST-022

---

### M-DASHBOARD — Dashboard & Reports

#### [API-040] GET /api/dashboard/stats

**Purpose:** Statistik dashboard pengurus.  
**Authorization:** Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "anggota": 150, "simpanan": 50000000, "jual_beli": 12, "program": 8, "tabungan": 5, "investasi": 3 }` |

**Related:** PRD-018, UC-14.01, TEST-024

---

#### [API-041] GET /api/dashboard/approval-queue

**Purpose:** Antrean approval per kategori.  
**Authorization:** Pengurus

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | category | string | no | Filter kategori |

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "categories": ["keanggotaan", "simpanan", "jualbeli", "program", "tabungan", "investasi"] }` |

**Related:** PRD-018, UC-14.01, TEST-024

---

### M-NOTIFICATION — Notifications

#### [API-042] GET /api/notifikasi

**Purpose:** List notifikasi user.  
**Authorization:** Authenticated

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | unread_only | boolean | no | Jika true, hanya yang belum dibaca |
| query | page | int | no | Default 1 |

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "unread_count": 3 }` |

**Related:** PRD-017, UC-13.01, TEST-023

---

#### [API-043] PUT /api/notifikasi/:id/read

**Purpose:** Tandai notifikasi sebagai dibaca.  
**Authorization:** Authenticated (notifikasi milik sendiri)

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "message": "Marked as read" }` |

**Related:** PRD-017, UC-13.01, TEST-023

---

#### [API-044] POST /api/push/subscribe

**Purpose:** Subscribe web push (VAPID).  
**Authorization:** Authenticated

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| body | endpoint | string (URL) | yes | Push endpoint |
| body | p256dh | string | yes | Public key |
| body | auth | string | yes | Auth secret |

| Status | When | Body |
| --- | --- | --- |
| 201 | Subscription tersimpan | `{ "message": "Subscribed" }` |

**Related:** PRD-017, UC-13.01, TEST-023

---

### M-CONTENT — Landing & Content

#### [API-045] GET /api/landing

**Purpose:** Data landing page publik.  
**Authorization:** Public

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "stats": {...}, "services": [...], "about": "...", "contact": {...} }` |

**Related:** PRD-023, UC-17.01, TEST-028

---

#### [API-046] GET /api/content/articles

**Purpose:** List artikel publik (status PUBLISHED).  
**Authorization:** Public

| Location | Field | Type | Required | Description |
| --- | --- | --- | --- | --- |
| query | page | int | no | Default 1 |
| query | limit | int | no | Default 10 |

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [...], "total": 5 }` |

**Related:** PRD-023, UC-17.01, TEST-028

---

#### [API-047] POST /api/landing/contact

**Purpose:** Submit form kontak.  
**Authorization:** Public

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | name | string | yes | Min 3 char | Nama |
| body | email | string | yes | Format email | Email |
| body | message | string | yes | Min 10 char | Pesan |

| Status | When | Body |
| --- | --- | --- |
| 201 | Pesan tersimpan | `{ "message": "Contact form submitted" }` |
| 400 | Validasi gagal | `VALIDATION_ERROR` |

**Side effects:** `contact_forms` record.  
**Related:** PRD-023, UC-17.01, TEST-028

---

### M-CONFIG — Konfigurasi

#### [API-048] GET /api/billing/fee-config

**Purpose:** Lihat konfigurasi biaya admin.  
**Authorization:** Pengurus

| Status | When | Body |
| --- | --- | --- |
| 200 | Berhasil | `{ "data": [{ "method": "TRANSFER", "type": "FLAT", "value": 2500 }] }` |

**Related:** PRD-009, UC-18.01, TEST-029

---

#### [API-049] PUT /api/billing/fee-config

**Purpose:** Update konfigurasi biaya admin.  
**Authorization:** Bendahara

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | payment_method | string | yes | `TRANSFER` | Metode pembayaran |
| body | fee_type | string | yes | `FLAT` / `PERCENTAGE` | Tipe biaya |
| body | fee_value | decimal | yes | ≥ 0 | Nilai biaya |

| Status | When | Body |
| --- | --- | --- |
| 200 | Konfigurasi di-update | `{ "message": "Fee config updated" }` |

**Related:** PRD-009, UC-18.01, TEST-029

---

### M-FILES — File Download

#### [API-050] GET /api/files/:filename

**Purpose:** Unduh file dokumen dengan otorisasi.  
**Authorization:** Authenticated (cek kepemilikan / role)

| Status | When | Body |
| --- | --- | --- |
| 200 | File valid | Binary file (content-type sesuai) |
| 403 | Tidak berhak akses | `FORBIDDEN` |
| 404 | File tidak ditemukan | `NOT_FOUND` |

**Side effects:** Path traversal guard (BR-16.03).  
**Related:** PRD-021, UC-16.01, TEST-027

---

### M-CRON — Cron & Backup

> Modul ini tidak memiliki endpoint HTTP publik. Dijalankan via `services/cron.js` secara internal.

| Schedule | Task | Related |
| --- | --- | --- |
| Setiap tanggal 1, 00:00 | Backup DB bulanan | PRD-026, BR-19.01 |
| Setiap hari, 02:00 | Purge dokumen identitas kedaluwarsa (jika `RETENTION_AUTOPURGE=true`) | PRD-026, BR-19.02, DEC-002 |
| Periodik | Sinkronisasi laporan (savings, jualbeli, financial summary) | PRD-026, BR-19.03 |

**Related:** PRD-026, UC-19.01, TEST-030

---

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
| M-FILES | API-050 | F-16 | PRD-021 |
| M-CRON | (internal, no API) | F-19 | PRD-026 |

> **Coverage check:** 15 TSD modules → 50 API endpoints + 1 internal cron. Semua 19 FSD modules tercakup. Semua 26 PRD requirements tercermin di endpoint atau internal process. ✅

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
| API-020 | PUT /api/simpanan/config (Bendahara) | PUT /api/simpanan/config (Ketua/Bendahara/Pengawas) | CHANGED — role lebih longgar (BLK-007) |
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
| API-049 | PUT /api/billing/fee-config (Bendahara) | PUT /api/billing/payment-fees (Pengawas/Ketua/Bendahara) | CHANGED — path + role (BLK-007) |
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
| REC-1 | Frontend (admin & public) sudah memakai endpoint **aktual** (mis. `UBilling` → `/billing/list/pending`, `/billing/manual-payment`, `/billing/cooperative-banks`) — bukan endpoint spec v1 | Kontrak v1 tidak pernah dipakai frontend; spec dan realita harus disatukan | §4 dijadikan inventaris resmi; rewrite detail §3 → **TASK-008** (discovered work NEW-001) |
| REC-2 | ~~Backend masih memiliki DOKU & Midtrans aktif~~ **RESOLVED 2026-11-22 (BLK-006)** — endpoint `POST /api/billing/sync-status` + controller `syncMidtransStatus` dihapus; `POST /api/billing/process-payment` dipertahankan (masih dipakai kedua frontend) tapi dibersihkan: controller rename `createDokuTransaction.js` → `createPaymentBill.js`, `payment_type: "doku"` → `"transfer_manual"`, metadata DOKU dihapus; model `MidtransDisbursement` + associations + `generateDokuSnapKeys.js` dihapus | — | Selesai — lihat `10_DEV_LOG.md` BLK-006 |
| REC-3 | Role divergence: spec v1 "Bendahara only" untuk config simpanan & fee-config, aktual "Pengawas/Ketua/Bendahara"; disburse simpanan aktual "Ketua/Bendahara/Pengawas" | Spec lebih ketat dari implementasi — perlu keputusan owner | **BLK-007** — Product menentukan: perketat implementasi atau longgarkan spec (keduanya butuh perubahan + audit trail) |
| REC-4 | ~~`GET /api/notifikasi/list` & `POST /api/notifikasi/update-status` tanpa `MidAnggota`~~ **RESOLVED 2026-11-22 (BLK-008)** — route ternyata sudah pakai `MidAnggota` (`router.use`), tapi audit lanjutan menemukan **IDOR**: `getNotificationList` menerima `req.query.member_id` & `pushController` menerima `member_id` dari body → siapa pun login bisa baca/tandai notifikasi member lain & subscribe/test-push ke member lain. Diperbaiki: query/body `member_id` dihapus, identity hanya dari `req.userId`; `pushRoutes` `/subscribe` & `/test-push` ditambah `MidAnggota` | — | Selesai — lihat `10_DEV_LOG.md` BLK-008 |
| REC-5 | Modul ganda: simpanan (`/api/simpanan` + `/api/savings`) dan pembiayaan (`/api/financing` + `/api/financial` + `/api/jualbeli`) | Duplikasi logika & risiko divergensi perhitungan | Catat untuk triase: konsolidasi pasca-TASK-008 (arsitektur, bukan blocker) |
| REC-6 | `GET /api/billing/payment-fees` publik (tanpa auth) | Nominal biaya admin bukan rahasia, tapi konsistensi auth | Terima (data konfigurasi publik) — catat di TASK-008 |

**Kesimpulan BLK-003:** Verifikasi selesai — divergensi terdokumentasi penuh di §6. Blocker BLK-003 dianggap **RESOLVED** dengan tindak lanjut BLK-006 (P0), BLK-007, BLK-008, dan NEW-001/TASK-008.