# Product Requirement Document (PRD)
## KKPUS Ecosystem (Member Portal, Admin Backoffice & Core Backend API)
**Aplikasi Web Layanan Keuangan Syariah, Simpanan, Pembiayaan, Jual Beli, Arisan, Investasi, & Operasional Koperasi**

---

### Informasi Dokumen
* **Nama Proyek:** KKPUS Ecosystem (Koperasi Paguyuban Usaha Sukses Syariah)
* **Product Owner & Scrum Master:** Budi Santoso (KKPUS)
* **Lead Fullstack Developer:** Mohamad Fahmy Iqbal
* **Core & Backoffice Fullstack Developer:** Mikhail Daffa Herdiansah
* **Cyber Security & DevSecOps Engineer:** Andi (PT Parvata Sukses Syariah)
* **Status Dokumen:** Approved / Baseline Version 2.0 (Full Alignment with SYSTEM_FLOWCHART.mmd)
* **Tanggal Rilis:** -
* **Standar Kepatuhan:** ISO/IEC 27001:2022 ISMS (Annex A), OWASP ASVS v4.0 Level 2, ISO/IEC 27701 (UU PDP)
* **Infrastruktur Target:** -

---

## 1. Pendahuluan & Latar Belakang

### 1.1 Latar Belakang
Koperasi Paguyuban Usaha Sukses Syariah (KKPUS) menyediakan ekosistem terpadu berbasis syariah untuk anggota dan pengurus. Sistem melayani operasional multi-layanan meliputi:
1. **Simpanan & Tabungan Syariah:** Simpanan Pokok, Simpanan Wajib, Simpanan Sukarela, serta Tabungan terencana berjangka/program target.
2. **Pembiayaan (Financing) & Arisan:** Pembiayaan syariah (Murabahah, Mudharabah, Ijarah, Qardh) dan modul Arisan Syariah (manajemen kelompok/batch, iuran berkala, dan pengundian/draw).
3. **Jual Beli & Transaksi Kasir/POS:** Transaksi jual beli produk koperasi, kuitansi/struk digital, pencatatan hutang/piutang dagang, dan aktiva tetap.
4. **Investasi Halal & Sukuk:** Penawaran instrumen pendanaan syariah, portofolio modal usaha, bagi hasil (nisbah), dan pemesanan unit investasi (*orders*).
5. **Edukasi & Pelatihan (Training):** Konten literasi koperasi syariah, materi training, evaluasi/kuis pemahaman, dan sertifikat digital.
6. **Billing & Multi-Gateway Pembayaran:** Pembayaran tagihan otomatis dan manual melalui integrasi Midtrans (Snap & Disbursement), DOKU/Jokul Checkout, dan Midtrans Iris.

Sistem arsitektur didesain terdistribusi ke dalam 3 subdomain resmi:
* `@kkpusid` — Member Portal (PWA, React + Vite)
* `@admin.kkpus.id` — Admin Backoffice (React + Vite)
* `@api.kkpus.id` — Core Backend API (Express.js + Sequelize ORM + MySQL)

### 1.2 Tujuan Produk
* **Otomasi Layanan Terintegrasi:** Menghubungkan seluruh lini usaha syariah (Simpanan, Tabungan, Pinjaman, Jual Beli, Arisan, Investasi, Training, Billing) dalam 1 siklus data terpadu.
* **Kepatuhan Prinsip Syariah & Regulasi:** Menerapkan akad syariah transparan pada konfigurasi produk (nisbah, bagi hasil, biaya admin wajar tanpa riba).
* **Multi-Gateway Payment & Rekonsiliasi Otomatis:** Membuka kanal pembayaran via Midtrans Snap, DOKU/Jokul, serta disbursement pencairan via Midtrans Iris.
* **Keamanan Finansial Berstandar Enterprise (ISO/IEC 27001:2022):** TLS termination murni, otentikasi JWT dengan role matrix ketat, proteksi brute-force, sanitasi input, audit trail mutasi permanen, dan isolasi hak akses per subdomain.
* **Real-time Event & Notifikasi:** Pengiriman pembaruan status transaksi, undian arisan, dan antrean approval melalui Socket.io serta Web Push Notification (VAPID).

---

## 2. Aktor Sistem & Hak Akses (RBAC)

