# Functional Specification Document

**Project:** KKPUS Platform  
**Version / status:** 1.0.0 / DRAFT

## 1. Scope and terminology

- **Purpose:** Mendefinisikan perilaku fungsional sistem KKPUS (Koperasi PUS Syariah) — modul, use case, business rules, state transitions, dan traceability ke PRD-001..026. Dokumen ini adalah kontrak antara PRD dan TSD/API/UI spec.
- **Definitions:**
  - **Anggota:** Individu yang terdaftar dan disahkan sebagai anggota koperasi. Terdiri dari tipe **Reguler** dan **Luar Biasa** (tidak dapat diberi peran pengurus).
  - **Peran Pengurus:** Tiga peran organisasi — **Pengawas** (step 1), **Ketua** (step 2), **Bendahara** (step 3/final). Hanya tiga ini yang memiliki hak approval.
  - **Approval berjenjang (maker-checker):** Setiap entitas sensitif (registrasi, penarikan, pembiayaan, dll.) melewati 3 tahap approval berurutan. Approver tidak dapat menyetujui lebih dari satu tahap, dan tidak dapat menyetujui pengajuan yang ia buat sendiri.
  - **Simpanan:** Dana anggota yang terdiri dari **Simpanan Pokok** (sekali), **Simpanan Wajib** (bulanan), dan **Simpanan Sukarela** (setoran & pencairan).
  - **Pembiayaan:** Pendanaan syariah yang diberikan koperasi kepada anggota (jual beli/murabahah, pinjaman lunak, arisan, investasi halal/sukuk, pendanaan syariah, tabungan bertarget).
  - **Tagihan (bill):** Kewajiban pembayaran anggota ke koperasi (simpanan, DP, angsuran, dll.).
  - **Verifikasi manual:** Bendahara memverifikasi bukti transfer sebelum menandai pembayaran sebagai LUNAS.
  - **Jurnal (ledger):** Catatan akuntansi double-entry (debit/kredit) untuk setiap transaksi keuangan.
- **Roles:** Lihat `02_PRD.md` §3. Perbedaan fungsional: peran 2/3/4 (Pengawas/Ketua/Bendahara) memiliki hak approval berjenjang; tipe member 1 (Calon Anggota) & 6 (ALB) tidak dapat mengakses modul Transaksi/Program/Investasi.

## 2. Functional modules

### F-01 — Authentication & Session Management

**Purpose:** Autentikasi pengguna (anggota & pengurus), manajemen sesi, pemulihan password, lockout, dan rate limiting.  
**Actors:** Semua pengguna (anggota, pengurus, guest untuk lupa password).  
**Preconditions:** Akun terdaftar; status member aktif.

#### Use case: UC-01.01 — Login

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | User submit email/HP + password | Rate limiter login aktif | Request diteruskan |
| 2 | System verify credentials | Password hash cocok, akun aktif, tidak terkunci | JWT diterbitkan (Bearer + cookie) |
| 3 | System initialize session | `MidAnggota` middleware, socket init | Redirect ke dashboard |
| 4 | User login gagal 5× | Lockout 15 menit | `account_lockouts` tercatat, 429 response |

**Inputs:** email/HP (string, required), password (string, required).  
**Outputs:** JWT token, cookie `auth_token`, userData di localStorage, socket connection.  
**Errors:** `INVALID_CREDENTIALS` (401), `ACCOUNT_LOCKED` (423), `RATE_LIMITED` (429).

#### Use case: UC-01.02 — Logout

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | User click logout | Token valid | Token ditambahkan ke denylist (`tokenRevocationService`) |
| 2 | Socket disconnect | — | Cookie dihapus, redirect ke login |

**Errors:** `UNAUTHORIZED` (401) jika token sudah revoked.

#### Use case: UC-01.03 — Forgot Password (OTP)

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | User masukkan email/HP terdaftar | Rate limiter OTP aktif | OTP 6-digit dikirim (email/SMS), session tersimpan |
| 2 | User verifikasi OTP | OTP cocok, belum kedaluwarsa (10 menit) | Reset token diterbitkan |
| 3 | User set password baru | Password complexity (min 8 char, uppercase, lowercase, number) | Password di-hash, session dihapus, redirect ke login |

**Errors:** `OTP_INVALID` (400), `OTP_EXPIRED` (410), `RATE_LIMITED` (429).

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-01.01 | Login gagal 5× → lockout 15 menit | Server (rateLimiter + authLoggingService) | PRD-001 |
| BR-01.02 | Logout menambahkan token ke denylist; token tidak bisa dipakai lagi | Server (tokenRevocationService) | PRD-001 |
| BR-01.03 | OTP kedaluwarsa 10 menit, max 3 percobaan verifikasi | Server (forgotPasswordService) | PRD-002 |
| BR-01.04 | Password minimal 8 char, uppercase, lowercase, angka | Client (form validation) + Server (validasi) | PRD-001, PRD-002 |
| BR-01.05 | Login & OTP di-rate-limit (mis. 5 req/menit per IP) | Server (rateLimiter middleware) | PRD-001 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| Account | UNVERIFIED | Login sukses | ACTIVE | Token diterbitkan, session init |
| Account | ACTIVE | Login gagal 5× | LOCKED | Durasi 15 menit, audit log |
| Account | LOCKED | 15 menit berlalu | ACTIVE | Auto-unlock |
| PasswordReset | REQUESTED | OTP dikirim | OTP_SENT | Session tersimpan, expiry 10 menit |
| PasswordReset | OTP_SENT | OTP verifikasi sukses | VERIFIED | Reset token diterbitkan |
| PasswordReset | VERIFIED | Password di-set | COMPLETED | Session dihapus, password di-hash |

