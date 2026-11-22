# Test Plan

**Project:** KKPUS Platform  
**Version:** 1.0.0  
**QA owner:** Development Team  
**Last reviewed:** 2026-11-22

## 1. Quality goals and scope

- **Quality risks:**
  - **R-01 (Kritis):** Approval engine 3-step — salah role/step dapat menyetujui pengajuan (alur uang). Risiko: kehilangan dana / pengajuan tidak sah.
  - **R-02 (Kritis):** Perhitungan finansial (angsuran, margin murabahah, bonus arisan) — salah hitung = kerugian anggota/koperasi.
  - **R-03 (Tinggi):** File upload (bukti transfer, KTP) — bypass validasi (magic byte, ukuran) atau akses dokumen tanpa otorisasi.
  - **R-04 (Tinggi):** Masking PII per peran — kebocoran NIK/HP/email ke peran yang tidak berhak.
  - **R-05 (Sedang):** Real-time (Socket.IO) — notifikasi approval/pembayaran tidak sampai atau dobel.
  - **R-06 (Sedang):** Concurrency pada approval & arisan draw — dua aktor mengeksekusi step yang sama bersamaan.
- **In scope:** API `api.kkpus.id` (50 endpoint, M-AUTH..M-FILES), Admin Portal (`admin.kkpus.id`), Public Website (`kkpusid`) termasuk PWA, Socket.IO event, cron jobs (backup, purge), import/export Excel.
- **Out of scope:** Beban produksi penuh (>1000 concurrent socket), uji penetrasi eksternal (vendor), browser < 2 versi terakhir, integrasi pihak ketiga di luar VAPID push (diuji manual).
- **Entry criteria:**
  - Seluruh dokumen spesifikasi (PRD, FSD, TSD, ERD, API Spec, UI/UX Spec) approved.
  - Staging environment siap: API + MySQL + Socket.IO, kedua frontend ter-deploy.
  - Test data sintetis tersedia (lihat §2).
  - Baseline CI hijau: `npm run lint` dan `npm run build` lulus di kedua frontend serta API.
- **Exit criteria:**
  - **P0 tests: 100% pass** (semua alur uang, approval, auth wajib lulus).
  - P1 tests ≥ 95% pass; P2 ≥ 90%.
  - **0 defect Sev1/Sev2 terbuka** (definisi di §6).
  - Coverage baris kode baru ≥ 70% (Jest `--coverage` / Vitest `--coverage`).
  - Security scan: 0 high/critical CVE (`npm audit`), 0 secret (`gitleaks`).
  - Semua known issues punya owner, severity, dan disposisi rilis.

## 2. Environments and test data

| Environment | Purpose | Build / configuration | Test data | Owner |
| --- | --- | --- | --- | --- |
| Local (`localhost`) | Dev unit & integration | API `:3445`, MySQL lokal, frontend `npm run dev` | Seed dev: 2 anggota, 1 pengurus per role, 1 batch arisan | Setiap developer |
| Staging | Integration, E2E, UAT | Deploy otomatis via GitHub Actions on merge to `main`; production-like config (Helmet, rate limit aktif) | **Data sintetis wajib** — tidak boleh PII asli (KTP/swafoto dummy, NIK 16 digit palsu, email `@example.test`); reset seed sebelum siklus test | Dev Team |
| Production | Smoke test pasca-rilis | Tagged release + manual approval | Read-only checks + 1 transaksi kecil nyata (disetujui Product) | Product/Tech |

**Test data policy (ISO/IEC 27001:2022 A.8.10/A.8.11):**

- Seluruh data uji sintetis. NIK, foto KTP/swafoto, nomor rekening, dan kontak palsu yang tidak dapat dikaitkan ke orang nyata.
- Data produksi **tidak boleh** disalin ke staging tanpa anonimisasi.
- Akun uji: `pengawas.test@`, `ketua.test@`, `bendahara.test@`, `anggota.test@` (role 5), `anggota-alb.test@` (role 6), `calon.test@` (role 1) — password standar dari secret manager staging.

## 3. Test strategy

| Layer | Purpose | Tool / method | Required for |
| --- | --- | --- | --- |
| Unit | Logika bisnis: approval state machine, perhitungan finansial (angsuran, margin, bonus), validasi form, helper token | Jest 29 (backend) / Vitest 4 (frontend) | M-APPROVAL, M-BILLING, M-FINANCING, M-SAVINGS, M-ARISAN, M-TABUNGAN, helpers auth |
| Integration | Kontrak API vs `06_API_SPEC.md`: status code, envelope error, auth guard per role, pagination | Supertest 7 (backend) / Vitest + React Testing Library 16 (komponen & screen) | Seluruh 50 endpoint (API-001..API-050); SCR-001..SCR-024 |
| End-to-end | Journey kritis: login → registrasi → approval → bayar → withdraw | Playwright (admin) + Supertest API journey (public) | P0: auth, registrasi, approval 3-step, manual payment, penarikan simpanan, arisan draw |
| Security | Otorisasi per role/step, masking PII, validasi upload (magic byte, 5MB), rate limit, path traversal, header (Helmet), secret & SCA scan | Manual checklist + `gitleaks` + `npm audit --audit-level=high` + uji injeksi sederhana (SQLi/XSS input) | API-001..005 (auth), API-050 (files), API-015 (approval), semua write-endpoint sensitif |
| Performance | SLO API p95 < 300ms (read) / < 500ms (write); LCP < 2.5s; bundle admin < 500KB gzip; 1000+ concurrent socket | Manual load test (k6/autocannon pada staging) + Lighthouse CI | API read/write, dashboard admin, landing page, Socket.IO broadcast |
| Accessibility | Keyboard penuh, focus-visible, kontras ≥4.5:1, screen reader label | Manual (keyboard-only walkthrough) + axe DevTools | SCR-001..SCR-024, khususnya form registrasi & modal approval |

