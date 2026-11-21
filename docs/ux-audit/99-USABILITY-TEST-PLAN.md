# Rencana Uji Usabilitas — Admin KKPUS

**Tanggal:** 21 November 2026  
**Status:** Rencana (siap dieksekusi)  
**Referensi:** `docs/ux-audit/99-REKAPITULASI.md` (Prioritas 3, Item 3 — Pending)  
**Standar:** ISO/IEC 25010, Nielsen's 10 Heuristics, WCAG 2.2 AA  

---

## 1. Tujuan

Mengumpulkan bukti kualitatif dan kuantitatif tentang kemudahan penggunaan antarmuka Admin KKPUS, dengan fokus pada:
- Aksesibilitas keyboard dan layar pembaca (WCAG 2.2 AA)
- Target sentuhan ≥ 44×44 px (WCAG 2.5.5)
- Label pada input filter (WCAG 3.3.2)
- Tabel ARIA (caption, scope, aria-sort)
- Beberapa alur utama: Login → Dashboard, Persetujuan Anggota, Persetujuan Pinjaman, Transaksi Tabungan

---

## 2. Peserta (Minimal 5 Orang)

| No | Persona | Peran | Jumlah | Kriteria |
|----|---------|-------|--------|----------|
| 1 | Pengawas | Memantau transaksi, verifikasi | 2 | Telah menggunakan sistem admin ≥ 1 bulan |
| 2 | Ketua | Approval pinjaman, laporan keuangan | 2 | Akses ke modul pinjaman & laporan |
| 3 | Bendahara | Kelola simpanan, tabungan, export | 2 | Akses ke modul simpanan & tabungan |

**Total: 6 peserta** (minimal 5 per iterasi, 1 orang cadangan)

Peserta direkrut dari staf operasional koperasi yang memiliki akses ke halaman yang akan diuji. Tidak ada peserta yang terlibat dalam pengembangan kode.

---

## 3. Halaman yang Diuji

