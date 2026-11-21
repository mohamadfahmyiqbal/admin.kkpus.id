# Handoff Deliverables — Admin KKPUS UI/UX

**Tanggal:** 21 November 2026  
**Status:** Draft (siap dieksekusi)  
**Referensi:** `docs/ux-audit/99-REKAPITULASI.md` (Prioritas 3, Item 5 — Pending)  
**Standar:** ISO/IEC 25010, WCAG 2.2 AA, Nielsen's 10 Heuristics  

---

## 1. Tujuan

Menyampaikan hasil audit UI/UX dan spesifikasi desain ke tim developer dengan lengkap, terstruktur, dan dapat ditindaklanjuti, sehingga setiap perbaikan dapat diimplementasi dengan benar dan terukur.

---

## 2. Daftar Dokumen Handoff

| No | Dokumen | Lokasi | Status | Deskripsi |
|----|---------|--------|--------|-----------|
| 1 | Rekapitulasi Audit UI/UX | `docs/ux-audit/99-REKAPITULASI.md` | ✅ Tersedia | Ringkasan semua halaman, skor, prioritas perbaikan |
| 2 | Persona & User Journey | `docs/ux-audit/99-PERSONA-USER-JOURNEY.md` | ✅ Tersedia | 3 persona, 4 user journey, JTBD, titik sentuh |
| 3 | Design Spec (Google Stitch) | `docs/ux-audit/99-DESIGN-SPEC-GOOGLE-STITCH.md` | ✅ Tersedia | Spesifikasi visual, komponen, aturan aksesibilitas |
| 4 | Design Tokens | `src/styles/design-tokens.css` | ✅ Tersedia | CSS variables: warna, spacing, tipografi, shadow, z-index |
| 5 | Dark Mode Tokens | `src/styles/theme-dark.css` | ✅ Tersedia | Override warna untuk mode gelap |
| 6 | Global Accessibility CSS | `src/styles/admin-theme.css` | ✅ Tersedia | Skip link, focus-visible, prefers-reduced-motion, touch 44px |
| 7 | FilterField Komponen | `src/components/ui/FilterField.jsx` | ✅ Tersedia | Komponen filter reusable dengan label terprogram + ARIA |
| 8 | ThemeContext | `src/context/ThemeContext.jsx` | ✅ Tersedia | Manajemen tema terang/gelap (localStorage + sistem) |
| 9 | Rencana Uji Usabilitas | `docs/ux-audit/99-USABILITY-TEST-PLAN.md` | ✅ Baru | Peserta, skenario, metrik, timeline uji |
| 10 | Definisi Metrik Sukses | `docs/ux-audit/99-METRIK-SUKSES.md` | ✅ Baru | Target metrik, kriteria lulus, pelaporan |
| 11 | File Audit per Halaman | `docs/ux-audit/01-23-*.md` | ✅ Tersedia | 21 file audit lengkap, 2 file baru diisi |
| 12 | Checklist Handoff | Berikut (Bagian 3) | ⬜ Belum | Daftar pemeriksaan sebelum serahkan ke developer |

---

## 3. Checklist Handoff ke Developer

Setiap halaman harus memenuhi checklist berikut sebelum dianggap "siap diterapkan":

### Aksesibilitas (WCAG 2.2 AA)

- [ ] Setiap input formulir memiliki `<label>` yang terprogram dan terlihat
- [ ] Setiap input filter memiliki `aria-label` atau `<label>`
- [ ] Target sentuhan minimal 44×44 px (tombol, input, select)
- [ ] `:focus-visible` terlihat jelas pada semua elemen interaktif
- [ ] Skip link tersedia dan berfungsi (pindah ke `#main-content`)
- <] Tabel data memiliki `<caption>` dan `scope="col"` pada `<th>`
- [ ] Tabel sort header memiliki `aria-sort` dan `aria-label`
- [ ] Ikon dekoratif memiliki `aria-hidden="true"`
- [ ] Ikon fungsional memiliki `aria-label`
- [ ] Animasi respek `prefers-reduced-motion`
- [ ] Kontras teks ≥ 4.5:1 (normal), ≥ 3:1 (besar/UI)
- [ ] Pagination memiliki ARIA label
- [ ] Modal memiliki ARIA role dan trap fokus

### Design System

- [ ] Warna menggunakan CSS variable dari `design-tokens.css`
- [ ] Tipografi menggunakan CSS variable dari `design-tokens.css`
- [ ] Spacing menggunakan CSS variable atau Bootstrap classes konsisten
- [ ] Tidak ada inline style hardcode (atau dicatat sebagai utang teknis)
- [ ] Komponen reusable (FilterField, tabel, modal, kartu)

### Responsivitas

- [ ] Breakpoint tablet (768px-1023px) diuji
- [ ] Breakpoint mobile (<768px) diuji
- [ ] Tabel dapat di-scroll horizontal di mobile
- [ ] Tombol aksi ≥ 44×44 px di mobile

### Etika & Privasi

