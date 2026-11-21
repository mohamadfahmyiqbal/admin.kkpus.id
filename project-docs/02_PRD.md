# Product Requirements Document

**Product:** KKPUS Platform — Koperasi Paguyuban Usaha Sukses (PUS) Syariah  
**Version / status:** 1.0.0 / APPROVED  
**Owner:** Development Team  
**Last reviewed:** 2026-11-21

## 1. Problem and product vision

- **Problem:** Koperasi PUS Syariah mengelola keanggotaan, simpanan, pembiayaan syariah, dan pelatihan secara manual/tersebar. Diperlukan satu platform terintegrasi yang (a) melayani anggota secara mandiri (pendaftaran, pengajuan, setoran) dan (b) memberi pengurus alat backoffice dengan kontrol berlapis (maker-checker) sesuai prinsip syariah dan tata kelola koperasi.
- **Target users:** Anggota koperasi (publik), serta pengurus: Pengawas, Ketua, dan Bendahara.
- **Value proposition:** Digitalisasi end-to-end siklus koperasi syariah — onboarding anggota, simpanan (pokok/wajib/sukarela), pembiayaan (jual beli/murabahah, pinjaman lunak, arisan, tabungan bertarget, investasi halal/sukuk, pendanaan syariah) — dengan persetujuan berjenjang 3 peran, jejak audit, notifikasi real-time, dan pelaporan akuntansi.
- **Success metrics:** 
  - 100% pengajuan baru (anggota, pembiayaan, penarikan) melewati approval berjenjang sebelum diproses.
  - Setiap transaksi keuangan dan perubahan peran tercatat di `activity_logs` dengan aktor + waktu.
  - Setiap pengajuan/pembayaran memiliki status yang dapat dilacak anggota secara real-time.

## 2. Goals and non-goals

### In scope

- Autentikasi & manajemen sesi (JWT + cookie, lockout, rate limit, lupa password OTP).
- Onboarding anggota: registrasi, verifikasi dokumen, penetapan peran pengurus, soft-delete/restore.
- Simpanan: pokok, wajib, sukarela (setoran & pencairan), tabungan bertarget.
- Pembiayaan: jual beli (murabahah), pinjaman lunak, arisan, investasi halal (sukuk), pendanaan syariah.
- Approval engine berjenjang (Pengawas → Ketua → Bendahara) untuk semua entitas sensitif.
- Billing & pembayaran manual (transfer ke rekening koperasi, upload bukti, verifikasi bendahara), konfigurasi biaya admin, sinkronisasi disbursement.
- Pelatihan/e-learning: kurikulum, materi, catatan, evaluasi/kuis, ranking.
- Landing page publik (layanan, statistik, tentang, kontak) & artikel.
- Notifikasi real-time (Socket.IO + web push), laporan & ekspor Excel per modul, audit log, retensi dokumen identitas.

### Explicitly out of scope

- Payment gateway otomatis (Midtrans/DOKU) — dihapus; pembayaran via transfer manual + verifikasi.
- Aplikasi mobile native (iOS/Android) — hanya web/PWA.
- Akuntansi double-entry **Fase 2** (Laba Rugi/Arus Kas/Perubahan Ekuitas lengkap) — masih sebagian; Fase 1 (CoA + jurnal aliran uang inti) in-scope (DEC-001).
- Modul Laporan global terpadu & halaman Pengaturan terpusat (DEC-003, P2) — saat ini placeholder; laporan per-modul sudah tersedia.
- Export PDF laporan (DEC-004, P3) — tombol non-functional di Pendanaan; akan diimplementasi cepat atau disembunyikan.

## 3. Users and roles

Tipe member (mengacu implementasi aktual: role code 1–6):

