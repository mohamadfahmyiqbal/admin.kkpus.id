# UI / UX Specification

**Project:** KKPUS Platform  
**Design owner:** Development Team  
**Supported viewports / platforms:** Web (Admin Portal `admin.kkpus.id` + Public Website `kkpusid`), PWA  
**Last reviewed:** 2026-11-22

## 1. Experience principles

- **Approval-first, anggota-aware:** Setiap layar yang memicu proses sensitif (registrasi, pembiayaan, penarikan) harus menampilkan status approval berjenjang (3 tahap: Pengawas → Ketua → Bendahara) secara eksplisit — anggota selalu tahu di tahap mana pengajuannya berada.
- **Real-time feedback:** Perubahan status (approval, pembayaran, registrasi) dikirim via Socket.IO dan langsung tercermin di UI tanpa reload (`APPROVAL_UPDATE`, `REGISTRATION_UPDATED`, `TRANSACTION_UPDATED`).
- **Progressive disclosure:** Form panjang (registrasi 8-step) dipecah per langkah dengan progress bar + auto-save draft (`localStorage.temp_reg_data`); detail teknis (jurnal, ledger) disembunyikan di tab laporan.
- **Mobile-first content, desktop shell:** Shell aplikasi hybrid — sidebar horizontal di desktop (≥768px), drawer vertikal 240px di mobile. Konten (tabel, kartu statistik) stack vertikal di layar kecil.
- **Perlindungan data sebagai default:** Data sensitif (NIK/HP/email/foto KTP) ter-mask di UI sesuai peran (`ProtectedImage`, `ProtectedFileLink`); unduhan dokumen hanya via `/api/files/*`.
- **Accessibility baseline:** WCAG 2.2 AA — navigasi keyboard penuh, focus-visible jelas, skip-link, touch target ≥44px, kontras teks ≥4.5:1, `prefers-reduced-motion` dihormati, elemen semantik + ARIA bila perlu.
- **Responsive policy:** Breakpoint mengikuti Bootstrap 5 grid — xs 0, sm 576, md 768, lg 992, xl 1200, xxl 1400. Shell desktop↔mobile berubah di 768px (`DESKTOP_WIDTH`/`BREAKPOINTS.DESKTOP`). Tabel → pagination + filter di semua ukuran; kolom sekunder disembunyikan di xs.

## 2. Design system

### 2.1 Token warna per repo (konsisten internal, berbeda antar repo — disepakati)

| Token | Admin Portal | Public Website | Usage | Accessibility requirement |
| --- | --- | --- | --- | --- |
| Brand primary | `#00896d` (hijau), hover `#006b54`, light `#e6f7f2` | `#2563eb` (biru 600), skala 50–900 | Tombol utama, link, aksen aktif | Kontras ≥4.5:1 pada teks putih di atasnya |
| Header gradient | `#02113d → #031b5a → #05246f`, aksen `#00d9a6` | biru gelap senada | Topbar kedua repo | Teks putih, kontras ≥4.5:1 |
| Success | `#16a34a` | `#16a34a` | Status LUNAS/APPROVED | + ikon, tidak hanya warna |
| Warning | `#d97706` | `#d97706` | PENDING/OVERDUE | + teks status |
| Danger | `#dc2626` | `#dc2626` | REJECTED/ditolak | + teks status |
| Info | `#0ea5e9` | `#0ea5e9` | PENDING_VERIFICATION | + teks status |
| Neutral | text `#1e293b`, bg `#f8fafc`, surface `#fff`, border `#e2e8f0` | slate setara | Teks & permukaan | Kontras teks ≥4.5:1 |

> Catatan: perbedaan brand (admin hijau vs public biru) adalah keputusan sadar per audiens (pengurus vs anggota). Dark mode tersedia di admin (`theme-dark.css`, toggle `Sun/Moon` di Topbar); public saat ini hardcoded light (`ThemeContext`) — toggle belum aktif (follow-up).

### 2.2 Komponen inti

