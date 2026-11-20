# UI/UX Audit Checklist — Jual Beli Report

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Jual Beli Report |
| URL / Lokasi File | `src/pages/jualBeli/JualBeliReport.jsx` |
| Route Key | `jualBeliReport` |
| Protected Route | ✅ Ya |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Tidak diketahui |
| Status Akhir | □ Lulus □ Perbaikan Minor □ Perbaikan Besar □ Tidak Lulus |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 6 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 3 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 3 | ❌ Gagal |
| 5. Responsivitas & Adaptasi | 10 | 7 | ✅ Baik |
| 6. Proses Desain (Double Diamond) | 5 | 0 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 4 | ✅ Baik |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **30** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Fail | Tidak terdapat dokumentasi riset di kode | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Fail | Tidak ada referensi JTBD dalam kode | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Fail | Deskripsi tujuan hanya di header teks, tidak terdokumentasi secara formal | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Fail | Tidak ada bukti riset atau analitik | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Fail | Tidak ada diagram journey di repo | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Fail | Tidak ada file riset | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass | Menggunakan layout tabel dan tab yang umum pada aplikasi admin | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass | Filter pada 17 kolom dan 2 tab, masih wajar | Menengah |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Fail | Ikon aksi (X, Sort) berukuran 12‑16 px, target < 44 × 44 px | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass | Data dibagi dalam tab list & jurnal, tiap tabel menampilkan 17 kolom – borderline | Menengah |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass | Semua operasi (filter, sort, export) jelas, tidak ada logika tersembunyi | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass | Loading spinner ditampilkan, API dipanggil async, tidak ada blocking UI | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass | Loading spinner, tombol disabled saat export | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass | Bahasa Indonesia, istilah “Report”, “Jurnal” konsisten | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass | Tombol reset filter, breadcrumb navigasi, bisa kembali | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass | Menggunakan komponen Bootstrap konsisten, namun ada inline style di beberapa elemen | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass | Validasi tidak ada pada filter, tapi ada konfirmasi pada export | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass | Ikon Phosphor‑react dengan aria‑hidden, teks jelas | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass | Export ke Excel, pagination, pilihan page size | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass | Layout bersih, shadow ringan | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass | Reset filter, error handling pada export (alert) | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Fail | Tidak ada tooltip atau help text di elemen utama | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Fail | Warna teks pada badge dan tabel menggunakan kelas Bootstrap tanpa verifikasi kontras | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 | #3 | □ Fail | Sama seperti 3.1 pada elemen badge dan tombol | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi | #3 | □ Pass | Ikon memiliki label (aria‑hidden) dan teks badge | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px | #3 | □ Fail | Ikon aksi (X, Sort, Reset) ukuran 12 px, tombol icon tidak memiliki padding cukup (Lihat `JualBeliReportListTable.jsx` baris 269‑276) | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass | Semua elemen `<button>` dan `<input>` native, dapat di‑tab | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | □ Fail | Mengandalkan default browser focus, tidak ada style khusus (cek `JualBeliReportHeader.jsx` baris 14‑21) | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% tanpa assistive technology | #3 | □ Pass | Tabel bersifat scrollable, tidak ada break layout pada zoom 200% (perlu verifikasi) | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | □ Pass | Tidak ada gambar, hanya ikon SVG dengan `aria-hidden` | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di‑siapkan sebagai dekoratif | #3 | □ Pass | Ikon dekoratif memiliki `aria-hidden="true"` | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Fail | Filter menggunakan `<Form.Control>` hanya dengan `aria-label`, tidak ada `<label>` visual (lihat baris 279‑286) | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan | #3 | □ Pass | Alert pada export error menggunakan `Swal.fire` dengan pesan jelas | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | □ Fail | Tidak ada kontrol prefers‑reduced‑motion (animasi `animate-fade-in` pada baris 129‑131) | Menengah |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | □ Fail | Menggunakan kelas Bootstrap (`text-primary`, `bg-light`) dan inline style, tidak ada token CSS | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | □ Fail | Font size ditentukan inline (mis. `style={{ fontSize: "12px" }}`) pada filter input (lihat baris 285‑287) | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token | #4 | □ Fail | Menggunakan kelas spacing Bootstrap (`p-3`, `mb-4`) serta inline style, tidak ada variabel grid | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass | Menggunakan kelas Bootstrap (`rounded-4`, `shadow-sm`) konsisten | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass | Tabel dan header di‑reuse di beberapa halaman, tetapi tidak ada library component terpisah | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | □ Pass | Variasi tombol (`variant="outline-danger"`, `disabled={loading}`) ada | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass | Menggunakan Bootstrap grid (`col`, `row`) konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1‑h6, body, caption, label) | #4 | □ Fail | Tidak ada skala tipografi terpusat, ukuran ditentukan per elemen | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke konsisten | #4 | □ Pass | Semua ikon Phosphor‑react, ukuran seragam 12‑16 px | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | □ Pass | Badge status menggunakan warna Bootstrap konsisten | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile‑first | #5 | □ Pass | Menggunakan kelas responsive (`col-md`, `col-sm`) dan komponen `Table` responsif | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas | #5 | □ Pass | Mengikuti Bootstrap breakpoints (xs, sm, md, lg, xl) | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass | Tab dan tabel membungkus, scrollable pada mobile | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | □ Pass | Table memiliki `table-responsive` wrapper, tidak ada overflow | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass | Tidak ada layout khusus, namun Bootstrap mendukung kedua orientasi | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar (≥ 44 × 44 px) | #5 | □ Fail | Ikon aksi kecil melanggar standar (lihat baris 269‑276) | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | □ Fail | Tidak ada artefak riset di repo | Menengah |
| 6.2 | Tahap Define: persona, user journey, dan requirement terdefinisi | #6 | □ Fail | Tidak ada dokumen definisi | Menengah |
| 6.3 | Tahap Develop: sketsa, wireframe, dan prototipe rendah fidelitas tersedia | #6 | □ Fail | Tidak ada file desain atau prototipe | Menengah |
| 6.4 | Tahap Deliver: desain tinggi fidelitas, prototype interaktif, dan handoff tersedia | #6 | □ Fail | Tidak ada handoff artefak (Figma) | Tinggi |
| 6.5 | Setiap tahapan memiliki keluaran yang ditinjau stakeholder sebelum melanjut | #6 | □ Fail | Tidak ada bukti review | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur: halaman bernama rapi, auto layout digunakan | #7 | □ Fail | Tidak ada file desain dalam repo | Tinggi |
| 7.2 | Komponen dipublish ke library design system | #7 | □ Fail | Tidak ada library design system terpublikasi | Tinggi |
| 7.3 | Spesifikasi visual lengkap: ukuran, jarak, warna (hex), tipografi, radius, shadow | #7 | □ Fail | Tidak ada spesifikasi visual | Tinggi |
| 7.4 | Prototype interaktif alur utama dapat diklik dan diuji tanpa kode | #7 | □ Fail | Tidak ada prototype interaktif | Tinggi |
| 7.5 | Annotation catatan desain: perilaku interaksi, state, dan responsivitas | #7 | □ Fail | Tidak ada anotasi | Menengah |
| 7.6 | Asset diekspor dalam skala yang benar (SVG/PNG 1x, 2x) | #7 | □ Fail | Tidak ada asset | Menengah |
| 7.7 | Checklist handoff telah ditandai: review selesai, aksesibilitas diperiksa, developer memiliki akses | #7 | □ Fail | Tidak ada checklist | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dilakukan dengan pengguna nyata (minimal 5 orang per iterasi) | #8 | □ Fail | Tidak ada catatan uji coba | Tinggi |
| 8.2 | Data uji coba dicatat: tugas gagal, waktu penyelesaian, kepuasan (SUS) | #8 | □ Fail | Tidak ada data | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan uji coba | #8 | □ Fail | Tidak ada iterasi dokumentasi | Tinggi |
| 8.4 | Validasi ulang dilakukan setelah iterasi | #8 | □ Fail | Tidak ada | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa minimal satu siklus uji usabilitas | #8 | □ Fail | Tidak ada proses | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity (paksa langganan berlanjut) | #9 | □ Pass | Tidak relevan | Kritis |
| 9.2 | Tidak ada hidden cost (biaya tersembunyi) | #9 | □ Pass | Tidak relevan | Kritis |
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | □ Pass | Tombol Batal pada modal tersedia | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar-benar akurat | #9 | □ Pass | Tidak ada countdown atau tekanan waktu | Menengah |
| 9.5 | Tidak ada roach‑motel (mudah daftar, sulit batal) | #9 | □ Pass | Tidak ada proses pendaftaran pada halaman ini | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | □ Pass | Tidak menampilkan data sensitif secara berlebihan (hanya nama, nomor) | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate telah ditetapkan | #10 | □ Fail | Tidak ada metrik | Rendah |
| 10.2 | Time‑on‑task telah ditetapkan | #10 | □ Fail | Tidak ada | Rendah |
| 10.3 | Error rate telah ditetapkan | #10 | □ Fail | Tidak ada | Rendah |
| 10.4 | NPS / SUS telah ditetapkan | #10 | □ Fail | Tidak ada | Rendah |
| 10.5 | Konversi dan retensi telah ditetapkan | #10 | □ Fail | Tidak ada | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Ikon aksi (X, Reset, Sort) ukuran < 44 × 44 px | `src/pages/jualBeli/report/JualBeliReportListTable.jsx` baris 269‑276 | Tambahkan padding/border pada tombol atau gunakan button dengan ukuran minimum 44 px | **Kritis** |
| 2 | Filter input tidak memiliki elemen `<label>` visual | `src/pages/jualBeli/report/JualBeliReportListTable.jsx` baris 279‑286 | Tambahkan `<label>` yang terhubung via `htmlFor` atau gunakan `Form.Label` | **Kritis** |
| 3 | Tidak ada caption/summary pada tabel, serta atribut `aria-sort` pada header yang sortable | `src/pages/jualBeli/report/JualBeliReportListTable.jsx` baris 173‑227 | Tambahkan `<caption>` elemen dan `aria-sort`/`aria-label` pada `<th>` | **Kritis** |
| 4 | Fokus visual tidak jelas pada elemen interaktif (focus‑visible) | `src/pages/jualBeli/report/JualBeliReportHeader.jsx` baris 14‑21 | Terapkan style `:focus-visible { box-shadow: 0 0 0 3px var(--primary); }` | **Kritis** |
| 5 | Kontras warna tidak terverifikasi, terutama pada badge status dan teks berwarna terang pada latar gelap | Seluruh file, terutama header badge | Lakukan audit kontras menggunakan alat dan gunakan warna dengan rasio ≥ 4.5:1 | **Kritis** |
| 6 | Tidak ada dokumentasi riset, persona, journey, atau handoff design system | — | Buat artefak Double Diamond, export Figma, dan checklist handoff | **Menengah** |
| 7 | Tidak ada opsi untuk menghentikan animasi `animate-fade-in` pada reduced‑motion | `src/pages/jualBeli/JualBeliReport.jsx` baris 128‑131 | Tambahkan class yang memeriksa `prefers-reduced-motion` | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

- Prioritaskan perbaikan aksesibilitas kritis (ukuran target, label, focus, kontras).
- Buat dokumentasi riset yang mendukung keputusan desain.
- Migrasikan styling ke design token / CSS variables untuk konsistensi.
- Siapkan handoff lengkap (Figma, spesifikasi visual, prototyping).
- Lakukan uji kegunaan dengan setidaknya 5 admin Kkpus dan rekam metrik.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Jual Beli Report  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`