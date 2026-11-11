# KKPUS Ecosystem Documentation Repository

Repository terpusat untuk seluruh dokumentasi arsitektur, spesifikasi teknis, alur proses bisnis, verifikasi pengujian, dan pedoman operasional ekosistem **KKPUS** (Koperasi Paguyuban Usaha Sukses Syariah).

---

## 📁 Daftar Isi Dokumen

### 1. Dokumen Arsitektur & Master
- **`KKPUS_ECOSYSTEM_MASTER_DOCUMENT.md`**: Dokumen induk sistem yang mencakup Executive Summary, PRD, Arsitektur, ERD, Spesifikasi Resource Server, Matriks Kepatuhan ISO 27001 & OWASP ASVS, dan Action Items.
- **`SYSTEM_FLOWCHART.mmd`**: Diagram flowchart alur operasional dan transaksi sistem dalam format Mermaid.
- **`business_flow.md`**: Dokumentasi detail alur proses bisnis (registrasi, simpanan, pembiayaan, investasi, dan audit).
- **`erd.md`**: Diagram relasi entitas basis data (Entity-Relationship Diagram) sistem KKPUS.
- **`Dokumentasi_Master_KKUI_Loan_Services_Portal.pdf`**: Arsip master dokumentasi modul portal layanan pinjaman/pembiayaan.

### 2. Product Requirements Document (PRD) & Penawaran
- **`PRD_KKPUS_Loan_Services_Portal.md`**: PRD spesifik modul pembiayaan syariah (Murabahah, Ijarah, Qardh, Musyarakah).
- **`Matrix_Quotation_Modul_Simpanan_Pinjaman_BackOffice_Cost_Separation_Final.pptx`**: Presentasi rincian biaya, pemisahan modul backoffice, simpanan, dan pinjaman.

### 3. Infrastruktur & Operasional
- **`SERVER_RESOURCE_SPECIFICATION.md`**: Spesifikasi kebutuhan perangkat keras/server, Nginx reverse proxy, Redis cache, database clustering, dan estimasi scaling.

### 4. Laporan Progres & Checklist Verifikasi
- **`PROGRESS_REPORT_2026-11-08.md`**: Laporan status pengerjaan milestone dan pencapaian fase.
- **`checklist_VERIFICATION_AUTH_MEMBERS_2026-11-08.md`**: Verifikasi autentikasi, JWT, RBAC, dan lifecycle anggota.
- **`checklist_VERIFICATION_MARGIN_ANNUITY_STOCK_SYNC_2026-11-08.md`**: Verifikasi perhitungan marjin anuitas dan sinkronisasi stok perdagangan.
- **`checklist_VERIFICATION_SAVINGS_DEDUPLICATION_2026-11-08.md`**: Verifikasi mitigasi duplikasi transaksi dan race condition simpanan.
- **`checklist_VERIFICATION_RAT_FORMAT_2026-11-09.md`**: Verifikasi format laporan Rapat Anggota Tahunan (RAT).

---

## 🚀 Panduan Penggunaan & Kontribusi

1. **Format Diagram**: Gunakan Markdown viewer yang mendukung sintaks Mermaid v10+ untuk melihat visualisasi diagram.
2. **Pembaruan Dokumen**: Setiap ada perubahan skema database atau endpoint API, wajib memperbarui `erd.md` dan `KKPUS_ECOSYSTEM_MASTER_DOCUMENT.md`.
3. **Standar Keamanan**: Semua dokumen mengacu pada standar OWASP ASVS v4.0 Level 2 dan ISO/IEC 27001:2022 Annex A.
