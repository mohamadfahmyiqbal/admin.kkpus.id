# UI/UX Audit Checklist — Training Page (Manajemen Training & Edukasi)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Training Page (Manajemen Training & Edukasi) |
| URL / Lokasi File | `src/pages/training/TrainingPage.jsx` |
| Route Key | `trainingPage` |
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
| 2. Hukum UX & Heuristik | 10 | 5 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 3 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 3 | ❌ Gagal |
| 5. Responsivitas & Adaptasi | 10 | 6 | ⚠️ Perlu perbaikan |
| 6. Proses Desain (Double Diamond) | 5 | 0 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 3 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **26** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama | #1 | □ Fail | Tidak ada | Tinggi |
| 1.2 | JTBD | #1 | □ Fail | Tidak ada | Tinggi |
| 1.3 | User goal | #1 | □ Fail | Tidak terdokumentasi | Tinggi |
| 1.4 | Pain point | #1 | □ Fail | Tidak ada | Menengah |
| 1.5 | User journey | #1 | □ Fail | Tidak ada | Tinggi |
| 1.6 | Basis riset | #1 | □ Fail | Tidak ada | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Jakob's Law | #2 | □ Pass | Layout tab & tabel mengikuti konvensi admin panel | Menengah |
| 2.2 | Hick's Law | #2 | □ Fail | 4 tab utama, modal form dengan banyak field – terlalu banyak opsi | Menengah |
| 2.3 | Fitts's Law | #2 | □ Fail | Icon aksi (Edit, Hapus) 32 × 32 px < 44 px (baris 130‑149, 240‑259, 358‑370) | Tinggi |
| 2.4 | Miller's Law | #2 | □ Pass | Data chunked ke 4 tab, form chunked | Menengah |
| 2.5 | Tesler's Law | #2 | □ Pass | CRUD, form modal jelas | Menengah |
| 2.6 | Doherty Threshold | #2 | □ Pass | Loading spinner, tombol disabled saat aksi | Menengah |
| 2.7 | Nielsen #1 | #2 | □ Pass | Loading, badge status, summary | Tinggi |
| 2.8 | Nielsen #2 | #2 | □ Pass | Bahasa Indonesia | Menengah |
| 2.9 | Nielsen #3 | #2 | □ Pass | Tombol Batal pada modal, bisa kembali | Tinggi |
| 2.10 | Nielsen #4 | #2 | □ Pass | Bootstrap konsisten | Tinggi |
| 2.11 | Nielsen #5 | #2 | □ Pass | Validasi form, SweetAlert2 konfirmasi | Menengah |
| 2.12 | Nielsen #6 | #2 | □ Pass | Icon + label | Menengah |
| 2.13 | Nielsen #7 | #2 | □ Pass | CRUD, modal | Rendah |
| 2.14 | Nielsen #8 | #2 | □ Pass | Layout clean | Rendah |
| 2.15 | Nielsen #9 | #2 | □ Pass | Error message, SweetAlert2 | Tinggi |
| 2.16 | Nielsen #10 | #2 | □ Fail | Tidak ada tooltip/help | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras ≥ 4.5:1 | #3 | □ Fail | Tidak diverifikasi | Kritis |
| 3.2 | Kontras UI ≥ 3:1 | #3 | □ Fail | Tidak diverifikasi | Kritis |
| 3.3 | Warna bukan satu-satunya | #3 | □ Pass | Badge status + label | Kritis |
| 3.4 | Target ≥ 44 × 44 px | #3 | □ Fail | Icon aksi 32 × 32 px | Kritis |
| 3.5 | Keyboard | #3 | □ Pass | Elemen standar | Kritis |
| 3.6 | Fokus | #3 | □ Fail | Tidak ada style `:focus-visible` | Kritis |
| 3.7 | Zoom 200% | #3 | □ Pass | Layout tidak break | Tinggi |
| 3.8 | Alt deskriptif | #3 | □ Pass | Tidak ada gambar | Tinggi |
| 3.9 | Alt dekoratif | #3 | □ Pass | `aria-hidden="true"` | Rendah |
| 3.10 | Label terprogram & terlihat | #3 | □ Fail | Input form menggunakan `aria-label="Filter ..."` yang tidak sesuai konteks (mis. "Filter Cari", "Filter Judul Materi") bukan label form (baris 547, 574, 717, 770) | Kritis |
| 3.11 | Error | #3 | □ Pass | SweetAlert2 + Form validation | Tinggi |
| 3.12 | prefers-reduced-motion | #3 | □ Fail | Tidak ada | Menengah |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Token warna | #4 | □ Fail | Bootstrap + inline | Tinggi |
| 4.2 | Token tipografi | #4 | □ Fail | Inline style | Tinggi |
| 4.3 | Token spacing | #4 | □ Fail | Bootstrap spacing + inline | Tinggi |
| 4.4 | Token border/shadow | #4 | □ Pass | `rounded-4`, `shadow-sm` | Menengah |
| 4.5 | Komponen reusable | #4 | □ Pass | Tab, modal komponen terpisah | Tinggi |
| 4.6 | Varian | #4 | □ Pass | Tombol variant, badge status | Tinggi |
| 4.7 | Grid/layout | #4 | □ Pass | Bootstrap grid | Tinggi |
| 4.8 | Skala tipografi | #4 | □ Fail | Tidak ada | Menengah |
| 4.9 | Ikonset | #4 | □ Pass | Phosphor‑react | Menengah |
| 4.10 | Status seragam | #4 | □ Pass | Badge warna | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Mobile‑first | #5 | □ Pass | Bootstrap responsive | Tinggi |
| 5.2 | Breakpoint | #5 | □ Pass | Bootstrap breakpoints | Tinggi |
| 5.3 | Layout berubah | #5 | □ Pass | Tab scroll horizontal, tabel scroll | Tinggi |
| 5.4 | Konten | #5 | □ Pass | Table responsive | Tinggi |
| 5.5 | Orientasi | #5 | □ Pass | Tidak ada constraint | Menengah |
| 5.6 | Touch target | #5 | □ Fail | Icon aksi 32 × 32 px | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Discover | #6 | □ Fail | Tidak ada | Menengah |
| 6.2 | Define | #6 | □ Fail | Tidak ada | Menengah |
| 6.3 | Develop | #6 | □ Fail | Tidak ada | Menengah |
| 6.4 | Deliver | #6 | □ Fail | Tidak ada | Tinggi |
| 6.5 | Review | #6 | □ Fail | Tidak ada | Menengah |

