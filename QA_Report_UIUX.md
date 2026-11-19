# Laporan UI/UX: `admin.kkpus.id` (Backoffice Koperasi)

Tanggal: 2026-11-18
Versi laporan: 1.0
Mode: read-only (tidak ada file produksi yang diubah)
Cakupan commit: kondisi working tree saat audit

## Ringkasan

- **Keputusan: TIDAK LAYAK** — antarmuka belum memenuhi WCAG 2.2 AA secara sistematis, dan **build produksi saat ini gagal** sehingga kondisi UI final tidak dapat diverifikasi.
- Jumlah temuan: **Blocker 1, Major 8, Minor 6, Saran 5**
- Temuan paling berdampak:
  1. **Build gagal** di `src/pages/auth/LoginPage.jsx:108` (`</a>` menutup `<Link>` yang dibuka di baris 97). Seluruh halaman tidak dapat dirilis/diuji end-to-end.
  2. **Label form tidak terhubung**: 79 `<Form.Label>` tetapi hanya **3** `htmlFor`; 198 input dan 27 `Form.Select`. Pencarian tabel hanya bermodal placeholder (`src/components/ui/TransactionTable.jsx:203-247`).
  3. **Pesan error login tidak diumumkan** dan fokus tidak dipindahkan (`LoginPage.jsx:208-218`); hanya 1 `role="alert"` di seluruh aplikasi (indikator offline).
  4. **Kontrol klik tidak dapat dijangkau keyboard**: item notifikasi `role="button"` tanpa `onKeyDown` (`NotificationDropdown.jsx:486-492`), backdrop sidebar (`LayoutGlobal.jsx:80-87`), dan header tabel yang di-sort lewat `onClick` (`TransactionTable.jsx:145-195`, 0 `aria-sort`).
  5. **Kontras gagal AA** pada beberapa pasangan warna utama (putih di `#00c896` = 2,16:1; `#94a3b8` di `#f8fafc` = 2,45:1; `#adb5bd` di `#f8f9fa` = 1,97:1; teks error `#e11d48` di `#fff1f2` = 4,28:1).
  6. **Skala tipografi sangat kecil** dan font tidak pernah dimuat: token `--font-size-2xs: 9px`, `xs: 10px`, `sm: 11px`, `base: 13px`; header tabel 10px; `font-family: Inter` tanpa sumber font.
  7. **Sistem CSS tidak terkendali**: `src/styles/admin-theme.css` berupa **1 baris 115.358 karakter**, 903 warna hex, 347 `!important`, 558 inline style, selector legacy (`.left-sidebar`) yang tidak dipakai JSX (`.app-sidebar`), dan 13 blok `[data-theme=dark]` tanpa kode yang pernah menulis `data-theme`.
- Di sisi positif: `lang="id"`, viewport & meta PWA lengkap, semua 17 gambar punya `alt`, 43 dari 43 tabel dibungkus `table-responsive`, dukungan `prefers-reduced-motion`/`prefers-contrast`, indikator offline `role="alert"`, dan splash page dengan `role="status"` + tombol lewati.

## Metode dan batasan

- **Statis:** membaca 194 file `src/` (45 komponen, 114 halaman), 6 file CSS (1.039 baris), `index.html`, `App.jsx`, `package.json`, dan konfigurasi Vite.
- **Build:** `npx vite build --outDir /tmp/opencode/admin-dist` dijalankan; keluar dengan **exit 1** (syntax error JSX). Tidak ada artefak build baru yang ditulis ke repo.
- **Kontras:** dihitung dari nilai CSS dengan rumus relative luminance WCAG.
- **Tidak dilakukan:** audit runtime browser, screenshot, dan uji screen reader nyata (tidak tersedia Playwright/Puppeteer/axe/pa11y di lingkungan).
- Tidak ada `README.md`, `CONTRIBUTING.md`, `STYLEGUIDE.md`, folder `design/`, atau dokumentasi komponen; baseline memakai WCAG 2.2 AA, Nielsen, dan ISO 9241-110/25010.

## Standar yang dipakai