Merujuk pada node `ACTORS` di `SYSTEM_FLOWCHART.mmd` dan kontrol pemisahan wewenang (*Segregation of Duties* - ISO 27001:2022 Control A.5.15, A.8.2):

| Aktor | Domain / Lingkup Akses | Deskripsi & Batas Wewenang |
| --- | --- | --- |
| **Member / Nasabah (Anggota)** | Member Portal (`@kkpusid`) | Akses Landing Page publik, registrasi/login/lupa sandi, dashboard personal, transaksi simpanan/tabungan, pengajuan pembiayaan, partisipasi arisan, transaksi jual beli, investasi halal, materi training, pembayaran billing/invoice via payment gateway, kelola profil, dan menerima notifikasi web push. |
| **Admin Backoffice (Pengawas)** | Admin Portal (`@admin.kkpus.id`) | Memantau seluruh aktivitas pembukuan, evaluasi audit trail keamanan, review laporan keuangan komprehensif, dan verifikasi kepatuhan syariah (advisory/oversight role). |
| **Admin Backoffice (Ketua)** | Admin Portal (`@admin.kkpus.id`) | Otorisasi pengajuan pembiayaan bernilai besar (*over-limit authorization*), persetujuan rilis produk investasi/sukuk baru, dan pengesahan kebijakan koperasi/laporan RAT. |
| **Admin Backoffice (Bendahara)** | Admin Portal (`@admin.kkpus.id`) | Pengelolaan kas & penarikan simpanan/tabungan, verifikasi manual billing/invoice, persetujuan disbursement (Midtrans Iris), pengundian arisan, dan rekonsiliasi keuangan. |
| **Admin Backoffice (Staff Admin)** | Admin Portal (`@admin.kkpus.id`) | Verifikasi pendaftaran anggota (KYC), entri data simpanan manual, input transaksi jual beli & inventaris aktiva tetap, katalog training/konten, dan operasional harian. |
| **Sistem Otomatis (Cron / Webhook / Socket)** | Backend API (`@api.kkpus.id`) | Pemrosesan background worker (cron jobs tagihan berkala & tabungan jatuh tempo), penanganan webhook callback payment gateway (Midtrans, DOKU, Iris), dan push event real-time via Socket.io. |

---

## 3. Spesifikasi Fungsional: Portal Anggota (`@kkpusid`)

Portal Anggota dibangun berbasis Progressive Web App (PWA) dengan React + Vite, responsif untuk mobile dan desktop:

### 3.1 Navigasi & Autentikasi (`SPLASH`, `LANDING`, `LOGIN`, `PROFILE`)
* **FR-MEM-01 (Splash & PWA Service Worker):** Cek versi aplikasi, instalasi PWA ke homescreen, caching offline static assets via Service Worker.
* **FR-MEM-02 (Landing Page Publik):** Profil KKPUS, kalkulator simulasi pembiayaan/simpanan syariah, katalog produk jual beli publik, dan tautan pendaftaran anggota.
* **FR-MEM-03 (Autentikasi & Registrasi Anggota):** Registrasi online dengan data identitas (NIK, No. HP, Email), upload KTP, login mandiri menggunakan kredensial terenkripsi, alur Lupa Password dengan reset token aman, penyimpanan token JWT di `localStorage`.
* **FR-MEM-04 (Akun / Profil / Logout):** Pengelolaan profil pribadi, ubah sandi, pengaturan preferensi, log aktivitas sesi, dan mekanisme logout aman (penghapusan token dan blacklist JWT).

### 3.2 Dashboard Anggota (`DASH`)
* **FR-MEM-05 (Ringkasan Finansial Real-time):** Menampilkan saldo total simpanan, target tabungan aktif, tagihan pembiayaan jatuh tempo, portofolio investasi, status arisan aktif, dan notifikasi terkini via Socket.io.

### 3.3 Simpanan & Tabungan (`SUB`)
* **FR-MEM-06 (Portofolio Simpanan Syariah):** Rincian saldo dan mutasi Simpanan Pokok, Simpanan Wajib, dan Simpanan Sukarela dengan akad Wadiah/Mudharabah.
* **FR-MEM-07 (Program Tabungan Berjangka):** Pendaftaran program tabungan berencana (misal: Tabungan Qurban, Pendidikan, Umroh), target nominal dan tanggal jatuh tempo, histori setoran, serta permohonan penarikan dana tabungan (*withdrawal request*).

