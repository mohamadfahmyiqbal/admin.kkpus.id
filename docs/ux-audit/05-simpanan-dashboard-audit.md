# UI/UX Audit Checklist — Simpanan Dashboard

> **PERHATIAN:** File ini masih template kosong. Audit lengkap Simpanan Dashboard tersedia di **`05-simpanan-page-audit.md`** (skor 27/80, status: 🟡 Perbaikan Besar → Perbaikan Diterapkan).
>
> File audit ini (`05-simpanan-dashboard-audit.md`) dibuat secara otomatis oleh index generator namun tidak terisi. Gunakan `05-simpanan-page-audit.md` sebagai referensi utama.

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Simpanan Dashboard |
| URL / Lokasi File | `src/pages/simpanan/SimpananDashboard.jsx` |
| Route Key | `simpananDashboard` |
| Protected Route | ✅ Ya |
| Auditor | |
| Tanggal Audit | |
| Versi Design System | |
| Status Akhir | □ Lulus □ Perbaikan Minor □ Perbaikan Besar □ Tidak Lulus |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | | |
| 2. Hukum UX & Heuristik | 10 | | |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | | |
| 4. Design System & Konsistensi | 10 | | |
| 5. Responsivitas & Adaptasi | 10 | | |
| 6. Proses Desain (Double Diamond) | 5 | | |
| 7. Deliverable & Handoff | 5 | | |
| 8. Uji Usabilitas & Iterasi | 5 | | |
| 9. Etika & Anti Dark Pattern | 5 | | |
| 10. Metrik Sukses | 5 | | |
| **Total** | **80** | | |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Pass □ Fail □ N/A | | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Pass □ Fail □ N/A | | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Pass □ Fail □ N/A | | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Pass □ Fail □ N/A | | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Pass □ Fail □ N/A | | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Pass □ Fail □ N/A | | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass □ Fail □ N/A | | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass □ Fail □ N/A | | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass □ Fail □ N/A | | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass □ Fail □ N/A | | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass □ Fail □ N/A | | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass □ Fail □ N/A | | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass □ Fail □ N/A | | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Pass □ Fail □ N/A | | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi, peringatan, atau aksi | #3 | □ Pass □ Fail □ N/A | | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px (atau 24 × 24 CSS dengan padding memadai) | #3 | □ Pass □ Fail □ N/A | | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass □ Fail □ N/A | | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | □ Pass □ Fail □ N/A | | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% tanpa assistive technology | #3 | □ Pass □ Fail □ N/A | | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | □ Pass □ Fail □ N/A | | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di-siapkan sebagai dekoratif | #3 | □ Pass □ Fail □ N/A | | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Pass □ Fail □ N/A | | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | □ Pass □ Fail □ N/A | | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | □ Pass □ Fail □ N/A | | Menengah |

### Perbaikan yang Telah Diterapkan (20 Nov 2026)

