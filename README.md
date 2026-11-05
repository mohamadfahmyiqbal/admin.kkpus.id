# Panduan Pengembang: Admin Portal (admin.kkpus.id)

## Ikhtisar
Aplikasi berbasis React + Vite untuk backoffice/administrator Koperasi Paguyuban Usaha Sukses.

## Menjalankan Proyek
```bash
# Menjalankan development server
npm run dev

# Menjalankan build produksi
npm run build

# Menjalankan unit tests
npm test
```

## Standar & Konvensi Kode
1. **Frontend**: React functional components, hooks, React Bootstrap untuk komponen antarmuka.
2. **Keamanan**:
   - Selalu gunakan `sanitizeString()` untuk data input/tampilan pengguna yang rentan XSS.
   - Jangan simpan data sensitif atau secret langsung di kode frontend.
3. **API Integration**: Gunakan instance `api` dari `src/utils/api/common.js`.