---

### F-02 — Member Onboarding & Lifecycle

**Purpose:** Pendaftaran anggota baru, verifikasi dokumen, penetapan peran, soft-delete/restore, terminasi (pengunduran diri).  
**Actors:** Calon anggota (publik), Pengawas, Ketua, Bendahara (untuk approval).  
**Preconditions:** Calon anggota memiliki akun; data KTP/selfie tersedia.

#### Use case: UC-02.01 — Registrasi anggota baru

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Calon anggota isi form 8-step (personal, account, KTP, selfie, employment, emergency contact, bank, summary) | Semua field wajib terisi; KTP/selfie valid (magic byte, ≤5MB) | Draft tersimpan di `localStorage.temp_reg_data` |
| 2 | Submit registrasi | Server validasi: NIK unik, email unik, KTP/selfie valid | `member_registrations` record dibuat, status PENDING |
| 3 | Approval 3-tahap (F-03) | Pengawas → Ketua → Bendahara | Status APPROVED → member record dibuat + tagihan awal (pokok + wajib×12) di-generate |
| 4 | Jika ditolak | — | Status REJECTED + alasan, calon anggota dapat daftar ulang |

**Inputs:** nama, email, password, NIK, KTP photo (file), selfie (file), pekerjaan, kontak darurat, rekening bank, alamat (provinsi/kabupaten/kecamatan/desa), tanggal lahir, jenis kelamin, status perkawinan, dll.  
**Outputs:** member record (jika approved), tagihan awal, notifikasi.  
**Errors:** `NIK_DUPLICATE` (409), `FILE_INVALID` (400), `VALIDATION_ERROR` (400).

#### Use case: UC-02.02 — Penetapan peran pengurus

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Admin (Pengawas/Ketua/Bendahara) pilih anggota + assign role | Anggota harus tipe Reguler; role harus salah satu dari 3 peran | `member_role_assignments` dibuat |
| 2 | Log aktivitas | IP, aktor, before/after tercatat | `activity_logs` entry |

**Errors:** `MEMBER_TYPE_INVALID` (400) untuk Luar Biasa, `ROLE_ASSIGNED` (409) jika sudah punya role aktif.

#### Use case: UC-02.03 — Arsip (soft-delete) & restore anggota

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Admin arsip anggota | Re-enter password (re-auth), konfirmasi | `deleted_at` di-set (paranoid), audit log |
| 2 | Restore anggota | Re-enter password, konfirmasi | `deleted_at` di-clear, audit log |
| 3 | Batch archive | Pilih multiple anggota, password | Semua di-arsip, audit log per item |

**Errors:** `PASSWORD_INVALID` (401), `MEMBER_NOT_FOUND` (404).

#### Use case: UC-02.04 — Pengajuan terminasi (pengunduran diri)

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota ajukan terminasi + alasan | Cek pending bills & aset (jika ada → tolak) | `membership_terminations` record, status PENDING |
| 2 | Approval 3-tahap | Pengawas → Ketua → Bendahara | Status APPROVED → member di-arsip, tagihan diproses |

**Errors:** `PENDING_BILLS_EXIST` (400), `ASSETS_HELD` (400).

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-02.01 | NIK harus unik (tidak boleh duplikat) | Database (unique constraint) | PRD-003 |
| BR-02.02 | KTP/selfie valid: magic byte check (JPG/PNG), max 5MB | Server (validateExcelFile / uploadPaymentProof) | PRD-003, PRD-021 |
| BR-02.03 | Hanya anggota tipe Reguler yang dapat diberi peran pengurus | Server (anggotaRoute role update) | PRD-005 |
| BR-02.04 | Soft-delete & restore memerlukan konfirmasi password | Server (re-auth check) | PRD-006 |
| BR-02.05 | Terminasi tidak dapat diproses jika ada tagihan pending atau aset dipegang | Server (termination validation) | PRD-003 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| MemberRegistration | DRAFT | Submit | PENDING | Validasi server |
| MemberRegistration | PENDING | Approval 3-tahap | APPROVED | Member record + bills dibuat |
| MemberRegistration | PENDING | Ditolak tahap manapun | REJECTED | Alasan disimpan |
| Member | ACTIVE | Archive | ARCHIVED | `deleted_at` di-set, audit log |
| Member | ARCHIVED | Restore | ACTIVE | `deleted_at` di-clear, audit log |
| Member | ACTIVE | Terminasi disetujui | TERMINATED | Tagihan diproses, arsip |

---

### F-03 — Approval Engine (Maker-Checker)

**Purpose:** Mesin approval berjenjang 3-tahap untuk semua entitas sensitif. Ini adalah modul inti yang dipakai oleh F-02, F-04..F-11.  
**Actors:** Pengawas (step 1), Ketua (step 2), Bendahara (step 3/final).  
**Preconditions:** Approval flow terkonfigurasi untuk jenis entitas; approver memiliki peran sesuai step.

#### Use case: UC-03.01 — Proses approval

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Approver pilih pending approval dari queue | Approval ada di `approvals` table, status PENDING | Step ditampilkan |
| 2 | Approver approve/reject | (a) Role cocok dengan step saat ini; (b) Approver ≠ creator; (c) Approver tidak sudah approve step lain di flow ini | Step di-update, `current_step_id` di-set ke step berikutnya |
| 3 | Jika step terakhir (Bendahara) approve | Semua step sebelumnya APPROVED | `performFinalAction` dipanggil (create bills, disburse, dll.) |
| 4 | Jika reject di step manapun | Alasan wajib diisi | Status keseluruhan REJECTED, flow dihentikan |