- WCAG 2.2 Level AA: 1.3.1, 1.4.3, 1.4.4, 1.4.10, 2.1.1, 2.4.1, 2.4.3, 2.4.7, 3.1.2, 3.3.1, 3.3.2, 4.1.2, 4.1.3.
- Nielsen's 10 Usability Heuristics.
- ISO 9241-110 (prinsip dialog) dan ISO 25010 (usability, accessibility, maintainability).
- Bootstrap 5 / React-Bootstrap sebagai design system de facto, plus token di `admin-theme.css`.

## Cakupan

Diperiksa: `src/pages/auth` (Login, Splash), `src/pages/dashboard` (header, stats, approval queue), `src/components/layout` (Topbar, SidebarNav, NotificationDropdown, backdrop), `src/components/modals` (11 modal approval + import), `src/components/ui` (TransactionTable, EmptyState, ApprovalPlaceholder), `src/pages/**` (anggota, simpanan, jual beli, program, investasi, tabungan), `src/components/pwa`, `src/index.css`, `src/App.css`, `src/styles/admin-theme.css`, `index.html`, dan `public/`.

## Matriks heuristik Nielsen

| Heuristik | Status | Bukti singkat |
|---|---|---|
| Visibility of system status | Sebagian | Spinner + teks "Memproses..."; tetapi `role="status"` diberi `aria-hidden="true"` (`LoginPage.jsx:281-285`) |
| Match with real world | Baik | Istilah simpanan/pembiayaan/akad dan format Rupiah konsisten secara konsep |
| User control & freedom | Sebagian | Modal/dropdown bisa ditutup (Escape), tetapi splash auto-redirect dan beberapa aksi langsung eksekusi |
| Consistency & standards | **Gagal** | Bahasa Indonesia–Inggris bercampur; `Swal.fire` 157×, `toast` 1×, `alert()` 4×; 8+ formatter uang |
| Error prevention | Sebagian | Validasi inline `isInvalid` ada; tidak ada konfirmasi pada sebagian aksi massal |
| Recognition vs recall | Baik | Menu sidebar berikon + label, breadcrumb halaman |
| Flexibility & efficiency | **Gagal** | Tidak ada skip link; pencarian tabel tanpa label; sort tabel hanya mouse |
| Aesthetic & minimalist design | Baik | Palet navy–teal konsisten, kartu modern, ilustrasi rapi |
| Help users recognize/recover from errors | **Gagal** | Error login tidak diumumkan, tidak fokus ke field bermasalah, tidak ada `aria-describedby` (0) |
| Help & documentation | Kurang | Tidak ada README/pusat bantuan in-app; pesan error teknis di console |

## Matriks WCAG 2.2 AA (ringkas)

| Kriteria | Status | Bukti |
|---|---|---|
| 1.3.1 Info & Relationships | **Gagal** | 79 `Form.Label` vs 3 `htmlFor`; heading dashboard melompat h3 → h6 |
| 1.4.3 Contrast (Minimum) | **Gagal** | 6 pasangan warna < 4,5:1 (lihat Major 5) |
| 1.4.4 Resize Text | **Gagal** | Token teks 9–13px; tabel `th` 10px; `NotificationDropdown.css:48,135,237,262` 0,65–0,675rem |
| 1.4.10 Reflow | Sebagian | 43/43 tabel responsif; tetapi `global-tabs` `flex-nowrap` + scroll tersembunyi |
| 2.1.1 Keyboard | **Gagal** | Item notifikasi, backdrop, sort tabel tidak dapat dioperasikan keyboard |
| 2.4.1 Bypass Blocks | **Gagal** | Tidak ada skip link; `<main>` tanpa `id` |
| 2.4.3 Focus Order | Sebagian | Fokus tidak dipindahkan ke error/field gagal |
| 2.4.7 Focus Visible | Sebagian | 39 aturan `:focus`, 9 `:focus-visible`; elemen klik non-fokus tidak punya outline |
| 3.1.2 Language of Parts | Sebagian | Label Inggris di UI Indonesia ("List", "Report", "Close sidebar") |
| 3.3.1 Error Identification | Sebagian | Pesan error ada, tidak terhubung ke kontrol |
| 3.3.2 Labels or Instructions | **Gagal** | Placeholder dipakai sebagai satu-satunya label pencarian tabel |
| 4.1.2 Name, Role, Value | Sebagian | `aria-label` 18 untuk 229 tombol; `role="menu"` tanpa `menuitem`; 0 `aria-current` |
| 4.1.3 Status Messages | **Gagal** | Hanya 1 `role="alert"` (offline) dan 1 `aria-live` (splash) |

