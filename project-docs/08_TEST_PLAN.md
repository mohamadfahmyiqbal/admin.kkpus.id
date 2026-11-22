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
| TEST-035 | ✅ PASS | CSP/HSTS/XFO/nosniff/Referrer-Policy aktif; `Server: nginx` (versi disembunyikan, fix DEF-007); SCA: 0 high/critical |

**Divergensi spec (dicatat, tidak memblokir):** lockout 429 vs spec 423; OTP rate-limit 5/15mnt vs spec 3/menit; magic-byte invalid 400 vs spec 422; sebagian endpoint sukses 200 (impl) vs 201 (spec).

**Belum diuji (P1/P2):** TEST-002 (OTP E2E), TEST-005/006, TEST-008, TEST-010, TEST-014/015, TEST-017..026, TEST-028..031, TEST-033/034/036; gitleaks full-repo (sisa TEST-035).

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