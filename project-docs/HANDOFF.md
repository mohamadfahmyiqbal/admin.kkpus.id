# Engineering Handoff

**Project:** KKPUS Platform  
**Last updated:** 2026-11-22 17:00 UTC by Development Team

## Start here

1. Read `00_AI_AGENT_START_PROMPT.md`, `01_PROJECT_RULES.md`, and `14_GLOBAL_STANDARDS.md`.
2. Read `09_BACKLOG.md`, `10_DEV_LOG.md`, and this file for current state.
3. Read the specifications referenced by the selected task.
4. Spot-check this handoff against the repository before trusting it.

## Current verified state

- **Repository / branch:** D:\kkpus (branch: temp)
- **Version / environment:** 1.0.0 / local development
- **Completed milestone:** Documentation baseline + PRD + FSD + TSD + ERD + API Spec (rekonsiliasi §6 + §3 rewrite aktual) + UI/UX Spec + Test Plan + BLK-001..008 (semua resolved; MIG-004 executed di produksi 2026-11-22) + BLK-007 role decision + TASK-008 + NEW-002 triase + DEF-001 + **TEST P0 live (TEST-001..032, 035): 57/57 PASS + DEF-002..010 fixed** + **TASK-010: gitleaks 3 repo + VAPID rotation** + **TASK-011: TEST P1 batch 1 (TEST-002/005/006/008/010): 29/29 PASS + DEF-011/012 fixed** + **TASK-012: TEST P1 batch 2 (TEST-014/015/017/018/020/023/024/029): 34/34 PASS + DEF-013/014 fixed** + **TASK-013: TEST P2 (TEST-019/021/022/025/026/028/031/033): 29/29 PASS + DEF-015 fixed** (TASK-000..TASK-013)
- **Active task:** — (TASK-013 selesai) — seluruh P0/P1/P2 API-testable tuntas; sisa TEST-030/034/036 (manual/staging)
- **Last verification:** TASK-013 TEST P2 2026-11-22 (api `aea42be`): 29/29 check PASS; eslint 0 error; npm test 108/108; data uji 0 sisa; `/health/deep` 200. TEST P0 57/57 (api `4e7b8f4`); TASK-010 gitleaks + VAPID rotation; detail `08_TEST_PLAN.md` §4.1–4.4 & `10_DEV_LOG.md` (DEF-002..015)

## Decisions and constraints

- Stack: Node.js/Express + Sequelize + MySQL (API); React/Vite (admin & public frontends); JWT auth; Socket.IO; Excel import/export
- Roles: 3 org roles (Pengawas/Ketua/Bendahara) for maker-checker approval; member types (Calon Anggota, Anggota Penuh, Anggota Penuh ALB)
- Approval engine 3-step wajib untuk entitas sensitif; pembayaran via transfer manual + verifikasi bendahara
- API: REST, JSON media type, pagination `?page=1&limit=20`, error envelope `{ "error": { "code", "message", "details" } }`

## Open blockers and risks

| ID | Blocker / risk | Impact | Owner | Next action |
| --- | --- | --- | --- | --- |
| BLK-001 | ~~Frontend masih memuat Midtrans/DOKU sandbox (DEC-005 approved, belum dieksekusi)~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: kedua frontend 0 referensi Midtrans/DOKU (grep); dead helper `createMidtransTransaction` dihapus (admin `949fc75`) |
| BLK-002 | ~~`RETENTION_AUTOPURGE` belum default ON (DEC-002 approved, belum dikonfigurasi)~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: purge default AKTIF (opt-out `RETENTION_AUTOPURGE=false`); ambang configurable `RETENTION_REJECTED_DAYS`/`RETENTION_INACTIVE_DAYS` (api `41f7c6a`); 108 test lulus; smoke dry-run live menunggu DB valid di staging |
| BLK-003 | ~~API spec (kontrak) perlu diverifikasi terhadap implementasi aktual~~ **RESOLVED 2026-11-22** — rekonsiliasi penuh di `06_API_SPEC.md` §6 | — | — | Selesai: 10 MATCH / 37 CHANGED / 3 MISSING dari 50 endpoint; §4 kini inventaris aktual (~213 route) |
| BLK-004 | ~~Public masih memuat DOKU JOKUL sandbox~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: DOKU script + CSP entry dihapus, `UStatus.jsx` (dead code Midtrans) dihapus, fallback `midtrans_order_id` dibersihkan |
| BLK-005 | ~~Backend masih menyimpan kolom `midtrans_order_id` di tabel `transactions`~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: migrasi dieksekusi di produksi (296 baris utuh, index unik terjaga, `/health/deep` OK; api `461ff7b` + DB MIG-004) |
| BLK-006 | ~~Backend masih memiliki DOKU & Midtrans aktif~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: `/billing/sync-status` + controller dihapus; `process-payment` dipertahankan (dipakai frontend) & dibersihkan jadi `createPaymentBill` (`transfer_manual`); model MidtransDisbursement + script DOKU keys dihapus; 108 test lulus |
| BLK-007 | ~~Role divergence: spec v1 "Bendahara only" (config simpanan, fee-config) vs aktual "Pengawas/Ketua/Bendahara"; disburse simpanan aktual "Ketua/Bendahara/Pengawas" — REC-3~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: DEC-006 — spec dilonggarkan (Ketua/Bendahara/Pengawas), tanpa perubahan kode; risiko SoD diterima tertulis |
| BLK-008 | ~~`GET /api/notifikasi/list` & `POST /api/notifikasi/update-status` tanpa `MidAnggota`~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: route sudah pakai MidAnggota (temuan awal tidak akurat), tapi ditemukan **IDOR**: query/body `member_id` → dihapus, identity hanya dari `req.userId`; push subscribe/test-push + MidAnggota di route; 108 test lulus |

## Next recommended task

**Semua P0/P1/P2 API-testable selesai.** Sisa TEST-030/034/036 (manual/staging).

- TEST-030 (PWA offline & update): manual test dengan build produksi + SW terdaftar
- TEST-034 (performa frontend): Lighthouse landing & dashboard + bundle size admin
- TEST-036 (aksesibilitas keyboard): walkthrough keyboard-only layar kritis

**Follow-up keamanan (belum dikerjakan):**
- Rotasi password DB produksi (`.env` lokal memuat password produksi)
- Pastikan frontend re-subscribe Web Push setelah rotasi VAPID
- Purge history git kkpusid (opsional)
- Tambah unit test `utils/passwordValidator.js` (coverage 9.67%)

**Catatan schema/performa (untuk iterasi berikutnya):**
- `loan_products` tanpa field limit/plafon → INVALID_AMOUNT (TEST-014) tak teruji
- `createSukukOrder` tak cek quota/status → order bisa melebihi kuota
- `pinjaman_modal` tanpa audit trail
- Dashboard p95=414ms di 20 concurrent — observasi performa (single instance)
- TEST-019 INSUFFICIENT_BALANCE, TEST-022/028 VALIDATION_ERROR tidak ada kode error literal (impl pakai 400 + pesan teks)
- **Fast-follow (P2):** 26 moderate vulns (api 18, admin 6, kkpusid 2) — tinjau per kasus; rotasi password DB (`.env` lokal kini memuat password produksi)
- Do not start if: test data (akun 4 peran + data uji) belum tersedia di DB produksi

## Update rule

Update this file after each verified task or material decision. State facts with dates and evidence; link to the backlog and development-log entries rather than duplicating their full history.