| Token / component | Definition | Usage | Accessibility requirement |
| --- | --- | --- | --- |
| `Button` (public: wrapper react-bootstrap + varian `premium`/`form`; admin: react-bootstrap) | Varian primary/secondary/danger, state loading + spinner | Semua aksi | Nama aksesibel; loading diumumkan via `aria-live` |
| `Card` / `DashboardStats` | Kartu statistik & konten (varian premium gradient/stat) | Dashboard, ringkasan | Heading hierarkis; angka + label |
| `DataTable` / `TransactionTable` (admin) | Tabel + pagination + filter + sort + action buttons (react-bootstrap `Table`) | Semua list admin | Caption/`aria-label`, sort via keyboard, sticky header |
| `StatusBadge` | Mapping status→warna semantik (PENDING/APPROVED/REJECTED/LUNAS/OVERDUE) | Semua daftar transaksi | Tidak hanya warna — selalu + teks status |
| `Pagination` | Kontrol halaman standar | Semua list | Navigasi keyboard, `aria-current` |
| Modal approval per domain (Header/Body/Footer + hook, mis. `useJualBeliApproval`) | Modal review + approve/reject dengan catatan | Approval (F-03) | Focus trap, `Esc` menutup, konfirmasi reject wajib alasan |
| `GenericImportModal` | Upload Excel + preview + hasil import (success/failure table) | Import per modul (F-15) | Drag-drop + input file keyboard, pesan error per baris |
| `FilterField` | Field filter reusable (search/select) | Header list | Label eksplisit, bukan placeholder-only |
| `EmptyState` | Ilustrasi + CTA saat data kosong | Semua list | Teks aksi jelas |
| `ProtectedImage` / `ProtectedFileLink` | Render/mask data sensitif sesuai peran | NIK, KTP, bukti transfer | Alt teks deskriptif tanpa membocorkan PII |
| `AdvancedSkeleton` / `DashboardSkeleton` | Placeholder loading | Semua fetch data | `aria-busy`, shimmer dihormati `reduced-motion` |
| `GlobalSearch` | Pencarian lintas entitas | Topbar | Hasil diumumkan via live region |
| `WebcamCaptureField` | Capture KTP/swafoto (react-webcam) | Registrasi | Fallback upload file bila kamera tidak tersedia |
| `OfflineIndicator` / `PwaUpdatePrompt` | Status offline & prompt update SW | Shell PWA | Teks jelas, dismissible |
| `NotificationDropdown` | Bell icon + daftar notifikasi real-time | Topbar kedua repo | Unread count diumumkan; mark-as-read per item |

## 3. Navigation and role access

### 3.1 Pola routing (kedua repo)

- **Token-based routing:** Tidak ada URL path manusiawi. Navigasi = `jwtEncode({ page: "<key>" })` → `navigate("/<token>")`; `EncryptedPage` men-decode token dan me-render komponen dari `PAGE_COMPONENTS[pageKey]`. Setiap menu/modal memakai **key halaman logis** (tabel di §4).
- **Proteksi:** `isProtected: true` → dibungkus `LayoutGlobal` + cek auth (`localStorage.userData`); public menambah intercept `active_termination` → paksa ke `termination_progress`.
- **Deep-link & bookmark:** Karena token berisi konteks, bookmark lama tetap valid selama secret token tidak berubah; rotasi secret = invalidasi semua bookmark (operasional).

### 3.2 Matriks peran × layar

| Role | Entry points | Allowed screens | Restricted screens |
| --- | --- | --- | --- |
| Calon Anggota (role 1) | `globalSplash`, `authLogin`, `accountRegisterPage`, `registrationPage` | Registrasi (8-step), status pengajuan (`detailPendaftaranAnggota`), `landingPage`, artikel | Semua menu transaksi/program/investasi **disabled** sampai jadi anggota penuh |
| Anggota Reguler (role 5) | `dashboard`, menu sidebar lengkap | Semua layar anggota: simpanan, jual beli, program (pinjaman/arisan), tabungan, investasi, training, billing, notifikasi | Halaman admin (approval, kelola anggota) — server menolak (403) |
| Anggota Luar Biasa (role 6) | `dashboard`, menu terbatas | Dashboard, simpanan, tabungan, training, billing | Modul **Transaksi/Program/Investasi disembunyikan** (client) + ditolak server; **tidak dapat** diberi peran pengurus |
| Pengawas (role 2) | `dashboard` + sidebar admin | Semua layar admin + approval **tahap 1** | Tidak bisa approve tahap 2/3; tidak bisa approve pengajuan sendiri |
| Ketua (role 3) | `dashboard` + sidebar admin | Semua layar admin + approval **tahap 2** | Sama seperti di atas untuk tahap 1/3 |
| Bendahara (role 4) | `dashboard` + sidebar admin | Semua layar admin + approval **tahap 3 (final)**, verifikasi pembayaran, input modal, konfigurasi | Sama seperti di atas untuk tahap 1/2 |

### 3.3 Struktur menu

- **Admin (`SidebarNav.jsx`):** Dashboard · Anggota · Simpanan (+ Laporan) · Jual Beli (+ Laporan) · Program (Pinjaman Lunak, Arisan) · Tabungan · Investasi (Halal, Pendanaan) · Edukasi · Laporan · Konfigurasi (Akad, Simpanan, Biaya Admin) · Pengaturan. Desktop: horizontal (top:64px, height:48px); mobile: drawer 240px.
- **Public (`Sidebar.jsx`):** Dashboard · Simpanan · Jual Beli · Riwayat · Program · Tabungan · Investasi · Training — difilter per `status_id` (1 & 6 sesuai matriks §3.2). Landing & artikel dapat diakses guest.

## 4. Screen specifications

