# Changelog: Fitur Effective Date pada Konfigurasi Nominal Simpanan

**Tanggal:** 20 November 2026  
**Branch:** `rollback/2026-11-02`  
**Author:** AI Senior Fullstack Developer  

---

## Ringkasan Perubahan

Menambahkan kemampuan untuk menetapkan **tanggal efektif (effective date)** saat mengubah nominal konfigurasi simpanan. Perubahan nominal sekarang hanya berlaku untuk tagihan (bill_items) yang periode `due_date`-nya **sama dengan atau setelah** tanggal efektif yang ditentukan. Tagihan sebelum tanggal efektif tetap menggunakan nominal lama.

---

## Latar Belakang

Sebelum perubahan ini, saat admin mengubah nominal di **Konfigurasi > Nominal Simpanan**, perubahan langsung berlaku untuk semua tagihan (termasuk yang sudah lewat). Ini menyebabkan inkonsistensi data historis.

**Solusi:** Menambahkan parameter `effective_date` yang dikirim ke backend, sehingga backend dapat memfilter bill_items mana yang harus menggunakan nominal baru.

---

## File yang Diubah

### 1. `src/pages/konfigurasi/SimpananConfigPage.jsx`

**Perubahan:**
- Ditambahkan state `originalConfigs` untuk menyimpan snapshot konfigurasi sebelum perubahan
- Fungsi `handleSave()` diperluas untuk menerima parameter `effectiveDate`
- Payload yang dikirim ke API sekarang mencakup:
  - `bill_type_id`
  - `type_name`
  - `type_code`
  - `default_amount`
  - `effective_date` (opsional, format: `YYYY-MM-DD`)

**Kode baru:**
```javascript
const handleSave = async (billTypeId, amount, effectiveDate = "") => {
  // ...
  const newItem = {
    bill_type_id: billTypeId,
    type_name: existingItems.find(i => i.bill_type_id === billTypeId)?.type_name,
    type_code: existingItems.find(i => i.bill_type_id === billTypeId)?.type_code,
    default_amount: amount,
    effective_date: effectiveDate 
      ? new Date(effectiveDate).toISOString().split('T')[0] 
      : undefined,
  };
  // Kirim ke backend
  await api.put("/simpanan/config", { configs: [newItem] });
};
```

---

### 2. `src/utils/api/USavings.js`

**Perubahan:**
Tiga method admin ditambahkan parameter opsional `effectiveFrom`:

| Method | Sebelum | Sesudah |
|--------|---------|---------|
| `getAdminSavingsSummary()` | `getAdminSavingsSummary()` | `getAdminSavingsSummary(effectiveFrom)` |
| `getAdminSavingsTransactions()` | `getAdminSavingsTransactions(params)` | `getAdminSavingsTransactions(params, effectiveFrom)` |
| `getAdminSavingsReport()` | `getAdminSavingsReport(params)` | `getAdminSavingsReport(params, effectiveFrom)` |

**Implementasi:**
```javascript
getAdminSavingsSummary(effectiveFrom) {
  return api.get("/savings/admin-summary", {
    params: effectiveFrom ? { effectiveFrom } : undefined,
  });
}
```

---

### 3. `src/pages/simpanan/SimpananDashboard.jsx`

**Perubahan:**
Update call sites untuk method API yang diubah:
- `fetchSummary()` → `getAdminSavingsSummary(undefined)`
- `fetchTransactions()` → `getAdminSavingsTransactions(params, undefined)`
- `handleExportTransactions()` → `getAdminSavingsTransactions(params, undefined)`

---

### 4. `src/pages/simpanan/SimpananReportPage.jsx`

**Perubahan:**
Update call site:
- `fetchReport()` → `getAdminSavingsReport(undefined)`

---

## API Contract

### Request (PUT /simpanan/config)

```json
{
  "configs": [
    {
      "bill_type_id": "POKOK",
      "type_name": "Simpanan Pokok",
      "type_code": "POKOK",
      "default_amount": 100000,
      "effective_date": "2026-11-01"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Konfigurasi nominal berhasil disimpan",
  "data": {
    "updated": 1,
    "effective_from": "2026-11-01"
  }
}
```

