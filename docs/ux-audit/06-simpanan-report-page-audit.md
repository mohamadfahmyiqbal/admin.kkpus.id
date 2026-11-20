# UI/UX Audit Checklist — Simpanan Report (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Simpanan Report (`/simpananReport`) |
| URL / Lokasi File | `src/pages/simpanan/SimpananReportPage.jsx` |
| Route Key | `simpananReportPage` |
| Halaman Terkait | `SimpananDashboard.jsx` (`/simpananDashboard`) — Dashboard Simpanan |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer + QA Engineer |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Bootstrap 5 + `admin-theme.css` (WCAG patch 20 Nov 2026) |
| Status Akhir | 🟡 Perbaikan Besar |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/simpanan/SimpananReportPage.jsx` | Halaman utama: Breadcrumb, judul, tombol Export Excel, Tab.Container (List Report / Jurnal Report) |
| `src/pages/simpanan/components/SimpananListReportTable.jsx` | Tabel 12 kolom: No, Nama, 4×(Tahun Ini), 4×(Tahun Lalu), 2×(2 Tahun Lalu) — 12 input filter, pagination, total footer |
| `src/pages/simpanan/components/SimpananJurnalReportTable.jsx` | Tabel jurnal akuntansi: Akun, Deskripsi, Debet, Kredit — 4 input filter, total baris |
| `src/pages/simpanan/components/reportConstants.js` | Konstanta: `formatRupiah()`, `REPORT_SEARCH_PLACEHOLDERS[]` (12 placeholder) |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 1 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 8 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 3 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 6 | ⚠️ Perlu perbaikan |
| 5. Responsivitas & Adaptasi | 10 | 7 | ⚠️ Perlu perbaikan |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 3 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **29** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | ❌ Fail | Tidak ada dokumentasi persona admin keuangan/koperasi dalam repo | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | ❌ Fail | Tidak ada bukti JTBD; tujuan tersirat: lihat & export laporan simpanan | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | ⚠️ Partial | Subtitle "Laporan list dan jurnal transaksi simpanan anggota" memberi konteks, tapi goal eksplisit (mis. "audit saldo per tahun") tidak didefinisikan | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | ❌ Fail | Tidak ada dokumentasi pain point | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | ❌ Fail | Tidak ada user flow; alur: buka page → lihat data → filter → export | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset | #1 | ❌ Fail | Tidak ada dasar bukti untuk keputusan desain (mis. 12 kolom, 2 tab) | Tinggi |

**Skor: 1/10**

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Konvensi umum dikenal pengguna (Jakob's Law) | #2 | ✅ Pass | Tabel laporan + tab + export mengikuti konvensi admin panel dan aplikasi akuntansi | Menengah |
| 2.2 | Jumlah opsi tidak berlebihan (Hick's Law) | #2 | ❌ Fail | **12 input filter** di header tabel sekaligus + 2 tab — terlalu banyak interaksi di satu area (`SimpananListReportTable.jsx` baris 77-102) | Tinggi |
| 2.3 | Target interaksi cukup besar (Fitts's Law) | #2 | ⚠️ Partial | Tombol Export cukup besar (`SimpananReportPage.jsx` baris 166-172), tapi 12 `compact-search-input` di thead kemungkinan < 44×44 px | Tinggi |
| 2.4 | ≤ 7(±2) item sekaligus (Miller's Law) | #2 | ❌ Fail | **12 kolom** dalam satu tabel (`SimpananListReportTable.jsx` baris 37, `minWidth: 1200px`) — melebihi batas kognitif | Tinggi |
| 2.5 | Kompleksitas tidak ditransfer ke pengguna (Tesler's Law) | #2 | ✅ Pass | Filter otomatis per kolom (tanpa tombol cari), auto-pagination, summary footer | Menengah |
| 2.6 | Respons < 400 ms (Doherty Threshold) | #2 | ✅ Pass | Filter client-side langsung (tanpa debounce), Spinner saat loading, tombol disabled | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | ✅ Pass | Spinner "Memuat data...", empty state deskriptif, disabled Export saat loading/empty | Tinggi |
| 2.8 | Bahasa & dunia nyata (Nielsen #2) | #2 | ✅ Pass | Bahasa Indonesia, label "Simpanan Tahun Ini", "Total Saldo", "Pokok", "Wajib", "Sukarela" | Menengah |
| 2.9 | Kontrol & kebebasan keluar (Nielsen #3) | #2 | ✅ Pass | Filter dapat dikosongkan, pagination reset, page size selector | Tinggi |
| 2.10 | Konsistensi & standar (Nielsen #4) | #2 | ✅ Pass | Bootstrap Table/Card/Breadcrumb konsisten dengan halaman lain | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | N/A | Tidak ada aksi destruktif di halaman ini | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | ✅ Pass | Header kolom, placeholder filter, badge total | Menengah |
| 2.13 | Fleksibilitas & efisiensi (Nielsen #7) | #2 | ✅ Pass | Export Excel, filter multi-kolom, pagination, page size selector | Rendah |
| 2.14 | Estetika & minimalis (Nielsen #8) | #2 | ✅ Pass | Card shadow-sm rounded-4, sticky header/footer, text-nowrap | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | ✅ Pass | Empty state "Data tidak ditemukan dengan filter" / "Belum ada data laporan" | Tinggi |
| 2.16 | Dokumentasi & bantuan (Nielsen #10) | #2 | ✅ Pass | Subtitle deskriptif di header, placeholder filter memberi panduan | Rendah |

**Skor: 8/10**

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal ≥ 4.5:1 | #3 | ⚠️ Partial | `text-primary` (Bootstrap blue #0d6efd) pada nilai total, `text-muted` — global CSS sudah perbaiki `.text-muted` ke #64748b, tapi `text-primary` belum diverifikasi | Kritis |
| 3.2 | Kontras elemen UI ≥ 3:1 | #3 | ⚠️ Partial | Pagination disabled di-override di `admin-theme.css` baris 67-69 (#64748b, 4.76:1) — Pass. Elemen lain perlu verifikasi | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal | #3 | ⚠️ Partial | Kolom Total di-highlight `text-primary fw-medium total-highlight` — warna + font-weight, tapi tanpa label visual tambahan. Pengguna buta warna sulit membedakan Total vs Pokok/Wajib/Sukarela hanya dari warna | Kritis |
| 3.4 | Target sentuhan ≥ 44×44 px | #3 | ❌ Fail | **12 `compact-search-input`** di `SimpananListReportTable.jsx` baris 91-100 dan **4 input** di `SimpananJurnalReportTable.jsx` baris 42-75 — ukuran kecil di dalam `<th>`, global CSS `min-height:44px` pada `input` mungkin di-override oleh class `compact-search-input` | Kritis |
| 3.5 | Navigasi keyboard (Tab) | #3 | ❌ Fail | **Breadcrumb menggunakan `onClick`** bukan `<a>` (`SimpananReportPage.jsx` baris 142-153) — tidak bisa di-focus via keyboard, tidak ada skip link di komponen ini | Kritis |
| 3.6 | Indikasi fokus terlihat | #3 | ✅ Pass | `admin-theme.css` baris 29-32: `*:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px }` | Kritis |
| 3.7 | Terbaca di zoom 200% | #3 | ❌ Fail | Tabel 12 kolom `minWidth: 1200px` (`SimpananListReportTable.jsx` baris 37) — di zoom 200% butuh lebar 2400 px, konten terpotong/scroll | Tinggi |
| 3.8 | Gambar berfungsi ada alt | #3 | N/A | Tidak ada gambar fungsional, hanya ikon Bootstrap (`bi bi-file-earmark-excel`) | Tinggi |
| 3.9 | Gambar dekoratif alt kosong | #3 | N/A | Tidak ada gambar | Rendah |
| 3.10 | Label input terprogram & terlihat | #3 | ❌ Fail | **12 input filter** di `SimpananListReportTable.jsx` baris 91-100: hanya `placeholder`, tanpa `<label>` dan tanpa `aria-label`. **4 input jurnal** di `SimpananJurnalReportTable.jsx` baris 42-75: sama. Screen reader akan membaca "edit text" tanpa konteks | Kritis |
| 3.11 | Pesan error deskriptif | #3 | ⚠️ Partial | Empty state deskriptif ("Data tidak ditemukan..."), tapi tidak ada error state untuk API gagal (catch di `SimpananReportPage.jsx` baris 56-58 hanya `console.error` ter-comment) | Tinggi |
| 3.12 | Opsi matikan animasi | #3 | ✅ Pass | `admin-theme.css` baris 35-43: `@media (prefers-reduced-motion: reduce)` — Pass | Menengah |
| **3.13** | Tabel & tab ARIA | #3 | ❌ Fail | Kedua tabel (`SimpananListReportTable.jsx`, `SimpananJurnalReportTable.jsx`) tidak memiliki `<caption>`. `react-bootstrap` Tab.Container menghasilkan ARIA otomatis, tapi tidak ada `aria-label` tambahan | Kritis |
| **3.14** | Notifikasi di-announce ke SR | #3 | ❌ Fail | Tidak ada `aria-live` region, tidak ada toast — status loading/hanya visual (Spinner + teks) | Tinggi |

**Skor: 3/10**

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna sebagai token | #4 | ❌ Fail | Inline style: `borderRight: "1px solid #e2e8f0"` (`SimpananListReportTable.jsx` baris 44, 84-88, 176), `minWidth: "1200px"` (baris 37) — hex & ukuran hardcode | Tinggi |
| 4.2 | Tipografi sebagai token | #4 | ❌ Fail | `style={{ fontSize: "12px" }}` pada Breadcrumb (`SimpananReportPage.jsx` baris 141) — hardcode | Tinggi |
| 4.3 | Spacing sebagai token | #4 | ✅ Pass | Bootstrap spacing classes: `p-2`, `p-md-3`, `mb-4`, `gap-3`, `py-4` | Tinggi |
| 4.4 | Radius & shadow sebagai token | #4 | ⚠️ Partial | `rounded-3`, `rounded-4`, `border-0`, `shadow-sm` — Bootstrap classes konsisten tapi tidak tokenized | Menengah |
| 4.5 | Komponen reusable | #4 | ✅ Pass | `SimpananListReportTable` dan `SimpananJurnalReportTable` dipisah sebagai komponen, `formatRupiah` di `reportConstants.js` | Tinggi |
| 4.6 | Varian komponen | #4 | ✅ Pass | Button: `disabled` saat loading/empty, Spinner loading, Pagination disabled state | Tinggi |
| 4.7 | Grid & layout konsisten | #4 | ✅ Pass | `Card > Card.Body > table-responsive` — konsisten dengan halaman lain | Tinggi |
| 4.8 | Skala tipografi | #4 | ⚠️ Partial | `h4`, `p small`, `fw-bold`, `fw-medium` — tercampur, tidak ada skala terdefinisi | Menengah |
| 4.9 | Ikonset konsisten | #4 | ✅ Pass | Bootstrap Icons (`bi bi-file-earmark-excel`) — satu set | Menengah |
| 4.10 | Warna & ikon status seragam | #4 | ⚠️ Partial | `text-primary` untuk nilai total, `text-muted` untuk placeholder, `bg-sticky` untuk sticky column — campur Bootstrap + custom class | Tinggi |

**Skor: 6/10**

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Mobile-first | #5 | ⚠️ Partial | Menggunakan `px-md-4`, `flex-column flex-md-row` — responsif tapi bukan mobile-first murni | Tinggi |
| 5.2 | Breakpoint terdefinisi | #5 | ✅ Pass | Bootstrap `md`, `sm` breakpoints digunakan | Tinggi |
| 5.3 | Layout berubah per breakpoint | #5 | ✅ Pass | Header actions: `flex-column` di mobile, `flex-md-row` di desktop; tab scrollable | Tinggi |
| 5.4 | Konten tidak pecah/terpotong | #5 | ⚠️ Partial | `table-responsive` + `minWidth: 1200px` — di mobile perlu horizontal scroll, konten tidak terpotong tapi pengalaman kurang ideal | Tinggi |
| 5.5 | Usable di portrait & landscape | #5 | ✅ Pass | `table-responsive` + tab scrollable horizontal | Menengah |
| 5.6 | Touch target mobile ≥ 44×44 px | #5 | ❌ Fail | `compact-search-input` di thead kemungkinan < 44×44 px; pagination `size="sm"` juga kecil | Kritis |
| 5.7 | Horizontal scroll tab di mobile | #5 | ✅ Pass | `WebkitOverflowScrolling: "touch"` + wheel handler (`SimpananReportPage.jsx` baris 28-38) — Pass | Menengah |

**Skor: 7/10**

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Discover: riset & analisis kompetitor | #6 | ❌ Fail | Tidak ada bukti riset pengguna | Menengah |
| 6.2 | Define: persona, journey, requirement | #6 | ❌ Fail | Tidak ada persona/journey terdefinisi | Menengah |
| 6.3 | Develop: sketsa, wireframe, prototipe | #6 | ✅ Pass | Kode tersedia sebagai hasil develop (4 file komponen) | Menengah |
| 6.4 | Deliver: desain hi-fi, prototype, handoff | #6 | ❌ Fail | Kode siap, tapi belum melalui uji coba dan handoff formal | Tinggi |
| 6.5 | Keluaran ditinjau stakeholder | #6 | ❌ Fail | Tidak ada bukti review stakeholder | Menengah |

**Skor: 1/5**

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.2 | Komponen dipublish ke library | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.3 | Spesifikasi visual lengkap | #7 | ❌ Fail | Tidak ada dokumen spesifikasi | Tinggi |
| 7.4 | Prototype interaktif alur utama | #7 | ❌ Fail | Tidak ada | Tinggi |
| 7.5 | Annotation interaksi, state, responsivitas | #7 | ❌ Fail | Tidak ada | Menengah |
| 7.6 | Asset ekspor skala benar | #7 | ❌ Fail | Tidak ada asset yang diekspor | Menengah |
| 7.7 | Checklist handoff ditandai | #7 | ❌ Fail | Belum dilakukan | Tinggi |

**Skor: 0/5**

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji dengan pengguna nyata (min 5) | #8 | ❌ Fail | Tidak ada bukti uji coba | Tinggi |
| 8.2 | Data uji dicatat (tugas, waktu, SUS) | #8 | ❌ Fail | Tidak ada data | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan | #8 | ❌ Fail | Belum dilakukan | Tinggi |
| 8.4 | Validasi ulang setelah iterasi | #8 | ❌ Fail | Belum dilakukan | Menengah |
| 8.5 | Fitur baru min 1 siklus uji | #8 | ❌ Fail | Belum ada uji usabilitas | Tinggi |

**Skor: 0/5**

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity | #9 | N/A | Tidak berlaku (bukan halaman langganan) | Kritis |
| 9.2 | Tidak ada hidden cost | #9 | N/A | Tidak berlaku | Kritis |
| 9.3 | Opsi batal tidak disembunyikan | #9 | N/A | Tidak berlaku (tidak ada aksi yang perlu dibatalkan) | Kritis |
| 9.4 | Tidak ada urgency palsu | #9 | ✅ Pass | Tidak ada urgency palsu di halaman ini | Menengah |
| 9.5 | Tidak ada roach-motel | #9 | N/A | Tidak berlaku | Kritis |
| 9.6 | Privasi default | #9 | ❌ Fail | **Nama anggota ditampilkan penuh** di kolom Nama (`SimpananListReportTable.jsx` baris 130) dalam konteks laporan keuangan — data pribadi anggota terpapar. Seharusnya bisa di-mask atau dibatasi sesuai otorisasi | Tinggi |

**Skor: 3/5**

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.2 | Time-on-task ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.3 | Error rate ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.4 | NPS / SUS ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.5 | Konversi & retensi ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |

**Skor: 0/5**

---

## Temuan Kritis & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | 12 input filter di List Report **tanpa `<label>` dan tanpa `aria-label`** — screen reader tidak bisa mengidentifikasi tujuan tiap input | `SimpananListReportTable.jsx` baris 91-100 | Tambahkan `aria-label` pada setiap input (mis. `aria-label="Filter kolom Total Tahun Ini"`), atau tambahkan `<label>` tersembunyi dengan `visually-hidden` | **Kritis** |
| 2 | 4 input filter di Jurnal Report **tanpa `<label>` dan tanpa `aria-label`** | `SimpananJurnalReportTable.jsx` baris 42-75 | Tambahkan `aria-label` pada setiap input: "Filter Akun", "Filter Deskripsi", "Filter Debet", "Filter Kredit" | **Kritis** |
| 3 | Breadcrumb menggunakan `onClick()` bukan `<a>` — **tidak bisa di-focus via keyboard** dan tidak di-announce ke screen reader sebagai link navigasi | `SimpananReportPage.jsx` baris 142-153 | Ganti `onClick` dengan `<Link>` dari `react-router-dom` atau `<a href>`, atau tambahkan `role="link"`, `tabIndex={0}`, dan `onKeyDown` untuk Enter/Space | **Kritis** |
| 4 | Kedua tabel **tidak memiliki `<caption>`** dan tidak ada atribut ARIA tambahan (`aria-label`, `scope="col"`) | `SimpananListReportTable.jsx` baris 35-38, `SimpananJurnalReportTable.jsx` baris 32-33 | Tambahkan `<caption className="visually-hidden">Laporan Simpanan per Tahun</caption>` dan `scope="col"` pada semua `<th>` | **Kritis** |
| 5 | **Jurnal Report: total Debet dan Kredit keduanya menampilkan `summary.total_all`** — seharusnya Debet = total_all, Kredit = total_all hanya jika setara, tapi ini tidak valid secara akuntansi | `SimpananJurnalReportTable.jsx` baris 107-108 | Perbaiki: Debet total = `summary.total_all`, Kredit total = `summary.total_pokok + summary.total_wajib + summary.total_sukarela` (seharusnya sama, tapi harus dihitung eksplisit) | **Tinggi** |
| 6 | **List Report footer: kolom Tahun Lalu dan 2 Tahun Lalu menampilkan angka 0 hardcoded** — total seharusnya dihitung dari data | `SimpananListReportTable.jsx` baris 180-185 | Hitung total dari `reportList` untuk `tahun_lalu` dan `tahun_lalu2`, atau tampilkan "N/A" jika data tidak tersedia | **Tinggi** |
| 7 | **12 kolom tabel dengan `minWidth: 1200px`** — cognitive overload (Miller's Law: 7±2) dan tidak usable di mobile | `SimpananListReportTable.jsx` baris 37 | Pertimbangkan: (a) pisah jadi 3 tabel terpisah per tahun, (b) gunakan accordion per tahun, atau (c) kurangi kolom default dan tampilkan detail on-click | **Tinggi** |
| 8 | `compact-search-input` di thead kemungkinan **< 44×44 px** (target sentuhan WCAG 2.5.5) | `SimpananListReportTable.jsx` baris 91-100, `SimpananJurnalReportTable.jsx` baris 42-75 | Tambahkan CSS untuk `compact-search-input { min-height: 44px; min-width: 44px }` atau gunakan `form-control-sm` dengan padding yang cukup | **Tinggi** |
| 9 | Warna `text-primary` sebagai satu-satunya pembeda kolom Total vs kolom lain (risk untuk pengguna buta warna) | `SimpananListReportTable.jsx` baris 132, 140, 148 | Tambahkan label visual (mis. icon, underline, atau "Σ" prefix) selain warna dan font-weight | **Tinggi** |
| 10 | Nama anggota ditampilkan penuh tanpa maskir — data pribadi terpapar di laporan | `SimpananListReportTable.jsx` baris 130 | Terapkan mask parsial (mis. "A****n B") atau batasi akses sesuai peran admin | **Tinggi** |
| 11 | Inline style hardcode: `borderRight: "1px solid #e2e8f0"`, `minWidth: "1200px"`, `fontSize: "12px"` | `SimpananListReportTable.jsx` baris 44, 84-88, 176; `SimpananReportPage.jsx` baris 141 | Migrasi ke CSS variables / design token | **Menengah** |
| 12 | Error state API tidak ditampilkan ke user (catch hanya comment) | `SimpananReportPage.jsx` baris 56-58 | Tambahkan Alert/Toast error jika API gagal, dengan tombol "Coba Lagi" | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Simpanan Report memiliki struktur yang baik: 2 tab (List Report / Jurnal Report), filter per kolom, pagination, export Excel, dan total footer. Namun terdapat beberapa masalah kritis:

### Masalah Utama

1. **Aksesibilitas (Kritis, 4 item):** 16 input filter tanpa label/aria-label, Breadcrumb tidak accessible via keyboard, tabel tanpa `<caption>`, dan compact-search-input kemungkinan < 44×44 px.
2. **Bug fungsional (Tinggi):** Jurnal Report menampilkan `summary.total_all` untuk kedua kolom Debet dan Kredit; List Report footer menampilkan angka 0 hardcoded untuk tahun lalu.
3. **Cognitive overload (Tinggi):** 12 kolom sekaligus dalam satu tabel (melebihi Miller's Law 7±2).
4. **Privasi (Tinggi):** Nama anggota ditampilkan penuh tanpa maskir.
5. **Riset & Proses (Gagal):** Tidak ada dokumentasi persona, JTBD, user journey, uji usabilitas, atau handoff.

### Langkah Selanjutnya

1. **Kritis (sebelum rilis):** Perbaiki 4 temuan aksesibilitas (label input, Breadcrumb keyboard, table caption, touch target).
2. **Tinggi (sebelum rilis):** Perbaiki bug jurnal total, footer hardcoded zeros, kurangi cognitive load (12 kolom), maskir nama anggota.
3. **Menengah:** Migrasi inline style ke design token, tambahkan error state untuk API gagal.
4. **Proses:** Lakukan uji usabilitas dengan min. 5 admin keuangan, buat dokumentasi persona & JTBD, siapkan handoff.
5. **Audit ulang** setelah seluruh perbaikan Kritis dan Tinggi selesai.

---

**Dibuat oleh:** Senior UI/UX Designer + QA Engineer  
**Halaman:** Simpanan Report  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`  
**File kode sumber:**
- `D:\kkpus\admin.kkpus.id\src\pages\simpanan\SimpananReportPage.jsx`
- `D:\kkpus\admin.kkpus.id\src\pages\simpanan\components\SimpananListReportTable.jsx`
- `D:\kkpus\admin.kkpus.id\src\pages\simpanan\components\SimpananJurnalReportTable.jsx`
- `D:\kkpus\admin.kkpus.id\src\pages\simpanan\components\reportConstants.js`
