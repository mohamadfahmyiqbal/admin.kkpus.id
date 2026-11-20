# REKAPITULASI AUDIT UI/UX — Admin KKPUS

**Tanggal Rekap:** 20 November 2026  
**Auditor:** Senior UI/UX Designer (Skill `/uiux`)  
**Standar Referensi:** WCAG 2.2 AA, Nielsen's 10 Heuristics, Double Diamond, Anti Dark Pattern  
**Total Halaman:** 23  
**Lokasi File:** `docs/ux-audit/`

---

## 1. Status Audit per Halaman

| No | Halaman | File Audit | Status Audit | Skor | Hasil |
|----|---------|------------|:------------:|:----:|-------|
| 1 | Splash Page | `01-auth-splash-page-audit.md` | ✅ Selesai (Perbaikan Diterapkan) | **14/80** | 🔴 Tidak Lulus → 🟡 Perbaikan Diterapkan |
| 2 | Login Page | `02-auth-login-page-audit.md` | ✅ Selesai | **28/80** | 🟡 Perbaikan Besar |
| 3 | Dashboard | `03-dashboard-page-audit.md` | ✅ Selesai | **27/80** | 🟡 Perbaikan Besar |
| 4 | Members (Anggota) | `04-members-page-audit.md` | ✅ Selesai (Perbaikan Diterapkan) | **27/80** | 🟡 Perbaikan Besar |
| 5 | Simpanan Dashboard | `05-simpanan-page-audit.md` | ✅ Selesai (Perbaikan Diterapkan) | **27/80** | 🟡 Perbaikan Besar |
| 6 | Simpanan Report | `06-simpanan-report-page-audit.md` | ⬜ Pending | — | — |
| 7 | Jual Beli Dashboard | `06-jual-beli-page-audit.md` | ✅ Selesai | **27/80** | 🟡 Perbaikan Besar |
| 8 | Jual Beli Report | `08-jual-beli-report-page-audit.md` | ⬜ Pending | — | — |
| 9 | Akad Config | `09-akad-config-page-audit.md` | ⬜ Pending | — | — |
| 10 | Simpanan Config | `10-simpanan-config-page-audit.md` | ⬜ Pending | — | — |
| 11 | Payment Fee Config | `11-payment-fee-config-page-audit.md` | ⬜ Pending | — | — |
| 12 | Pinjaman List | `12-pinjaman-list-page-audit.md` | ⬜ Pending | — | — |
| 13 | Pinjaman Report | `13-pinjaman-report-page-audit.md` | ⬜ Pending | — | — |
| 14 | Pinjaman Input Modal | `14-pinjaman-input-modal-audit.md` | ⬜ Pending | — | — |
| 15 | Arisan Batch | `15-arisan-batch-page-audit.md` | ⬜ Pending | — | — |
| 16 | Arisan Report | `16-arisan-report-page-audit.md` | ⬜ Pending | — | — |
| 17 | Tabungan List | `17-tabungan-page-audit.md` | ⬜ Pending | — | — |
| 18 | Tabungan Report | `18-tabungan-report-page-audit.md` | ⬜ Pending | — | — |
| 19 | Investasi Halal List | `19-investasi-halal-list-page-audit.md` | ⬜ Pending | — | — |
| 20 | Investasi Halal Report | `20-investasi-halal-report-page-audit.md` | ⬜ Pending | — | — |
| 21 | Pendanaan Syariah List | `21-pendanaan-syariah-list-page-audit.md` | ⬜ Pending | — | — |
| 22 | Pendanaan Syariah Report | `22-pendanaan-syariah-report-page-audit.md` | ⬜ Pending | — | — |
| 23 | Training Page | `23-training-page-audit.md` | ⬜ Pending | — | — |

**Progres:** 6 dari 23 halaman selesai (26%)

