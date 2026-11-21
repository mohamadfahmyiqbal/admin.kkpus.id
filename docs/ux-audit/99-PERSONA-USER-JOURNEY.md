# Persona & User Journey — Admin KKPUS (Backoffice Koperasi)

**Tanggal:** 21 November 2026  
**Auditor:** Senior UI/UX Designer + Senior Fullstack Developer  
**Standar Referensi:** WCAG 2.2 AA, Nielsen's 10 Heuristics, Double Diamond  
**Lokasi File:** `docs/ux-audit/99-PERSONA-USER-JOURNEY.md`  
**Sistem:** Admin Kkpus — Backoffice Koperasi Paguyuban Usaha Sukses Syariah (`admin.kkpus.id`)  
**URL:** `https://admin.kkpus.id` (frontend) → `https://api.kkpus.id/api` (backend)

---

## 1. Latar Belakang

Aplikasi backoffice koperasi syariah yang digunakan oleh pengurus dan pengawas untuk mengelola anggota, simpanan, pinjaman, jual beli, arisan, tabungan, investasi, dan pendanaan syariah. Akses terbatas untuk 3 role berdasarkan `LoginPage.jsx`:

- **Pengawas** — verifikasi dan persetujuan tahap pertama
- **Ketua** — verifikasi dan persetujuan tahap kedua
- **Bendahara** — verifikasi dan persetujuan tahap ketiga, plus pengelolaan anggota dan transaksi