- [ ] Data sensitif (NIK, telepon, email) maskir di tabel
- [ ] Tidak ada `alert()` native (gunakan toast/SweetAlert2)
- [ ] Tidak ada dark pattern (forced continuity, hidden cost, urgency palsu)
- [ ] Opsi batal/keluar selalu tersedia dan tidak tersembunyi

### Proses

- [ ] Hasil uji usabilitas tercatat (minimal 5 peserta)
- [ ] Skor SUS dan Task Success Rate tercatat
- [ ] Setiap temuan kritis memiliki rekomendasi perbaikan
- [ ] Tanggung jawab perbaikan ditetapkan (developer/pic)
- [ ] Tanggal target selesai perbaikan ditetapkan

---

## 4. Rute Handoff (Alur Kerja)

```
1. Auditor menyelesaikan audit halaman
   ↓
2. Auditor buat daftar temuan (file audit per halaman)
   ↓
3. Temuan diklasifikasikan: Kritis / Tinggi / Menengah
   ↓
4. Developer menilai estimasi waktu per item
   ↓
5. PM menetapkan prioritas dan jadwal sprint
   ↓
6. Developer implementasi perbaikan
   ↓
7. QA verifikasi perbaikan (checklist bagian 3)
   ↓
8. Audit ulang (regression) halaman yang diperbaiki
   ↓
9. Update skor audit di 99-REKAPITULASI.md
   ↓
10. Tandai halaman sebagai "Lulus" jika memenuhi kriteria
```

---

## 5. Tanggung Jawab per Role

| Role | Tanggung Jawab |
|------|---------------|
| **Senior UI/UX Designer** | Membuat audit, design spec, design tokens, review hasil implementasi |
| **QA Engineer** | Verifikasi aksesibilitas, uji usabilitas, pelaporan metrik |
| **Frontend Developer** | Implementasi perbaikan, migrasi ke design token, ARIA |
| **Product Manager** | Prioritaskan backlock, setujui jadwal, koordinasi stakeholder |
| **Backend Developer** | Dukungan API untuk masking data, pagination, error response |

---

## 6. Template Serah Terima (per Halaman)

```
Halaman: [Nama Halaman]
File Audit: [docs/ux-audit/XX-*.md]
Skor Akhir: [XX/80]
Status: [Lulus / Perbaikan Besar / Perbaikan Minor / Tidak Lulus]

Item Kritis (harus diperbaiki sebelum rilis):
1. [Masalah] → [Rekomendasi] → [PIC] → [Target Selesai]
2. ...

Item Tinggi (perbaikan primer):
1. [Masalah] → [Rekomendasi] → [PIC] → [Target Selesai]
2. ...

Item Menengah (low priority):
1. [Masalah] → [Rekomendasi] → [PIC] → [Target Selesai]
2. ...

Verifikasi QA: [ ] Belum  [ ] Selesai
Tanggal Handoff: [Tanggal]
Tanggal Target Selesai: [Tanggal]
```

---

## 7. Contoh Pengisian (Simpanan Dashboard)

```
Halaman: Simpanan Dashboard
File Audit: docs/ux-audit/05-simpanan-page-audit.md
Skor Akhir: 27/80
Status: Perbaikan Besar

Item Kritis:
1. Tombol aksi tabel < 44×44 px → Perbesar padding → Dev: @frontend → Target: Minggu 3
2. Filter input tanpa label → Tambah aria-label → Dev: @frontend → Target: Minggu 3
3. Tidak ada skip link → Sudah ada di LayoutGlobal.jsx (global) → Selesai
4. Tabel tanpa caption → Tambah <caption> → Dev: @frontend → Target: Minggu 3

Item Tinggi:
1. Inline style hardcode → Migrasi ke design token → Dev: @frontend → Target: Minggu 4
2. Ikon tanpa aria-label → Tambah aria-label / aria-hidden → Dev: @frontend → Target: Minggu 4
3. alert() native → Ganti toast/SweetAlert2 → Dev: @frontend → Target: Minggu 4
4. Data anggota tanpa maskir → Terapkan maskSensitiveData() → Dev: @backend → Target: Minggu 4
5. Kognitif overload (tab + sub-tab + filter) → Sederhanakan layout → Desain: @uiux → Target: Minggu 4

Verifikasi QA: [ ] Belum  [x] Selesai (global fixes)
Tanggal Handoff: 21 Nov 2026
Tanggal Target Selesai: 12 Des 2026
```

---

## 8. Kriteria Handoff Ditetandai Selesai

Handoff untuk semua halaman utama dianggap selesai jika:

- [ ] 21 file audit per halaman telah dikumpulkan dan direkap
- [ ] Checklist handoff (Bagian 3) telah ditandai untuk setiap halaman prioritas
- [ ] Setiap temuan kritis memiliki PIC dan target selesai
- [ ] Design tokens telah diterapkan di minimal 1 halaman sebagai pilot
- [ ] Uji usabilitas minimal 1 siklus telah direncanakan
- [ ] Dokumen metrik sukses telah disetujui tim

---

**Disusun oleh:** Senior UI/UX Designer + QA Engineer  
**Tanggal:** 21 November 2026  
**Status:** ⬜ Menunggu eksekusi handoff ke tim developer