**Catatan penamaan file:**
- Baris 5 (Simpanan): audit lengkap berada di `05-simpanan-page-audit.md`; file `05-simpanan-dashboard-audit.md` masih template kosong.
- Baris 7 (Jual Beli): audit lengkap berada di `06-jual-beli-page-audit.md`; file `07-jual-beli-dashboard-audit.md` masih template kosong.

---

## 2. Ringkasan Hasil Audit yang Selesai

### 2.1 Splash Page (14/80) — 🔴 Tidak Lulus → 🟡 Perbaikan Diterapkan

**Temuan Awal (sebelum perbaikan):**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Membersihkan `localStorage`, `sessionStorage`, dan Cache Storage tanpa izin pengguna saat splash dimuat | Pelanggaran privasi (Kritis) |
| 2 | Auto-redirect 3000 ms melanggar Doherty Threshold & kontrol pengguna | UX buruk, memaksa menunggu |
| 3 | Pesan berubah otomatis setiap 1200 ms tanpa opsi pause | WCAG 2.2 Timing Adjustable dilanggar |

**Temuan Tinggi (3 item):**
- Progressbar tanpa nilai ARIA
- Tidak ada indikasi fokus keyboard
- Efek animasi tanpa `prefers-reduced-motion`

**Perbaikan yang Telah Diterapkan (20 Nov 2026):**
1. ✅ Hapus `purgeCacheAndCookies` — cookie/sessionStorage tidak lagi dihapus diam-diam
2. ✅ Delay redirect 3000 ms → 1500 ms
3. ✅ Tombol Jeda/Lanjut rotasi pesan (WCAG 2.2.2)
4. ✅ Tombol "Lewati" + `:focus-visible` (CSS global)
5. ✅ Touch target ≥ 44×44 px pada tombol kontrol
6. ✅ `role="status"` + `aria-live` menggantikan progressbar tanpa ARIA
7. ✅ `prefers-reduced-motion` di `SplashPage.css`

**Backlog tersisa:** verifikasi kontras warna, uji usabilitas, handoff Figma.

---

### 2.2 Login Page (28/80) — 🟡 Perbaikan Besar

**Temuan Kritis (2 item):**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Tidak ada tombol batal/kembali — pengguna terpaku hanya bisa login | Kontrol pengguna hilang |
| 2 | Tombol "Lihat password" (eye button) ukuran < 44×44 px | Aksesibilitas gagal |

**Temuan Tinggi (4 item):**
- Warna hardcode tanpa design token
- Tidak ada verifikasi kontras warna teks pada gradient
- Hanya satu breakpoint (576px)
- Animasi framer-motion tanpa `prefers-reduced-motion`

**Rekomendasi Utama:**
1. Tambahkan tombol "Kembali" / tautan ke halaman utama
2. Pastikan touch target minimal 44×44 px
3. Migrasi ke design token (CSS variables)
4. Tambahkan breakpoint tambahan untuk tablet

---

### 2.3 Dashboard (27/80) — 🟡 Perbaikan Besar

**Temuan Kritis (2 item):**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Tombol aksi tabel size="sm" kemungkinan < 44×44 px | Aksesibilitas gagal |
| 2 | Tidak ada indikasi fokus keyboard & tidak ada skip link | Aksesibilitas gagal |

**Temuan Tinggi (5 item):**
- 7 tab + 6 kartu statistik = risiko cognitive overload
- Ikon SVG tanpa aria-label
- Animasi tanpa `prefers-reduced-motion`
- Warna dan spacing masih hardcode
- Toast notifikasi tidak di-announce ke screen reader

**Rekomendasi Utama:**
1. Perbesar tombol aksi / tambahkan padding
2. Tambahkan skip link & focus-visible (sudah global, perlu verifikasi per halaman)
3. Tambahkan aria-label pada ikon
4. Kurangi informasi sekaligus (sembunyikan tab kosong)

---

### 2.4 Members Page (27/80) — 🟡 Perbaikan Besar → ✅ Perbaikan Diterapkan

