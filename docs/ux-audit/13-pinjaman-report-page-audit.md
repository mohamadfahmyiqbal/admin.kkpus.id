# UI/UX Audit Checklist — Pinjaman Report (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Pinjaman Report — `PinjamanReport.jsx` + 5 tab report |
| URL / Lokasi File | `src/pages/program/pinjaman/PinjamanReport.jsx` |
| Route Key | `pinjamanReport` (breadcrumb: Dashboard → Pinjaman Lunak → Report) |
| Halaman Terkait | `PinjamanList.jsx` (`/pinjamanList`), `PinjamanInputModal.jsx` |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Bootstrap 5 + Phosphor Icons |
| Status Akhir | 🟡 Perbaikan Besar |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/program/pinjaman/PinjamanReport.jsx` | Halaman utama: breadcrumb, header + Export Excel, 6 tab (Modal, Hutang Kas, Aktiva Tetap, List Report, Jurnal, Neraca), fetch data, export logic |
| `src/pages/program/pinjaman/report/ModalTab.jsx` | Tab Modal: tabel transaksi modal (debet/kredit/saldo), 8 kolom |
| `src/pages/program/pinjaman/report/ListReportTab.jsx` | Tab List Report: tabel 13 kolom (nama, keperluan, 3 tahun pinjaman, termin, 3 tahun cicilan, sisa, tak tertagih, status), sticky footer totals |
| `src/pages/program/pinjaman/report/JurnalTab.jsx` | Tab Jurnal: 4 card akuntansi (Kas, Piutang, Hibah SHU, Beban Tak Tertagih) dengan tabel debet/kredit/total |
| `src/pages/program/pinjaman/report/NeracaTab.jsx` | Tab Neraca: tabel AKTIVA & PASIVA (kas, piutang, aktiva tetap, hutang, modal, beban) |
| `src/pages/program/pinjaman/components/PinjamanReportTabs.jsx` | Barrel export untuk ke-4 tab report |
| `src/pages/program/pinjaman/components/HutangKasTab.jsx` | Tab Hutang Kas: tabel + modal form tambah transaksi |
| `src/pages/program/pinjaman/components/AktivaTetapTab.jsx` | Tab Aktiva Tetap: tabel + modal form tambah transaksi |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 5 | ❌ Gagal |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 4 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 4 | ❌ Gagal |
| 5. Responsivitas & Adaptasi | 10 | 4 | ❌ Gagal |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 3 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **23** | **🔴 Tidak Lulus** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan | #1 | ❌ Fail | Tidak ada dokumentasi persona. Pengguna tersirat: admin akuntansi/keuangan koperasi | Tinggi |
| 1.2 | JTBD telah ditetapkan | #1 | ❌ Fail | Tidak ada bukti JTBD. Fungsi tersirat: lihat laporan akuntansi pinjaman, export ke Excel | Tinggi |
| 1.3 | User goal tiap layar jelas | #1 | ⚠️ Partial | Deskripsi header: "Laporan neraca dan jurnal transaksi pinjaman lunak anggota" — cukup jelas tapi tidak terdokumentasi terpisah | Tinggi |
| 1.4 | Pain point teridentifikasi | #1 | ❌ Fail | Tidak ada bukti riset pain point | Menengah |
| 1.5 | User journey dilacak | #1 | ❌ Fail | Tidak ada dokumentasi journey. Flow: buka report → pilih tab → baca/export | Tinggi |
| 1.6 | Keputusan dari riset | #1 | ❌ Fail | 6 tab, 13 kolom di List Report — tidak ada dasar bukti kenapa struktur ini dipilih | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Jakob's Law | #2 | ✅ Pass | Laporan akuntansi dengan tab, tabel, export — mengikuti konvensi aplikasi akuntansi dan admin panel | Menengah |
| 2.2 | Hick's Law | #2 | ❌ Fail | **6 tab sekaligus** (Modal, Hutang Kas, Aktiva Tetap, List Report, Jurnal, Neraca) — melebihi 5-7 pilihan optimal. List Report tab memiliki 13 kolom yang overwhelming. Pengguna harus memahami struktur akuntansi untuk menavigasi | Tinggi |
| 2.3 | Fitts's Law | #2 | ⚠️ Partial | Export Excel button di header cukup besar. Tapi tidak ada tombol aksi per baris (read-only). Tab nav pills cukup besar | Tinggi |
| 2.4 | Miller's Law | #2 | ❌ Fail | **List Report: 13 kolom** (No, Nama, Keperluan, 3× Pinjaman, Termin, 3× Cicilan, Sisa, Tak Tertagih, Status). Jurnal: 4 card dengan tabel terpisah. Informasi sangat padat tanpa chunking visual yang memadai | Tinggi |
| 2.5 | Tesler's Law | #2 | ⚠️ Partial | Data di-fetch sekali (semua tab). Tapi pengguna harus memahami akuntansi (debet/kredit, neraca, jurnal) — kompleksitas domain tidak direduksi | Menengah |
| 2.6 | Doherty Threshold | #2 | ✅ Pass | Spinner loading saat fetch, Export disabled saat loading. Data di-cache di state React | Menengah |
| 2.7 | Nielsen #1 — Visibilitas status | #2 | ⚠️ Partial | Spinner + "Memuat data..." di setiap tab. Empty state "Belum ada data laporan". Tapi tidak ada indikator loading per-tab — loading state global | Tinggi |
| 2.8 | Nielsen #2 — Dunia nyata | #2 | ✅ Pass | Bahasa akuntansi Indonesia yang benar: Kas, Piutang, Debet, Kredit, Saldo, Neraca, Jurnal, Hibah SHU CSR, Beban Tak Tertagih | Menengah |
| 2.9 | Nielsen #3 — Kontrol & kebebasan | #2 | ⚠️ Partial | Breadcrumb navigasi, Export Excel, Batal di modal form (Hutang/Aktiva). Tapi tidak ada filter/search di tab report — pengguna tidak bisa mencari spesifik | Tinggi |
| 2.10 | Nielsen #4 — Konsistensi | #2 | ⚠️ Partial | Bootstrap konsisten untuk tabel/card. Tapi: (1) Export button menggunakan `<button>` + `<i className="bi">` (Bootstrap Icons) bukan `<Button>` react-bootstrap + phosphor, (2) `HutangKasTab` dan `AktivaTetapTab` memiliki struktur hampir identik tapi duplicated, (3) inline style `borderRight: "1px solid #dee2e6"` di ListReportTab | Tinggi |
| 2.11 | Nielsen #5 — Pencegahan kesalahan | #2 | ⚠️ Partial | Export disabled jika `listData.length === 0`. Form validation `required` di modal. Tapi tidak ada konfirmasi sebelum export (bisa jadi tidak sengaja) | Menengah |
| 2.12 | Nielsen #6 — Pengenalan | #2 | ✅ Pass | Struktur tabel yang familiar, warna success/danger untuk debet/kredit, badge untuk status | Menengah |
| 2.13 | Nielsen #7 — Fleksibilitas | #2 | ⚠️ Partial | Export Excel untuk List Report. Tapi tidak ada filter/search pada tab report, tidak ada export per-tab, tidak ada page size control | Rendah |
| 2.14 | Nielsen #8 — Estetika & minimalis | #2 | ⚠️ Partial | Desain bersih, card dengan shadow. Tapi 6 tab + 13 kolom membuat tampilan terasa padat. Jurnal tab: 4 card bertumpuk vertikal (col-12) bisa lebih ringkas | Rendah |
| 2.15 | Nielsen #9 — Pemulihan kesalahan | #2 | ✅ Pass | Empty state di setiap tab. Form reset saat tutup modal. Error handling di fetch (silent catch) | Tinggi |
| 2.16 | Nielsen #10 — Dokumentasi & bantuan | #2 | ❌ Fail | Tidak ada tooltip, tidak ada bantuan untuk memahami kolom akuntansi, tidak ada legend untuk debet/kredit. Pengguna harus sudah paham akuntansi | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal ≥ 4.5:1 | #3 | ⚠️ Partial | `text-muted` pada `bg-light`, `text-success`/`text-danger` pada putih — perlu verifikasi. `text-primary` pada `bg-light` (tfoot) perlu dicek | Kritis |
| 3.2 | Kontras teks besar & UI ≥ 3:1 | #3 | ⚠️ Partial | Badge `bg-warning text-dark` — perlu verifikasi. `text-success`/`text-danger` untuk debet/kredit — perlu verifikasi | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal | #3 | ✅ Pass | Debet = `text-success` + nilai, Kredit = `text-danger` + nilai. Status: "Lunas" (success) / "Belum Lunas" (warning) dengan teks. AKTIVA/PASIVA section header dengan teks | Kritis |
| 3.4 | Target sentuhan ≥ 44×44px | #3 | ⚠️ Partial | Export Excel button di header cukup besar. Tab nav pills cukup besar. Modal form buttons cukup besar. Tapi tidak ada tombol aksi per baris (read-only) | Kritis |
| 3.5 | Keyboard navigation (Tab) | #3 | ⚠️ Partial | Tab nav, form input, buttons — standar HTML, bisa di-Tab. Breadcrumb `Breadcrumb.Item onClick` — perlu `tabIndex` dan `onKeyDown` untuk keyboard | Kritis |
| 3.6 | Indikasi fokus :focus-visible | #3 | ⚠️ Partial | Bootstrap focus ring untuk input/button. Tapi `Breadcrumb.Item onClick` tanpa focus indication custom | Kritis |
| 3.7 | Konten terbaca hingga zoom 200% | #3 | ❌ Fail | **List Report: 13 kolom `text-nowrap`** — tidak akan terbaca di zoom 200%. Jurnal tab: 4 tabel bertumpuk. `minWidth: "200px"` pada kolom Keperluan. Tabel tanpa mekanisme collapse/expand | Tinggi |
| 3.8 | Gambar fungsional memiliki alt | #3 | ✅ Pass | Tidak ada gambar fungsional. Hanya icon (Plus di modal form) | Tinggi |
| 3.9 | Gambar dekoratif aria-hidden | #3 | ✅ Pass | `<Plus aria-hidden="true" />` di modal form. `<i className="bi bi-file-earmark-excel">` di export button — **perlu `aria-hidden`** ⚠️ | Rendah |
| 3.10 | Setiap input memiliki label | #3 | ✅ Pass | Modal form (HutangKasTab, AktivaTetapTab): setiap input memiliki `<Form.Label>` yang terlihat. PinjamanInputModal: semua label terlihat. Tapi `aria-label="Filter HTG-001"` dan `aria-label="Filter AKT-001"` pada input No Transaksi dan PIC — **ini copy-paste error, bukan label yang benar** ⚠️ | Kritis |
| 3.11 | Pesan error deskriptif | #3 | ✅ Pass | Form validation `required`. Error dari API: `res.data?.message`. Empty state: "Belum ada data laporan X" | Tinggi |
| 3.12 | Opsi matikan animasi | #3 | ❌ Fail | `animate-fade-in` pada header dan card. Tidak ada `prefers-reduced-motion` | Menengah |
| 3.13 | Tabel memiliki ARIA | #3 | ❌ Fail | Tidak ada `<caption>` pada tabel mana pun. Tidak ada `scope="col"` pada `th`. List Report: 13 kolom tanpa `scope` sangat menyulitkan screen reader | Kritis |
| 3.14 | Toast/announce ke screen reader | #3 | ⚠️ Partial | SweetAlert2 untuk form success/error. Tidak ada `aria-live` region untuk update data setelah tambah transaksi | Tinggi |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna sebagai design token | #4 | ❌ Fail | **Hardcoded:** `borderRight: "1px solid #dee2e6"` di ListReportTab (20+ occurrence), `backgroundColor: "#f8f9fa"` di PinjamanInputModal, `borderRadius: "8px"`. Tidak ada CSS variable | Tinggi |
| 4.2 | Tipografi sebagai design token | #4 | ❌ Fail | `fw-bold`, `fw-medium`, `fw-semibold`, `small`, `text-muted` — campuran. Tidak ada skala terdefinisi. `fs-5` untuk modal title | Tinggi |
| 4.3 | Spacing sebagai design token | #4 | ⚠️ Partial | Bootstrap spacing (p-3, p-4, p-md-4, mb-3, g-4, gap-2) — konsisten. Tapi `p-0` di card-body, `ps-5` di NeracaTab | Tinggi |
| 4.4 | Border-radius & shadow | #4 | ⚠️ Partial | `rounded-3`, `rounded-4`, `shadow-sm`, `shadow-xs`, `border-0` — konsisten. `borderRadius: "8px"` inline di PinjamanInputModal | Menengah |
| 4.5 | Komponen reusable | #4 | ⚠️ Partial | ModalTab, ListReportTab, JurnalTab, NeracaTab — reusable. Tapi **HutangKasTab dan AktivaTetapTab ~90% identik** (same form fields, same table structure, same modal) — seharusnya 1 komponen parameterized | Tinggi |
| 4.6 | Varian komponen | #4 | ✅ Pass | Button variants (primary, secondary, outline-secondary, success), loading state, disabled state | Tinggi |
| 4.7 | Grid & layout konsisten | #4 | ✅ Pass | Bootstrap Container/Row/Col, Card, table-responsive — konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi | #4 | ❌ Fail | h4 (judul), h5 (sub), h6 (card header), small, fw-bold/medium/semibold — campuran tanpa skala | Menengah |
| 4.9 | Ikonset konsisten | #4 | ⚠️ Partial | phosphor-react (Plus) + Bootstrap Icons (`bi bi-file-earmark-excel`) — **2 library berbeda** | Menengah |
| 4.10 | Warna & ikon status seragam | #4 | ✅ Pass | success=debet/saldo, danger=kredit, primary=total, warning=Belum Lunas, success=Lunas — konsisten | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Mobile-first design | #5 | ❌ Fail | Tidak ada CSS custom. Bootstrap responsive classes ada tapi tabel 13 kolom (`text-nowrap`) tidak mobile-first | Tinggi |
| 5.2 | Breakpoint terdefinisi | #5 | ⚠️ Partial | Bootstrap breakpoint (md, sm). `p-3 p-md-4` pada konten. `flex-md-row` pada header. Tapi tidak ada breakpoint khusus untuk tabel | Tinggi |
| 5.3 | Layout berubah di breakpoint | #5 | ❌ Fail | Header: flex-column → flex-md-row (baik). Tapi **tabel 13 kolom tetap `text-nowrap` di semua ukuran** — horizontal scroll parah di mobile. 6 tab nav `flex-nowrap` — scroll horizontal, tapi sulit di mobile | Tinggi |
| 5.4 | Konten menyusun ulang, tidak pecah | #5 | ❌ Fail | `text-nowrap` pada semua tabel. `minWidth: "200px"` pada kolom Keperluan. List Report: 13 kolom × text-nowrap = tidak terbaca di mobile. Jurnal: 4 card col-12 (stack, OK) | Tinggi |
| 5.5 | Usable di portrait & landscape | #5 | ❌ Fail | List Report di portrait: 13 kolom tidak mungkin dibaca. Jurnal di portrait: OK (col-12 stack) | Menengah |
| 5.6 | Target sentuhan mobile ≥ 44×44px | #5 | ⚠️ Partial | Tab nav pills cukup besar. Form input `form-control-lg` di PinjamanInputModal. Modal buttons cukup besar. Tapi tab nav di mobile dengan 6 tab — tap target bisa kecil jika scroll | Kritis |
| 5.7 | Horizontal scroll aksesibel | #5 | ⚠️ Partial | `table-responsive` tersedia. Tapi tanpa indikator visual bahwa konten bisa di-scroll (tidak ada shadow/gradient edge) | Menengah |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Discover: riset & kompetitor | #6 | ❌ Fail | Tidak ada bukti | Menengah |
| 6.2 | Define: persona, journey, requirement | #6 | ❌ Fail | Tidak ada | Menengah |
| 6.3 | Develop: wireframe, prototipe | #6 | ⚠️ Partial | Kode tersedia. Tidak ada wireframe akuntansi report | Menengah |
| 6.4 | Deliver: hi-fi, prototype, handoff | #6 | ❌ Fail | Tidak ada handoff dokumen | Tinggi |
| 6.5 | Review stakeholder per tahap | #6 | ❌ Fail | Tidak ada bukti | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain terstruktur | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.2 | Komponen di library design system | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.3 | Spesifikasi visual lengkap | #7 | ❌ Fail | Tidak ada dokumen spesifikasi | Tinggi |
| 7.4 | Prototype interaktif | #7 | ❌ Fail | Tidak ada | Tinggi |
| 7.5 | Annotation catatan desain | #7 | ❌ Fail | Tidak ada | Menengah |
| 7.6 | Asset ekspor skala benar | #7 | ❌ Fail | Tidak ada (icon dari library) | Menengah |
| 7.7 | Checklist handoff | #7 | ❌ Fail | Belum dilakukan | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba ≥5 pengguna | #8 | ❌ Fail | Tidak ada bukti | Tinggi |
| 8.2 | Data uji dicatat | #8 | ❌ Fail | Tidak ada data | Tinggi |
| 8.3 | Iterasi berdasarkan temuan | #8 | ❌ Fail | Belum dilakukan | Tinggi |
| 8.4 | Validasi ulang | #8 | ❌ Fail | Belum dilakukan | Menengah |
| 8.5 | Fitur baru tanpa uji | #8 | ❌ Fail | Belum ada uji | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity | #9 | ✅ Pass | N/A — Tidak berlaku | Kritis |
| 9.2 | Tidak ada hidden cost | #9 | ✅ Pass | N/A — Tidak berlaku. Semua angka ditampilkan transparan | Kritis |
| 9.3 | Opsi batal tidak disembunyikan | #9 | ✅ Pass | Modal form (Hutang/Aktiva): tombol Batal + close button. Breadcrumb untuk kembali | Kritis |
| 9.4 | Tidak ada urgency palsu | #9 | ✅ Pass | Tidak ada | Menengah |
| 9.5 | Tidak ada roach-motel | #9 | ✅ Pass | N/A — Tidak berlaku | Kritis |
| 9.6 | Privasi default | #9 | ⚠️ Partial | **Nama anggota ditampilkan di List Report** (kolom Nama). PIC (nama penanggung jawab) di Modal/Hutang/Aktiva tab. Data keuangan anggota terpapar | Tinggi |

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
| 1 | **6 tab sekaligus** — melebihi batas Hick's Law (5-7 opsi optimal). Pengguna harus memahami akuntansi untuk memilih tab yang benar | `PinjamanReport.jsx` baris 141-175 | Kelompokkan: (1) "Laporan Utama" (List, Jurnal, Neraca), (2) "Transaksi" (Modal, Hutang Kas, Aktiva Tetap). Atau gunakan dropdown + 2-3 tab utama. Tambahkan deskripsi singkat di setiap tab | **Kritis** |
| 2 | **List Report: 13 kolom `text-nowrap`** — tidak terbaca di zoom 200% atau mobile | `ListReportTab.jsx` baris 14-286 | (1) Hapus `text-nowrap`, gunakan `text-truncate` dengan `max-width`. (2) Tambahkan mekanisme collapse/expand untuk kolom tahun. (3) Tambahkan filter/search. (4) Pertimbangkan split menjadi 2 tabel (Pinjaman & Cicilan) | **Kritis** |
| 3 | Tabel tanpa `<caption>`, `scope`, `aria-sort` — screen reader tidak bisa navigasi 13 kolom | Semua tab report (`ListReportTab.jsx`, `ModalTab.jsx`, `JurnalTab.jsx`, `NeracaTab.jsx`, `HutangKasTab.jsx`, `AktivaTetapTab.jsx`) | Tambahkan `<caption>` deskriptif, `scope="col"` pada setiap `th`, `scope="row"` pada `th` row header | **Kritis** |
| 4 | `aria-label="Filter HTG-001"` dan `aria-label="Filter AKT-001"` pada form input — **copy-paste error dari komponen filter, bukan label form** | `HutangKasTab.jsx` baris 171, 182; `AktivaTetapTab.jsx` baris 171, 182 | Hapus `aria-label` yang salah. Gunakan `<Form.Label>` yang sudah ada sebagai sumber label (sudah terprogram via `htmlFor` atau `id`) | **Kritis** |
| 5 | **Hardcoded `borderRight: "1px solid #dee2e6"`** di 20+ tempat di ListReportTab | `ListReportTab.jsx` baris 28, 35, 42, 48, 55, 61, 68, 75, 82, 92, 100, 136, 142, 148, 160, 166, 178, 184, 190, 196, 224, 236, 242, 254, 260, 273, 279 | Ganti dengan CSS class `.report-table th, .report-table td { border-right: 1px solid var(--border-color); }` atau gunakan Bootstrap `table-bordered` | **Tinggi** |
| 6 | **Export button menggunakan raw `<button>` + Bootstrap Icons** (`<i className="bi">`) — tidak konsisten dengan react-bootstrap Button + phosphor-react di komponen lain | `PinjamanReport.jsx` baris 123-129 | Ganti dengan `<Button variant="success">` dari react-bootstrap + `<FileXls>` dari phosphor-react. Atau unifikasi semua ke Bootstrap Icons | **Tinggi** |
| 7 | **HutangKasTab dan AktivaTetapTab ~90% identik** — duplicated code (same form, same table, same modal, same handler) | `HutangKasTab.jsx`, `AktivaTetapTab.jsx` | Refactor menjadi 1 komponen `TransaksiKasTab` yang menerima props: `title`, `dataKey`, `createService`, `optionLabelDebet`, `optionLabelKredit` | **Tinggi** |
| 8 | Tidak ada filter/search di tab report — pengguna tidak bisa cari anggota spesifik di List Report | `ListReportTab.jsx`, `ModalTab.jsx` | Tambahkan search input di atas tabel untuk filter nama/keperluan. Minimal di List Report (13 kolom, bisa banyak baris) | **Tinggi** |
| 9 | Tidak ada `@media (prefers-reduced-motion)` untuk `animate-fade-in` | `PinjamanReport.jsx` baris 115, 133 | Tambahkan reduced motion query | **Tinggi** |
| 10 | `<i className="bi bi-file-earmark-excel">` tanpa `aria-hidden` | `PinjamanReport.jsx` baris 128 | Tambahkan `aria-hidden="true"` atau `sr-only` text | **Tinggi** |
| 11 | Breadcrumb `Breadcrumb.Item onClick` tanpa `tabIndex`/`onKeyDown` — keyboard user tidak bisa navigate breadcrumb | `PinjamanReport.jsx` baris 103-111 | Tambahkan `tabIndex={0}` dan `onKeyDown` untuk Enter/Space, atau gunakan `<a href>` dengan route | **Tinggi** |
| 12 | Loading state global — tidak ada indikator loading per-tab. Saat pindah tab, data sudah di-fetch tapi tidak ada konfirmasi | `PinjamanReport.jsx` baris 38-56 | Loading sudah di-fetch sekali (baik). Tapi empty state per-tab harus jelas. Tambahkan `aria-busy` pada table saat loading | **Menengah** |
| 13 | Tidak ada export untuk tab selain List Report (Jurnal, Neraca, Modal, Hutang, Aktiva) | `PinjamanReport.jsx` baris 69-96 | Tambahkan export per-tab atau export semua data | **Menengah** |
| 14 | Nama anggota dan PIC ditampilkan tanpa masking | `ListReportTab.jsx` baris 144, `ModalTab.jsx` baris 66, `HutangKasTab.jsx` baris 133 | Terapkan masking sesuai role | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🔴 **Tidak Lulus**

Halaman Pinjaman Report memiliki 6 tab laporan akuntansi (Modal, Hutang Kas, Aktiva Tetap, List Report, Jurnal, Neraca) yang menampilkan data keuangan pinjaman lunak koperasi secara komprehensif. Struktur akuntansi (jurnal debet/kredit, neraca aktiva/pasiva) sudah benar.

Namun, halaman ini memiliki **jumlah temuan kritis tertinggi** di antara 3 halaman yang diaudit:

1. **Kognitif (Kritis):** 6 tab + 13 kolom di List Report — overwhelming. Hick's Law dan Miller's Law dilanggar.
2. **Responsivitas (Kritis):** `text-nowrap` di 13 kolom membuat List Report tidak terbaca di mobile/zoom 200%.
3. **Aksesibilitas (Kritis):** Tabel tanpa ARIA, `aria-label` copy-paste error di form, breadcrumb tidak keyboard-accessible.
4. **Design System (Tinggi):** Hardcoded border color (20+ tempat), mixed icon library, duplicated components (HutangKas vs AktivaTetap).
5. **Fitur (Tinggi):** Tidak ada filter/search di tab report, tidak ada export per-tab.

**Langkah selanjutnya:**
1. **Prioritas 1:** Perbaiki 4 temuan Kritis (tab grouping, List Report kolom, tabel ARIA, aria-label error).
2. **Prioritas 2:** Refactor HutangKasTab + AktivaTetapTab menjadi 1 komponen parameterized.
3. **Prioritas 3:** Tambahkan filter/search di List Report. Tambahkan export per-tab.
4. **Prioritas 4:** Unifikasi icon library. Migrasi hardcoded values ke design token.
5. Lakukan uji usabilitas dengan minimal 5 admin akuntansi.
6. Audit ulang setelah perbaikan.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`
**Halaman:** Pinjaman Report
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process
**File template:** `docs/ux-audit/06-simpanan-report-page-audit.md`
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\program\pinjaman\PinjamanReport.jsx` dan 7 komponen terkait