> **Route/key** = key `PAGE_COMPONENTS` (token routing). **Roles** mengacu §3.2.

### SCR-001 — Splash & Login (`globalSplash`, `authLogin`)

**Purpose:** Autentikasi pengguna masuk ke aplikasi.  
**Roles:** Public (guest)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Splash | Logo KKPUS, loading awal app shell | Loading (skeleton) → redirect | `prefers-reduced-motion` |
| Form login | Email/HP + password | Loading (spinner), Error (`INVALID_CREDENTIALS`, `ACCOUNT_LOCKED` + sisa waktu, `RATE_LIMITED`) | Label eksplisit, `aria-describedby` error, toggle lihat password |
| Lupa password | Link ke alur OTP (SCR-003) | — | Tautan keyboard |

**Primary action:** Submit kredensial → JWT + cookie `auth_token` → `dashboard`.  
**Secondary:** Daftar akun (`accountRegisterPage`).  
**Responsive:** Form stack penuh di xs; kartu terpusat di ≥md.

---

### SCR-002 — Registrasi Anggota 8-Step (`accountRegisterPage` → `registrationPage` → `registrationFormDetail` → `registrationSummary`)

**Purpose:** Calon anggota mengisi pendaftaran bertahap dan mengajukan.  
**Roles:** Calon Anggota

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Progress bar | 8 langkah: Data Pribadi, Akun & Kontak, Foto KTP, Swafoto, Pekerjaan, Kontak Darurat, Rekening Bank, Ringkasan | Langkah aktif/terlewati ditandai jelas | `aria-current="step"` |
| Form per langkah | Field sesuai langkah; validasi per-step (`registrationFormHelpers.js`) | Error per field, tidak bisa lanjut bila invalid | Error inline + fokus ke field pertama yang invalid |
| Capture KTP/swafoto | `WebcamCaptureField` + upload | Kamera tidak tersedia → fallback upload | Alt teks, pratinjau sebelum simpan |
| Auto-save draft | `localStorage.temp_reg_data` setiap perubahan | Indikator "draft tersimpan" | Data draft tidak mengandung password |
| Ringkasan & submit | Review semua data → submit | Loading, sukses → status PENDING + halaman status | Konfirmasi sebelum submit |

**Primary action:** Submit → `member_registrations` PENDING + approval flow dibuat → notifikasi.  
**Secondary:** Kembali ke langkah sebelumnya (data tidak hilang).  
**Responsive:** Wizard satu kolom di xs; ringkasan dua kolom di ≥lg.

---

### SCR-003 — Lupa Password OTP (`authForgotPassword` → `authForgotOtp` → `authResetPassword`)

**Purpose:** Reset password via OTP 3 langkah.  
**Roles:** Public

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Step 1 identifier | Email/HP terdaftar → kirim OTP | Loading, `RATE_LIMITED`, `NOT_FOUND` | Label + validasi format |
| Step 2 OTP | 6 digit, hitung mundur kedaluwarsa 10 menit, max 3x verifikasi | `OTP_INVALID` (sisa percobaan), `OTP_EXPIRED` (410) → minta OTP baru | Input numeric, auto-advance |
| Step 3 password baru | Password + konfirmasi | Validasi kompleksitas (min 8, upper, lower, angka) | Show/hide password, indikator kekuatan |

**Primary action:** Password direset → redirect login.  
**Responsive:** Satu kolom, kartu terpusat.

---

### SCR-004 — Landing Page Publik (`landingPage`)

**Purpose:** Memperkenalkan koperasi ke publik & mengarahkan pendaftaran.  
**Roles:** Public (guest)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Header + Hero | Navigasi publik + CTA "Daftar" | — | Navigasi keyboard, skip-link |
| Sections (lazy) | Services, Stats (real-time dari DB), About, How It Works, Articles, CTA | Loading skeleton per section; fallback bila data kosong | Heading hierarkis (satu `h1`) |
| Footer | Kontak, link Privacy Policy & Terms | — | Tautan jelas |

**Primary action:** Daftar → SCR-002.  
**Secondary:** Baca artikel (SCR-005), hubungi via form kontak.  
**Responsive:** Section stack vertikal di xs; grid di ≥md.

---

### SCR-005 — Artikel & Form Kontak (`articleDetail`, `contact_forms` via landing)

**Purpose:** Menampilkan artikel PUBLISHED & menerima pesan kontak.  
**Roles:** Public

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Artikel | Judul, konten (di-sanitize DOMPurify), tanggal | Loading, tidak ditemukan (404 state) | Sanitasi XSS; heading |
| Form kontak | Nama, email, pesan | Validasi server, sukses (toast) | Label, error inline |

**Primary action:** Kirim pesan → `contact_forms` tersimpan.

---

### SCR-006 — Dashboard Pengurus (`dashboard` — admin)