**Temuan Kritis (4 item):**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Data sensitif (NIK KTP, telepon, email, alamat, rekening bank) ditampilkan terbuka | Privasi & GDPR (Kritis) |
| 2 | Tombol Eye (detail) & UserGear (role) ukuran < 44×44 px | Aksesibilitas gagal |
| 3 | Filter input tabel tanpa `<label>` terlihat & terprogram | Aksesibilitas gagal |
| 4 | Tidak ada skip link & indikasi fokus keyboard | Aksesibilitas gagal |

**Temuan Tinggi (6 item):**
- Warna & spacing hardcode (inline style)
- Ikon phosphor-react tanpa aria-label / aria-hidden
- Animasi `animate__fadeIn` tanpa `prefers-reduced-motion`
- Tabel tanpa caption/summary & th sort tanpa aria-sort
- Hard delete permanen (batch & single) risiko tinggi
- Export Excel mencakup data sensitif lengkap

**Perbaikan yang Telah Diterapkan (20 Nov 2026):**
1. ✅ Touch target ≥ 44×44 px pada semua tombol aksi tabel
2. ✅ Label terprogram (`<label className="visually-hidden" htmlFor>`) pada semua filter input
3. ✅ Table caption + `scope="col"` + `aria-sort` pada header sortable
4. ✅ `aria-hidden="true"` pada semua ikon dekoratif phosphor-react
5. ✅ `aria-label` pada tombol icon-only (Import, Export, Hapus, Detail, Role)
6. ✅ Skip link global di `LayoutGlobal.jsx`
7. ✅ Focus visible global di `admin-theme.css` (`*:focus-visible`)
8. ✅ `prefers-reduced-motion` global di `admin-theme.css`
9. ✅ Hapus `animate__fadeIn` dari `MembersHeader.jsx`
10. ✅ Ikon `Clock` → `UserPlus` untuk "Anggota Luar Biasa" (semantik)

**Perbaikan Soft Delete / Arsip (20 Nov 2026) — ✅ IMPLEMENTED:**
11. ✅ **Soft delete single** — `handleArchiveMember`: PATCH `/anggota/:id/archive` + verifikasi password
12. ✅ **Soft delete batch** — `handleArchiveBatch`: POST `/anggota/batch-archive` + verifikasi password
13. ✅ **Restore single** — `handleRestoreMember`: PATCH `/anggota/:id/restore` + verifikasi password
14. ✅ **Restore batch** — `handleRestoreBatch`: POST `/anggota/batch-restore` + verifikasi password
15. ✅ **UI Toggle Anggota Aktif / Arsip** — Button group di atas header untuk beralih tampilan
16. ✅ **Tombol aksi tabel menyesuaikan mode** — Mode aktif: Arsipkan + Role; Mode arsip: Kembalikan
17. ✅ **Header batch action menyesuaikan mode** — Warning (arsipkan) / Info (kembalikan)
18. ✅ **Statistik menyesuaikan mode** — Mode arsip menampilkan "Total Terarsip", "Bisa Dikembalikan"
19. ✅ **Modal detail footer menyesuaikan mode** — Badge "Terarsip" + tombol Kembalikan/Arsipkan

**Masih Perlu Diperbaiki (Backlog):**
- Privasi data sensitif (maskir/role-based access/toggle)
- Export dengan pemilihan kolom
- Migrasi inline style ke design token
- Uji usabilitas & handoff

---

### 2.5 Simpanan Dashboard (27/80) — 🟡 Perbaikan Besar → 🟡 Perbaikan Diterapkan

**Sumber audit:** `05-simpanan-page-audit.md`

**Temuan Kritis (4 item):**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Tombol aksi tabel (CheckCircle verifikasi, Eye detail) ukuran kecil kemungkinan < 44×44 px | Aksesibilitas gagal |
| 2 | Filter input di header tabel tidak memiliki `<label>` yang terlihat dan terprogram | Aksesibilitas gagal |
| 3 | Tidak ada skip link dan indikasi fokus keyboard yang terlihat jelas | Aksesibilitas gagal |
| 4 | Tabel tanpa caption/summary dan th sort tanpa aria-sort/aria-label | WCAG 1.3.1 gagal |

