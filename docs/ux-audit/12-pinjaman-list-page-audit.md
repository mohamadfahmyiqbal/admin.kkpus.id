# UI/UX Audit Checklist — Pinjaman List (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Pinjaman List — `PinjamanList.jsx` + komponen terkait |
| URL / Lokasi File | `src/pages/program/pinjaman/PinjamanList.jsx` |
| Route Key | `pinjamanList` (dipanggil via breadcrumb `jwtEncode("pinjamanList")`) |
| Halaman Terkait | `PinjamanReport.jsx` (`/pinjamanReport`), `PinjamanInputModal.jsx` |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Bootstrap 5 + Phosphor Icons + react-icons (mixed) |
| Status Akhir | 🟡 Perbaikan Besar |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/program/pinjaman/PinjamanList.jsx` | Halaman utama: breadcrumb, header, tab navigation (Daftar Pinjaman / Approval), 5 modal (approval, manual payment, detail, setoran, import), export logic |
| `src/pages/program/pinjaman/components/PinjamanTable.jsx` | Tabel daftar pinjaman: 9 kolom, 8 filter input, sort per kolom, pagination (10/25/50/100), aksi lihat invoice + kartu setoran |
| `src/pages/program/pinjaman/components/PinjamanListHeader.jsx` | Header sub-tab: judul "Daftar Pinjaman Lunak", tombol Refresh, Export Excel, Import Excel |
| `src/pages/program/pinjaman/components/PinjamanApprovalTable.jsx` | Tabel antrian approval: 4 kolom, 3 filter, sort, pagination, tombol "Proses" per baris |
| `src/pages/program/pinjaman/components/PinjamanApprovalBadge.jsx` | Reusable badge untuk status approval (Menunggu/Disetujui/Berjalan/Selesai/Ditolak) |
| `src/pages/program/pinjaman/components/ImportPinjamanModal.jsx` | Modal import Excel 2 tab (Data Pinjaman / Transaksi Cicilan), validasi file, template download, import failure table |
| `src/pages/program/pinjaman/components/HutangKasTab.jsx` | Tabel + modal form untuk transaksi hutang kas (digunakan di PinjamanReport) |
| `src/pages/program/pinjaman/components/AktivaTetapTab.jsx` | Tabel + modal form untuk transaksi aktiva tetap (digunakan di PinjamanReport) |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 7 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 5 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 5 | ⚠️ Perlu perbaikan |
| 5. Responsivitas & Adaptasi | 10 | 6 | ⚠️ Perlu perbaikan |
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
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | ❌ Fail | Tidak ada dokumentasi persona admin keuangan/kepegawaian koperasi dalam kode atau docs | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | ❌ Fail | Tidak ada bukti JTBD. Fungsi tersirat: kelola pinjaman lunak, proses approval, import/export data | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | ⚠️ Partial | Tujuan tersirat dari deskripsi header: "Kelola dan pantau transaksi pinjaman lunak anggota" — tidak dikomunikasikan sebagai dokumen desain | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | ❌ Fail | Tidak ada bukti riset pain point | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | ❌ Fail | Tidak ada dokumentasi journey. Flow tersirat: lihat daftar → filter → approval → setoran → export | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset | #1 | ❌ Fail | Tidak ada dasar bukti. Pilihan 8 filter kolom di tabel tampaknya intuitif tapi tidak terdokumentasi | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Jakob's Law — konvensi umum | #2 | ✅ Pass | Layout admin panel standar: breadcrumb, card dengan tabs, tabel dengan filter/sort/pagination, modal untuk aksi detail | Menengah |
| 2.2 | Hick's Law — jumlah opsi tidak berlebihan | #2 | ⚠️ Partial | 2 tab utama + 8 filter input + 2 filter select + sort 8 kolom + 2 aksi per baris + 3 tombol header = banyak keputusan sekaligus di satu layar | Tinggi |
| 2.3 | Fitts's Law — target interaksi cukup besar | #2 | ❌ Fail | Tombol reset filter 26×26px (di bawah 44×44px), tombol aksi tabel dengan icon size=16 dalam `btn-action-table` kemungkinan < 44px, pagination sm | Tinggi |
| 2.4 | Miller's Law — chunking informasi | #2 | ⚠️ Partial | 9 kolom tabel + 8 filter + 2 select — mendekati batas 7±2. Filter di-embed di dalam tabel (bukan terpisah) membantu, tapi total informasi tetap tinggi | Menengah |
| 2.5 | Tesler's Law — kompleksitas tidak ditransfer | #2 | ✅ Pass | Logika filter/sort/pagination di-abstract ke `PinjamanTable` dan `PinjamanApprovalTable`. Import modal meng-handle validasi file. Approval chain di-abstract ke `ProgramApprovalModal` | Menengah |
| 2.6 | Doherty Threshold — respons < 400ms | #2 | ✅ Pass | Spinner loading saat fetch, tombol disabled selama loading, debounce tidak perlu karena client-side filter (instant). Refresh button disabled saat loading | Menengah |
| 2.7 | Nielsen #1 — Visibilitas status sistem | #2 | ✅ Pass | Badge status approval (Menunggu/Disetujui/Berjalan/Selesai/Ditolak), Badge status cicilan (Lunas/Belum Lunas), Spinner, info "Menampilkan X-Y dari Z", badge count pending approval di tab | Tinggi |
| 2.8 | Nielsen #2 — Kecocokan dunia nyata | #2 | ✅ Pass | Bahasa Indonesia, label akuntansi yang familiar (Jumlah Pinjaman, Tenor, Cicilan, Piutang), format Rupiah, istilah "Lunas/Belum Lunas" | Menengah |
| 2.9 | Nielsen #3 — Kontrol & kebebasan keluar | #2 | ✅ Pass | Reset filter (tombol X), Batal di semua modal, close button modal, back navigation via breadcrumb | Tinggi |
| 2.10 | Nielsen #4 — Konsistensi & standar | #2 | ⚠️ Partial | Bootstrap classes konsisten, tapi mixed icon library (phosphor-react untuk sebagian besar, react-icons/fa untuk FaHandHoldingUsd di header). Inline style mixed dengan utility classes | Tinggi |
| 2.11 | Nielsen #5 — Pencegahan kesalahan | #2 | ✅ Pass | Validasi file Excel (type check .xlsx/.xls), tombol disabled saat loading, `disabled={!hasData}` untuk export, `disabled={!file}` untuk import submit | Tinggi |
| 2.12 | Nielsen #6 — Pengenalan bukan ingatan | #2 | ✅ Pass | Icon phosphor (Receipt, Coins, User, X, ArrowsDownUp, CaretUp/Down) sebagai pengenal visual. Placeholder di filter. Tooltip di tombol aksi | Menengah |
| 2.13 | Nielsen #7 — Fleksibilitas & efisiensi | #2 | ✅ Pass | Export/Import Excel, page size selector (10/25/50/100), filter per kolom, sort multi-direction, keyboard-accessible form elements | Rendah |
| 2.14 | Nielsen #8 — Estetika & minimalis | #2 | ✅ Pass | Card dengan shadow-sm, rounded-4, badge warna sesuai status, header dengan icon, desain bersih | Rendah |
| 2.15 | Nielsen #9 — Pemulihan dari kesalahan | #2 | ✅ Pass | Reset filter, empty state dengan pesan "Tidak ada data yang cocok" + tombol reset, error handling via SweetAlert, `ImportFailureTable` untuk import gagal | Tinggi |
| 2.16 | Nielsen #10 — Dokumentasi & bantuan | #2 | ⚠️ Partial | Import modal memiliki instruksi 4 langkah + template download. Tapi tidak ada tooltip/panduan di tabel utama. Placeholder di filter membantu | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal ≥ 4.5:1 | #3 | ⚠️ Partial | Bootstrap `text-muted` (secondary) pada `bg-light` — perlu verifikasi kontras. `text-primary` pada `bg-primary bg-opacity-10` di tombol aksi perlu dicek | Kritis |
| 3.2 | Kontras teks besar & UI ≥ 3:1 | #3 | ⚠️ Partial | Badge `bg-warning text-dark` — perlu verifikasi. `text-danger bg-danger bg-opacity-10` — perlu verifikasi | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal | #3 | ✅ Pass | Semua badge status menggunakan warna + teks label ("Lunas", "Belum Lunas", "Menunggu Persetujuan", dll). Badge approval memiliki teks deskriptif | Kritis |
| 3.4 | Target sentuhan ≥ 44×44 px | #3 | ❌ Fail | Tombol reset filter: `width: 26px, height: 26px` (di bawah standar). Tombol aksi tabel: icon size=16 dalam `btn-action-table` tanpa padding eksplisit. Pagination `size="sm"`. Filter input `size="sm"` dengan `fontSize: 11px` | Kritis |
| 3.5 | Keyboard navigation (Tab) | #3 | ⚠️ Partial | Elemen HTML standar (button, input, select) bisa di-Tab. Tapi `th role="button" onClick` untuk sort — tidak ada `tabIndex` atau `onKeyDown` handler, hanya `onClick` | Kritis |
| 3.6 | Indikasi fokus :focus-visible | #3 | ⚠️ Partial | Bootstrap menyediakan focus ring default, tapi tidak ada custom `:focus-visible` untuk `th role="button"` (sortable headers) atau `btn-action-table` | Kritis |
| 3.7 | Konten terbaca hingga zoom 200% | #3 | ❌ Fail | `text-nowrap` pada semua baris tabel (`className="text-nowrap"`) — 9 kolom tidak akan muat di 200% zoom tanpa horizontal scroll yang parah | Tinggi |
| 3.8 | Gambar fungsional memiliki alt deskriptif | #3 | ✅ Pass | Tidak ada gambar fungsional, hanya icon SVG (phosphor-react) | Tinggi |
| 3.9 | Gambar dekoratif alt kosong / aria-hidden | #3 | ✅ Pass | Semua icon phosphor-react memiliki `aria-hidden="true"`. Icon `FaHandHoldingUsd` di header tidak memiliki `aria-hidden` ⚠️ | Rendah |
| 3.10 | Setiap input memiliki label terprogram & terlihat | #3 | ⚠️ Partial | Filter input memiliki `aria-label` (terprogram) tapi TIDAK ada `<label>` yang terlihat. Pengguna tidak tahu apa yang mereka filter kecuali membaca placeholder. `Form.Select` untuk status juga hanya `aria-label` | Kritis |
| 3.11 | Pesan error deskriptif | #3 | ✅ Pass | Import: "Harap pilih file Excel yang valid (.xlsx atau .xls)", "Pilih file Excel terlebih dahulu". API error: `err.response?.data?.message`. Empty state: "Tidak ada data pinjaman yang cocok dengan filter" | Tinggi |
| 3.12 | Opsi matikan animasi vestibular | #3 | ❌ Fail | `animate-fade-in` pada header dan card, `animate-spin` pada refresh icon saat loading. Tidak ada `@media (prefers-reduced-motion)` | Menengah |
| 3.13 | Tabel memiliki ARIA (caption, aria-sort, scope) | #3 | ❌ Fail | Tabel tidak memiliki `<caption>`. `th role="button"` untuk sort tidak memiliki `aria-sort="ascending/descending"`. Tidak ada `scope="col"` pada `th` | Kritis |
| 3.14 | Toast/announce ke screen reader | #3 | ⚠️ Partial | SweetAlert2 digunakan untuk konfirmasi — tidak diketahui apakah di-announce ke screen reader. Tidak ada `aria-live` region untuk update data | Tinggi |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna sebagai design token | #4 | ❌ Fail | Hardcoded: `fontSize: "11px"`, `fontSize: "12px"`, `width: "26px"`, `width: "95px"`, `minWidth: "140px"`, `cursor: "pointer"`, `zIndex: 2`, `fontWeight: 600`. Tidak ada CSS variable / design token | Tinggi |
| 4.2 | Tipografi sebagai design token | #4 | ❌ Fail | `fontSize: "11px"` pada filter input, `fontSize: "11px"` pada financing_id, `fontSize: "12px"` pada badge approval count, `fontSize: "12px"` pada tombol Proses. Tidak ada skala tipografi terdefinisi | Tinggi |
| 4.3 | Spacing sebagai design token | #4 | ⚠️ Partial | Menggunakan Bootstrap spacing utilities (p-3, px-2, py-2, mb-3, gap-2, gap-3) — konsisten, tapi beberapa nilai custom inline (padding di tombol 26px) | Tinggi |
| 4.4 | Border-radius & shadow sebagai token | #4 | ⚠️ Partial | Bootstrap rounded-3, rounded-4, rounded-pill, rounded-2, rounded-circle, shadow-sm, shadow-xs — konsisten tapi hardcoded via class | Menengah |
| 4.5 | Komponen reusable | #4 | ✅ Pass | PinjamanTable, PinjamanApprovalTable, PinjamanListHeader, PinjamanApprovalBadge, ImportPinjamanModal, modals dari components/modals/ — semua reusable | Tinggi |
| 4.6 | Varian komponen | #4 | ✅ Pass | Button: variant light/primary/success/outline-success/danger, loading state, disabled state. Spinner untuk loading | Tinggi |
| 4.7 | Grid & layout konsisten | #4 | ✅ Pass | Bootstrap Container/Row/Col, Card, table-responsive — konsisten di seluruh halaman | Tinggi |
| 4.8 | Skala tipografi terdefinisi | #4 | ❌ Fail | h4 (judul), h6 (sub-header), small, text-muted, fw-medium, fw-bold, fw-semibold — campuran tanpa skala terdefinisi | Menengah |
| 4.9 | Ikonset konsisten | #4 | ❌ Fail | **Mixed icon library:** phosphor-react (Receipt, Coins, User, X, ArrowsDownUp, CaretUp/Down, ArrowClockwise, FileXls, FileArrowDown, UploadSimple, DownloadSimple, Coins, Receipt, CheckCircle, Plus) + react-icons/fa (FaHandHoldingUsd) — 2 library berbeda | Menengah |
| 4.10 | Warna & ikon status seragam | #4 | ✅ Pass | Bootstrap colors: success/warning/danger/info/primary/secondary. Badge approval badge reusable. Status cicilan: success=Lunas, warning=Belum Lunas | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Mobile-first design | #5 | ⚠️ Partial | Menggunakan Bootstrap responsive classes (d-flex, flex-md-row, px-md-4, d-sm-inline) tapi tidak ada CSS custom untuk verifikasi mobile-first | Tinggi |
| 5.2 | Breakpoint terdefinisi | #5 | ✅ Pass | Bootstrap breakpoint: xs (default), sm, md, lg. Digunakan: `flex-md-row`, `px-md-4`, `d-sm-inline` | Tinggi |
| 5.3 | Layout berubah di breakpoint | #5 | ⚠️ Partial | Header: flex-column di mobile → flex-md-row di desktop. Tab: flex-nowrap (scroll horizontal). Tabel: table-responsive (scroll horizontal). Pagination: flex-column → flex-md-row | Tinggi |
| 5.4 | Konten menyusun ulang, tidak pecah | #5 | ⚠️ Partial | `text-nowrap` pada tabel bisa memaksa horizontal scroll. `text-truncate` pada approval table (maxWidth 260px). Filter input `minWidth` bisa overflow di layar kecil | Tinggi |
| 5.5 | Usable di portrait & landscape | #5 | ⚠️ Partial | Perlu verifikasi. Tabel 9 kolom dengan `text-nowrap` kemungkinan sulit di portrait mobile | Menengah |
| 5.6 | Target sentuhan mobile ≥ 44×44px | #5 | ❌ Fail | Tombol reset 26×26px, tombol aksi tabel dengan icon 16px, pagination sm, filter input sm dengan fontSize 11px — semua < 44×44px | Kritis |
| 5.7 | Horizontal scroll tab aksesibel | #5 | ✅ Pass | `flex-nowrap` pada tab nav, `table-responsive` pada tabel — scroll horizontal tersedia | Menengah |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Discover: riset & analisis kompetitor | #6 | ❌ Fail | Tidak ada bukti riset pengguna atau analisis kompetitor | Menengah |
| 6.2 | Define: persona, journey, requirement | #6 | ❌ Fail | Tidak ada persona/journey/requirement terdefinisi | Menengah |
| 6.3 | Develop: sketsa, wireframe, prototipe | #6 | ⚠️ Partial | Kode tersedia sebagai hasil develop. Tidak ada wireframe/prototipe terpisah | Menengah |
| 6.4 | Deliver: hi-fi design, prototype, handoff | #6 | ❌ Fail | Kode siap, tapi belum melalui proses handoff desain → dev | Tinggi |
| 6.5 | Review stakeholder per tahapan | #6 | ❌ Fail | Tidak ada bukti review stakeholder | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain terstruktur (Figma) | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.2 | Komponen di library design system | #7 | ❌ Fail | Belum tersedia. Komponen React ada tapi tidak di Figma library | Tinggi |
| 7.3 | Spesifikasi visual lengkap | #7 | ❌ Fail | Tidak ada dokumen spesifikasi (warna hex, tipografi, spacing, radius, shadow) | Tinggi |
| 7.4 | Prototype interaktif | #7 | ❌ Fail | Tidak ada prototype interaktif yang bisa diuji tanpa kode | Tinggi |
| 7.5 | Annotation catatan desain | #7 | ❌ Fail | Tidak ada annotation untuk interaksi, state, responsivitas | Menengah |
| 7.6 | Asset ekspor skala benar | #7 | ❌ Fail | Tidak ada (icon dari library, bukan asset) | Menengah |
| 7.7 | Checklist handoff | #7 | ❌ Fail | Belum dilakukan | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dengan pengguna nyata (≥5) | #8 | ❌ Fail | Tidak ada bukti uji coba | Tinggi |
| 8.2 | Data uji coba dicatat | #8 | ❌ Fail | Tidak ada data | Tinggi |
| 8.3 | Iterasi berdasarkan temuan | #8 | ❌ Fail | Belum dilakukan | Tinggi |
| 8.4 | Validasi ulang setelah iterasi | #8 | ❌ Fail | Belum dilakukan | Menengah |
| 8.5 | Fitur baru tanpa uji usabilitas | #8 | ❌ Fail | Belum ada uji usabilitas | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity | #9 | ✅ Pass | N/A — Tidak berlaku | Kritis |
| 9.2 | Tidak ada hidden cost | #9 | ✅ Pass | N/A — Tidak berlaku. Semua nominal ditampilkan transparan | Kritis |
| 9.3 | Opsi batal tidak disembunyikan | #9 | ✅ Pass | Semua modal memiliki tombol Batal + close button. Import modal: Batal. Approval: Tutup/Batal | Kritis |
| 9.4 | Tidak ada urgency palsu | #9 | ✅ Pass | Tidak ada urgency palsu | Menengah |
| 9.5 | Tidak ada roach-motel | #9 | ✅ Pass | N/A — Tidak berlaku (bukan halaman pendaftaran) | Kritis |
| 9.6 | Privasi default: data minimal | #9 | ⚠️ Partial | **Nama anggota dan financing_id ditampilkan dalam tabel** — data pribadi anggota terpapar dalam konteks pinjaman. Tidak ada masking untuk nama atau ID | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.2 | Time-on-task | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.3 | Error rate | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.4 | NPS / SUS | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.5 | Konversi & retensi | #10 | ❌ Fail | Tidak ditetapkan | Rendah |

---

## Temuan Kritis & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Tombol reset filter 26×26px, tombol aksi tabel icon 16px, pagination sm — semua < 44×44px WCAG | `PinjamanTable.jsx` baris 354-364 (reset), baris 514-522 (invoice), baris 535-543 (setoran); `PinjamanApprovalTable.jsx` baris 219-228 (reset) | Perbesar semua tombol aksi minimum 44×44px. Tambahkan padding pada `btn-action-table`. Gunakan `size="md"` pada pagination | **Kritis** |
| 2 | Filter input di dalam tabel hanya punya `aria-label` tanpa `<label>` terlihat — screen reader bisa baca tapi pengguna visual tidak tahu fungsi filter | `PinjamanTable.jsx` baris 369-469, `PinjamanApprovalTable.jsx` baris 170-203 | Tambahkan `<label>` yang terlihat di atas setiap input filter, atau gunakan tooltip + visible indicator. Pertimbangkan memindahkan filter ke area di atas tabel | **Kritis** |
| 3 | Tabel tanpa `<caption>`, `th` sort tanpa `aria-sort`, tanpa `scope="col"` | `PinjamanTable.jsx` baris 260-336, `PinjamanApprovalTable.jsx` baris 135-164 | Tambahkan `<caption>` deskriptif, `scope="col"` pada `th`, `aria-sort="ascending/descending"` pada th yang sedang di-sort | **Kritis** |
| 4 | `th role="button"` untuk sort tidak punya `tabIndex` atau `onKeyDown` — keyboard user tidak bisa sort | `PinjamanTable.jsx` baris 272-334, `PinjamanApprovalTable.jsx` baris 138-160 | Tambahkan `tabIndex={0}` dan `onKeyDown` handler untuk Enter/Space. Atau gunakan `<button>` di dalam `<th>` | **Kritis** |
| 5 | `text-nowrap` pada tabel 9 kolom — konten tidak terbaca di zoom 200% | `PinjamanTable.jsx` baris 262 (`text-nowrap`), `PinjamanApprovalTable.jsx` baris 135 | Hapus `text-nowrap` atau gunakan `text-truncate` dengan `max-width`. Pastikan `table-responsive` cukup | **Tinggi** |
| 6 | Tidak ada `@media (prefers-reduced-motion)` untuk `animate-fade-in` dan `animate-spin` | `PinjamanList.jsx` baris 282, 291; CSS global | Tambahkan `@media (prefers-reduced-motion: reduce) { .animate-fade-in, .animate-spin { animation: none; } }` | **Tinggi** |
| 7 | Mixed icon library: phosphor-react + react-icons/fa (FaHandHoldingUsd) | `PinjamanListHeader.jsx` baris 4, 16 | Unifikasi ke satu library icon. Ganti `FaHandHoldingUsd` dengan equivalent phosphor-react | **Tinggi** |
| 8 | Hardcoded nilai (fontSize 11px/12px, width 26px, cursor, zIndex, fontWeight) tanpa design token | `PinjamanTable.jsx` (multiple), `PinjamanApprovalTable.jsx` (multiple), `PinjamanApprovalBadge.jsx` | Migrasi ke CSS variable / design token. Minimal: `--text-xs: 11px`, `--text-sm: 12px`, `--icon-action-size: 44px` | **Tinggi** |
| 9 | `FaHandHoldingUsd` di header tanpa `aria-hidden` | `PinjamanListHeader.jsx` baris 16 | Tambahkan `aria-hidden="true"` pada icon dekoratif | **Tinggi** |
| 10 | Nama anggota dan financing_id ditampilkan tanpa masking — data pribadi terpapar | `PinjamanTable.jsx` baris 556-564, `PinjamanApprovalTable.jsx` baris 257-268 | Terapkan masking nama (inisial) atau batasi berdasarkan role. Tambahkan opsi toggle untuk admin berwenang | **Tinggi** |
| 11 | Tidak ada `aria-live` region untuk update data (refresh, import success) | `PinjamanList.jsx` | Tambahkan `aria-live="polite"` wrapper untuk pesan status yang di-update dinamis | **Tinggi** |
| 12 | 8 filter kolom + 2 select di satu layar — overload kognitif | `PinjamanTable.jsx` baris 339-471 | Pertimbangkan filter utama (anggota, status) di baris atas, filter lanjutan di dropdown "Advanced Filter". Atau kelompokkan filter terkait | **Menengah** |
| 13 | Tidak ada uji usabilitas dan handoff terdokumentasi | Seluruh halaman | Lakukan uji coba dengan minimal 5 admin keuangan. Buat spesifikasi handoff | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Pinjaman List memiliki fitur yang komprehensif untuk manajemen pinjaman lunak koperasi: tabel 9 kolom dengan filter per kolom, sort, pagination, 2 tab (Daftar + Approval), 5 modal (approval program, manual payment, detail transaksi, kartu setoran, import Excel), dan export. Logika client-side filtering dan sort yang robust.

Namun, ada beberapa celah kritis yang harus diperbaiki:

1. **Aksesibilitas (Kritis):** Target sentuhan < 44px, filter tanpa label terlihat, tabel tanpa ARIA, sort header tidak keyboard-accessible, `text-nowrap` menghambat zoom.
2. **Design System (Tinggi):** Hardcoded nilai tipografi dan sizing, mixed icon library, tidak ada design token.
3. **Privasi (Tinggi):** Data anggota (nama + ID) terpapar tanpa masking.
4. **Kognitif (Menengah):** Terlalu banyak filter sekaligus di satu layar.

**Langkah selanjutnya:**
1. Perbaiki 13 temuan di atas (4 Kritis, 7 Tinggi, 2 Menengah).
2. Unifikasi icon library ke phosphor-react saja.
3. Implementasikan design token untuk nilai yang di-hardcode.
4. Tambahkan ARIA lengkap pada tabel (caption, scope, aria-sort, keyboard sort).
5. Tambahkan `prefers-reduced-motion` support.
6. Lakukan uji usabilitas dengan minimal 5 admin keuangan.
7. Buat spesifikasi handoff dan prototype interaktif.
8. Audit ulang setelah perbaikan.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`
**Halaman:** Pinjaman List
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process
**File template:** `docs/ux-audit/06-simpanan-report-page-audit.md`
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\program\pinjaman\PinjamanList.jsx` dan 7 komponen terkait