## Matriks responsif

| Aspek | Status | Bukti |
|---|---|---|
| Breakpoint konsisten | Sebagian | 17× `768px`, 8× `576px`, 7× `480px`; juga `991px`, `991.98px`, `767.98px`, `575.98px`, dan `360px` |
| Sidebar mobile | Baik | `.app-sidebar.sidebar-vertical.open` + backdrop; target sentuh 44px |
| Tabel responsif | Baik | 43 `<Table>` dan 43 `table-responsive` |
| Tab sampah horizontal | Perlu verifikasi | `.global-tabs-wrapper` menyembunyikan scrollbar; `flex-nowrap` berisiko terpotong di 320px |
| Aset & gambar | Kurang | 0 dari 17 gambar `loading="lazy"`; `public/assets/images/masjid.png` 1,1 MB |
| Preferensi pengguna | Baik | 7 blok `prefers-reduced-motion`, 4 blok `prefers-contrast` |

## Temuan

### [Blocker] Build produksi gagal karena tag JSX tidak tertutup benar

- Lokasi: `src/pages/auth/LoginPage.jsx:97` dan `:108`
- Aspek: Fungsional / kesiapan rilis
- Bukti: `<Link to="/" ...>` dibuka di baris 97, tetapi ditutup dengan `</a>` di baris 108. Build berhenti:
  ```
  [src/pages/auth/LoginPage.jsx:108:17] Expected `</Link>`
  EXIT=1
  ```
- Dampak: Aplikasi tidak dapat di-build/di-deploy. Semua verifikasi visual dan alur login tidak dapat dijalankan pada artefak produksi, sehingga risiko regresi UI tidak terdeteksi.
- Rekomendasi: ubah `</a>` menjadi `</Link>`, tambahkan pipeline CI `vite build` + `eslint` agar merge diblokir saat build gagal, dan jalankan audit runtime setelah build hijau.

### [Major] Label form tidak terhubung secara programatik

- Lokasi:
  - `src/components/ui/TransactionTable.jsx:203-247` (4 input pencarian + 1 `Form.Select` hanya ber-placeholder)
  - `src/pages/auth/LoginPage.jsx:224` dan `:244` (2 dari 3 `htmlFor` yang ada)
  - `src/pages/anggota/components/EditRoleModal.jsx:177` (satu-satunya lainnya)
  - Pola berulang: **79 `<Form.Label>` vs 3 `htmlFor`**, 198 `<Form.Control>/<input>`, 27 `<Form.Select>`
- Aspek: WCAG 1.3.1, 3.3.2, 4.1.2
- Bukti:
  ```jsx
  <th className="py-2 px-3">
    <Form.Control
      type="text"
      placeholder="Cari nama / no..."
      value={searchFilters.member || ""}
      onChange={(e) => onSearchChange?.("member", e.target.value)}
    />
  </th>
  ```
  Tidak ada `aria-label`, `id`, atau `<label>`; placeholder hilang saat pengguna mengetik.
- Dampak: Screen reader mengumumkan input sebagai "textbox" tanpa nama. Pengguna assistive technology tidak dapat membedakan kolom waktu, anggota, jenis simpanan, nominal, dan status saat menyaring transaksi keuangan.
- Rekomendasi: beri `id` unik + `htmlFor` untuk setiap label, atau `aria-label` eksplisit untuk input pencarian tabel; tambahkan `aria-describedby` untuk petunjuk; jangan jadikan placeholder satu-satunya label.