| No | Halaman | File Audit | Fokus Uji |
|----|---------|------------|-----------|
| 1 | Login Page | `02-auth-login-page-audit.md` | Tombol Kembali, tampilkan/sembunyikan password, touch target |
| 2 | Dashboard | `03-dashboard-page-audit.md` | Skip link, focus-visible, kognitif overload (tab + kartu) |
| 3 | Members | `04-members-page-audit.md` | Maskir data sensitif, label filter, ARIA tabel |
| 4 | Simpanan Dashboard | `05-simpanan-page-audit.md` | Tombol aksi tabel, filter label, ARIA caption |
| 5 | Jual Beli Dashboard | `06-jual-beli-page-audit.md` | 11 filter kolom, tombol aksi, maskir data anggota |
| 6 | Simpanan Report | `06-simpanan-report-page-audit.md` | 12 filter input, tabel caption, pagination ARIA |
| 7 | Pinjaman Report | `13-pinjaman-report-page-audit.md` | 6 tab (Hick's Law), 13 kolom text-nowrap |
| 8 | Tabungan Report | `18-tabungan-report-page-audit.md` | 16 filter input, fixed minWidth 1600px |

---

## 4. Skenario Uji

### Skenario A: Login & Akses Awal
1. Buka halaman login
2. Klik tombol "Kembali" ke halaman utama
3. Masukkan email/nomor HP dan password
4. Klik "Tampilkan password" untuk verifikasi
5. Klik "Masuk ke Dashboard"

**Metrik:** Waktu login, apakah tombol Kembali ditemukan, apakah tombol password ≥ 44×44 px

### Skenario B: Persetujuan Anggota (Members)
1. Buka halaman Members
2. Cari anggota menggunakan filter
3. Verifikasi NIK/telepon/email (maskir)
4. Klik tombol aksi tabel (detail/verifikasi)

**Metrik:** Apakah label filter terbaca layar pembaca, apakah tombol aksi ≥ 44×44 px, apakah data sensitif maskir

### Skenario C: Persetujuan Pinjaman
1. Buka halaman Pinjaman List
2. Filter pinjaman menunggu verifikasi
3. Buka modal detail pinjaman
4. Approve atau tolak pinjaman

**Metrik:** Waktu persetujuan, apakah modal memiliki tombol Batal, apakah th sort keyboard-accessible

### Skenario D: Transaksi Tabungan
1. Buka halaman Tabungan List
2. Lihat detail transaksi anggota
3. Export data (jika tersedia)

**Metrik:** Apakah data anggota maskir, apakah tombol export accessible, apakah tabel memiliki caption

---

## 5. Metrik yang Diukur

| Metrik | Definisi | Target |
|--------|----------|--------|
| Task Success Rate | Persentase tugas yang diselesaikan tanpa bantuan | ≥ 80% |
| Time-on-task | Waktu rata-rata menyelesaikan setiap skenario | ≤ 120 detik per skenario |
| Error Rate | Jumlah kesalahan pengguna per tugas | ≤ 2 per skenario |
| SUS Score | System Usability Scale (skor 0-100) | ≥ 68 (rata-rata layak) |
| NPS | Net Promoter Score (0-10) | ≥ 7 |
| Accessibility Issues | Jumlah masalah aksesibilitas yang ditemukan | 0 kritis, ≤ 3 tinggi |

---

## 6. Alat & Metode

| Alat | Tujuan |
|------|--------|
| Screen reader (NVDA / VoiceOver) | Uji label input, ARIA tabel, skip link, fokus |
| Keyboard-only (Tanpa mouse) | Uji navigasi Tab, focus-visible, breadcrumb |
| Pengukur sentuhan (44×44 px template) | Uji ukuran tombol dan input |
| Stopwatch | Pengukuran time-on-task |
| Angket SUS (10 pertanyaan) | Skor kepuasan usability |
| Catatan observasi | Masalah yang ditemukan saat uji |

---

## 7. Proses Eksekusi

1. **Persiapan (Hari 1):** Rekrut peserta, siapkan perangkat uji, buat konsentemen
2. **Pelaksanaan (Hari 2-4):** Uji 1:1 dengan setiap peserta (30-45 menit per orang)
3. **Pencatatan (Hari 5):** Catat tugas gagal, waktu, komentar, SUS
4. **Analisis (Hari 6-7):** Identifikasi pola masalah, prioritas perbaikan
5. **Laporan (Hari 8):** Susun laporan uji usabilitas dengan rekomendasi

---

## 8. Kriteria Keberhasilan Uji

- Semua skenario dapat diselesaikan oleh ≥ 80% peserta tanpa bantuan
- Tidak ada masalah aksesibilitas kritis (tidak ada label, tidak ada fokus, touch < 44px)
- Skor SUS ≥ 68
- Setiap temuan memiliki rekomendasi perbaikan dan prioritas

---

## 9. Deliverable

1. **Laporan uji usabilitas** — temuan per peserta, metrik kuantitatif, rekomendasi
2. **Data mentah** — catatan observasi, skor SUS, waktu penyelesaian
3. **Backlog perbaikan** — daftar item yang perlu diperbaiki dengan prioritas
4. **Audit ulang** — verifikasi setelah perbaikan diterapkan

---

## 10. Timeline

| Minggu | Aktivitas |
|--------|-----------|
| Minggu 1 | Rekrut peserta, siapkan instrumen uji |
| Minggu 2 | Pelaksanaan uji (6 peserta) |
| Minggu 3 | Analisis data & susunan laporan |
| Minggu 4 | Presentasi hasil ke tim, buat backlog perbaikan |
| Minggu 5 | Perbaikan berdasarkan temuan uji |
| Minggu 6 | Audit ulang (regression) |

---

**Disusun oleh:** QA Engineer + Senior UI/UX Designer  
**Tanggal:** 21 November 2026  
**Status:** ⬜ Siap dieksekusi (menunggu jadwal pelaksanaan)