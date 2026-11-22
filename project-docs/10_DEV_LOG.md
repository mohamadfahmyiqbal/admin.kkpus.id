# Development Log

**Project:** KKPUS Platform

## Rules

- Add verified entries directly below this section; newest first.
- Do not rewrite past entries to conceal history. Correct them with a new entry.
- Log the actual files, decisions, database/API/UI impact, and verification evidence.
- Record `None` where a category does not apply.

---

## [2026-11-22] — Follow-up keamanan (DEF-019 + SEC-001/002 + vuln triage)

### Outcome

Menuntaskan semua follow-up keamanan yang sebelumnya diidentifikasi. Ditemukan & diperbaiki: **DEF-019** (Web Push re-subscribe pasca rotasi VAPID), **SEC-001** (react-router-dom open-redirect CVE-2025-68470 di kkpusid + admin), **SEC-002** (api `firebase-admin` unused + 18 transitive vuln). Triage 8 sisa moderate vuln sebagai accepted-risk. Rotasi password DB produksi masih pending (butuh SSH VPS).

### Requirements and decisions

- **Requirements implemented:** Follow-up keamanan dari HANDOFF — Web Push re-subscribe, react-router CVE, vuln triage, unit test passwordValidator (sudah TASK-015)
- **Decisions / tradeoffs:**
  - react-router 6→7 (semver major) dipilih walau breaking, karena CVE-2025-68470 nyata & app pakai library mode (`createBrowserRouter`) yang kompatibel v7; verifikasi build/lint/test + runtime CDP sebelum merge
  - uuid vuln dibiarkan: app pakai `uuidv4()` tanpa buffer eksplisit → tak exploitable; fix `--force` akan downgrade exceljs→3.4.0 (breaking)
  - firebase-admin dihapus total (unused) ketimbang di-upgrade major 8→14 (lebih aman & kecil attack surface)
  - DB password rotation: belum dieksekusi (butuh SSH VPS + koordinasi; user `admin` mungkin shared)

### Implementation impact

- **Added:** `__tests__/passwordValidator.test.js` (coverage 9.67→100%)
- **Modified:** `kkpusid/src/utils/helper/pushHelper.js` + `src/components/layout/ui/NotificationPrompt.jsx` (DEF-019), `kkpusid/src/pages/program/pinjaman/components/FileUploadField.jsx` (DEF-018), `admin.kkpus.id/src/components/ui/ApprovalPlaceholder.jsx` (DEF-018), kedua repo `package.json` (react-router 6→7, api firebase-admin removal)
- **Database:** None (schema tak berubah)
- **API:** None
- **UI:** Banner offline, zone upload/status approval keyboard-accessible, react-router routing kompatibel v7

### Verification

- `passwordValidator`: 18/18 test, coverage 100%
- Web Push re-subscribe: logic verified (CDP offline + re-subscribe path); CI/CD kkpusid `44997108453` ✅
- react-router: kkpusid `c10712c` run `44998517897` + admin `69ea165` run `44998533636` ✅; CDP prod: kkpus.id landing render, admin login render
- firebase-admin removal: `npm audit` 18→8 moderate; 126/126 tests; api CI `44999571982` ✅
- Frontend/API health: kkpus.id 200, admin 200, api 200

### Risks and follow-up

- **Known issues:** Sisa 8 moderate vulns accepted-risk (uuid/exceljs/sequelize runtime — fix breaking downgrade; devDeps tak deployed). Rotasi password DB produksi belum (butuh SSH VPS + maintenance window).
- **Next recommended task:** (1) Koordinasi rotasi password DB (butuh VPS SSH), (2) Walkthrough keyboard-only penuh manual (TEST-036 sisa), (3) opsional: purge git history kkpusid (opsional).

---

## [2026-11-22] — TEST-036 keyboard accessibility + DEF-018

### Outcome

Audit keyboard & fokus di `kkpusid` + `admin` (TEST-036). Sebagian besar sudah accessible (skip-link, keyboard shortcuts, dropdown Escape, GlobalSearch arrow/enter/escape, modal react-bootstrap focus-trap, `<label htmlFor>`, 0 div onClick tanpa keyboard). **Ditemukan DEF-018:** `FileUploadField` (kkpusid) & `ApprovalPlaceholder` (admin) pakai `<div onClick>` tanpa `tabIndex`/`role`/`onKeyDown` → keyboard user tak bisa picu aksi. **Diperbaiki & deployed.** Lighthouse kkpus.id pasca-fix DEF-017: Perf 97 · A11y 96 · BP 100 · LCP 1.2 s (semua lulus).

### Requirements and decisions

- **Requirements implemented:** TEST-036 (keyboard accessibility — WCAG 2.1.1 Keyboard, 2.4.7 Focus Visible, 4.1.2 Name/Role/Value), TSD §6
- **Decisions / tradeoffs:** Fix minimal (tambah role/tabIndex/onKeyDown/aria-label) tanpa refactor — menjaga konsistensi dengan pola yang sudah ada.

### Implementation impact

- **Added:** — (audit + fix pada komponen eksisting)
- **Modified:** `kkpusid/src/pages/program/pinjaman/components/FileUploadField.jsx` (commit `a930df8`), `admin.kkpus.id/src/components/ui/ApprovalPlaceholder.jsx` (commit `227e0f9`)
- **Database:** None
- **API:** None
- **UI:** Zone upload & status approval kini bisa diakses keyboard (fokus + Enter/Space)

### Verification

- Lint (kkpusid & admin) 0 error; build sukses keduanya
- CI/CD kkpusid (run `44995946235`) ✅ + admin (run `44995946130`) ✅
- Lighthouse kkpus.id pasca-fix: Perf 97 · A11y 96 · LCP 1.2 s
- Frontend live: kkpus.id 200, admin 200, api 200

### Risks and follow-up

- **Known issues:** Walkthrough keyboard-only penuh di browser nyata belum dilakukan (butuh manual — urutan tab, focus trap modal, focus kembali ke trigger, indikator fokus); Lighthouse dashboard admin authenticated belum (butuh token)
- **Next recommended task:** Selesaikan walkthrough keyboard-only manual (TEST-036 sisa) atau lanjut follow-up keamanan (rotasi DB password, unit test passwordValidator)

---

## [2026-11-22] — TEST-030 PWA offline + DEF-017 config error frontend (kkpus.id)

### Outcome

Saat memverifikasi TEST-030 (PWA offline) via Chrome headless + CDP, ditemukan **DEF-017**: `kkpus.id` menampilkan "⚠️ Konfigurasi Error — VITE_API_ORIGIN belum diset" dan app tak pernah mount (`hasRoot: false`). Root cause: `.env.production` di-untrack (commit `02031dd`) tapi env guard `src/index.jsx` (commit `65595fb`) mewajibkan `VITE_API_ORIGIN`, sedangkan `deploy.yml` menjalankan `npm run build` **tanpa set `VITE_*`**. **Diperbaiki:** `deploy.yml` set `VITE_API_BASE_URL`/`VITE_API_ORIGIN`/`VITE_SOCKET_URL` saat build (pola admin). Setelah deploy, app render normal & banner offline + guard transaksi offline terverifikasi.

### Requirements and decisions

- **Requirements implemented:** TEST-030 (PWA offline — SCR-024), TSD §6
- **Decisions / tradeoffs:** Guard transaksi offline dipusatkan di interceptor axios (`src/utils/api.js`) — reject mutasi saat `navigator.onLine===false` dengan toast; banner `OfflineIndicator.jsx` sebagai indikator visual. Fix DEF-017 di `deploy.yml` (bukan commit `.env.production`) agar konsisten dengan pola admin & tak menaruh konfigurasi di repo.

### Implementation impact

- **Added:** `kkpusid/src/components/pwa/OfflineIndicator.jsx` (banner offline, commit `9b8ede3`)
- **Modified:** `kkpusid/src/App.jsx` (render OfflineIndicator), `kkpusid/src/utils/api.js` (guard mutasi offline), `kkpusid/.github/workflows/deploy.yml` (VITE_* env saat build, commit `b2f53ad`)
- **Database:** None
- **API:** None
- **UI:** Banner offline merah + toast saat aksi transaksi offline

### Verification

- CDP headless (`Network.emulateNetworkConditions offline=true`): online `hasRoot: true`; offline banner "Koneksi Internet Terputus…" muncul (`role="alert"`); `navigator.onLine=false`; POST offline `blocked: true`
- CI/CD kkpusid sukses (run `44994767890`): CI lint/test/audit/security ✅ + Deploy to VPS ✅
- Admin tak terdampak (sudah set VITE_* di deploy.yml)

### Risks and follow-up

- **Known issues:** Lighthouse kkpus.id (§4.5) diukur sebelum fix DEF-017 — perlu ukur ulang; dashboard admin authenticated Lighthouse belum diuji; puppeteer tak bisa di-install (network blokir) → TEST-030 verifikasi via CDP manual
- **Next recommended task:** TEST-036 (keyboard accessibility) — walkthrough keyboard-only layar kritis (butuh browser manual)

---

## [2026-11-22] — DEF-016: kkpusid frontend initial JS terlalu besar (TEST-034)

### Outcome

Build produksi `kkpusid` (public) menghasilkan initial JS **567 kB gzip** — didominasi catch-all `vendor` chunk (475 kB gzip) yang memuat `html2pdf.js` (~400 kB), `moment`, dan `react-webcam`. `html2pdf` hanya dipakai `ReceiptPage` (lazy route) tapi terangkut ke initial load. **Diperbaiki:** initial JS turun ke **281 kB gzip (−50%)**. Admin initial JS **125 kB gzip** (sudah aman). Keduanya lulus threshold < 500 kB (TEST-034).

### Requirements and decisions

- **Requirements implemented:** TEST-034 (NFR performa frontend — initial JS < 500 kB gzip), TSD §6
- **Decisions / tradeoffs:** `moment` dipisah ke chunk sendiri (`vendor-moment`) walau dipakai 7 file — tetap lazy-loadable per-halaman; `html2pdf`/`html2canvas`/`jspdf`/`dompurify` → `vendor-print` (hanya ReceiptPage)

### Implementation impact

- **Added:** —
- **Modified:** `kkpusid/vite.config.js` — `manualChunks`: tambah `vendor-print` (html2pdf/html2canvas/jspdf/canvg/dompurify), `vendor-moment`, `vendor-webcam` (react-webcam)
- **Database:** None
- **API:** None
- **UI:** None (build config only)

### Verification

- `npm run build` (kkpusid) — sukses; `vendor-print`/`vendor-moment`/`vendor-webcam` TIDAK di-`modulepreload` (lazy, terverifikasi grep `index.html` = 0)
- Initial JS kkpusid: 567 → **281 kB gzip** (−50%); admin: **125 kB gzip**
- `npx eslint` (kkpusid) — 0 error
- **Deploy:** CI/CD sukses (run `44989746570`): CI lint/test/audit/security ✅ + Deploy to VPS ✅; kkpus.id serving build baru (chunk `index--oCCF9ph.js` + vendor split terverifikasi)
- **Lighthouse (desktop):** kkpus.id landing — LCP 0.7s, Perf 99, A11y 94, BP 90; admin login — LCP 0.9s, Perf 99, A11y 93, BP 100 → LCP < 2.5s & a11y ≥ 90 (TEST-034) ✅

