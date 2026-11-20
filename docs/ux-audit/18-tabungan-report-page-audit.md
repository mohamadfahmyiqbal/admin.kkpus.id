# UI/UX Audit Checklist — Tabungan Report

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Tabungan Report |
| URL / Lokasi File | `src/pages/tabungan/TabunganReportPage.jsx` (dan komponen terkait) |
| Route Key | `tabunganReport` |
| Protected Route | ✅ Ya |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Belum diketahui |
| Status Akhir | 🟡 Perbaikan Besar |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 0 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 3 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 2 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 3 | ⚠️ Perlu verifikasi |
| 5. Responsivitas & Adaptasi | 10 | 5 | ⚠️ Perlu perbaikan |
| 6. Proses Desain (Double Diamond) | 5 | 0 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 2 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **15** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi riset dalam kode | Tinggi |
| 1.2 | Jobs‑to‑be‑done (JTBD) pengguna telah ditetapkan | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti JTBD | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | Tujuan: lihat laporan saldo, jurnal, export data — tidak terdokumentasi | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti riset | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Pass □ Fail □ N/A | Tidak ada dasar bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass □ Fail □ N/A | Pola tabel laporan standar admin panel, breadcrumb navigasi | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass □ Fail □ N/A | 16 kolom pada tabel list report + 2 tab → terlalu banyak informasi sekaligus | Tinggi |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Pass □ Fail □ N/A | Filter input ukuran standar Bootstrap, tombol export cukup besar; namun filter input kecil sulit di‑sentuh di mobile | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass □ Fail □ N/A | 16 kolom data tanpa chunking → melebihi batas kognitif | Tinggi |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass □ Fail □ N/A | Tabel jurnal (debet/kredit, akun) memerlukan pemahaman akuntansi dari pengguna | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass □ Fail □ N/A | Loading spinner tersedia, data dimuat async, pencarian client‑side | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass □ Fail □ N/A | Spinner saat loading, pesan kosong saat filter tidak menemukan data | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass □ Fail □ N/A | Bahasa Indonesia, istilah "List Report", "Jurnal Report", "Export Excel" | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass □ Fail □ N/A | Breadcrumb navigasi kembali, reset filter melalui input kosong | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass □ Fail □ N/A | Konsisten dengan halaman lain (breadcrumb, tab pills, tabel bordered), inline style campuran pada beberapa elemen | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass □ Fail □ N/A | Filter client‑side (tidak mengubah data), export disabled saat loading | Tinggi |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass □ Fail □ N/A | Placeholder deskriptif pada filter, sticky header, summary row | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass □ Fail □ N/A | Export Excel, filter per kolom, navigasi tab cepat | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass □ Fail □ N/A | Desain bersih, tabel rapi, summary footer jelas | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass □ Fail □ N/A | Filter bisa direset dengan mengosongkan input, pesan kosong data jelas | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Pass □ Fail □ N/A | Tidak ada tooltip, glossary, atau bantuan kontekstual | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Menggunakan kelas Bootstrap (text‑muted, text‑success, text‑danger); perlu verifikasi nilai kontras | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Sama dengan 3.1, belum diverifikasi | Kritis |
| 3.3 | Warna bukan satu‑satunya pengenal informasi, peringatan, atau aksi | #3 | □ Pass □ Fail □ N/A | Tabel menggunakan nilai teks eksplisit (angka, status), warna tidak satu‑satunya pengenal | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px | #3 | □ Pass □ Fail □ N/A | Filter input kecil pada tabel, tidak memenuhi 44 × 44 px di mobile | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass □ Fail □ N/A | Input dan button standar, namun tidak ada skip‑link | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | □ Pass □ Fail □ N/A | Default Bootstrap outline terlihat, namun tidak ada styling khusus | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200 % tanpa assistive technology | #3 | □ Pass □ Fail □ N/A | Tabel fixed min‑width 1600 px; pada zoom 200% horizontal scroll besar, konten tetap terbaca | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | □ Pass □ Fail □ N/A | Tidak ada gambar, hanya ikon (SVG inline dengan `aria-hidden`) | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di‑siapkan sebagai dekoratif | #3 | □ Pass □ Fail □ N/A | Ikon pada header tidak memiliki `aria-hidden` (TabunganReportHeader.jsx) | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Pass □ Fail □ N/A | Semua filter input hanya placeholder, tidak ada `<label>` atau `aria-label` | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | □ Pass □ Fail □ N/A | Tidak ada mekanisme error handling pada halaman ini (silent catch), pesan kosong cukup informatif | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | □ Pass □ Fail □ N/A | Animasi `animate-fade-in` digunakan, tidak ada kontrol prefers‑reduced‑motion | Menengah |
| **3.13 (Tambahan)** | Tabel memiliki atribut ARIA (caption, aria-label, scope, aria-sort) | #3 | □ Pass □ Fail □ N/A | Tabel list report (16 kolom) tidak memiliki `<caption>`, `aria-label`, atau `scope` pada `<th>` | Kritis |
| **3.14 (Tambahan)** | Navigasi tab menggunakan ARIA yang tepat | #3 | □ Pass □ Fail □ N/A | react-bootstrap Tab/Nav umumnya menyediakan ARIA; perlu verifikasi manual | Tinggi |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Menggunakan kelas Bootstrap (`bg-light`, `text-muted`, `text-success`) dan inline style — tidak ada token | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Inline `fontSize` pada beberapa elemen, tidak ada skala tipografi terpusat | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | □ Pass □ Fail □ N/A | Menggunakan utility Bootstrap (`p-2`, `py-4`) yang hardcode | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass □ Fail □ N/A | Kelas Bootstrap (`rounded-3`, `shadow-sm`) tanpa token | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass □ Fail □ N/A | `TabunganReportHeader`, `TabunganListReportTab`, `TabunganJurnalTab` reusable — baik | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | □ Pass □ Fail □ N/A | Tabel memiliki state loading/empty/disabled, export button disabled saat loading | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass □ Fail □ N/A | Menggunakan Card/Table Bootstrap konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1‑h6, body, caption, label) | #4 | □ Pass □ Fail □ N/A | Tidak ada skala tipografi terpusat | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | □ Pass □ Fail □ N/A | Menggunakan ikon Bootstrap (`bi bi-file-earmark-excel`) — konsisten | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | □ Pass □ Fail □ N/A | Menggunakan warna Bootstrap konsisten (`text-success`, `text-danger`, `text-muted`) | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile‑first (dari layar kecil ke besar) | #5 | □ Pass □ Fail □ N/A | Menggunakan kelas responsive Bootstrap, tetapi tabel list report fixed width 1600 px | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | □ Pass □ Fail □ N/A | Breakpoint Bootstrap (`px-md-4`, `p-md-3`) tersedia | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass □ Fail □ N/A | Header responsif, tab pills adaptif, tabel scroll horizontal — tapi 16 kolom tetap tidak optimal di mobile | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | □ Pass □ Fail □ N/A | `table-responsive` mencegah pemotongan, sticky header/footer membantu navigasi | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass □ Fail □ N/A | Tabel 16 kolom fixed 1600 px sangat sulit dibaca di portrait mobile | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | □ Pass □ Fail □ N/A | Filter input inline berukuran kecil (< 44 px), tombol export cukup besar | Kritis |
| 5.7 | Sticky header dan footer table | #5 | □ Pass □ Fail □ N/A | Sticky top header dan bottom tfoot memudahkan navigasi data — baik | Menengah |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | □ Pass □ Fail □ N/A | Tidak ada bukti dokumen riset | Menengah |
| 6.2 | Tahap Define: persona, user journey, dan requirement terdefinisi | #6 | □ Pass □ Fail □ N/A | Tidak ada artefak definisi | Menengah |
| 6.3 | Tahap Develop: sketsa, wireframe, dan prototipe rendah fidelitas tersedia | #6 | □ Pass □ Fail □ N/A | Tidak ada file sketsa atau prototype di repositori | Menengah |
| 6.4 | Tahap Deliver: desain tinggi fidelitas, prototype interaktif, dan handoff tersedia | #6 | □ Pass □ Fail □ N/A | Kode selesai, namun tidak ada handoff terstruktur | Tinggi |
| 6.5 | Setiap tahapan memiliki keluaran yang ditinjau stakeholder sebelum melanjut | #6 | □ Pass □ Fail □ N/A | Tidak ada catatan review stakeholder | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur: halaman bernama rapi, auto layout digunakan | #7 | □ Pass □ Fail □ N/A | Belum tersedia | Tinggi |
| 7.2 | Komponen dipublish ke library design system | #7 | □ Pass □ Fail □ N/A | Belum tersedia | Tinggi |
| 7.3 | Spesifikasi visual lengkap: ukuran, jarak, warna (hex), tipografi, radius, shadow | #7 | □ Pass □ Fail □ N/A | Tidak ada dokumen spesifikasi visual | Tinggi |
| 7.4 | Prototype interaktif alur utama dapat di‑click dan diuji tanpa kode | #7 | □ Pass □ Fail □ N/A | Tidak ada prototype interaktif | Tinggi |
| 7.5 | Annotation catatan desain: perilaku interaksi, state, dan responsivitas | #7 | □ Pass □ Fail □ N/A | Tidak ada anotasi | Menengah |
| 7.6 | Asset diekspor dalam skala yang benar (SVG/PNG 1x, 2x) | #7 | □ Pass □ Fail □ N/A | Tidak ada asset terpublish | Menengah |
| 7.7 | Checklist handoff telah ditandai: review selesai, aksesibilitas diperiksa, developer memiliki akses | #7 | □ Pass □ Fail □ N/A | Belum dilakukan | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dilakukan dengan pengguna nyata (minimal 5 orang per iterasi) | #8 | □ Pass □ Fail □ N/A | Tidak ada bukti uji coba | Tinggi |
| 8.2 | Data uji coba dicatat: tugas gagal, waktu penyelesaian, kepuasan (SUS) | #8 | □ Pass □ Fail □ N/A | Tidak ada data | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan uji coba | #8 | □ Pass □ Fail □ N/A | Belum ada iterasi | Tinggi |
| 8.4 | Validasi ulang dilakukan setelah iterasi | #8 | □ Pass □ Fail □ N/A | Belum ada | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa minimal satu siklus uji usabilitas | #8 | □ Pass □ Fail □ N/A | Belum ada uji usabilitas | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity (paksa langganan berlanjut) | #9 | □ Pass □ Fail □ N/A | Tidak berlaku | Kritis |
| 9.2 | Tidak ada hidden cost (biaya tersembunyi) | #9 | □ Pass □ Fail □ N/A | Tidak berlaku | Kritis |
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | □ Pass □ Fail □ N/A | Tidak ada aksi destruktif pada halaman ini | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar‑benar akurat | #9 | □ Pass □ Fail □ N/A | Tidak ada urgency palsu | Menengah |
| 9.5 | Tidak ada roach‑motel (mudah daftar, sulit batal) | #9 | □ Pass □ Fail □ N/A | Tidak berlaku (bukan halaman pendaftaran) | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | □ Pass □ Fail □ N/A | **Nama anggota, saldo, target, dan kekurangan ditampilkan dalam tabel laporan; export Excel memuat seluruh data** — perlu kontrol akses berdasarkan peran | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ada metrik yang didefinisikan | Rendah |
| 10.2 | Time‑on‑task telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ada metrik yang didefinisikan | Rendah |
| 10.3 | Error rate telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ada metrik yang didefinisikan | Rendah |
| 10.4 | NPS / SUS telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ada metrik yang didefinisikan | Rendah |
| 10.5 | Konversi dan retensi telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ada metrik yang didefinisikan | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Filter input tanpa label/ARIA pada list report (16 kolom) | `TabunganListReportTab.jsx` baris 94‑113 | Tambahkan `<label>` yang terhubung atau atribut `aria-label` deskriptif pada setiap filter input | **Kritis** |
| 2 | Tabel list report tidak memiliki `<caption>`, `aria-label`, atau `scope` pada `<th>` | `TabunganListReportTab.jsx` baris 36‑114 | Tambahkan `<caption>` deskriptif, gunakan `scope="col"` pada semua `<th>`, tambahkan `aria-label` pada tabel | **Kritis** |
| 3 | Tabel list report fixed `minWidth: "1600px"` — tidak responsif di mobile | `TabunganListReportTab.jsx` baris 41 | Ganti fixed width dengan `minWidth: "100%"` + `table-responsive` yang adaptive; pertimbangkan column hiding pada layar kecil | **Tinggi** |
| 4 | Ikon pada header (`TabunganReportHeader.jsx`) tidak memiliki `aria-hidden` | `TabunganReportHeader.jsx` baris 37‑38 | Tambahkan `aria-hidden="true"` pada ikon dekoratif | **Tinggi** |
| 5 | Filter input kecil di mobile tidak memenuhi target sentuhan 44 × 44 px | `TabunganListReportTab.jsx` baris 94‑113 | Tingkatkan ukuran input atau tambahkan padding yang memadai pada mobile breakpoint | **Kritis** |
| 6 | Data anggota (nama, saldo, target, kekurangan) dapat di‑export tanpa kontrol akses | `TabunganReportPage.jsx` baris 162‑178 | Terapkan role‑based access control pada fitur export, maskir data sensitif | **Tinggi** |
| 7 | Tidak ada design token untuk warna, spacing, tipografi | Seluruh komponen | Migrasikan ke CSS variables / design token yang dikelola dalam design system | **Tinggi** |
| 8 | Tidak ada dokumentasi desain, handoff, atau metrik keberhasilan | Semua file | Buat dokumen Figma dengan komponen terstruktur, sertakan spesifikasi visual, definisikan metrik (task success rate, SUS) | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Tabungan Report menyediakan laporan lengkap (List Report dan Jurnal Report) dengan fitur pencarian per kolom, sticky header/footer, dan export Excel. Namun ada masalah kritis pada aksesibilitas (filter input tanpa label/ARIA, tabel tanpa ARIA), responsivitas (fixed 1600 px width), serta privasi data (export seluruh data tanpa kontrol akses). Direkomendasikan:

1. Tambahkan label/ARIA pada semua 16 filter input.
2. Implementasikan atribut ARIA yang lengkap pada tabel (`<caption>`, `scope`, `aria-label`).
3. Ganti fixed width 1600 px dengan layout responsif yang adaptive per breakpoint.
4. Tambahkan role‑based access control pada fitur export Excel.
5. Migrasikan ke design token.
6. Buat artefak desain, spesifikasi handoff, dan lakukan uji usabilitas.
7. Definisikan metrik keberhasilan untuk pengukuran.

Setelah perbaikan di atas, lakukan audit ulang sebelum rilis.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`
**Halaman:** Tabungan Report
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`