**Inputs:** entity_type, entity_id, decision (APPROVE/REJECT), note (optional untuk approve, required untuk reject).  
**Outputs:** approval step di-update, notifikasi real-time ke creator (`APPROVAL_UPDATE` event).  
**Errors:** `INVALID_ROLE` (403), `SELF_APPROVAL` (403), `DUPLICATE_APPROVAL` (409), `ALREADY_FINALIZED` (409).

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-03.01 | Setiap entitas sensitif harus memiliki approval flow dengan 3 step berurutan | Server (approvalFlows config) | PRD-004 |
| BR-03.02 | Step 1 = Pengawas, Step 2 = Ketua, Step 3 = Bendahara | Server (approval_steps role assignment) | PRD-004 |
| BR-03.03 | Approver tidak dapat approve step yang bukan step-nya saat ini | Server (MidRole + current_step check) | PRD-004 |
| BR-03.04 | Approver tidak dapat menyetujui pengajuan yang ia buat sendiri | Server (creator check) | PRD-004 |
| BR-03.05 | Approver yang sama tidak dapat approve lebih dari 1 step dalam flow yang sama | Database (EntityStepApproval unique index) | PRD-004 |
| BR-03.06 | State transisi menggunakan `SELECT ... FOR UPDATE` (row lock) untuk mencegah race condition | Database (transaction lock) | PRD-004 |
| BR-03.07 | Setelah APPROVED, `current_step_id` di-clear dan final action dijalankan | Server (performFinalAction) | PRD-004 |
| BR-03.08 | Setiap aksi approval dicatat di `activity_logs` (aktor, IP, waktu, entity) | Server (authLoggingService) | PRD-004, PRD-020 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| Approval | — | Entitas diajukan | PENDING | Flow dibuat, step 1 aktif |
| Approval | PENDING | Step N di-approve | PENDING (step N+1) | Role check, self-approval check, lock |
| Approval | PENDING | Step manapun di-reject | REJECTED | Flow dihentikan, alasan disimpan |
| Approval | PENDING (step 3) | Step 3 di-approve | APPROVED | `performFinalAction` dijalankan |
| Approval | APPROVED | — | — | Final: bills/disbursement/record dibuat |

---

### F-04 — Simpanan (Savings)

**Purpose:** Manajemen simpanan pokok, wajib, sukarela (setoran & pencairan) — baik di sisi anggota (ajukan/lihat saldo) maupun pengurus (approval, verifikasi, pelaporan).  
**Actors:** Anggota (setoran, pencairan), Bendahara (verifikasi & approval final).  
**Preconditions:** Anggota aktif; produk simpanan dikonfigurasi.

#### Use case: UC-04.01 — Setoran simpanan wajib (manual)

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota transfer ke rekening koperasi + upload bukti | Bukti valid (JPG/PNG/PDF, ≤5MB) | `transactions` record + `bills` status PENDING_VERIFICATION |
| 2 | Bendahara verifikasi bukti | Nominal cocok, rekening tujuan benar | Transaksi APPROVED → saldo bertambah, tagihan LUNAS |
| 3 | Jika bukti tidak valid | — | Transaksi REJECTED, anggota dapat upload ulang |

**Errors:** `FILE_INVALID` (400), `AMOUNT_MISMATCH` (400), `ALREADY_VERIFIED` (409).

#### Use case: UC-04.02 — Pencairan simpanan sukarela

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota ajukan pencairan (nominal, alasan) | Saldo mencukupi; belum ada pending withdrawal | `savings_withdrawals` record, approval flow dibuat |
| 2 | Approval 3-tahap (F-03) | — | Status APPROVED → disbursement manual (transfer), saldo berkurang |
| 3 | Bendahara upload bukti transfer disbursement | — | Transaksi selesai, laporan ter-update |

**Errors:** `INSUFFICIENT_BALANCE` (400), `PENDING_WITHDRAWAL_EXISTS` (409).

#### Use case: UC-04.03 — Konfigurasi nominal simpanan & akad

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Bendahara set nominal simpanan per produk + tanggal efektif | Nominal > 0, tanggal valid | `feature_configs` di-update |
| 2 | Assign akad (Wadiah/Mudharabah/dll) per produk simpanan | Akad valid dari list | `feature_configs` di-update |
| 3 | Tagihan baru setelah tanggal efektif menggunakan nominal baru | — | Nominal lama tetap berlaku untuk tagihan sebelumnya |

**Errors:** `INVALID_NOMINAL` (400), `PAST_EFFECTIVE_DATE` (400).

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-04.01 | Pencairan simpanan memerlukan approval 3-tahap | Server (approval engine F-03) | PRD-007 |
| BR-04.02 | Saldo tidak boleh negatif | Server (balance check sebelum withdraw) | PRD-007 |
| BR-04.03 | Konfigurasi nominal simpanan hanya berlaku untuk tagihan pada/after tanggal efektif | Server (date comparison saat generate bills) | PRD-025 |
| BR-04.04 | Bukti transfer divalidasi magic byte & ukuran maks 5MB | Server (uploadPaymentProof middleware) | PRD-008, PRD-021 |
| BR-04.05 | Setiap transaksi simpanan dicatat di `savings_transactions` dengan tipe (SETORAN/PENCAIRAN) | Database | PRD-007 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| Bill (Simpanan) | PENDING | Pembayaran diajukan + bukti | PENDING_VERIFICATION | Bukti di-upload |
| Bill (Simpanan) | PENDING_VERIFICATION | Bendahara verifikasi | LUNAS | Saldo bertambah |
| Bill (Simpanan) | PENDING_VERIFICATION | Bukti ditolak | PENDING | Anggota dapat upload ulang |
| Bill (Simpanan) | PENDING | Jatuh tempo terlewat | OVERDUE | Notifikasi otomatis |
| Withdrawal | PENDING | Approval 3-tahap | APPROVED | Disbursement diproses |
| Withdrawal | PENDING | Ditolak | REJECTED | Alasan disimpan |

