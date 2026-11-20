# UI/UX Audit Checklist — Tabungan List

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Tabungan List |
| URL / Lokasi File | `src/pages/tabungan/TabunganPage.jsx` (dan komponen terkait) |
| Route Key | `tabunganList` |
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
| 2. Hukum UX & Heuristik | 10 | 4 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 2 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 3 | ⚠️ Perlu verifikasi |
| 5. Responsivitas & Adaptasi | 10 | 7 | ✅ Baik |
| 6. Proses Desain (Double Diamond) | 5 | 0 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 2 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **18** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi riset dalam kode | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti JTBD | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | Tujuan: kelola program tabungan, lihat progress, approve transaksi — tidak terdokumentasi secara eksplisit | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti riset | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Pass □ Fail □ N/A | Tidak ada dasar bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass □ Fail □ N/A | Menggunakan pola admin panel (cards, tabs, tabel, pagination) | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass □ Fail □ N/A | 3 tab utama + 2 sub‑tab + 6 filter kolom + aksi tabel = banyak pilihan pada satu layar | Tinggi |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Pass □ Fail □ N/A | Action button di tabel (size 32 px) < 44 px, sehingga sulit di sentuh pada mobile | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass □ Fail □ N/A | Summary cards (4) + tab & sub‑tab (5) + tabel dengan 5 kolom + filter input = > 7 item | Tinggi |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass □ Fail □ N/A | Pengguna harus memilih kategori, program, serta meng‑filter data secara manual | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass □ Fail □ N/A | Loading spinner + debounce 350 ms pada pencarian, umumnya respons cepat | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass □ Fail □ N/A | Badge status, badge progress, spinner, toast – terlihat jelas | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass □ Fail □ N/A | Bahasa Indonesia, label jelas ("Export Excel", "Import Excel", "Program") | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass □ Fail □ N/A | Tombol Batal/Close pada semua modal, reset filter tersedia | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass □ Fail □ N/A | Menggunakan Bootstrap konsisten, namun ada inline style campuran (warna, ukuran) | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass □ Fail □ N/A | Validasi file import, konfirmasi delete, disabled tombol saat loading | Tinggi |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass □ Fail □ N/A | Ikon phosphor‑react (Coins, FolderOpen, dll) konsisten | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass □ Fail □ N/A | Export/Import Excel, pagination, pencarian, sorting – meningkatkan efisiensi | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass □ Fail □ N/A | Desain bersih, kartu dengan shadow, warna netral | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass □ Fail □ N/A | Reset filter, pesan error API, empty state dengan tombol Reset | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Pass □ Fail □ N/A | Instruksi singkat pada modal import, namun tidak ada bantuan kontekstual pada tabel utama | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Penggunaan kelas Bootstrap (text‑primary, text‑muted) belum diverifikasi kontrastanya | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Sama dengan 3.1, belum dipastikan | Kritis |
| 3.3 | Warna bukan satu‑satunya pengenal informasi, peringatan, atau aksi | #3 | □ Pass □ Fail □ N/A | Badge memiliki warna + teks, memenuhi kriteria | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px (atau 24 × 24 CSS dengan padding) | #3 | □ Pass □ Fail □ N/A | Tombol aksi tabel berukuran 32 × 32 px, tidak memenuhi | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass □ Fail □ N/A | Semua button/Link dapat di‑tab, namun tidak ada skip‑link untuk melewati header | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | □ Pass □ Fail □ N/A | Fokus default Bootstrap terlihat, namun tidak ada styling khusus pada komponen custom (filter input) | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200 % tanpa assistive technology | #3 | □ Pass □ Fail □ N/A | Table responsif, tetapi sejumlah kolom tersembunyi pada zoom tinggi; butuh verifikasi | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | □ Pass □ Fail □ N/A | Tidak ada gambar, hanya ikon SVG dengan `aria‑hidden`; tidak diperlukan | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di‑siapkan sebagai dekoratif | #3 | □ Pass □ Fail □ N/A | Ikon phosphor‑react bersifat dekoratif, diberi `aria‑hidden="true"` | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Pass □ Fail □ N/A | Filter input pada TabunganProgressTable, ProgramMembersModal, MemberBillsTable tidak memiliki `<label>` atau `aria-label` | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | □ Pass □ Fail □ N/A | Swal menampilkan pesan spesifik, error API ditangani dengan alert | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | □ Pass □ Fail □ N/A | Tidak ada animasi signifikan, namun tidak ada kontrol prefers‑reduced‑motion | Menengah |
| **3.13 (Tambahan)** | Tabel dan tab memiliki atribut ARIA yang sesuai | #3 | □ Pass □ Fail □ N/A | Table tidak memiliki `<caption>`, `aria‑sort`, atau deskripsi pada kolom filter | Kritis |
| **3.14 (Tambahan)** | Notifikasi toast/alert di‑announce ke layar pembaca | #3 | □ Pass □ Fail □ N/A | Swal/alert native tidak di‑announce secara otomatis ke screen reader | Tinggi |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Menggunakan kelas Bootstrap (`bg-primary`, `text-success`) dan inline style (`backgroundColor: "#f8f9fa"`) — tidak ada variabel token | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Inline `fontSize` pada beberapa elemen (`style={{ fontSize: "0.82rem" }}`) serta variasi heading tidak berasal dari token | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | □ Pass □ Fail □ N/A | Menggunakan utility Bootstrap (`p-3`, `mb-4`, `g-3`) yang hardcode nilai, bukan token | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass □ Fail □ N/A | Menggunakan kelas Bootstrap (`rounded-3`, `shadow-sm`) tanpa token | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass □ Fail □ N/A | `TransactionTable`, `TabunganProgressTable`, `ProgramDetailModal` dll. reusable – baik | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | □ Pass □ Fail □ N/A | Button varian (`variant="outline-success"`, `disabled`, spinner) tersedia | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass □ Fail □ N/A | Menggunakan `Container/Row/Col` Bootstrap secara konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1‑h6, body, caption, label) | #4 | □ Pass □ Fail □ N/A | Tidak ada skala tipografi terpusat, ukuran ditetapkan manual di beberapa komponen | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | □ Pass □ Fail □ N/A | Phosphor‑react digunakan secara konsisten | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | □ Pass □ Fail □ N/A | Menggunakan warna Bootstrap (`bg-success`, `bg-warning`, dll) konsisten | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile‑first (dari layar kecil ke besar) | #5 | □ Pass □ Fail □ N/A | Menggunakan kelas responsive Bootstrap (`sm`, `md`, `lg`) – mobile‑first | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | □ Pass □ Fail □ N/A | Breakpoint dari Bootstrap (`Col xs={12} sm={6} lg={3}`) – jelas | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass □ Fail □ N/A | Tab scrollable, tabel `table-responsive`, kartu wrap – adaptif | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | □ Pass □ Fail □ N/A | Text‑truncate, scroll horizontal pada tabel, tidak ada pemotongan | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass □ Fail □ N/A | Belum diuji secara eksplisit, namun responsif pada kedua orientasi | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | □ Pass □ Fail □ N/A | Action button 32 × 32 px tidak memenuhi standar – kegagalan kritis | Kritis |

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
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | □ Pass □ Fail □ N/A | Modal memiliki tombol Batal/Tutup yang terlihat | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar‑benar akurat | #9 | □ Pass □ Fail □ N/A | Tidak ada urgency palsu | Menengah |
| 9.5 | Tidak ada roach‑motel (mudah daftar, sulit batal) | #9 | □ Pass □ Fail □ N/A | Tidak berlaku (bukan halaman pendaftaran) | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | □ Pass □ Fail □ N/A | **Nomor anggota dan nama anggota ditampilkan dalam tabel transaksi dan progress, dapat diakses oleh semua admin** – perlu pembatasan berdasarkan otorisasi | Tinggi |

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
| 1 | Action button ukuran 32 × 32 px < 44 × 44 px (Fitts & WCAG) | `TabunganProgressTable.jsx` baris 130‑144, `ProgramMembersModal.jsx` baris 243‑250, `MemberBillsTable.jsx` baris 124‑131 | Tingkatkan ukuran tombol menjadi minimal 44 × 44 px atau tambahkan padding yang memadai | **Kritis** |
| 2 | Filter input tanpa label/ARIA (aksesibilitas) | `TabunganProgressTable.jsx` baris 86‑93, `ProgramMembersModal.jsx` baris 159‑166, `MemberBillsTable.jsx` baris 50‑57 | Tambahkan `<label>` yang terhubung atau atribut `aria-label` pada setiap input filter | **Kritis** |
| 3 | Table tidak memiliki `<caption>` atau atribut `aria‑sort`/`aria‑label` (ARIA) | `TabunganProgressTable.jsx` `<table>` baris 64‑66, `ProgramMembersModal.jsx` `<table>` baris 129‑131, `MemberBillsTable.jsx` `<table>` baris 16‑18 | Tambahkan `<caption>` deskriptif, gunakan `aria-sort` pada header yang dapat di‑sort, beri `scope` pada `<th>` | **Kritis** |
| 4 | Warna & spacing hard‑code (design token) | Seluruh komponen, contoh `TabunganPage.jsx` baris 199‑200 (inline style), `TabunganProgressTable.jsx` baris 326‑328 (border‑radius) | Migrasikan ke design token / CSS variables yang dikelola dalam design system | **Tinggi** |
| 5 | Data pribadi (nomor anggota, nama) ditampilkan tanpa kontrol akses | `TabunganPage.jsx` baris 70‑78 (tabel anggota), `TabunganProgressTable.jsx` baris 124‑129 (daftar anggota) | Terapkan masking atau batasi visibilitas data sensitif berdasarkan peran / otorisasi | **Tinggi** |
| 6 | Tidak ada skip‑link dan indikasi focus visual yang konsisten | Seluruh halaman (header, breadcrumb) | Tambahkan skip‑link ke konten utama, pastikan `:focus-visible` memiliki styling yang jelas pada semua elemen custom | **Kritis** |
| 7 | Tidak ada dokumentasi desain, handoff, atau metrik | Semua file | Buat dokumen Figma dengan komponen terstruktur, sertakan spesifikasi visual, definisikan metrik keberhasilan (task success, SUS, dll) | **Menengah** |
| 8 | Tidak ada bukti uji usabilitas | Semua file | Lakukan usability test dengan setidaknya 5 admin keuangan, catat hasil, iterasi desain berdasarkan temuan | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Tabungan List menyediakan fungsionalitas lengkap untuk manajemen program tabungan, export/import, serta approval transaksi. Namun terdapat beberapa masalah kritis pada aksesibilitas (ukuran tombol, label input, ARIA), privasi data, dan kurangnya dokumentasi proses desain serta handoff. Direkomendasikan:
1. Perbaiki ukuran target sentuh dan tambahkan label/ARIA pada semua filter input.
2. Tambahkan caption, aria‑sort, dan pastikan tabel memenuhi WCAG.
3. Terapkan design token serta kontrol akses pada data sensitif.
4. Buat artefak desain (Figma, spesifikasi visual) dan definisikan metrik keberhasilan.
5. Lakukan uji usabilitas dengan admin dan iterasi berdasarkan temuan.
6. Pastikan skip‑link dan fokus visual konsisten.

Setelah perbaikan di atas, lakukan audit ulang sebelum rilis.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`
**Halaman:** Tabungan List
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`