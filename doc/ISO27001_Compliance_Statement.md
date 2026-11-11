# ISO/IEC 27001:2022 Compliance Statement

**Berlaku untuk:** KKPUS Ecosystem (admin.kkpus.id, api.kkpus.id, kkpusid)

## 1. Ikhtisar

Dokumen ini menyatakan komitmen Koperasi KKPUS terhadap penerapan Sistem Manajemen Keamanan Informasi (SMKI) yang sesuai dengan standar internasional ISO/IEC 27001:2022.

## 2. Ruang Lingkup

SMKI diterapkan di seluruh ekosistem KKPUS termasuk:
- **admin.kkpus.id** (Portal Admin Backoffice)
- **api.kkpus.id** (REST API Backend)
- **kkpusid** (Portal Anggota PWA)

Sistem ini melindungi:
- Data pribadi anggota (KTP, swafoto, kontak)
- Informasi keuangan & simpanan (saldo, transaksi, rekening)
- Data transaksi & pembayaran (Midtrans Snap, faktur)
- Data profil administrator & hak akses
- Metadata audit & log system

## 3. Kebijakan & Kontrol

### 3.1 Control Lingkungan
- Server & database di-host di lingkungan yang terpercaya & diamankan
- Password untuk akun admin dibuat dengan complexity tinggi; disimpan di env secret
- SSL/TLS diberlakukan (HTTPS) untuk seluruh komunikasi
- Akses fisik & jaringan terbatas untuk personil terpercaya

### 3.2 Perancangan & Implementasi Keamanan
- JWT Bearer Authentication + HttpOnly Cookies
- Sertifikat TLS dienkripsi & dikelola dengan HSM / CA internal
- CORS diset pada origin yang diizinkan (kkpus.id, admin.kkpus.id, lokal dev)
- Security Headers diterapkan via helmet middleware
- Rate limiting & antiflood pada endpoint sensitif
- Sanitasi input & sanitasi DOM (DOMPurify)
- Upload file divalidasi (type, size, checksum)

### 3.3 Manajemen Aset
- Aset informasi (database, config, kode) diklasifikasi:
  - **Kritis**: Database, kunci API, sertifikat SSL
  - **Biasa**: Kode source, log, berkas statis
- Inventarisasi aset & lifecycle manajemen via automated script

### 3.4 Keamanan Sumber Daya Manusia
- Proses rekrutmen & onboarding mencakup pelatihan keamanan dasar
- Hak akses berdasarkan peran minimum (role: Admin, Bendahara, Ketua)
- Pemisahan tugas untuk fungsi kritis (SOP disetujui)
- Pelatihan kesadaran keamanan periodik & pengambilan tes

### 3.5 Keamanan Operasional
- Monitoring log 24/7 (centralized logging)
- Auto-deteksi anomali (attempt login gagal, akses tidak biasa)
- Incidente response plan, verifikasi 2-langkah, dan recovery procedure
- Manajemen patch: pembaruan keamanan bulanan wajib

### 3.6 Keamanan Komunikasi
- HTTPS wajib untuk seluruh endpoint (TLS 1.2+)
- Akses internal dienkripsi (database connection via SSL)
- Email pemberitahuan (notifikasi perubahan status) dikirim melalui Nodemailer terproteksi

### 3.7 Perancangan & Pengelolaan Sistem
- Pengembangan anti-patterns:
  - Kode hardcode credential
  - Fungsi berlebihan / debug di produksi
  - Eksploitasi SQL injection / XSS
- Penerapan prinsip least privilege di seluruh kode

### 3.8 Akses Kontrol
- Kontrol akses berbasis peran (RBAC)
- Manajemen session: access token expire (15 menit), refresh token dengan batasan device
- Otorisasi melalui API Gateway dan `authorization.js` middleware
- Audit log penyimpanan perubahan akses di database (immutable)

### 3.9 Pemulihan Bencana & Manajemen Insiden
- Backup harian diambil ke penyimpanan cloud yang aman
- RTO < 4 jam, RPO < 1 jam
- Dokumentasi prosedur pemulihan: `playbook_recovery.md` (draft)
- Incident management: Slack-like #incidents channel, SRT-001 -> tutup via change management

### 3.10 Pemenuhan Persyaratan Hukum & Kontrak
- Sesuai ketentuan hukum Indonesia: UU ITE, PP 71/2019 tentang Perlindungan Data Pribadi (PDP), dan aturan OJK untuk koperasi syariah
- Persetujuan Proses: otorisasi dan persetujuan bagi proses high-risk
- Data subjek PDP: hak subjek untuk mengakses, memperbaiki, dan menghapus data personal

## 4. Audit & Pemantauan

### 4.1 Audit Internal
- Audit internal dilakukan setiap 6 bulan
- Fokus: weak password, akses kadaluarsa, bypass kontrol
- Hasil audit dimasukkan ke dalam perbaikan tindakan dan verification

### 4.2 Tinjauan Manajemen
- Tinjauan manajemen dilakukan setiap kuartal
- Kinerja SMKI: metrik, KPI, kejadian keamanan
- Pembaruan terus-menerus & tinjauan compliance

### 4.3 Indikator Kinerja Utama (KPI)
- Jumlah kejadian keamanan yang berhasil dikurangi (baseline 0)
- Rata-rata waktu deteksi (MTTD) < 5 menit
- Rata-rata waktu respon (MTTR) < 2 jam
- Rasio kesalahan verifikasi KYC < 0.01%

## 5. Dokumen Terkait
- `doc/SOAP/Doc_SOP_Security_Access_Control.md`
- `doc/SOAP/SOP_Incident_Response_and_Disaster_Recovery.md`
- `doc/SOAP/Doc_SOP_Data_Protection_and_Privacy.md`
- `doc/SOAP/Doc_SOP_Change_Management_and_Release_Management.md`

## 6. Revisi & Pembaruan

Tabel revisi:

| Versi | Tanggal | Penulis | Disetujui Oleh | Perubahan |
|---------|---------|---------|---------------|---------|
| v1.0 | 2026-11-10 | QA Reviewer | Manajemen Eksekutif | Dokumen standar compliance pertama |

## 7. Pernyataan Penyangkalan

Tanda ini tidak dapat menggantikan audit security formal atau sertifikasi eksternal. Rencana menuju ISO/IEC 27001:2022 sertifikasi akan dilakukan pada tahun 2027.

## 8. Kontak & Penanganan

Untuk pertanyaan tentang dokumen ini:
- Keamanan IT: security@kkpus.id
- QA Auditor: qa-auditor@kkpus.id
- Compliance Officer: compliance@kkpus.id