---

### F-05 — Billing & Manual Payments

**Purpose:** Manajemen tagihan (bills), pembayaran manual via transfer + verifikasi bendahara, konfigurasi biaya admin, rekening koperasi.  
**Actors:** Anggota (lihat/ bayar), Bendahara (verifikasi).  
**Preconditions:** Tagihan di-generate dari registrasi/pembiayaan/langganan.

#### Use case: UC-05.01 — Lihat & bayar tagihan

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota buka halaman billing | — | Daftar tagihan pending + history + ringkasan |
| 2 | Anggota pilih tagihan, transfer ke rekening koperasi, upload bukti | Bukti valid | `transactions` record + status PENDING_VERIFICATION |
| 3 | Bendahara verifikasi | Nominal cocok | Status LUNAS |

**Errors:** `BILL_NOT_FOUND` (404), `FILE_INVALID` (400).

#### Use case: UC-05.02 — Tagihan sukarela

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Bendahara buat tagihan sukarela (nominal, deskripsi, jatuh tempo) | Nominal > 0 | `bills` record dibuat |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-05.01 | Pembayaran via transfer manual ke rekening koperasi (Midtrans/DOKU dihapus) | Server (no gateway) | PRD-008, DEC-005 |
| BR-05.02 | Setiap pembayaran memerlukan bukti transfer yang diverifikasi bendahara | Server (uploadPaymentProof) | PRD-008 |
| BR-05.03 | Biaya admin per metode pembayaran (FLAT / PERCENTAGE / keduanya) | Server (billingHelper) | PRD-009 |
| BR-05.04 | Tagihan yang jatuh tempo tanpa pembayaran → status OVERDUE | Server (cron check) | PRD-007, PRD-008 |
| BR-05.05 | Verifikasi pembayaran hanya dapat dilakukan oleh Bendahara | Server (MidRole bendahara) | PRD-008 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| Bill | — | Dibuat (registrasi/pembiayaan) | PENDING | Tanggal jatuh tempo di-set |
| Bill | PENDING | Pembayaran + bukti upload | PENDING_VERIFICATION | Transaction record dibuat |
| Bill | PENDING_VERIFICATION | Bendahara verifikasi | LUNAS | Saldo/ledger ter-update |
| Bill | PENDING_VERIFICATION | Bukti ditolak | PENDING | Anggota upload ulang |
| Bill | PENDING | Jatuh tempo terlewat | OVERDUE | Notifikasi + escalation |

---

### F-06 — Pembiayaan Jual Beli (Murabahah)

**Purpose:** Pembiayaan jual beli (murabahah) — anggota mengajukan, approval 3-tahap, DP + angsuran dihitung.  
**Actors:** Anggota (ajukan), Pengawas/Ketua/Bendahara (approval).  
**Preconditions:** Anggota aktif; produk jual beli dikonfigurasi.

#### Use case: UC-06.01 — Pengajuan jual beli

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota isi form pengajuan (jumlah, tenor, DP, barang) | Jumlah > 0, tenor valid | `jual_beli` record, status PENDING |
| 2 | Approval 3-tahap (F-03) | — | Status APPROVED → DP bill + jadwal angsuran di-generate |
| 3 | Anggota bayar DP + angsuran | Transfer + bukti, verifikasi bendahara | Status berubah, piutang ter-update |

**Errors:** `INVALID_AMOUNT` (400), `INVALID_TENOR` (400).

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-06.01 | DP dan angsuran dihitung menggunakan decimal.js (bukan float) | Server (billingHelper + decimal.js) | PRD-010 |
| BR-06.02 | Laba (margin) dihitung: harga jual - harga pokok | Server (decimal.js) | PRD-010 |
| BR-06.03 | Setiap pengajuan memerlukan approval 3-tahap | Server (F-03) | PRD-004, PRD-010 |
| BR-06.04 | Setiap pembayaran angsuran diverifikasi bendahara | Server (billing) | PRD-008, PRD-010 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| JualBeli | PENDING | Approval 3-tahap | APPROVED | DP bill + jadwal dibuat |
| JualBeli | PENDING | Ditolak | REJECTED | Alasan disimpan |
| JualBeli | APPROVED | DP dibayar | DP_LUNAS | Angsuran dimulai |
| JualBeli | APPROVED | Semua angsuran lunas | LUNAS | Piutang di-nol-kan |

---

### F-07 — Program Pinjaman Lunak

**Purpose:** Pinjaman lunak (koperasi meminjamkan modal ke anggota, angsuran lunak) + input modal koperasi (debet/kredit).  
**Actors:** Anggota (ajukan), Pengawas/Ketua/Bendahara (approval), Bendahara (input modal).  
**Preconditions:** Anggota aktif; produk pinjaman dikonfigurasi.

#### Use case: UC-07.01 — Pengajuan pinjaman lunak

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota isi form (jumlah, tenor, tujuan) | Jumlah > 0, tenor valid | `member_loans` record, PENDING |
| 2 | Approval 3-tahap | — | APPROVED → pencairan + jadwal angsuran dibuat |
| 3 | Angsuran dibayar | Transfer + bukti | Status ter-update, piutang berkurang |