## 4. Test cases

> Prioritas: **P0** = blocker rilis (alur uang, auth, approval), **P1** = mayor (core fitur), **P2** = minor (fitur pendukung).

| ID | Requirement / rule | Preconditions | Steps | Expected result | Type | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| TEST-001 | PRD-001/002 — login & session (API-001/002) | Akun aktif | Login valid → cek response; logout → akses endpoint protected | 200 + JWT + cookie `auth_token`; setelah logout endpoint protected → 401 UNAUTHORIZED | Integration | P0 |
| TEST-002 | PRD-001/002 — lupa password OTP (API-003..005) | Email/HP terdaftar | Request OTP → verify → reset password → login password baru | OTP 6 digit valid; salah 3x → OTP_INVALID; kedaluwarsa → 410 GONE; reset berhasil | E2E | P1 |
| TEST-003 | PRD-003 — registrasi anggota (API-006) | Calon anggota | Submit 8-step form lengkap | 201; `member_registrations` PENDING + chain approval 3-tahap dibuat; NIK/email duplikat → 409 CONFLICT | E2E | P0 |
| TEST-004 | PRD-001/002 — lockout & rate limit (API-001/003) | Akun aktif | 5x login gagal berturut-turut; spam OTP | Login gagal ke-5 → 423 ACCOUNT_LOCKED (15 menit); OTP >3/menit → 429 RATE_LIMITED | Security | P0 |
| TEST-005 | PRD-005/006 — assign role (API-009) | Anggota Reguler, login Pengurus | Assign role via endpoint & UI | 200 + `member_role_assignments` + audit log; ALB → MEMBER_TYPE_INVALID; role sudah ada → ROLE_ASSIGNED 409; non-pengurus → 403 | Integration | P1 |
| TEST-006 | PRD-005/006 — arsip & restore (API-010/011) | Anggota aktif | Arsip (re-auth password) → cek list → restore | Arsip butuh password benar; anggota hilang dari list aktif; restore butuh re-auth; audit log tercatat | E2E | P1 |
| TEST-007 | PRD-004 — approval 3-step (API-013..015) | Pengajuan pending step 1 | Pengawas approve → Ketua approve → Bendahara approve | Step berurutan wajib; role salah step → INVALID_ROLE 403; approve diri sendiri → SELF_APPROVAL 403; dobel → DUPLICATE_APPROVAL 409; reject tanpa alasan ditolak | E2E | P0 |
| TEST-008 | PRD-007 — data & laporan simpanan admin (API-016/017) | Data simpanan seed | Buka dashboard & laporan (list/jurnal) | Total kartu = sum DB; mutasi per produk benar; filter periode akurat | Integration | P1 |
| TEST-009 | PRD-007 — penarikan simpanan (API-018) | Saldo cukup | Ajukan penarikan → approve 3-step → cek saldo | Nominal > saldo → INSUFFICIENT_BALANCE; pending ganda → PENDING_WITHDRAWAL_EXISTS; setelah approve saldo berkurang tepat | E2E | P0 |
| TEST-010 | PRD-005 — termination (API-012) | Anggota aktif | Ajukan berhenti → cek status & redirect | Status `active_termination`; user dipaksa ke `termination_progress`; riwayat & saldo tetap dapat diakses | E2E | P1 |
| TEST-011 | PRD-008 — billing manual payment (API-021..023) | Tagihan pending | Upload bukti transfer → Bendahara verify → cek status | Bukti tersimpan; PENDING_VERIFICATION → LUNAS setelah verify; nominal bukti ≠ tagihan → ditolak dengan catatan | E2E | P0 |
| TEST-012 | PRD-021/022 — keamanan upload & download file (API-022, API-050) | File uji | Upload >5MB; exe disguised .jpg; akses `/api/files/:filename` tanpa auth & path traversal `..%2F` | >5MB → 413 PAYLOAD_TOO_LARGE; magic byte invalid → 422; tanpa auth → 401; traversal → 400/403 tanpa bocor file | Security | P0 |
| TEST-013 | PRD-010 — pengajuan jual beli (API-025) | Anggota, produk aktif | Isi form (harga pokok, DP, tenor, margin) → submit | Preview angsuran & harga jual benar (decimal.js); DP ≥ 0; tenor valid; setelah approval DP proof + jadwal angsuran dibuat | E2E | P0 |
| TEST-014 | PRD-011 — pengajuan pinjaman lunak (API-026) | Anggota | Ajukan jumlah & tenor → approval | 201 + approval chain; setelah approve jadwal angsuran dibuat; nominal > batas → INVALID_AMOUNT | E2E | P1 |
| TEST-015 | PRD-011 — input modal koperasi (API-027) | Login Bendahara | Input DEBET/KREDIT nominal > 0 | 200 + audit; nominal ≤ 0 ditolak; hanya Bendahara (lain → 403) | Integration | P1 |
| TEST-016 | PRD-012 — batch & draw arisan (API-031..033) | Batch ACTIVE, angsuran bulan berjalan lunas | Buat batch → aktivasi → draw | Draw hanya jika semua angsuran lunas (INSTALLMENTS_UNPAID bila belum); hasil tidak dapat diprediksi (RNG kriptografis BR-08.04); pemenang + bukti transfer tercatat | E2E | P0 |
| TEST-017 | PRD-012 — join arisan (API-032 domain) | Batch ACTIVE kuota tersisa | Anggota join → konfirmasi | 201 + peserta bertambah; kuota penuh → FULL; join ganda → 409 | Integration | P1 |
| TEST-018 | PRD-013 — master target tabungan (API-034/035) | Login Pengurus | CRUD target (nama, nominal, kategori, tahun) | Nominal ≤ 0 ditolak; target tampil di katalog anggota; tahun tidak valid ditolak | Integration | P1 |
| TEST-019 | PRD-013 — setoran & penarikan tabungan (API-036) | Target aktif | Setoran (transfer+bukti) → verifikasi → progres; ajukan penarikan | Progres = saved/target setelah verify; penarikan lewat approval 3-step; saldo tidak cukup → INSUFFICIENT_BALANCE | E2E | P1 |
| TEST-020 | PRD-014 — katalog & order sukuk (API-028/029) | Issue OPEN, kuota tersisa | Order senilai kuota → order melebihi → order saat CLOSED | Order valid → approval 3-step → CONFIRMED; melebihi → QUOTA_EXCEEDED; CLOSED → tidak bisa order | E2E | P1 |
| TEST-021 | PRD-015 — pengajuan pendanaan syariah (API-030) | Anggota | Pilih akad (Mudharabah/Musyarakah/dll) + jumlah + tenor → submit | 201 + approval chain; akad wajib valid; setelah approve pencairan + jadwal dibuat | E2E | P1 |
| TEST-022 | PRD-016 — training & evaluasi (API-037..039) | Kurikulum aktif | Baca materi → submit kuis → cek nilai & ranking | Jawaban belum lengkap → VALIDATION_ERROR; nilai tersimpan; ranking ter-update real-time | E2E | P1 |
| TEST-023 | PRD-017 — notifikasi & push (API-042..044) | User login | Buka list → mark read → subscribe push | List + filter benar; read/unread tersimpan; subscribe VAPID → 200 + endpoint tersimpan | Integration | P1 |
| TEST-024 | PRD-018 — dashboard (API-040/041) | Data seed | Buka dashboard admin & anggota | 6 kartu statistik = data DB; antrean approval hanya step milik role; anggota hanya lihat datanya sendiri | Integration | P1 |
| TEST-025 | PRD-019 — ekspor Excel (per modul) | Data laporan ada | Filter periode → ekspor | File XLSX terunduh; kolom = kolom laporan; jumlah baris = hasil filter; nama file jelas | Integration | P2 |
| TEST-026 | PRD-019 — impor Excel (per modul) | Template valid + file cacat | Upload template benar; upload file salah format; upload sebagian baris invalid | Benar → data masuk + audit; salah format → pesan jelas; sebagian gagal → tabel baris bermasalah, sisanya diimpor | Integration | P1 |
| TEST-027 | PRD-020/021/022 — masking, audit, re-auth (API-050) | Login per 4 peran berbeda | Lihat data anggota sebagai tiap peran; eksekusi aksi destruktif | NIK/HP/email ter-mask sesuai peran; PII tidak di URL/localStorage; aksi destruktif → audit_log + re-auth password wajib | Security | P0 |
| TEST-028 | PRD-023 — landing page & kontak (API-045..047) | Data landing seed | Buka landing → isi form kontak → submit | Section tampil + fallback aman bila kosong; kontak valid → 201 + tersimpan; input invalid → VALIDATION_ERROR; konten artikel di-sanitize (XSS) | Integration | P2 |
| TEST-029 | PRD-009/024/025 — konfigurasi (API-019/020, 048/049) | Login Bendahara | Set nominal simpanan (tanggal efektif masa depan & lampau); set biaya admin FLAT & PERCENTAGE | Nominal valid + tanggal ≥ hari ini; tanggal lampau → PAST_EFFECTIVE_DATE; biaya admin memengaruhi tagihan setelah tanggal efektif; hanya Bendahara write | E2E | P1 |
| TEST-030 | PRD-026 — PWA offline & update (SCR-024) | Build produksi, SW terdaftar | Matikan jaringan → buka app; naikkan versi → reload | App shell tetap terbuka offline + banner offline; aksi transaksi diblok dengan penjelasan; prompt update muncul; cache versi lama dibersihkan | Manual/E2E | P1 |
| TEST-031 | PRD-017 — real-time Socket.IO | 2 sesi: pemohon & approver | Approver decide → amati UI pemohon | Pemohon menerima APPROVAL_UPDATE tanpa reload; saat socket putus → fallback refresh manual + indikator koneksi | Integration | P1 |
| TEST-032 | PRD-004 — concurrency approval (API-015) | Pengajuan pending step sama | 2 approver sah klik approve hampir bersamaan | Satu berhasil; yang lain 409 (DUPLICATE_APPROVAL/ALREADY_FINALIZED) — tidak ada double-posting jurnal | Integration | P0 |
| TEST-033 | NFR — performa API (TSD §6) | Staging load test | GET dashboard & POST approval, ukur p95 | Read p95 < 300ms; write p95 < 500ms; error rate < 1% | Performance | P1 |
| TEST-034 | NFR — performa frontend (TSD §6) | Build produksi | Lighthouse landing & dashboard; cek bundle size | LCP < 2.5s; initial JS admin < 500KB gzip; skor a11y Lighthouse ≥ 90 | Performance | P2 |
| TEST-035 | NFR — security scan (TSD §6) | CI staging | `npm audit --audit-level=high`; `gitleaks` pada repo; cek header (Helmet) | 0 high/critical CVE; 0 secret; CSP/HSTS/X-Frame-Options/nosniff/Referrer-Policy aktif | Security | P0 |
| TEST-036 | NFR — aksesibilitas keyboard (TSD §6) | Staging | Walkthrough keyboard-only layar kritis (login, registrasi, approval, billing) | Semua elemen interaktif terjangkau keyboard; focus-visible jelas; modal focus trap; Esc menutup | Manual | P1 |

