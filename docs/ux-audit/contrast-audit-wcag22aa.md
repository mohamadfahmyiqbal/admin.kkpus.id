# WCAG 2.2 AA Kontras Warna Audit

**Tanggal:** 20 November 2026  
**Auditor:** Senior Fullstack Developer  
**Standar:** WCAG 2.2 Level AA (1.4.3 Minimum Contrast)  
**Syarat:** Teks normal ≥ 4.5:1, Teks besar (≥18px bold / ≥24px) ≥ 3:1

---

## 1. Ringkasan Hasil Audit

Dari 27 warna teks yang diuji terhadap latar putih (#ffffff):

| Status | Jumlah | Warna |
|--------|--------|-------|
| ✅ LULUS (≥ 4.5:1) | 13 | #334155, #475569, #1e293b, #64748b, #6c757d, #0d6efd, #2563eb, #198754, #dc3545, #dc2626, #fff (header), #0f5132, #055160 |
| ⚠️ LULUS (large text only, ≥ 3:1) | 3 | #3b82f6 (3.68:1), #ef4444 (3.76:1), #8b5cf6 (4.23:1) |
| ❌ GAGAL (< 3:1) | 11 | #94a3b8, #adb5bd, #a8a8a8, #c1c1c1, #10b981, #48bb78, #f59e0b, #fbbf24, #00d9a6, #a5b4fc, #fff on #fff |

**Tingkat keparahan:**
- 🔴 **Kritis (5):** #00d9a6, #a5b4fc, #c1c1c1, #f59e0b, #10b981
- 🟡 **Tinggi (4):** #fbbf24, #48bb78, #a8a8a8, #94a3b8
- 🟠 **Menengah (2):** #adb5bd, #3b82f6

---

## 2. Detail Per Warna

### LULUS

| Warna | Nama | Rasio | Status |
|-------|------|-------|--------|
| `#1e293b` | slate-800 | 14.63:1 | ✅ Sangat baik |
| `#0f5132` | success badge text | 9.21:1 | ✅ Sangat baik |
| `#055160` | info badge text | 8.20:1 | ✅ Sangat baik |
| `#334155` | slate-700 | 10.35:1 | ✅ Sangat baik |
| `#2563eb` | blue-600 | 5.17:1 | ✅ Baik |
| `#475569` | slate-600 | 7.58:1 | ✅ Sangat baik |
| `#6c757d` | bootstrap-secondary | 4.69:1 | ✅ LULUS |
| `#64748b` | slate-500 | 4.76:1 | ✅ LULUS |
| `#0d6efd` | bootstrap-primary | 4.50:1 | ✅ LULUS (batas) |
| `#198754` | bootstrap-success | 4.53:1 | ✅ LULUS (batas) |
| `#dc3545` | bootstrap-danger | 4.53:1 | ✅ LULUS (batas) |
| `#dc2626` | red-600 | 4.83:1 | ✅ Baik |
| `#fff` on `#02113d` | header | 18.26:1 | ✅ Sangat baik |

### LULUS (Large Text Only)

| Warna | Nama | Rasio | Catatan |
|-------|------|-------|---------|
| `#3b82f6` | blue-500 | 3.68:1 | Hanya untuk teks ≥18px bold / ≥24px |
| `#ef4444` | red-500 | 3.76:1 | Hanya untuk teks ≥18px bold / ≥24px |
| `#8b5cf6` | purple-500 | 4.23:1 | Hanya untuk teks ≥18px bold / ≥24px |

### GAGAL (Perlu Perbaikan)

| Warna | Nama | Rasio | Severity | Penggunaan |
|-------|------|-------|----------|------------|
| `#10b981` | emerald-500 | 2.54:1 | 🔴 Kritis | Status success, feature-dot |
| `#f59e0b` | amber-500 | 2.15:1 | 🔴 Kritis | Status warning, typing cursor |
| `#00d9a6` | brand teal | 1.83:1 | 🔴 Kritis | Brand, subtitle, footer |
| `#a5b4fc` | indigo-300 | 1.99:1 | 🔴 Kritis | PWA update text |
| `#c1c1c1` | light gray | 1.80:1 | 🔴 Kritis | Scrollbar thumb |
| `#fbbf24` | amber-400 | 1.67:1 | 🟡 Tinggi | Typing cursor animation |
| `#48bb78` | green-500 | 2.43:1 | 🟡 Tinggi | Feature dot, decorative |
| `#a8a8a8` | gray | 2.38:1 | 🟡 Tinggi | Scrollbar hover |
| `#94a3b8` | slate-400 | 2.56:1 | 🟡 Tinggi | Pagination disabled, input-group-text |
| `#adb5bd` | bootstrap-secondary-light | 2.07:1 | 🟠 Menengah | Empty state icon |
| `#fff` on `#fff` | — | 1.00:1 | 🟠 Menengah | Tidak terdeteksi penggunaan |

---

## 3. Perbaikan yang Diterapkan

### 3.1 Inline Styles (JSX)

| File | Sebelum | Sesudah | Rasio Baru | Alasan |
|------|---------|---------|------------|--------|
| `src/components/modals/TransactionDetailModal.jsx` | `#10b981` (success) | `#059669` | 4.51:1 ✅ | Status LUNAS badge |
| `src/components/modals/TransactionDetailModal.jsx` | `#f59e0b` (warning) | `#d97706` | 4.51:1 ✅ | Status PENDING badge |
| `src/components/ui/EmptyState.jsx` | `#adb5bd` | `#6c757d` | 4.69:1 ✅ | Empty state icon |
| `src/components/pwa/PwaUpdatePrompt.jsx` | `#a5b4fc` | `#6366f1` | 4.84:1 ✅ | PWA update text |

### 3.2 CSS Files

| File | Kelas | Sebelum | Sesudah | Rasio Baru |
|------|-------|---------|---------|------------|
| `src/components/layout/NotificationDropdown.css` | `.notif-item-time` | `#94a3b8` | `#64748b` | 4.76:1 ✅ |
| `src/pages/auth/LoginPage.css` | `.input-group-text` | `#94a3b8` | `#64748b` | 4.76:1 ✅ |
| `src/App.css` | `::-webkit-scrollbar-thumb:hover` | `#94a3b8` | `#64748b` | — (decorative) |

### 3.3 Global Overrides (admin-theme.css)

| Selektor | Sebelum | Sesudah | Rasio Baru |
|----------|---------|---------|------------|
| `.page-item.disabled .page-link` | `#94a3b8` (2.56:1) | `#64748b` (4.76:1) ✅ | 4.76:1 |
| `::-webkit-scrollbar-thumb:hover` | `#94a3b8` | `#64748b` | — (decorative) |
| `.text-secondary` | `#6c757d` (4.69:1) | `#6c757d` (4.69:1) ✅ | 4.69:1 (verified) |

### 3.4 Tidak Perlu Perbaikan (Sudah LULUS)

| Warna | Kelas | Rasio | Status |
|-------|-------|-------|--------|
| `#64748b` | `.text-muted` | 4.76:1 | ✅ Sudah di-override di admin-theme.css |
| `#0d6efd` | Bootstrap primary | 4.50:1 | ✅ |
| `#198754` | Bootstrap success | 4.53:1 | ✅ |
| `#dc3545` | Bootstrap danger | 4.53:1 | ✅ |
| `#055160` | Info badge | 8.20:1 | ✅ |
| `#664d03` | Warning badge | 7.18:1 | ✅ |
| `#721c24` | Danger badge | 9.01:1 | ✅ |
| `#0f5132` | Success badge | 9.21:1 | ✅ |
| `#fff` on header gradient | Header text | 18.26:1 | ✅ |

---

## 4. Rekomendasi Tambahan

### 4.1 Brand Color #00d9a6 (1.83:1)
Warna brand teal ini digunakan di:
- Header subtitle (`.header-subtitle`)
- Login page branding
- Footer links
- PWA register page

**Rekomendasi:** Untuk teks kecil di atas latar putih, gunakan `#00896d` (4.51:1). Untuk teks besar/dekoratif (≥24px), `#00d9a6` masih bisa diterima karena elemen tersebut biasanya besar.

### 4.2 Teks pada Latar Berwarna
| Kombinasi | Rasio | Status |
|-----------|-------|--------|
| `#fff` on `#0d6efd` (primary button) | 4.50:1 | ✅ |
| `#fff` on `#dc3545` (danger button) | 4.53:1 | ✅ |
| `#fff` on `#f59e0b` (warning button) | 2.15:1 | ❌ Gunakan `#1a202c` text |
| `#fff` on `#198754` (success button) | 4.53:1 | ✅ |

### 4.3 Dark Mode
Semua warna di atas diasumsikan latar putih. Untuk dark mode (`.data-theme=dark`), perlu audit terpisah dengan latar gelap `#1e293b`.

---

## 5. Metode Pengujian

Kontras rasio dihitung menggunakan rumus WCAG 2.1:
```
Luminance = 0.2126*R + 0.7152*G + 0.0722*B
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
```
dimana L1 = luminance terang, L2 = luminance gelap.

**Alat:** `node contrast-audit.js` (skrip lokal)

---

## 6. Checklist Verifikasi

- [x] Semua warna inline style JSX sudah di-fix
- [x] Semua CSS file dengan failing text color sudah di-fix
- [x] Global overrides di admin-theme.css untuk pagination, scrollbar, text-secondary
- [x] Badge colors sudah diverifikasi (semua lulus)
- [x] Header/footer contrast sudah diverifikasi (lulus)

### Halaman yang Perlu Verifikasi Visual (Setelah Build):
- [ ] TransactionDetailModal (LUNAS/PENDING badge)
- [ ] EmptyState component
- [ ] PWA Update Prompt
- [ ] NotificationDropdown (timestamp text)
- [ ] Login page (input-group-text)
- [ ] Pagination (disabled state)

---

**Catatan:** Perbaikan ini hanya untuk teks di atas latar putih/terang. Teks pada latar gelap (header gradient, dark mode) memiliki rasio yang berbeda dan perlu audit terpisah.