#### Use case: UC-07.02 — Input modal koperasi (debet/kredit)

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Bendahara input modal (debet/kredit, deskripsi) | Nominal > 0 | `pinjaman_modal` record dibuat, ledger ter-update |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-07.01 | Piutang = total pinjaman - total angsuran dibayar | Server (decimal.js) | PRD-011 |
| BR-07.02 | Input modal tercatat di `pinjaman_modal` dengan tipe DEBET/KREDIT | Database | PRD-011 |
| BR-07.03 | Setiap pengajuan memerlukan approval 3-tahap | Server (F-03) | PRD-004 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| MemberLoan | PENDING | Approval 3-tahap | APPROVED | Pencairan + jadwal |
| MemberLoan | PENDING | Ditolak | REJECTED | Alasan |
| MemberLoan | APPROVED | Semua angsuran lunas | LUNAS | Piutang di-nol-kan |

---

### F-08 — Program Arisan

**Purpose:** Arisan berbasis batch — koperasi membentuk batch arisan, anggota bergabung, kocokan/draw bulanan, pencairan.  
**Actors:** Bendahara (kelola batch, draw), Anggota (gabung).  
**Preconditions:** Batch dibuat dan status ACTIVE; anggota aktif.

#### Use case: UC-08.01 — Buat batch arisan

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Bendahara buat batch (kuota, target, angsuran bulanan, tenor, periode) | Kuota > 0, tenor > 0 | `arisan_batches` record dibuat, status DRAFT |
| 2 | Aktivasi batch | — | Status ACTIVE, anggota dapat bergabung |

#### Use case: UC-08.02 — Kocokan/draw bulanan

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Bendahara jalankan draw | Semua angsuran bulan ini lunas; draw menggunakan RNG kriptografis (secure random) | `arisan_draws` record, pemenang ditentukan via RNG kriptografis |
| 2 | Bendahara proses pencairan ke pemenang | Pemenang belum pernah menang sebelumnya (jika aturan "no-repeat") | Transfer + bukti upload |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-08.01 | Draw hanya dapat dijalankan jika semua angsuran bulan berjalan lunas | Server (validation sebelum draw) | PRD-012 |
| BR-08.02 | Pemenang ditandai cair dengan bukti transfer | Server (arisan_draws + bukti) | PRD-012 |
| BR-08.03 | Setiap anggota hanya boleh menang sekali (jika aturan no-repeat aktif) | Server (check arisan_draws history) | PRD-012 |
| BR-08.04 | Draw harus menggunakan RNG kriptografis (secure random), bukan Math.random | Server (crypto.randomBytes) | PRD-012 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| ArisanBatch | DRAFT | Aktivasi | ACTIVE | Anggota dapat gabung |
| ArisanBatch | ACTIVE | Kuota penuh | FULL | Tidak ada anggota baru |
| ArisanBatch | ACTIVE | Draw selesai | COMPLETED | Semua pemenang ditentukan |
| ArisanParticipant | JOINED | Draw menang | WON | Pencairan diproses |

---

### F-09 — Tabungan Bertarget (Mudharabah)

**Purpose:** Tabungan dengan target (mis. pendidikan, haji, usaha) — anggota menabung secara berkala, progress vs target, penarikan via approval.  
**Actors:** Anggota (setoran, tarik), Pengawas/Ketua/Bendahara (approval).  
**Preconditions:** Program tabungan dikonfigurasi (target, kategori, tahun).

#### Use case: UC-09.01 — Setoran tabungan

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota setoran (transfer + bukti) | Bukti valid | Transaksi PENDING_VERIFICATION |
| 2 | Bendahara verifikasi | — | Saldo bertambah, progress vs target update |

#### Use case: UC-09.02 — Penarikan tabungan

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota ajukan penarikan | Saldo mencukupi | `savings_withdrawals` (tipe TABUNGAN), approval flow |
| 2 | Approval 3-tahap | — | Disbursement, saldo berkurang |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-09.01 | Progress vs target dihitung dari total setoran - total penarikan | Server (decimal.js) | PRD-013 |
| BR-09.02 | Penarikan memerlukan approval 3-tahap | Server (F-03) | PRD-004, PRD-013 |
| BR-09.03 | Master program tabungan: CRUD targets (nama, target nominal, kategori, tahun) | Server | PRD-013 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| TabunganAccount | ACTIVE | Setoran diverifikasi | ACTIVE | Saldo bertambah |
| TabunganAccount | ACTIVE | Penarikan disetujui | ACTIVE | Saldo berkurang |
| TabunganAccount | ACTIVE | Target tercapai | TARGET_ACHIEVED | Notifikasi |

---

### F-10 — Investasi Halal (Sukuk)

**Purpose:** Katalog sukuk, issue, order/investasi, portfolio — anggota berinvestasi di sukuk yang diterbitkan koperasi.  
**Actors:** Anggota (investasi), Pengawas/Ketua/Bendahara (approval).  
**Preconditions:** Sukuk issue tersedia dan status OPEN.

#### Use case: UC-10.01 — Investasi sukuk

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota pilih sukuk, masukkan jumlah investasi | Jumlah > 0, tidak melebihi sisa kuota | `sukuk_orders` record, approval flow |
| 2 | Approval 3-tahap | — | APPROVED → order dikonfirmasi, jadwal jatuh tempo dibuat |
| 3 | Dana dicairkan dari/ke rekening koperasi | — | Portfolio ter-update |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-10.01 | Total order tidak boleh melebihi kuota issue | Server (quota check) | PRD-014 |
| BR-10.02 | Setiap investasi memerlukan approval 3-tahap | Server (F-03) | PRD-004 |
| BR-10.03 | Jadwal jatuh tempo & return dihitung per issue | Server (sukuk_issues config) | PRD-014 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| SukukIssue | OPEN | Kuota penuh | CLOSED | Tidak ada order baru |
| SukukOrder | PENDING | Approval 3-tahap | CONFIRMED | Dana dialokasikan |
| SukukOrder | PENDING | Ditolak | REJECTED | Alasan |