### 4.1 Hasil eksekusi P0 — live produksi (2026-11-22)

Dieksekusi terhadap `api.kkpus.id` (branch `rollback/2026-11-02`, commit `4e7b8f4`) dengan data uji mandiri (prefix `uji.`, domain `@kkpus-test.id`; dibuat & dibersihkan otomatis — 0 baris sisa terverifikasi). Total **57/57 check PASS** setelah perbaikan DEF-002..DEF-010 (lihat `10_DEV_LOG.md`).

| Test | Status | Catatan |
| --- | --- | --- |
| TEST-001 | ✅ PASS | 200 + JWT + cookie `auth_token` HttpOnly; logout → akses 401 |
| TEST-003 | ✅ PASS | 201; registrasi PENDING + chain 3-tahap; duplikat email/NIK → 409 |
| TEST-004 | ✅ PASS | 401×5 + `login_attempts` & `account_lockouts` tercatat (fix DEF-002); OTP spam → 429 |
| TEST-007 | ✅ PASS | 403 role salah/self/maker-checker; 3-step → APPROVED; dobel approve → 409 `APPROVAL_ALREADY_COMPLETED` (fix DEF-004/008) |
| TEST-009 | ✅ PASS | nominal > saldo → 400; pending ganda → 400 `PENDING_WITHDRAWAL_EXISTS` (guard baru); approve 3-step → READY_TO_PAY → saldo 1.000.000→950.000 |
| TEST-011 | ✅ PASS | upload → PENDING_VERIFICATION → verify → PAID; nominal klien diabaikan, server recompute dari bill_item (aman) + validasi bill_id (fix DEF-005) |
| TEST-012 | ✅ PASS | >5MB → 413; exe samaran → 400 (spec 422 — divergensi); tanpa auth → 401; path traversal → 400 |
| TEST-013 | ✅ PASS | 201 + flow financing 3-step; DP negatif → ditolak |
| TEST-016 | ✅ PASS | batch → aktivasi → draw tanpa angsuran lunas → 400 `INSTALLMENTS_UNPAID`; lunas → 200 + RNG kriptografis (fix DEF-006/BR-08.04) |
| TEST-027 | ✅ PASS | NIK ter-mask utk anggota biasa, utuh utk pengurus (fix DEF-010); aksi destruktif → `activity_logs`; re-auth password wajib |
| TEST-032 | ✅ PASS | approval konkuren: satu 200, lain 403; tidak ada double row |
| TEST-035 | ✅ PASS | CSP/HSTS/XFO/nosniff/Referrer-Policy aktif; `Server: nginx` (versi disembunyikan, fix DEF-007); SCA: 0 high/critical; gitleaks 3 repo: api 0 leak, admin 3× P4 dev artifact, kkpusid 56 → triase 1× P2 (VAPID_PRIVATE_KEY history) **dirotasi & live terverifikasi**, sisanya P3/P4 dev artifacts (detail `10_DEV_LOG.md` TASK-010) |