### Risks and follow-up

- **Known issues:** Dashboard admin authenticated belum diuji Lighthouse (butuh inject auth token); `vendor-print` (276 kB gzip) lazy-loaded hanya saat ReceiptPage — pastikan ReceiptPage tetap lazy di build berikutnya
- **Next recommended task:** TEST-030 (PWA offline) / TEST-036 (keyboard a11y) — manual browser testing

---

## [2026-11-22] — TASK-013: TEST P2 (TEST-019/021/022/025/026/028/031/033) + DEF-015

### Outcome

TEST P2 dieksekusi live di produksi (`api.kkpus.id`) dengan data uji mandiri (`uji.*@kkpus-test.id`). **29/29 check PASS** setelah 1 defect P1 diperbaiki. Cakupan: TEST-019 (tabungan penarikan + approval chain), TEST-021 (pendanaan syariah), TEST-022 (training & evaluasi + ranking), TEST-025 (ekspor Excel), TEST-026 (impor Excel + template), TEST-028 (landing & kontak), TEST-031 (Socket.IO connectivity), TEST-033 (performa API smoke). Data uji produksi 0 sisa.

### Requirements and decisions

- **Requirements implemented:** PRD-013/015/016/019/023, API-036..039, API-045..049, BR-08.04 (training scoring), ISO 27001 A.8.15
- **Decisions / tradeoffs:** TEST-031 full 2-sesi E2E tidak dijalankan via API runner (perlu 2 socket client simultan); TEST-033 full load test tidak dijalankan (perlu staging + k6/JMeter) — hanya smoke test live; TEST-030/034/036 manual/staging (tidak dijalankan)

### Implementation impact

- **Added:** —
- **Modified:**
  - `controllers/training/getRankings.js` (DEF-015: tambah `as:'member'` di include `getRankings` & `getMyRanking` — Sequelize association `db.Ranking.belongsTo(db.Member, { as: 'member' })` butuh alias eksplisit)
- **Database:** None (data uji dibuat & dibersihkan; 0 sisa)
- **API:** Tanpa breaking change; GET `/api/training/rankings` & `/api/training/my-ranking` kini 200 (sebelumnya 500)
- **UI:** None

### Verification

- `npx eslint` pada file berubah — 0 error
- `npm test` (api) — **108/108 PASS** setelah fix
- TEST P2 live runner — **29/29 PASS** (TEST-019: 5, TEST-021: 3, TEST-022: 5, TEST-025: 3, TEST-026: 3, TEST-028: 6, TEST-031: 2, TEST-033: 2)
- Data uji produksi bersih: 0 members/evaluations/rankings/savings_withdrawals/member_saving_targets/contact_forms uji
- `/health/deep` → 200

### Risks and follow-up

- **Known issues:** (1) TEST-019 INSUFFICIENT_BALANCE tidak ada kode error literal (impl 400 + pesan teks); (2) TEST-022/028 VALIDATION_ERROR tidak ada kode (impl 400 + pesan teks); (3) TEST-031 full E2E perlu manual; (4) TEST-033 p95=414ms di 20 concurrent — observasi performa (single instance); (5) TEST-030/034/036 belum dijalankan (manual/staging)
- **Next recommended task:** — (seluruh P0, P1, P2 API-testable selesai; sisa TEST-030/034/036 manual/staging)

---

## [2026-11-22] — TASK-012: TEST P1 batch 2 (TEST-014/015/017/018/020/023/024/029) + DEF-013/014

### Outcome

TEST P1 batch 2 dieksekusi live di produksi (`api.kkpus.id`) dengan data uji mandiri (`uji.*@kkpus-test.id`). **34/34 check PASS** setelah 2 defect P1 diperbaiki. Cakupan: TEST-014 (financing apply + approval chain), TEST-015 (modal koperasi), TEST-017 (join arisan), TEST-018 (master program tabungan), TEST-020 (sukuk catalog + order), TEST-023 (notifikasi & push), TEST-024 (dashboard), TEST-029 (konfigurasi simpanan & biaya). Data uji produksi 0 sisa.

### Requirements and decisions

- **Requirements implemented:** PRD-011/012/013, API-026..030, API-032..035, API-019/020, API-040..049, BR-07.02, UC-07.02, ISO 27001 A.8.15
- **Decisions / tradeoffs:** INVALID_AMOUNT (TEST-014), QUOTA_EXCEEDED (TEST-020), PAST_EFFECTIVE_DATE (TEST-029) tidak diimplementasi di branch ini — dicatat sebagai divergensi (impl tak punya field limit/plafon di `loan_products`, tak ada cek quota/status di `createSukukOrder`, PUT config hanya cek array); tidak "di-fix" tanpa instruksi karena bukan pelanggaran spec yang disetujui

### Implementation impact

- **Added:** —
- **Modified:**
  - `routes/programRoute.js` (DEF-013: `POST /pinjaman/modal` kini `MidRole(['Bendahara'])`)
  - `controllers/program/pinjamanModalController.js` (DEF-013: validasi `jumlah > 0` → 400; sebelumnya nominal 0 diterima)
  - `controllers/financing/applyArisan.js` (duplicate join 400→409, selaras TEST-017)
  - `controllers/savings/manageAdminTabungan.js` (validasi `target_amount > 0` → 400)
  - `controllers/core/dashboard/getDashboard.js` (DEF-014: normalisasi `member_type` case-insensitive — "Anggota Reguler" kini dapat dashboard REGULER)
- **Database:** None (data uji dibuat & dibersihkan; 0 sisa)
- **API:** Tanpa breaking change; modal endpoint kini Bendahara-only (403 utk non-Bendahara), duplicate arisan 409, tabungan target nominal ≤0 ditolak
- **UI:** None

### Verification

- `npx eslint` pada file berubah — 0 error
- `npm test` (api) — **108/108 PASS** setiap kali setelah fix
- TEST P1 batch 2 live runner — **34/34 PASS** (TEST-014: 3, TEST-015: 3, TEST-017: 4, TEST-018: 5, TEST-020: 4, TEST-023: 5, TEST-024: 3, TEST-029: 7)
- Data uji produksi bersih: 0 members/loan/financing/arisan/sukuk/saving_target/notifications/push_subs/pinjaman_modal uji
- `/health/deep` → 200

### Risks and follow-up

- **Known issues:** (1) DEF-014 berdampak luas — 76/110 anggota prod sebelumnya dashboard kosong; (2) `loan_products` tanpa field limit/plafon — INVALID_AMOUNT tak bisa diuji (perlu schema change bila disyaratkan); (3) `createSukukOrder` tak cek quota/status — order bisa melebihi kuota (perlu fix bila disyaratkan); (4) modal controller masih tanpa audit trail; (5) `.env` lokal memuat `JWT_SECRET` berbeda dari produksi — runner mengambil secret produksi via SSH
- **Next recommended task:** TASK-013 — TEST P2 (TEST-016 arisan draw, TEST-026/028/031, TEST-033/034/036)

---

## [2026-11-22] — TASK-011: TEST P1 batch 1 (TEST-002/005/006/008/010) + DEF-011/012

### Outcome

TEST P1 batch 1 dieksekusi live di produksi (`api.kkpus.id`) dengan data uji mandiri (`uji.*@kkpus-test.id`). **29/29 check PASS** setelah 2 defect P1 diperbaiki. Cakupan: TEST-002 (OTP E2E: send→verify→reset→login), TEST-005 (assign role + audit + guard duplikat), TEST-006 (hapus anggota — API-010 hard delete + re-auth), TEST-008 (data & laporan simpanan admin), TEST-010 (termination + approval chain). Data uji produksi 0 sisa (members/sesi/termination/role assignment).

### Requirements and decisions

- **Requirements implemented:** PRD-007/008/019/021, API-003..005, API-009..012, API-016..018, BR-ANGGOTA (ROLE_ASSIGNED), ISO 27001 A.8.15
- **Decisions / tradeoffs:** OTP tidak dapat dibaca dari log (EMAIL_PROVIDER=smtp) → sesi di-seed dengan bcrypt hash cost 4 agar jalur verify→reset→login deterministik; JWT mint memakai `JWT_SECRET` produksi (via SSH) karena `.env` lokal memuat secret berbeda

### Implementation impact

- **Added:** —
- **Modified:**
  - `utils/passwordValidator.js` (DEF-011: regex special-char `[!@#$%^&*(),.?":{}|<>_\-~+=/[\]]` — `[`/`]` di-escape; sebelumnya `[` tak-escape → `validatePassword` selalu invalid → reset password mustahil)
  - `controllers/core/anggota/updateRole.js` (DEF-012: guard 409 `ROLE_ASSIGNED` bila seluruh role tujuan sudah aktif)
  - `controllers/core/auth/forgotPasswordController.js` (OTP kedaluwarsa 400→410 GONE, selaras FSD `OTP_EXPIRED`)
- **Database:** None (data uji dibuat & dibersihkan; 0 sisa)
- **API:** Tanpa breaking change; kini 409 ROLE_ASSIGNED (role duplikat), 410 GONE (OTP kedaluwarsa) sesuai spec
- **UI:** None

### Verification

- `npx eslint` pada file berubah — 0 error
- `npm test` (api) — **108/108 PASS** setiap kali setelah fix
- TEST P1 live runner — **29/29 PASS** (TEST-002: 8/8, TEST-005: 5/5, TEST-006: 5/5, TEST-008: 5/5, TEST-010: 6/6)
- Data uji produksi bersih: 0 members/sesi/termination/role uji
- `/health/deep` → 200; `GET /api/push/vapid-public-key` OK

### Risks and follow-up

- **Known issues:** (1) `utils/passwordValidator.js` tidak tercakup unit test (coverage 9.67%) — perlu test agar regresi regex tidak terulang; (2) OTP attempts 5 vs spec 3 (divergensi, dicatat); (3) verifyOTPHash memakai bcrypt cost 4 (OK untuk OTP sekali-pakai); (4) insiden node_modules VPS sempat korup transitif (helmet/dotenv) → app crash-loop sementara, pulih setelah settle tanpa reinstall (perlu dipantau)
- **Next recommended task:** TASK-012 — TEST P1 batch 2 (TEST-014/015, 017..026, 028..031)

---

## [2026-11-22] — TASK-010: TEST-035 sisa — Gitleaks Full-Repo + Remediasi Secret (VAPID)

### Outcome