---

### F-11 — Pendanaan Syariah

**Purpose:** Pembiayaan syariah berbasis akad (mudharabah/musyarakah) dengan approval 3-tahap dan pelaporan jurnal/neraca.  
**Actors:** Anggota (ajukan), Pengawas/Ketua/Bendahara (approval).  
**Preconditions:** Anggota aktif; profil usaha tersedia.

#### Use case: UC-11.01 — Pengajuan pendanaan syariah

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota isi form (jumlah, akad, tenor, profil usaha) | Jumlah > 0, akad valid | `financing_applications` record, PENDING |
| 2 | Approval 3-tahap | — | APPROVED → pencairan + jadwal dibuat |
| 3 | Angsuran/setoran dibayar | Transfer + bukti | Status ter-update, jurnal tercatat |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-11.01 | Setiap pendanaan menggunakan akad syariah yang valid (Mudharabah/Musyarakah/dll) | Server (financing_categories) | PRD-015 |
| BR-11.02 | Setiap transaksi dicatat di jurnal (debit/kredit) menggunakan decimal.js | Server (ledgerHelper) | PRD-001, PRD-015 |
| BR-11.03 | Laporan Neraca: saldo akhir per akun dihitung dari jurnal | Server (ledgerHelper) | PRD-015, DEC-001 |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| FinancingApplication | PENDING | Approval 3-tahap | APPROVED | Pencairan + jadwal |
| FinancingApplication | PENDING | Ditolak | REJECTED | Alasan |
| FinancingApplication | APPROVED | Semua angsuran lunas | LUNAS | Piutang nol |

---

### F-12 — Training & Evaluasi

**Purpose:** E-learning untuk anggota — kurikulum, materi (teks/video/dokumen), catatan, evaluasi/kuis, ranking.  
**Actors:** Anggota (belajar, kuis), Pengawas/Ketua/Bendahara (kelola kurikulum & materi).  
**Preconditions:** Kurikulum & materi dipublikasikan.

#### Use case: UC-12.01 — Ikuti pelatihan

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Anggota buka kurikulum | — | Daftar materi berurutan |
| 2 | Anggota baca/tonton materi | — | Catatan (`material_notes`) dapat disimpan |
| 3 | Anggota kerjakan kuis/evaluasi | Jawaban di-check vs answer key | Nilai tersimpan, ranking ter-update |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-12.01 | Materi dapat berupa teks, video URL, atau dokumen (file) | Server (materials table) | PRD-016 |
| BR-12.02 | Kuis multiple-choice dengan answer key & poin per soal | Server (evaluations) | PRD-016 |
| BR-12.03 | Ranking diurutkan berdasarkan total nilai tertinggi | Server (rankings table) | PRD-016 |
| BR-12.04 | Materi HTML di-sanitize dengan DOMPurify sebelum render | Client (DOMPurify) | PRD-016, PRD-022 |

---

### F-13 — Notifications & Real-time

**Purpose:** Notifikasi real-time (Socket.IO) + web push untuk update approval, registrasi, transaksi, dan pengumuman.  
**Actors:** Semua pengguna.  
**Preconditions:** Pengguna online (socket) atau push subscription aktif.

#### Use case: UC-13.01 — Terima notifikasi real-time

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Server kirim event (APPROVAL_UPDATE, REGISTRATION_UPDATED, TRANSACTION_UPDATED, notifications:update) | JWT-authenticated socket connection | Notifikasi muncul di bell icon |
| 2 | User klik notifikasi | — | Redirect ke halaman terkait |
| 3 | User mark as read | — | Unread count berkurang |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-13.01 | Socket connection harus JWT-authenticated | Server (utils/socket.js) | PRD-017 |
| BR-13.02 | Event broadcast hanya ke user terkait (user socket sets) | Server (socket rooms) | PRD-017 |
| BR-13.03 | Web push via VAPID (subscribe/test) | Server (pushRoutes) + Client | PRD-017 |
| BR-13.04 | Notifikasi persistence di `notifications` table | Database | PRD-017 |

---

### F-14 — Dashboard & Reports

**Purpose:** Dashboard dengan statistik dan antrean approval per kategori; laporan per-modul (list + jurnal + neraca).  
**Actors:** Pengurus (dashboard admin), Anggota (dashboard anggota).  
**Preconditions:** Data transaksi tersedia.

#### Use case: UC-14.01 — Dashboard pengurus

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Pengurus buka dashboard | — | 6 kartu statistik (anggota, simpanan, jual beli, program, tabungan, investasi) |
| 2 | Pilih kategori approval queue | — | Daftar pending approvals untuk kategori terpilih |
| 3 | Klik item → approval modal | Role match | Modal approval terbuka |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-14.01 | Statistik dihitung real-time dari database | Server (dashboardRoute) | PRD-018 |
| BR-14.02 | Approval queue dikelompokkan per kategori (keanggotaan, simpanan, jual beli, program, tabungan, investasi) | Server | PRD-018 |
| BR-14.03 | Anggota hanya melihat dashboard personal (tidak ada approval queue) | Client + Server | PRD-018 |
| BR-14.04 | Laporan per-modul: list, jurnal (debit/kredit), dan neraca (per account) | Server (report services) | PRD-018, DEC-001 |

---

### F-15 — Excel Import/Export

**Purpose:** Import data dari Excel (anggota, transaksi, dll.) dan ekspor laporan ke Excel.  
**Actors:** Pengurus.  
**Preconditions:** File valid (XLSX, ≤5MB, template tersedia).