| Role / tipe | Goals | Permissions / boundaries |
| --- | --- | --- |
| Calon Anggota (role 1) | Daftar akun, isi registrasi, lacak status pengajuan | Menu transaksi/program/investasi **disabled** sampai jadi anggota penuh |
| Anggota (Reguler / Anggota Penuh, role 5) | Ajukan simpanan/pembiayaan/penarikan, ikut pelatihan | Hanya data & transaksi milik sendiri; dapat diberi peran pengurus |
| Anggota (Luar Biasa / Anggota Penuh ALB, role 6) | Seperti reguler | Menyembunyikan modul Transaksi/Program/Investasi; **tidak** dapat diberi peran pengurus |
| Pengawas (role 2) | Tinjau & setujui tahap 1 semua pengajuan | Approval tahap 1; tidak bisa setujui >1 tahap; tidak bisa setujui pengajuan sendiri |
| Ketua (role 3) | Setujui tahap 2 | Approval tahap 2 setelah Pengawas; tidak bisa setujui >1 tahap; tidak bisa setujui pengajuan sendiri |
| Bendahara (role 4) | Setujui tahap 3 (final), verifikasi pembayaran, kelola kas | Approval final; verifikasi manual transfer; tidak bisa setujui tahap yang bukan bagiannya; tidak bisa setujui pengajuan sendiri |

## 4. Core journeys

### J-01 — Pendaftaran & pengesahan anggota

**Trigger:** Calon anggota mendaftar via web publik.  
**Happy path:** Isi data diri + KTP/selfie + pilih simpanan pokok → submit → Pengawas review (tahap 1) → Ketua (tahap 2) → Bendahara (tahap 3) → status APPROVED + tagihan awal (pokok + wajib×12) dibuat → notifikasi.  
**Failure / edge paths:** Dokumen tidak jelas → REJECTED dengan alasan; anggota bisa daftar ulang.  
**Success condition:** Anggota aktif, tagihan awal terbit, jejak persetujuan tersimpan per tahap.

### J-02 — Setoran simpanan wajib (pembayaran manual)

**Trigger:** Tagihan jatuh tempo.  
**Happy path:** Anggota transfer ke rekening koperasi + upload bukti → Bendahara verifikasi → transaksi tercatat + saldo bertambah.  
**Failure / edge paths:** Bukti salah/tidak sesuai → ditolak, anggota unggah ulang.  
**Success condition:** Saldo simpanan & ledger ter-update, status tagihan LUNAS.

### J-03 — Pengajuan pembiayaan (jual beli / pinjaman lunak / sukuk / pendanaan)

**Trigger:** Anggota mengajukan pembiayaan.  
**Happy path:** Isi profil usaha + jumlah + tenor → approval 3 tahap → setelah disetujui, DP/pencairan diproses → anggota mulai angsuran.  
**Failure / edge paths:** Ditolak di tahap manapun → status REJECTED + alasan.  
**Success condition:** Pembiayaan aktif, jadwal angsuran & piutang tercatat.

### J-04 — Penarikan simpanan sukarela / tabungan

**Trigger:** Anggota mengajukan penarikan.  
**Happy path:** Ajukan nominal → approval 3 tahap → pencairan manual (transfer) → saldo berkurang, tercatat.  
**Failure / edge paths:** Saldo tidak cukup → ditolak.  
**Success condition:** Pencairan tercatat, saldo & laporan ter-update.

### J-05 — Pelatihan & evaluasi

**Trigger:** Anggota mengikuti pelatihan.  
**Happy path:** Baca materi → kerjakan kuis → nilai & ranking muncul.  
**Success condition:** Nilai tersimpan, partisipasi tercatat.

## 5. Requirements

