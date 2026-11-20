# UI/UX Audit Checklist — Akad Config (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Akad Config (`/akadConfigPage`) |
| URL / Lokasi File | `src/pages/konfigurasi/AkadConfigPage.jsx` |
| Route Key | `akadConfigPage` |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer + QA Engineer |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Bootstrap 5 + `admin-theme.css` (WCAG patch 20 Nov 2026) |
| Status Akhir | 🟡 Perbaikan Besar |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/konfigurasi/AkadConfigPage.jsx` | Satu-satunya file: halaman konfigurasi akad — tabel dengan produk simpanan + fitur, dropdown akad, tombol Simpan per baris |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 1 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 9 | ✅ Baik |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 5 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 6 | ⚠️ Perlu perbaikan |
| 5. Responsivitas & Adaptasi | 10 | 6 | ⚠️ Perlu perbaikan |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 5 | ✅ Baik |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **33** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan | #1 | ❌ Fail | Tidak ada dokumentasi persona admin/pengelola koperasi | Tinggi |
| 1.2 | JTBD pengguna telah ditetapkan | #1 | ❌ Fail | Tidak ada bukti JTBD; tujuan tersirat: set akad per produk/fitur | Tinggi |
| 1.3 | User goal tiap layar jelas & tercatat | #1 | ⚠️ Partial | Judul "Konfigurasi Akad" jelas, tapi tidak ada subtitle/deskripsi goal | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | ❌ Fail | Tidak ada dokumentasi pain point | Menengah |
| 1.5 | User journey / user flow dilacak | #1 | ❌ Fail | Alur: buka page → pilih akad → Simpan. Tidak terdokumentasi | Tinggi |
| 1.6 | Keputusan desain dari riset | #1 | ❌ Fail | Tidak ada dasar bukti | Tinggi |

**Skor: 1/10**

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Konvensi umum (Jakob's Law) | #2 | ✅ Pass | Tabel + select + tombol Simpan per baris — konvensi admin panel umum | Menengah |
| 2.2 | Jumlah opsi tidak berlebihan (Hick's Law) | #2 | ✅ Pass | 5 kolom, 1 select per baris, 1 tombol — sederhana | Menengah |
| 2.3 | Target interaksi cukup besar (Fitts's Law) | #2 | ✅ Pass | `form-select form-select-sm` dan `btn btn-sm` — global CSS `admin-theme.css` baris 91-103 sudah enforce `min-width/min-height: 44px` pada `.table .btn-sm` | Tinggi |
| 2.4 | ≤ 7(±2) item (Miller's Law) | #2 | ✅ Pass | 5 kolom, dalam batas | Menengah |
| 2.5 | Kompleksitas tidak ditransfer (Tesler's Law) | #2 | ✅ Pass | Simpel: pilih → simpan. Validasi built-in (peringatan jika belum pilih) | Menengah |
| 2.6 | Respons < 400 ms (Doherty Threshold) | #2 | ⚠️ Partial | Loading state hanya teks "Memuat data..." tanpa Spinner (`baris 142-147`) — feedback visual kurang | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | ✅ Pass | Loading text, Swal sukses/error, refetch setelah simpan | Tinggi |
| 2.8 | Bahasa & dunia nyata (Nielsen #2) | #2 | ✅ Pass | Bahasa Indonesia, label "Konfigurasi Akad", "Pilih Akad...", nama akad standar (Wadiah, Mudharabah, dll.) | Menengah |
| 2.9 | Kontrol & kebebasan keluar (Nielsen #3) | #2 | ✅ Pass | Select bisa diubah sebelum simpan, tidak ada aksi destruktif | Tinggi |
| 2.10 | Konsistensi & standar (Nielsen #4) | #2 | ✅ Pass | Bootstrap table, form-select, btn — konsisten | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | ✅ Pass | Validasi: "Silakan pilih akad terlebih dahulu" jika kosong (`baris 38-45, 82-89`) | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | ✅ Pass | Header kolom jelas, select menampilkan opsi, badge "Simpan" | Menengah |
| 2.13 | Fleksibilitas & efisiensi (Nielsen #7) | #2 | ⚠️ Partial | Tidak ada bulk save, tidak ada export — harus simpan per baris satu-satu | Rendah |
| 2.14 | Estetika & minimalis (Nielsen #8) | #2 | ✅ Pass | Card shadow-sm rounded-4, table-light header — bersih | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | ✅ Pass | Swal error dengan pesan spesifik, refetch setelah simpan | Tinggi |
| 2.16 | Dokumentasi & bantuan (Nielsen #10) | #2 | ❌ Fail | Tidak ada subtitle, tooltip, atau help text untuk menjelaskan arti tiap akad | Rendah |

**Skor: 9/10**

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks ≥ 4.5:1 | #3 | ⚠️ Partial | Bootstrap defaults, `table-light` header — perlu verifikasi hex aktual | Kritis |
| 3.2 | Kontras elemen UI ≥ 3:1 | #3 | ⚠️ Partial | Perlu verifikasi CSS | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal | #3 | ✅ Pass | Tidak ada info yang hanya dikomunikasikan via warna | Kritis |
| 3.4 | Target sentuhan ≥ 44×44 px | #3 | ✅ Pass | Global CSS `admin-theme.css` baris 46-59: `button, .btn { min-height: 44px }`, `a, input, textarea, select { min-height: 44px }`; baris 91-96: `.table .btn-sm { min-width: 44px; min-height: 44px }` | Kritis |
| 3.5 | Navigasi keyboard (Tab) | #3 | ⚠️ Partial | Select dan button HTML standar bisa di-Tab, tapi **tidak ada skip link di komponen ini** (CSS ada di `admin-theme.css` baris 10-26 tapi tidak dirender di page ini). Tidak ada Breadcrumb untuk konteks navigasi | Kritis |
| 3.6 | Indikasi fokus terlihat | #3 | ✅ Pass | Global CSS `*:focus-visible { outline: 2px solid #2563eb }` (`admin-theme.css` baris 29-32) | Kritis |
| 3.7 | Terbaca di zoom 200% | #3 | ✅ Pass | `table-responsive` — konten scroll horizontally, tidak terpotong | Tinggi |
| 3.8 | Gambar fungsional ada alt | #3 | N/A | Tidak ada gambar | Tinggi |
| 3.9 | Gambar dekoratif alt kosong | #3 | N/A | Tidak ada gambar | Rendah |
| 3.10 | Label input terprogram & terlihat | #3 | ❌ Fail | **Dropdown select produk** (`baris 156-174`): tanpa `aria-label`, tanpa `<label>`. **Dropdown select fitur** (`baris 197-211`): tanpa `aria-label`. Screen reader hanya membaca "combobox" tanpa konteks. Placeholder "Pilih Akad..." di `<option>` tidak cukup untuk screen reader | Kritis |
| 3.11 | Pesan error deskriptif | #3 | ✅ Pass | "Silakan pilih akad terlebih dahulu", "Gagal menyimpan akad", "Terjadi kesalahan saat menyimpan" — deskriptif | Tinggi |
| 3.12 | Opsi matikan animasi | #3 | ✅ Pass | Tidak ada animasi di halaman ini; global CSS sudah ada `prefers-reduced-motion` | Menengah |
| **3.13** | Tabel ARIA | #3 | ❌ Fail | Tabel `<table className="table table-hover align-middle">` (`baris 131`) **tanpa `<caption>`**, tanpa `scope="col"` pada `<th>` | Kritis |
| **3.14** | Status di-announce ke SR | #3 | ⚠️ Partial | SweetAlert2 (`Swal.fire`) secara default memiliki focus trap dan bisa di-announce, tapi loading state "Memuat data..." tidak ada `aria-live` | Tinggi |

**Skor: 5/10**

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna sebagai token | #4 | ✅ Pass | Tidak ada inline style warna; Bootstrap classes `table-light`, `shadow-sm` | Tinggi |
| 4.2 | Tipografi sebagai token | #4 | ✅ Pass | `h5` untuk judul — standar Bootstrap | Tinggi |
| 4.3 | Spacing sebagai token | #4 | ✅ Pass | `p-4 py-5`, `mb-4` — Bootstrap spacing | Tinggi |
| 4.4 | Radius & shadow sebagai token | #4 | ⚠️ Partial | `rounded-4`, `shadow-sm` — Bootstrap, tidak tokenized tapi konsisten | Menengah |
| 4.5 | Komponen reusable | #4 | ❌ Fail | Tidak ada komponen reusable yang dipisah — semua di satu file. Dropdown akad + tombol Simpan terulang untuk produk dan fitur | Tinggi |
| 4.6 | Varian komponen | #4 | ⚠️ Partial | `btn-primary`, `form-select-sm` — tapi tidak ada disabled state pada tombol Simpan saat loading | Tinggi |
| 4.7 | Grid & layout konsisten | #4 | ✅ Pass | Card + table-responsive — konsisten dengan halaman config lain | Tinggi |
| 4.8 | Skala tipografi | #4 | ⚠️ Partial | `h5` untuk judul, tabel — tidak ada skala terdefinisi eksplisit | Menengah |
| 4.9 | Ikonset konsisten | #4 | N/A | Tidak ada ikon di halaman ini | Menengah |
| 4.10 | Warna & ikon status seragam | #4 | ✅ Pass | Swal (success/error/warning) — seragam dengan halaman lain | Tinggi |

**Skor: 6/10**

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Mobile-first | #5 | ❌ Fail | Tidak ada CSS responsive class (`md-`, `sm-`, `lg-`) di komponen ini — hanya `table-responsive` | Tinggi |
| 5.2 | Breakpoint terdefinisi | #5 | ❌ Fail | Tidak ada breakpoint Bootstrap yang digunakan di level component | Tinggi |
| 5.3 | Layout berubah per breakpoint | #5 | ⚠️ Partial | `table-responsive` memberikan horizontal scroll di mobile, tapi tidak ada perubahan layout | Tinggi |
| 5.4 | Konten tidak pecah/terpotong | #5 | ✅ Pass | `table-responsive` — tabel scroll horizontal | Tinggi |
| 5.5 | Usable di portrait & landscape | #5 | ✅ Pass | `table-responsive` | Menengah |
| 5.6 | Touch target ≥ 44×44 px | #5 | ✅ Pass | Global CSS enforce min-height 44px pada select dan button | Kritis |

**Skor: 6/10**

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Discover: riset & analisis kompetitor | #6 | ❌ Fail | Tidak ada bukti riset | Menengah |
| 6.2 | Define: persona, journey, requirement | #6 | ❌ Fail | Tidak ada | Menengah |
| 6.3 | Develop: sketsa, wireframe, prototipe | #6 | ✅ Pass | Kode tersedia sebagai hasil develop | Menengah |
| 6.4 | Deliver: desain hi-fi, prototype, handoff | #6 | ❌ Fail | Belum melalui uji coba dan handoff formal | Tinggi |
| 6.5 | Keluaran ditinjau stakeholder | #6 | ❌ Fail | Tidak ada bukti review | Menengah |

**Skor: 1/5**

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.2 | Komponen dipublish ke library | #7 | ❌ Fail | Belum tersedia | Tinggi |
| 7.3 | Spesifikasi visual lengkap | #7 | ❌ Fail | Tidak ada | Tinggi |
| 7.4 | Prototype interaktif alur utama | #7 | ❌ Fail | Tidak ada | Tinggi |
| 7.5 | Annotation interaksi, state, responsivitas | #7 | ❌ Fail | Tidak ada | Menengah |
| 7.6 | Asset ekspor skala benar | #7 | ❌ Fail | Tidak ada | Menengah |
| 7.7 | Checklist handoff ditandai | #7 | ❌ Fail | Belum dilakukan | Tinggi |

**Skor: 0/5**

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji dengan pengguna nyata (min 5) | #8 | ❌ Fail | Tidak ada bukti | Tinggi |
| 8.2 | Data uji dicatat | #8 | ❌ Fail | Tidak ada | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan | #8 | ❌ Fail | Belum dilakukan | Tinggi |
| 8.4 | Validasi ulang setelah iterasi | #8 | ❌ Fail | Belum dilakukan | Menengah |
| 8.5 | Fitur baru min 1 siklus uji | #8 | ❌ Fail | Belum ada uji usabilitas | Tinggi |

**Skor: 0/5**

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity | #9 | N/A | Tidak berlaku | Kritis |
| 9.2 | Tidak ada hidden cost | #9 | N/A | Tidak berlaku | Kritis |
| 9.3 | Opsi batal tidak disembunyikan | #9 | N/A | Tidak berlaku | Kritis |
| 9.4 | Tidak ada urgency palsu | #9 | ✅ Pass | Tidak ada urgency palsu | Menengah |
| 9.5 | Tidak ada roach-motel | #9 | N/A | Tidak berlaku | Kritis |
| 9.6 | Privasi default | #9 | ✅ Pass | Menampilkan nama produk simpanan dan menu/fitur — tidak ada PII anggota | Tinggi |

**Skor: 5/5**

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
| 1 | **Dropdown select produk tanpa `aria-label` dan tanpa `<label>`** — screen reader hanya membaca "combobox" tanpa konteks | `AkadConfigPage.jsx` baris 156-174 | Tambahkan `aria-label={`Pilih akad untuk ${item.product_name}`}` pada setiap `<select>` | **Kritis** |
| 2 | **Dropdown select fitur tanpa `aria-label` dan tanpa `<label>`** | `AkadConfigPage.jsx` baris 197-211 | Tambahkan `aria-label={`Pilih akad untuk ${item.submenu}`}` pada setiap `<select>` | **Kritis** |
| 3 | **Tabel tanpa `<caption>` dan tanpa `scope="col"`** | `AkadConfigPage.jsx` baris 131-139 | Tambahkan `<caption className="visually-hidden">Konfigurasi Akad per Produk dan Fitur</caption>`, dan `scope="col"` pada semua `<th>` | **Kritis** |
| 4 | **Tidak ada empty state** — jika `products` atau `features` array kosong, tabel menampilkan header saja tanpa pesan | `AkadConfigPage.jsx` baris 148-227 | Tambahkan kondisi: jika `products.length === 0 && features.length === 0`, tampilkan "Belum ada data konfigurasi" | **Tinggi** |
| 5 | **Loading state tanpa Spinner** — hanya teks "Memuat data..." tanpa indikator visual progress | `AkadConfigPage.jsx` baris 142-147 | Tambahkan `<Spinner animation="border" variant="primary" size="sm" />` sebelum teks, konsisten dengan halaman lain | **Tinggi** |
| 6 | **Inkonsistensi state key:** produk pakai `item.akad`, fitur pakai `item.akad_type` — membuat code sulit di-maintain dan berisiko bug | `AkadConfigPage.jsx` baris 32-33 vs 76 | Unifikasi key menjadi `akad_type` untuk keduanya, atau gunakan helper function | **Menengah** |
| 7 | **Tidak ada Breadcrumb** — tidak konsisten dengan halaman lain (SimpananReportPage punya Breadcrumb) | `AkadConfigPage.jsx` (seluruh file) | Tambahkan Breadcrumb: Dashboard > Konfigurasi > Akad Config | **Menengah** |
| 8 | **Tidak ada subtitle/deskripsi** — pengguna tidak tahu apa yang harus dilakukan atau arti tiap akad | `AkadConfigPage.jsx` baris 129 | Tambahkan `<p className="text-muted small">...</p>` di bawah judul, menjelaskan bahwa akad dapat diubah per produk/fitur | **Menengah** |
| 9 | **`akadOptions` didefinisikan di dalam komponen** — re-render setiap kali, dan tidak reusable | `AkadConfigPage.jsx` baris 117-124 | Pindahkan ke file konstanta (`akadConstants.js`) atau ke level modul | **Rendah** |
| 10 | **Tidak ada tombol Refresh** — setelah error, pengguna harus refresh halaman manual | `AkadConfigPage.jsx` (seluruh file) | Tambahkan tombol Refresh di header card, atau auto-retry dengan backoff | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Akad Config secara fungsional sederhana dan intuitif: tabel dengan dropdown akad dan tombol Simpan per baris. Namun terdapat beberapa masalah yang harus diperbaiki:

### Masalah Utama

1. **Aksesibilitas (Kritis, 3 item):** Dropdown select tanpa aria-label (×2), tabel tanpa `<caption>`.
2. **Missing states (Tinggi):** Tidak ada empty state, loading tanpa Spinner.
3. **Konsistensi (Menengah):** Tidak ada Breadcrumb, tidak ada subtitle — tidak konsisten dengan halaman lain di app.
4. **Code quality (Menengah):** Inkonsistensi state key (`akad` vs `akad_type`), `akadOptions` di dalam komponen.
5. **Riset & Proses (Gagal):** Tidak ada dokumentasi, uji usabilitas, atau handoff.

### Langkah Selanjutnya

1. **Kritis:** Tambahkan `aria-label` pada semua select, `<caption>` dan `scope` pada tabel.
2. **Tinggi:** Tambahkan empty state dan Spinner loading.
3. **Menengah:** Tambahkan Breadcrumb + subtitle, unifikasi state key, pindahkan `akadOptions` ke konstanta.
4. **Proses:** Lakukan uji usabilitas dengan min. 5 admin, buat dokumentasi.
5. **Audit ulang** setelah perbaikan Kritis dan Tinggi selesai.

---

**Dibuat oleh:** Senior UI/UX Designer + QA Engineer  
**Halaman:** Akad Config  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`  
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\konfigurasi\AkadConfigPage.jsx`