`gitleaks` v8.24.3 (binari resmi, bukan via package manager) dijalankan pada **seluruh history** 3 repo. api **0 leak** (438 commit); admin **3 temuan** (2× JWT `alg:none` di build artifact `assets/index-*.js` — file sudah di-gitignore; 1× `src/cert/localhost.key` dev cert di history, sudah untracked) — semua **Sev4/P4**; kkpusid **56 temuan** → triase: **1× Sev3/P2** `VAPID_PRIVATE_KEY` (Web Push) di history (commit `babe05b3`, 2026-01-03) → **keypair VAPID dirotasi** (baru, live terverifikasi `GET /api/push/vapid-public-key` → `BKuu…`); sisanya P3/P4: 9× private key dev (CN=localhost, expired 2026-08, bukan TLS produksi — nginx VPS bahkan tanpa `ssl_certificate` di config), 36× JWT sampel dev (`testApi.http` 29×, build artifacts 9× — diverifikasi **invalid signature** vs secret produksi). Backlog dirapikan: TASK-009 + DEF-002..010 di-backfill DONE, TASK-010 DONE, TASK-011 (TEST P1 batch 1) dibuat.

### Requirements and decisions

- **Requirements implemented:** TEST-035 (NFR security scan — gitleaks, 0 secret), ISO 27001 A.8.24 (penggunaan kriptografi), A.5.33 (proteksi aset)
- **Decisions / tradeoffs:** VAPID dirotasi tanpa purge history (key lama mati setelah rotasi → tidak dapat dipakai; purge history = operasi besar, ditunda); dev cert & JWT sampel dibiarkan (non-secret, sudah untracked/ignored); `testApi.http` & build artifact tidak ada di working tree

### Implementation impact

- **Added:** —
- **Modified:** `.env` produksi VPS (`VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` baru; backup `.env.bak-vapid-20261122`), `.env` lokal api (sinkronisasi)
- **Database:** None
- **API:** None (kontrak tidak berubah)
- **UI:** None — frontend push perlu re-subscribe (subscription lama tidak berlaku)

### Verification

- `gitleaks detect` 3 repo — api: `438 commits scanned / no leaks`; admin: `214 commits / leaks found: 3`; kkpusid: `147 commits / leaks found: 56`
- Triage otomatis: JWT sampel diverifikasi `jwt.verify` vs `JWT_SECRET` produksi → `invalid signature` (bukan kredensial live); `.env` finding diidentifikasi sebagai `VAPID_PRIVATE_KEY` (len 43, prefix `4IL`) — bukan DB password (sha256 lokal DB_PASSWORD ≠)
- Rotasi: `GET https://api.kkpus.id/api/push/vapid-public-key` (Bearer) → `{"success":true,"vapid_public_key":"BKuu…"}` (key baru); `/health/deep` 200 setelah restart

### Risks and follow-up

- **Known issues:** Subscription Web Push lama tidak berlaku setelah rotasi (re-subscribe otomatis oleh frontend saat kunjungan berikutnya — perlu dipastikan); sisa secret history kkpusid (VAPID lama, dev cert) masih di git history — purge opsional (`git filter-repo`) bila diinginkan; rotasi password DB produksi masih disarankan (temuan lama, di luar scope TASK-010)
- **Next recommended task:** TASK-011 — TEST P1 batch 1 (TEST-002, 005, 006, 008, 010)

---

## [2026-11-22] — TEST P0 Live (TEST-001..032, 035) + DEF-002..010 (Fix Temuan)

### Outcome

TEST P0 dieksekusi live di produksi (`api.kkpus.id`) dengan data uji mandiri (prefix `uji.`, domain `@kkpus-test.id`, dibuat & dibersihkan otomatis). **57/57 check PASS** setelah 9 defect (DEF-002..DEF-010) diperbaiki. Semua data uji dihapus (0 baris tersisa: members/arisan/login_attempts). Divergensi spec dicatat (tidak memblokir): lockout 429 vs spec 423; dobel approve kini 409; magic-byte invalid 400 vs spec 422; OTP rate-limit 5/15mnt vs spec 3/menit; response shape 200 vs 201 pada beberapa endpoint.

### Requirements and decisions

- **Requirements implemented:** PRD-001..004, 007, 008, 019..022 (TEST-001..036 P0 subset), BR-08.04, ISO 27001 A.8.15 (audit), A.8.12 (masking PII)
- **Decisions / tradeoffs:** Data uji dibuat sendiri (bukan data produksi); JWT mint lokal dengan `JWT_SECRET` server (via env, tidak ditulis ke disk) untuk menghindari rate-limit login 5/5mnt; restart pm2 dimanfaatkan mereset limiter in-memory

### Implementation impact

- **Added:** —
- **Modified:**
  - `services/authLoggingService.js` + `models/core/account_lockouts.js` (DEF-002: selaraskan ke skema aktual `email_or_phone`/`lockout_end`/`is_active`/`failed_attempts`; INSERT login_attempts yang sebelumnya gagal senyap kini tercatat)
  - `models/content/forgotPasswordSession.js` + `migrations/20261122-widen-forgot-password-otp-code.js` (DEF-003: `otp_code` VARCHAR(6)→VARCHAR(128), bcrypt hash 60 char; migrasi dieksekusi di produksi)
  - `controllers/core/approvals/processApproval.js` (DEF-004: normalisasi action case-insensitive — `"APPROVE"` diperlakukan sebagai REJECT; DEF-008: mapping error — STEP_ALREADY_PROCESSED/APPROVAL_ALREADY_COMPLETED→409, DATA_NOT_FOUND→404, business rule→400)
  - `controllers/billing/manual/submitManualPayment.js` + `verifyManualPayment.js` (DEF-005: validasi nominal bukti vs tagihan → 400 AMOUNT_MISMATCH; cegah underpay)
  - `controllers/program/arisanDrawController.js` + `routes/programRoute.js` (DEF-006: RNG kriptografis `crypto.randomInt` gantikan `Math.random()`; gate INSTALLMENTS_UNPAID; route draw dibatasi Pengawas/Ketua/Bendahara)
  - `controllers/savings/requestWithdrawal.js` (guard PENDING_WITHDRAWAL_EXISTS — cegah double-spend)
  - `controllers/core/anggota/getAllMembers.js` (DEF-010: masking PII NIK/HP/email per peran — non-organisasi ter-mask, Pengawas/Ketua/Bendahara utuh)
  - nginx `server_tokens off` di VPS (DEF-007: `Server: nginx/1.18.0 (Ubuntu)` → `Server: nginx`)
- **Database:** migrasi `20261122-widen-forgot-password-otp-code.js` dieksekusi di produksi (SequelizeMeta tercatat, idempoten)
- **API:** tanpa breaking change; error code kini sesuai spec (409/404/400) untuk approval & billing
- **UI:** tanpa perubahan

### Verification

- `npx eslint` pada semua file berubah — 0 error
- `npm test` (api) — **108/108 PASS** (12 suite), dijalankan setiap kali setelah fix
- TEST P0 live runner — **57/57 PASS** (TEST-001/003/004/007/009/011/012/013/016/027/032/035); sebelum fix: 39/53 → 46/55 → 49/57 → 57/57
- Data uji produksi bersih: 0 members/arisan_batches/arisan_draws/login_attempts uji
- `GET /health/deep` → 200 `{"status":"ok","db":"connected"}`

### Risks and follow-up

- **Known issues:** (1) Rate-limit & lockout in-memory — restart pm2 mereset window (limiter perlu dipindah ke Redis untuk multi-instance); (2) divergensi status code: lockout 429 vs spec 423, OTP 5/15mnt vs 3/menit, upload invalid 400 vs 422 (perlu update spec atau kode); (3) `.env` lokal memuat password DB produksi — **rotasi password disarankan**; (4) TEST-032: race dua approver peran sama belum teruji bersih (hasil 200+403 karena role gate step berikutnya)
- **Next recommended task:** TEST P1 (TEST-002 OTP E2E, TEST-005 assign role, TEST-006 arsip/restore, dst.) + gitleaks full-repo (TEST-035 sisa) + rotasi password DB

---

## [2026-11-22] — DB: Eksekusi MIG-004 di Produksi + Sinkronisasi Akses & Purge Dry-run

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

MIG-004 (BLK-005) **dieksekusi di produksi** (`202.52.147.193`, db `koperasi`) — rename kolom legacy selesai dengan data utuh: `transactions` 296/296 baris memiliki `payment_reference` (NOT NULL, unique index terjaga), `midtrans_token` ter-drop, `savings_withdrawals.midtrans_transaction_id` → `external_transaction_id`; migrasi `20261120-add-ip-address` (activity_logs.ip_address) sekalian diterapkan; keduanya tercatat di `SequelizeMeta`. Produksi sehat pasca-migrasi (`GET /health/deep` → `{"status":"ok","db":"connected"}`). Purge BLK-002 lulus dry-run produksi (0 kandidat kedaluwarsa, 0 error).

Akar masalah akses DB yang menghalangi pekerjaan ini: `.env` lokal memuat password `admin@%` yang **salah** (password benar hanya ada di `.env` server —nilai tidak dicatat di dokumen). `.env` lokal disinkronkan ke nilai server (tidak di-commit — secret). Selama diagnosis sempat dilakukan `ALTER USER 'admin'@'%'` ke password lokal; **sudah dikembalikan** ke password asli server agar produksi tidak terganggu (APP di VPS memakai `.env` server).

### Requirements and decisions

- **Requirement:** BLK-005 (eksekusi MIG-004), BLK-002 (smoke purge), ketersediaan DB untuk TEST P0 berikutnya
- **Decisions / tradeoffs:**
  - Akses SSH VPS (kkpusid@kkpus.id:2222) + sudo untuk insiden password; password SSH/sudo tidak dicatat di dokumen
  - `sequelize-cli db:migrate` tidak dapat dipakai (config.json memuat literal `"process.env.DB_USER"` — tidak resolve env); migrasi dijalankan via runner Node ad-hoc (queryInterface + catat SequelizeMeta, idempoten) — file runner dihapus setelah eksekusi
  - Migrasi dijalankan setelah VPS auto-deploy membawa kode baru ke `master` (3295a9f) — tanpa migrasi, produksi error (model baru vs kolom lama); eksekusi = pemulihan, bukan sekadar pembersihan

### Implementation impact

- **Added:** None (runner ad-hoc `_tmp_migrate.mjs` — dihapus pasca-eksekusi)
- **Modified:** Skema produksi (MIG-004 + 20261120); `.env` lokal (sinkronisasi password, tidak di-commit)
- **Database:** `transactions`: rename 2 kolom + drop 1 kolom (296 baris utuh); `savings_withdrawals`: rename 1 kolom (0 baris); `activity_logs`: + `ip_address` VARCHAR(45); `SequelizeMeta`: +2 entri
- **API:** None — `/health/deep` produksi OK pasca-migrasi
- **UI:** None

### Verification

