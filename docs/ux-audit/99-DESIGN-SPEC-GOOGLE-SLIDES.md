# Design Spec (Google Slides) — Admin KKPUS Backoffice

**Tanggal:** 21 November 2026  
**Auditor:** Senior UI/UX Designer + Senior Fullstack Developer  
**Standar Referensi:** WCAG 2.2 AA, Nielsen's 10 Heuristics, Double Diamond  
**File:** `docs/ux-audit/99-DESIGN-SPEC-GOOGLE-SLIDES.md`  
**Tujuan:** Konten design specification yang disusun dalam struktur slide Google Slides, siap disalin ke presentasi Google Slides untuk handoff desain ke tim developer dan stakeholder.  
**Status:** Draft untuk review

---

## Cara Penggunaan

Dokumen ini dirancang sebagai **outline Google Slides**. Setiap judul slide (`## Slide X`) mewakili satu slide dalam presentasi Google Slides. Isi masing-masing slide bisa langsung disalin dan menempel ke Google Slides, lalu disesuaikan visual (warna, tipografi, gambar) sesuai design system yang sudah ada (`design-tokens.css`).

---

## Slide 1 — Judul

**Judul:** Design Specification — Admin KKPUS Backoffice  
**Subjudul:** Koperasi Paguyuban Usaha Sukses Syariah  
**Versi:** 1.0  
**Tanggal:** 21 November 2026  
**Pengarang:** Senior UI/UX Designer + Senior Fullstack Developer  
**Status:** Draft

---

## Slide 2 — Agenda / Isi Konten

1. Latar belakang dan tujuan
2. Persona pengguna (3 persona)
3. User journey (4 alur utama)
4. Design system & aturan visual
5. Komponen UI utama
6. Aksesibilitas (WCAG 2.2 AA)
7. Responsivitas & breakpoint
8. Rekomendasi perbaikan prioritas
9. Langkah selanjutnya & handoff

---

## Slide 3 — Latar Belakang dan Tujuan

**Latar belakang:**  
Aplikasi backoffice koperasi syariah (`admin.kkpus.id`) digunakan untuk mengelola anggota, simpanan, pinjaman, jual beli, arisan, tabungan, investasi, dan pendanaan syariah. Akses terbatas untuk 3 role: Pengawas, Ketua, Bendahara.

**Tujuan design spec:**  
- Menyediakan panduan visual dan interaksi yang konsisten di seluruh halaman
- Menjamin aksesibilitas WCAG 2.2 AA
- Mengurangi cognitive overload pada dashboard
- Membantu handoff desain ke developer dan stakeholder

**Cakupan:** 21 halaman yang sudah diaudit di `docs/ux-audit/`

---

## Slide 4 — Persona Pengguna

**Persona 1 — Ahmad, Pengawas (42 tahun)**  
Tujuan: Memverifikasi transaksi dan keanggotaan sebelum disetujui Ketua.  
Pain point: Antrian persetujuan menumpuk (7 tab kategori), tidak ada shortcut keyboard.  
Kebutuhan aksesibilitas: Fokus-visible jelas, kontras ≥ 4.5:1, label terprogram pada input filter.

**Persona 2 — Siti, Ketua (38 tahun)**  
Tujuan: Memantau kinerja koperasi, menyetujui tahap kedua, mengambil kebijakan berdasarkan laporan.  
Pain point: Cognitive overload (7 tab + 6 kartu dashboard), informasi terlalu banyak sekaligus.  
Kebutuhan aksesibilitas: Responsif pada tablet, label filter jelas, touch target ≥ 44×44 px.

**Persona 3 — Budi, Bendahara (45 tahun)**  
Tujuan: Mencatat transaksi keuangan, menyetujui tahap terakhir, mengelola data anggota.  
Pain point: Input berulang, tidak ada tombol batal/kembali konsisten, export expose data sensitif.  
Kebutuhan aksesibilitas: Label terprogram pada semua form, touch target ≥ 44×44 px, konfirmasi sebelum hapus.

---

