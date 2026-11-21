# Development Log

**Project:** KKPUS Platform

## Rules

- Add verified entries directly below this section; newest first.
- Do not rewrite past entries to conceal history. Correct them with a new entry.
- Log the actual files, decisions, database/API/UI impact, and verification evidence.
- Record `None` where a category does not apply.

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