### [Major] Pesan error dan status tidak diumumkan ke screen reader

- Lokasi:
  - `src/pages/auth/LoginPage.jsx:208-218` (alert error login tanpa `role="alert"`/`aria-live`)
  - `src/pages/auth/LoginPage.jsx:281-285` (`role="status"` sekaligus `aria-hidden="true"`)
  - `src/pages/auth/SplashPage.jsx:73-74` (satu-satunya `aria-live` untuk halaman)
  - Seluruh `src/`: **0** `aria-invalid`/`aria-describedby` eksplisit, **1** `role="alert"` (indikator offline)
- Aspek: WCAG 3.3.1, 4.1.3, 2.4.3
- Bukti:
  ```jsx
  {error && (
    <div className="alert alert-danger ... pbs-login-error-alert">
      <FaExclamationCircle ... />
      <span className="small fw-semibold">{error}</span>
    </div>
  )}
  ```
  Tidak ada `role="alert"`, `aria-atomic`, atau pemindahan fokus setelah login gagal.
- Dampak: Pengguna screen reader tidak mengetahui login gagal atau alasan kegagalan, lalu mengulang percobaan tanpa arah. Spinner dengan `aria-hidden` juga tidak diumumkan, meski teks "Memproses..." terlihat.
- Rekomendasi: bungkus alert dengan `role="alert"`/`aria-live="assertive"`, hubungkan feedback ke input (`aria-describedby`), set `aria-invalid`, dan pindahkan fokus ke ringkasan error atau field pertama yang gagal. Hapus `aria-hidden` dari elemen `role="status"`.

### [Major] Kontrol yang dapat diklik tidak dapat dioperasikan dengan keyboard

- Lokasi:
  - `src/components/layout/NotificationDropdown.jsx:486-492` — `div role="button" tabIndex={0}` tanpa `onKeyDown`
  - `src/components/layout/LayoutGlobal.jsx:80-87` — backdrop sidebar `role="button" tabIndex={0}` tanpa `onKeyDown`
  - `src/components/ui/TransactionTable.jsx:145-195` — `<th onClick={() => onSort?.(...)}>` tanpa `tabIndex`/keyboard; `aria-sort` **0** di seluruh `src/`
- Aspek: WCAG 2.1.1, 2.4.7, 4.1.2
- Bukti:
  ```jsx
  <div
    className={`notif-item ...`}
    onClick={() => handleItemClick(item)}
    role="button"
    tabIndex={0}
  >
  ```
  `grep onKeyDown src` → **0 hasil**; `tabIndex` hanya **2** pemakaian.
- Dampak: Pengguna keyboard dapat memfokuskan item notifikasi tetapi tidak dapat membukanya dengan Enter/Space. Sort tabel transaksi (waktu, anggota, nominal, status) hanya bisa dilakukan dengan mouse, sehingga pengguna keyboard tidak dapat mengurutkan data keuangan.
- Rekomendasi: gunakan `<button>`/`<a>` untuk item notifikasi dan backdrop; untuk header sort gunakan `<button>` di dalam `<th>` atau `tabIndex={0}` + `onKeyDown` Enter/Space + `aria-sort="ascending|descending|none"`.

### [Major] Kontras warna di bawah ambang WCAG AA

- Lokasi:
  - `src/pages/auth/LoginPage.css:169-172` — error `#e11d48` di `#fff1f2`
  - `src/styles/admin-theme.css` — `.pbs-submit-v2` gradien `#2563eb → #00c896` dengan teks putih; `.pbs-register-v2 .input-group-text` `#94a3b8` di `#f8fafc`
  - `src/components/layout/NotificationDropdown.css:262` — `.notification-meta` `#adb5bd`
  - `src/components/ui/EmptyState.jsx:20-24` — ikon `#adb5bd` di `#f8f9fa`