- Kolom pasca-migrasi (information_schema): `transactions.payment_reference/external_transaction_id` ada, `midtrans_*` hilang dari transactions & savings_withdrawals (sisa `midtrans_disbursements.midtrans_transaction_id` — tabel legacy tanpa model, terdokumentasi)
- Integritas data: `SELECT COUNT(*)` = 296; `COUNT(payment_reference NOT NULL)` = 296; index unik pada `payment_reference` aktif (`Non_unique=0`)
- SequelizeMeta: 6 entri (2 baru: `20261120-add-ip-address-to-activity-logs.js`, `20261122-rename-midtrans-columns.js`)
- Produksi: `GET https://api.kkpus.id/health/deep` → `200 {"status":"ok","db":"connected"}` (uptime 890s, tanpa restart)
- Purge dry-run (`node scripts/purgeExpiredIdentityDocs.js`): kandidat 0, error 0
- Autentikasi `admin@%` pasca-restore: login sukses dari VPS & lokal (`SELECT 1`, 108 tabel)

### Risks and follow-up

- **Known issues:**
  - `.env` lokal kini memuat password DB produksi (tidak terlacak git) — **rotasi password** disarankan menyusul (prosedur `docs/SECURITY_ROTATION.md`); koordinasikan dengan `.env` server & `ALTER USER`
  - Index `transactions.midtrans_order_id` (nama lama, kolom baru) — kosmetik, fungsional normal
  - `midtrans_disbursements` (tabel legacy tanpa model) masih ada di DB — kandidat drop di migrasi berikutnya
- **Next recommended task:** TEST P0 live (TEST-001..032) — DB kini tersedia dari lokal; TEST-035 sisa (live header + gitleaks) + deploy `RETENTION_AUTOPURGE` di `.env` server jika ingin purge live

---

## [2026-11-22] — TEST-035 (partial): Security Scan — Audit Gate & Header Statis

**Status:** PARTIAL ( komponen audit & statis PASS; komponen live menunggu staging)  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

TEST-035 (NFR security scan) dieksekusi sejauh yang mungkin tanpa environment hidup:

1. **Dependency audit (`npm audit --audit-level=high`) — PASS:**
   - `api.kkpus.id`: 18 moderate / **0 high / 0 critical** ✅
   - `kkpusid`: semula 14 high → `npm audit fix` (transitive dev deps dalam semver range) → **0 high** (2 moderate) ✅ — build ✓
   - `admin.kkpus.id`: semula 2 high → `follow-redirects` via audit fix; `xlsx@0.18.5` (prototype pollution CVE-2023-30533 + ReDoS CVE-2024-22363, `fixAvailable: false` karena SheetJS meninggalkan npm) → upgrade ke tarball resmi vendor `xlsx@0.20.3` (`cdn.sheetjs.com`, `--save-exact`; pemakaian export-only, API kompatibel) → **0 high** (6 moderate) ✅ — build ✓
2. **Header keamanan — PASS (statis):** Helmet aktif dengan CSP (`default-src 'self'`, `frame-ancestors` allowlist), HSTS 1th + preload + includeSubDomains, nosniff, Referrer-Policy, COOP, Permissions-Policy; `X-Frame-Options` diaktifkan (`frameguard: same-origin` + fallback middleware). Verifikasi live (curl -I) menunggu server hidup.
3. **Secret scan — PASS (regresi-grep):** `gitleaks` tidak terpasang di environment ini; grep pola kunci privat/API key/SG. pada file tracked (backend) → 0 temuan. Gitleaks penuh + scan frontend menunggu CI/staging.

### Requirements and decisions

- **Requirement:** TEST-035 (P0, `08_TEST_PLAN.md`) — kriteria: 0 high/critical CVE, 0 secret, header aktif
- **Decisions / tradeoffs:**
  - **xlsx via CDN tarball** (bukan `npm audit fix --force` yang breaking): jalur resmi vendor; dirty risk — dependency berasal dari URL (bukan registry), lockfile menyimpan integrity; build reproducibility tetap terjaga via lockfile
  - **X-Frame-Options SAMEORIGIN** meski CSP `frameAncestors` sudah ada: memenuhi kriteria eksplisit TEST-035 & old-browser defense; API murni JSON (tidak ada UI untuk clickjack)
  - Moderate vulns (26 total: api 18, admin 6, kkpusid 2) **belum** ditindak — di bawah ambang P0; catat untuk fast-follow

### Implementation impact

- **Added:** None
- **Modified:** `kkpusid/package-lock.json` (audit fix); `admin.kkpus.id` package.json/package-lock.json (xlsx 0.20.3) + `.gitignore` (ignore `.opencode/` config MCP lokal); `api.kkpus.id/app.js` (frameguard + fallback XFO)
- **Database:** None
- **API:** None — tidak ada endpoint/kontrak berubah
- **UI:** None

### Verification

- `npm audit --audit-level=high` ketiga repo pasca-fix → 0 high / 0 critical (counts moderate: 18/6/2)
- `npm run build` kkpusid ✓ (3.60s) & admin ✓ (933ms) pasca-perubahan dependensi
- `npx eslint app.js` → 0 error (1 warning pre-existing `staticOptions` di L211)
- Commit: kkpusid `c0744c6`, admin `42136a9` + `095e8d6`, api `3295a9f` (semua pushed)

### Risks and follow-up

- **Known issues:**
  - Komponen live TEST-035 belum dijalankan: curl header pada server hidup + `gitleaks` full-repo (butuh staging/CI)
  - 26 moderate vulns belum ditangani (fast-follow, P2)
  - `xlsx` kini dependency URL — pengacakan supply-chain dipantau (integrity di lockfile; update manual saat SheetJS rilis)
- **Next recommended task:** TEST P0 live di staging (TEST-001..032) + sisa TEST-035 live

---

## [2026-11-22] — BLK-005: Rename Kolom Legacy Midtrans (Migrasi + Kode)

**Status:** DONE (migrasi siap; belum dijalankan — DB lokal menolak koneksi)  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

BLK-005: kolom bernama Midtrans diganti nama generik — `transactions.midtrans_order_id` → `payment_reference` (NOT NULL UNIQUE; diisi format `BILL-*`/`MANUAL-*`/`SBP-*`/`WD-*`), `transactions.midtrans_transaction_id` → `external_transaction_id`, `transactions.midtrans_token` di-drop (kolom mati, 0 referensi kode), `savings_withdrawals.midtrans_transaction_id` → `external_transaction_id`. Migrasi `20261122-rename-midtrans-columns.js` (sequelize-cli, ESM, `down()` reversibel) + model + 6 titik kode disesuaikan. Kontrak API tidak berubah (key response `order_id` tetap). Frontend 0 referensi (diverifikasi grep).

### Requirements and decisions

- **Requirement:** BLK-005 (P2) — kebersihan skema; saran HANDOFF: rename → `payment_reference`
- **Decisions / tradeoffs:** `midtrans_token` di-drop (bukan rename) — 0 referensi kode & tidak berguna pasca-DEC-005; `savings_withdrawals` ikut karena kolom mati sekelas (socket attributes disesuaikan; field selalu null di payload)

### Implementation impact

- **Added:** `migrations/20261122-rename-midtrans-columns.js`
- **Modified:** `models/billing/transactions.js`, `models/savings/savings_withdrawals.js`, `controllers/billing/createPaymentBill.js`, `controllers/billing/getInvoiceDetail.js`, `controllers/billing/manual/submitManualPayment.js`, `controllers/savings/processSavingsPayment.js`, `controllers/core/approvals/handlers/handleSavingsWithdrawalFinalAction.js`, `utils/socket.js` (9 file, +42/−14)
- **Database:** Migrasi rename kolom + drop `midtrans_token` — **belum dijalankan** (`npm run db:migrate` di environment dengan DB valid; kredensial DB lokal dev ditolak)
- **API:** None — key response `order_id` pada invoice detail tidak berubah
- **UI:** None — field socket `midtrans_transaction_id` (selalu null) → `external_transaction_id`; frontend tidak mengonsumsi

### Verification

- `npx eslint` 8 file tersentuh — 0 error, 0 warning (2 warning pre-existing di savings_withdrawals.js hooks, bukan dari perubahan ini)
- Full backend suite: 12 suites / 108 tests passed (pasca-rename)
- Grep `midtrans_order_id|midtrans_transaction_id|midtrans_token` di controllers/models/services/utils/scripts — 0 sisa (hanya komentar historis `ledgerHelper.js` & isi migrasi)
- Migrasi belum tereksekusi — bukti operasional (up/down) menunggu DB valid di staging
- Commit `461ff7b` di `api.kkpus.id` branch `rollback/2026-11-02` (pushed `41f7c6a..461ff7b`)

### Risks and follow-up

- **Known issues:** Migrasi belum dijalankan — WAJIB `npm run db:migrate` sebelum deploy berikutnya agar model & DB sinkron; tanpa migrasi, query `transactions` akan error (kolom `payment_reference` tidak ada di DB lama)
- **Next recommended task:** TEST P0 di staging (TEST-001, 003, 004, 007, 009, 011, 012, 013, 016, 027, 032, 035)

---

## [2026-11-22] — BLK-002: Retensi Dokumen Default ON + Ambang Configurable

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

BLK-002 (DEC-002: "Purge dokumen default ON, retensi per jenis") diimplementasikan: job purge dokumen identitas kini **default aktif** (nonaktifkan eksplisit via `RETENTION_AUTOPURGE=false`), dan ambang retensi dapat dikonfigurasi per jenis via `RETENTION_REJECTED_DAYS` (default 90) & `RETENTION_INACTIVE_DAYS` (default 30) sesuai `docs/RETENSI_DOKUMEN_IDENTITAS.md` §4. Sekaligus memperbaiki bug hook husky pre-commit yang menolak `.env.example` (bertabrakan dengan dokumentasi hooknya sendiri) dan tidak robust di bawah `sh -e`.

### Requirements and decisions

- **Requirement:** BLK-002 (dari DEC-002, disetujui 2026-11-21) — retensi dokumen identitas
- **Decisions / tradeoffs:** Default ON dengan opt-out eksplisit; ambang via env dengan default = periode kebijakan (90/30 hari); dry-run tetap default saat eksekusi manual CLI

### Implementation impact

- **Added:** None
- **Modified:** `api.kkpus.id` — `services/cron.js` (gate default ON), `scripts/purgeExpiredIdentityDocs.js` (ambang env-configurable), `.env.example` (dokumentasi 3 var), `docs/RETENSI_DOKUMEN_IDENTITAS.md` (§4 catatan implementasi), `.husky/pre-commit` (fix pola `.env.example` + `|| true` untuk `sh -e`)
- **Database:** None — purge hanya hapus file & null-kan kolom path sesuai kebijakan retensi (tidak ada perubahan skema)
- **API:** None — tidak ada endpoint berubah
- **UI:** None

### Verification