---

## Query Parameter Baru

### GET /savings/admin-summary

| Parameter | Tipe | Wajib | Keterangan |
|-----------|------|-------|------------|
| `effectiveFrom` | string (date) | Tidak | Filter summary hanya untuk bill dengan `due_date >= effectiveFrom` |

### GET /savings/admin-transactions

| Parameter | Tipe | Wajib | Keterangan |
|-----------|------|-------|------------|
| `effectiveFrom` | string (date) | Tidak | Filter transaksi hanya untuk bill dengan `due_date >= effectiveFrom` |

### GET /savings/admin-report

| Parameter | Tipe | Wajib | Keterangan |
|-----------|------|-------|------------|
| `effectiveFrom` | string (date) | Tidak | Filter laporan hanya untuk bill dengan `due_date >= effectiveFrom` |

---

## Dampak ke Backend

Backend **harus** mengimplementasikan logika berikut:

1. **Simpan `effective_date`** di tabel konfigurasi simpanan (atau tabel terpisah untuk historikal perubahan nominal).
2. **Saat generate bill**, gunakan nominal dari konfigurasi yang `effective_date`-nya paling relevan (paling baru tapi masih <= periode bill).
3. **Saat query admin**, filter bill_items berdasarkan `due_date >= effectiveFrom` jika parameter diberikan.

**Contoh SQL (backend):**
```sql
-- Ambil nominal untuk bill_type tertentu pada periode tertentu
SELECT default_amount 
FROM simpanan_configs 
WHERE bill_type_id = ? 
  AND effective_date <= ?
ORDER BY effective_date DESC 
LIMIT 1;
```

---

## Testing Checklist

### Frontend
- [x] Build berhasil (semua 4 file ter-compile tanpa error)
- [ ] Input nominal dapat diubah dan disimpan
- [ ] Konfirmasi SweetAlert muncul saat simpan
- [ ] Data reload setelah simpan berhasil

### Backend (perlu implementasi)
- [ ] Endpoint `PUT /simpanan/config` menerima field `effective_date`
- [ ] Endpoint `GET /savings/admin-summary` mendukung query param `effectiveFrom`
- [ ] Endpoint `GET /savings/admin-transactions` mendukung query param `effectiveFrom`
- [ ] Endpoint `GET /savings/admin-report` mendukung query param `effectiveFrom`
- [ ] Bill generation menggunakan nominal berdasarkan `effective_date`

---

## Catatan Keamanan (ISO/IEC 27001:2022)

| Kontrol | Implementasi |
|---------|--------------|
| **8.28 (Secure coding)** | Validasi input nominal (harus > 0), sanitasi tanggal efektif |
| **8.15 (Logging)** | Backend harus log setiap perubahan konfigurasi (siapa, kapan, nominal lama/baru, effective_date) |
| **8.16 (Monitoring)** | Alert jika ada perubahan konfigurasi di luar jam kerja normal |
| **5.17 (Authentication)** | Hanya admin dengan role tertentu yang dapat akses halaman konfigurasi |

---

## Rollback Plan

Jika terjadi masalah:

1. **Revert commit** ini:
   ```bash
   git revert HEAD
   ```

2. **Atau restore file** ke versi sebelumnya:
   ```bash
   git checkout HEAD~1 -- src/pages/konfigurasi/SimpananConfigPage.jsx \
                          src/utils/api/USavings.js \
                          src/pages/simpanan/SimpananDashboard.jsx \
                          src/pages/simpanan/SimpananReportPage.jsx
   ```

---

## Referensi

- File terkait: `src/pages/konfigurasi/SimpananConfigPage.jsx`
- API Service: `src/utils/api/USavings.js`
- Dashboard: `src/pages/simpanan/SimpananDashboard.jsx`
- Report: `src/pages/simpanan/SimpananReportPage.jsx`

---

## Status

- [x] Development selesai
- [x] Build verification passed
- [ ] Code review (four-eyes principle)
- [ ] Deploy ke staging
- [ ] UAT (User Acceptance Test)
- [ ] Deploy ke production