**Divergensi spec (dicatat, tidak memblokir):** lockout 429 vs spec 423; OTP rate-limit 5/15mnt vs spec 3/menit; magic-byte invalid 400 vs spec 422; sebagian endpoint sukses 200 (impl) vs 201 (spec).

**Belum diuji (P1/P2):** TEST-002 (OTP E2E), TEST-005/006, TEST-008, TEST-010, TEST-014/015, TEST-017..026, TEST-028..031, TEST-033/034/036; gitleaks full-repo (sisa TEST-035).

### 4.2 Hasil eksekusi P1 batch 1 — live produksi (2026-11-22)

Dieksekusi terhadap `api.kkpus.id` (commit `1f10683`) dengan data uji mandiri (prefix `uji.`, domain `@kkpus-test.id`; dibuat & dibersihkan otomatis — 0 baris sisa terverifikasi). Total **29/29 check PASS** setelah perbaikan DEF-011 & DEF-012.

| Test | Status | Catatan |
| --- | --- | --- |
| TEST-002 | ✅ PASS | send-otp 200+sessionId; OTP salah 3x 400 (impl limit 5 vs spec 3 — divergensi); OTP benar (bcrypt) → 200+resetToken; reset → 200; login password baru 200, lama 401; OTP kedaluwarsa → 410 (fix DEF-011 + align spec) |
| TEST-005 | ✅ PASS | assign role 200 + DB role + audit `UPDATE_ROLE`; role duplikat → 409 `ROLE_ASSIGNED` (fix DEF-012); anggota Luar Biasa → 400; non-pengurus → 403 |
| TEST-006 | ✅ PASS | hapus tanpa password 400; password salah 403 `REAUTH_PASSWORD_MISMATCH`; benar 200; DB hard delete (0 baris); audit `HARD_DELETE_MEMBER`; hilang dari list. API-011 restore REMOVED — tidak diuji |
| TEST-008 | ✅ PASS | admin-summary 200 + total = pokok+wajib+sukarela (konsisten); admin-transactions 200 + transactions[]+pagination; filter type=POKOK 200; admin-report 200; non-admin 403 |
| TEST-010 | ✅ PASS | submit berhenti 201 PENDING + approval chain (flow/step); duplikat 400; reason kosong 400; status PENDING; riwayat & saldo tetap 200 |

**Divergensi spec (dicatat, tidak memblokir):** OTP attempts 5 vs spec 3; sebagian endpoint sukses 200 (impl) vs 201 (spec).

**Belum diuji (P1/P2):** TEST-014/015, TEST-017..026, TEST-028..031, TEST-033/034/036.

### 4.3 Hasil eksekusi P1 batch 2 — live produksi (2026-11-22)

Dieksekusi terhadap `api.kkpus.id` (commit `4596454`) dengan data uji mandiri (prefix `uji.`, domain `@kkpus-test.id`; dibuat & dibersihkan otomatis — 0 baris sisa terverifikasi). Total **34/34 check PASS** setelah perbaikan DEF-013 & DEF-014. Cakupan: TEST-014/015 (financing apply & modal koperasi), TEST-017 (join arisan), TEST-018 (master program tabungan), TEST-020 (sukuk), TEST-023 (notifikasi & push), TEST-024 (dashboard), TEST-029 (konfigurasi simpanan & biaya).