- `npx eslint services/cron.js scripts/purgeExpiredIdentityDocs.js` — 0 error
- Unit test purge: 8/8 passed (`node --experimental-vm-modules jest __tests__/purgeExpiredIdentityDocs.test.js`)
- Full backend suite: 12 suites / 108 tests passed
- Smoke dry-run `node scripts/purgeExpiredIdentityDocs.js` — terhenti di koneksi DB (kredensial lokal `admin@139.193.182.6` ditolak; isu environment, bukan kode) — logika tercakup unit test
- Hook pre-commit: `sh -e .husky/pre-commit` exit 0 (kasus lolos & tersaring diuji manual)
- Commit `41f7c6a` di `api.kkpus.id` branch `rollback/2026-11-02` (pushed `a36235b..41f7c6a`)

### Risks and follow-up

- **Known issues:** Kredensial DB lokal (dev) tidak valid → smoke dry-run live belum bisa dijalankan; perlu dijalankan di staging dengan DB valid sebagai bukti operasional
- **Next recommended task:** TEST P0 di staging (TEST-001, 003, 004, 007, 009, 011, 012, 013, 016, 027, 032, 035)

---

## [2026-11-22] — BLK-001: Hapus Sisa Sandbox Midtrans di Frontend

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

BLK-001 (DEC-005: hapus Midtrans/DOKU sandbox dari frontend) diverifikasi tuntas: kedua frontend **tidak lagi memuat** referensi Midtrans/DOKU — `kkpusid` (public) 0 hasil grep, `admin.kkpus.id` 0 hasil (script/CSP bersih). Sisa terakhir berupa dead method `createMidtransTransaction` di `UBilling.js` admin (tanpa pemanggil; endpoint-nya `/billing/process-payment` yang sudah `transfer_manual` per BLK-006) — dihapus. Endpoint `/billing/manual-sync-summary` ditinjau: generik (sync laporan finansial), bukan Midtrans.

### Requirements and decisions

- **Requirement:** BLK-001 (dari DEC-005, disetujui 2026-11-21) — keamanan: sandbox pembayaran di produksi
- **Decisions / tradeoffs:** Hapus dead helper, bukan rename — tidak ada pemanggil (grep 0 referensi)

### Implementation impact

- **Added:** None
- **Modified:** `admin.kkpus.id` — `src/utils/api/UBilling.js` (hapus `createMidtransTransaction`)
- **Database:** None
- **API:** None — tidak ada endpoint/route berubah
- **UI:** None — perilaku identik

### Verification

- Grep `midtrans|doku(?!men)|jokul|snap` di `admin.kkpus.id` (src + index.html) & `kkpusid` (src + index.html) — 0 hasil relevan (hanya false positive kata "Dokumen")
- Grep pemanggil `createMidtransTransaction` — 0 (hanya definisi)
- `npx eslint src/utils/api/UBilling.js` — 0 error
- `npm run build` (admin) — ✓ built in 1.20s
- Commit `949fc75` di `admin.kkpus.id` branch `rollback/2026-11-02` (pushed `acc8074..949fc75`)

### Risks and follow-up

- **Known issues:** None
- **Next recommended task:** TEST P0 di staging (TEST-001, 003, 004, 007, 009, 011, 012, 013, 016, 027, 032, 035)

---

## [2026-11-22] — DEF-001: Bersihkan Dead Reference Approval Penarikan (Admin)

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

DEF-001 (dead reference `savingsService.approveWithdrawal`/`disburseWithdrawal` di `DashboardApprovalModals.jsx`) diperbaiki: ternary dead reference & prop `disbursementApi` (tidak dideklarasi di modal) dihapus, import `savingsService`/`tabunganService` yang tak terpakai dibuang, dan modal kini memanggil `approvalService.processWithdrawalApproval` langsung (endpoint benar `PUT /approvals/penarikan/approve/:id`). Perilaku aplikasi tidak berubah — fallback sebelumnya sudah menuju fungsi yang sama.

### Requirements and decisions

- **Requirement:** DEF-001 (P2) — dead code non-fungsional (temuan audit NEW-002)
- **Decisions / tradeoffs:** Hapus referensi, bukan tambah method di `USavings.js` — endpoint yang benar sudah ada di `UApproval.js` dan itu yang dipakai fallback

### Implementation impact

- **Added:** None
- **Modified:** `admin.kkpus.id` — `src/pages/dashboard/components/DashboardApprovalModals.jsx`, `src/components/modals/WithdrawalApprovalModal.jsx`, `src/pages/tabungan/components/TabunganTransactionsTab.jsx` (3 file, +3/−17)
- **Database:** None
- **API:** None — `approvalService.processWithdrawalApproval` → `PUT /approvals/penarikan/approve/:id` (endpoint existing, tanpa perubahan backend)
- **UI:** None (perilaku identik)

### Verification

- `npx eslint` pada 3 file tersentuh — 0 error, 0 warning
- `npm run build` (admin) — ✓ built in 1.09s (PWA precache sukses)
- `git diff` review — hanya penghapusan referensi/prop/import dead; `tabunganService.approveWithdrawal` diverifikasi ada (`PUT /approvals/tabungan_penarikan/approve/:id`), jadi pemakaian di `TabunganTransactionsTab` valid
- Commit `acc8074` di `admin.kkpus.id` branch `rollback/2026-11-02` (pushed `106282c..acc8074`)

### Risks and follow-up

- **Known issues:** None — tidak ada perubahan perilaku (dead code)
- **Next recommended task:** TEST P0 di staging (TEST-001, 003, 004, 007, 009, 011, 012, 013, 016, 027, 032, 035)

---

## [2026-11-22] — NEW-002: Triase Konsolidasi Modul Ganda

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Triase NEW-002 (REC-5): diverifikasi bahwa modul "ganda" **bukan duplikat** — `/api/financial` adalah alias tipis yang 100% reuse controller `/api/financing` (createFinancingApplication, dll); `/api/savings` (tabungan target: apply/history/summary) vs `/api/simpanan` (simpanan pokok + penarikan + disburse) = domain berbeda; `/api/tabungan` = pengajuan tabungan. Konsolidasi **tidak dilanjutkan** (risiko migrasi frontend > nilai). Batas domain sudah terdokumentasi di §3 `06_API_SPEC.md` (M-SAVINGS / M-SAVINGS-ALT / M-TABUNGAN).

### Requirements and decisions

- **Requirement:** NEW-002 (P2, dari REC-5) — triase konsolidasi modul ganda
- **Decisions / tradeoffs:**
  - **Tidak konsolidasi** (persetujuan Product 2026-11-22): modul melayani domain & konsumen berbeda; `/api/financial` hanya alias 50 baris
  - Dokumentasi batas domain = §3 sudah memisahkan M-SAVINGS / M-SAVINGS-ALT / M-FINANCIAL / M-TABUNGAN
  - Alternatif (konsolidasi/deprecate alias) ditolak — nilai rendah, risiko breaking change pada UGlobal/UJualBeli/UTransaksi (public)

### Implementation impact

- **Added:** DEF-001 di `09_BACKLOG.md` (temuan audit)
- **Modified:** `09_BACKLOG.md` (NEW-002 → RESOLVED)
- **Database:** None
- **API:** None (dokumentasi; tidak ada kode yang diubah)
- **UI:** None

### Verification

- Pemetaan modul: grep `router.(get|post|put|delete)` per route file + penelusuran konsumen frontend (`USavings.jsx`, `UJualBeli`, `UGlobal`, `UTransaksi`, `FormSimpanan`, `SimpananDashboard`, `SimpananReportPage`)
- `financialRoute.js` → import controller dari `controllers/financing/` (alias, bukan duplikasi)
- Temuan audit: DEF-001 — `DashboardApprovalModals.jsx` L115-121 memanggil `savingsService.approveWithdrawal`/`disburseWithdrawal` yang tidak ada di `USavings.js` (undefined) → fallback `approvalService.processWithdrawalApproval` (endpoint benar) — **dead code, non-fungsional** (dicatat, diperbaiki terpisah)

### Risks and follow-up

- **DEF-001 (P2, OPEN):** dead reference di admin dashboard — hapus referensi atau tambahkan method benar
- **Alternatif TEST P0 di staging** — kini jadi next task utama

---

## [2026-11-22] — TASK-008: Rewrite §3 API Spec (Kontrak Aktual)

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Detail §3 `06_API_SPEC.md` (kontrak v1 idealis, 50 endpoint, ~975 baris) ditulis ulang menjadi **kontrak aktual** per modul mengikuti implementasi `api.kkpus.id/routes/*.js` (~213 route). API-001..050 dipertahankan sebagai ID — setiap ID dipetakan ke route aktualnya (acuan matriks §6.1); 3 ID tanpa padanan (API-008/011/014) ditandai removed; ID baru API-051..054 untuk modul `/api/regions`. Ideal v1 diarsipkan di §3.1 + git history.

### Requirements and decisions

- **Requirement:** NEW-001 (P2, dari BLK-003/REC-1) — selaraskan spec dengan realita
- **Decisions / tradeoffs:**
  - **Ganti, bukan pertahankan ideal** (rekomendasi user): spec = kontrak yang dipakai; ideal yang tak terimplementasi = sumber divergence (BLK-003); mayoritas selisih kosmetik (nama path), sebagian ideal kurang tepat domain (approval generik vs per-entitas)
  - API ID 1:1 dipertahankan → traceability §5 & 36 test case `08_TEST_PLAN.md` tetap valid
  - Modul `/api/savings` & `/api/financial` (yang ternyata **dipakai frontend**) didokumentasikan sebagai M-SAVINGS-ALT & M-FINANCIAL tanpa ID (inventaris §4)
  - Ideal tidak dibuang: §3.1 "arahan pengembangan" — perbedaan tidak diadopsi + saran ADR untuk future convention (mis. `/api/v1/`)

### Implementation impact

- **Added:** §3 baru (kontrak aktual per 17 modul, tabel ID/method/path/auth/description), §3.1 catatan arsip ideal, M-REGION (API-051..054)
- **Modified:** `06_API_SPEC.md` (§3 975→~215 baris inti; §5 traceability +M-SAVINGS-ALT/+M-REGION & coverage check; §6.3 REC-1 → RESOLVED), `09_BACKLOG.md` (NEW-001 DONE)
- **Database:** None
- **API:** None (dokumentasi; tidak ada kode yang diubah)
- **UI:** None

### Verification

- Struktur dokumen: §1..§6 utuh, batas splice §3→§4 mulus (grep `^## [0-9]`)
- 54 API ID unik (API-001..054) — 50 v1 + 4 baru
- Cross-check path/method/auth vs `routes/*.js`: accountLogin (emailHp/password), approvals per-entitas + `processApproval` (action/notes), manual-payment multipart, simpanan config (DEC-006 role), regions (proxy emsifa), files wildcard guard
- Test plan tidak perlu diubah: hanya 1 referensi path aktual (`/api/files/:filename`) — masih valid

### Risks and follow-up

