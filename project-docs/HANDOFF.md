# Engineering Handoff

**Project:** KKPUS Platform  
**Last updated:** 2026-11-22 15:45 UTC by Development Team

## Start here

1. Read `00_AI_AGENT_START_PROMPT.md`, `01_PROJECT_RULES.md`, and `14_GLOBAL_STANDARDS.md`.
2. Read `09_BACKLOG.md`, `10_DEV_LOG.md`, and this file for current state.
3. Read the specifications referenced by the selected task.
4. Spot-check this handoff against the repository before trusting it.

## Current verified state

- **Repository / branch:** D:\kkpus (branch: temp)
- **Version / environment:** 1.0.0 / local development
- **Completed milestone:** Documentation baseline + PRD + FSD + TSD + ERD + API Spec (+ rekonsiliasi §6) + UI/UX Spec + Test Plan + BLK-004 DOKU frontend + BLK-003 API reconciliation + BLK-006 DOKU/Midtrans backend + BLK-008 auth notifikasi + BLK-007 role decision (TASK-000..TASK-007)
- **Active task:** None — seluruh blocker selesai; menunggu instruksi berikutnya (NEW-001/TASK-008 atau TEST P0)
- **Last verification:** Backend: Jest 12 suite / 108 test passed; ESLint 0 error 0 warning; IDOR notifikasi ditutup; BLK-007 DEC-006: role config = Ketua/Bendahara/Pengawas (spec diselaraskan, tanpa perubahan kode)

## Decisions and constraints

- Stack: Node.js/Express + Sequelize + MySQL (API); React/Vite (admin & public frontends); JWT auth; Socket.IO; Excel import/export
- Roles: 3 org roles (Pengawas/Ketua/Bendahara) for maker-checker approval; member types (Calon Anggota, Anggota Penuh, Anggota Penuh ALB)
- Approval engine 3-step wajib untuk entitas sensitif; pembayaran via transfer manual + verifikasi bendahara
- API: REST, JSON media type, pagination `?page=1&limit=20`, error envelope `{ "error": { "code", "message", "details" } }`

## Open blockers and risks

| ID | Blocker / risk | Impact | Owner | Next action |
| --- | --- | --- | --- | --- |
| BLK-001 | Frontend masih memuat Midtrans/DOKU sandbox (DEC-005 approved, belum dieksekusi) | Keamanan: sandbox di produksi | Product/Tech | Hapus sandbox, ganti InvoicePage jadi transfer manual |
| BLK-002 | `RETENTION_AUTOPURGE` belum default ON (DEC-002 approved, belum dikonfigurasi) | Kepatuhan retensi | Legal/Security | Aktifkan default + set retentionYears per dokumen |
| BLK-003 | ~~API spec (kontrak) perlu diverifikasi terhadap implementasi aktual~~ **RESOLVED 2026-11-22** — rekonsiliasi penuh di `06_API_SPEC.md` §6 | — | — | Selesai: 10 MATCH / 37 CHANGED / 3 MISSING dari 50 endpoint; §4 kini inventaris aktual (~213 route) |
| BLK-004 | ~~Public masih memuat DOKU JOKUL sandbox~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: DOKU script + CSP entry dihapus, `UStatus.jsx` (dead code Midtrans) dihapus, fallback `midtrans_order_id` dibersihkan |
| BLK-005 | Backend masih menyimpan kolom `midtrans_order_id` di tabel `transactions` (nama kolom legacy, diisi format `MANUAL-*`) | Kebersihan skema | Dev Team | Pertimbangkan rename kolom → `payment_reference` saat migrasi berikutnya (di luar scope frontend) |
| BLK-006 | ~~Backend masih memiliki DOKU & Midtrans aktif~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: `/billing/sync-status` + controller dihapus; `process-payment` dipertahankan (dipakai frontend) & dibersihkan jadi `createPaymentBill` (`transfer_manual`); model MidtransDisbursement + script DOKU keys dihapus; 108 test lulus |
| BLK-007 | ~~Role divergence: spec v1 "Bendahara only" (config simpanan, fee-config) vs aktual "Pengawas/Ketua/Bendahara"; disburse simpanan aktual "Ketua/Bendahara/Pengawas" — REC-3~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: DEC-006 — spec dilonggarkan (Ketua/Bendahara/Pengawas), tanpa perubahan kode; risiko SoD diterima tertulis |
| BLK-008 | ~~`GET /api/notifikasi/list` & `POST /api/notifikasi/update-status` tanpa `MidAnggota`~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: route sudah pakai MidAnggota (temuan awal tidak akurat), tapi ditemukan **IDOR**: query/body `member_id` → dihapus, identity hanya dari `req.userId`; push subscribe/test-push + MidAnggota di route; 108 test lulus |

## Next recommended task

**NEW-001 / TASK-008 — Rewrite detail §3 `06_API_SPEC.md` (P2, dokumentasi)**

- Why now: Semua blocker (BLK-001..008) selesai. §3 masih berisi kontrak v1 idealis (50 endpoint) — inventaris aktual (~213 route) sudah ada di §4 & §6. Rewrite §3 agar spec detail = kontrak yang dipakai frontend/backend.
- Read: `06_API_SPEC.md` §3/§4/§6, `api.kkpus.id/routes/*.js` (inventaris §4), `08_TEST_PLAN.md`
- Acceptance evidence: Setiap modul di §3 memakai path/method/auth aktual (acuan §4); API ID tetap 1:1 dengan traceability §5; tidak ada endpoint fiktif
- Do not start if: — (semua blocker selesai; murni dokumentasi)

**Alternatif: eksekusi TEST P0 di staging** (TEST-001, 003, 004, 007, 009, 011, 012, 013, 016, 027, 032, 035) — butuh environment + test data.

## Update rule

Update this file after each verified task or material decision. State facts with dates and evidence; link to the backlog and development-log entries rather than duplicating their full history.