### 3.4 Pembiayaan & Arisan (`LOAN`)
* **FR-MEM-08 (Pengajuan Pinjaman / Pembiayaan Syariah):** Pemilihan produk pembiayaan syariah, pengajuan nominal, tenor, upload berkas persyaratan, simulasi angsuran berbasis margin flat/anuitas syariah, dan penandatanganan akad digital.
* **FR-MEM-09 (Tracking & Riwayat Angsuran):** Jadwal angsuran per bulan, sisa kewajiban pokok/margin, dan status pelunasan.
* **FR-MEM-10 (Partisipasi Arisan Syariah):** Pendaftaran batch arisan syariah, jadwal iuran periode berjalan, tracking riwayat undian, dan siaran langsung status draw arisan via Socket.io.

### 3.5 Jual Beli / Transaksi Kasir (`TRANS`)
* **FR-MEM-11 (Katalog & Pemesanan Barang/Jasa):** Akses katalog barang koperasi, keranjang belanja, checkout transaksi dengan opsi bayar tunai/saldo/kredit toko (piutang anggota), serta penerbitan kuitansi (*receipts*) digital.

### 3.6 Investasi Halal / Sukuk / Pendanaan (`INVEST`)
* **FR-MEM-12 (Katalog Proyek Pendanaan Syariah):** Daftar proyek bisnis/sukuk halal yang dibuka untuk pendanaan, prospektus, proyeksi nisbah bagi hasil, dan durasi investasi.
* **FR-MEM-13 (Portofolio Investasi Anggota):** Pembelian unit investasi (*orders*), pemantauan imbal hasil berkala, pembagian dividen langsung ke saldo simpanan, dan histori sertifikat sukuk.

### 3.7 Training / Materi / Evaluasi (`TRAIN`)
* **FR-MEM-14 (Portal Pembelajaran Koperasi):** Daftar modul pelatihan koperasi dan literasi syariah, akses materi bacaan/video, kuis evaluasi pemahaman, serta penerbitan sertifikat digital kelulusan.

### 3.8 Billing, Invoice, & Pembayaran (`BILL`)
* **FR-MEM-15 (Daftar Tagihan & Invoice):** Tampilan seluruh kewajiban terbit (simpanan wajib bulanan, angsuran pembiayaan, iuran arisan, tagihan transaksi jual beli).
* **FR-MEM-16 (Pembayaran Multi-Channel):** Pembayaran tagihan online terintegrasi langsung dengan Midtrans Snap (Virtual Account, QRIS, e-Wallet, Kartu) dan DOKU/Jokul Checkout.

### 3.9 Notifikasi & Web Push (`NOTIF`)
* **FR-MEM-17 (Pemberitahuan Sistem & Web Push):** Pendaftaran subscription Web Push berbasis standar RFC 8292 (VAPID), notifikasi real-time via Socket.io untuk tagihan baru, approval pinjaman, dan hasil undian arisan.

---

## 4. Spesifikasi Fungsional: Portal Backoffice (`@admin.kkpus.id`)

Backoffice ditujukan bagi internal pengurus koperasi dengan header otentikasi wajib `X-Client-App: admin` dan pembagian otorisasi role (*pengawas*, *ketua*, *bendahara*, *admin*):

### 4.1 Akses & Dashboard Backoffice (`ASPLASH`, `ALOGIN`, `ADASH`)
* **FR-ADM-01 (Splash & Autentikasi Admin):** Login khusus staf dengan validasi role berlapis, proteksi rate-limiting, penguncian akun saat gagal berulang (`account_lockouts`).
* **FR-ADM-02 (Dashboard Eksekutif & Antrean Approval):** Ringkasan metrik harian (total dana simpanan, NPL pembiayaan, kas keluar-masuk, omset jual beli), panel *Approval Queue* lintas modul yang membutuhkan otorisasi pengurus.

### 4.2 Kelola Anggota (`AMEMB`)
* **FR-ADM-03 (Manajemen Keanggotaan & KYC):** Verifikasi data pendaftaran anggota baru, validasi identitas KTP/berkas, assign role anggota, penerbitan nomor anggota, penanganan terminasi keanggotaan (`membership_terminations`), dan pemblokiran akun.

### 4.3 Kelola Simpanan (`ASIM`)
* **FR-ADM-04 (Administrasi Simpanan Pokok, Wajib, Sukarela):** Entri setoran simpanan manual (teller kasir), persetujuan penarikan simpanan sukarela, penyesuaian saldo berotorisasi, dan ekspor buku simpanan.