#### Use case: UC-15.01 — Import Excel

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | User download template | — | Template XLSX diunduh |
| 2 | User isi data, upload file | Magic byte check (XLSX), ukuran ≤5MB, format sesuai template | Data divalidasi |
| 3 | Preview & konfirmasi | — | Data di-import ke DB, audit log tercatat |

#### Use case: UC-15.02 — Export Excel

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | User pilih filter (tanggal, kategori, dll.) | — | Data di-fetch |
| 2 | Generate Excel | exceljs | File diunduh |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-15.01 | File import divalidasi magic byte (bukan hanya ekstensi) | Server (validateExcelFile middleware) | PRD-019, PRD-021 |
| BR-15.02 | Ukuran file maksimal 5MB | Server (multer config) | PRD-019 |
| BR-15.03 | Template import tersedia untuk download per modul | Client + Server | PRD-019 |
| BR-15.04 | Import activity dicatat di `activity_logs` | Server (authLoggingService) | PRD-019, PRD-020 |

---

### F-16 — Audit, Security & Privacy

**Purpose:** Audit log, masking data sensitif, proteksi dokumen identitas, rate limiting.  
**Actors:** Server-side enforced, admin dapat lihat audit log.  
**Preconditions:** Aksi sensitif dilakukan.

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-16.01 | Setiap aksi sensitif (approval, role change, delete, import) dicatat di `activity_logs` dengan aktor, IP, timestamp | Server (authLoggingService) | PRD-020 |
| BR-16.02 | NIK/HP/email di-mask di UI berdasarkan peran pengguna | Client (ProtectedImage, ProtectedFileLink) | PRD-022 |
| BR-16.03 | Dokumen identitas hanya dapat diunduh via `/api/files/*` dengan otorisasi + path traversal guard | Server (file download middleware) | PRD-021 |
| BR-16.04 | Rate limiting aktif di semua endpoint (login, OTP, API, password-reset) | Server (rateLimiter middleware) | PRD-001 |
| BR-16.05 | Upload file divalidasi magic byte (bukan hanya ekstensi) | Server (validateExcelFile / uploadPaymentProof) | PRD-021 |
| BR-16.06 | Output HTML di-sanitize dengan DOMPurify sebelum render | Client (DOMPurify) | PRD-022 |
| BR-16.07 | Role check enforced server-side, bukan hanya client-side | Server (MidRole middleware) | PRD-001, PRD-004 |

---

### F-17 — Landing & Content

**Purpose:** Landing page publik — layanan, statistik, tentang, kontak, artikel.  
**Actors:** Guest (publik), Pengurus (kelola konten).  
**Preconditions:** Konten dipublikasikan di DB.

#### Use case: UC-17.01 — Lihat landing page

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | Guest buka landing | — | Services, stats, about, contact ditampilkan |
| 2 | Guest isi form kontak | Validasi field | `contact_forms` record dibuat |

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-17.01 | Landing stats (jumlah anggota, total simpanan, dll.) dihitung dari DB | Server (landingRoute) | PRD-023 |
| BR-17.02 | Artikel hanya yang status PUBLISHED ditampilkan ke publik | Server (contentRoute) | PRD-023 |
| BR-17.03 | Form kontak divalidasi (email format, field wajib) | Server | PRD-023 |

---

### F-18 — Konfigurasi

**Purpose:** Konfigurasi sistem — akad, nominal simpanan, biaya admin.  
**Actors:** Bendahara (dan pengurus lain sesuai matriks).  
**Preconditions:** Pengguna memiliki hak konfigurasi.

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-18.01 | Akad per produk simpanan (Wadiah, Mudharabah, Musyarakah, Murabahah, Qardh, Wakalah) | Server (feature_configs) | PRD-024 |
| BR-18.02 | Nominal simpanan dengan tanggal efektif — hanya berlaku untuk tagihan pada/after tanggal | Server (date comparison) | PRD-025 |
| BR-18.03 | Biaya admin per metode pembayaran (FLAT / PERCENTAGE / keduanya) | Server (payment_fee_configs) | PRD-009 |

---

### F-19 — Cron & Backup

**Purpose:** Backup DB bulanan, purge dokumen identitas kedaluwarsa, sinkronisasi laporan.  
**Actors:** Server (cron).  
**Preconditions:** Cron aktif di server.

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-19.01 | Backup DB setiap tanggal 1 pukul 00:00 | Server (services/cron.js) | PRD-026 |
| BR-19.02 | Purge dokumen identitas kedaluwarsa setiap hari pukul 02:00 (jika `RETENTION_AUTOPURGE=true`) | Server (services/cron.js) | PRD-026, DEC-002 |
| BR-19.03 | Sinkronisasi laporan (savings, jualbeli, financial summary) berjalan periodik | Server (sync services) | PRD-018, PRD-026 |

---

## 3. Cross-cutting behaviour

- **Authorization:** 
  - Server-side enforcement via `MidAnggota` (JWT verification) + `MidRole` (role-based access control).
  - 3 peran pengurus (Pengawas/Ketua/Bendahara) memiliki hierarki approval; hanya 3 ini yang dapat approve entitas sensitif.
  - Anggota biasa hanya dapat mengakses data & transaksi milik sendiri (scoped queries).
  - File/dokumen sensitif diakses via `/api/files/*` dengan otorisasi + path traversal guard.
  - Client-side role check hanyalah UX (menyembunyikan menu); otoritas sebenarnya di server.

- **Auditability:** 
  - `activity_logs` mencatat setiap aksi sensitif: approval (approve/reject), role change, delete/restore, import.
  - Fields: `id`, `user_id`, `action`, `entity_type`, `entity_id`, `old_value` (JSON), `new_value` (JSON), `ip_address`, `user_agent`, `created_at`.
  - Append-only policy (belum ada DB constraint, tapi secara aplikasi tidak ada update/delete).
  - Untuk perubahan role: before/after role assignment tercatat.