## Slide 5 — User Journey (4 Alur Utama)

**Journey A — Login → Dashboard (semua persona)**  
Splash (1.5s redirect) → Login (email/HP + password) → Dashboard (statistik, antrian, notifikasi) → Pilih tugas via sidebar.  
Peluang: Tambah tombol "Kembali" dari login, kurangi durasi redirect, indikasi loading.

**Journey B — Persetujuan Anggota (Pengawas → Ketua → Bendahara)**  
Antrian anggota → Review detail → Setujui/tolak (3 tahap) → Notifikasi real-time → Konfirmasi akhir.  
Peluang: Label pada semua filter input, konfirmasi sebelum approve, toast sukses.

**Journey C — Persetujuan Pinjaman (Pengawas → Ketua → Bendahara)**  
Input pinjaman → Review 3 tahap → Cairkan dana → Riwayat approval.  
Peluang: Kurangi 6 tab → 4 tab, tambah pagination, fix `aria-label` copy-paste error.

**Journey D — Transaksi Tabungan (Bendahara)**  
Pilih anggota → Input nominal → Simpan → Laporan → Export.  
Peluang: Perbesar tombol aksi ≥ 44×44 px, label filter, masking data pada export.

---

## Slide 6 — Design System & Aturan Visual

**Warna (dari `design-tokens.css`):**  
- Brand primary: `#00896d` (WCAG AA 4.51:1 on white)  
- Brand primary hover: `#006b54`  
- Brand secondary: `#2563eb`  
- Text primary: `#1e293b`  
- Text secondary: `#64748b` (4.76:1 on white)  
- Background body: `#f8fafc`  
- Background surface: `#ffffff`  
- Border default: `#e2e8f0`

**Dark mode (`data-theme="dark"`):**  
- Background body: `#0f172a`  
- Background surface: `#1e293b`  
- Border default: `#334155`  
- Text primary: `#f1f5f9`

**Tipografi:**  
- Font family: system-ui, sans-serif (Segoe UI, Roboto, dll)  
- Ukuran: 0.75rem (xs) sampai 1.875rem (3xl)  
- Baris: tight 1.25, normal 1.5, relaxed 1.75

**Spacing (4px base):**  
- space-1: 0.25rem sampai space-8: 4rem

**Border radius:**  
- sm: 4px, md: 8px, lg: 12px, xl: 16px, full: 9999px

**Shadow:**  
- sm, md, lg, focus (dari design tokens)

---

## Slide 7 — Komponen UI Utama

**FilterField** (`src/components/ui/FilterField.jsx`):  
- Komponen filter reusable/templateable (text, select, number, email, date)  
- Label terprogram (`htmlFor`), `aria-label` konsisten  
- Tombol clear, invalid state, touch target ≥ 44×44 px  
- Digunakan di semua halaman dengan filter

**Tombol aksi tabel:**  
- View (primary, biru), Approve (success, hijau), Warning (oranye), Danger (merah)  
- Ukuran minimum 44×44 px, padding konsisten  
- Hover state dengan transform translateY(-1px)

**Tabel:**  
- Caption terprogram, `scope="col"`, `aria-sort`  
- Zebra striping, hover state  
- Responsive scroll pada mobile

**Modal:**  
- Judul jelas, tombol Batal dan Simpan/Aksi  
- Fokus tertangkap dalam modal, escape untuk tutup  
- ARIA dialog yang benar

**Notifikasi / Toast:**  
- SweetAlert2 mengganti `alert()` native  
- Warna sesuai status (sukses hijau, error merah, peringatan oranye)

---

## Slide 8 — Aksesibilitas (WCAG 2.2 AA)

**Yang sudah diterapkan:**  
- Skip link global (`LayoutGlobal.jsx`)  
- `:focus-visible` global (`admin-theme.css`)  
- `prefers-reduced-motion` global  
- Touch target ≥ 44×44 px (tombol, input, link)  
- Kontras warna inline fixed (6 warna, brand `#00896d` 4.51:1)  
- Label pada 87+ input filter di 20+ file  
- Caption pada 30+ tabel di 20+ file  
- Aria-label pada 26+ tombol icon-only  
- ARIA tablist/tab pada semua halaman report  
- Pagination ARIA-labeled  
- Data masking pada tabel Members

