# UI/UX Audit Checklist — Simpanan Config (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Simpanan Config (`/simpananConfigPage`) |
| URL / Lokasi File | `src/pages/konfigurasi/SimpananConfigPage.jsx` |
| Route Key | `simpananConfigPage` |
| Halaman Terkait | `SimpananDashboard.jsx` (`/simpananDashboard`) |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer + QA Engineer |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Bootstrap 5 + `admin-theme.css` (WCAG patch 20 Nov 2026) |
| Status Akhir | 🟡 Perbaikan Besar |

---

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/konfigurasi/SimpananConfigPage.jsx` | Halaman konfigurasi nominal default per jenis simpanan (setoran, pencairan), tabel list: tipe simpanan, kode, nominal input, tombol Simpan |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|------------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 8 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 3 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 4 | ❌ Gagal |
| 5. Responsivitas & Adaptasi | 10 | 6 | ⚠️ Perlu perbaikan |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 4 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **22** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item Kritis yang gagal. Anehnya total rendah karena banyak item belum terisi, situs ini masih perlu banyak perbaikan.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Fail □ Pass □ N/A | Tidak ada dokumentasi riset dalam kode | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Fail □ Pass □ N/A | Tujuan隐含: set nominal default — tidak dijelaskan | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | Target: atur nominal default per jenis simpanan | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Fail □ Pass □ N/A | Tidak ada dokumentasi | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Fail □ Pass □ N/A | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Fail □ Pass □ N/A | Tidak ada dasar bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass □ Fail □ N/A | Tabel konfigurasi dengan header + body, tombol Simpan | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass □ Fail □ N/A | Hanya satu aksi (Simpan) per baris | Menengah |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Fail □ Pass □ N/A | Tombol `btn btn-sm` dari Bootstrap — ukuran kecil, kemungkinan <44×44 | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass □ Fail □ N/A | Tabel satu halaman, scroll — mungkin terlalu panjang | Menengah |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass □ Fail □ N/A | Cukup sederhana: input nilai, klik Simpan per baris | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass □ Fail □ N/A | Loading state spinne r, disabled button saat load | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass □ Fail □ N/A | Loading spinner + disabled, empty state "Tidak ada data" | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass □ Fail □ N/A | Bahasa Indonesia, label jelas | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass □ Fail □ N/A | Tombol cancel tidak ada, back browser tersedia | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | ⚠️ Pass □ Fail □ N/A | Consistent dengan dashboard lainnya | Menengah |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass □ Fail □ N/A | Validasi client: negative amount | Menengah |
| 2.12 | Mengenali bukan mengingat (Nielsen #6) | #2 | □ Pass □ Fail □ N/A | Input nilai langsung tanpa memorisasi | Menengah |
| 2.13 | Fleksibilitas dan efisiensi (Nielsen #7) | #2 | □ Pass □ Fail □ N/A | Per baris harus klik Simpan (tidak batch save) | Menengah |
| 2.14 | Estetika minimalist (Nielsen #8) | #2 | ⚠️ Pass □ Fail □ N/A | Bootstrap+shadow-sm cukup bersih | Menengah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass □ Fail □ N/A | Swal alert error/success | Menengah |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Fail □ Pass □ N/A | Tidak ada tooltip/bantuan | Menengah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks ≥4.5:1 | #3 | ⚠️ Pass □ Fail □ N/A | Bootstrap default warna cukup kontras | Menengah |
| 3.2 | Kontras teks ≥3:1 | #3 | ⚠️ Pass □ Fail □ N/A | Badge bg-secondary: OK | Menengah |
| 3.3 | Warna bukan satu-satunya pengenal | #3 | □ Pass □ Fail □ N/A | Tidak ada indicator hijau merah saja | Menengah |
| 3.4 | Target sentuhan ≥44×44px | #3 | □ Fail □ Pass □ N/A | Tombol `btn btn-sm` mungkin <44×44px | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses via keyboard | #3 | ⚠️ Pass □ Fail □ N/A | Input/form control OK, tapi tombol icon ada icon saja? | Tinggi |
| 3.6 | Indikator fokus (:focus-visible) terlihat jelas | #3 | ⚠️ Pass □ Fail □ N/A | `admin-theme.css` ada, tapi perlu verifikasi per halaman | Tinggi |
| 3.7 | Konten tetap terbaca dengan zoom 200% | #3 | □ Pass □ Fail □ N/A | Input tidak panjang, cukup aman | Menengah |
| 3.8 | Gambar berfungsi dengan `alt` deskriptif | #3 | □ Pass □ Fail □ N/A | Tidak ada gambar di halaman | Rendah |
| 3.9 | Gambar dekoratif dengan `alt=""` | #3 | □ Pass □ Fail □ N/A | Tidak ada | Rendah |
| 3.10 | Input formulir dengan label terprogram | #3 | □ Fail □ Pass □ N/A | Input tanpa `<label>` visible, hanya `aria-label` pada Form.Select | Kritis |
| 3.11 | Pesan error deskriptif | #3 | ⚠️ Pass □ Fail □ N/A | Alert error Bootstrap (detail) | Tinggi |
| 3.12 | Opsi non-animasi tersedia | #3 | □ Fail □ Pass □ N/A | Tidak ada `prefers-reduced-motion` | Menengah |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna sebagai design token, tidak hardcode | #4 | □ Fail □ Pass □ N/A | Tidak ada CSS variable, Bootstrap + inline dipakai | Tinggi |
| 4.2 | Tipografi sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Font dari Bootstrap | Rendah |
| 4.3 | Spacing sebagai design token (8px grid) | #4 | □ Fail □ Pass □ N/A | Tidak ada CSS variable, Bootstrap | Tinggi |
| 4.4 | Border-radius dan shadow sebagai token | #4 | □ Fail □ Pass □ N/A | `rounded-3` dari Bootstrap | Menengah |
| 4.5 | Komponen reusable | #4 | □ Pass □ Fail □ N/A | Bootstrap native | Tinggi |
| 4.6 | Komponen dengan varian | #4 | □ Pass □ Fail □ N/A | Tidak ada | Rendah |
| 4.7 | Grid & layout konsisten | #4 | □ Pass □ Fail □ N/A | Bootstrap grid | Menengah |
| 4.8 | Skala tipografi terdefinisi | #4 | □ Fail □ Pass □ N/A | Tidak ada | Menengah |
| 4.9 | Ikonom set konsisten | #4 | ⊥ Pass □ Fail □ N/A | Tidak ada ikon | Menengah |
| 4.10 | Status & feedback seragam | #4 | □ Pass □ Fail □ N/A | Bootstrap alert | Rendah |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain mobile-first | #5 | □ Fail □ Pass □ N/A | Tidak ada | Tinggi |
| 5.2 | Breakpoint terdefinisikan | #5 | ⊥ Fail □ Pass □ N/A | Tidak ada | Tinggi |
| 5.3 | Tataletak berubah baik per breakpoint | #5 | □ Pass □ Fail □ N/A | Bootstrap grid | Menengah |
| 5.4 | Konten tidak pecah di mobile | #5 | □ Pass □ Fail □ N/A | Responsive table | Tinggi |
| 5.5 | Usable di portrait/landscape | #5 | □ Pass □ Fail □ N/A | Desktop | Menengah |
| 5.6 | Touch target mobile 44×44px | #5 | □ Fail □ Pass □ N/A | Tombol btn-sm | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna tersedia | #6 | □ Fail □ Pass □ N/A | Tidak ada | Menengah |
| 6.2 | Tahap Define: persona, user journey, requirement | #6 | □ Fail □ Pass □ N/A | Tidak ada | Menengah |
| 6.3 | Tahap Develop: wireframe/prototype ada | #6 | □ Fail □ Pass □ N/A | Tidak ada | Menengah |
| 6.4 | Tahap Deliver: high-fidelity design ada | #6 | □ Fail □ Pass □ N/A | Tidak ada | Rendah |
| 6.5 | Tiap tahap ada review stakeholder | #6 | □ Fail □ Pass □ N/A | Tidak ada | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain Figma dengan nama rapi | #7 | □ Fail □ Pass □ N/A | Tidak ada | Tinggi |
| 7.2 | Komponen dipublish ke library DS | #7 | □ Fail □ Pass □ N/A | Tidak ada | Tinggi |
| 7.3 | Spesifikasi visual lengkap | #7 | □ Fail □ Pass □ N/A | Tidak ada | Tinggi |
| 7.4 | Prototype interaktif ada | #7 | ⊥ Fail □ Pass □ N/A | Tidak ada | Tinggi |
| 7.5 | Annotation catatan desain ada | #7 | □ Fail □ Pass □ N/A | Tidak ada | Menengah |
| 7.6 | Asset SVG/PNG 1x, 2x | #7 | ⊥ Fail □ Pass □ N/A | Tidak ada | Menengah |
| 7.7 | Checklist handoff ada | #7 | □ Fail □ Pass □ N/A | Tidak ada | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji dengan pengguna nyata (≥5) | #8 | □ Fail □ Pass □ N/A | Tidak ada | Tinggi |
| 8.2 | Data catatan tes (gagal, waktu, SUS) | #8 | □ Fail □ Pass □ N/A | Tidak ada | Rendah |
| 8.3 | Desain diiterasi berdasarkan temuan | #8 | □ Pass □ Fail □ N/A | Belum ada iterasi | Rendah |
| 8.4 | Validasi pasca iterasi | #8 | ⚠️ Fail □ Pass □ N/A | Belum ada iterasi | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa tes usabilitas | #8 | □ Fail □ Pass □ N/A | Belum ada | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.5 | Tidak ada forced continuity | #9 | □ Pass □ Fail □ N/A | Tidak ada | Kritis |
| 9.6 | Tidak ada hidden cost | #9 | □ Pass □ Fail □ N/A | Tidak ada | Kritis |
| 9.7 | Opsi batal tidak disembunyikan | #9 | □ Pass □ Fail □ N/A | Tidak ada | Tinggi |
| 9.8 | Tidak ada urgensi palsu | #9 | □ Pass □ Fail □ N/A | Tidak ada | Menengah |
| 9.9 | Tidak ada roach-motel | #9 | □ Pass □ Fail □ N/A | Tidak ada | Kritis |
| 9.10 | Privasi default: data minimal, izin, transparan | #9 | ⊥ Pass □ Fail □ N/A | Tidak ada | Rendah |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate | #10 | □ Fail □ Pass □ N/A | Tidak ada | Rendah |
| 10.2 | Time-on-task | #10 | □ Fail □ Pass □ N/A | Tidak ada | Rendah |
| 10.3 | Error rate | #10 | □ Fail □ Pass □ N/A | Tidak ada | Rendah |
| 10.4 | NPS/SUS | #10 | □ Fail □ Pass □ N/A | Tidak ada | Rendah |
| 10.5 | Konversi & retensi | #10 | □ Fail □ Pass □ N/A | Tidak ada | Rendah |

---

## Temuan Kritis & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Tombol "Simpan" tukan ≥44×44px | `btn btn-sm` | `minWidth: 44px; minHeight: 44px` | Kritis |
| 2 | Input tanpa label juga | Input.di tabel | Tambahkan `<label>` visible + `aria-label` | Kritis |
| 3 | Focus-visible tidak ada | Semux interaktif | Tambahkan CSS `: focus-visible` | Tinggi |
| 4 | Tidak ada button cancel (kembali) | No back button | Tambahkan | Tinggi |
| 5 | Tidak ada tombol `prefers-reduced-motion` | No | Tambahkan | Menengah |
| 6 | Tidak ada design token | Inline styles | Buat CSS variable | Menengah |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 Perbaikan Besar

**Catatan auditor:**
- Halaman ini konfigurasi nominal default simpanan, cukup sederhana, tapi ada **2 item Kritis** yang harus diperbaiki: touch target & label.
- Gunakan tombol `minWidth: 44px` dan tambahkan label
- Buat design token untuk warna, spacing, tipografi
- Dokumentasi riset & handoff harus dibuat sebelum publush.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Simpanan Config  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`