- Aspek: WCAG 1.4.3
- Bukti (dihitung dari nilai CSS):

  | Kombinasi | Rasio | Ambang teks normal |
  |---|---|---|
  | `#ffffff` di `#00c896` (ujung gradien tombol submit) | **2,16:1** | gagal (4,5:1) |
  | `#ffffff` di `#007bff` | **3,98:1** | gagal |
  | `#ffffff` di `#3b82f6` | **3,68:1** | gagal |
  | `#e11d48` di `#fff1f2` (teks error login 11px) | **4,28:1** | gagal |
  | `#94a3b8` di `#f8fafc` (ikon input) | **2,45:1** | gagal |
  | `#adb5bd` di `#f8f9fa` (meta/ikon) | **1,97:1** | gagal |
  | `#667eea` di `#ffffff` (tombol auth legacy) | **3,66:1** | gagal |

- Dampak: Teks kecil pada tombol utama, pesan error login, metadata notifikasi, dan ikon input sulit dibaca, terutama bagi pengguna low-vision dan di layar redup. Pada aplikasi backoffice keuangan, kesalahan membaca status/error berdampak operasional.
- Rekomendasi: gunakan varian lebih gelap untuk latar berwarna (`#047857`, `#1d4ed8`, `#b45309`) atau teks gelap di latar terang; naikkan `#94a3b8`/`#adb5bd` ke minimal `#64748b`; ubah teks error menjadi `#be123c` (≈5,6:1); uji otomatis dengan axe.

### [Major] Tidak ada tautan "lewati ke konten" dan landmark utama tidak dapat ditargetkan

- Lokasi: `src/components/layout/LayoutGlobal.jsx:85-90` (`<main role="main">` tanpa `id`); pencarian `skip` hanya menemukan tombol lewati splash (`SplashPage.jsx:120`)
- Aspek: WCAG 2.4.1
- Bukti: tidak ada `<a href="#main-content" class="visually-hidden-focusable">` di layout; `<main>` tidak memiliki `id`/`tabIndex`.
- Dampak: Setiap perpindahan halaman, pengguna keyboard harus menekan Tab melewati topbar, notifikasi, profil, dan seluruh menu sidebar sebelum mencapai konten. Pada menu bertingkat yang panjang ini melelahkan dan meningkatkan kesalahan navigasi.
- Rekomendasi: render skip link sebagai elemen pertama `LayoutGlobal`, beri `id="main-content"` dan `tabIndex={-1}` pada `<main>`, dan tampilkan saat fokus.

### [Major] Skala tipografi terlalu kecil dan font yang dideklarasikan tidak pernah dimuat

- Lokasi:
  - `src/styles/admin-theme.css` — token `:root` `--font-size-2xs:9px`, `--font-size-xs:10px`, `--font-size-sm:11px`, `--font-size-base:13px`; `.table th` memakai `--font-size-xs`; `body` memakai `--font-size-base`
  - `src/components/layout/NotificationDropdown.css:48,135,237,262` — `0.65rem`/`0.675rem` (≈10,4–10,8px)
  - `src/index.css:3-7` dan `src/styles/admin-theme.css` — `font-family: Inter, ...` tanpa `@font-face`, `<link>`, atau `@import` Google Fonts
- Aspek: WCAG 1.4.4, keterbacaan, konsistensi visual
- Bukti: header tabel 10px uppercase, meta notifikasi ≈10,4px, teks bantuan 11px. Tidak ada pemuatan font Inter di `index.html` maupun CSS.
- Dampak: Informasi status, nominal, dan metadata sulit dibaca di perangkat seluler serta saat zoom. Karena Inter tidak tersedia, tampilan bergantung pada font sistem sehingga lebar teks dan tinggi baris berbeda antar OS.
- Rekomendasi: naikkan ukuran minimum menjadi 14px untuk teks isi dan 12px untuk metadata, gunakan `rem`, muat satu keluarga font (self-host atau `display=swap`) di `index.html`, dan hapus deklarasi font yang tidak pernah tersedia.

### [Major] Sistem CSS tidak terkendali: token tidak dipakai konsisten, kode legacy, dan dark mode mati

