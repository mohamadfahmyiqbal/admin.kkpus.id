# UI/UX Audit Index — Admin Kkpus

Projek: **Admin Kkpus (Backoffice Koperasi)**  
Lokasi: `D:\kkpus\admin.kkpus.id\`  
Referensi standar: Skill `/uiux` (Senior UI/UX Designer) — 10 Standar Wajib  
File template: `.opencode/skills/uiux/references/uiux-audit-checklist.md`

---

## Daftar Halaman yang Perlu Di-audit

| No | Halaman | File Sumber | Route Key | Protected | File Audit | Status |
|----|---------|-------------|-----------|-----------|------------|--------|
| 1 | Splash Page | `src/pages/auth/SplashPage.jsx` | `globalSplash` | ❌ | `01-auth-splash-page-audit.md` | ⬜ |
| 2 | Login Page | `src/pages/auth/LoginPage.jsx` | `authLogin` | ❌ | `02-auth-login-page-audit.md` | ⬜ |
| 3 | Dashboard | `src/pages/dashboard/Dashboard.jsx` | `dashboard` | ✅ | `03-dashboard-page-audit.md` | ⬜ |
| 4 | Members (Anggota) | `src/pages/anggota/MembersPage.jsx` | `membersPage` | ✅ | `04-members-page-audit.md` | ⬜ |
| 5 | Simpanan Dashboard | `src/pages/simpanan/SimpananDashboard.jsx` | `simpananDashboard` | ✅ | `05-simpanan-dashboard-audit.md` | ⬜ |
| 6 | Simpanan Report | `src/pages/simpanan/SimpananReportPage.jsx` | `simpananReportPage` | ✅ | `06-simpanan-report-page-audit.md` | ⬜ |
| 7 | Jual Beli Dashboard | `src/pages/jualBeli/JualBeliDashboard.jsx` | `jualBeliDashboard` | ✅ | `07-jual-beli-dashboard-audit.md` | ⬜ |
| 8 | Jual Beli Report | `src/pages/jualBeli/JualBeliReport.jsx` | `jualBeliReportPage` | ✅ | `08-jual-beli-report-page-audit.md` | ⬜ |
| 9 | Akad Config | `src/pages/konfigurasi/AkadConfigPage.jsx` | `akadConfigPage` | ✅ | `09-akad-config-page-audit.md` | ⬜ |
| 10 | Simpanan Config | `src/pages/konfigurasi/SimpananConfigPage.jsx` | `simpananConfigPage` | ✅ | `10-simpanan-config-page-audit.md` | ⬜ |
| 11 | Payment Fee Config | `src/pages/konfigurasi/PaymentFeeConfigPage.jsx` | `paymentFeeConfigPage` | ✅ | `11-payment-fee-config-page-audit.md` | ⬜ |
| 12 | Pinjaman List | `src/pages/program/pinjaman/PinjamanList.jsx` | `pinjamanList` | ✅ | `12-pinjaman-list-page-audit.md` | ⬜ |
| 13 | Pinjaman Report | `src/pages/program/pinjaman/PinjamanReport.jsx` | `pinjamanReport` | ✅ | `13-pinjaman-report-page-audit.md` | ⬜ |
| 14 | Pinjaman Input Modal | `src/pages/program/pinjaman/PinjamanInputModal.jsx` | `pinjamanInputModal` | ✅ | `14-pinjaman-input-modal-audit.md` | ⬜ |
| 15 | Arisan Batch | `src/pages/program/arisan/ArisanBatchPage.jsx` | `arisanBatchPage` | ✅ | `15-arisan-batch-page-audit.md` | ⬜ |
| 16 | Arisan Report | `src/pages/program/arisan/ArisanReport.jsx` | `arisanReport` | ✅ | `16-arisan-report-page-audit.md` | ⬜ |
| 17 | Tabungan List | `src/pages/tabungan/TabunganPage.jsx` | `tabunganList` | ✅ | `17-tabungan-page-audit.md` | ⬜ |
| 18 | Tabungan Report | `src/pages/tabungan/TabunganReportPage.jsx` | `tabunganReport` | ✅ | `18-tabungan-report-page-audit.md` | ⬜ |
| 19 | Investasi Halal List | `src/pages/investasi/halal/InvestasiHalalListPage.jsx` | `investasiHalalList` | ✅ | `19-investasi-halal-list-page-audit.md` | ⬜ |
| 20 | Investasi Halal Report | `src/pages/investasi/halal/InvestasiReportPage.jsx` | `investasiHalalReport` | ✅ | `20-investasi-halal-report-page-audit.md` | ⬜ |
| 21 | Pendanaan Syariah List | `src/pages/investasi/pendanaan/PendanaanSyariahListPage.jsx` | `pendanaanSyariahList` | ✅ | `21-pendanaan-syariah-list-page-audit.md` | ⬜ |
| 22 | Pendanaan Syariah Report | `src/pages/investasi/pendanaan/PendanaanSyariahReportPage.jsx` | `pendanaanSyariahReport` | ✅ | `22-pendanaan-syariah-report-page-audit.md` | ⬜ |
| 23 | Training Page | `src/pages/training/TrainingPage.jsx` | `trainingPage` | ✅ | `23-training-page-audit.md` | ⬜ |

---

## Catatan
- Halaman `reportsPage`, `settingsPage`, `accountPage`, `registrationsPage`, `billingPage`, `transactionsPage` semua merender `Dashboard.jsx` (sama dengan no. 3), jadi tidak dibuat file audit terpisah.
- `PinjamanInputModal` dimasukkan karena terdaftar di `PageRoutes.jsx` sebagai route, meskipun berupa modal.
- Setiap file audit adalah salinan dari template `uiux-audit-checklist.md` dengan header yang sudah diisi sesuai halaman.

---

## Cara Penggunaan

1. Buka file audit untuk halaman tertentu (mis. `02-auth-login-page-audit.md`).
2. Isi header informasi audit (auditor, tanggal, dll.).
3. Buka halaman tersebut di browser atau lihat desain Figma-nya.
4. Centang setiap item dalam 10 bagian checklist sesuai temuan.
5. Catat temuan kritis dan berikan keputusan akhir.
6. Serahkan daftar perbaikan ke tim developer/desain.
7. Setelah diperbaiki, lakukan audit ulang (iterasi).

---

**Dihasilkan oleh:** Skill `/uiux` — Senior UI/UX Designer  
**Tanggal:** 16 Nov 2026