| ID | Requirement | Priority | Acceptance criteria | Source / owner |
| --- | --- | --- | --- | --- |
| PRD-001 | Autentikasi anggota & pengurus dengan JWT (Bearer/cookie) | MUST | Login gagal 5× → lockout 15 menit; token logout dicabut (denylist); rate limit aktif | RAS / MidAnggota |
| PRD-002 | Lupa password via OTP | MUST | OTP dikirim, verifikasi, reset berhasil, OTP kedaluwarsa (10 menit, max 3x verifikasi) | forgotPassword |
| PRD-003 | Registrasi anggota baru (8-step: personal, akun, KTP, selfie, pekerjaan, kontak darurat, bank) | MUST | Registrasi tersimpan PENDING; dokumen tervalidasi (magic byte, ≤5MB); data minimal sesuai kebutuhan (lihat DEC-002) | anggotaRoute |
| PRD-004 | Approval berjenjang 3 peran (Pengawas→Ketua→Bendahara) untuk entitas sensitif | MUST | Tidak bisa setujui 2 tahap; tidak bisa setujui pengajuan sendiri; state PENDING→APPROVED/REJECTED | processApproval |
| PRD-005 | Penetapan peran pengurus hanya untuk anggota Reguler | MUST | PUT /anggota/:id/role sukses; anggota Luar Biasa ditolak | anggotaRoute, EditRoleModal |
| PRD-006 | Soft-delete & restore anggota dengan konfirmasi password | MUST | Arsip/restore tercatat di activity_logs; butuh re-auth | anggotaRoute |
| PRD-007 | Simpanan pokok/wajib/sukarela (setoran & pencairan) | MUST | Saldo benar; pencairan butuh approval 3 tahap | simpananRoute, savingsRoute |
| PRD-008 | Tagihan & pembayaran manual dengan bukti transfer | MUST | Bukti tervalidasi; verifikasi bendahara; status LUNAS setelah approve | billingRoute |
| PRD-009 | Konfigurasi biaya admin per metode (FLAT/PERCENTAGE) | SHOULD | Biaya dihitung benar saat generate tagihan | payment_fee_configs |
| PRD-010 | Pembiayaan jual beli (murabahah) dengan angsuran | MUST | Harga jual = harga pokok + laba (decimal.js); DP ≥ 0; angsuran = (harga jual − DP)/tenor; piutang = harga jual − DP − angsuran terbayar | jualbeliRoute |
| PRD-011 | Pinjaman lunak (modal/angsuran) + input modal koperasi (debet/kredit) | MUST | Piutang & status lunas benar; input modal tercatat | programRoute, pinjaman_modal |
| PRD-012 | Arisan: batch, peserta, kocokan/draw bulanan, pencairan | MUST | Draw via RNG kriptografis; hanya jika semua angsuran bulan berjalan lunas; pemenang ditandai cair + bukti transfer | programRoute |
| PRD-013 | Tabungan bertarget (mudharabah) + master program target | SHOULD | Progress vs target benar; penarikan via approval | tabunganRoute |
| PRD-014 | Investasi halal (sukuk): katalog, issue, order, portfolio | SHOULD | Order & jadwal jatuh tempo tercatat | financingRoute, sukuk_issues |
| PRD-015 | Pendanaan syariah dengan approval & jurnal/neraca | SHOULD | Saldo akhir per akun benar | financingRoute, PendanaanSyariahReport |
| PRD-016 | Pelatihan: kurikulum, materi (teks/video/dok), kuis, ranking | COULD | Nilai tersimpan; ranking urut benar | trainingRoute |
| PRD-017 | Notifikasi real-time (Socket.IO) + web push | MUST | Event APPROVAL_UPDATE/REGISTRATION_UPDATED/TRANSACTION_UPDATED diterima; push subscribe/test OK | socket.js, pushRoutes |
| PRD-018 | Dashboard: statistik + antrean approval per kategori | MUST | 6 kartu statistik (Anggota, Simpanan, Jual Beli, Program, Tabungan, Investasi) cocok dengan DB; antrean per kategori akurat; refresh real-time | dashboardRoute |
| PRD-019 | Ekspor & impor Excel per modul (batas 5MB, validasi) | MUST | File valid diimpor; template tersedia; ekspor sesuai filter | xlsx, GenericImportModal |
| PRD-020 | Audit log untuk aksi sensitif (approval, role, delete, import) | MUST | Setiap aksi tercatat dengan aktor, IP, waktu | activity_logs |
| PRD-021 | Pelindungan dokumen identitas: akses terotorisasi + retensi | MUST | Unduh via /api/files/* dengan cek otorisasi & path traversal; purge harian bila RETENTION_AUTOPURGE | uploadRetention, cron |
| PRD-022 | Masking data sensitif (NIK/HP/email) di UI | MUST | Nilai tampil ter-mask sesuai peran | ProtectedImage, DomPurify |
| PRD-023 | Landing page publik (layanan, statistik, tentang, kontak, artikel) | SHOULD | Konten tampil; form kontak tersimpan | landingRoute, contentRoute |
| PRD-024 | Manajemen konfigurasi akad per produk simpanan | COULD | Akad (Wadiah/Mudharabah/dst) terpasang per fitur | AkadConfigPage |
| PRD-025 | Konfigurasi nominal simpanan dengan tanggal efektif | COULD | Perubahan hanya berlaku tagihan pada/after tanggal efektif | SimpananConfigPage |
| PRD-026 | Cron: backup DB bulanan, purge dokumen kedaluwarsa, sinkronisasi laporan | SHOULD | Backup tiap tanggal 1 00:00; purge dokumen 02:00 (bila RETENTION_AUTOPURGE); sinkronisasi savings/jualbeli/financial summary periodik | services/cron.js |

## 6. Constraints and assumptions

- **Business constraints:** Prinsip syariah (akad wajib); pembayaran transfer manual ke rekening koperasi; approval 3 lapis tidak dapat dilewati.
- **Compliance / privacy:** ISO/IEC 27001:2022 (A.5.12 klasifikasi, A.5.34 privasi/PII, A.8.10 penghapusan, A.8.11 masking); UU PDP No. 27/2022; retensi dokumen identitas; masking data pribadi; audit trail; prinsip data minimisation (kumpulkan hanya data yang diperlukan).
- **Dependencies:** MySQL 8, Node.js/Express, Socket.IO, cron, penyimpanan file privat.
- **Non-functional (lihat `04_TSD.md` §6):** API p95 < 300ms (read)/< 500ms (write); frontend LCP < 2.5s; uptime 99.5%; coverage ≥ 70% kode baru.
- **Approved assumptions:** Peran hanya tiga (Pengawas/Ketua/Bendahara); Midtrans/DOKU dihapus permanen; PWA (bukan native app); zona waktu server WIB (UTC+7), normalisasi UTC belum diterapkan (follow-up TSD).

## 7. Decision Log

| ID | Question | Impact | Owner | Due date | Status |
| --- | --- | --- | --- | --- | --- |
| DEC-001 | Apakah jurnal double-entry penuh akan dibangun? | Pelaporan akuntansi lengkap | Finance | 2026-11-21 | APPROVED |
| DEC-002 | Aktifkan purge dokumen identitas default? | Kepatuhan vs retensi | Legal/Security | 2026-11-21 | APPROVED |
| DEC-003 | Halaman Laporan/Pengaturan global di admin — dibangun kapan? | Cakupan backoffice | Product | 2026-11-21 | APPROVED |
| DEC-004 | Export PDF laporan Pendanaan — prioritas? | Fungsionalitas laporan | Product | 2026-11-21 | APPROVED |
| DEC-005 | Konflik payment: frontend masih pakai Midtrans/DOKU sandbox, API pakai transfer manual | Pembayaran tidak konsisten | Product/Tech | 2026-11-21 | APPROVED |

### 7a. Keputusan disetujui (DEC-001..005)

| ID | Keputusan | Rationale | Pelaksana | Target |
| --- | --- | --- | --- | --- |
| DEC-001 | **YA**, double-entry jurnal diterapkan bertahap | Keperluan SAK / perpustakaan koperasi; `ledgerHelper` sudah ada | Dev Team | Fase 1: CoA + aliran uang inti (P1); Fase 2: laporan lengkap (P2) |
| DEC-002 | **YA**, `RETENTION_AUTOPURGE=true` default, retensi per jenis dokumen | UU PDP No. 27/2022 + ISO 27001 A.8.10; dokumen anggota tetap dipertahankan selama masa retensi wajib | Legal/Security | Purge hanya anggota terminated melewati masa retensi |
| DEC-003 | **Tunda** halaman Laporan & Pengaturan global (P2); perbaiki menu placeholder sekarang | Laporan per-modul sudah ada; prioritas di bawah DEC-005/001 | Product | Hub laporan per-modul + settings gabungan |
| DEC-004 | Implementasikan cepat **atau sembunyikan tombol PDF** | `html2pdf.js` sudah ada; jangan biarkan tombol non-functional menyesatkan | Product | Jika dibangun: pola standar semua laporan |
| DEC-005 | **HAPUS** Midtrans/DOKU sandbox dari frontend; all-in transfer manual + verifikasi bendahara | Keamanan sandbox di produksi; konsistensi dengan API | Product/Tech | Segera (P0) — update InvoicePage & hubungi backend jika gateway online diperlukan sebagai proyek terpisah |