| Test | Status | Catatan |
| --- | --- | --- |
| TEST-014 | ✅ PASS | apply → 201 + financing_id; DB PENDING + approval chain (flow/step); apply ganda (aktif) → 400; tanpa auth 401. Gap dicatat: INVALID_AMOUNT (nominal > batas) tidak diimplementasi — `loan_products` tanpa field limit/plafon |
| TEST-015 | ✅ PASS | Bendahara input DEBET → 201 (fix DEF-013: role gate `MidRole(['Bendahara'])` + validasi nominal > 0); nominal ≤ 0 → 400; non-Bendahara → 403 |
| TEST-017 | ✅ PASS | join batch AKTIF kuota ada → 201; join ganda → 409 (fix: 400→409); kuota penuh → 400; batch tidak ada → 404 |
| TEST-018 | ✅ PASS | Bendahara buat program → 201 + tampil di list; nominal ≤ 0 → 400 (fix: validasi `target_amount > 0`); hapus program → 200; non-pengurus → 403 |
| TEST-020 | ✅ PASS | katalog → 200 hanya OPEN + current_funding; order nominal ≥ min → 201 PENDING; order nominal < min → 400. Gap dicatat: QUOTA_EXCEEDED & order saat CLOSED tidak diimplementasi (`createSukukOrder` hanya cek `min_investment`) |
| TEST-023 | ✅ PASS | list → 200 + unread_count; update-status → 200 + DB status=read; push subscribe → 201 + tersimpan di `member_push_subscriptions` |
| TEST-024 | ✅ PASS | dashboard anggota → 200 + dashboard_type=REGULER (fix DEF-014: normalisasi `member_type` case-insensitive — "Anggota Reguler" 76 anggota prod kini dapat dashboard); admin dashboard → 200 + 6 stats; non-admin → 403 |
| TEST-029 | ✅ PASS | GET simpanan/config → 200 + configs; PUT simpanan/config → 200 + DB berubah (di-restore); payment-fees publik → 200; PUT payment-fees → 200; non-pengurus → 403. Gap dicatat: PAST_EFFECTIVE_DATE & validasi nominal tidak ada (PUT hanya cek array `configs`) |

**Defect ditemukan & diperbaiki:** DEF-013 (modal endpoint tanpa role gate + tanpa validasi nominal), DEF-014 (dashboard type kosong untuk "Anggota Reguler" — 76/110 anggota prod).

**Divergensi spec (dicatat, tidak memblokir):** TEST-014 INVALID_AMOUNT tidak ada field limit di `loan_products`; TEST-017 duplicate 400→409 (fixed); TEST-020 QUOTA_EXCEEDED/CLOSED tidak dicek; TEST-018 no tahun field; TEST-029 PAST_EFFECTIVE_DATE tidak ada.

**Belum diuji (P2):** TEST-026, TEST-028, TEST-031, TEST-033/034/036.

### 4.4 Hasil eksekusi P2 batch 3 — live produksi (2026-11-22)

Dieksekusi terhadap `api.kkpus.id` (commit `aea42be`) dengan data uji mandiri (prefix `uji.`, domain `@kkpus-test.id`; dibuat & dibersihkan otomatis — 0 baris sisa terverifikasi). Total **29/29 check PASS** setelah perbaikan DEF-015. Cakupan: TEST-019 (tabungan penarikan), TEST-021 (pendanaan syariah), TEST-022 (training & evaluasi), TEST-025 (ekspor Excel), TEST-026 (impor Excel), TEST-028 (landing & kontak), TEST-031 (Socket.IO), TEST-033 (performa API smoke).

| Test | Status | Catatan |
| --- | --- | --- |
| TEST-019 | ✅ PASS | penarikan saldo < target → 400 (INSUFFICIENT_BALANCE equivalent); saldo ≥ target → 200 + approval chain (DB `savings_withdrawals` PENDING + flow); target tidak ada → 404; penarikan ganda → 400. Setoran melalui billing module (sudah diuji TEST-009/011) |
| TEST-021 | ✅ PASS | apply pendanaan (`category='Pendanaan'`) → 201 + financing_id; DB PENDING + approval chain (flow/step); tanpa auth → 401. Setelah approve pencairan + jadwal belum diuji (perlu approval flow lengkap) |
| TEST-022 | ✅ PASS | GET curriculums → 200 + list (5); GET materials → 200 (2); submit evaluasi → 200 + score; tanpa answers → 400; GET rankings → 200 (fix DEF-015: Sequelize alias `as:'member'`) |
| TEST-025 | ✅ PASS | admin export → 200 + content-type xlsx; non-admin → 403; tanpa auth → 401 |
| TEST-026 | ✅ PASS | non-admin import → 403; template download → 200 + xlsx; upload file salah format → 400 (validateExcelFile magic-byte check). Upload xlsx valid tidak diuji live (perlu file sesuai format template) |
| TEST-028 | ✅ PASS | GET services/stats/about/contact → 200 (fallback aman saat kosong); submit kontak valid → 200 + tersimpan; submit invalid → 400 |
| TEST-031 | ✅ PASS | Socket.IO endpoint merespons (200); `APPROVAL_UPDATE` event terdaftar (global broadcast). Full 2-sesi E2E perlu test manual dengan 2 socket client |
| TEST-033 | ✅ PASS | GET dashboard p95=414ms (20 concurrent smoke); single=33ms. Full load test (write p95 < 500ms, error rate < 1%) perlu staging + k6/JMeter |

**Defect ditemukan & diperbaiki:** DEF-015 (`getRankings`/`getMyRanking` 500 — Sequelize include tanpa alias).

