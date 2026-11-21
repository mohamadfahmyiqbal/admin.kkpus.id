# UI/UX Audit Checklist — Simpanan Dashboard (HASIL AUDIT)

> **Referensi utama:** Audit lengkap tersedia di **`05-simpanan-page-audit.md`** (skor 27/80, status: 🟡 Perbaikan Besar).
> File ini adalah duplikasi nama file dari index generator; isi di bawah disesuaikan dengan hasil audit `05-simpanan-page-audit.md`.

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Simpanan Dashboard (`/simpananDashboard`) |
| URL / Lokasi File | `src/pages/simpanan/SimpananDashboard.jsx` |
| Route Key | `simpananDashboard` |
| Halaman Terkait | `SimpananReportPage.jsx` (`/simpananReport`) — Laporan List & Jurnal |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer + QA Engineer |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Bootstrap 5 + `admin-theme.css` (WCAG patch 20 Nov 2026) + `design-tokens.css` |
| Status Akhir | 🟡 Perbaikan Besar |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/simpanan/SimpananDashboard.jsx` | Halaman utama: summary cards, tabs (Pokok/Wajib/Sukarela), sub-tabs (Setoran/Pencairan), transaksi tabel, import/export, approval |
| `src/components/ui/TransactionTable.jsx` | Tabel transaksi simpanan reusable (filter, sort, pagination, aksi approve/detail) |
| `src/components/modals/TransactionDetailModal.jsx` | Modal detail transaksi (lazy-loaded) |
| `src/components/modals/WithdrawalApprovalModal.jsx` | Modal approval pencairan (lazy-loaded) |
| `src/components/modals/ManualPaymentApprovalModal.jsx` | Modal approval pembayaran manual (lazy-loaded) |
| `src/components/modals/GenericImportModal.jsx` | Modal import Excel generik (lazy-loaded) |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 6 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 4 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 4 | ⚠️ Perlu verifikasi |
| 5. Responsivitas & Adaptasi | 10 | 7 | ✅ Baik |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 3 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **27** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | ❌ Fail | Tidak ada dokumentasi riset dalam kode | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | ❌ Fail | Tidak ada bukti JTBD | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | ⚠️ Partial | Tujuan: pantau dan kelola transaksi simpanan, verifikasi setoran/pencairan — tidak dikomunikasikan eksplisit | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | ❌ Fail | Tidak ada bukti riset | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | ❌ Fail | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | ❌ Fail | Tidak ada dasar bukti | Tinggi |

**Skor: 2/10**

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | ✅ Pass | Layout tabel transaksi dengan summary cards, filter, sort, pagination mengikuti konvensi admin panel dan aplikasi perbankan | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | ❌ Fail | 3 tab utama + 2 sub-tab + 6 filter kolom + sort + pagination + aksi approve/detail — opsi cukup banyak di satu layar | Tinggi |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | ❌ Fail | Tombol aksi tabel (CheckCircle, Eye) menggunakan size={16} dalam button border-0 — ukuran kecil kemungkinan < 44×44 px | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | ❌ Fail | 4 kartu statistik + 3 tab + 2 sub-tab + 6 kolom tabel — mendekati/melebihi batas 7±2 | Tinggi |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | ⚠️ Partial | Logika approval dan jenis simpanan diabstraksi ke komponen, tapi pengguna masih harus memilih jenis simpanan dan sub-kategori manual | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | ✅ Pass | Debounce pencarian 350ms, Spinner loading, tombol disabled selama loading — respons baik | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | ✅ Pass | Badge status transaksi (Selesai/Menunggu Verifikasi/Ditolak), info "Menampilkan X-Y dari Z transaksi", Spinner — baik | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | ✅ Pass | Bahasa Indonesia, label yang jelas ("Waktu Transaksi", "Anggota", "Jenis Simpanan", "Nominal", "Status") | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | ✅ Pass | Tombol Batal pada modal, close button modal, reset filter — kontrol pengguna baik | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | ⚠️ Partial | Menggunakan Bootstrap classes konsisten, tapi ada inline style campuran (cursor, width, fontSize) | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | ✅ Pass | Validasi file Excel sebelum import, disabled tombol saat loading, konfirmasi approval — cukup baik | Tinggi |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | ✅ Pass | Icon phosphor-react (Wallet, Money, ArrowDownLeft, ArrowUpRight, Eye, CheckCircle) sebagai pengenal visual | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | ✅ Pass | Export Excel, import Excel, page size selector (10/25/50/100), smooth horizontal scroll pada tab — fitur efisiensi baik | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | ✅ Pass | Desain bersih, kartu dengan shadow, badge warna sesuai status transaksi | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | ✅ Pass | Reset filter, error message dari API, EmptyState dengan tombol Reset Filter — baik | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | ⚠️ Partial | Import modal memiliki instruction notes (1-3 langkah), tapi tidak ada tooltip/panduan di tabel utama | Rendah |

**Skor: 6/10**

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | ⚠️ Partial | Menggunakan Bootstrap text-primary/success/warning/danger/info dan text-muted — perlu verifikasi kontras aktual | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | ⚠️ Partial | Perlu verifikasi CSS | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi, peringatan, atau aksi | #3 | ✅ Pass | Badge status menggunakan warna + teks label ("Selesai", "Menunggu Verifikasi", "Ditolak") — cukup baik | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px (atau 24 × 24 CSS dengan padding memadai) | #3 | ❌ Fail | Tombol aksi tabel (CheckCircle, Eye) size={16} dalam button kecil kemungkinan < 44×44 px | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | ⚠️ Partial | Elemen HTML standar (button, input, select), seharusnya bisa diakses Tab, tapi tidak ada skip link di komponen ini | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | ⚠️ Partial | Bootstrap menyediakan focus ring, perlu verifikasi visual pada semua elemen termasuk tombol aksi tabel | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% tanpa assistive technology | #3 | ❌ Fail | Perlu verifikasi CSS dan layout saat zoom 200% (tabel 6 kolom bisa pecah) | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | N/A | Tidak ada gambar berfungsi, hanya ikon SVG | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di-siapkan sebagai dekoratif | #3 | ❌ Fail | Ikon phosphor-react dekoratif tidak memiliki aria-hidden, mungkin dibaca layar pembaca | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | ❌ Fail | Filter Form.Control di header tabel hanya memiliki placeholder, tidak ada `<label>` terlihat | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | ✅ Pass | Error dari API ditangani catch, alert untuk export gagal — cukup deskriptif | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | ⚠️ Partial | Tidak ada animasi signifikan di SimpananDashboard, animate-fade-in pada SimpananReportPage — perlu verifikasi prefers-reduced-motion | Menengah |
| 3.13 | Tabel dan tab memiliki atribut ARIA yang sesuai | #3 | ❌ Fail | react-bootstrap Tab/Nav mungkin sudah ARIA, tabel tidak memiliki caption/summary, th sort menggunakan cursor pointer tapi tanpa aria-sort/aria-label | Kritis |
| 3.14 | Notifikasi toast/alert di-announce ke layar pembaca | #3 | ❌ Fail | `alert()` native untuk export gagal, SweetAlert2 untuk konfirmasi — tidak diketahui apakah di-announce ke screen reader | Tinggi |

**Skor: 4/10**

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | ❌ Fail | Menggunakan Bootstrap bg-${c.color}/text-${c-color} (hardcode class), inline style cursor/width/fontSize — tidak ada CSS variable/token | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | ❌ Fail | Inline style fontSize "0.82rem", "0.775rem", "12px" — tidak terdefinisi sebagai token | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | ❌ Fail | Menggunakan Bootstrap spacing (p-3, mb-4, g-3, px-2.5, py-2.5) hardcode | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | ⚠️ Partial | Bootstrap rounded-3, rounded-4, rounded-pill, shadow-sm hardcode | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | ✅ Pass | TransactionTable reusable, SummaryCard reusable, modals lazy-loaded reusable | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | ✅ Pass | Tombol ada variant primary/success/outline/white/link, loading via Spinner, disabled state ada | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | ✅ Pass | Bootstrap Container/Row/Col, konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1-h6, body, caption, label) | #4 | ⚠️ Partial | Menggunakan h4, p, small, fw-bold, text-muted campuran — tidak ada skala terdefinisi | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | ✅ Pass | Menggunakan phosphor-react (Wallet, Money, ArrowDownLeft, dll.) — konsisten | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | ✅ Pass | Menggunakan warna Bootstrap (success, warning, danger, info) — seragam | Tinggi |

**Skor: 4/10**

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile-first (dari layar kecil ke besar) | #5 | ⚠️ Partial | Menggunakan Bootstrap classes responsive (md/sm/lg), tapi tidak ada CSS custom untuk verifikasi mobile-first | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | ✅ Pass | Menggunakan Col md={3} sm={6}, Col lg breakpoint — Bootstrap breakpoint | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | ✅ Pass | Header actions wrap di mobile, tab scrollable horizontal, tabel table-responsive — baik | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | ✅ Pass | text-truncate pada nilai, tabel responsive, smooth horizontal scroll pada tab — konten disusun ulang | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | ⚠️ Partial | Perlu verifikasi | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | ❌ Fail | Tombol aksi tabel kecil kemungkinan < 44×44 px di mobile | Kritis |
| 5.7 | Horizontal scroll pada tab dapat diakses dengan sentuh di mobile | #5 | ✅ Pass | WebkitOverflowScrolling: "touch" dan wheel handler untuk smooth scroll — baik | Menengah |

**Skor: 7/10**

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | ❌ Fail | Tidak ada bukti riset pengguna | Menengah |
| 6.2 | Tahap Define: persona, user journey, dan requirement terdefinisi | #6 | ❌ Fail | Tidak ada persona/journey terdefinisi | Menengah |
| 6.3 | Tahap Develop: sketsa, wireframe, dan prototipe rendah fidelitas tersedia | #6 | ✅ Pass | Kode tersedia sebagai hasil develop | Menengah |
| 6.4 | Tahap Deliver: desain tinggi fidelitas, prototype interaktif, dan handoff tersedia | #6 | ❌ Fail | Kode siap, tapi belum melalui uji coba dan handoff | Tinggi |
| 6.5 | Setiap tahapan memiliki keluaran yang ditinjau stakeholder sebelum melanjut | #6 | ❌ Fail | Tidak ada bukti review stakeholder | Menengah |

**Skor: 1/5**

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur: halaman bernama rapi, auto layout digunakan | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.2 | Komponen dipublish ke library design system | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.3 | Spesifikasi visual lengkap: ukuran, jarak, warna (hex), tipografi, radius, shadow | #7 | ❌ Fail | Tidak ada dokumen spesifikasi | Tinggi |
| 7.4 | Prototype interaktif alur utama dapat diklik dan diuji tanpa kode | #7 | ❌ Fail | Tidak ada | Tinggi |
| 7.5 | Annotation catatan desain: perilaku interaksi, state, dan responsivitas | #7 | ❌ Fail | Tidak ada | Menengah |
| 7.6 | Asset diekspor dalam skala yang benar (SVG/PNG 1x, 2x) | #7 | ❌ Fail | Tidak ada | Menengah |
| 7.7 | Checklist handoff telah ditandai: review selesai, aksesibilitas diperiksa, developer memiliki akses | #7 | ❌ Fail | Belum dilakukan | Tinggi |

**Skor: 0/5**

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dilakukan dengan pengguna nyata (minimal 5 orang per iterasi) | #8 | ❌ Fail | Tidak ada bukti uji coba | Tinggi |
| 8.2 | Data uji coba dicatat: tugas gagal, waktu penyelesaian, kepuasan (SUS) | #8 | ❌ Fail | Tidak ada data | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan uji coba | #8 | ❌ Fail | Belum dilakukan | Tinggi |
| 8.4 | Validasi ulang dilakukan setelah iterasi | #8 | ❌ Fail | Belum dilakukan | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa minimal satu siklus uji usabilitas | #8 | ❌ Fail | Belum ada uji usabilitas | Tinggi |

**Skor: 0/5**

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity (paksa langganan berlanjut) | #9 | N/A | Tidak berlaku | Kritis |
| 9.2 | Tidak ada hidden cost (biaya tersembunyi) | #9 | N/A | Tidak berlaku | Kritis |
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | ✅ Pass | Modal approval memiliki tombol Tutup/Batal, import modal memiliki Batal — opsi batal terlihat | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar-benar akurat | #9 | ✅ Pass | Tidak ada urgency palsu di halaman ini | Menengah |
| 9.5 | Tidak ada roach-motel (mudah daftar, sulit batal) | #9 | N/A | Tidak berlaku (bukan halaman pendaftaran) | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | ❌ Fail | **Nomor anggota dan nama anggota ditampilkan dalam tabel transaksi — data pribadi anggota terpapar dalam konteks transaksi keuangan** | Tinggi |

**Skor: 3/5**

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.2 | Time-on-task telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.3 | Error rate telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.4 | NPS / SUS telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.5 | Konversi dan retensi telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |

**Skor: 0/5**

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Tombol aksi tabel (CheckCircle verifikasi, Eye detail) ukuran kecil kemungkinan < 44×44 px | `TransactionTable.jsx` baris 407-452 | Perbesar tombol atau tambahkan padding agar minimal 44×44 px | **Kritis** |
| 2 | Filter input di header tabel tidak memiliki `<label>` yang terlihat dan terprogram | `TransactionTable.jsx` baris 204-261 | Tambahkan `<label>` yang terlihat atau `aria-label` pada setiap input filter | **Kritis** |
| 3 | Tidak ada skip link dan indikasi fokus keyboard yang terlihat jelas | `SimpananDashboard.jsx` + semua komponen | Tambahkan skip link dan pastikan `:focus-visible` terlihat | **Kritis** |
| 4 | Tabel tanpa caption/summary dan th sort tanpa aria-sort/aria-label | `TransactionTable.jsx` baris 142-198 | Tambahkan `<caption>`, `aria-sort`, dan atribut ARIA pada tabel | **Kritis** |
| 5 | Warna dan spacing hardcode (inline style cursor, width, fontSize) | `SimpananDashboard.jsx`, `TransactionTable.jsx` | Migrasi ke design token / CSS variable | **Tinggi** |
| 6 | Ikon phosphor-react tanpa aria-label atau aria-hidden | Semua komponen (phosphor-react ikon) | Tambahkan `aria-label` pada ikon fungsional atau `aria-hidden="true"` pada ikon dekoratif | **Tinggi** |
| 7 | `alert()` native untuk gagal export tidak di-announce ke screen reader | `SimpananDashboard.jsx` baris 292, 334 | Ganti `alert()` dengan toast atau SweetAlert2 yang accessible | **Tinggi** |
| 8 | Nomor anggota dan nama anggota ditampilkan dalam tabel transaksi | `TransactionTable.jsx` baris 334-344 | Terapkan maskir data atau batasi tampilan nomor anggota sesuai otorisasi | **Tinggi** |
| 9 | 3 tab utama + 2 sub-tab + 6 filter kolom di satu layar risiko overload pilihan | `SimpananDashboard.jsx` baris 446-523 | Pertimbangkan menyederhanakan filter atau membagi ke dalam seksi yang lebih terfokus | **Tinggi** |
| 10 | Tidak ada uji usabilitas dan handoff yang terdokumentasi | Seluruh halaman | Lakukan uji coba usabilitas dengan minimal 5 admin keuangan, buat spesifikasi handoff | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Simpanan Dashboard memiliki fitur yang sangat lengkap: summary cards (4 jenis simpanan), tabs untuk jenis simpanan (Pokok/Wajib/Sukarela), sub-tabs untuk Sukarela (Setoran/Pencairan), tabel transaksi dengan filter per kolom, sort, pagination, export/import Excel, dan modal approval untuk verifikasi setoran dan pencairan. Laporan (List Report dan Jurnal) juga tersedia untuk keperluan akuntansi.

Namun terdapat beberapa celah kritis yang harus diperbaiki:

### Masalah Utama

1. **Aksesibilitas (Kritis):** Tombol aksi kecil (< 44×44 px), filter tanpa label, tidak ada skip link/fokus indikator, tabel tanpa ARIA, `alert()` native tidak accessible.
2. **Privasi data (Tinggi):** Nomor anggota dan nama anggota ditampilkan dalam tabel transaksi.
3. **Design System (Tinggi):** Masih banyak inline style hardcode, belum menggunakan design token.
4. **Kognitif (Tinggi):** Terlalu banyak opsi sekaligus (tab + sub-tab + filter + aksi).

### Langkah Selanjutnya

1. **Kritis (sebelum rilis):** Perbaiki 4 temuan aksesibilitas (tombol aksi ≥44px, label filter, skip link, table caption).
2. **Tinggi (sebelum rilis):** Migrasi inline style ke design token, tambahkan aria-label pada ikon, ganti `alert()` dengan toast, maskir data anggota, kurangi kognitif overload.
3. **Menengah:** Lakukan uji usabilitas dengan min. 5 admin keuangan, buat spesifikasi handoff dan prototype interaktif.
4. **Audit ulang** setelah seluruh perbaikan Kritis dan Tinggi selesai.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Simpanan Dashboard  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`  
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\simpanan\SimpananDashboard.jsx` dan komponen terkait