**Purpose:** Ringkasan operasional + antrean approval.  
**Roles:** Pengawas/Ketua/Bendahara

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| 6 kartu statistik | Anggota, Simpanan, Jual Beli, Program, Tabungan, Investasi (real-time, cocok DB) | Loading skeleton, angka 0-ok | Angka + label, bukan warna saja |
| Approval queue | Tab per kategori (keanggotaan, simpanan, jual beli, program, tabungan, investasi) | Loading, empty state per tab | Tab keyboard (`role=tablist`) |
| Item approval | Klik → modal approval (SCR-010) | — | Modal focus trap |

**Primary action:** Review item antrean → SCR-010.  
**Secondary:** Navigasi ke modul terkait.  
**Responsive:** Kartu 2 kolom (sm) → 3 kolom (lg); queue full-width.

---

### SCR-007 — Dashboard Anggota (`dashboard` — public)

**Purpose:** Ringkasan saldo, tagihan, status pengajuan milik sendiri.  
**Roles:** Anggota (5/6); Calon Anggota melihat status registrasi

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Ringkasan saldo & tagihan | Total simpanan, tagihan pending, status pengajuan | Loading, kosong (anggota baru) | — |
| Status pengajuan | Timeline approval 3 tahap (PENDING tahap N) | Real-time update via socket | Status + teks, bukan warna saja |
| Shortcut | Bayar tagihan, ajukan penarikan/pembiayaan | — | — |

**Primary action:** Lanjut ke layar transaksi terkait.  
**Responsive:** Kartu stack di xs.

---

### SCR-008 — Manajemen Anggota (`membersPage`)

**Purpose:** Pengurus mengelola data anggota.  
**Roles:** Pengurus

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Tabel anggota | `TransactionTable`: nama, NIK (masked), status, aksi | Loading, empty, error | Sort keyboard, pagination, sticky header |
| Filter & search | `FilterField` (nama/NIK/email, status aktif/arsip) | — | Label eksplisit |
| Aksi baris | Detail, arsip/restore (re-auth password), assign role | Konfirmasi SweetAlert2 | Password wajib untuk destruktif |

**Primary action:** Detail anggota (SCR-009).  
**Secondary:** Import Excel (SCR-023), batch archive.  
**Responsive:** Kolom sekunder disembunyikan di xs; aksi jadi ikon.

---

### SCR-009 — Detail Anggota & Assign Role (`MemberDetailModal`, `EditRoleModal`)

**Purpose:** Lihat detail lengkap + tetapkan peran pengurus.  
**Roles:** Pengurus

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Identitas | Data diri, KTP/selfie via `ProtectedImage` (masking sesuai peran) | Loading | PII ter-mask; unduh via `/api/files/*` |
| Tabungan & transaksi | Ringkasan saldo, riwayat | Kosong → empty state | — |
| Assign role | Pilih peran (hanya jika tipe Reguler) | `MEMBER_TYPE_INVALID` untuk ALB, `ROLE_ASSIGNED` bila sudah ada | Konfirmasi + audit log |

**Primary action:** Simpan role → `member_role_assignments` + audit.  
**Responsive:** Modal full-screen di xs.

---

### SCR-010 — Antrean Approval & Modal Approval (`ApprovalPlaceholder` → modal domain)

**Purpose:** Pengurus meninjau & memutuskan (approve/reject) pengajuan pada step-nya.  
**Roles:** Sesuai step (Pengawas 1 / Ketua 2 / Bendahara 3)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Header | Jenis entitas, pemohon, nominal, tanggal | — | — |
| Body | Detail domain (mis. jualbeli: harga pokok/jual, DP, angsuran; withdrawal: saldo, alasan) + dokumen (protected) | Loading | Data sensitif ter-mask |
| Keputusan | Approve (note opsional) / Reject (alasan wajib) | Loading saat submit | Focus trap; reject buta ditolak |
| Hasil | Sukses → step berikutnya / final (`performFinalAction`), atau REJECTED | Toast + real-time ke pemohon | Pesan status jelas |

**Errors:** `INVALID_ROLE` (403), `SELF_APPROVAL` (403), `DUPLICATE_APPROVAL` (409), `ALREADY_FINALIZED` (409).  
**Primary action:** Selesai → antrean ter-refresh.  
**Responsive:** Modal melebar (centered) di ≥md, full-screen di xs.

---

### SCR-011 — Simpanan Pengurus (`simpananDashboard`, `simpananReportPage`)

**Purpose:** Pantau simpanan semua anggota + laporan (list/jurnal).  
**Roles:** Pengurus

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Kartu ringkasan | Total simpanan pokok/wajib/sukarela | Loading | — |
| Tabel anggota & saldo | `TransactionTable` + filter | Loading, empty | Sort/pagination |
| Detail anggota | Modal `MemberSavingsDetailModal`: mutasi, withdraw pending | — | Masking |
| Laporan | Tab List Report / Jurnal (debit/kredit), filter periode | Loading, empty | Ekspor Excel (SCR-023) |