- **Notifications:** 
  - Real-time via Socket.IO: `APPROVAL_UPDATE`, `REGISTRATION_UPDATED`, `TRANSACTION_UPDATED`, `notifications:update`, `profile:update`, `withdrawals:update`.
  - Web push via VAPID (subscription + test endpoint).
  - Notifikasi persisted di `notifications` table (read/unread).
  - Kegagalan notifikasi tidak memblokir transaksi utama (best-effort).

- **Offline / async behaviour:** 
  - PWA dengan service worker (`sw.js`) — app shell cacheable, data transaksi memerlukan koneksi.
  - Draft registrasi disimpan di `localStorage` (temp_reg_data) — user dapat lanjut tanpa koneksi.
  - File upload memerlukan koneksi; timeout & retry di handle di client.

## 4. Traceability

| Functional item | PRD item | API / data / UI reference | Test reference |
| --- | --- | --- | --- |
| UC-01.01 Login, UC-01.02 Logout | PRD-001 | `/api/auth` (authRoute), `accounts`, `login_attempts`, `account_lockouts` | TEST-001 |
| UC-01.03 Forgot Password | PRD-002 | `/api/auth/forgot-password`, `passwordResetToken` | TEST-002 |
| UC-02.01 Registrasi | PRD-003 | `/api/anggota` (registration), `member_registrations` | TEST-003 |
| UC-02.02 Assign Role | PRD-005 | `/api/anggota/:id/role`, `member_role_assignments` | TEST-005 |
| UC-02.03 Archive/Restore | PRD-006 | `/api/anggota/:id/archive`, `batch-archive`, `restore` | TEST-006 |
| UC-02.04 Terminasi | PRD-003 | `/api/anggota/termination`, `membership_terminations` | TEST-004 |
| UC-03.01 Approval Engine | PRD-004 | `/api/approvals`, `approvals`, `approval_steps`, `EntityStepApproval` | TEST-007 |
| UC-04.01 Setoran Simpanan | PRD-007 | `/api/simpanan`, `/api/savings`, `savings_transactions` | TEST-008 |
| UC-04.02 Pencairan Simpanan | PRD-007 | `/api/simpanan/withdrawals`, `savings_withdrawals` | TEST-009 |
| UC-04.03 Konfigurasi Simpanan | PRD-024, PRD-025 | `/api/simpanan/config`, `feature_configs` | TEST-010 |
| UC-05.01 Billing | PRD-008 | `/api/billing`, `bills`, `bill_items`, `transactions` | TEST-011 |
| UC-05.02 Tagihan Sukarela | PRD-008 | `/api/billing/voluntary`, `bills` | TEST-012 |
| UC-06.01 Jual Beli | PRD-010 | `/api/jualbeli`, `jual_beli` | TEST-013 |
| UC-07.01 Pinjaman Lunak | PRD-011 | `/api/program`, `member_loans`, `pinjaman_modal` | TEST-014 |
| UC-07.02 Input Modal | PRD-011 | `/api/program`, `pinjaman_modal`, `pinjaman_hutang`, `pinjaman_aktiva_tetap` | TEST-015 |
| UC-08.01 Batch Arisan | PRD-012 | `/api/program/arisan`, `arisan_batches` | TEST-016 |
| UC-08.02 Draw Arisan | PRD-012 | `/api/program/arisan/draw`, `arisan_draws` | TEST-017 |
| UC-09.01 Setoran Tabungan | PRD-013 | `/api/tabungan`, `savings_transactions` (tipe TABUNGAN) | TEST-018 |
| UC-09.02 Penarikan Tabungan | PRD-013, PRD-004 | `/api/tabungan`, `savings_withdrawals` | TEST-019 |
| UC-10.01 Investasi Sukuk | PRD-014 | `/api/financing/sukuk`, `sukuk_issues`, `sukuk_orders` | TEST-020 |
| UC-11.01 Pendanaan Syariah | PRD-015 | `/api/financing`, `financing_applications` | TEST-021 |
| UC-12.01 Training | PRD-016 | `/api/training`, `curriculums`, `materials`, `evaluations`, `rankings` | TEST-022 |
| UC-13.01 Notifikasi Real-time | PRD-017 | `/api/notifikasi`, `/api/push`, Socket.IO events | TEST-023 |
| UC-14.01 Dashboard | PRD-018 | `/api/dashboard`, `/api/financial/reports`, `/api/savings/reports` | TEST-024 |
| UC-15.01 Import Excel | PRD-019 | `/api/*/import`, `/api/*/export`, multer + exceljs | TEST-025 |
| UC-15.02 Export Excel | PRD-019 | `/api/*/export` | TEST-026 |
| F-16 Audit & Security | PRD-020, PRD-021, PRD-022 | `activity_logs`, `/api/files/*`, `middleware/` | TEST-027 |
| UC-17.01 Landing | PRD-023 | `/api/landing`, `/api/content` | TEST-028 |
| F-18 Konfigurasi | PRD-024, PRD-025, PRD-009 | `/api/simpanan/config`, `payment_fee_configs` | TEST-029 |
| F-19 Cron & Backup | PRD-026 | `services/cron.js`, sync services | TEST-030 |
| BR-03.04 Self-approval prevention | PRD-004 | `processApproval.js` (creator check) | TEST-007a |
| BR-03.05 Duplicate approval prevention | PRD-004 | `EntityStepApproval` unique index | TEST-007b |
| BR-03.06 Row lock | PRD-004 | `SELECT ... FOR UPDATE` | TEST-007c |