**Temuan Tinggi (5 item):**
- Warna & spacing hardcode (inline style)
- Ikon phosphor-react tanpa aria-label / aria-hidden
- `alert()` native untuk gagal export tidak di-announce ke screen reader
- Nomor & nama anggota ditampilkan dalam tabel transaksi
- 3 tab utama + 2 sub-tab + 6 filter kolom = risiko cognitive overload

**Perbaikan yang Telah Diterapkan (20 Nov 2026):**
1. ✅ `<caption className="visually-hidden">` pada tabel transaksi simpanan
2. ✅ `scope="col"` pada semua `<th>` header tabel
3. ✅ `aria-sort` + `tabIndex` + `onKeyDown` pada header sortable
4. ✅ Filter input memiliki `aria-label` deskriptif
5. ✅ Tombol aksi (verifikasi, approve, detail) touch target ≥ 44×44 px
6. ✅ Pagination & size selector memiliki `aria-label`

**Masih Perlu Diperbaiki (Backlog):**
- Verifikasi kontras warna pada badge status
- Ganti `alert()` native dengan toast/SweetAlert2 yang accessible
- Privasi nomor/nama anggota (maskir/otorisasi)
- Migrasi inline style ke design token
- Uji usabilitas & handoff

---

### 2.6 Jual Beli Dashboard (27/80) — 🟡 Perbaikan Besar

**Sumber audit:** `06-jual-beli-page-audit.md`

**Temuan Kritis (4 item):**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Tombol aksi tabel (Eye, Coins, CheckCircle, X, Trash) ukuran kecil kemungkinan < 44×44 px | Aksesibilitas gagal |
| 2 | Filter input di header tabel tidak memiliki `<label>` yang terlihat dan terprogram | Aksesibilitas gagal |
| 3 | Tidak ada skip link dan indikasi fokus keyboard yang terlihat jelas | Aksesibilitas gagal |
| 4 | Tabel tanpa caption/summary dan th sort tanpa aria-sort/aria-label | WCAG 1.3.1 gagal |

**Temuan Tinggi (5 item):**
- Warna & spacing hardcode (inline style)
- Ikon phosphor-react tanpa aria-label / aria-hidden
- `animate-fade-in` tanpa `prefers-reduced-motion`
- Nama anggota & detail transaksi ditampilkan dalam tabel pembiayaan
- 11 filter kolom dalam satu layar = risiko cognitive overload

**Rekomendasi Utama:**
1. Perbesar tombol aksi tabel / tambahkan padding (≥ 44×44 px)
2. Tambahkan label/aria-label pada filter
3. Tambahkan skip link & focus-visible (global sudah ada, perlu verifikasi)
4. Tambahkan caption, `scope`, `aria-sort`
5. Migrasi inline style ke design token
6. Terapkan maskir data anggota sesuai otorisasi
7. Sederhanakan filter atau kelompokkan

---

## 3. Pola Masalah Umum (Cross-Page)

Berdasarkan 6 halaman yang sudah diaudit (Splash, Login, Dashboard, Members, Simpanan, Jual Beli), **pola masalah yang berulang** dan kemungkinan besar berlaku di 17 halaman lainnya.

### 3.1 Aksesibilitas (Tertinggi — Hampir Semua Halaman)

