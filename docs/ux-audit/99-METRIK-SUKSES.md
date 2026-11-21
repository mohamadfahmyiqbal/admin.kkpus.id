# Definisi Metrik Sukses — Admin KKPUS

**Tanggal:** 21 November 2026  
**Status:** Draft (siap ditetapkan)  
**Referensi:** `docs/ux-audit/99-REKAPITULASI.md` (Prioritas 3, Item 4 — Pending)  
**Standar:** ISO/IEC 25010, WCAG 2.2 AA, Nielsen's 10 Heuristics  

---

## 1. Tujuan

Menetapkan metrik sukses yang dapat diukur untuk menilai efektivitas perbaikan UI/UX Admin KKPUS, sehingga tim dapat memantau progres dan menentukan kapan halaman dianggap "lulus" audit.

---

## 2. Kategori Metrik

| Kategori | Metrik | Target | Frekuensi Pengukuran | Sumber Data |
|----------|--------|--------|---------------------|-------------|
| **Efektivitas** | Task Success Rate | ≥ 80% | Setiap iterasi uji | Uji usabilitas |
| **Efisiensi** | Time-on-task | ≤ 120 detik per skenario | Setiap iterasi uji | Uji usabilitas |
| **Error** | Error Rate | ≤ 2 per skenario | Setiap iterasi uji | Uji usabilitas |
| **Kepuasan** | SUS Score | ≥ 68 | Setiap iterasi uji | Angket SUS |
| **Loyalitas** | NPS | ≥ 7 | Setiap rilis besar | Angket pengguna |
| **Aksesibilitas** | WCAG 2.2 AA Compliance | 100% item kritis lulus | Setiap audit ulang | Audit aksesibilitas |
| **Aksesibilitas** | Touch Target ≥ 44×44 px | 100% elemen interaktif | Setiap audit ulang | Inspeksi visual |
| **Aksesibilitas** | Input Label Terprogram | 100% input filter/form | Setiap audit ulang | Inspeksi kode |
| **Aksesibilitas** | Tabel ARIA Caption | 100% tabel data | Setiap audit ulang | Inspeksi kode |
| **Privasi** | Data Sensitif Maskir | 100% tabel anggota/transaksi | Setiap audit ulang | Inspeksi kode |
| **Desain Sistem** | Design Token Adoption | ≥ 80% warna/spacing/tipografi | Setiap rilis | Inspeksi kode |
| **Responsivitas** | Tablet Breakpoint Support | 768px-1023px functional | Setiap rilis | Uji perangkat |
| **Proses** | Handoff Dokumen Terupdate | 100% halaman utama | Setiap rilis | Review dokumen |
| **Proses** | Usability Test Terjadi | Minimal 1 siklus per fitur baru | Setiap rilis | Laporan uji |

---

## 3. Kriteria Lulus per Halaman

Sebuah halaman dinyatakan **LULUS** audit UI/UX jika memenuhi semua kriteria berikut:

| No | Kriteria | Threshold |
|----|----------|-----------|
| 1 | Skor total audit | ≥ 70/80 |
| 2 | Item Kritis yang gagal | 0 item |
| 3 | Task Success Rate (uji usabilitas) | ≥ 80% |
| 4 | SUS Score | ≥ 68 |
| 5 | WCAG 2.2 AA kritis (label, focus, touch, caption) | 100% lulus |
| 6 | Data sensitif maskir | 100% tabel terkait |
| 7 | Design token digunakan | ≥ 80% elemen visual |

---

## 4. Metrik per Halaman (Target Awal)

| Halaman | Skor Audit Saat Ini | Target Skor | Task Success Rate | SUS Target |
|---------|---------------------|-------------|-------------------|------------|
| Splash Page | 14/80 | ≥ 70 | — | — |
| Login Page | 28/80 | ≥ 70 | ≥ 85% | ≥ 70 |
| Dashboard | 27/80 | ≥ 70 | ≥ 80% | ≥ 68 |
| Members | 27/80 | ≥ 70 | ≥ 80% | ≥ 68 |
| Simpanan Dashboard | 27/80 | ≥ 70 | ≥ 80% | ≥ 68 |
| Jual Beli Dashboard | 27/80 | ≥ 70 | ≥ 75% | ≥ 68 |
| Simpanan Report | 29/80 | ≥ 70 | ≥ 75% | ≥ 65 |
| Pinjaman Report | 23/80 | ≥ 70 | ≥ 70% | ≥ 65 |
| Tabungan Report | 15/80 | ≥ 70 | ≥ 70% | ≥ 65 |
| Semua laporan lainnya | 15–33/80 | ≥ 70 | ≥ 70% | ≥ 65 |

---

## 5. Metrik Proses & Dokumentasi

| Metrik | Target | Status Saat Ini |
|--------|--------|-----------------|
| Dokumen Persona & User Journey | Tersedia & divalidasi stakeholder | ✅ Tersedia (`99-PERSONA-USER-JOURNEY.md`) |
| Desain Spec (Figma/Stitch) | Tersedia & terkait ke halaman audit | ✅ Tersedia (`99-DESIGN-SPEC-GOOGLE-STITCH.md`) |
| Uji Usabilitas (≥5 user) | Minimal 1 siklus selesai | ⬜ Belum dilakukan |
| Metrik Sukses Ditetapkan | Dokumen ini disetujui tim | ⬜ Draft (siap disetujui) |
| Handoff Deliverables | Checklist handoff ditandai semua halaman | ⬜ Belum dilakukan |
| Audit Ulang (Regression) | Semua halaman dicek ulang setelah perbaikan | ⬜ Belum dilakukan |

---

## 6. Pelaporan & Review

| Laporan | Frekuensi | Penerima | Konten |
|---------|-----------|----------|--------|
| Progres Perbaikan UI/UX | Setiap minggu | Tim Developer, Desain, PM | Skor audit, item selesai, backlog |
| Laporan Uji Usabilitas | Setiap siklus uji | Tim Desain, PM | Metrik kuantitatif, temuan kualitatif, rekomendasi |
| Laporan Aksesibilitas | Setiap audit ulang | Tim Developer, QA | WCAG compliance, item gagal, perbaikan |
| Laporan Akhir Audit | Setiap rilis besar | Stakeholder eksekutif | Ringkasan skor, rekomendasi, rencana selanjutnya |

---

## 7. Review & Penyesuaian Metrik

Metrik ini akan ditinjau ulang setiap:
- Setiap rilis besar (major release)
- Setiap selesainya siklus uji usabilitas
- Setiap ada perubahan signifikan pada arsitektur front-end

Penyesuaian metrik harus disetujui oleh: Senior UI/UX Designer, QA Engineer, dan Product Manager.

---

**Disusun oleh:** QA Engineer + Senior UI/UX Designer  
**Tanggal:** 21 November 2026  
**Status:** ⬜ Menunggu persetujuan tim