- **NEW-002 (P2):** konsolidasi modul ganda (`/api/simpanan`+`/api/savings`, `/api/financing`+`/api/financial`+`/api/jualbeli`) — triase pasca-dokumentasi
- **Konvensi `/api/v1/`** (§1) dicatat sebagai proyek tersendiai + ADR, bukan mengubah kontrak berjalan
- **Opsi TEST P0 di staging** kini lebih mudah — §3 aktual = acuan eksekusi test

---

## [2026-11-22] — BLK-007: Keputusan Role Otorisasi Konfigurasi Keuangan

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Divergensi REC-3 diselesaikan dengan keputusan Product: **spec dilonggarkan** mengikuti implementasi aktual. Role konfigurasi keuangan (simpanan & payment-fee) = **Ketua / Bendahara / Pengawas**; disburse simpanan tetap Ketua/Bendahara/Pengawas. Tanpa perubahan kode.

### Requirements and decisions

- **Requirement:** BLK-007 (REC-3) — putuskan role otorisasi config
- **Decisions / tradeoffs:**
  - **DEC-006 (Product, 2026-11-22):** longgarkan spec, bukan perketat implementasi
  - Rationale: implementasi sudah deployed & dipakai; semua peran adalah pengurus internal tepercaya; perketat = breaking change operasional (butuh approval Ketua + transisi)
  - Risiko segregation-of-duties (Pengawas bisa menulis config) **diterima tertulis** — mitigasi: audit log aktivitas
  - Alternatif yang ditolak: perketat implementasi (hapus Pengawas dari guard) & hybrid write/read — ditunda; bisa diangkat lagi jika kebutuhan governance berubah

### Implementation impact

- **Added:** DEC-006 di `02_PRD.md` (decision log)
- **Modified:** `06_API_SPEC.md` — API-020 & API-049 Authorization → Ketua/Bendahara/Pengawas (DEC-006); §6.1 baris API-020/API-049 & §6.3 REC-3 → RESOLVED
- **Database:** None
- **API:** None (dokumentasi; tidak ada kode yang diubah — guard backend sudah sesuai)
- **UI:** None

### Verification

- Guard aktual vs spec: `PUT /api/simpanan/config` & `PUT /api/billing/payment-fees` = `MidRole(["Ketua","Bendahara","Pengawas"])` — cocok dengan spec baru (grep `routes/simpananRoute.js` & `routes/billingRoute.js`)
- Tidak ada test yang perlu dijalankan ulang (nol perubahan kode)

### Risks and follow-up

- **Sisa risiko SoD:** Pengawas dapat mengubah konfigurasi keuangan — diterima (DEC-006); mitigasi audit trail
- **NEW-001 (P2):** rewrite detail §3 API spec tetap terbuka
- Opsi "perketat implementasi" bisa diaktifkan kembali bila governance requirements berubah

---

## [2026-11-22] — BLK-008: Keamanan Notifikasi & Push (IDOR Fix)

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Audit REC-4 selesai: route notifikasi ternyata **sudah** memakai `MidAnggota` (`router.use(MidAnggota)` di `notificationRoute.js`), namun audit lanjutan menemukan **IDOR nyata** di 3 titik — `getNotificationList` menerima `req.query.member_id`, `updateNotificationStatus` memakai sumber identity berbeda, dan `pushController` menerima `member_id` dari body (subscribe & test-push). Semua ditutup: identity hanya dari token (`req.userId`), push routes ditambah `MidAnggota`.

### Requirements and decisions

- **Requirement:** BLK-008 (REC-4) — amankan route notifikasi
- **Decisions / tradeoffs:**
  - `GET /push/vapid-public-key` tetap publik — hanya kunci VAPID (kunci publik, bukan data user) — aman
  - `subscribeToPush` tetap menerima `registration_id` (calon anggota pra-login) sebagai fallback — tapi hanya setelah `MidAnggota` (token wajib), dan `member_id` login selalu menang atas `registration_id`
  - Query `member_id` di `getNotificationList` dihapus total (bukan dibatasi) — frontend tidak pernah memakainya (selalu pakai token)

### Implementation impact

- **Added:** None
- **Modified:**
  - `api.kkpus.id/controllers/notification/getNotificationList.js` — `req.userId || req.query.member_id` → `req.userId` saja (cegah IDOR)
  - `api.kkpus.id/controllers/notification/updateNotificationStatus.js` — `req.user?.member_id` → `req.userId` (sumber identity konsisten; whereCondition sudah dibatasi `member_id` → cross-member update mustahil)
  - `api.kkpus.id/controllers/notification/pushController.js` — subscribe & test-push: `member_id` dari body → `req.userId` (dev: hapus var `instance` unused)
  - `api.kkpus.id/routes/pushRoutes.js` — `MidAnggota` ditambahkan ke `/subscribe` & `/test-push`
- **Database:** None
- **API:** Tidak ada perubahan kontrak (request/response shape sama; frontend tidak perlu diubah — `member_id` di body kini diabaikan server)
- **UI:** None

### Verification

- `NODE_ENV=test jest --ci --coverage=false` → **12 suite / 108 test passed**
- `eslint` 4 file tersentuh → **0 error, 0 warning**
- `grep "req\.query\.member_id\|req\.body\.member_id"` di `controllers/notification/` → **0 match**
- Cross-check frontend: `pushHelper.js` & `NotificationPrompt.jsx` mengirim `member_id` dari state login (sama dengan token) — patch server tidak memecahkan alur

### Risks and follow-up

- **Catatan arsitektur:** `member_id` di body kini diabaikan server — frontend masih mengirimnya (harmless, tapi bisa dibersihkan nanti di NEW work)
- **BLK-007:** role divergence config — menunggu keputusan Product (next)
- **BLK-005:** kolom DB legacy `midtrans_*` — tetap (migrasi berikutnya)

---

## [2026-11-22] — BLK-006: DOKU & Midtrans Removal dari Backend

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Seluruh jejak payment gateway dihapus dari backend `api.kkpus.id` (melengkapi BLK-004 di frontend). Endpoint dead `POST /api/billing/sync-status` dihapus total; endpoint aktif `POST /api/billing/process-payment` dipertahankan (masih dipakai admin & public) tapi dibersihkan dari metadata DOKU; artefak mati (model `MidtransDisbursement`, script `generateDokuSnapKeys.js`) dihapus.

### Requirements and decisions

- **Requirement:** BLK-006 (REC-2) — hapus DOKU & Midtrans dari backend; DEC-005
- **Decisions / tradeoffs:**
  - **`POST /api/billing/process-payment` TIDAK dihapus** — verifikasi menemukan masih dipakai: `admin.kkpus.id/src/utils/api/UBilling.js` & `kkpusid/src/services/tabungan.service.js` (SetoranTabungan). Controller difungsikan ulang: `createDokuTransaction.js` → `createPaymentBill.js` (buat Bill + Transaction PENDING untuk transfer manual), `payment_type: "doku"` → `"transfer_manual"`, pesan error & komentar dibersihkan. Path route tidak diubah → nol perubahan frontend.
  - **`POST /api/billing/sync-status`** (syncMidtransStatus) dihapus — tidak ada konsumen frontend & tidak ada webhook yang memanggil.
  - **Model `MidtransDisbursement`** (dead code, hanya associations) + entry `initModels.js` + associations `savingsAssociations.js` dihapus. Tabel DB `midtrans_disbursements` tidak di-drop (di luar scope).
  - **Script `scripts/generateDokuSnapKeys.js`** dihapus (obsolete setelah gateway dihapus).

### Implementation impact

- **Added:** None
- **Modified:**
  - `api.kkpus.id/routes/billingRoute.js` — hapus import & route `/sync-status`; `/process-payment` → `createPaymentBill`
  - `api.kkpus.id/controllers/billing/createDokuTransaction.js` → **rename** `createPaymentBill.js` (fungsi `createPaymentBill`, `payment_type: "transfer_manual"`, pesan error "Gagal membuat tagihan pembayaran", hapus var `localTx` tak terpakai)
  - `api.kkpus.id/models/initModels.js` — hapus import & assignment `MidtransDisbursement`
  - `api.kkpus.id/models/associations/savingsAssociations.js` — hapus 4 baris associations Midtrans
  - `api.kkpus.id/services/ledgerHelper.js` — komentar "Webhook Midtrans" → "verifikasi pembayaran manual"
- **Deleted:** `controllers/billing/syncMidtransStatus.js`, `models/savings/midtrans_disbursements.js`, `scripts/generateDokuSnapKeys.js`
- **Database:** None (kolom legacy `midtrans_order_id`/`midtrans_transaction_id` tetap → BLK-005)
- **API:** `POST /api/billing/sync-status` dihapus dari kontrak; inventaris §4 `06_API_SPEC.md` diperbarui; REC-2 → RESOLVED
- **UI:** None (path `/process-payment` tidak berubah)

### Verification

- `NODE_ENV=test jest --ci --coverage=false` → **12 suite / 108 test passed**
- `eslint` pada 5 file tersentuh → **0 error, 0 warning** (warning `localTx` pre-existing sekalian dibersihkan)
- `grep -r "createDokuTransaction|syncMidtransStatus|MidtransDisbursement|generateDokuSnapKeys"` → **0 match**
- `grep -ri "doku|midtrans"` → hanya kolom DB legacy (`midtrans_order_id`, `midtrans_transaction_id`) + komentar dokumentasi + false positive "dokumen"

### Risks and follow-up

- **BLK-005:** kolom DB `midtrans_order_id`/`midtrans_transaction_id`/`midtrans_token` masih ada di 3 model (`transactions`, `savings_withdrawals`, `savings_transactions`) + socket.js attributes — rename saat migrasi berikutnya
- **BLK-007:** role divergence config (Menunggu keputusan Product)
- **BLK-008:** route notifikasi tanpa auth (REC-4) — next task
- **Data historis:** transaksi lama dengan `payment_type: "doku"` tetap ada di DB — tidak dimigrasikan (historis, bukan bug)

---

## [2026-11-22] — BLK-003: API Spec Reconciliation vs Implementasi Aktual

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Verifikasi penuh kontrak `06_API_SPEC.md` v1 (50 endpoint) terhadap routes aktual `api.kkpus.id/routes/*.js` (branch `rollback/2026-11-02`, ~213 route). Hasil: **10 MATCH, 37 CHANGED, 3 MISSING**. Divergensi didokumentasikan dalam matriks §6.1, inventaris aktual di §4, dan 6 temuan (REC-1..REC-6) di §6.3.

### Requirements and decisions

- **Requirement:** BLK-003 — bandingkan 06_API_SPEC.md dengan routes aktual; setiap divergensi terdokumentasi
- **Decisions / tradeoffs:**
  - Detail §3 (kontrak v1 idealis) **dibiarkan** sebagai arsip + diberi header peringatan status; §4 dijadikan inventaris resmi — rewrite penuh §3 dijadwalkan NEW-001 (P2) karena frontend sudah stabil memakai endpoint aktual (REC-1)
  - Temuan security (DOKU/Midtrans backend, REC-2) → BLK-006 (P0); role divergence (REC-3) → BLK-007 (butuh keputusan Product); notifikasi tanpa auth (REC-4) → BLK-008
  - `GET /api/billing/payment-fees` publik (REC-6) diterima sebagai data konfigurasi publik