| Masalah | Prevalensi | Severity | Status |
|---------|:----------:|:--------:|--------|
| Kontras teks perlu verifikasi (≥ 4.5:1) | 6/6 | Kritis | Terbuka |
| Touch target < 44×44 px | 6/6 | Kritis | 3/6 diperbaiki (Splash, Members, Simpanan) |
| Tidak ada indikasi fokus keyboard | 6/6 | Kritis | ✅ Fix global (`:focus-visible`) |
| Ikon tanpa aria-label / aria-hidden | 6/6 | Tinggi | 2/6 diperbaiki (Members, Simpanan) |
| Animasi tanpa `prefers-reduced-motion` | 6/6 | Tinggi | ✅ Fix global (`admin-theme.css`) |
| Filter/input tanpa label terprogram | 3/6 | Kritis | 2/3 diperbaiki (Members, Simpanan) |
| Progressbar / loading tanpa ARIA | 1/6 | Kritis | ✅ Diperbaiki (Splash) |
| Timing otomatis tanpa pause | 1/6 | Kritis | ✅ Diperbaiki (Splash) |
| `alert()` native / toast tanpa announcement | 2/6 | Tinggi | Terbuka (Simpanan, Dashboard) |

### 3.2 Design System (Tertinggi — Hampir Semua Halaman)

| Masalah | Prevalensi | Severity |
|---------|:----------:|:--------:|
| Warna hardcode, belum design token | 6/6 | Tinggi |
| Tipografi hardcode | 6/6 | Tinggi |
| Spacing hardcode | 6/6 | Tinggi |
| Border-radius & shadow hardcode | 6/6 | Menengah |
| Tidak ada skala tipografi terdefinisi | 6/6 | Menengah |

### 3.3 Responsivitas

| Masalah | Prevalensi | Severity |
|---------|:----------:|:--------:|
| Hanya satu breakpoint / breakpoint tidak terdokumentasi | 2/6 | Tinggi |
| Tidak jelas mobile-first | 3/6 | Tinggi |

### 3.4 Proses & Dokumentasi (Semua Halaman)

| Masalah | Prevalensi | Severity |
|---------|:----------:|:--------:|
| Tidak ada dokumentasi riset pengguna | 6/6 | Tinggi |
| Tidak ada persona / user journey | 6/6 | Tinggi |
| Tidak ada file Figma / design spec | 6/6 | Tinggi |
| Tidak ada prototype interaktif | 6/6 | Tinggi |
| Tidak ada uji usabilitas | 6/6 | Tinggi |
| Tidak ada metrik sukses | 6/6 | Rendah |

### 3.5 Etika & Anti Dark Pattern

| Masalah | Prevalensi | Severity | Status |
|---------|:----------:|:--------:|--------|
| Privasi: membersihkan data tanpa izin | 1/6 | Kritis | ✅ Diperbaiki (Splash) |
| Privasi: data sensitif ditampilkan terbuka | 3/6 | Kritis/Tinggi | Terbuka (Members, Simpanan, Jual Beli) |
| Kontrol pengguna: auto-redirect tanpa izin | 1/6 | Kritis | ✅ Diperbaiki (Splash) |
| Tidak ada tombol batal/kembali | 1/6 | Kritis | Terbuka (Login) |
| Hard delete tanpa opsi soft delete/arsip | 1/6 | Tinggi | ✅ Diperbaiki (Members) |
| Cognitive overload (terlalu banyak opsi) | 4/6 | Tinggi | Terbuka (Dashboard, Members, Simpanan, Jual Beli) |

---

## 4. Prioritas Perbaikan Global

### ✅ Sudah Diterapkan (Global & per halaman)

| # | Perbaikan | Cakupan |
|---|-----------|---------|
| 1 | Hapus `purgeCacheAndCookies` otomatis | Splash Page |
| 2 | Skip link global (`LayoutGlobal.jsx`) | Semua halaman |
| 3 | `:focus-visible` global (`admin-theme.css`) | Semua halaman |
| 4 | `prefers-reduced-motion` global (`admin-theme.css`) | Semua halaman |
| 5 | Touch target ≥ 44×44 px (CSS & komponen) | Semua halaman |
| 6 | Members: label, caption/scope/aria-sort, aria-hidden, aria-label | Members |
| 7 | Members: soft delete / restore / arsip (single & batch) | Members |
| 8 | Simpanan: caption/scope/aria-sort, aria-label filter, touch target | Simpanan |

