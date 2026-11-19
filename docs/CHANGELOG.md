# Changelog - Admin KKPUS

Dokumen ini mencatat semua perubahan signifikan pada proyek `admin.kkpus.id`.

**Repository:** https://github.com/mohamadfahmyiqbal/admin.kkpus.id  
**Branch Utama:** `rollback/2026-11-02`

---

## [Unreleased]

### Fitur Baru
- *(Tambahkan fitur baru di sini)*

### Perbaikan
- *(Tambahkan bug fix di sini)*

### Perubahan Breaking
- *(Tambahkan breaking changes di sini)*

---

## [2026-11-20] - Effective Date pada Konfigurasi Nominal Simpanan

**Tanggal:** 20 November 2026  
**Branch:** `rollback/2026-11-02`  
**Commit:** `994b6ca`  
**Author:** AI Senior Fullstack Developer  

### Ringkasan

Menambahkan kemampuan untuk menetapkan **tanggal efektif (effective date)** saat mengubah nominal konfigurasi simpanan. Perubahan nominal sekarang hanya berlaku untuk tagihan (bill_items) yang periode `due_date`-nya **sama dengan atau setelah** tanggal efektif yang ditentukan. Tagihan sebelum tanggal efektif tetap menggunakan nominal lama.

### Latar Belakang

Sebelum perubahan ini, saat admin mengubah nominal di **Konfigurasi > Nominal Simpanan**, perubahan langsung berlaku untuk semua tagihan (termasuk yang sudah lewat). Ini menyebabkan inkonsistensi data historis.

**Solusi:** Menambahkan parameter `effective_date` yang dikirim ke backend, sehingga backend dapat memfilter bill_items mana yang harus menggunakan nominal baru.

### File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/konfigurasi/SimpananConfigPage.jsx` | `handleSave()` kini menerima `effectiveDate` |
| `src/utils/api/USavings.js` | 3 method admin dukung param `effectiveFrom` |
| `src/pages/simpanan/SimpananDashboard.jsx` | Update call sites API |
| `src/pages/simpanan/SimpananReportPage.jsx` | Update call sites API |

### Detail Teknis

#### SimpananConfigPage.jsx

```javascript
const handleSave = async (billTypeId, amount, effectiveDate = "") => {
  const newItem = {
    bill_type_id: billTypeId,
    type_name: existingItems.find(i => i.bill_type_id === billTypeId)?.type_name,
    type_code: existingItems.find(i => i.bill_type_id === billTypeId)?.type_code,
    default_amount: amount,
    effective_date: effectiveDate 
      ? new Date(effectiveDate).toISOString().split('T')[0] 
      : undefined,
  };
  await api.put("/simpanan/config", { configs: [newItem] });
};
```

#### USavings.js

| Method | Sebelum | Sesudah |
|--------|---------|---------|
| `getAdminSavingsSummary()` | `()` | `(effectiveFrom)` |
| `getAdminSavingsTransactions()` | `(params)` | `(params, effectiveFrom)` |
| `getAdminSavingsReport()` | `(params)` | `(params, effectiveFrom)` |

### API Contract

#### Request (PUT /simpanan/config)

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

#### Response

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

### Query Parameter Baru

| Endpoint | Parameter | Tipe | Keterangan |
|----------|-----------|------|------------|
| `GET /savings/admin-summary` | `effectiveFrom` | string (date) | Filter bill dengan `due_date >= effectiveFrom` |
| `GET /savings/admin-transactions` | `effectiveFrom` | string (date) | Filter transaksi dengan `due_date >= effectiveFrom` |
| `GET /savings/admin-report` | `effectiveFrom` | string (date) | Filter laporan dengan `due_date >= effectiveFrom` |

### Dampak ke Backend

Backend **harus** mengimplementasikan:

1. **Simpan `effective_date`** di tabel konfigurasi simpanan
2. **Saat generate bill**, gunakan nominal dari konfigurasi yang `effective_date`-nya paling relevan
3. **Saat query admin**, filter berdasarkan `due_date >= effectiveFrom`

**Contoh SQL:**
```sql
SELECT default_amount 
FROM simpanan_configs 
WHERE bill_type_id = ? 
  AND effective_date <= ?
ORDER BY effective_date DESC 
LIMIT 1;
```

### Testing Checklist

#### Frontend
- [x] Build berhasil (semua 4 file ter-compile tanpa error)
- [ ] Input nominal dapat diubah dan disimpan
- [ ] Konfirmasi SweetAlert muncul saat simpan
- [ ] Data reload setelah simpan berhasil

#### Backend (perlu implementasi)
- [ ] Endpoint `PUT /simpanan/config` menerima field `effective_date`
- [ ] Endpoint `GET /savings/admin-summary` mendukung query param `effectiveFrom`
- [ ] Endpoint `GET /savings/admin-transactions` mendukung query param `effectiveFrom`
- [ ] Endpoint `GET /savings/admin-report` mendukung query param `effectiveFrom`
- [ ] Bill generation menggunakan nominal berdasarkan `effective_date`

### Catatan Keamanan (ISO/IEC 27001:2022)

| Kontrol | Implementasi |
|---------|--------------|
| **8.28 (Secure coding)** | Validasi input nominal (harus > 0), sanitasi tanggal efektif |
| **8.15 (Logging)** | Backend harus log setiap perubahan konfigurasi |
| **8.16 (Monitoring)** | Alert jika ada perubahan konfigurasi di luar jam kerja normal |
| **5.17 (Authentication)** | Hanya admin dengan role tertentu yang dapat akses |

### Rollback Plan

```bash
# Opsi 1: Revert commit
git revert HEAD

# Opsi 2: Restore file
git checkout HEAD~1 -- src/pages/konfigurasi/SimpananConfigPage.jsx \
                       src/utils/api/USavings.js \
                       src/pages/simpanan/SimpananDashboard.jsx \
                       src/pages/simpanan/SimpananReportPage.jsx
```

### Status

- [x] Development selesai
- [x] Build verification passed
- [ ] Code review (four-eyes principle)
- [ ] Deploy ke staging
- [ ] UAT (User Acceptance Test)
- [ ] Deploy ke production

---

## Format Penulisan Entry Baru

Gunakan template berikut saat menambahkan perubahan baru:

```markdown
## [YYYY-MM-DD] - Judul Perubahan Singkat

**Tanggal:** DD MMMM YYYY  
**Branch:** `nama-branch`  
**Commit:** `commit-hash`  
**Author:** Nama Developer  

### Ringkasan
Deskripsi singkat 1-2 kalimat.

### File yang Diubah
| File | Perubahan |
|------|-----------|
| `path/to/file` | Deskripsi perubahan |

### Status
- [ ] Development
- [ ] Testing
- [ ] Code Review
- [ ] Deploy Staging
- [ ] Deploy Production
```

---

## Referensi

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [ISO/IEC 27001:2022 Controls](https://www.iso.org/standard/27001)