Dokumen ini menyusun **persona** dan **user journey** sebagai dasar untuk usability test, definisi metrik sukses, dan handoff desain (Prioritas 3 #1 dan #2).

---

## 2. Persona Pengguna

### Persona 1 — Ahmad, Pengawas Koperasi (42 tahun)

| Aspek | Detail |
|-------|--------|
| **Peran** | Pengawas (pengawas) |
| **Pekerjaan** | Pengawas internasional koperasi, petugas lapangan |
| **Tujuan utama** | Memverifikasi transaksi dan keanggotaan sebelum disetujui ketua; memastikan tidak ada kecurangan atau kesalahan administrasi |
| **Tanggung jawab di sistem** | Meninjau antrian persetujuan (approval queue), menyetujui atau menolak anggota baru, pinjaman, dan transaksi pada tahap pengawas |
| **Motivasi** | Keakuratan data, kepatuhan syariah, kepastian hukum transaksi koperasi |
| **Pain points** | Antrian persetujuan menumpuk (7 tab kategori di dashboard), tidak ada shortcut keyboard, tidak ada informasi riwayat approver sebelumnya, tidak ada notifikasi saat ada tugas baru |
| **Perilaku** | Buka dashboard → lihat antrian persetujuan → pilih salah satu kategori → review detail → approve/reject → kembali ke antrian |
| **Literasi teknologi** | Sedang (mampu operasi komputer dan browser, tidak familiar dengan shortcut advanced) |
| **Perangkat yang dipakai** | Desktop/laptop (Windows), browser Chrome/Edge, kadang tablet |
| **Kebutuhan aksesibilitas** | Fokus-visible yang jelas, kontras teks ≥ 4.5:1, label terprogram pada semua input filter |
| **Quote** | "Saya perlu yakin setiap transaksi yang saya setujui sudah benar dan aman bagi anggota." |

---

### Persona 2 — Siti, Ketua Koperasi (38 tahun)

| Aspek | Detail |
|-------|--------|
| **Peran** | Ketua (ketua) |
| **Pekerjaan** | Pengurus harian koperasi, pengambil keputusan operasional |
| **Tujuan utama** | Memantau kinerja koperasi secara menyeluruh, menyetujui transaksi pada tahap kedua, mengambil kebijakan berdasarkan laporan |
| **Tanggung jawab di sistem** | Melihat statistik dashboard, menyetujui transaksi tahap ketua, meninjau laporan (simpanan, pinjaman, jual beli, arisan, tabungan, investasi, pendanaan syariah) |
| **Motivasi** = Pertumbuhan koperasi, kepuasan anggota, keberlanjutan usaha |
| **Pain points** | Cognitive overload (7 tab + 6 kartu di dashboard), informasi terlalu banyak sekaligus, tidak ada ringkasan eksekutif cepat, tidak ada export laporan yang difilter per kolom |
| **Perilaku** | Buka dashboard → lihat statistik ringkasan → cek antrian persetujuan → lihat laporan harian → ke halaman detail jika diperlukan |
| **Literasi teknologi** | Tinggi (mampu analisis data, export Excel, navigasi multi-halaman) |
| **Perangkat yang dipakai** | Desktop/laptop, browser Chrome, kadang ponsel untuk cek notifikasi |
| **Kebutuhan aksesibilitas** | Responsif pada tablet, label filter yang jelas, touch target ≥ 44×44 px |
| **Quote** | "Saya ingin melihat gambaran besar koperasi dalam satu layar, tanpa harus buka banyak halaman." |

---

### Persona 3 — Budi, Bendahara Koperasi (45 tahun)

| Aspek | Detail |
|-------|--------|
| **Peran** | Bendahara (bendahara) |
| **Pekerjaan** | Pengelola keuangan koperasi, pencatat transaksi harian |
| **Tujuan utama** | Mencatat dan mengelola semua transaksi keuangan, menyetujui tahap terakhir, mengelola data anggota (daftar, nonaktifkan, ganti role) |
| **Tanggung jawab di sistem** | Manajemen anggota (registrasi review, termination review, edit role), transaksi tabungan/simpanan, approval tahap bendahara, laporan keuangan |
| **Motivasi** | Keakuratan pencatatan keuangan, kelancaran operasional harian, data anggota yang terpercaya |
| **Pain points** | Input data anggota berulang, tidak ada tombol batal/kembali yang konsisten, error API diam-dang ditangani, export mencakup data sensitif anggota tanpa masking |
| **Perilaku** | Buka halaman anggota → kelola pendaftaran/nonaktif → buka tabungan → catat transaksi → approve transaksi bendahara → export laporan |
| **Literasi teknologi** | Sedang (mampu input data besar, export Excel, bentuk form yang kompleks) |
| **Perangkat yang dipakai** | Desktop/laptop, browser Chrome/Edge |
| **Kebutuhan aksesibilitas** | Label terprogram pada semua form input, touch target ≥ 44×44 px, konfirmasi sebelum hapus/nonaktifkan anggota |
| **Quote** | "Data anggota dan transaksi harus akurat. Satu kesalahan input berarti laporan keuangan salah." |

---

## 3. Jobs-to-be-done (JTBD)

| # | JTBD | Pengawas | Ketua | Bendahara |
|---|------|----------|-------|-----------|
| 1 | Masuk ke sistem dengan aman | ✅ | ✅ | ✅ |
| 2 | Melihat ringkasan kinerja koperasi | — | ✅ | — |
| 3 | Meninjau dan menyetujui anggota baru | ✅ | — | — |
| 4 | Menyetujui pinjaman anggota | ✅ | ✅ | ✅ |
| 5 | Mencatat transaksi tabungan/simpanan | — | — | ✅ |
| 6 | Mengelola data anggota (daftar, nonaktif, role) | — | — | ✅ |
| 7 | Melihat laporan keuangan dan operasional | — | ✅ | ✅ |
| 8 | Mengekspor laporan untuk audit | — | ✅ | ✅ |

---

## 4. User Journey

### Journey A — Login → Dashboard (semua persona)

**Tujuan:** Masuk ke sistem dan melihat halaman utama setelah autentikasi.

| Tahap | Aksi Pengguna | Tanggapan Sistem | Titik Sentuh (Halaman) | Emosi | Peluang Perbaikan |
|-------|---------------|------------------|------------------------|-------|-------------------|
| 1 | Buka browser, kunjungi `admin.kkpus.id` | Halaman splash ditampilkan (redirect otomatis) | `01-auth-splash-page-audit.md` | Netral | Kurangi durasi redirect, tambah tombol Jeda/Lanjut |
| 2 | Lihat halaman login | Form login (email/HP + password) ditampilkan | `02-auth-login-page-audit.md` | Netral | Tambah tombol "Kembali", pastikan tombol "Lihat password" ≥ 44×44 px |
| 3 | Masuk kredensial, klik Masuk | API set `HttpOnly auth_token` cookie, simpan `userData` ke localStorage, redirect ke dashboard | `LoginPage.jsx`, `accountLogin.js` | Senang jika sukses | Berikan indikasi proses loading, error message yang jelas dalam bahasa Indonesia |
| 4 | Dashboard dimuat | Statistik, antrian persetujuan, notifikasi ditampilkan | `03-dashboard-page-audit.md` | Senang | Kurangi cognitive overload (7 tab → 4 tab), tambah skip link dan focus-visible |
| 5 | Pilih tugas pertama | Navigasi ke halaman terkait via sidebar | SidebarNav, Topbar | Fokus | Pastikan label navigasi jelas, ikon dengan aria-label |

**Pain point utama Journey A:** Tidak ada tombol batal/kembali dari halaman login; auto-redirect splash terlalu cepat (3000 ms, sekarang 1500 ms).

---

### Journey B — Persetujuan Anggota Baru (Pengawas → Ketua → Bendahara)

**Tujuan:** Menyelesaikan proses pendaftaran anggota baru melalui 3 tahap persetujuan.

| Tahap | Aksi Pengguna | Tanggapan Sistem | Titik Sentuh | Emosi | Peluang Perbaikan |
|-------|---------------|------------------|--------------|-------|-------------------|
| 1 | Pengawas buka antrian persetujuan anggota | Daftar anggota menunggu verifikasi | `04-members-page-audit.md`, Dashboard ApprovalQueue | Netral | Tambah label pada semua filter input |
| 2 | Pengawas review detail anggota, klik Setujui | Modal detail ditampilkan, data disimpan sementara | `RegistrationReviewModal.jsx` | Fokus | Konfirmasi sebelum setujui, tombol Batal yang jelas |
| 3 | Ketua menerima notifikasi, review dan setujui | Status berubah ke tahap ketua | Dashboard, `RegistrationReviewModal.jsx` | Netral | Notifikasi real-time via socket, indikasi status approval |
| 4 | Bendahara setujui tahap terakhir | Anggota resmi aktif, data disimpan ke DB | `RegistrationReviewModal.jsx` | Senang | Konfirmasi akhir, notifikasi sukses via toast (SweetAlert2) |
| 5 | Sistem kirim notifikasi ke anggota (opsional) | Email/sms notifikasi (di luar cakupan sistem ini) | — | — | Dokumentasikan alur notifikasi luar sistem |

**Pain point utama Journey B:** 9 modal approval (lazy-loaded), `history.back()` tidak reliabel, copy-paste error pada `aria-label` input.

---

### Journey C — Persetujuan Pinjaman (Pengawas → Ketua → Bendahara)

**Tujuan:** Menyelesaikan proses ajuan pinjaman melalui 3 tahap persetujuan.

| Tahap | Aksi Pengguna | Tanggapan Sistem | Titik Sentuh | Emosi | Peluang Perbaikan |
|-------|---------------|------------------|--------------|-------|-------------------|
| 1 | Anggota (via bendahara) input pinjaman | Form input pinjaman ditampilkan | `PinjamanInputModal.jsx` | Fokus | `aria-label` copy-paste error pada 3 input perlu diperbaiki |
| 2 | Pengawas review pinjaman, setujui/tolak | Antrian pinjaman ditampilkan | `PinjamanList.jsx`, `PinjamanReport.jsx` | Netral | Tambah pagination, tabel tanpa ARIA caption |
| 3 | Ketua review dan setujui | Status pinjaman berubah | `PinjamanReport.jsx` | Netral | Kurangi 6 tab sekaligus (Hick's Law violation) |
| 4 | Bendahara setujui akhir, dana dicairkan | Transaksi dicatat | `PinjamanReport.jsx` | Senang | Konfirmasi sebelum cairkan dana, export laporan pinjaman |
| 5 | Sistem catat riwayat approval | Log approval tersimpan | Backend API | Netral | Audit trail dengan waktu, identitas, correlation id (ISO 27001 A.8.15) |

**Pain point utama Journey C:** 6 tab sekaligus, list report 13 kolom `text-nowrap`, 2 library icon mixed (phosphor + Bootstrap Icons), tidak ada pagination.

---

### Journey D — Transaksi Tabungan (Bendahara)

**Tujuan:** Mencatat dan mengelola transaksi tabungan anggota.

| Tahap | Aksi Pengguna | Tanggapan Sistem | Titik Sentuh | Emosi | Peluang Perbaikan |
|-------|---------------|------------------|--------------|-------|-------------------|
| 1 | Bendahara buka halaman tabungan | Daftar program tabungan ditampilkan | `17-tabungan-page-audit.md` | Netral | Tombol aksi 32×32 px perlu diperbesar ≥ 44×44 px |
| 2 | Pilih anggota, input nominal setoran | Form input transaksi ditampilkan | `TabunganTransactionsTab.jsx` | Fokus | Label terprogram pada semua input filter |
| 3 | Simpan transaksi | Saldo anggota diperbarui, toast sukses | `TabunganPage.jsx` | Senang | Ganti `alert()` native → SweetAlert2 |
| 4 | Lihat laporan tabungan | Tabel laporan dengan filter per kolom | `18-tabungan-report-audit.md` | Netral | Tabel lacks `<caption>`, `scope`, `aria-label` |
| 5 | Export laporan | File Excel diunduh | Backend API | Senang | Masking data anggota pada export (ISO 27001 A.8.10) |

**Pain point utama Journey D:** Action button 32×32 px (terlalu kecil), filter without label/ARIA, export expose member data.

---

## 5. Peta Titik Sentuh ke Halaman yang Di-audit

| User Journey | Halaman yang Terlibat | File Audit | Skor |
|--------------|----------------------|------------|------|
| Login → Dashboard | Splash, Login, Dashboard | `01-auth-splash-page-audit.md`, `02-auth-login-page-audit.md`, `03-dashboard-page-audit.md` | 14/80, 28/80, 27/80 |
| Persetujuan Anggota | Members, Dashboard, Modal | `04-members-page-audit.md`, `03-dashboard-page-audit.md` | 27/80, 27/80 |
| Persetujuan Pinjaman | Pinjaman List, Pinjaman Report, Modal | `12-pinjaman-list-page-audit.md`, `13-pinjaman-report-page-audit.md`, `14-pinjaman-input-modal-audit.md` | 29/80, 23/80, 32/80 |
| Transaksi Tabungan | Tabungan, Tabungan Report | `17-tabungan-page-audit.md`, `18-tabungan-report-page-audit.md` | 18/80, 15/80 |

---

## 6. Rekomendasi Berdasarkan Persona & Journey

| # | Rekomendasi | Prioritas | Persona Terkait |
|---|-------------|-----------|-----------------|
| 1 | Kurangi cognitive overload dashboard (7 tab → 4 tab, 6 kartu disatukan) | Tinggi | Ketua |
| 2 | Tambah shortcut keyboard dan quick filter | Menengah | Pengawas, Ketua |
| 3 | Tambah tombol batal/kembali yang konsisten di semua modal | Tinggi | Semua |
| 4 | Konfirmasi sebelum approve/reject dan nonaktifkan anggota | Tinggi | Bendahara, Pengawas |
| 5 | Ganti semua `alert()` native → SweetAlert2 toast | Tinggi | Bendahara |
| 6 | Masking data sensitif pada export (NIK, telepon, email) | Tinggi | Bendahara |
| 7 | Notifikasi real-time saat ada tugas approval baru | Tinggi | Pengawas, Ketua |
| 8 | Uji usabilitas dengan minimal 5 pengguna per persona | Tinggi | Semua |

---

## 7. Referensi ke Dokumen Audit

- `docs/ux-audit/01-auth-splash-page-audit.md` — Splash page
- `docs/ux-audit/02-auth-login-page-audit.md` — Login page
- `docs/ux-audit/03-dashboard-page-audit.md` — Dashboard
- `docs/ux-audit/04-members-page-audit.md` — Members (Anggota)
- `docs/ux-audit/12-pinjaman-list-page-audit.md` — Pinjaman List
- `docs/ux-audit/13-pinjaman-report-page-audit.md` — Pinjaman Report
- `docs/ux-audit/14-pinjaman-input-modal-audit.md` — Pinjaman Input Modal
- `docs/ux-audit/17-tabungan-page-audit.md` — Tabungan List
- `docs/ux-audit/18-tabungan-report-page-audit.md` — Tabungan Report
- `docs/ux-audit/99-REKAPITULASI.md` — Rekapitulasi audit

---

**Disusun oleh:** Senior UI/UX Designer + Senior Fullstack Developer  
**Tanggal:** 21 November 2026  
**Status:** Draft untuk usability test (Prioritas 3 #3)