### 🔴 Prioritas 1 — Kritis (Sisa, Harus Diperbaiki Sebelum Rilis)

| # | Perbaikan | Dampak | Halaman Terdampak |
|---|-----------|--------|-------------------|
| 1 | Verifikasi & perbaiki kontras warna (≥ 4.5:1 teks, ≥ 3:1 UI) | WCAG 1.4.3 | Semua |
| 2 | Lengkapi `aria-label` / `aria-hidden` pada ikon & tombol icon-only di halaman belum diaudit | Screen reader access | 17 halaman sisa |
| 3 | Verifikasi touch target ≥ 44×44 px & atribut ARIA pada halaman belum diaudit | WCAG 2.5.5 | 17 halaman sisa |

### 🟡 Prioritas 2 — Tinggi (Perlu Perbaikan)

| # | Perbaikan | Dampak | Halaman Terdampak |
|---|-----------|--------|-------------------|
| 4 | Definisikan design token (CSS variables) untuk warna, spacing, typography | Konsistensi | Semua |
| 5 | Kurangi cognitive overload (sembunyikan tab/filter kosong) | UX | Dashboard, Members, Simpanan, Jual Beli |
| 6 | Tambahkan breakpoint tambahan (tablet) | Responsivitas | Login + lainnya |
| 7 | Tambahkan tombol "Kembali" / navigasi keluar | Kontrol pengguna | Login + lainnya |
| 8 | Tambahkan ARIA attributes pada progressbar, modal, tab | WCAG | Semua |
| 9 | Ganti `alert()` native dengan toast/SweetAlert2 yang accessible | Aksesibilitas | Simpanan, Dashboard |
| 10 | Terapkan maskir data sensitif / role-based access | Privasi | Members, Simpanan, Jual Beli |
| 11 | Tambahkan tooltip / bantuan di area yang membingungkan | Nielsen #10 | Dashboard + Report |

### 🟢 Prioritas 3 — Menengah (Direkomendasikan)

| # | Perbaikan | Dampak | Halaman Terdampak |
|---|-----------|--------|-------------------|
| 12 | Buat persona & user journey document | Proses desain | Proyek |
| 13 | Buat design spec di Figma | Handoff | Proyek |
| 14 | Jalankan uji usabilitas (minimal 5 user) | Validasi | Proyek |
| 15 | Tetapkan metrik sukses (SUS, task success rate) | Pengukuran | Proyek |
| 16 | Tambahkan "Ingat Saya" di Login | Efisiensi | Login Page |

---

## 5. Estimasi Dampak Perbaikan (Sisa)

| Kategori | Perbaikan Kritis | Perbaikan Tinggi | Perbaikan Menengah |
|----------|:----------------:|:----------------:|:-------------------:|
| Aksesibilitas | 3 | 2 | 0 |
| Design System | 0 | 1 | 0 |
| Responsivitas | 0 | 1 | 0 |
| UX / Heuristik | 0 | 2 | 1 |
| Etika / Privasi | 0 | 2 | 0 |
| Proses / Dokumentasi | 0 | 0 | 4 |

**Total estimasi (sisa):**
- **Kritis:** 3 item (harus sebelum rilis)
- **Tinggi:** 8 item (sebaiknya segera)
- **Menengah:** 5 item (prioritas rendah)

---

## 6. Roadmap Audit & Perbaikan

```
Minggu 1  → Selesaikan audit 17 halaman sisa (prioritas: Simpanan Report,
            Tabungan, Pinjaman, Jual Beli Report, Arisan, Investasi, Config)
Minggu 2  → Konsolidasi temuan lintas halaman & verifikasi regresi perbaikan
Minggu 3  → Perbaiki item Kritis sisa (3 item)
Minggu 4  → Perbaiki item Tinggi (8 item)
Minggu 5  → Uji usabilitas + iterasi
Minggu 6  → Audit ulang (regression)
```