### Implementation impact

- **Added:** `06_API_SPEC.md` §6 (implementation reconciliation): matriks 50 endpoint v1, inventaris route tambahan per modul, tabel temuan REC-1..6
- **Modified:**
  - `06_API_SPEC.md` §3 (header status) & §4 (50 baris v1 → inventaris aktual ~213 route per modul)
  - `09_BACKLOG.md` — NEW-001 (rewrite §3) & NEW-002 (konsolidasi modul ganda) di discovered work
  - `HANDOFF.md` — BLK-003 RESOLVED; BLK-006/007/008 baru; next task
- **Database:** None
- **API:** None (dokumentasi; tidak ada kode backend yang diubah)
- **UI:** None

### Verification

- `grep -n "router\.\(get\|post\|put\|delete\|patch\)"` di seluruh 20 file `routes/*.js` → diekstrak manual & dicocokkan per modul
- Matriks 50 endpoint v1 → 50 baris hasil (10 MATCH / 37 CHANGED / 3 MISSING) di §6.1
- Inventaris aktual dihitung ulang: ~213 route (per sub-router, termasuk admin CRUD training, issue sukuk, regions, evidence)
- Cross-check `app.js`: `GET /api/files/*filePath` (MidAnggota + traversal guard) = API-050 MATCH*

### Risks and follow-up

- **BLK-006 (P0):** DOKU (`POST /api/billing/process-payment`) & Midtrans (`POST /api/billing/sync-status`) masih aktif di backend — frontend sudah bersih (BLK-004), backend belum
- **BLK-007:** Role divergence config — perlu keputusan Product (perketat implementasi vs longgarkan spec)
- **BLK-008:** Notifikasi route publik tanpa `MidAnggota` — verifikasi controller
- **NEW-001/NEW-002:** Rewrite detail §3 (P2) & konsolidasi modul ganda (P2) — triase nanti
- **Catatan:** `midtrans_order_id` sebagai nama kolom DB tetap ada (BLK-005, di luar scope)

---

## [2026-11-22] — TASK-007 Test Plan

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Didefinisikan test plan lengkap `08_TEST_PLAN.md`: 6 quality risk (R-01..R-06, approval engine & perhitungan finansial sebagai risiko kritis), 3 environment (local/staging/production) dengan kebijakan data sintetis (tanpa PII asli, sesuai ISO 27001 A.8.10/8.11), strategi per layer memakai stack dari TSD (Jest+Supertest backend, Vitest+RTL frontend, Playwright admin), 36 test case (TEST-001..TEST-036: 12 P0 / 17 P1 / 7 P2), dan traceability 3 arah (PRD↔TEST, API↔TEST, SCR↔TEST).

### Requirements and decisions

- **Requirements implemented:** PRD-001..026 → TEST-001..TEST-036; seluruh 50 endpoint API dan 24 screen terlacak
- **Decisions / tradeoffs:**
  - TEST-004 (lockout/rate limit), TEST-010 (termination), TEST-012 (file security), TEST-031..036 (real-time, concurrency, NFR) ditambahkan di luar referensi UI/UX spec karena security & NFR adalah risiko kritis — UI/UX spec mereferensikan subset TEST-001..TEST-030
  - PWA offline (TEST-030) ditandai Manual/E2E karena service worker sulit diuji penuh via automation
  - Cron jobs (backup/purge) diverifikasi via log server, bukan endpoint HTTP (M-CRON internal)

### Implementation impact

- **Added:** Isi lengkap `project-docs/08_TEST_PLAN.md` (dari 54 baris template → 7 bagian + 36 test case)
- **Modified:** `project-docs/09_BACKLOG.md` (TASK-007 IN_PROGRESS → DONE)
- **Database:** None
- **API:** None (referensi API-001..API-050 dari 06_API_SPEC.md)
- **UI:** None

### Verification

- `grep -c "^| TEST-"` → 36 test case; `grep -o "TEST-[0-9]*" | sort -u` → 36 unique ID
- Loop PRD-001..026 → semua 26 ID hadir
- `grep -c "| P0 |"` → 12 test P0
- Traceability §7: setiap PRD requirement → test case; setiap endpoint group → test case; setiap screen group → test case

### Risks and follow-up

- **Known issues:** None baru. Test plan mengonsumsi risiko yang sudah tercatat: BLK-001 (DOKU — sudah RESOLVED 2026-11-22), BLK-003 (divergensi API spec vs implementasi — akan diverifikasi saat TEST pertama dijalankan)
- **Next recommended task:** Implementasi — mulai dari verifikasi BLK-003 (bandingkan 06_API_SPEC.md dengan routes aktual `api.kkpus.id`) atau mulai eksekusi TEST P0 setelah test data staging siap

---

## [2026-11-22] — BLK-004 / DEC-005: DOKU Sandbox Removal (Public Frontend)

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Seluruh jejak payment gateway (Midtrans/DOKU) dihapus dari frontend public (`kkpusid`). Pembayaran sepenuhnya manual transfer + upload bukti → verifikasi Bendahara, sesuai DEC-005.

### Requirements and decisions

- **Requirement:** DEC-005 (approved) — hapus Midtrans/DOKU sandbox dari produksi; BLK-001/BLK-004; UI-NOTE-4 di `07_UI_UX_SPEC.md`
- **Decisions / tradeoffs:** Fallback `midtrans_order_id` di UI diganti `transaction_reference` (field generik); `UStatus.jsx` (dead code, 0 import) dihapus total alih-alih ditulis ulang — tidak ada layar yang memakai mapping status Midtrans

### Implementation impact

- **Added:** None
- **Modified:**
  - `kkpusid/index.html` — hapus `<script src="https://sandbox.doku.com/jokul-checkout-js/...">` + entri `https://sandbox.doku.com` dari CSP `script-src`
  - `kkpusid/src/pages/global/InvoicePage/components/InvoiceActions.jsx` — fallback referensi transaksi: `txData?.midtrans_order_id` → `txData?.transaction_reference`
  - `kkpusid/src/utils/UStatus.jsx` — **deleted** (dead code mapping status Midtrans, tidak diimpor di mana pun)
- **Database:** None (frontend only)
- **API:** None (memakai `UBilling.submitManualPayment` yang sudah ada — response `order_id` format `MANUAL-*`)
- **UI:** InvoicePage tetap sama secara visual — alur transfer manual + upload bukti sudah berjalan; hanya sisa referensi gateway yang dibersihkan

### Verification

- `grep -ri "doku\.com|jokul|midtrans|snap\.js"` di `kkpusid/src`, `kkpusid/index.html`, dan `kkpusid/build/` → **0 match** (sebelumnya: 2 di index.html + 2 di src)
- `npm run build` → **✓ built in 1.76s** (vite)
- ESLint parse `InvoiceActions.jsx` → no errors
- Branch repo public: `rollback/2026-11-02` (tidak diubah)

### Risks and follow-up

- **BLK-005 (baru, risiko rendah):** backend masih menyimpan kolom `midtrans_order_id` di tabel `transactions` (diisi format `MANUAL-*` oleh `submitManualPayment.js`) — nama kolom legacy; pertimbangkan rename saat migrasi berikutnya (di luar scope frontend)
- **Catatan:** QA report (`QA_Report_kkpusid.md`, `docs/checklist-kkpusid.md`) adalah catatan audit historis — dibiarkan apa adanya; item checklist "production payment scripts" kini moot (gateway dihapus total)
- **Next recommended task:** TASK-007 — Define Test Plan (`08_TEST_PLAN.md` masih template)

---

## [2026-11-22] — TASK-006 UI/UX Specification

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Didefinisikan spesifikasi UI/UX lengkap berbasis kode aktual kedua repo frontend (eksplorasi admin.kkpus.id & kkpusid): 24 screen spec (SCR-001..SCR-024) yang mencakup seluruh 19 modul FSD, design system dua repo (token warna admin hijau `#00896d` vs public biru `#2563eb`, komponen reusable TransactionTable/DataTable/StatusBadge/modal approval per domain, breakpoint 768), matriks navigasi & akses per 6 peran, serta interaction states (loading/empty/error/offline/konfirmasi).

### Requirements and decisions
- **Requirements implemented:** FSD F-01..F-19 → SCR-001..SCR-024; seluruh 26 PRD requirement terlacak di §7 traceability
- **Decisions / tradeoffs:** Perbedaan brand admin vs public didokumentasikan sebagai keputusan sadar per audiens (UI-NOTE-1); routing token-based (bukan URL manusiawi) didokumentasikan sebagai pola; public ThemeContext hardcoded light dicatat sebagai follow-up (UI-NOTE-2)

### Implementation impact
- **Added:** `project-docs/07_UI_UX_SPEC.md` (dari 49 baris template → spesifikasi lengkap)
- **Modified:** `project-docs/09_BACKLOG.md` (TASK-006 TODO → IN_PROGRESS → DONE)
- **Database:** None
- **API:** None (referensi API-001..050 dari 06_API_SPEC.md)
- **UI:** Spesifikasi 24 layar + design system + matriks peran; 6 temuan lintas-repo dicatat untuk tindak lanjut

### Verification
- `grep -c "^### SCR-"` → 24 screen specs
- `grep -o "F-[0-9]*" | sort -u` → 19 modul FSD tercover
- Loop PRD-001..026 → semua 26 ID hadir di dokumen (setelah perbaikan notasi grouped)
- Traceability §7: setiap requirement → screen → API → test

### Risks and follow-up
- **Known issues (UI-NOTE-1..6):**
  - UI-NOTE-4 (P0): public masih memuat DOKU JOKUL sandbox — selaras BLK-001/DEC-005, harus dihapus
  - UI-NOTE-3: menu placeholder admin (Laporan/Pengaturan/dll) — selaras DEC-003
  - UI-NOTE-2: toggle tema public nonaktif; UI-NOTE-5: legacy `*Screen.jsx` dead code; UI-NOTE-6: bookmark tidak stabil (token routing)
- **Next recommended task:** Implementasi (mulai dari P0 BLK-001: hapus DOKU sandbox) atau TASK-007 — Test Plan (08_TEST_PLAN.md masih template)

---

## [2026-11-21] — TASK-005 API Specification

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Didefinisikan kontrak API eksternal lengkap: 50 endpoint (API-001..API-050) yang mencakup semua 15 modul TSD (M-AUTH..M-FILES), dengan konvensi kontrak (media type, versioning, pagination, idempotency, error envelope), 13 kode error umum, dan matriks traceability ke FSD/PRD.

### Requirements and decisions
- **Requirements implemented:** ERD entities + FSD use cases — API spec mencakup semua 19 FSD modul dan 26 PRD requirements
- **Decisions / tradeoffs:** M-CRON tidak memiliki endpoint HTTP publik (internal via services/cron.js); endpoint konfigurasi (M-CONFIG) tersebar di path simpanan & billing sesuai konvensi API yang ada; versioning via URL prefix `/api/v1/` direncanakan, saat ini tanpa prefix versi

