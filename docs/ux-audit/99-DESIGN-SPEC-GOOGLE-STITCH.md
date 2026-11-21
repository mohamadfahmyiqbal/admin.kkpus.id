# Design Spec (Google Stitch) — Admin KKPUS Backoffice

**Tanggal:** 21 November 2026  \n**Auditor:** Senior UI/UX Designer + Senior Fullstack Developer  \n**Standar Referensi:** WCAG 2.2 AA, Nielsen's 10 Heuristics, Double Diamond  \n**File:** `docs/ux-audit/99-DESIGN-SPEC-GOOGLE-STITCH.md`  \n**Alat Target:** Google Stitch (generative UI design tool by Google)  \n**Tujuan:** Konten design specification yang disusun untuk diekspor/disiapkan ke dalam proyek Google Stitch, sebagai panduan visual dan interaksi untuk seluruh tim developer dan stakeholder.  \n**Status:** Draft untuk handoff

---

## 1. Tentang Dokumen ini

Dokumen ini berisi **design specification** untuk aplikasi backoffice koperasi syariah (`admin.kkpus.id`) yang disusun agar dapat diimpor atau direferensikan dalam **Google Stitch** — alat generative UI design milik Google yang menghasilkan antarmuka dari prompt teks dan referensi desain. Setiap bagian dokumen ini mewakili satu layar/komponen yang akan dibangun di Google Stitch untuk kemudian diekspor sebagai kode (HTML/CSS/React) dan divalidasi oleh tim frontend.

Isi dokumen ini merujuk pada design system yang sudah ada di repositori:
- `src/styles/design-tokens.css` — warna, spacing, tipografi, shadow
- `src/styles/admin-theme.css` — override global dan styling komponen
- `src/components/ui/FilterField.jsx` — komponen filter reusable

---

## 2. Latar Belakang dan Tujuan

**Aplikasi:** Admin KKPUS — Backoffice Koperasi Paguyuban Usaha Sukses Syariah  
**URL:** `https://admin.kkpus.id` → `https://api.kkpus.id/api`  
**Role pengguna:** Pengawas, Ketua, Bendahara (3 role berdasarkan `LoginPage.jsx`)

**Tujuan design spec di Google Stitch:**
- Menyediakan panduan visual dan interaksi yang konsisten di seluruh halaman
- Menjamin aksesibilitas WCAG 2.2 AA (label terprogram, touch target ≥ 44×44 px, fokus-visible, kontras ≥ 4.5:1)
- Mengurangi cognitive overload pada dashboard (7 tab → 4 tab)
- Membantu handoff desain ke developer dan stakeholder melalui Google Stitch

**Cakupan:** 21 halaman yang sudah diaudit di `docs/ux-audit/`

---

## 3. Persona Pengguna (untuk prompt Google Stitch)

Setiap persona berikut bisa digunakan sebagai konteks dalam prompt Google Stitch untuk menghasilkan UI yang sesuai kebutuhan pengguna.

| Persona | Peran | Tujuan Utama | Pain Point | Kebutuhan Aksesibilitas |
|---------|-------|--------------|------------|-------------------------|
| Ahmad (42 thn) | Pengawas | Memverifikasi transaksi dan keanggotaan sebelum disetujui Ketua | Antrian persetujuan menumpuk (7 tab kategori), tidak ada shortcut keyboard | Fokus-visible jelas, kontras ≥ 4.5:1, label terprogram pada input filter |
| Siti (38 thn) | Ketua | Memantau kinerja koperasi, menyetujui tahap kedua, kebijakan dari laporan | Cognitive overload (7 tab + 6 kartu dashboard), informasi terlalu banyak | Responsif tablet, label filter jelas, touch target ≥ 44×44 px |
| Budi (45 thn) | Bendahara | Mencatat transaksi keuangan, menyetujui tahap terakhir, kelola data anggota | Input berulang, tidak ada tombol batal/kembali konsisten, export expose data sensitif | Label terprogram semua form, touch target ≥ 44×44 px, konfirmasi sebelum hapus |

---

## 4. User Journey (4 Alur Utama)

Dapat digunakan sebagai skenario pengujian prototipe di Google Stitch.

**Journey A — Login → Dashboard (semua persona)**  
Splash → Login (email/HP + password) → Dashboard (statistik, antrian, notifikasi) → Pilih tugas via sidebar.  
Peluang: Tombol "Kembali" dari login, indikasi loading, kurangi durasi redirect.

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