**Divergensi spec (dicatat, tidak memblokir):** TEST-019 INSUFFICIENT_BALANCE tidak ada kode error literal (impl pakai 400 + pesan teks); TEST-022 VALIDATION_ERROR tidak ada kode (impl pakai 400 + pesan teks); TEST-028 VALIDATION_ERROR tidak ada kode; TEST-031 full E2E perlu manual; TEST-033/034 full load test perlu staging.

**Belum diuji (manual/staging):** TEST-030 (PWA offline), TEST-034 (frontend performa/Lighthouse), TEST-036 (keyboard accessibility).

### 4.5 Hasil eksekusi P2 — TEST-034 bundle size (frontend, 2026-11-22)

Build produksi (`vite build`) kedua frontend & ukur initial JS (chunk yang di-`modulepreload` di `index.html`), dalam gzip:

| Repo | Initial JS (gzip) | Threshold | Status |
| --- | --- | --- | --- |
| admin.kkpus.id | **~125 kB** (index 80 + react-dom 41 + jsx-runtime 3 + ThemeProvider 0.6) | < 500 kB | ✅ PASS |
| kkpusid (public) | **~281 kB** (index 17 + vendor 183 + vendor-react 72 + framer 11 + lain ~2) | < 500 kB | ✅ PASS |

**Defect ditemukan & diperbaiki (DEF-016):** `kkpusid/vite.config.js` `manualChunks` catch-all `return 'vendor'` memaksa `html2pdf.js` (~400 kB — membundel html2canvas+jspdf+canvg) + `moment` + `react-webcam` masuk **initial preloaded vendor**. `html2pdf` hanya dipakai `ReceiptPage` (lazy route) tapi dimuat di setiap halaman → initial JS **567 kB gzip** (risiko LCP). Fix: split `vendor-print`/`vendor-moment`/`vendor-webcam` jadi chunk terpisah (lazy) → initial **281 kB gzip (−50%)**. Deploy via CI/CD (run `44989746570`): CI lint/test/audit/security ✅, Deploy to VPS ✅ — kkpus.id serving build baru.

**Lighthouse audit (desktop, 2026-11-22):**

| Target | LCP | Perf | A11y | Best Practices | Status |
| --- | --- | --- | --- | --- | --- |
| kkpus.id (landing) | **0.7 s** | 99 | 94 | 90 | ✅ PASS |
| admin.kkpus.id (login) | **0.9 s** | 99 | 93 | 100 | ✅ PASS |

Kedua target **LCP < 2.5 s** & **a11y ≥ 90** terpenuhi. Dashboard admin authenticated belum diuji Lighthouse (butuh inject auth token — catatan untuk iterasi selanjutnya).

> **Koreksi (2026-11-22):** Pengukuran Lighthouse kkpus.id di atas diambil **sebelum** config error ditemukan (lihat §4.6) — saat itu app menampilkan halaman "Konfigurasi Error" (VITE_API_ORIGIN belum diset). Skor tersebut menilai halaman error, bukan app asli. Setelah fix §4.6, app render normal (CDP: `hasRoot: true`). Lighthouse kkpus.id perlu diukur ulang pasca-fix (belum dilakukan).

### 4.6 Hasil eksekusi P2 — TEST-030 PWA offline (frontend, 2026-11-22)

Diuji via **Chrome headless + CDP** (`Network.emulateNetworkConditions offline=true`) terhadap `https://kkpus.id/`.

**Defect ditemukan & diperbaiki (DEF-017 — config error):** `kkpus.id` frontend menampilkan "⚠️ Konfigurasi Error — VITE_API_ORIGIN belum diset" dan app tak pernah mount (`hasRoot: false`). Root cause: `.env.production` di-untrack (commit `02031dd`) tapi env guard `src/index.jsx` (commit `65595fb`) mewajibkan `VITE_API_ORIGIN`, sedangkan `deploy.yml` menjalankan `npm run build` **tanpa set `VITE_*`** → undefined saat runtime. Fix: `deploy.yml` set `VITE_API_BASE_URL`/`VITE_API_ORIGIN`/`VITE_SOCKET_URL` saat build (konsisten admin `deploy.yml` baris 86-89). Deploy via CI/CD (run `44994767890`) ✅.

**Hasil verifikasi (pasca-fix):**

| Skenario | Hasil | Status |
| --- | --- | --- |
| Online — app render | `hasRoot: true`, rootChildren 2 (SplashPage → landing) | ✅ |
| Offline — `navigator.onLine` | `false` (CDP) | ✅ |
| Offline — banner "Koneksi Internet Terputus…" | muncul, `role="alert"` | ✅ |
| Offline — aksi transaksi (POST) | diblok (`blocked: true`) | ✅ |

**Implementasi (SCR-024):** `OfflineIndicator.jsx` (banner) + guard axios di `src/utils/api.js` (blokir POST/PUT/PATCH/DELETE saat `navigator.onLine===false` + toast "Tidak ada koneksi internet. Transaksi tidak dapat diproses saat offline."). Commit kkpusid `9b8ede3` (fitur) + `b2f53ad` (fix config). App shell offline via `sw.js` (sudah ada); update prompt kkpusid via `appVersion` cache-clear.

**Belum diuji (manual/staging):** TEST-036 (keyboard accessibility), Lighthouse kkpus.id pasca-fix, dashboard admin authenticated Lighthouse.

### 4.7 Hasil eksekusi P2 — TEST-036 keyboard accessibility (frontend, 2026-11-22)

Audit kode keyboard & fokus di kedua frontend (`kkpusid` + `admin`), plus Lighthouse kkpus.id pasca-fix DEF-017.

**Lighthouse kkpus.id pasca-fix (desktop, 2026-11-22):** Perf 97 · A11y 96 · Best Practices 100 · LCP 1.2 s · FCP 0.7 s · TBT 30 ms — semua lulus (LCP < 2.5 s, a11y ≥ 90).

