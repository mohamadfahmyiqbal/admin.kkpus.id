# UI/UX Audit Checklist — Pinjaman Input Modal (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Pinjaman Input Modal — `PinjamanInputModal.jsx` |
| URL / Lokasi File | `src/pages/program/pinjaman/PinjamanInputModal.jsx` |
| Route Key | `pinjamanInputModal` (breadcrumb: Dashboard → Pinjaman Lunak → Input Modal) |
| Halaman Terkait | `PinjamanList.jsx` (`/pinjamanList`), `PinjamanReport.jsx` (`/pinjamanReport`) |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 20 Nov 2026 |
| Versi Design System | Bootstrap 5 + Phosphor Icons |
| Status Akhir | 🟡 Perbaikan Minor |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/program/pinjaman/PinjamanInputModal.jsx` | Halaman form input modal pinjaman: breadcrumb, header + back button, form 6 field (bulan/tanggal, no transaksi, PIC, keperluan, jenis, jumlah), submit handler, SweetAlert feedback |

> **Catatan:** Ini adalah satu file komponen tunggal (259 baris) yang berisi seluruh halaman. Tidak ada sub-komponen terpisah.

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 7 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 6 | ⚠️ Perlu perbaikan |
| 4. Design System & Konsistensi | 10 | 5 | ⚠️ Perlu perbaikan |
| 5. Responsivitas & Adaptasi | 10 | 7 | ✅ Baik |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 4 | ✅ Baik |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **32** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama ditetapkan | #1 | ❌ Fail | Tidak ada dokumentasi. Pengguna tersirat: admin keuangan yang mencatat penambahan/penarikan modal | Tinggi |
| 1.2 | JTBD ditetapkan | #1 | ❌ Fail | Tidak ada bukti. JTBD tersirat: "Catat transaksi modal pinjaman lunak" | Tinggi |
| 1.3 | User goal jelas | #1 | ⚠️ Partial | Deskripsi header: "Form input penambahan atau penarikan modal Pinjaman Lunak" — jelas | Tinggi |
| 1.4 | Pain point teridentifikasi | #1 | ❌ Fail | Tidak ada bukti riset | Menengah |
| 1.5 | User journey dilacak | #1 | ❌ Fail | Tidak ada dokumentasi. Flow: buka form → isi → submit → success/error | Tinggi |
| 1.6 | Keputusan dari riset | #1 | ❌ Fail | Tidak ada dasar bukti untuk pilihan field, urutan, atau auto-fill PIC | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Jakob's Law | #2 | ✅ Pass | Form input standar: label + input, submit button, back button — mengikuti konvensi form yang dikenal semua pengguna | Menengah |
| 2.2 | Hick's Law | #2 | ✅ Pass | Hanya 6 field + 1 submit + 1 back = 8 keputusan. Jumlah minimal dan wajar untuk form input | Menengah |
| 2.3 | Fitts's Law | #2 | ✅ Pass | `form-control-lg` pada semua input (tinggi ~48px), `btn-lg` pada submit (tinggi ~48px), back button cukup besar. Target sentuhan memadai | Tinggi |
| 2.4 | Miller's Law | #2 | ✅ Pass | 6 field — di bawah batas 7±2. Field dikelompokkan: (1) tanggal+no transaksi, (2) PIC, (3) keperluan, (4) jenis+jumlah — chunking baik | Menengah |
| 2.5 | Tesler's Law | #2 | ✅ Pass | PIC auto-filled dari `localStorage.userData`. No Transaksi auto-generate jika kosong. Jumlah auto-formatted dengan `Intl.NumberFormat`. Kompleksitas direduksi | Menengah |
| 2.6 | Doherty Threshold | #2 | ✅ Pass | Loading state saat submit, tombol disabled selama loading, "Menyimpan..." text change. Responsive | Menengah |
| 2.7 | Nielsen #1 — Visibilitas status | #2 | ✅ Pass | Loading state: "Menyimpan..." + disabled button. Success/error via SweetAlert. Form reset setelah sukses. PIC field `readOnly` + `bg-light` + `cursor: not-allowed` | Tinggi |
| 2.8 | Nielsen #2 — Dunia nyata | #2 | ✅ Pass | Bahasa Indonesia, istilah akuntansi (Debet/Kredit, Penambahan/Penarikan Modal), placeholder "Contoh: Penambahan modal awal" | Menengah |
| 2.9 | Nielsen #3 — Kontrol & kebebasan | #2 | ⚠️ Partial | Back button (`window.history.back()`) tersedia. Breadcrumb navigasi. Tapi **tidak ada tombol Batal di form** — hanya back button di header. Pengguna harus klik back untuk batal, tidak ada konfirmasi jika ada data yang sudah diisi | Tinggi |
| 2.10 | Nielsen #4 — Konsistensi | #2 | ⚠️ Partial | Bootstrap classes konsisten. Phosphor-react icons (ArrowLeft, FloppyDisk). Tapi: (1) `backgroundColor: "#f8f9fa"` hardcoded, (2) `borderRadius: "8px"` inline, (3) `aria-label` salah ("Filter...") — copy-paste error dari komponen lain | Tinggi |
| 2.11 | Nielsen #5 — Pencegahan kesalahan | #2 | ⚠️ Partial | `required` attribute pada field wajib. Jumlah di-format otomatis (hanya angka). PIC readOnly. Tapi **tidak ada validasi format** untuk No Transaksi, tidak ada min/max untuk Jumlah, tidak ada konfirmasi sebelum submit jika ada field yang terisi | Menengah |
| 2.12 | Nielsen #6 — Pengenalan | #2 | ✅ Pass | Label deskriptif, placeholder, icon (ArrowLeft, FloppyDisk), `readOnly` + styling untuk PIC, `form-control-lg` untuk visibility | Menengah |
| 2.13 | Nielsen #7 — Fleksibilitas | #2 | ⚠️ Partial | Auto-fill PIC dari user data. Auto-generate No Transaksi. Auto-format jumlah. Tapi tidak ada undo, tidak ada draft save, tidak ada keyboard shortcut | Rendah |
| 2.14 | Nielsen #8 — Estetika & minimalis | #2 | ✅ Pass | Card dengan shadow-sm, rounded-4, layout bersih, 2 kolom di desktop (Row/Col md=6). Desain minimalis dan fokus | Rendah |
| 2.15 | Nielsen #9 — Pemulihan kesalahan | #2 | ✅ Pass | SweetAlert error dengan pesan deskriptif. Form tidak di-reset saat error (data pengguna tetap). Back button untuk keluar | Tinggi |
| 2.16 | Nielsen #10 — Dokumentasi & bantuan | #2 | ⚠️ Partial | Placeholder di input ("Auto-generate jika kosong", "Contoh: Penambahan modal awal"). Option label deskriptif ("Debet (Penambahan Modal)", "Kredit (Penarikan Modal)"). Tapi tidak ada tooltip untuk field yang mungkin membingungkan | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal ≥ 4.5:1 | #3 | ✅ Pass | `text-dark` pada `#f8f9fa` (bg), `text-muted` pada putih, `text-danger` untuk asterisk — Bootstrap default, harusnya memenuhi | Kritis |
| 3.2 | Kontras teks besar & UI ≥ 3:1 | #3 | ✅ Pass | `fw-bold text-dark` untuk judul. `text-primary` untuk submit button. Bootstrap default contrast | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal | #3 | ✅ Pass | Field required ditandai dengan asterisk merah + `required` attribute. PIC field: `readOnly` + `bg-light` + `cursor: not-allowed` — tidak hanya warna. Jenis: teks "Debet"/"Kredit" | Kritis |
| 3.4 | Target sentuhan ≥ 44×44px | #3 | ✅ Pass | `form-control-lg` (~48px tinggi), `btn-lg` (~48px tinggi), back button cukup besar. Semua target > 44px | Kritis |
| 3.5 | Keyboard navigation (Tab) | #3 | ⚠️ Partial | Form input, select, button — semua HTML standar, bisa di-Tab. Order: tanggal → no transaksi → PIC → keperluan → jenis → jumlah → submit. **Breadcrumb `onClick` tanpa `tabIndex`/`onKeyDown`** ⚠️. **Back button `window.history.back()`** — keyboard user bisa access (button), tapi behavior tidak predictable | Kritis |
| 3.6 | Indikasi fokus :focus-visible | #3 | ✅ Pass | Bootstrap focus ring pada input, select, button. `form-control-lg` dengan focus ring jelas | Kritis |
| 3.7 | Konten terbaca hingga zoom 200% | #3 | ✅ Pass | Form sederhana, `Col md={6}` jadi `col-12` di mobile. `form-control-lg` scaling baik. Tidak ada `text-nowrap` atau fixed width | Tinggi |
| 3.8 | Gambar fungsional alt deskriptif | #3 | ✅ Pass | Tidak ada gambar fungsional. Icon (ArrowLeft, FloppyDisk) dekoratif | Tinggi |
| 3.9 | Gambar dekoratif aria-hidden | #3 | ✅ Pass | `<ArrowLeft aria-hidden="true" />`, `<FloppyDisk aria-hidden="true" />` — benar | Rendah |
| 3.10 | Setiap input memiliki label terprogram & terlihat | #3 | ✅ Pass | **Semua 6 field memiliki `<Form.Label>` yang terlihat.** Label: "Bulan / Tanggal", "No Transaksi", "PIC (Person In Charge)", "Keperluan", "Jenis Transaksi", "Jumlah (Rp)". **TAPI:** `aria-label="Filter Auto-generate jika kosong"` pada No Transaksi, `aria-label="Filter Contoh: Penambahan modal awal"` pada Keperluan, `aria-label="Filter 0"` pada Jumlah — **ini copy-paste error, akan override label yang benar** ⚠️ | Kritis |
| 3.11 | Pesan error deskriptif | #3 | ⚠️ Partial | SweetAlert: "Gagal", "Terjadi Kesalahan" dengan `res.data?.message`. Tapi **tidak ada inline validation feedback** — tidak ada error message di bawah input saat `required` field kosong. Hanya browser native validation | Tinggi |
| 3.12 | Opsi matikan animasi | #3 | ❌ Fail | `animate-fade-in` pada header dan card. Tidak ada `prefers-reduced-motion` | Menengah |
| 3.13 | Form memiliki ARIA | #3 | ⚠️ Partial | `<Form>` tanpa `aria-label` atau `role`. Tidak ada `aria-describedby` untuk error messages. `aria-label` di input salah (copy-paste error). SweetAlert2 untuk error — tidak diketahui screen reader compatibility | Kritis |
| 3.14 | Toast/announce ke screen reader | #3 | ⚠️ Partial | SweetAlert2 untuk success/error — memiliki focus trapping, tapi tidak ada `aria-live` region untuk update status. Form reset setelah sukses tidak di-announce | Tinggi |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna sebagai design token | #4 | ❌ Fail | `backgroundColor: "#f8f9fa"` hardcoded di container. `borderRadius: "8px"` inline di back button dan submit button. `fontWeight: 500` inline. Tidak ada CSS variable | Tinggi |
| 4.2 | Tipografi sebagai design token | #4 | ⚠️ Partial | `fw-bold`, `fw-medium`, `text-dark`, `text-muted`, `small` — Bootstrap utilities. Tidak ada custom font size. Konsisten | Tinggi |
| 4.3 | Spacing sebagai design token | #4 | ⚠️ Partial | Bootstrap spacing (py-4, px-3, px-md-4, mb-3, mb-4, gap-2, gap-3, pt-2, p-4, p-md-5) — konsisten | Tinggi |
| 4.4 | Border-radius & shadow | #4 | ⚠️ Partial | `rounded-4` (card), `borderRadius: "8px"` (inline di 2 button), `shadow-sm` — mixed. Seharusnya semua via class | Menengah |
| 4.5 | Komponen reusable | #4 | ⚠️ Partial | Komponen tunggal, tidak di-split. Form pattern bisa di-reuse, tapi hardcoded. Breadcrumb pattern duplicated dari halaman lain | Tinggi |
| 4.6 | Varian komponen | #4 | ✅ Pass | Button: loading state ("Menyimpan..."), disabled state. Input: required, readOnly variants. Select: 2 option | Tinggi |
| 4.7 | Grid & layout konsisten | #4 | ✅ Pass | Bootstrap Row/Col (md={6}), Card, Breadcrumb — konsisten dengan halaman lain | Tinggi |
| 4.8 | Skala tipografi terdefinisi | #4 | ⚠️ Partial | h4 (judul), small, fw-bold/medium, text-danger (asterisk) — campuran tapi sederhana | Menengah |
| 4.9 | Ikonset konsisten | #4 | ✅ Pass | Phosphor-react (ArrowLeft, FloppyDisk) — 1 library, konsisten dengan halaman lain (kecuali PinjamanListHeader yang pakai react-icons) | Menengah |
| 4.10 | Warna & ikon status seragam | #4 | ✅ Pass | `text-danger` untuk required asterisk, `bg-light` untuk disabled field, `text-primary` untuk submit. Bootstrap colors konsisten | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Mobile-first design | #5 | ⚠️ Partial | `Col md={6}` — di mobile jadi `col-12` (stack). `form-control-lg` untuk touch. Tapi `backgroundColor: "#f8f9fa"` dan `minHeight: "100vh"` — perlu verifikasi di mobile | Tinggi |
| 5.2 | Breakpoint terdefinisi | #5 | ✅ Pass | Bootstrap: `md` (Col md={6}), `px-md-4`, `p-md-5`, `flex-md-row`, `align-items-md-center` | Tinggi |
| 5.3 | Layout berubah di breakpoint | #5 | ✅ Pass | Header: flex-column (mobile) → flex-md-row (desktop). Form: col-12 (mobile) → Col md={6} (desktop, 2 kolom). Breadcrumb stack di mobile | Tinggi |
| 5.4 | Konten menyusun ulang, tidak pecah | #5 | ✅ Pass | Form field stack di mobile. `form-control-lg` scaling baik. Tidak ada `text-nowrap` atau fixed width. Card `overflow-hidden` + `rounded-4` | Tinggi |
| 5.5 | Usable di portrait & landscape | #5 | ✅ Pass | Form sederhana, stack di portrait, 2 kolom di landscape. `minHeight: "100vh"` OK | Menengah |
| 5.6 | Target sentuhan mobile ≥ 44×44px | #5 | ✅ Pass | `form-control-lg` (~48px), `btn-lg` (~48px), back button (~40px tinggi + padding). Semua > 44px | Kritis |
| 5.7 | Horizontal scroll aksesibel | #5 | N/A | Tidak ada konten yang membutuhkan horizontal scroll | Menengah |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Discover: riset & kompetitor | #6 | ❌ Fail | Tidak ada bukti | Menengah |
| 6.2 | Define: persona, journey, requirement | #6 | ❌ Fail | Tidak ada | Menengah |
| 6.3 | Develop: wireframe, prototipe | #6 | ⚠️ Partial | Kode tersedia. Tidak ada wireframe form terpisah | Menengah |
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
| 9.2 | Tidak ada hidden cost | #9 | ✅ Pass | N/A — Tidak berlaku | Kritis |
| 9.3 | Opsi batal tidak disembunyikan | #9 | ⚠️ Partial | Back button di header (`window.history.back()`) tersedia. Tapi **tidak ada tombol Batal di dalam form**. Jika pengguna sudah mengisi data dan ingin batal, harus klik back button di header — tidak ada konfirmasi "Data yang tidak disimpan akan hilang" | Kritis |
| 9.4 | Tidak ada urgency palsu | #9 | ✅ Pass | Tidak ada | Menengah |
| 9.5 | Tidak ada roach-motel | #9 | ✅ Pass | N/A — Tidak berlaku | Kritis |
| 9.6 | Privasi default | #9 | ✅ Pass | PIC auto-fill dari user data sendiri. Tidak ada data orang lain. `minHeight: "100vh"` + `bg: #f8f9fa` — data minimal | Tinggi |

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
| 1 | **`aria-label` copy-paste error** — No Transaksi: `aria-label="Filter Auto-generate jika kosong"`, Keperluan: `aria-label="Filter Contoh: Penambahan modal awal"`, Jumlah: `aria-label="Filter 0"`. Screen reader akan membacakan "Filter..." bukan label yang benar | `PinjamanInputModal.jsx` baris 162, 192, 227 | **Hapus semua `aria-label` yang salah.** `<Form.Label>` sudah terprogram dan cukup. Jika perlu `aria-label`, gunakan yang benar: "Nomor Transaksi", "Keperluan Transaksi", "Jumlah dalam Rupiah" | **Kritis** |
| 2 | **Tidak ada tombol Batal di form** — hanya back button di header (`window.history.back()`). Jika pengguna sudah mengisi data dan ingin batal, tidak ada opsi yang jelas di dalam form, dan `history.back()` behavior tidak predictable (bisa ke halaman yang berbeda) | `PinjamanInputModal.jsx` baris 127-135 | Tambahkan tombol "Batal" di bawah form (di samping "Simpan Modal"). Gunakan `navigate(-1)` atau `navigate()` ke halaman sebelumnya alih-alih `window.history.back()`. Tambahkan konfirmasi jika ada data yang sudah diisi | **Kritis** |
| 3 | **Breadcrumb `Breadcrumb.Item onClick` tanpa keyboard support** — keyboard user tidak bisa navigate breadcrumb | `PinjamanInputModal.jsx` baris 107-117 | Tambahkan `tabIndex={0}` dan `onKeyDown` handler (Enter/Space). Atau gunakan `<Link>` dari react-router | **Kritis** |
| 4 | **Tidak ada inline validation feedback** — hanya browser native `required`. Pengguna tidak tahu field mana yang kosong tanpa submit. Tidak ada `aria-describedby` untuk error messages | `PinjamanInputModal.jsx` baris 140-252 | Tambahkan validation state per field. Tampilkan error message di bawah input yang invalid. Tambahkan `aria-describedby` dan `aria-invalid`. Consider: `noValidate` + custom validation | **Tinggi** |
| 5 | **Hardcoded `backgroundColor: "#f8f9fa"` dan `borderRadius: "8px"`** — tidak konsisten dengan design system | `PinjamanInputModal.jsx` baris 103, 131, 246 | Ganti `backgroundColor` dengan Bootstrap class `bg-light` atau CSS variable. Ganti `borderRadius` dengan Bootstrap class `rounded-3` atau `rounded` | **Tinggi** |
| 6 | **Tidak ada `@media (prefers-reduced-motion)`** untuk `animate-fade-in` | `PinjamanInputModal.jsx` baris 120, 138 | Tambahkan reduced motion query | **Tinggi** |
| 7 | **`window.history.back()`** — tidak reliable, bisa ke halaman yang berbeda jika user buka halaman langsung | `PinjamanInputModal.jsx` baris 130 | Ganti dengan `navigate(-1)` dari react-router, atau `navigate("/" + jwtEncode("pinjamanList"))` | **Tinggi** |
| 8 | **PIC field `readOnly` + `cursor: "not-allowed"`** — pengguna tidak bisa edit jika user data salah. Tidak ada fallback | `PinjamanInputModal.jsx` baris 178-185 | Jika user data kosong/ salah, allow edit PIC field. Atau tampilkan pesan "PIC: [nama] — klik untuk edit jika salah" | **Menengah** |
| 9 | **SweetAlert2 untuk form feedback** — tidak ada `aria-live` region, screen reader tidak di-announce status | `PinjamanInputModal.jsx` baris 61-66, 80-85, 89-94 | Tambahkan `aria-live="polite"` region di dalam form untuk announce success/error. Atau gunakan inline alert | **Menengah** |
| 10 | **Tidak ada konfirmasi sebelum submit** — jika user salah pilih Debet/Kredit, tidak ada review step | `PinjamanInputModal.jsx` baris 54-98 | Untuk jumlah besar, pertimbangkan review step atau konfirmasi. Atau minimal: highlight field yang akan di-submit sebelum dispatch | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Pinjaman Input Modal adalah halaman form yang relatif sederhana dan terstruktur baik: 6 field dengan label terlihat, auto-fill PIC dari user data, auto-generate No Transaksi, auto-format jumlah, layout 2 kolom di desktop. Target sentuhan memadai (`form-control-lg`, `btn-lg`).