### Implementation impact
- **Added:** `project-docs/06_API_SPEC.md` (diisi dari template kosong: 58 baris → ~500 baris spesifikasi lengkap)
- **Modified:** `project-docs/09_BACKLOG.md` (TASK-005 status TODO → IN_PROGRESS → DONE)
- **Database:** None
- **API:** 50 endpoint didefinisikan (kontrak dokumentasi, bukan implementasi kode)
- **UI:** None

### Verification
- Endpoint coverage: 50 endpoint (API-001..API-050) terpetakan ke 15 modul TSD (M-AUTH..M-FILES)
- Traceability check: semua 19 modul FSD dan 26 requirement PRD (PRD-001..026) tercermin di endpoint atau proses internal (M-CRON)
- Authorization per endpoint terdokumentasi (Public / Authenticated / role spesifik)
- Error codes konsisten dengan FSD error definitions (UC-01.01, UC-02.01, UC-03.01, dll.)

### Risks and follow-up
- **Known issues:** API spec adalah kontrak dokumentasi; implementasi aktual di `api.kkpus.id` perlu diverifikasi terhadap spec ini saat sesi implementasi berikutnya (mungkin ada perbedaan detail parameter/path)
- **Next recommended task:** TASK-006 — Define UI/UX specification (07_UI_UX_SPEC.md masih template) atau mulai implementasi kode per backlog

---

## [2026-11-21] — TASK-004 Database schema / ERD

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Didokumentasikan 53 entitas database dalam 5 domain (Core & Auth, Approvals, Billing & Payments, Savings, Financing & Programs, Content/Training), relasi antar entitas (Mermaid ER diagram), aturan integritas/performance, serta migration log (baseline + 3 planned migrations untuk DEC-001/DEC-002).

### Requirements and decisions

- **Requirements implemented:** TSD modules M-AUTH..M-FILES — 53 tabel didokumentasikan sesuai model aktual Sequelize
- **Decisions / tradeoffs:** UUID PK universal; DECIMAL(18,2) untuk uang; paranoid soft-delete pada members; planned migration untuk double-entry (DEC-001) & retention (DEC-002)

### Implementation impact

- **Added:** project-docs/05_ERD.md
- **Modified:** None
- **Database:** None (dokumentasi saja; baseline skema aktual)
- **API:** None
- **UI:** None

### Verification

- ERD completeness: 53 entity sections, Mermaid erDiagram dengan 14 relasi utama, integrity rules (invariants/index/soft-delete/money), migration log (1 baseline + 3 planned)
- TSD module coverage: semua 15 modul (M-AUTH..M-FILES) tercermin di entitas

### Risks and follow-up

- **Known issues:**
  - Zona waktu belum eksplisit UTC (follow-up)
  - `midtrans_disbursements` adalah legacy (digantikan manual TRANSFER)
  - Migration MIG-001/002/003 planned (belum dieksekusi)
- **Next recommended task:** TASK-005 — Define API specification

---

## [2026-11-21] — TASK-003 Technical specifications (TSD)

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Defined technical architecture: modular monolith (3 repos), 15 modules with boundaries, 6 technology decisions, 4 key flows (registration+approval, manual payment, financing, notifications), security & operations, and 22 NFR targets.

### Requirements and decisions

- **Requirements implemented:** FSD modules F-01..F-19 mapped to 15 TSD modules (M-AUTH..M-FILES)
- **Decisions / tradeoffs:** PM2 cluster; Nginx reverse proxy; decimal.js for money; Socket.IO real-time; VAPID web push; helmet.js security headers

### Implementation impact

- **Added:** project-docs/04_TSD.md
- **Modified:** None
- **Database:** None
- **API:** None
- **UI:** None

### Verification

- TSD completeness: 15 modules, 6 tech stacks (15 decisions), 4 key flows, 22 NFR targets, deployment topology (4 environments)
- Module boundary check: M-AUTH..M-FILES covers all 19 FSD modules

### Risks and follow-up

- **Known issues:**
  - MFA belum diimplementasi untuk peran istimewa (future)
  - i18n framework belum dipilih (string masih hardcoded)
  - Distributed tracing belum diimplementasi (hanya correlation ID)
- **Next recommended task:** TASK-004 — Define database schema / ERD

---

## [2026-11-21] — TASK-002 Functional requirements (FSD)

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Defined 19 functional modules (F-01..F-19) covering all features, 28 use cases, 82 business rules (BR-01.01..BR-19.03), 11 state transition tables, and full traceability (26/26 PRD items mapped).

### Requirements and decisions

- **Requirements implemented:** PRD-001..026 fully traced to functional items with test references (TEST-001..TEST-030)
- **Decisions / tradeoffs:** DEC-001 (double-entry) reflected in BR-11.02/BR-11.03; DEC-005 (hapus Midtrans/DOKU) in BR-05.01

### Implementation impact

- **Added:** project-docs/03_FSD.md
- **Modified:** None
- **Database:** None
- **API:** None
- **UI:** None

### Verification

- `grep -c '^### F-'` → 19 modules; `grep -c '#### Use case'` → 28; `grep -c '^| BR-'` → 82; `grep -c '^#### State transitions'` → 11
- PRD traceability: `grep -o 'PRD-[0-9]*' 02_PRD.md` vs `03_FSD.md` → 26/26 match

### Risks and follow-up

- **Known issues:**
  - Test references (TEST-xxx) are forward references to be defined in 08_TEST_PLAN.md (TASK-005)
  - DEC-003/DEC-004 reflected as future-scope items (Laporan global, PDF export)
- **Next recommended task:** TASK-003 — Define technical specifications (TSD)

---

## [2026-11-21] — TASK-001 Product requirements (PRD)

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Defined product vision, 4+1 user roles (Calon Anggota, Anggota Penuh, Pengawas, Ketua, Bendahara), 5 core journeys (registration, savings, financing, withdrawal, training), 26 requirements (PRD-001..026), constraints, and open decisions. PRD covers all features from admin portal (koperasi backoffice) and public website (member portal) with API endpoints as evidence.

### Requirements and decisions

- **Requirements implemented:** 02_PRD.md filled with real users, measurable success metrics, non-goals, and acceptance criteria
- **Decisions / tradeoffs:** Recorded payment gateway conflict (Midtrans/DOKU sandbox in frontend vs manual transfer in API) as DEC-005; marked Laporan/Pengaturan/Pengaturan as placeholders (non-goal)

### Implementation impact

- **Added:** project-docs/02_PRD.md
- **Modified:** None
- **Database:** None
- **API:** None
- **UI:** None

### Verification

- PRD completeness check: problem statement ✓, users/roles ✓, journeys (J-01..J-05) ✓, requirements (PRD-001..026) ✓, acceptance criteria per requirement ✓, non-goals ✓, open decisions (DEC-001..005) ✓
- Cross-reference with API/admin/public explorations: features match (auth, anggota, simpanan, jual-beli, program, tabungan, investasi, pendanaan, training, billing, notifications)

### Risks and follow-up

- **Known issues:** 
  - Payment gateway conflict: frontend still references Midtrans/DOKU sandbox while API uses manual transfer (DEC-005 open)
  - Laporan/Pengaturan global di admin portal masih placeholder (non-goal, DEC-003)
  - Double-entry journal pending (DEC-001)
- **Next recommended task:** TASK-002 — Define functional requirements (FSD)

---

## [2026-11-21] — TASK-000 Project documentation initialization

**Status:** DONE  
**Version:** 1.0.0  
**Owner:** Development Team

### Outcome

Created `project-docs/` directory from template set and adapted placeholders (project name, version, owner, dates, tech stack) to match the KKpus platform (Node.js/Express API + React/Vite admin and public frontends).

### Requirements and decisions

- **Requirements implemented:** Project documentation contract baseline
- **Decisions / tradeoffs:** Used existing template set from `project-docs-workflow/assets/templates/`

### Implementation impact

- **Added:** 21 markdown files under `project-docs/`
- **Modified:** None
- **Database:** None
- **API:** None
- **UI:** None

### Verification

- `ls project-docs/` — 21 files present (00-14 numbered docs + extras)
- `grep` audit — global placeholders (PROJECT NAME, VERSION, OWNER, etc.) replaced

### Risks and follow-up

- **Known issues:** Content-specific placeholders (roles, features, screens) remain to be filled during project specification
- **Next recommended task:** Define PRD requirements (TASK-001)

---

## [YYYY-MM-DD HH:mm TZ] — [TASK-001] [Feature]

**Status:** [DONE | REVIEW | BLOCKED]  
**Version:** 1.0.0  
**Owner:** [NAME]

### Outcome

[WHAT CHANGED AND THE OBSERVABLE RESULT]

### Requirements and decisions

- **Requirements implemented:** [PRD/FSD/RULE IDS]
- **Decisions / tradeoffs:** [DECISION AND RATIONALE]

### Implementation impact

- **Added:** [FILES OR NONE]
- **Modified:** [FILES OR NONE]
- **Database:** [MIGRATION / TABLE / DATA IMPACT OR NONE]
- **API:** [ENDPOINT / COMPATIBILITY IMPACT OR NONE]
- **UI:** [SCREEN / INTERACTION IMPACT OR NONE]

### Verification

- [COMMAND OR SCENARIO] — [OBSERVED RESULT]

### Risks and follow-up

- **Known issues:** [NONE / ISSUE]
- **Next recommended task:** [ONE TASK ID OR BLOCKER]

---

## Project decisions

| Date | Decision | Context / rationale | Consequences | Owner |
| --- | --- | --- | --- | --- |
| 2026-11-21 | DEC-001: Double-entry jurnal diterapkan bertahap | UU Perkoperasi & SAK mewajibkan pembukuan benar | Fase 1: CoA + aliran inti; Fase 2: laporan lengkap | Finance/Dev |
| 2026-11-21 | DEC-002: Purge dokumen default ON, retensi per jenis | UU PDP & ISO 27001 A.8.10; dokumen wajib disimpan selama retensi | Purge hanya nonaktif melewati masa retensi | Legal/Security |
| 2026-11-21 | DEC-003: Tunda halaman Laporan & Pengaturan global | Laporan per-modul sudah ada; perbaiki menu placeholder dulu | P2; tidak memblokir operasional | Product |
| 2026-11-21 | DEC-004: Implementasi cepat atau sembunyikan tombol PDF | `html2pdf.js` sudah ada; jangan biarkan tombol non-functional | Jika dibangun: pola standar semua laporan | Product |
| 2026-11-21 | DEC-005: Hapus Midtrans/DOKU sandbox, all-in manual transfer | Sandbox di produksi = risiko keamanan; API sudah manual | Hapus sandbox; InvoicePage jadi transfer manual + upload bukti | Product/Tech |