**Audit keyboard — temuan positif (sudah accessible):**

| Komponen | Status |
| --- | --- |
| Skip-link ("Lewati ke konten utama" → `#main-content`) | ✅ |
| Keyboard shortcuts (`useKeyboardShortcuts`: Ctrl+B sidebar, Ctrl+H dashboard, dll) | ✅ |
| Dropdown (User/Notification) — Escape menutup | ✅ |
| `GlobalSearch` — focus input on open, ArrowUp/Down, Enter, Escape | ✅ |
| Modal (Notification/Detail) — react-bootstrap `Modal` (focus trap, aria-modal, Escape, focus restore) | ✅ |
| `div/span/li onClick` tanpa keyboard handler | 0 (bersih) |
| Input checkbox/radio — `<label htmlFor>` asosiasi | ✅ |
| Indikator fokus CSS (`:focus-visible`, `.focus-ring`) | ✅ |

**Defect ditemukan & diperbaiki (DEF-018 — keyboard a11y):**

| Lokasi | Masalah | Fix |
| --- | --- | --- |
| kkpusid `FileUploadField.jsx` | Div pemicu upload (`onClick` → file input click) tanpa `tabIndex`/`role`/`onKeyDown` → keyboard user tak bisa buka file picker | Tambah `role=button`, `tabIndex=0`, handler Enter/Space, `aria-label` (commit `a930df8`) |
| admin `ApprovalPlaceholder.jsx` | Div status approval (`onClick` → detail) tanpa keyboard | Tambah `role=button`, `tabIndex=0`, Enter/Space, `aria-label` (commit `227e0f9`) |

**Deploy:** CI/CD kkpusid (run `44995946235`) & admin (run `44995946130`) ✅ — frontend live & sehat.

**Belum diuji (manual/staging):** Walkthrough keyboard-only penuh di browser nyata (fokus: urutan tab, focus trap modal, focus kembali ke trigger setelah modal tutup,indikator fokus terlihat) — perlu manual. Lighthouse dashboard admin authenticated (butuh inject token).

**Walkthrough keyboard via CDP (automated, 2026-11-22):** Diverifikasi di **admin login page** & **kkpus.id landing** (Chrome headless + `Input.dispatchKeyEvent`). Hasil: urutan tab logis (splash → link "Kembali"/backoffice → input email `pengguna@koperasi.com`; kkpus.id splash skip btn → link landing — semua elemen interaktif terjangkau keyboard), **indikator fokus `:focus-visible` = true** pada semua elemen fokus, Shift+Tab berfungsi (focus kembali ke elemen sebelumnya), Escape menutup tanpa modal. Splash: 1-2 tombol lalu fokus kembali ke atas (perilaku standar browser saat sedikit elemen fokus, bukan defect). Modal focus trap via react-bootstrap `Modal` (focus trap + aria-modal + Escape + focus restore built-in) sudah diverifikasi di audit kode. Tidak ada focus trap defect ditemukan.

### 4.8 Follow-up keamanan pasca-TEST (2026-11-22)

| Item | Aksi | Hasil |
| --- | --- | --- |
| Web Push re-subscribe (DEF-019) | kkpusid `4080ec6`: pushHelper fetch VAPID fresh + compare `push_vapid_used` (localStorage), re-subscribe bila berubah/legacy; layout NotificationPrompt rekonsiliasi saat permission `granted` tiap kunjungan | CI/CD run `44997108453` ✅; re-subscribe otomatis pasca rotasi VAPID |
| react-router CVE-2025-68470 (SEC-001) | Upgrade 6.30.6 → 7.18.6 di kkpusid (`c10712c`) & admin (`69ea165`); verifikasi build/lint/test + runtime via CDP (kkpus.id landing render, admin login render) | CI/CD kkpusid `44998517897` + admin `44998533636` ✅ |
| firebase-admin removal (SEC-002) | Hapus unused `firebase-admin@13.10.0` (0 reference) + `npm audit fix` non-force (rimraf/js-beautify/sequelize-cli aman) | 18 → 8 moderate vuln; 126 tests pass; CI api `44999571982` ✅ |
| Sisa 8 moderate vulns | Accepted risk: uuid@8.3.2 (GHSA-w5hq-g745-h8pq — `uuidv4()` tanpa buffer → tak exploitable; fix butuh breaking downgrade exceljs→3.4.0/sequelize-cli→6.6.2), editorconfig/nodemon/glob/minimatch (devDeps, tak deployed) | 2026-11-22 |
| Rotasi password DB prod | **Belum dikerjakan** — butuh akses SSH VPS (update `.env` + restart) yang tak tersedia di sesi ini; user `admin` mungkin shared | 2026-11-22 |
| Purge history git kkpusid (SEC-003) | `git filter-repo --refs rollback/2026-11-02 --invert-paths` hapus `.env` + `*.key`/`*.pem`/`*.crt` + scrub literal VAPID key; branch di-rewrite (`c10712c`→`94ec5ca`), force-push ke origin. Verifikasi remote: `.env`=0, VAPID literal=0, cert=0. Backup lokal `backup-rollback-pre-purge` | 2026-11-22 |

**Walkthrough keyboard via CDP (automated, 2026-11-22):** selesai — urutan tab logis, indikator fokus `:focus-visible` pada semua elemen, Shift+Tab berfungsi, Escape menutup tanpa modal, tidak ada focus trap defect (detail §4.7). Walkthrough manual penuh di browser nyata masih direkomendasikan.