- Lokasi:
  - `src/styles/admin-theme.css` — **1 baris, 115.358 karakter**, 903 warna hex, 347 `!important`, 13 blok `[data-theme=dark]`
  - `src/App.css` — 366 baris override topbar/sidebar dengan `!important`
  - `src/main.jsx:4`, `src/App.jsx:5-8`, `index.html` — urutan impor CSS dan tidak ada pengelola tema
  - 558 inline `style={{}}` di JSX
- Aspek: Konsistensi desain, maintainability, dark mode
- Bukti:
  - JSX memakai class `.app-sidebar` (`SidebarNav.jsx:213`), tetapi CSS masih memuat aturan `.left-sidebar`/`body.show-sidebar` yang tidak pernah cocok.
  - `[data-theme=dark]` didefinisikan 13 kali, tetapi **0** kode JSX/JS yang menulis `data-theme` ke `<html>`; tidak ada toggle tema.
  - Hanya 428 pemakaian `var(--...)` untuk 903 warna hardcoded; `!important` 347 kali.
  - `admin-theme.css` satu baris membuat review, diff, dan pencarian lokasi sulit; setiap perubahan berisiko menimpa aturan lain.
- Dampak: Perubahan warna/tipografi harus menyunting ratusan nilai dan `!important`, sehingga inkonsistensi antar halaman hampir pasti terjadi. Dark mode yang sudah ditulis tidak dapat diaktifkan dan menambah bobot CSS mati.
- Rekomendasi: pisahkan CSS ke file sumber yang tidak diminifikasi, migrasikan warna/tipe/spacing ke token, hapus selector legacy dan blok dark yang tidak terpakai, kurangi inline style, lalu tambahkan Stylelint untuk melarang `!important` baru dan warna hardcoded.

### [Major] Hierarki heading melompat dan tidak ada penanda halaman aktif

- Lokasi: `DashboardHeader.jsx:8` (`<h3>` sebagai judul halaman), `DashboardStats.jsx:29,35` (`<h6>` lalu `<h5>`), `SidebarNav.jsx` (tidak ada `aria-current`); `grep aria-current` → **0**
- Aspek: WCAG 1.3.1, 2.4.8 (best practice), 4.1.2
- Bukti: hanya 2 `<h1>` di seluruh aplikasi (Login dan Splash); dashboard dimulai dari `<h3>` lalu turun ke `<h6>` sebelum `<h5>`. Menu aktif hanya dibedakan class CSS.
- Dampak: Pengguna screen reader yang menavigasi lewat heading mendengar struktur yang membingungkan dan tidak tahu halaman mana yang sedang aktif.
- Rekomendasi: gunakan satu `<h1>` per halaman (judul halaman), turunkan level secara berurutan, dan set `aria-current="page"` pada item menu aktif.

### [Minor] Bahasa Indonesia dan Inggris bercampur pada UI dan nama aksesibel

- Lokasi: `SidebarNav.jsx:106,115,128-130,149-150,162-163,170-171` ("List", "Report", "Input Modal"), `SidebarNav.jsx:237` (`aria-label="Close sidebar"`), `SidebarToggleButton.jsx:12` (`"Toggle sidebar"`), `LoginPage.jsx:259` (`"Hide password"`/`"Show password"`), `LoginPage.jsx:99` (`alt="PUS Logo"`), `InvestasiJurnalReportTab.jsx:13` (`"Loading..."`)
- Aspek: WCAG 3.1.2, konsistensi
- Bukti: label terlihat dan nama aksesibel bercampur tanpa mekanisme terjemahan.
- Dampak: Pengguna berbahasa Indonesia melihat istilah asing; screen reader melafalkan label Inggris dengan pelafalan Indonesia, mengurangi kejelasan.
- Rekomendasi: tetapkan satu bahasa UI (Indonesia) untuk seluruh label, `aria-label`, `alt`, dan pesan status; bila multibahasa dibutuhkan, gunakan lapisan i18n.

### [Minor] Format uang dan tanggal diduplikasi di banyak modul