**Primary action:** Verifikasi/verifikasi pembayaran terkait via SCR-013.  
**Responsive:** Tab stack di xs.

---

### SCR-012 — Simpanan Anggota & Penarikan (`simpananPage`, `simpananDetailSaldo`, `penarikanSimpananPage`)

**Purpose:** Anggota melihat saldo & mengajukan penarikan sukarela.  
**Roles:** Anggota

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Kartu saldo | Pokok/wajib/sukarela + total | Loading | — |
| Riwayat mutasi | `savings_transactions` per produk | Empty state | — |
| Form penarikan | Nominal + alasan | Validasi saldo (`INSUFFICIENT_BALANCE`), pending ganda (`PENDING_WITHDRAWAL_EXISTS`) | Nominal diformat (ribuan) |
| Status pengajuan | Timeline approval 3 tahap | Real-time | — |

**Primary action:** Ajukan → approval flow → notifikasi.  
**Responsive:** Satu kolom di xs.

---

### SCR-013 — Billing & Invoice (`billingPage` — tabs, `invoicePage`, `receiptPage`)

**Purpose:** Lihat tagihan, bayar manual (transfer + bukti), lihat status verifikasi.  
**Roles:** Anggota (bayar); Bendahara (verifikasi via SCR-010/modal pembayaran)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Ringkasan | Total tagihan, jatuh tempo terdekat, status | Loading | — |
| Tab Pending Bills | Daftar tagihan + tombol bayar | Empty ("tidak ada tagihan") | — |
| Tab Payment History | Riwayat + status verifikasi (PENDING_VERIFICATION/LUNAS/REJECTED) | Loading | Status + teks |
| Upload bukti | Transfer ke rekening koperasi + upload (JPG/PNG/PDF ≤5MB, magic byte) | `FILE_INVALID`, `AMOUNT_MISMATCH` | Format & ukuran dijelaskan sebelum upload |
| Invoice/receipt | Detail tagihan + rincian biaya admin | — | Cetak (print stylesheet) |

**Primary action:** Upload bukti → `PENDING_VERIFICATION` → verifikasi Bendahara → LUNAS.  
**Catatan:** **Tidak ada** elemen Midtrans/DOKU di layar pembayaran final (DEC-005 — hapus sandbox; lihat risiko di §6).  
**Responsive:** Tab horizontal scroll di xs.

---

### SCR-014 — Jual Beli / Murabahah (`jualBeliDashboard` + report / `jualBeliPage`, `formPengajuanTransaksi`, `pelunasanPage`)

**Purpose:** Pengajuan & pelunasan pembiayaan jual beli.  
**Roles:** Anggota (ajukan); Pengurus (review)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Admin: ringkasan & tabel | Kartu (total pembiayaan, piutang), `TransactionTable` + filter | Loading, empty | — |
| Form pengajuan | Barang, harga pokok, DP, tenor, margin → preview angsuran & harga jual (decimal.js) | `INVALID_AMOUNT`, `INVALID_TENOR` | Preview dihitung real-time, DP ≥ 0 |
| Detail & approval | Modal approval jualbeli (SCR-010) + DP proof | — | Masking dokumen |
| Laporan | List report + jurnal + ekspor Excel | Loading | Filter periode |

**Primary action:** Ajukan → approval 3 tahap → DP + jadwal angsuran dibuat.  
**Responsive:** Form satu kolom di xs.

---

### SCR-015 — Pinjaman Lunak (`pinjamanList`, `pinjamanReport`, `pinjamanInputModal` / `programPage`, `formPengajuanPinjaman`)

**Purpose:** Pengajuan pinjaman lunak + pencatatan modal koperasi.  
**Roles:** Anggota (ajukan); Bendahara (input modal DEBET/KREDIT)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Daftar pinjaman | Tabel + status approval/piutang | Loading | — |
| Form pengajuan | Jumlah, tenor, tujuan | `INVALID_AMOUNT` | — |
| Input modal | Tipe (DEBET/KREDIT), nominal, deskripsi | Nominal > 0 | Konfirmasi + audit |
| Laporan | Tab List / Jurnal / Neraca / Modal | Loading | Ekspor Excel |

**Primary action:** Ajukan → approval → jadwal angsuran.  
**Responsive:** Tab stack di xs.

---

### SCR-016 — Arisan (`arisanBatchPage`, `arisanReport` / `arisanPage`, `arisanJoinPage`, `arisanConfirmationPage`)