### 4.4 Kelola Tabungan Program (`ATAB`)
* **FR-ADM-05 (Manajemen Program & Penarikan Tabungan):** Pembuatan produk/program tabungan terencana baru, pemantauan target tabungan anggota, verifikasi & pencairan klaim jatuh tempo tabungan (*withdrawal approval*).

### 4.5 Kelola Jual Beli / POS (`AJB`)
* **FR-ADM-06 (Operasional Toko & Aset):** Manajemen produk dan stok, input kasir POS, pencatatan hutang dagang supplier, pencatatan piutang transaksi anggota, dan pendataan aktiva tetap koperasi (`aktiva-tetap`).

### 4.6 Kelola Pinjaman & Arisan (`APINJ`)
* **FR-ADM-07 (Loan Origination System / LOS Syariah):** Tinjauan berkas permohonan pembiayaan, verifikasi rasio beban bayar, penyesuaian plafon/tenor, komite approval multi-level (Admin -> Bendahara -> Ketua), penerbitan jadwal amortisasi syariah.
* **FR-ADM-08 (Manajemen Kelompok Arisan):** Pembentukan batch arisan baru, penentuan kuota peserta, pencatatan setoran iuran, dan eksekusi pengundian transparan (*Draw Engine*) dengan penyiaran langsung.

### 4.7 Kelola Investasi & Pendanaan Syariah (`AINV`)
* **FR-ADM-09 (Penerbitan & Manajemen Sukuk):** Pembuatan prospektus pendanaan syariah baru, verifikasi pesanan unit investasi (*orders*), distribusi nisbah/bagi hasil berkala, dan penutupan buku proyek.