**Yang masih perlu diperbaiki:**  
- Dark mode kontras pada latar gelap (perlu audit terpisah)  
- Beberapa inline style hardcode masih belum pakai design token  
- Kontras badge status pada Simpanan Dashboard

---

## Slide 9 — Responsivitas & Breakpoint

**Tablet (768px–1023px):**  
- Sidebar width 200px, header height 60px  
- Font size tabel 0.875rem  
- Card padding 1rem  
- Modal max-width 90vw

**Mobile (< 768px):**  
- Sidebar width 100%, header height 58px  
- Tombol kecil (btn-sm) min-height 44px  
- Card full width, border-radius 8px  
- Table overflow touch (`-webkit-overflow-scrolling: touch`)

**Dark mode toggle:**  
- Tersedia di Topbar (tombol Sun/Moon, `aria-pressed`)  
- Persist ke `localStorage` kunci `kkpus-theme`  
- Ikuti `prefers-color-scheme` sistem

---

## Slide 10 — Rekomendasi Perbaikan Prioritas

**Prioritas 1 (Kritis) — Semua Done:**  
1. Label filter (87+) ✅  
2. Touch target ≥ 44×44 px ✅  
3. Kontras warna (brand + dark mode infra) ✅  
4. Tabel caption (30+) ✅

**Prioritas 2 (Tinggi) — Semua Done:**  
1. Design token ✅  
2. Kurangi cognitive overload ✅  
3. Breakpoint tablet ✅  
4. Ganti `alert()` → SweetAlert2 ✅  
5. Masking data sensitif ✅  
6. Templateable pada filter (FilterField) ✅  
7. ARIA pada modal, tab ✅

**Prioritas 3 (Menengah) — Sisa:**  
1. Persona & user journey ✅ (99-PERSONA-USER-JOURNEY.md)  
2. Google Slides design spec ✅ (99-DESIGN-SPEC-GOOGLE-SLIDES.md)  
3. Usability test (≥5 user) ⬜ Pending  
4. Definisi metrik sukses ⬜ Pending  
5. Handoff deliverables ⬜ Pending

---

## Slide 11 — Langkah Selanjutnya & Handoff

**Usability test (≥5 user):**  
- Rekrut minimal 5 pengguna per persona (Pengawas, Ketua, Bendahara)  
- Uji 4 journey utama (Login, Persetujuan Anggota, Persetujuan Pinjaman, Transaksi Tabungan)  
- Catat waktu tugas, error rate, kepuasan pengguna  
- Iterasi desain berdasarkan hasil uji

**Definisi metrik sukses:**  
- Tingkat penyelesaian tugas (task completion rate) ≥ 90%  
- Waktu rata-rata menyelesaikan persetujuan < 3 menit  
- Error rate input < 5%  
- Skor kepuasan pengguna (SUS) ≥ 70

**Handoff deliverables:**  
- Desain dipindahkan ke Google Slides dari dokumen ini  
- Dokumentasi komponen UI (FilterField, tombol, tabel, modal)  
- Aturan design system (warna, tipografi, spacing)  
- Checklist aksesibilitas WCAG 2.2 AA

---

## Referensi

- `docs/ux-audit/99-REKAPITULASI.md` — Rekapitulasi audit UI/UX  
- `docs/ux-audit/99-PERSONA-USER-JOURNEY.md` — Persona & user journey  
- `src/styles/design-tokens.css` — Design tokens (warna, spacing, tipografi)  
- `src/styles/admin-theme.css` — Override global & styling FilterField  
- `src/components/ui/FilterField.jsx` — Komponen filter reusable

---

**Disusun oleh:** Senior UI/UX Designer + Senior Fullstack Developer  
**Tanggal:** 21 November 2026  
**Status:** Draft untuk handoff