---

## Bagian 7: Deliverable & Handoff (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | Figma | #7 | □ Fail | Tidak tersedia | Tinggi |
| 7.2 | Library | #7 | □ Fail | Tidak ada | Tinggi |
| 7.3 | Spesifikasi | #7 | □ Fail | Tidak ada | Tinggi |
| 7.4 | Prototype | #7 | □ Fail | Tidak ada | Tinggi |
| 7.5 | Annotation | #7 | □ Fail | Tidak ada | Menengah |
| 7.6 | Asset | #7 | □ Fail | Tidak ada | Menengah |
| 7.7 | Checklist | #7 | □ Fail | Belum dilakukan | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba | #8 | □ Fail | Tidak ada | Tinggi |
| 8.2 | Data | #8 | □ Fail | Tidak ada | Tinggi |
| 8.3 | Iterasi | #8 | □ Fail | Tidak ada | Tinggi |
| 8.4 | Validasi | #8 | □ Fail | Tidak ada | Menengah |
| 8.5 | Tanpa uji | #8 | □ Fail | Tidak ada | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Forced continuity | #9 | □ Pass | Tidak relevan | Kritis |
| 9.2 | Hidden cost | #9 | □ Fail | Kunci jawaban evaluasi terlihat di tabel (baris 348‑349) – data sensitif terpapar | Kritis |
| 9.3 | Opsi batal | #9 | □ Pass | Modal Batal | Kritis |
| 9.4 | Urgency palsu | #9 | □ Pass | Tidak ada | Menengah |
| 9.5 | Roach‑motel | #9 | □ Pass | Tidak ada pendaftaran | Kritis |
| 9.6 | Privasi | #9 | □ Fail | Kunci jawaban, nama anggota tanpa maskir | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate | #10 | □ Fail | Tidak ada | Rendah |
| 10.2 | Time‑on‑task | #10 | □ Fail | Tidak ada | Rendah |
| 10.3 | Error rate | #10 | □ Fail | Tidak ada | Rendah |
| 10.4 | NPS / SUS | #10 | □ Fail | Tidak ada | Rendah |
| 10.5 | Konversi/retensi | #10 | □ Fail | Tidak ada | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Icon aksi (Edit, Hapus) 32 × 32 px < 44 × 44 px | `TrainingPage.jsx` baris 130‑149, 240‑259, 358‑370 | Perbesar icon button atau tambahkan padding | **Kritis** |
| 2 | `aria-label` pada input form tidak sesuai konteks ("Filter Cari" vs label form) | `TrainingPage.jsx` baris 547, 574, 717, 770 | Ganti dengan label yang sesuai (mis. "Nama Kurikulum", "Judul Materi") | **Kritis** |
| 3 | Fokus visual tidak jelas | Seluruh komponen | Terapkan `:focus-visible` | **Kritis** |
| 4 | Kontras warna tidak diverifikasi | Badge & tabel | Audit kontras | **Kritis** |
| 5 | Kunci jawaban evaluasi terlihat tanpa otorisasi khusus | `TrainingPage.jsx` baris 348‑349 | Maskir atau sembunyikan jawaban untuk user yang tidak berwenang | **Tinggi** |
| 6 | Nama anggota ranking tanpa maskir | `TrainingPage.jsx` baris 453‑455 | Maskir data sensitif | **Tinggi** |
| 7 | Tidak ada dokumentasi/handoff | Seluruh halaman | Buat artefak desain | **Menengah** |
| 8 | Form evaluation modal tidak memiliki validasi per opsi (A, B, C, D) wajib diisi | `TrainingPage.jsx` baris 938‑950 | Tambahkan validasi required per opsi | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

- Perbaiki aksesibilitas kritis (target size, label, focus, kontras).
- Maskir data sensitif (kunci jawaban, nama anggota).
- Buat dokumentasi desain lengkap.
- Lakukan uji kegunaan dengan minimal 5 admin.
- Migrasikan inline style ke design token.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Training Page (Manajemen Training & Edukasi)  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`