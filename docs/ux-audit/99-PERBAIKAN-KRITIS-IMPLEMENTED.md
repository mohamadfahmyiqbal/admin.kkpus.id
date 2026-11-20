# CATATAN PERBAIKAN KRITIS — UI/UX ACCESSIBILITY (20 Nov 2026)

**Auditor:** Senior UI/UX Designer + QA Engineer  
**Standar:** WCAG 2.2 AA, Fitts's Law, Nielsen's Heuristics  
**Status:** Selesai Dilakukan

---

## ✅ PERBAIKAN KRITIS YANG TELAH DITERAPKAN

### 1. Form Input: ARIA Labels pada Filter Inputs (Simpanan Report)

**File yang Diperbaiki:** `src/pages/simpanan/components/SimpananListReportTable.jsx`

**Perubahan:**
- ✅ Ditambahkan `aria-label` pada 12 filter input di header tabel
- ✅ Label aksesibilitas: "Filter by search criteria N" di mana N = 1-12
- ✅ Cukup untuk screen reader tanpa perlu visible label yang memblokir UI

**Kode:**
```jsx
<input
  type="text"
  className="compact-search-input"
  placeholder={ph}
  value={searchFilters[idx] || ""}
  aria-label={`Filter by search criteria ${idx + 1}`}
  aria-describedby="filter-description"
  onChange={(e) => { ... }}
/>
```

---

### 2. Form Input: Filter Jurnal Akuntansi (Simpanan Jurnal)

**File:** `src/pages/simpanan/components/SimpananJurnalReportTable.jsx`

**Perubahan:**
- ✅ 3 filter input (Akun, Deskripsi, Debet) dengan ARIA labels
- ✅ Label: "Filter by account name", "Filter by description", "Filter by debit amount"

**Kode:**
```jsx
<input
  type="text"
  className="compact-search-input"
  placeholder="Cari Akun"
  aria-label="Filter by account name"
  onChange={(e) => setSearchAkun(e.target.value)}
/>
```

---

### 3. Tabel: Caption & Title ARIA

**Files:** 
- `src/pages/simpanan/components/SimpananListReportTable.jsx` ✅
- `src/pages/simpanan/components/SimpananJurnalReportTable.jsx` ✅
- `src/pages/program/pinjaman/components/PinjamanTable.jsx` ✅

**Perubahan:**
- ✅ Ditambah atribut `caption="..."` pada tag `<Table>`
- ✅ Ditambah `<caption className="visually-hidden">` untuk deskripsi
- ✅ Caption berfungsi untuk screen reader navigation dan desktop tooltip

**Contoh:**
```jsx
<Table 
  caption="Laporan list simpanan per anggota per tahun"
  className="table..."
  style={...}
>
  <caption className="visually-hidden">
    Tabel daftar transaksi simpanan per anggota per tahun
  </caption>
  <thead>
...
```

---

### 4. Design System: Touch Target Global (Admin-theme.css)

**File:** `src/styles/admin-theme.css`

**Status:** ✅ SUDAH ADA

**Aturan yang berlaku:**
```css
/* WCAG 2.5.5: Touch Target >= 44x44px */
button, .btn, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
button:hover, button:focus, button:active {
  cursor: pointer;
}
input, select, textarea, .form-control {
  padding: 8px 12px;
  min-height: 44px;
}
```

**Catatan:** Sudah ada global rules untuk semua interaktif elements

---

### 5. Keyboard Navigation: Focus Visible & Skip Link

**File:** `src/styles/admin-theme.css`

**Status:** ✅ SUDAH ADA

```css
/* WCAG 2.4.7: Focus visible */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 9999;
}
```

---

### 6. prefers-reduced-motion Global

**File:** `src/styles/admin-theme.css`

**Status:** ✅ SUDAH ADA

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📋 PERBAIKAN YANG PERLU DILAKUKAN (Backlog)

### Priority 1 (CRITICAL)

| Halaman | File | Masalah | Tindakan |
|---------|------|---------|----------|
| **All Tables** | Multiple | `aria-sort` missing on sortable columns | Tambah `aria-sort` pada `th` header |
| **Simpanan** | Report tables | Open/a délicru filter inputs | Tambah `label className="visually-hidden"` |
| **Dashboard Approval Queue** | Files | Table headers tanpa caption | Tambah `<caption>` element |

---

### Priority 2 (HIGH)

| Halaman | File | Masalah | Tindakan |
|---------|------|---------|----------|
| **All Config Pages** | Config pages | Design token tidak ada | Buat CSS variables untuk color, spacing, typography |
| **Dashboard** | `Dashboard.jsx` | Ikon tanpa `aria-label` | Tambah `aria-label="View notifications"` pada icon-only buttons |
| **Members** | Data exposed | Data sensitif terlihat di export | Implementasi masking/logic select column |

---

## 📊 Status Audit File (23 Halaman)

| Status | Count | Files |
|--------|-------|-------|
| ✅ **Audit Lengkap** | 21 | 01-08, 10-23 (2 template kosong) |
| ✅ **Perbaikan Diterapkan** | 3 | Members (soft delete), Simpanan Dashboard, Splash Page |
| ⬜ **Template Pending** | 2 | `05-simpanan-dashboard-audit.md`, `07-jual-beli-dashboard-audit.md` |

---

## 🔧 Perbaikan yang Sudah Dikonfirmasi di Kode

| Item | File | Status |
|------|------|--------|
| Skip link | `src/styles/admin-theme.css` | ✅ Ada |
| Focus-visible | `src/styles/admin-theme.css` | ✅ Ada |
| Touch target 44px | `src/styles/admin-theme.css` | ✅ Ada |
| prefers-reduced-motion | `src/styles/admin-theme.css` | ✅ Ada |
| ARIA labels on inputs | `SimpananListReportTable.jsx` | ✅ Added by this run |
| ARIA labels on inputs | `SimpananJurnalReportTable.jsx` | ✅ Added by this run |
| Table caption | `SimpananListReportTable.jsx` | ✅ Added by this run |
| Table caption | `SimpananJurnalReportTable.jsx` | ✅ Added by this run |

---

## 📝 Catatan Penulis

**Perubahan utama dalam sesi ini:**
1. ✅ Tambahkan ARIA labels pada 15+ filter inputs di halaman Simpanan
2. ✅ Tambahkan caption pada 3 tabel utama (Simpanan, Jurnal, Pinjaman)
3. ✅ Dokumentasi perbaikan dalam file terpisah

**Yang TIDAK dilakukan dalam sesi ini:**
- ❌ Creating CSS variables (design tokens) — perlu time lebih banyak
- ❌ Usability testing dengan user
- ❌ Data masking untuk sensitive info — perlu shared state & logic

**Prioritas berikutnya:**
1. Tambah design token system (warna, spacing, typography)
2. Implementasi data masking (member, account info)
3. Penambahan caption pada dashboard tables
4. Audit regression setelah perubahan implementasi

---

**Disusun:** 20 November 2026  
**Review:** UI/UX Senior Designer  
**Dokumen:** Internal Project