- Lokasi: `src/utils/helpers/index.js:46` (`formatRupiah` terpusat), tetapi juga `src/components/modals/InvestasiHalalApprovalModal.jsx:80`, `ProgramApprovalModal.jsx:189`, `PendanaanSyariahApprovalModal.jsx:98`, `src/pages/jualBeli/JualBeliReport.jsx:36`, `src/pages/simpanan/components/reportConstants.js:1`, `src/pages/investasi/halal/components/SukukManagementTab.jsx:7`, `DetailSukukModal.jsx:4`, `jualbeli/utils/jualBeliHelpers.js:13`
- Aspek: Konsistensi, risiko kesalahan nominal
- Bukti: 8+ definisi `formatCurrency`/`formatRupiah` terpisah, ditambah 33 pemakaian `toLocaleString("id-ID")` langsung.
- Dampak: Nominal yang sama dapat tampil berbeda (desimal, spasi, pembulatan) antar halaman. Pada aplikasi keuangan, perbedaan format mengurangi kepercayaan dan menambah risiko salah baca.
- Rekomendasi: satukan ke satu modul `Intl.NumberFormat("id-ID")` dan `Intl.DateTimeFormat("id-ID")`, lalu ganti implementasi lokal; tambahkan unit test format.

### [Minor] Dropdown notifikasi memakai `role="menu"` tanpa semantik menu yang lengkap

- Lokasi: `src/components/layout/NotificationDropdown.jsx:371` (`role="menu"`), `:486-492` (item `role="button"` di dalam menu), `:200` (hanya Escape)
- Aspek: WCAG 4.1.2, 2.1.1
- Bukti: tidak ada `role="menuitem"`, roving `tabIndex`, atau navigasi panah; fokus tidak dikembalikan ke tombol pemicu setelah menu ditutup.
- Dampak: Screen reader mengumumkan "menu" tetapi item di dalamnya bukan menu item; pengguna keyboard tidak dapat menelusuri item dengan panah sesuai pola menu yang diumumkan.
- Rekomendasi: gunakan pola disclosure (`aria-expanded` + daftar tombol biasa) atau lengkapi pola menu ARIA (`menuitem`, panah, Home/End, fokus kembali ke pemicu).

### [Minor] Progress bar splash tidak memiliki nilai dan splash melakukan redirect otomatis

- Lokasi: `src/pages/auth/SplashPage.jsx:107-113` (`role="progressbar"` tanpa `aria-valuenow`/`aria-valuemin`/`aria-valuemax`)
- Aspek: WCAG 4.1.2, 2.2.1
- Bukti:
  ```jsx
  <div className="splashx-loading-container" role="progressbar">
  ```
  Tidak ada nilai progres; durasi tampil tetap ±3 detik lalu redirect.
- Dampak: Screen reader tidak dapat menyampaikan progres yang sebenarnya. Pengguna dengan kebutuhan waktu tambahan dapat terlewati, meski sudah ada tombol "Lewati".
- Rekomendasi: hapus `role="progressbar"` bila hanya indikator tak tentu (gunakan `role="status"`), atau sediakan `aria-valuenow`; pertimbangkan mengingat preferensi pengguna agar splash tidak selalu tampil.

### [Minor] Aset besar dan gambar tanpa lazy loading

- Lokasi: `public/assets/images/masjid.png` (1,1 MB), `public/assets/icons/PUSlogo.png` (292 KB), 17 `<img>` di `src/` dengan **0** `loading="lazy"`; `dist/` 5,1 MB di root repo
- Aspek: Performa UI / Core Web Vitals
- Bukti: `grep 'loading="lazy"'` → 0; hanya logo topbar yang memakai `loading="eager"` secara eksplisit.
- Dampak: Unduhan awal berat di jaringan seluler, LCP memburuk, dan biaya bandwidth naik. `dist/` lama di root juga berisiko ter-deploy tanpa sengaja.
- Rekomendasi: kompres/konversi gambar ke WebP, tambahkan `loading="lazy"` + `decoding="async"` pada gambar non-hero, hapus `dist/` dari repo dan hasilkan hanya lewat pipeline.

### [Minor] Tidak ada umpan balik terpadu untuk status dan kesalahan