## 5. Design System & Aturan Visual (dari design-tokens.css)

**Warna:**
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
- Font family: system-ui, sans-serif (Segoe UI, Roboto)
- Ukuran: 0.75rem (xs) sampai 1.875rem (3xl)
- Baris: tight 1.25, normal 1.5, relaxed 1.75

**Spacing (4px base):** space-1 (0.25rem) sampai space-8 (4rem)

**Border radius:** sm 4px, md 8px, lg 12px, xl 16px, full 9999px

**Shadow:** sm, md, lg, focus

---

## 6. Komponen UI Utama (untuk dibuat di Google Stitch)

**FilterField** (`src/components/ui/FilterField.jsx`):  
- Komponen filter reusable/templateable (text, select, number, email, date)
- Label terprogram (`htmlFor`), `aria-label` konsisten
- Tombol clear, invalid state, touch target ≥ 44×44 px
- Digunakan di semua halaman dengan filter

**Tombol aksi tabel:** View (biru), Approve (hijau), Warning (oranye), Danger (merah)  
- Ukuran minimum 44×44 px, padding konsisten  
- Hover state dengan transform translateY(-1px)

**Tabel:** Caption terprogram, `scope="col"`, `aria-sort`, zebra striping, hover state, responsive scroll mobile

**Modal:** Judul jelas, tombol Batal dan Simpan/Aksi, fokus tertangkap dalam modal, escape untuk tutup, ARIA dialog

**Notifikasi / Toast:** SweetAlert2 mengganti `alert()` native, warna sesuai status (sukses hijau, error merah, peringatan oranye)

---

## 7. Aksesibilitas (WCAG 2.2 AA)

**Sudah diterapkan:**
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

**Masih perlu diperbaiki:**
- Dark mode kontras pada latar gelap (perlu audit terpisah)
- Beberapa inline style hardcode masih belum pakai design token
- Kontras badge status pada Simpanan Dashboard

---

## 8. Responsivitas & Breakpoint

**Tablet (768px–1023px):** Sidebar width 200px, header height 60px, font size tabel 0.875rem, card padding 1rem, modal max-width 90vw

**Mobile (< 768px):** Sidebar width 100%, header height 58px, tombol kecil min-height 44px, card full width border-radius 8px, table overflow touch

**Dark mode toggle:** Tersedia di Topbar (tombol Sun/Moon, `aria-pressed`), persist ke `localStorage` kunci `kkpus-theme`, ikuti `prefers-color-scheme` sistem

---

## 9. Rekomendasi Perbaikan Prioritas

**Prioritas 1 (Kritis) — Semua Done:** Label filter (87+), touch target ≥ 44×44 px, kontras warna (brand + dark mode infra), tabel caption (30+)

**Prioritas 2 (Tinggi) — Semua Done:** Design token, kurangi cognitive overload, breakpoint tablet, ganti `alert()` → SweetAlert2, masking data sensitif, templateable pada filter (FilterField), ARIA pada modal, tab

**Prioritas 3 (Menengah) — Sisa:**
1. Persona & user journey ✅ Done (`99-PERSONA-USER-JOURNEY.md`)
2. Google Stitch design spec ✅ Done (dokumen ini)
3. Usability test (≥5 user) ⬜ Pending
4. Definisi metrik sukses ⬜ Pending
5. Handoff deliverables ⬜ Pending

---

## 10. Langkah Selanjutnya & Handoff (Google Stitch)

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

**Handoff deliverables (Google Stitch):**
- Desain diekspor dari Google Stitch ke kode HTML/CSS/React
- Dokumentasi komponen UI (FilterField, tombol, tabel, modal)
- Aturan design system (warna, tipografi, spacing)
- Checklist aksesibilitas WCAG 2.2 AA

---

## Referensi

- `docs/ux-audit/99-REKAPITULASI.md` — Rekapitulasi audit UI/UX
- `docs/ux-audit/99-PERSONA-USER-JOURNEY.md` — Persona & user journey
- `src/styles/design-tokens.css` — Design tokens
- `src/styles/admin-theme.css` — Override global & styling FilterField
- `src/components/ui/FilterField.jsx` — Komponen filter reusable

---

**Disusun oleh:** Senior UI/UX Designer + Senior Fullstack Developer  
**Tanggal:** 21 November 2026  
**Status:** Draft untuk handoff (Google Stitch)
