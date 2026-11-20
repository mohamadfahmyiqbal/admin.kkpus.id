# UI/UX Audit Checklist — Investasi Halal List

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Investasi Halal List |
| URL / Lokasi File | `src/pages/investasi/halal/InvestasiHalalListPage.jsx` |
| Route Key | `investasiHalalList` |
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
| 5. Responsivitas & Adaptasi | 10 | 7 | ✅ Baik |
| 6. Proses Desain (Double Diamond) | 5 | 0 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 3 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **28** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Fail | Tidak ada dokumentasi riset | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Fail | Tidak ada bukti JTBD | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Fail | User goal: mengelola katalog & manajemen investasi – tidak terdokumentasi | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Fail | Tidak ada bukti riset | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Fail | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Fail | Tidak ada basis bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass | Layout tab, tombol aksi, tabel mengikuti konvensi admin panel | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass | 2 tab utama (Katalog, Manajemen), beberapa aksi per baris – manageable | Menengah |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Fail | Icon edit/hapus pada Manajemen 32 × 32 px (see `SukukManagementTab.jsx` baris 202‑221), tombol aksi Katalog 32 × 32 px (see `SukukCatalogTab.jsx` baris 262‑289) | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass | Tab memisahkan data katalog dan manajemen, masing‑masing tabel 6‑10 kolom | Menengah |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass | CRUD, import, export, dan filter dipisahkan dengan jelas | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass | Loading spinner, tombol disabled selama export/import | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass | Loading, tombol disable/enable, SweetAlert2 konfirmasi | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass | Bahasa Indonesia, istilah "Katalog Produk", "Manajemen" jelas | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass | Modal import/export memiliki tombol Batal/Tutup | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass | Mengikuti Bootstrap, komponen UI seragam | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass | SweetAlert2 konfirmasi pada delete, validasi file Excel pada import | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass | Icon Phosphor‑react dan Bootstrap Icons sebagai visual cue | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass | Import Excel, export per tab, page size selector | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass | Layout clean, badge status jelas, shadow ringan | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass | Import failure table, error toast/alert | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Fail | Import modal ada instruksi, tapi tidak ada tooltip/help di tabel utama | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Fail | Tidak diverifikasi, warna pada badge dan tabel | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 | #3 | □ Fail | Sama seperti 3.1 | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi | #3 | □ Pass | Badge status memiliki label teks | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px | #3 | □ Fail | Icon aksi (Edit, Hapus, Eye, Users) 32 × 32 px — belum memenuhi | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass | Tombol dan input standar HTML | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas | #3 | □ Fail | Tidak ada style khusus focus-visible | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% | #3 | □ Pass | Tabel scrollable, layout tidak break | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) | #3 | □ Pass | Tidak ada gambar, hanya ikon | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau dekoratif | #3 | □ Pass | Ikon dekoratif `aria-hidden="true"` | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Fail | Filter tabel tidak memiliki `<label>` visual (lihat `SukukCatalogTab.jsx` baris 140‑210) | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan | #3 | □ Pass | SweetAlert2 dan Alert Bootstrap memberikan pesan yang jelas | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi vestibular | #3 | □ Fail | Tidak ada preferensi reduced‑motion | Menengah |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token | #4 | □ Fail | Kelas Bootstrap + inline style, tidak ada token | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token | #4 | □ Fail | Inline style `fontSize`, `cursor`, `transition` tanpa token | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token | #4 | □ Fail | Bootstrap spacing (`p-4`, `mb-4`) hardcode | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass | `rounded-4`, `rounded-pill`, `shadow-sm` konsisten | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass | Tabel, modal, header dibuat komponen terpisah | Tinggi |
| 4.6 | Komponen memiliki varian | #4 | □ Pass | Variasi tombol (primary, light, danger) dan state (loading, disabled) | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass | Bootstrap grid konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi | #4 | □ Fail | Tidak ada skala tipografi terpusat | Menengah |
| 4.9 | Ikonset menggunakan satu gaya | #4 | □ Pass | Phosphor‑react dan Bootstrap Icons, gaya konsisten | Menengah |
| 4.10 | Warna dan ikon status seragam | #4 | □ Pass | Badge warna Bootstrap seragam | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile‑first | #5 | □ Pass | Bootstrap responsive grid | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas | #5 | □ Pass | Menggunakan kelas Bootstrap (xs‑xl) | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass | Header wrap, tabel scroll horizontal | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah | #5 | □ Pass | Table responsive, modal scrollable | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass | Tidak ada constraint orientasi | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar | #5 | □ Fail | Icon 32 × 32 px < 44 px | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover | #6 | □ Fail | Tidak ada artefak riset | Menengah |
| 6.2 | Tahap Define | #6 | □ Fail | Tidak ada dokumen | Menengah |
| 6.3 | Tahap Develop | #6 | □ Fail | Tidak ada wireframe/prototipe | Menengah |
| 6.4 | Tahap Deliver | #6 | □ Fail | Tidak ada handoff | Tinggi |
| 6.5 | Review stakeholder | #6 | □ Fail | Tidak ada bukti | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur | #7 | □ Fail | Tidak tersedia | Tinggi |
| 7.2 | Komponen dipublish ke library | #7 | □ Fail | Tidak ada | Tinggi |
| 7.3 | Spesifikasi visual lengkap | #7 | □ Fail | Tidak ada dokumen | Tinggi |
| 7.4 | Prototype interaktif | #7 | □ Fail | Tidak ada | Tinggi |
| 7.5 | Annotation catatan desain | #7 | □ Fail | Tidak ada | Menengah |
| 7.6 | Asset diekspor dalam skala yang benar | #7 | □ Fail | Tidak ada | Menengah |
| 7.7 | Checklist handoff | #7 | □ Fail | Belum dilakukan | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dilakukan dengan pengguna nyata | #8 | □ Fail | Tidak ada bukti | Tinggi |
| 8.2 | Data uji coba dicatat | #8 | □ Fail | Tidak ada data | Tinggi |
| 8.3 | Desain diiterasi | #8 | □ Fail | Tidak ada | Tinggi |
| 8.4 | Validasi ulang | #8 | □ Fail | Tidak ada | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa uji | #8 | □ Fail | Tidak ada proses | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity | #9 | □ Pass | Tidak relevan | Kritis |
| 9.2 | Tidak ada hidden cost | #9 | □ Pass | Tidak relevan | Kritis |
| 9.3 | Opsi batal tidak disembunyikan | #9 | □ Pass | Modal import/export memiliki Batal | Kritis |
| 9.4 | Tidak ada urgency palsu | #9 | □ Pass | Tidak ada | Menengah |
| 9.5 | Tidak ada roach‑motel | #9 | □ Pass | Tidak ada pendaftaran | Kritis |
| 9.6 | Privasi default | #9 | □ Fail | Data anggota (nama, no) ditampilkan dalam tabel tanpa maskir | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate | #10 | □ Fail | Tidak ditetapkan | Rendah |
| 10.2 | Time‑on‑task | #10 | □ Fail | Tidak ditetapkan | Rendah |
| 10.3 | Error rate | #10 | □ Fail | Tidak ditetapkan | Rendah |
| 10.4 | NPS / SUS | #10 | □ Fail | Tidak ditetapkan | Rendah |
| 10.5 | Konversi dan retensi | #10 | □ Fail | Tidak ditetapkan | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Icon aksi (Edit, Hapus, Eye, Users) ukuran 32 × 32 px, target < 44 × 44 px | `SukukCatalogTab.jsx` baris 262‑289, `SukukManagementTab.jsx` baris 202‑221 | Tambahkan padding atau perbesar icon button | **Kritis** |
| 2 | Filter input tidak memiliki `<label>` visual | `SukukCatalogTab.jsx` baris 140‑210 | Tambahkan `<label>` atau gunakan `aria-label` yang lebih deskriptif | **Kritis** |
| 3 | Fokus visual tidak jelas pada semua elemen interaktif | Seluruh file komponen | Terapkan `:focus-visible` style | **Kritis** |
| 4 | Kontras warna pada badge dan tabel tidak diverifikasi | `SukukCatalogTab.jsx` badge status, `SukukManagementTab.jsx` | Audit kontras, gunakan warna yang memenuhi rasio | **Kritis** |
| 5 | Data anggota (nama, no anggota) tanpa maskir | `SukukCatalogTab.jsx` baris 262‑289 | Pertimbangkan maskir data sensitif | **Tinggi** |
| 6 | Tidak ada dokumentasi desain, handoff, atau handoff checklist | Seluruh halaman | Buat artefak desain lengkap | **Menengah** |
| 7 | Animasi `transition: all 0.3s ease` tidak menghormati `prefers-reduced-motion` | `InvestasiHalalListPage.jsx` baris 93‑111 | Tambahkan media query | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

- Perbaiki aksesibilitas (target size, label, focus, kontras) sebagai prioritas utama.
- Buat artefak desain lengkap (Figma, wireframe, spesifikasi).
- Lakukan uji kegunaan dengan minimal 5 admin.
- Migrasikan inline style ke design token.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Investasi Halal List  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`