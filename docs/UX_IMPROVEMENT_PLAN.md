# UX IMPROVEMENT PLAN — Prioritas Kritis

**Tanggal:** 20 November 2026  
**Referensi:** `docs/ux-audit/99-REKAPITULASI.md`  
**Status:** In Progress

---

## 7 Item Kritis yang Harus Diperbaiki

### 1. ✅ Hapus `purgeCacheAndCookies` otomatis di Splash
**File:** `src/pages/auth/SplashPage.jsx`  
**Status:** TODO  
**Impact:** Privasi pengguna

### 2. ✅ Tambahkan tombol "Kembali" di Login
**File:** `src/pages/auth/LoginPage.jsx`  
**Status:** TODO  
**Impact:** Kontrol pengguna

### 3. ✅ Touch target ≥ 44×44 px
**Files:** Multiple (Login eye button, Dashboard action buttons)  
**Status:** TODO  
**Impact:** WCAG 2.5.5 accessibility

### 4. ✅ Skip link di layout utama
**File:** `src/components/layout/LayoutGlobal.jsx`  
**Status:** TODO  
**Impact:** WCAG 2.4.1 keyboard navigation

### 5. ✅ Focus-visible indicator
**Files:** Global CSS + components  
**Status:** TODO  
**Impact:** WCAG 2.4.7 keyboard accessibility

### 6. ✅ prefers-reduced-motion
**Files:** CSS + framer-motion animations  
**Status:** TODO  
**Impact:** WCAG 2.3.3 accessibility

### 7. ✅ ARIA labels untuk ikon
**Files:** Multiple (Phosphor icons, SVG)  
**Status:** TODO  
**Impact:** Screen reader access

---

## Implementation Plan

### Phase 1: Splash Page (Privacy)
- [ ] Hapus purgeCacheAndCookies otomatis
- [ ] Kurangi delay redirect (3000ms → 1500ms)
- [ ] Tambahkan pause button untuk animasi

### Phase 2: Login Page (Control + Accessibility)
- [ ] Tambah tombol "Kembali ke Beranda"
- [ ] Perbesar eye button (44×44 px)
- [ ] Tambah prefers-reduced-motion

### Phase 3: Dashboard (Accessibility)
- [ ] Perbesar action buttons
- [ ] Tambah aria-label ke semua ikon
- [ ] Tambah skip link
- [ ] Tambah focus-visible styles

### Phase 4: Global CSS (System-wide)
- [ ] Tambah prefers-reduced-motion media query
- [ ] Tambah focus-visible global styles
- [ ] Tambah skip link styles

---

## Timeline

- **Day 1:** Splash Page + Login Page
- **Day 2:** Dashboard + Layout
- **Day 3:** Global CSS + testing
- **Day 4:** Regression testing
- **Day 5:** Documentation

---

**Dimulai:** 20 November 2026  
**Target Selesai:** 25 November 2026