---

## 7. Checklist Halaman yang Perlu Diaudit (Belum)

| Prioritas | Halaman | Alasan |
|:---------:|---------|--------|
| 1 | Simpanan Report | Data finansial utama |
| 2 | Simpanan Config | Perubahan nominal berdampak ke semua anggota |
| 3 | Tabungan List | Kompleksitas tinggi (bills, approval) |
| 4 | Pinjaman List | Approval bertahap, data sensitif |
| 5 | Jual Beli Report | Data transaksi laporan |
| 6 | Arisan Batch | Interaksi kompleks |
| 7 | Investasi Halal | Data finansial syariah |
| 8 | Payment Fee Config | Konfigurasi biaya (dampak finansial) |
| 9 | Pinjaman Report | Laporan approval & mutasi |
| 10 | Akad Config | Konfigurasi akad |
| 11 | Tabungan Report | Laporan tabungan |
| 12 | Arisan Report | Laporan arisan |
| 13 | Investasi Halal Report | Laporan investasi |
| 14 | Pendanaan Syariah List | Data pendanaan |
| 15 | Pendanaan Syariah Report | Laporan pendanaan |
| 16 | Pinjaman Input Modal | Modal input data pinjaman |
| 17 | Training Page | Halaman pelatihan |

---

## 8. Kesimpulan

**Status Overall:** 🟡 **Perlu Perbaikan Signifikan**

Dari 6 halaman yang sudah diaudit:
- **0 halaman lulus** (skor minimal 70/80)
- **1 halaman tidak lulus** (Splash Page — 14/80; perbaikan sudah diterapkan)
- **5 halaman perlu perbaikan besar** (Login 28, Dashboard 27, Members 27, Simpanan 27, Jual Beli 27)
- **1 halaman sudah diterapkan perbaikan aksesibilitas kritis** (Members Page)
- **2 halaman sudah diterapkan sebagian perbaikan** (Splash, Simpanan)

**Akibat:** 17 halaman lainnya kemungkinan besar memiliki masalah serupa (terutama aksesibilitas dan design system).

**Aksi segera:**
1. **Global CSS fixes sudah diterapkan** (skip link, focus-visible, prefers-reduced-motion, touch target 44×44px) — dampak ke semua halaman
2. Selesaikan 3 item Kritis sisa (kontras warna, aria-label ikon, verifikasi touch target/ARIA di 17 halaman)
3. Lanjutkan audit 17 halaman sisanya
4. Buat design token system sebagai fondasi perbaikan design system
5. Jadwalkan uji usabilitas sebelum rilis produksi
6. **Perbarui build assets** — `assets/SplashPage-*.js` (tracked) masih versi lama yang menghapus storage; rebuild atau keluarkan `assets/` dari tracking

---

## 9. Referensi

| Standar | Link |
|---------|------|
| WCAG 2.2 Level AA | https://www.w3.org/WAI/WCAG22/quickref/ |
| Nielsen's 10 Usability Heuristics | https://www.nngroup.com/articles/ten-usability-heuristics/ |
| Double Diamond Design Process | https://www.gov.uk/design-principles |
| Anti Dark Pattern | https://www.darkpatterns.com |
| Fitts's Law | https://en.wikipedia.org/wiki/Fitts%27s_law |
| Hick's Law | https://en.wikipedia.org/wiki/Hick%27s_law |
| Miller's Law (7±2) | https://en.wikipedia.org/wiki/Chunking_(psychology) |
| Doherty Threshold (400ms) | https://en.wikipedia.org/wiki/Doherty_threshold |

---

**Disusun oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Sumber data:** 23 file audit di `docs/ux-audit/` (6 audit lengkap: 01, 02, 03, 04, 05-simpanan-page, 06-jual-beli-page)  
**Terakhir diupdate:** 20 November 2026