- Lokasi: `src/pages/simpanan/SimpananDashboard.jsx:292,334`, `src/pages/investasi/halal/components/SukukInvestorsModal.jsx:81,85` (`alert()`); `src/App.jsx:31-41` (ToastContainer tersedia)
- Aspek: Konsistensi & aksesibilitas
- Bukti: `Swal.fire` 157×, `toast` 1×, `alert()` 4×. Hanya 1 `toast` meski container disiapkan.
- Dampak: Pengguna melihat tiga "bahasa" feedback berbeda; `alert()` memblokir UI dan tidak konsisten dengan tema.
- Rekomendasi: standarkan kanal: toast untuk sukses ringan, inline error untuk validasi field, modal untuk keputusan penting; larang `alert()` lewat lint rule.

## Hal yang sudah baik

- **Metadata & bahasa**: `<html lang="id">`, viewport responsif, `theme-color`, deskripsi, favicon, dan meta PWA lengkap (`index.html:2-27`).
- **Landmark**: `header role="banner"`, `nav aria-label="Main navigation"`, `main role="main"`, `aside aria-label="Main menu"`.
- **Gambar**: 17/17 `<img>` memiliki `alt` (meski beberapa generik).
- **Preferensi pengguna**: `prefers-reduced-motion` (7 blok) dan `prefers-contrast: high` (4 blok) sudah ditangani, termasuk target sentuh 44px di sidebar.
- **Status offline**: banner `role="alert"` + `aria-live="assertive"` (`OfflineIndicator.jsx:24-27`).
- **Splash page**: `role="status"`, `aria-live="polite"`, label deskriptif, dan tombol "Lewati" yang dapat difokuskan (`SplashPage.jsx:71-123`).
- **Tabel**: 43 dari 43 tabel dibungkus `table-responsive`; aksi baris memakai `aria-label` spesifik (`TransactionTable.jsx:410,428,447`).
- **Login**: dua field utama sudah memakai `htmlFor`/`id` dan tombol mata punya `aria-label` (walau berbahasa Inggris).
- **Feedback kaya**: SweetAlert2 dan ToastContainer tersedia, indikator loading dengan teks terlihat.
- **PWA**: prompt pembaruan dan indikator offline menunjukkan perhatian pada status sistem.

## Saran

1. **Gate aksesibilitas otomatis**: tambahkan `eslint-plugin-jsx-a11y`, `@axe-core/react`, dan pa11y/axe di CI; blokir merge bila ada pelanggaran serius di login, dashboard, approval, dan laporan.
2. **Audit runtime setelah build diperbaiki**: uji dengan keyboard saja, screen reader (NVDA/VoiceOver), zoom 200%, dan lebar 320–360px pada alur login → dashboard → approval → ekspor.
3. **Bangun style guide**: dokumentasikan token warna/tipe/spacing, status komponen, dan pola feedback; pertimbangkan Storybook.
4. **Satukan format & bahasa**: satu modul `Intl` untuk uang/tanggal dan satu sumber string UI berbahasa Indonesia.
5. **Rapikan pipeline aset**: hapus `dist/` dari repo, optimalkan gambar, lazy-load, dan ukur ulang LCP/TBT.

## Langkah prioritas

1. **Hari ini:** perbaiki `LoginPage.jsx:108` agar build hijau; tambahkan `role="alert"` pada error login dan hentikan `aria-hidden` pada spinner status.
2. **Minggu ini:** hubungkan seluruh label (`htmlFor`/`id` atau `aria-label`), ubah item notifikasi/backdrop/sort tabel menjadi elemen semantik atau lengkapi keyboard, dan tambahkan skip link.
3. **Minggu ini:** perbaiki kontras token warna dan teks error; naikkan ukuran font minimum; muat font Inter dengan benar.
4. **Bulan ini:** pecah dan migrasikan `admin-theme.css` ke token, hapus selector legacy & dark mode mati, kurangi `!important` dan inline style.
5. **Bulan ini:** standarkan feedback (toast/inline/modal), satukan formatter, dan jalankan audit axe/pa11y rutin di CI.