**Purpose:** Kelola batch arisan, kocokan bulanan, pencairan; anggota bergabung.  
**Roles:** Bendahara (kelola); Anggota (gabung)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Batch admin | Buat batch (kuota, target, angsuran, tenor), aktivasi | Validasi kuota/tenor | — |
| Draw bulanan | Tombol draw (hanya bila semua angsuran bulan berjalan lunas) | `INSTALLMENTS_UNPAID` bila belum lunas | RNG kriptografis (BR-08.04) — hasil tidak dapat diprediksi |
| Hasil draw & pencairan | Pemenang ditandai + bukti transfer | Empty sebelum draw | — |
| Gabung (anggota) | Lihat batch ACTIVE → join → konfirmasi | Kuota penuh → `FULL` | Konfirmasi sebelum join |
| Laporan | Tab Dana / Peserta / Jurnal | Loading | Ekspor Excel |

**Primary action:** Draw → pemenang → upload bukti pencairan.  
**Responsive:** Tabel peserta scroll horizontal di xs.

---

### SCR-017 — Tabungan Bertarget (`tabunganList`, `tabunganReport` / `tabunganPage`, `formPengajuanTabungan`, `detailTabungan`, `setoranTabungan`, `penarikanTabunganPage`)

**Purpose:** Kelola program target & progres tabungan anggota.  
**Roles:** Pengurus (master program); Anggota (setoran/penarikan)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Master program | CRUD target (nama, nominal, kategori, tahun) | Validasi nominal > 0 | — |
| Progres anggota | Progress bar vs target (`saved_amount`/`target_amount`) | Loading, target tercapai (badge) | Progress + angka, bukan warna saja |
| Setoran | Transfer + bukti → verifikasi | `FILE_INVALID` | — |
| Penarikan | Ajukan → approval 3 tahap | `INSUFFICIENT_BALANCE` | — |
| Laporan | List + jurnal | Loading | Ekspor Excel |

**Primary action:** Setoran → verifikasi → progres ter-update.  
**Responsive:** Progress bar full-width di xs.

---

### SCR-018 — Investasi Halal / Sukuk (`investasiHalalList`, `investasiHalalReport` / `investasiPage`, `investasiHalal`, `detailSukuk`)

**Purpose:** Katalog & order investasi sukuk + portofolio.  
**Roles:** Anggota (investasi); Pengurus (kelola issue)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Katalog sukuk | Issue OPEN: nama, harga, return, sisa kuota, periode | CLOSED → tidak bisa order | Kuota real-time |
| Form order | Jumlah investasi | `QUOTA_EXCEEDED` bila melebihi sisa | — |
| Detail & jadwal | Jadwal jatuh tempo per issue | Loading | — |
| Approval & portofolio | Order → approval 3 tahap → CONFIRMED | Real-time status | — |
| Laporan | List + jurnal | Loading | Ekspor Excel |

**Primary action:** Order → approval → alokasi dana.  
**Responsive:** Kartu katalog 1 kolom (xs) → 2–3 kolom (lg).

---

### SCR-019 — Pendanaan Syariah (`pendanaanSyariahList`, `pendanaanSyariahReport` / `pendanaanSyariah`, `formPendanaanSyariah`)

**Purpose:** Pengajuan pendanaan berbasis akad + pelaporan jurnal/neraca.  
**Roles:** Anggota (ajukan); Pengurus (review)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Form pengajuan | Kategori, jumlah, tenor, tujuan, akad (Mudharabah/Musyarakah/dll) | Akad harus valid | — |
| Daftar & detail | Status + approval (SCR-010) | Loading | — |
| Laporan | Neraca per akun dari jurnal (Fase 1, DEC-001) | Loading, empty | Ekspor Excel; tombol PDF: sembunyikan atau implementasikan (DEC-004) |

**Primary action:** Ajukan → approval → pencairan + jadwal.  
**Responsive:** Form satu kolom di xs.

---

### SCR-020 — Pelatihan & Evaluasi (`trainingPage`, `detailMateri`/`bacaMateri`, `evaluasi`, `ranking`)

**Purpose:** E-learning: materi, kuis, ranking.  
**Roles:** Anggota (belajar); Pengurus (kelola kurikulum)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Kurikulum | Daftar materi berurutan (teks/video/dok) | Loading | Video: caption; dok: unduh via `/api/files/*` |
| Baca materi | Render konten (HTML di-sanitize DOMPurify) + catatan (`material_notes`) | — | Sanitasi XSS |
| Kuis | Multiple choice, submit | Jawaban belum lengkap → `VALIDATION_ERROR` | Radio group keyboard |
| Hasil & ranking | Nilai + posisi ranking | Real-time | Tabel ranking aksesibel |

**Primary action:** Submit kuis → nilai tersimpan → ranking ter-update.  
**Responsive:** Materi full-width; kuis satu kolom.

---

### SCR-021 — Notifikasi (`NotificationDropdown` — topbar; `notificationPage`, `notificationDetailPage`)