### 4.8 Konfigurasi Akad & Biaya (`ACONF`)
* **FR-ADM-10 (Parameter Master Koperasi):** Konfigurasi akad syariah (Murabahah, Mudharabah, Musyarakah, Wadiah), suku bunga/margin pembiayaan, denda keterlambatan (dana kebajikan/ta'zir), skema biaya admin pembayaran, dan besaran simpanan pokok/wajib.

### 4.9 Billing & Pembayaran Manual (`ABILL`)
* **FR-ADM-11 (Billing Management & Settlement):** Penerbitan invoice massal bulanan, pencatatan pembayaran tunai/transfer manual teller, verifikasi bukti transfer manual, dan rekonsiliasi data payment gateway.

### 4.10 Laporan & Akuntansi (`AREPORT`)
* **FR-ADM-12 (Reporting Suite Komprehensif):** Pembuatan dan ekspor (Excel/PDF) laporan neraca, laba rugi, mutasi simpanan, performa pembiayaan & kolektibilitas (kolektibilitas 1-5), transaksi jual beli, dan laporan pertanggungjawaban RAT.

### 4.11 Pengaturan Sistem & Keamanan (`ASETT`)
* **FR-ADM-13 (Admin User & Audit Log Viewer):** Pengelolaan akun pengguna pengurus, rotasi hak akses, monitoring log audit keamanan (*audit logs / security events*) yang bersifat permanen.

---

## 5. Spesifikasi Core Backend API (`@api.kkpus.id`)

Backend API dibangun menggunakan Express.js, Sequelize ORM, dan database MySQL pada endpoint `/api/*`:

### 5.1 Gateway & Middleware (`GW`, `MID`)
* **FR-API-01 (API Gateway & Routing):** Base path `/api`, TLS termination, CORS terisolasi khusus domain `@kkpusid` dan `@admin.kkpus.id`, validasi header `X-Client-App`.
* **FR-API-02 (Security Middleware):**
  - Autentikasi JWT: Validasi Bearer Token pada setiap endpoint privat.
  - Role-based Access Control (RBAC): Pembatasan akses route berbasis role pengguna.
  - Rate Limiting: Proteksi DDoS dan brute force pada endpoint sensitif (Auth, Billing).
  - Sanitasi Input & Parameterized Query: Proteksi SQL Injection via Sequelize ORM dan library validator.

### 5.2 Modul Route & Controller Backend
* **FR-API-03 (`AUTH` - Auth Controller):** Endpoint `/api/auth/*` (register, login, logout, refresh-token, forgot-password, OTP verification).
* **FR-API-04 (`SAV` - Savings Routes):** Endpoint `/api/savings/*` (mutasi simpanan pokok/wajib/sukarela, withdrawal request, riwayat saldo).
* **FR-API-05 (`TAB` - Tabungan Routes):** Endpoint `/api/tabungan/*` (program tabungan, target tabungan anggota, bills, withdraw).
* **FR-API-06 (`LOANR` - Pinjaman / Financing Routes):** Endpoint `/api/loans/*` (produk pembiayaan, pengajuan kredit, review/approval, terms & jadwal angsuran).
* **FR-API-07 (`JRB` - Jual Beli Routes):** Endpoint `/api/jualbeli/*` (katalog produk, orders, receipts, manajemen hutang, pencatatan aktiva tetap).
* **FR-API-08 (`INVR` - Investasi Routes):** Endpoint `/api/investasi/*` (prospektus sukuk, pesanan portofolio, bagi hasil dividen).
* **FR-API-09 (`ARSR` - Arisan Routes):** Endpoint `/api/arisan/*` (batch arisan, data peserta, pembayaran iuran, eksekusi draws/undian).
* **FR-API-10 (`BILLR` - Billing & Webhook Routes):** Endpoint `/api/billing/*` (pembuatan invoice, voluntary bills, payment fees) dan `/api/webhooks/*` (callback Midtrans, DOKU, Iris).
* **FR-API-11 (`PUSH` - Push Notification Routes):** Endpoint `/api/notifications/*` (registrasi VAPID push subscription, blast broadcast notification).
* **FR-API-12 (`CONT` - Content & CMS Routes):** Endpoint `/api/content/*` (artikel edukasi syariah, banner promosi landing page, materi training & kuis).
* **FR-API-13 (`DASHR` - Dashboard Aggregation Routes):** Endpoint `/api/dashboard/*` (agregasi metrik untuk member portal dan dashboard admin backoffice).

---

## 6. Spesifikasi Lapisan Database (`DBLAYER`)

Database dikelola menggunakan MySQL dengan pemetaan model Sequelize:

| Entitas Model / Tabel | Deskripsi & Fungsi Penyimpanan |
| --- | --- |
| `members`, `user_roles`, `member_role_assignment` | Data profil anggota, kredensial login, master role (pengawas, ketua, bendahara, admin, member), relasi peran pengguna. |
| `savings`, `transactions`, `withdrawals` | Rekening simpanan (pokok, wajib, sukarela), buku besar mutasi debet/kredit, antrean penarikan dana simpanan. |
| `tabungan programs`, `targets`, `bills` | Master program tabungan berjangka, target nominal anggota, jadwal tagihan setoran tabungan. |
| `financing`, `loan products`, `applications`, `terms` | Master produk pinjaman syariah, aplikasi pengajuan kredit, persetujuan komite, jadwal angsuran amortisasi. |
| `jualbeli`, `transactions`, `receipts`, `hutang`, `aktiva-tetap` | Data penjualan barang kasir POS, nomor kuitansi, hutang dagang supplier, inventaris aset tetap koperasi. |
| `arisan batches`, `participants`, `payments`, `draws` | Master kelompok arisan syariah, daftar anggota per batch, kartu pembayaran iuran, riwayat pemenang undian periode. |
| `investasi`, `pendanaan syariah`, `portofolio`, `orders` | Katalog sukuk/pendanaan bisnis syariah, portofolio kepemilikan unit investor, riwayat transaksi pesanan dan bagi hasil. |
| `billing`, `invoices`, `voluntary bills`, `payment fees` | Tagihan terbit, invoice pembayaran, tagihan sukarela mandiri, konfigurasi biaya transaksi gateway. |
| `membership_terminations`, `account_lockouts` | Catatan pemberhentian/pengunduran diri anggota, log penguncian akun akibat kegagalan otentikasi brute force. |
| `audit logs`, `security events` | Log keamanan *append-only* (WORM): mencatat user_id, aksi, IP address, user-agent, timestamp, status keberhasilan untuk keperluan audit ISO 27001. |

---

## 7. Integrasi Real-Time & Eksternal (`EXTERNAL`)

Merujuk pada subgraph `EXTERNAL` di `SYSTEM_FLOWCHART.mmd`:

```
[Member & Admin Frontend] ──HTTPS/WSS──> [API Gateway @api.kkpus.id]
                                                 │
          ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
          ▼                      ▼                               ▼                      ▼
  [Socket.io Engine]    [Midtrans Snap & Iris]           [DOKU / Jokul]         [Web Push / Email]
   (Real-time Events)     - Snap: Payment VA/QRIS        - Checkout Webhook      - VAPID Push Service
                          - Iris: Auto Disbursement                              - SMTP Gateway
```

| Subsistem Eksternal | Protokol & Mekanisme | Peran & Alur Fungsional |
| --- | --- | --- |
| **Socket.io (`SOCKET`)** | WebSocket / WSS (`@api.kkpus.id`) | Mengirimkan push event real-time ke Dashboard Member (`DASH`) dan Admin (`ADASH`): update status tagihan, notifikasi persetujuan pinjaman, dan siaran undian arisan. |
| **Midtrans Snap (`MIDTRANS`)** | REST API & Webhook HTTP POST | Penerbitan payment gateway (Virtual Account, QRIS, GoPay, Kartu) untuk pembayaran invoice tagihan. Webhook mengirim status settlement ke controller `BILLR`. |
| **DOKU / Jokul (`DOKU`)** | REST API & Webhook Notification | Kanal alternatif pembayaran checkout tagihan. Webhook callback diterima dan diverifikasi signature-nya oleh `BILLR`. |
| **Midtrans Iris (`IRIS`)** | REST API Payout & Webhook | Otomasi disbursement / transfer pencairan dana pembiayaan, penarikan simpanan sukarela, dan pencairan bagi hasil langsung ke rekening bank anggota. |
| **Push Notification Service (`PUSHSV`)** | Web Push RFC 8292 (VAPID) | Mengirimkan notifikasi langsung ke browser perangkat anggota tanpa mengharuskan aplikasi aktif di layar depan. |
| **Email / SMS Gateway (`EMAIL`)** | SMTP / REST API Gateway | Pengiriman email transaksional: kode OTP verifikasi pendaftaran, link reset kata sandi, kuitansi digital, dan Surat Peringatan (SP) keterlambatan angsuran. |
| **SSL/TLS Certificates (`CERT`)** | X.509 (`kkpus_id.crt`, `.key`) | Terminasi TLS enkripsi in-transit (HTTPS/WSS) pada domain level API Gateway. |

---

## 8. Matriks Otorisasi Persetujuan Kredit & Keuangan (Syariah Governance)

Untuk menegakkan *Segregation of Duties* dan mitigasi risiko fraud:

| Jenis Transaksi Keuangan | Verifikator 1 (Admin Staff) | Reviewer 2 (Bendahara) | Otorisasi Akhir (Ketua Koperasi) |
| --- | :---: | :---: | :---: |
| **Penarikan Simpanan Sukarela ≤ Rp5.000.000** | Verifikasi Saldo & Identitas | Approval & Eksekusi Iris | - |
| **Penarikan Simpanan Sukarela > Rp5.000.000** | Verifikasi Saldo & Identitas | Review Kas Treasury | **Wajib Approval Token / Dual Control** |
| **Pembiayaan Syariah ≤ Rp10.000.000** | Verifikasi Berkas & Agunan | Approval Plafon & Margin | Notifikasi Tembusan |
| **Pembiayaan Syariah > Rp10.000.000** | Verifikasi Kelayakan Berkas | Review Risiko & Kas | **Wajib Approval Komite Ketua** |
| **Eksekusi Undian Arisan (Draw)** | Verifikasi Status Iuran Batch | Supervisi Pengundian | **Pengesahan Pemenang** |
| **Pencairan Proyek Investasi Sukuk** | Rekapitulasi Order Unit | Verifikasi Rekening Penampung | **Dual Authorization Rilis Dana** |

---

## 9. Persyaratan Non-Fungsional (NFR) & ISO/IEC 27001:2022

### 9.1 Kinerja & Ketersediaan
* **Response Time:** API standard endpoint ≤ 250 ms (95th percentile); query agregasi laporan keuangan ≤ 1,5 detik.
* **Ketersediaan (Availability):** Target uptime layanan minimal 99,5% pada hari dan jam operasional.
* **Concurrency:** Mendukung koneksi konkuren pada jam sibuk tanpa degradasi performa pada socket real-time.

### 9.2 Keamanan Informasi (ISO/IEC 27001:2022 ISMS & OWASP ASVS)
* **Kontrol Kriptografi (Control A.8.24):** Seluruh data sensitif (NIK, nomor rekening, nominal gaji) dienkripsi *at-rest* menggunakan AES-256. Komunikasi data wajib menggunakan HTTPS (TLS 1.3) berdasar sertifikat valid `kkpus_id.crt`.
* **Pengelolaan Hak Akses (Control A.5.15, A.8.2, A.8.3):** Menerapkan prinsip *Least Privilege*. Pemisahan ketat antara konteks login anggota di `@kkpusid` dan login staf backoffice di `@admin.kkpus.id`.
* **Logging & Monitoring (Control A.8.15):** Tabel `audit logs` dan `security events` mencatat setiap aksi kritis (login gagal, mutasi kas, approval pinjaman, perubahan konfigurasi biaya) dengan format timestamp ISO-8601, IP address, user ID, dan status aksi. Log bersifat *immutable/write-once*.
* **Perlindungan Terhadap Serangan Aplikasi Web:** Validasi ketat terhadap OWASP Top 10: perlindungan Injection via query berparameter Sequelize, proteksi XSS via sanitasi HTML DOMPurify, proteksi CSRF, aktivasi Helmet security headers, dan CORS whitelist ketat.

### 9.3 Backup & Disaster Recovery (Control A.8.13)
* **Pencadangan Database:** Otomasi backup harian terjadwal (dump MySQL) setiap dini hari dengan penyimpanan terenkripsi offsite (retensi 30 hari).
* **RTO & RPO:** Recovery Time Objective (RTO) ≤ 4 jam; Recovery Point Objective (RPO) ≤ 24 jam.

---

## 10. Alokasi Milestone & Rencana Rilis (Roadmap)

```
Fase 1: Penyelarasan Dokumen & Arsitektur (PRD v2.0 & SYSTEM_FLOWCHART.mmd) ──> SELESAI
Fase 2: Core Auth, Member & Role Matrix (@api.kkpus.id & MySQL DBLAYER)
Fase 3: Modul Simpanan (Pokok/Wajib/Sukarela) & Tabungan Berjangka
Fase 4: Modul Pembiayaan Syariah (LOS) & Arisan Syariah (Draw Engine)
Fase 5: Modul Jual Beli / POS Kasir & Aktiva Tetap
Fase 6: Modul Investasi Halal / Sukuk & Pelatihan (Training/CMS)
Fase 7: Integrasi Multi-Payment Gateway (Midtrans Snap, DOKU) & Payout (Midtrans Iris)
Fase 8: Integrasi Real-Time Socket.io & Web Push Notification (VAPID)
Fase 9: Dashboard Eksekutif, Akuntansi & Laporan RAT
Fase 10: Pengujian Keamanan (Vulnerability Assessment), UAT Komprehensif & Rilis Produksi
```

---

## 11. Kriteria Penerimaan Proyek (Acceptance Criteria & Sign-Off)

1. **Kesesuaian Arsitektur Penuh:** Seluruh komponen, modul, subdomain (`@kkpusid`, `@admin.kkpus.id`, `@api.kkpus.id`), serta lapisan database pada `SYSTEM_FLOWCHART.mmd` terimplementasi dan berfungsi tanpa deviasi alur.
2. **Kepatuhan Keamanan Lolos:** Lolos pengujian kerentanan (*Penetration Testing*) dengan zero issue kategori *Critical* dan *High*, serta diverifikasi memenuhi kontrol ISO/IEC 27001:2022.
3. **Audit Trail Berfungsi:** Seluruh mutasi finansial, aksi approval pengurus, dan transaksi pembayaran terbukti tercatat permanen di tabel audit log.
4. **Verifikasi Transaksi Payment Gateway & Real-time:** Sukses memproses webhook Midtrans/DOKU, eksekusi payout via Iris, serta transmisi event real-time Socket.io dan Push Notification.
5. **UAT Formal Disetujui:** Dokumen Berita Acara UAT disetujui dan ditandatangani resmi oleh **Budi Santoso** selaku Product Owner mewakili KKPUS.
6. **Serah Terima Aset Lengkap:** Penyerahan source code lengkap (Frontend Member, Admin Backoffice, Backend API), skrip migrasi database, dokumentasi OpenAPI/Swagger, serta petunjuk operasional admin (*Admin Guide*).
