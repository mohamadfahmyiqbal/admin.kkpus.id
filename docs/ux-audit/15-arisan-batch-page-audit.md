# UI/UX Audit Checklist — Arisan Batch (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Arisan Batch (`/arisanBatchPage`) — Manajemen Grup/Batch Arisan |
| URL / Lokasi File | `src/pages/program/arisan/ArisanBatchPage.jsx` |
| Route Key | `arisanBatchPage` |
| Halaman Terkait | `ArisanDrawView` (Riwayat Kocokan), `ArisanParticipantsModal` (Kelola Peserta), `ArisanReport` (`/arisanReport`) |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Belum diketahui |
| Status Akhir | 🟡 Perbaikan Besar |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/program/arisan/ArisanBatchPage.jsx` | Halaman utama: CRUD batch arisan, export/import Excel, breadcrumb, navigasi ke DrawView |
| `src/pages/program/arisan/components/ArisanBatchTable.jsx` | Tabel batch: 9 kolom filter, pagination (fixed 10/page), loading/empty state |
| `src/pages/program/arisan/components/ArisanBatchModal.jsx` | Modal buat/edit batch: 3 seksi form (Program, Target & Biaya, Pelaksanaan) |
| `src/pages/program/arisan/components/ImportArisanModal.jsx` | Modal import Excel: template download, validasi file, failure table |
| `src/pages/program/arisan/components/ArisanDrawView.jsx` | Riwayat kocokan/pencairan: tabel 6 kolom, tombol kocok, upload bukti transfer |
| `src/pages/program/arisan/components/ArisanParticipantsModal.jsx` | Modal kelola peserta (xl): 7 filter kolom, nested modals (Approval, Installments, Invoice, Verification) |
| `src/pages/program/arisan/participants/ArisanParticipantsTable.jsx` | Tabel peserta: 8 kolom, sticky aksi column, 2 action buttons per row |
| `src/pages/program/arisan/participants/ArisanInstallmentsModal.jsx` | Modal daftar setoran: 7 kolom, sticky aksi, invoice & verifikasi button |
| `src/pages/program/arisan/components/table/ArisanBatchFilterHeader.jsx` | Header filter 9 kolom: periode, kategori, nama, peserta, term, setoran, keberangkatan, total, status |
| `src/pages/program/arisan/components/table/ArisanBatchRow.jsx` | Baris tabel batch: 4 action button (Kelola Peserta, Kocokan, Edit, Hapus) |
| `src/pages/program/arisan/components/table/ArisanBatchPagination.jsx` | Pagination: First/Prev/Next/Last + page numbers |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 5 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 3 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 4 | ⚠️ Perlu verifikasi |
| 5. Responsivitas & Adaptasi | 10 | 6 | ⚠️ Cukup |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 2 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **23** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | ❌ Fail | Tidak ada dokumentasi riset atau persona dalam kode maupun direktori docs | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | ❌ Fail | JTBD tidak didokumentasikan, meskipun alur kerja dapat disimpulkan dari fitur: buat batch arisan → atur kuota/target → kelola peserta → lakukan kocokan bulanan → pantau pencairan | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | Subtitle deskriptif pada setiap layar: "Kelola master data grup/batch arisan untuk anggota", "Kelola riwayat pemenang kocokan dan status pencairan dana", "Kelola persetujuan, pendaftaran dan nomor urut peserta" — goal implisit dari UI | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | ❌ Fail | Tidak ada bukti riset pain point | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | ❌ Fail | Tidak ada dokumentasi journey, namun arur UI menunjukkan: BatchPage → (Buat Batch) → (Kelola Peserta) → (Setoran/Installments) → (Kocokan) → (Report) — flow logis | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | ❌ Fail | Tidak ada dasar bukti, desain mengikuti konvensi admin panel | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | ✅ Pass | Layout tabel CRUD dengan summary header, filter per kolom, pagination, modal form, dan export/import — mengikuti konvensi admin panel standar | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | ❌ Fail | **9 filter kolom** di ArisanBatchFilterHeader (periode, kategori, nama, peserta, term, setoran, keberangkatan, total, status) + **7 filter kolom** di peserta table — jumlah filter terlalu banyak dalam satu baris, meningkatkan kognitif load dan waktu keputusan | Tinggi |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | ❌ Fail | Tombol aksi tabel menggunakan `size="sm"` + `className="btn-icon ... p-1"` dengan ikon 18px — container kemungkinan ~32×32px, **jauh di bawah 44×44 px** yang direkomendasikan | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | ❌ Fail | Tabel batch 10 kolom (Aksi + 9 data), tabel peserta 8 kolom, form batch 10 field — chunking via 3 seksi form (Program, Target & Biaya, Pelaksanaan) ada tapi tidak cukup mengurangi kognitif load di tabel | Menengah |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | ⚠️ Partial | Setoran bulanan dihitung otomatis (Biaya / Durasi) — good. Tapi status batch harus dipilih manual (DRAFT/OPEN/ACTIVE/COMPLETED), seharusnya bisa auto-advance | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | ✅ Pass | Spinner loading pada tabel, tombol disabled selama loading, SweetAlert2 untuk konfirmasi — respons sistem terlihat jelas | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | ✅ Pass | Badge status batch (ACTIVE/OPEN/COMPLETED/DRAFT), badge status peserta (APPROVED/REJECTED/PAID), badge status setoran (Lunas/Menunggu Verifikasi/Belum Lunas), info pagination — status visibilitas baik | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | ✅ Pass | Bahasa Indonesia konsisten, istilah koperasi sesuai ("Kuota Peserta", "Setoran Bulanan", "Target Biaya", "Kocokan", "Pencairan", "Piutang Cicilan") | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | ✅ Pass | Tombol Batal di semua modal, close button, SweetAlert2 delete confirmation, onBack di DrawView — kontrol cukup baik | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | ⚠️ Partial | Bootstrap classes konsisten, tapi **inline style hardcoded** campuran (#f8f9fa, #e2e8f0, #475569), dan `borderColor: "#f8fafc"` diulang di banyak komponen — tidak konsisten sebagai token | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | ⚠️ Partial | SweetAlert2 konfirmasi delete, validasi tipe file Excel, tombol disabled saat loading — cukup. Tapi **tidak ada validasi form** di ArisanBatchModal (semua field bisa kosong) | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | ✅ Pass | Ikon phosphor-react konsisten (Users, Confetti, PencilSimple, Trash, Info, Receipt, Check, Eye, ArrowLeft, UploadSimple, DownloadSimple), placeholder deskriptif, label form jelas | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | ✅ Pass | Export Excel, Import Excel dengan template, filter per kolom, auto-calculate setoran bulanan — fitur efisiensi baik | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | ✅ Pass | Desain bersih, shadow-sm, rounded-4, badge rounded-pill, warna sesuai konteks — minimalis dan proporsional | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | ⚠️ Partial | Import failure table menunjukkan error per baris, reset filter tersirat — tapi **tidak ada toast/notifikasi** untuk error API, hanya SweetAlert2 generik "Gagal menyimpan data" | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | ⚠️ Partial | Import modal punya instruction steps (3 langkah), Form.Text sebagai helper text, placeholder deskriptif — tapi tidak ada tooltip, tour, atau konteks bantuan di tabel utama | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | ❌ Fail | Menggunakan Bootstrap text-muted, text-dark, text-primary — perlu verifikasi kontras aktual. Inline `style={{ color: "#475569" }}` di ArisanBatchModal baris 211 — warna slate-600 kontras ~5.4:1 (pass), tapi text-muted Bootstrap bisa < 4.5:1 | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | ❌ Fail | Badge bg-light text-dark, bg-success, bg-warning — badge warning (kuning) pada teks kecil kemungkinan < 3:1 | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi, peringatan, atau aksi | #3 | ⚠️ Partial | Badge status memiliki teks label ("ACTIVE", "COMPLETED", "Lunas", "Belum Lunas") — baik. Tapi tombol aksi tabel hanya dibedakan oleh warna ikon + title tooltip — tanpa label teks | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px (atau 24 × 24 CSS dengan padding memadai) | #3 | ❌ Fail | Tombol aksi tabel: `size="sm"` + `p-1` + ikon 18px — total ~32×32px. Filter input `form-control-sm` — kemungkinan ~30px height. **Jauh dari 44×44 px** | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | ❌ Fail | Elemen HTML standar (button, input, select) seharusnya bisa Tab, tapi **Breadcrumb.Item menggunakan `onClick` tanpa `role="button"` atau `tabIndex`** — tidak bisa diakses keyboard. Tidak ada skip link | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | ❌ Fail | Bootstrap menyediakan focus ring default, tapi tidak ada verifikasi kustom. Tombol aksi tabel kecil (`rounded-circle`) mungkin memiliki focus ring yang sulit terlihat | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% tanpa assistive technology | #3 | ⚠️ Partial | Tabel 10 kolom dengan sticky column kemungkinan pecah saat zoom 200%. `whiteSpace: "nowrap"` memperburuk — konten horizontal overflow | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | ✅ Pass | Tidak ada gambar berfungsi (hanya ikon SVG), bukti transfer menggunakan `<a>` dengan teks "Lihat Bukti" — cukup | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di-siapkan sebagai dekoratif | #3 | ⚠️ Partial | Sebagian besar ikon phosphor-react memiliki `aria-hidden="true"` — baik. Tapi beberapa ikon tanpa `aria-hidden` (mis. Icons di badge peserta row) | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | ❌ Fail | **9 filter input** di ArisanBatchFilterHeader hanya punya `placeholder="Cari..."` tanpa `<label>` atau `aria-label`. **7 filter input** di peserta table sama. Ini adalah pelanggaran WCAG 2.1.1 Label in Name and Purpose yang serius | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | ⚠️ Partial | Error API menggunakan SweetAlert2 generik: "Gagal menyimpan data", "Gagal mengambil data peserta" — tidak deskriptif. Import error lebih baik: pesan per baris di ImportFailureTable | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | ❌ Fail | `animate-fade-in` class digunakan tanpa `@media (prefers-reduced-motion: reduce)` check | Menengah |
| **3.13 (Tambahan)** | Tabel dan tab memiliki atribut ARIA yang sesuai | #3 | ❌ Fail | Tabel tanpa `<caption>`, `aria-sort` pada header, `aria-label` pada tombol aksi. react-bootstrap Tab mungkin sudah ARIA internal | Kritis |
| **3.14 (Tambahan)** | SweetAlert2 dialog di-announce ke screen reader | #3 | ❌ Fail | SweetAlert2 menggunakan custom overlay — perlu verifikasi `aria-modal`, `role="alertdialog"`. Konfirmasi delete di `handleDeleteBatch` tidak di-announce ke screen reader | Tinggi |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | ❌ Fail | Inline style `#f8f9fa` (4x), `#e2e8f0` (4x), `#475569` (1x), `#f8fafc` (8x) — hardcoded di banyak komponen, tidak menggunakan CSS variable/token | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | ⚠️ Partial | Inline `style={{ letterSpacing: "1px" }}` di ArisanBatchModal (3x), inline `style={{ minWidth: "800px", whiteSpace: "nowrap" }}` — beberapa token, sebagian hardcoded | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | ⚠️ Partial | Bootstrap spacing classes (p-4, mb-4, g-3, px-3, py-2) — menggunakan Bootstrap system, bukan design token kustom | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | ⚠️ Partial | Bootstrap rounded-4, rounded-pill, rounded-circle, shadow-sm — Bootstrap token, bukan custom | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | ✅ Pass | ArisanBatchTable, ArisanBatchFilterHeader, ArisanBatchRow, ArisanBatchPagination, ArisanParticipantsTable — komponen modular dan reusable | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | ✅ Pass | Tombol: variant light/primary/success/warning/danger, size sm, disabled state, loading Spinner — varian lengkap | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | ✅ Pass | Bootstrap Container/Row/Col, Card pattern, table-responsive — konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1-h6, body, caption, label) | #4 | ⚠️ Partial | h4, h6, small, p, fw-bold, fw-medium, text-muted — menggunakan Bootstrap scale, tidak ada skala kustom | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | ✅ Pass | phosphor-react konsisten (size 14-20), style konsisten — baik | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | ✅ Pass | Badge bg: success (Lunas, ACTIVE, OPEN), warning (Belum Lunas, PENDING), danger (REJECTED, piutang), info (PAID), primary (COMPLETED) — seragam | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile-first (dari layar kecil ke besar) | #5 | ⚠️ Partial | Bootstrap responsive classes (flex-column flex-md-row, px-3 px-md-4) — approach desktop-first dengan breakpoint md, tidak mobile-first murni | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | ✅ Pass | Bootstrap breakpoint: sm (form-control-sm), md (flex-md-row, col-md-4, col-md-6, col-md-12), lg (Modal size="lg"/"xl") — breakpoint Bootstrap | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | ✅ Pass | Header action wrap di mobile (flex-column flex-md-row), tabel horizontal scroll (table-responsive), form grid col-md — baik | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | ⚠️ Partial | Tabel menggunakan `whiteSpace: "nowrap"` — teks tidak wrap, bisa overflow di layar kecil. Sticky columns dengan fixed width (250px, 160px) bisa pecah di mobile | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | ❌ Fail | 10 kolom tabel + 9 filter tanpa breakpoint khusus untuk mobile — kemungkinan tidak usable di portrait mobile. Modal xl juga tidak responsif | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | ❌ Fail | Tombol aksi tabel `size="sm"` + `p-1` — kemungkinan < 44×44 px di semua breakpoint termasuk mobile | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | ❌ Fail | Tidak ada bukti riset pengguna | Menengah |
| 6.2 | Tahap Define: persona, user journey, dan requirement terdefinisi | #6 | ❌ Fail | Tidak ada persona/journey terdefinisi | Menengah |
| 6.3 | Tahap Develop: sketsa, wireframe, dan prototipe rendah fidelitas tersedia | #6 | □ Pass □ Fail □ N/A | Kode tersedia sebagai hasil develop | Menengah |
| 6.4 | Tahap Deliver: desain tinggi fidelitas, prototype interaktif, dan handoff tersedia | #6 | ❌ Fail | Kode siap, tapi belum melalui uji coba dan handoff | Tinggi |
| 6.5 | Setiap tahapan memiliki keluaran yang ditinjau stakeholder sebelum melanjut | #6 | ❌ Fail | Tidak ada bukti review stakeholder | Menengah |

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

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dilakukan dengan pengguna nyata (minimal 5 orang per iterasi) | #8 | ❌ Fail | Tidak ada bukti uji coba | Tinggi |
| 8.2 | Data uji coba dicatat: tugas gagal, waktu penyelesaian, kepuasan (SUS) | #8 | ❌ Fail | Tidak ada data | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan uji coba | #8 | ❌ Fail | Belum dilakukan | Tinggi |
| 8.4 | Validasi ulang dilakukan setelah iterasi | #8 | ❌ Fail | Belum dilakukan | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa minimal satu siklus uji usabilitas | #8 | ❌ Fail | Belum ada uji usabilitas | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity (paksa langganan berlanjut) | #9 | ✅ Pass (N/A) | Tidak berlaku — bukan halaman berlangganan | Kritis |
| 9.2 | Tidak ada hidden cost (biaya tersembunyi) | #9 | ✅ Pass | Setoran bulanan ditampilkan sebagai "Otomatis" dan dihitung transparan dari Total Biaya / Durasi — tidak ada biaya tersembunyi | Kritis |
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | ✅ Pass | Modal batch: tombol "Batal" jelas. SweetAlert2 delete: "Batal" + "Ya, hapus!". Modal import: "Batal" terlihat. Import modal backdrop="static" (tidak bisa klik luar) — ini proteksi data, bukan dark pattern | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar-benar akurat | #9 | ✅ Pass | Tidak ada urgency palsu di halaman ini | Menengah |
| 9.5 | Tidak ada roach-motel (mudah daftar, sulit batal) | #9 | ✅ Pass (N/A) | Tidak berlaku — bukan halaman pendaftaran | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | ❌ Fail | **Nomor telepon pemenang (`d.winner?.phone_number`) ditampilkan di ArisanDrawView baris 182-185** — data pribadi terpapar tanpa masking atau batasan. **Nama anggota** ditampilkan di tabel peserta, setoran, dan report. Tidak ada role-based masking | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.2 | Time-on-task telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.3 | Error rate telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.4 | NPS / SUS telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |
| 10.5 | Konversi dan retensi telah ditetapkan | #10 | ❌ Fail | Tidak ditetapkan | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | 9 filter input tanpa `<label>` atau `aria-label` — pelanggaran WCAG 2.1.1 | `ArisanBatchFilterHeader.jsx` baris 59-140, `ArisanParticipantsTable.jsx` baris 68-129 | Tambahkan `aria-label` deskriptif pada setiap input filter: `aria-label="Filter Periode"`, `aria-label="Filter Kategori"`, dst. | **Kritis** |
| 2 | Tombol aksi tabel ukuran kecil, kemungkinan < 44×44 px — pelanggaran WCAG 2.5.5 | `ArisanBatchRow.jsx` baris 67-102, `ArisanParticipantsTable.jsx` baris 169-188, `ArisanInstallmentsModal.jsx` baris 101-122 | Perbesar container: `min-width: 44px; min-height: 44px` atau ganti `p-1` dengan `p-2` dan `size="sm"` dengan size default | **Kritis** |
| 3 | Breadcrumb.Item menggunakan `onClick` tanpa `role="button"` atau `tabIndex` — tidak bisa diakses keyboard | `ArisanBatchPage.jsx` baris 192-202, 217-222 | Tambahkan `role="button"` + `tabIndex={0}` + `onKeyDown` handler (Enter/Space) pada Breadcrumb.Item klikable | **Kritis** |
| 4 | Tabel tanpa `<caption>` dan atribut ARIA — screen reader tidak bisa deskripsikan tabel | `ArisanBatchTable.jsx`, `ArisanParticipantsTable.jsx`, `ArisanDrawView.jsx` | Tambahkan `<caption className="visually-hidden">Data Batch Arisan</caption>`, `aria-sort` pada th, `aria-label` pada tombol aksi | **Kritis** |
| 5 | Nomor telepon pemenang (`phone_number`) ditampilkan tanpa masking di DrawView | `ArisanDrawView.jsx` baris 182-185 | Mask nomor telepon (tampilkan hanya 4 digit terakhir) atau batasi tampilan berdasarkan role/izin | **Tinggi** |
| 6 | Tidak ada validasi form di ArisanBatchModal — semua field bisa kosong | `ArisanBatchModal.jsx` baris 1-325 | Tambahkan validasi required field (program_name, batch_name, participants_quota, target_amount), validasi numeric range | **Tinggi** |
| 7 | Error API generik "Gagal menyimpan data" — tidak membantu perbaikan | `ArisanBatchPage.jsx` baris 94, `ArisanParticipantsModal.jsx` baris 56 | Gunakan `err.response?.data?.message` untuk pesan spesifik, fallback ke pesan generik | **Tinggi** |
| 8 | Inline style hardcoded: `#f8f9fa`, `#e2e8f0`, `#f8fafc`, `#475569` — tidak konsisten sebagai token | Semua komponen tabel (8+ file) | Migrasi ke CSS variable / design token: `--color-bg-light`, `--color-border-light`, `--color-text-slate` | **Tinggi** |
| 9 | 9 filter kolom + 10 kolom data = overload kognitif (Hick's Law, Miller's Law) | `ArisanBatchFilterHeader.jsx`, `ArisanBatchRow.jsx` | Pertimbangkan: filter dropdown tersembunyi (toggle), column picker, atau collapse filter ke 3-5 yang paling penting | **Tinggi** |
| 10 | `animate-fade-in` tanpa `prefers-reduced-motion` — risiko vestibular | Semua komponen yang menggunakan class ini | Tambahkan `@media (prefers-reduced-motion: reduce) { .animate-fade-in { animation: none; } }` | **Menengah** |
| 11 | SweetAlert2 tidak di-announce ke screen reader | Semua handler (handleDeleteBatch, handleSaveBatch, dll.) | Pastikan SweetAlert2 menggunakan `aria-modal="true"` + `role="alertdialog"`, atau ganti dengan component accessible | **Menengah** |
| 12 | Sticky column dengan `left: 250px` hardcoded — fragile di resize | `ArisanPesertaTab.jsx` baris 105-108, 184-187 | Gunakan CSS variable atau dynamic calculation untuk sticky offset | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Arisan Batch adalah fitur yang sangat komprehensif untuk manajemen program arisan koperasi: CRUD batch dengan form terstruktur (3 seksi), 9 kolom filter per column, import/export Excel, riwayat kocokan/pencairan dengan upload bukti transfer, dan manajemen peserta dengan nested modals (Approval, Installments, Invoice, Verification). Arsitektur komponen modular dan reuse pattern baik.