**Purpose:** Terima & kelola notifikasi real-time.  
**Roles:** Semua (milik sendiri)

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Bell dropdown | Unread count + daftar terbaru (real-time socket) | Loading, kosong | `aria-live` untuk notifikasi baru |
| Halaman notifikasi | List + filter + pagination | Loading | — |
| Aksi | Klik → detail/halaman terkait; mark as read | — | Status read/unread + teks |

**Events:** `APPROVAL_UPDATE`, `REGISTRATION_UPDATED`, `TRANSACTION_UPDATED`, `notifications:update`.  
**Responsive:** Dropdown full-width di xs.

---

### SCR-022 — Konfigurasi (`akadConfigPage`, `simpananConfigPage`, `paymentFeeConfigPage`)

**Purpose:** Pengaturan akad per produk, nominal simpanan + tanggal efektif, biaya admin.  
**Roles:** Bendahara

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Akad | Pilih akad (Wadiah/Mudharabah/Musyarakah/Murabahah/Qardh/Wakalah) per produk | — | Deskripsi akad |
| Nominal simpanan | Nominal + tanggal efektif (≥ hari ini) | `INVALID_NOMINAL`, `PAST_EFFECTIVE_DATE` | Penjelasan: hanya berlaku tagihan pada/after tanggal |
| Biaya admin | Metode (FLAT/PERCENTAGE), nilai | Nilai ≥ 0 | Preview dampak ke tagihan |

**Primary action:** Simpan → `feature_configs` / `payment_fee_configs` + audit.  
**Responsive:** Form satu kolom.

---

### SCR-023 — Import / Export Excel (`GenericImportModal`, `Import*Modal`, tombol ekspor per modul)

**Purpose:** Impor data massal & ekspor laporan.  
**Roles:** Pengurus

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Template | Unduh template XLSX per modul | — | — |
| Upload | XLSX ≤5MB, validasi magic byte | `FILE_INVALID`, `PAYLOAD_TOO_LARGE` | Drag-drop + input file |
| Preview | Data tervalidasi + tabel kesalahan per baris (`ImportFailureTable`) | Sebagian gagal → tampilkan baris bermasalah | Pesan per baris |
| Konfirmasi | Import → audit log | Loading | Konfirmasi destruktif |
| Ekspor | Filter → exceljs → unduh | Loading | Nama file jelas |

**Primary action:** Konfirmasi import → data masuk + audit.  
**Responsive:** Modal melebar di ≥md.

---

### SCR-024 — PWA & Status Sistem (`OfflineIndicator`, `PwaUpdatePrompt`)

**Purpose:** Menjaga UX saat offline / update versi.  
**Roles:** Semua

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| Offline | Banner "Anda sedang offline" saat koneksi terputus | Offline | Data transaksi butuh koneksi — jelaskan |
| Update PWA | Prompt versi baru tersedia → reload | — | Dismissible |
| Error boundary | `EnhancedErrorBoundary`/`NavigationErrorBoundary` + retry | Error tak terduga | Pesan ramah + tombol coba lagi |

**Catatan:** Public memakai `sw.js` manual (cache `koperasi-v1.0.0`); admin memakai plugin PWA Vite.  
**Responsive:** Banner full-width.

---

### 4.1 Peta modul FSD → layar

| FSD | Screen IDs |
| --- | --- |
| F-01 Auth | SCR-001, SCR-003 |
| F-02 Member | SCR-002, SCR-008, SCR-009 |
| F-03 Approval | SCR-006, SCR-010 |
| F-04 Simpanan | SCR-011, SCR-012 |
| F-05 Billing | SCR-013 |
| F-06 Jual Beli | SCR-014 |
| F-07 Pinjaman | SCR-015 |
| F-08 Arisan | SCR-016 |
| F-09 Tabungan | SCR-017 |
| F-10 Sukuk | SCR-018 |
| F-11 Pendanaan | SCR-019 |
| F-12 Training | SCR-020 |
| F-13 Notifikasi | SCR-021 |
| F-14 Dashboard | SCR-006, SCR-007 |
| F-15 Excel | SCR-023 |
| F-16 Audit/Security | §5 (masking `ProtectedImage`, re-auth destruktif, audit trail) |
| F-17 Landing | SCR-004, SCR-005 |
| F-18 Konfigurasi | SCR-022 |
| F-19 Cron/PWA | SCR-024 |

## 5. Interaction states