| No | Perbaikan | File | Detail |
|----|-----------|------|--------|
| 1 | **Caption & scope pada tabel** | `TransactionTable.jsx` | Ditambahkan `<caption className="visually-hidden">` dan `scope="col"` pada semua `<th>` |
| 2 | **Touch target ≥ 44×44 px** | `TransactionTable.jsx` (tombol aksi) | Style `minWidth`/`minHeight` 44px sudah ada |
| 3 | **ARIA sort & keyboard support** | `TransactionTable.jsx` | `aria-sort`, `tabIndex`, `onKeyDown` pada header |
| 4 | **ARIA labels pada filter inputs** | `TransactionTable.jsx` | `aria-label` sudah ada |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | □ Pass □ Fail □ N/A | | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass □ Fail □ N/A | | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass □ Fail □ N/A | | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | □ Pass □ Fail □ N/A | | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass □ Fail □ N/A | | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1-h6, body, caption, label) | #4 | □ Pass □ Fail □ N/A | | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | □ Pass □ Fail □ N/A | | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | □ Pass □ Fail □ N/A | | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile-first (dari layar kecil ke besar) | #5 | □ Pass □ Fail □ N/A | | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | □ Pass □ Fail □ N/A | | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass □ Fail □ N/A | | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | □ Pass □ Fail □ N/A | | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass □ Fail □ N/A | | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | □ Pass □ Fail □ N/A | | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | □ Pass □ Fail □ N/A | | Menengah |
| 6.2 | Tahap Define: persona, user journey, dan requirement terdefinisi | #6 | □ Pass □ Fail □ N/A | | Menengah |
| 6.3 | Tahap Develop: sketsa, wireframe, dan prototipe rendah fidelitas tersedia | #6 | □ Pass □ Fail □ N/A | | Menengah |
| 6.4 | Tahap Deliver: desain tinggi fidelitas, prototype interaktif, dan handoff tersedia | #6 | □ Pass □ Fail □ N/A | | Tinggi |
| 6.5 | Setiap tahapan memiliki keluaran yang ditinjau stakeholder sebelum melanjut | #6 | □ Pass □ Fail □ N/A | | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur: halaman bernama rapi, auto layout digunakan | #7 | □ Pass □ Fail □ N/A | | Tinggi |
| 7.2 | Komponen dipublish ke library design system | #7 | □ Pass □ Fail □ N/A | | Tinggi |
| 7.3 | Spesifikasi visual lengkap: ukuran, jarak, warna (hex), tipografi, radius, shadow | #7 | □ Pass □ Fail □ N/A | | Tinggi |
| 7.4 | Prototype interaktif alur utama dapat diklik dan diuji tanpa kode | #7 | □ Pass □ Fail □ N/A | | Tinggi |
| 7.5 | Annotation catatan desain: perilaku interaksi, state, dan responsivitas | #7 | □ Pass □ Fail □ N/A | | Menengah |
| 7.6 | Asset diekspor dalam skala yang benar (SVG/PNG 1x, 2x) | #7 | □ Pass □ Fail □ N/A | | Menengah |
| 7.7 | Checklist handoff telah ditandai: review selesai, aksesibilitas diperiksa, developer memiliki akses | #7 | □ Pass □ Fail □ N/A | | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dilakukan dengan pengguna nyata (minimal 5 orang per iterasi) | #8 | □ Pass □ Fail □ N/A | | Tinggi |
| 8.2 | Data uji coba dicatat: tugas gagal, waktu penyelesaian, kepuasan (SUS) | #8 | □ Pass □ Fail □ N/A | | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan uji coba | #8 | □ Pass □ Fail □ N/A | | Tinggi |
| 8.4 | Validasi ulang dilakukan setelah iterasi | #8 | □ Pass □ Fail □ N/A | | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa minimal satu siklus uji usabilitas | #8 | □ Pass □ Fail □ N/A | | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity (paksa langganan berlanjut) | #9 | □ Pass □ Fail □ N/A | | Kritis |
| 9.2 | Tidak ada hidden cost (biaya tersembunyi) | #9 | □ Pass □ Fail □ N/A | | Kritis |
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | □ Pass □ Fail □ N/A | | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar-benar akurat | #9 | □ Pass □ Fail □ N/A | | Menengah |
| 9.5 | Tidak ada roach-motel (mudah daftar, sulit batal) | #9 | □ Pass □ Fail □ N/A | | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | □ Pass □ Fail □ N/A | | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate telah ditetapkan | #10 | □ Pass □ Fail □ N/A | | Rendah |
| 10.2 | Time-on-task telah ditetapkan | #10 | □ Pass □ Fail □ N/A | | Rendah |
| 10.3 | Error rate telah ditetapkan | #10 | □ Pass □ Fail □ N/A | | Rendah |
| 10.4 | NPS / SUS telah ditetapkan | #10 | □ Pass □ Fail □ N/A | | Rendah |
| 10.5 | Konversi dan retensi telah ditetapkan | #10 | □ Pass □ Fail □ N/A | | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| | | | | |
| | | | | |
| | | | | |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** □ Lulus □ Perbaikan Minor □ Perbaikan Besar □ Tidak Lulus

**Catatan auditor:**

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Simpanan Dashboard  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`