Namun terdapat beberapa celah kritis yang harus diperbaiki:

### 1. Aksesibilitas (Kritis — 4 item)
- **Filter input tanpa label** (9 di batch table + 7 di peserta table + 3 di dana report = 19 input tanpa label) — pelanggaran WCAG 2.1.1
- **Tombol aksi tabel terlalu kecil** (< 44×44 px) — pelanggaran WCAG 2.5.5
- **Breadcrumb tidak keyboard-accessible** — hanya `onClick` tanpa role/tabIndex
- **Tabel tanpa ARIA** — tidak ada caption, aria-sort, aria-label

### 2. Privasi Data (Tinggi)
- **Nomor telepon pemenang** terpapar tanpa masking di ArisanDrawView
- Nama anggota terpapar di banyak tabel tanpa role-based filtering

### 3. Design System (Tinggi)
- Inline style hardcoded (#f8f9fa, #e2e8f0, #f8fafc, #475569) diulang di 8+ komponen
- Tidak ada CSS variable / design token

### 4. Kognitif Load (Tinggi)
- 9 filter kolom sekaligus (Hick's Law), 10 kolom data (Miller's Law)
- Solusi: filter toggle, column picker, atau filter tersembunyi

### 5. Validasi & Error (Tinggi)
- Form batch tanpa validasi required field
- Error API generik "Gagal menyimpan data"

**Langkah selanjutnya:**
1. Perbaiki 12 temuan di atas (4 Kritis, 5 Tinggi, 3 Menengah).
2. Lakukan uji coba usabilitas dengan minimal 5 admin program arisan (fokus pada: membuat batch baru, mengelola peserta, melakukan kocokan, mengupload bukti transfer).
3. Buat spesifikasi handoff dan prototype interaktif.
4. Audit ulang setelah perbaikan.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Arisan Batch  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`  
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\program\arisan\ArisanBatchPage.jsx` dan 10 komponen terkait