- **Loading:** Skeleton (`DashboardSkeleton`/`AdvancedSkeleton`) untuk fetch data; spinner pada tombol aksi; `aria-busy` pada kontainer; shimmer dihormati `prefers-reduced-motion`.
- **Empty:** `EmptyState` (ilustrasi + CTA kontekstual) — mis. "Belum ada tagihan", "Belum ada pengajuan", "Antrean approval kosong".
- **Error:** `EnhancedErrorBoundary` (app-level) + `NavigationErrorBoundary` (route-level) dengan pesan ramah + tombol coba lagi; error validasi tampil inline per field (fokus otomatis ke field pertama yang invalid); error API memakai envelope `{ error: { code, message, details } }` → toast untuk error transien, inline untuk validasi.
- **Offline / degraded:** `OfflineIndicator` menampilkan status offline; aksi yang butuh koneksi (upload, submit) diblok dengan penjelasan; draft registrasi tetap tersimpan di `localStorage`; PWA app shell tetap dapat dibuka.
- **Confirmation / destructive actions:** SweetAlert2 untuk aksi destruktif (arsip, restore, reject approval, hapus); **re-auth password wajib** untuk arsip/restore anggota (BR-02.04); reject approval wajib alasan (min 5 char); konfirmasi sebelum import massal & sebelum submit registrasi.
- **Real-time:** Update via Socket.IO tanpa reload; saat socket terputus → fallback polling/refresh manual dengan indikator status koneksi.
- **Security UX (F-16):** NIK/HP/email ter-mask sesuai peran (`ProtectedImage`/`ProtectedFileLink`); tombol unduh dokumen hanya muncul bila berhak (server tetap enforce via `/api/files/*`); tidak ada secret/PII di URL atau localStorage.

## 6. Catatan lintas-repo & tindak lanjut

| ID | Temuan | Dampak | Rekomendasi |
| --- | --- | --- | --- |
| UI-NOTE-1 | Admin memakai brand hijau (`#00896d`), public biru (`#2563eb`) | Dua identitas visual | Disepakati per audiens; dokumentasikan di kedua design token |
| UI-NOTE-2 | Public `ThemeContext` hardcoded light | Toggle tema tidak berfungsi | Aktifkan atau sembunyikan toggle (follow-up P2) |
| UI-NOTE-3 | Admin: menu Laporan/Pengaturan/Registrasi/Billing/Transaksi = placeholder ke Dashboard | Menu menyesatkan (DEC-003) | Perbaiki menu (P2) atau implementasikan |
| UI-NOTE-4 | Public masih memuat script DOKU JOKUL sandbox (`index.html`) | **Keamanan: sandbox di produksi** (DEC-005, BLK-001) | Hapus sandbox; ganti InvoicePage jadi transfer manual + upload bukti (P0) |
| UI-NOTE-5 | Public: banyak file legacy `*Screen.jsx` tidak terdaftar di router | Dead code | Bersihkan (discovery task) |
| UI-NOTE-6 | Routing token-based (bukan URL manusiawi) | Bookmark tidak stabil saat rotasi secret | Dokumentasikan operasional; pertimbangkan slug URL (future) |

## 7. Traceability

| Requirement | Screen / section | API | Test |
| --- | --- | --- | --- |
| PRD-001, PRD-002 (auth) | SCR-001, SCR-003 | API-001..005 | TEST-001, TEST-002 |
| PRD-003 (registrasi) | SCR-002 | API-006 | TEST-003 |
| PRD-004 (approval) | SCR-006, SCR-010 | API-013..015 | TEST-007 |
| PRD-005, PRD-006 (role, arsip) | SCR-008, SCR-009 | API-009..011 | TEST-005, TEST-006 |
| PRD-007 (simpanan) | SCR-011, SCR-012 | API-016..018 | TEST-008, TEST-009 |
| PRD-008 (billing) | SCR-013 | API-021..023 | TEST-011 |
| PRD-010 (jual beli) | SCR-014 | API-025 | TEST-013 |
| PRD-011 (pinjaman) | SCR-015 | API-026..027 | TEST-014, TEST-015 |
| PRD-012 (arisan) | SCR-016 | API-031..033 | TEST-016, TEST-017 |
| PRD-013 (tabungan) | SCR-017 | API-034..036 | TEST-018, TEST-019 |
| PRD-014 (sukuk) | SCR-018 | API-028..029 | TEST-020 |
| PRD-015 (pendanaan) | SCR-019 | API-030 | TEST-021 |
| PRD-016 (training) | SCR-020 | API-037..039 | TEST-022 |
| PRD-017 (notifikasi) | SCR-021 | API-042..044 | TEST-023 |
| PRD-018 (dashboard) | SCR-006, SCR-007 | API-040..041 | TEST-024 |
| PRD-019 (excel) | SCR-023 | API-022 (proof), import/export per modul | TEST-025, TEST-026 |
| PRD-020, PRD-021, PRD-022 (audit, dokumen, masking) | §5, SCR-009, SCR-010 | API-050 | TEST-027 |
| PRD-023 (landing) | SCR-004, SCR-005 | API-045..047 | TEST-028 |
| PRD-009, PRD-024, PRD-025 (konfigurasi) | SCR-022 | API-019..020, API-048..049 | TEST-029 |
| PRD-026 / PWA | SCR-024 | (internal cron) | TEST-030 |

> **Coverage:** 24 screen specs mencakup seluruh 19 modul FSD dan 26 requirement PRD. ✅