## 5. Regression and release checks
- [ ] `npm run lint` dan `npm run build` lulus di `admin.kkpus.id`, `kkpusid`, dan `api.kkpus.id`.
- [ ] Automated tests lulus: Jest/Vitest (unit + integration) dan Supertest (kontrak API) — coverage kode baru ≥ 70%.
- [ ] Critical user journeys lulus di **staging**: login, registrasi 8-step, approval 3-step (TEST-007), manual payment (TEST-011), penarikan simpanan (TEST-009), arisan draw (TEST-016).
- [ ] API/schema compatibility reviewed: `06_API_SPEC.md` vs routes aktual (`api.kkpus.id`) — selaraskan atau perbarui spec bila divergen (BLK-003).
- [ ] Accessibility & security checks: keyboard walkthrough (TEST-036) + header/secret/SCA scan (TEST-035) lulus.
- [ ] Known issues have owner, severity, and release disposition — tidak ada Sev1/Sev2 terbuka saat rilis.

## 6. Defect reporting

| Field | Required content |
| --- | --- |
| ID / severity | `DEF-XXX` + severity: **Sev1** (blocker: alur uang/auth rusak), **Sev2** (mayor: fitur core gagal, tanpa workaround), **Sev3** (minor: ada workaround), **Sev4** (trivial/kosmetik) |
| Reproduction | Langkah minimal + environment (local/staging/prod) + data uji (ID akun, ID entitas) |
| Expected / actual | Hasil yang diharapkan vs yang terjadi (sertakan kode error API bila ada) |
| Evidence | Log server (timestamp), screenshot/record, response body, trace Socket.IO bila relevan |
| Owner / status | Assignee + state: `Open` → `In Progress` → `Fixed` → `Retest` → `Closed` / `Deferred` (dengan disposisi rilis) |

## 7. Traceability

### 7.1 PRD requirement → test case

| Requirement | Test cases |
| --- | --- |
| PRD-001, PRD-002 (auth, session) | TEST-001, TEST-002, TEST-004 |
| PRD-003 (registrasi) | TEST-003 |
| PRD-004 (approval 3-step) | TEST-007, TEST-032 |
| PRD-005, PRD-006 (role, arsip, termination) | TEST-005, TEST-006, TEST-010 |
| PRD-007 (simpanan) | TEST-008, TEST-009 |
| PRD-008 (billing) | TEST-011 |
| PRD-009, PRD-024, PRD-025 (konfigurasi) | TEST-029 |
| PRD-010 (jual beli) | TEST-013 |
| PRD-011 (pinjaman) | TEST-014, TEST-015 |
| PRD-012 (arisan) | TEST-016, TEST-017 |
| PRD-013 (tabungan) | TEST-018, TEST-019 |
| PRD-014 (sukuk) | TEST-020 |
| PRD-015 (pendanaan) | TEST-021 |
| PRD-016 (training) | TEST-022 |
| PRD-017 (notifikasi & real-time) | TEST-023, TEST-031 |
| PRD-018 (dashboard) | TEST-024 |
| PRD-019 (excel) | TEST-025, TEST-026 |
| PRD-020, PRD-021, PRD-022 (audit, dokumen, masking) | TEST-012, TEST-027 |
| PRD-023 (landing) | TEST-028 |
| PRD-026 (PWA) | TEST-030 |
| NFR (TSD §6) | TEST-033, TEST-034, TEST-035, TEST-036 |

**Coverage:** 36 test case (TEST-001..TEST-036) mencakup seluruh 26 requirement PRD, 50 endpoint API (API-001..API-050), dan 24 screen (SCR-001..SCR-024). ✅

### 7.2 API endpoint → test case (ringkas)

| Endpoint group | Test cases |
| --- | --- |
| API-001..005 (auth) | TEST-001, TEST-002, TEST-004 |
| API-006..012 (member) | TEST-003, TEST-005, TEST-006, TEST-010 |
| API-013..015 (approval) | TEST-007, TEST-032 |
| API-016..018 (simpanan) | TEST-008, TEST-009 |
| API-019..020, API-048..049 (config) | TEST-029 |
| API-021..024 (billing) | TEST-011, TEST-012 |
| API-025..030 (financing) | TEST-013, TEST-014, TEST-015, TEST-020, TEST-021 |
| API-031..033 (arisan) | TEST-016, TEST-017 |
| API-034..036 (tabungan) | TEST-018, TEST-019 |
| API-037..039 (training) | TEST-022 |
| API-040..041 (dashboard) | TEST-024 |
| API-042..044 (notifikasi) | TEST-023, TEST-031 |
| API-045..047 (content) | TEST-028 |
| API-050 (files) | TEST-012, TEST-027 |
| M-CRON (internal) | Backup harian & purge 02:00 — verifikasi via log server (bukan endpoint HTTP) |

### 7.3 Screen → test case (ringkas)

| Screen group | Test cases |
| --- | --- |
| SCR-001..003 (auth & registrasi) | TEST-001, TEST-002, TEST-003 |
| SCR-004..005 (landing & artikel) | TEST-028 |
| SCR-006..007 (dashboard) | TEST-024, TEST-033 |
| SCR-008..009 (manajemen anggota) | TEST-005, TEST-006, TEST-027 |
| SCR-010 (approval) | TEST-007, TEST-032 |
| SCR-011..013 (simpanan & billing) | TEST-008, TEST-009, TEST-011 |
| SCR-014..019 (jual beli, pinjaman, arisan, tabungan, sukuk, pendanaan) | TEST-013..TEST-021 |
| SCR-020 (training) | TEST-022 |
| SCR-021 (notifikasi) | TEST-023, TEST-031 |
| SCR-022 (konfigurasi) | TEST-029 |
| SCR-023 (excel) | TEST-025, TEST-026 |
| SCR-024 (PWA) | TEST-030 |
| Seluruh layar (a11y) | TEST-036 |

**Distribusi prioritas:** P0 = 12 (TEST-001, 003, 004, 007, 009, 011, 012, 013, 016, 027, 032, 035), P1 = 17, P2 = 7 (TEST-025, 028, 034, dst. — *minor/fitur pendukung*).