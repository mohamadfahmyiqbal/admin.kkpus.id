# Engineering Handoff

**Project:** KKPUS Platform  
**Last updated:** 2026-11-22 15:10 UTC by Development Team

## Start here

1. Read `00_AI_AGENT_START_PROMPT.md`, `01_PROJECT_RULES.md`, and `14_GLOBAL_STANDARDS.md`.
2. Read `09_BACKLOG.md`, `10_DEV_LOG.md`, and this file for current state.
3. Read the specifications referenced by the selected task.
4. Spot-check this handoff against the repository before trusting it.

## Current verified state

- **Repository / branch:** D:\kkpus (branch: temp)
- **Version / environment:** 1.0.0 / local development
- **Completed milestone:** Documentation baseline + PRD + FSD + TSD + ERD + API Spec (+ rekonsiliasi §6) + UI/UX Spec + Test Plan + BLK-004 DOKU frontend + BLK-003 API reconciliation + BLK-006 DOKU/Midtrans backend + BLK-008 auth notifikasi (TASK-000..TASK-007)
- **Active task:** None — menunggu keputusan Product (BLK-007) atau instruksi berikutnya
- **Last verification:** Backend: Jest 12 suite / 108 test passed; ESLint 0 error 0 warning; IDOR notifikasi ditutup (query/body `member_id` dihapus, identity dari `req.userId`); push subscribe/test-push + `MidAnggota`

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
| BLK-007 | **Role divergence**: spec v1 "Bendahara only" (config simpanan, fee-config) vs aktual "Pengawas/Ketua/Bendahara"; disburse simpanan aktual "Ketua/Bendahara/Pengawas" — REC-3 | Keputusan otorisasi belum final | Product/Tech | Product putuskan: perketat implementasi atau longgarkan spec (butuh perubahan + audit) |
| BLK-008 | ~~`GET /api/notifikasi/list` & `POST /api/notifikasi/update-status` tanpa `MidAnggota`~~ **RESOLVED 2026-11-22** — lihat `10_DEV_LOG.md` | — | — | Selesai: route sudah pakai MidAnggota (temuan awal tidak akurat), tapi ditemukan **IDOR**: query/body `member_id` → dihapus, identity hanya dari `req.userId`; push subscribe/test-push + MidAnggota di route; 108 test lulus |

## Next recommended task

**BLK-007 — Keputusan role otorisasi config (P1, butuh Product)**

- Why now: Temuan REC-3 dari rekonsiliasi API. Spec v1 "Bendahara only" untuk config simpanan & fee-config; aktual "Pengawas/Ketua/Bendahara" + disburse simpanan "Ketua/Bendahara/Pengawas".
- Read: `06_API_SPEC.md` §6.3 REC-3, `api.kkpus.id/routes/simpananRoute.js` & `billingRoute.js`, `03_FSD.md` (BR-09/18)
- Acceptance evidence: Product memutuskan (perketat implementasi atau longgarkan spec); perubahan + audit trail + test
- Do not start if: — (butuh keputusan Product)

**Alternatif: NEW-001/TASK-008** — rewrite detail §3 API spec (P2, dokumentasi).

## Update rule

Update this file after each verified task or material decision. State facts with dates and evidence; link to the backlog and development-log entries rather than duplicating their full history.
