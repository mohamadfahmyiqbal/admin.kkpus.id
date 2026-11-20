# UI/UX Audit Checklist — Investasi Halal Report

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Investasi Halal Report |
| URL / Lokasi File | `src/pages/investasi/halal/InvestasiReportPage.jsx` |
| Route Key | `investasiHalalReport` |
| Protected Route | ✅ Ya |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Tidak diketahui |
| Status Akhir | 🟡 Perbaikan Besar |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 6 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 3 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 3 | ❌ Gagal |
| 5. Responsivitas & Adaptasi | 10 | 6 | ⚠️ Perlu perbaikan |
| 6. Proses Desain (Double Diamond) | 5 | 0 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 3 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **30** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan | #1 | □ Fail | Tidak ada dokumentasi riset | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) | #1 | □ Fail | Tidak ada | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Fail | Tujuan: review laporan investasi, jurnal – tidak terdokumentasi | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Fail | Tidak ada | Menengah |
| 1.5 | User journey / user flow dilacak | #1 | □ Fail | Tidak ada | Tinggi |
| 1.6 | Keputusan desain diturunkan dari riset | #1 | □ Fail | Tidak ada basis bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Jakob's Law | #2 | □ Pass | Layout tab & tabel mengikuti konvensi admin panel | Menengah |
| 2.2 | Hick's Law | #2 | □ Pass | 2 tab (List Report, Jurnal Report), 9 filter per baris – manageable | Menengah |
| 2.3 | Fitts's Law | #2 | □ Fail | Ikon aksi kecil, tombol filter tanpa padding cukup | Tinggi |
| 2.4 | Miller's Law | #2 | □ Pass | Data chunked ke 2 tab | Menengah |
| 2.5 | Tesler's Law | #2 | □ Pass | Operasi filter dan export jelas | Menengah |
| 2.6 | Doherty Threshold | #2 | □ Pass | Loading spinner, async API call | Menengah |
| 2.7 | Nielsen #1 Visibilitas status | #2 | □ Pass | Spinner, tombol disabled saat loading | Tinggi |
| 2.8 | Nielsen #2 Bahasa | #2 | □ Pass | Bahasa Indonesia, label jelas | Menengah |
| 2.9 | Nielsen #3 Kontrol | #2 | □ Pass | Tombol Batal pada modal, reset filter | Tinggi |
| 2.10 | Nielsen #4 Konsistensi | #2 | □ Pass | Menggunakan komponen Bootstrap konsisten | Tinggi |
| 2.11 | Nielsen #5 Pencegahan kesalahan | #2 | □ Pass | Validasi file, SweetAlert2 konfirmasi | Menengah |
| 2.12 | Nielsen #6 Pengenalan | #2 | □ Pass | Ikon Phosphor‑react + teks label | Menengah |
| 2.13 | Nielsen #7 Fleksibilitas | #2 | □ Pass | Export Excel, filter per kolom | Rendah |
| 2.14 | Nielsen #8 Minimalis | #2 | □ Pass | Layout clean | Rendah |
| 2.15 | Nielsen #9 Pemulihan | #2 | □ Pass | Reset filter, error message | Tinggi |
| 2.16 | Nielsen #10 Bantuan | #2 | □ Fail | Tidak ada tooltip/help | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks ≥ 4.5:1 | #3 | □ Fail | Tidak diverifikasi | Kritis |
| 3.2 | Kontras elemen UI ≥ 3:1 | #3 | □ Fail | Tidak diverifikasi | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal | #3 | □ Pass | Badge status menggunakan label teks | Kritis |
| 3.4 | Target ≥ 44 × 44 px | #3 | □ Fail | Filter input, tombol aksi < 44 px | Kritis |
| 3.5 | Keyboard navigasi | #3 | □ Pass | Elemen standar HTML | Kritis |
| 3.6 | Fokus terlihat jelas | #3 | □ Fail | Tidak ada style `:focus-visible` khusus | Kritis |
| 3.7 | Zoom 200% | #3 | □ Pass | Layout tidak break | Tinggi |
| 3.8 | Alt deskriptif | #3 | □ Pass | Tidak ada gambar | Tinggi |
| 3.9 | Alt dekoratif | #3 | □ Pass | `aria-hidden="true"` pada ikon dekoratif | Rendah |
| 3.10 | Label terprogram dan terlihat | #3 | □ Fail | Filter hanya `aria-label="Filter Cari"` (lihat `InvestasiListReportTab.jsx` baris 48‑160) | Kritis |
| 3.11 | Error deskriptif | #3 | □ Pass | Error message dari API + SweetAlert2 | Tinggi |
| 3.12 | prefers-reduced-motion | #3 | □ Fail | Animasi `animate-fade-in` tanpa kontrol | Menengah |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Design token warna | #4 | □ Fail | Bootstrap classes + inline style | Tinggi |
| 4.2 | Design token tipografi | #4 | □ Fail | Inline style, tidak ada token | Tinggi |
| 4.3 | Design token spacing | #4 | □ Fail | Bootstrap spacing + inline style | Tinggi |
| 4.4 | Token border-radius/shadow | #4 | □ Pass | `rounded-4`, `shadow-sm` | Menengah |
| 4.5 | Komponen reusable | #4 | □ Pass | Header, tab report, status badge reusable | Tinggi |
| 4.6 | Komponen varian | #4 | □ Pass | Variasi badge (PENDING, APPROVED, PAID, REJECTED) | Tinggi |
| 4.7 | Grid/layout konsisten | #4 | □ Pass | Bootstrap grid konsisten | Tinggi |
| 4.8 | Skala tipografi | #4 | □ Fail | Tidak ada skala terpusat | Menengah |
| 4.9 | Ikonset konsisten | #4 | □ Pass | Phosphor‑react, Bootstrap Icons | Menengah |
| 4.10 | Status seragam | #4 | □ Pass | Badge warna Bootstrap seragam | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Mobile‑first | #5 | □ Pass | Bootstrap responsive grid | Tinggi |
| 5.2 | Breakpoint jelas | #5 | □ Pass | Menggunakan Bootstrap breakpoints | Tinggi |
| 5.3 | Layout berubah baik | #5 | □ Pass | Header wrap, tabel scroll horizontal | Tinggi |
| 5.4 | Konten tidak pecah | #5 | □ Pass | Table responsive wrapper | Tinggi |
| 5.5 | Portrait & landscape | #5 | □ Pass | Tidak ada constraint | Menengah |
| 5.6 | Touch target mobile | #5 | □ Fail | Filter input, tombol aksi kecil | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Discover | #6 | □ Fail | Tidak ada artefak | Menengah |
| 6.2 | Define | #6 | □ Fail | Tidak ada | Menengah |
| 6.3 | Develop | #6 | □ Fail | Tidak ada wireframe | Menengah |
| 6.4 | Deliver | #6 | □ Fail | Tidak ada handoff | Tinggi |
| 6.5 | Review stakeholder | #6 | □ Fail | Tidak ada | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File Figma terstruktur | #7 | □ Fail | Tidak tersedia | Tinggi |
| 7.2 | Library design system | #7 | □ Fail | Tidak ada | Tinggi |
| 7.3 | Spesifikasi visual | #7 | □ Fail | Tidak ada | Tinggi |
| 7.4 | Prototype interaktif | #7 | □ Fail | Tidak ada | Tinggi |
| 7.5 | Annotation | #7 | □ Fail | Tidak ada | Menengah |
| 7.6 | Asset ekspor | #7 | □ Fail | Tidak ada | Menengah |
| 7.7 | Checklist handoff | #7 | □ Fail | Belum dilakukan | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba pengguna | #8 | □ Fail | Tidak ada | Tinggi |
| 8.2 | Data uji coba | #8 | □ Fail | Tidak ada | Tinggi |
| 8.3 | Iterasi desain | #8 | □ Fail | Tidak ada | Tinggi |
| 8.4 | Validasi ulang | #8 | □ Fail | Tidak ada | Menengah |
| 8.5 | Fitur tanpa uji | #8 | □ Fail | Tidak ada proses | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity | #9 | □ Pass | Tidak relevan | Kritis |
| 9.2 | Tidak ada hidden cost | #9 | □ Pass | Tidak relevan | Kritis |
| 9.3 | Opsi batal terlihat | #9 | □ Pass | Tombol Batal/Tutup | Kritis |
| 9.4 | Tidak ada urgency palsu | #9 | □ Pass | Tidak ada | Menengah |
| 9.5 | Tidak ada roach‑motel | #9 | □ Pass | Tidak ada pendaftaran | Kritis |
| 9.6 | Privasi default | #9 | □ Fail | Data anggota (nama, no anggota) tanpa maskir | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate | #10 | □ Fail | Tidak ada | Rendah |
| 10.2 | Time‑on‑task | #10 | □ Fail | Tidak ada | Rendah |
| 10.3 | Error rate | #10 | □ Fail | Tidak ada | Rendah |
| 10.4 | NPS / SUS | #10 | □ Fail | Tidak ada | Rendah |
| 10.5 | Konversi dan retensi | #10 | □ Fail | Tidak ada | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Filter input hanya `aria-label="Filter Cari"` (tidak deskriptif per kolom) | `InvestasiListReportTab.jsx` baris 48‑160 | Ubah `aria-label` per kolom (mis. "Filter Cari Nama Anggota", "Filter Cari No Anggota") | **Kritis** |
| 2 | Target aksi < 44 × 44 px (tombol filter, tombol export) | `InvestasiReportHeader.jsx` baris 14‑21, `InvestasiListReportTab.jsx` | Tambahkan padding atau perbesar tombol | **Kritis** |
| 3 | Tidak ada focus-visible style | Seluruh file | Tambahkan `:focus-visible { box-shadow: 0 0 0 3px var(--primary); }` | **Kritis** |
| 4 | Kontras warna tidak diverifikasi | Seluruh badge dan tabel | Audit kontras, gunakan rasio ≥ 4.5:1 | **Kritis** |
| 5 | Data anggota tanpa maskir | `InvestasiListReportTab.jsx` baris 188‑215 | Maskir data sensitif | **Tinggi** |
| 6 | Animasi `animate-fade-in` tidak menghormati reduced‑motion | `InvestasiReportPage.jsx` baris 120 | Tambahkan media query `prefers-reduced-motion` | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

- Perbaiki aksesibilitas (target size, label deskriptif, focus, kontras) sebagai prioritas.
- Buat dokumentasi desain lengkap (Figma, wireframe, spesifikasi).
- Lakukan uji kegunaan dengan minimal 5 admin.
- Migrasikan inline style ke design token.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Investasi Halal Report  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`