Namun, ada beberapa masalah yang harus diperbaiki:

1. **Aksesibilitas (Kritis):** `aria-label` copy-paste error di 3 input — akan membacakan "Filter..." ke screen reader. Breadcrumb tidak keyboard-accessible. Tidak ada inline validation.
2. **UX (Kritis):** Tidak ada tombol Batal di form. `window.history.back()` tidak reliable.
3. **Design System (Tinggi):** Hardcoded background color dan border radius.
4. **Etika (Menengah):** Tidak ada konfirmasi jika user salah pilih Debet/Kredit untuk jumlah besar.

**Kelebihan:**
- Form sederhana, fokus, tidak overwhelming
- Auto-fill dan auto-format mengurangi beban kognitif
- `form-control-lg` dan `btn-lg` — target sentuhan baik
- Layout responsive baik (stack di mobile, 2 kolom di desktop)
- Icon dan label deskriptif
- Empty/placeholder yang membantu

**Langkah selanjutnya:**
1. **Prioritas 1:** Perbaiki `aria-label` yang salah (copy-paste error).
2. **Prioritas 2:** Tambahkan tombol Batal di form. Ganti `window.history.back()` dengan `navigate()`.
3. **Prioritas 3:** Tambahkan inline validation feedback.
4. **Prioritas 4:** Fix hardcoded values. Tambahkan `prefers-reduced-motion`.
5. Breadcrumb: tambahkan keyboard support.
6. Audit ulang setelah perbaikan.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`
**Halaman:** Pinjaman Input Modal
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process
**File template:** `docs/ux-audit/06-simpanan-report-page-audit.md`
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\program\pinjaman\PinjamanInputModal.jsx`
