# Laporan QA: `admin.kkpus.id/src/styles/`

Tanggal: 2026-11-18
Mode: read-only (tidak ada file produksi diubah)

## Ringkasan
- Keputusan: LAYAK DENGAN CATATAN (tidak ada isu keamanan langsung; ada 3 Major maintainability/performa)
- Jumlah temuan: Blocker 0, Major 3, Minor 7, Saran 1
- Folder ini hanya berisi satu file: `admin-theme.css` (115.363 byte) yang **diminifikasi menjadi satu baris** dengan 1.422 rule, diimpor global di `App.jsx:7`. Sintaks valid (diverifikasi esbuild, tanpa warning), tetapi isinya **tidak dapat di-review sebagai source**, **±76% class selector tidak dipakai** (sisa halaman landing/marketing), dan memiliki **237 `!important`** termasuk override ukuran semua heading.

## Standar yang dipakai
- Tidak ada standar tertulis (tanpa Stylelint/ESLint/test config; `package.json` hanya `dev`/`build`/`preview`).
- Baseline: ISO/IEC 27001:2022 A.8.25 (siklus hidup pengembangan aman), A.8.32 (manajemen perubahan — perubahan CSS harus dapat ditinjau); ISO/IEC 25010 (maintainability, performance efficiency, usability); WCAG 2.2 AA (1.4.4 Resize Text, 2.4.7 Focus Visible).

## Cakupan
- Diperiksa: seluruh isi `admin-theme.css` (1 baris, 115 KB), interaksi cascade dengan `src/App.css`, `src/pages/auth/LoginPage.css`, `src/pages/auth/SplashPage.css`, `src/index.html`, dan pemakaian class selector di seluruh `src/**/*.jsx|js`.
- Tidak diperiksa: rendering visual di browser (tidak ada environment browser) dan file CSS di halaman lain di luar modul `auth`.

## Hasil perintah yang dijalankan
| Perintah | Hasil | Catatan |
|---|---|---|
| `wc -lc admin-theme.css` | 1 baris, 115.363 byte | Seluruh source dalam satu baris |
| `grep -o "{" \| wc -l` | 1.422 rule | 90 `@media`, 38 `@keyframes` |
| `grep -o "!important" \| wc -l` | **237** | Termasuk override heading global |
| `npx esbuild admin-theme.css --outfile=...` | **exit 0**, tanpa warning | Sintaks CSS valid |
| Script analisis `var()` | 68 var dipakai, 93 didefinisikan | 30 variabel didefinisikan tapi 0 pemakaian |
| Script analisis class selector vs `src/**` | 543 class unik, **412 tidak ditemukan** (76%) | Kandidat CSS mati |
| `grep -c "font-family\|Inter" src/index.html` | 0 hasil | Font "Inter" tidak pernah dimuat |
| `grep -n "errorElement" ...` (audit rute) | 0 hasil | Build tetap gagal di `LoginPage.jsx:108` (di luar folder ini) |

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)
| Kontrol | Status | Bukti / temuan |
|---|---|---|
| A.8.25 siklus hidup pengembangan aman | Lulus dengan catatan | CSS valid, tetapi artefak minified dijadikan source (T1) |
| A.8.32 manajemen perubahan | Gagal | Diff/perubahan CSS tidak dapat ditinjau (1 baris) (T1) |
| A.8.28 secure coding | Lulus | Tidak ada `@import` eksternal, tidak ada font/piksel pihak ketiga |
| A.8.9 manajemen konfigurasi | Lulus dengan catatan | Dua sistem token paralel (T4) |
| A.8.12 pencegahan kebocoran data | Lulus | Hanya 1 URL aset lokal; ikon lain data URI |

## Matriks aspek
| Aspek | Status | Catatan singkat |
|---|---|---|
| Kebenaran fungsional | Lulus dengan catatan | Heading global dipaksa 22px (T3); celah 6px sidebar mobile (T5) |
| Kualitas kode | Gagal | 1 baris, 237 `!important`, 30 token mati, duplikasi antar-file |
| Pengujian | Tidak berlaku | Tidak ada Stylelint/visual regression |
| Keamanan | Lulus | Tidak ada sumber daya eksternal/tracking |
| Performa | Lulus dengan catatan | ±76% selector tidak dipakai (T2) |
| Keandalan | Lulus dengan catatan | z-index bertingkat tidak konsisten (T6) |
| Aksesibilitas | Lulus dengan catatan | Skala font 9–11px (T8); sudah ada `prefers-reduced-motion` & `prefers-contrast` |
| Build/CI | Gagal | Build repo masih gagal di `LoginPage.jsx:108` |

## Temuan

### [Major] Source CSS diminifikasi menjadi satu baris — tidak dapat direview atau di-diff
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` (seluruh file; 115.363 byte, 1.422 rule)
- Aspek / standar: Maintainability / ISO 27001 A.8.32, A.8.25
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```
  $ wc -lc src/styles/admin-theme.css
        1 115363 src/styles/admin-theme.css
  ```
  Baris pertama langsung berisi `.fixed-header{z-index:1050;...}` tanpa pemisah seksi. Tidak ada `admin-theme.scss`/`src/` asal di repo (`ls src/styles` → hanya file ini).
- Dampak: Setiap perubahan CSS menghasilkan diff satu baris raksasa — code review, `git blame`, dan rollback praktis tidak mungkin. Ini juga menyembunyikan duplikasi (mis. aturan `h1,.h1,h2,.h2` yang muncul dua kali identik, T3) dan selector mati (T2). Melanggar prinsip perubahan yang dapat ditinjau (four-eyes).
- Rekomendasi: pulihkan source tidak diminifikasi (format satu deklarasi per baris), atau migrasikan ke SCSS/PostCSS dengan pipeline build; tambahkan Stylelint ke CI dan simpan file hasil build di `dist/` saja.

### [Major] ±76% class selector tidak dipakai — bobot CSS mati di bundel utama
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1`; diimpor global pada `admin.kkpus.id/src/App.jsx:7`
- Aspek / standar: Performa / ISO 25010 performance efficiency
- Klasifikasi: ketidaksesuaian minor dengan dampak performa
- Bukti: perbandingan 543 class unik di file ini dengan seluruh `src/**/*.{js,jsx}` menghasilkan **412 class tidak ditemukan (76%)**, antara lain:
  ```
  .hero-section (9), .service-card (30), .about-*, .article-*, .animate-*,
  .auth-register-page, .pbs-* (53 selector unik, 50 di antaranya tidak ada di LoginPage.css)
  ```
  File ini selalu ikut bundel utama karena diimpor di `App.jsx`, bukan per-halaman.
- Dampak: Transfer CSS lebih besar dari kebutuhan (perkiraan ±85 KB), parsing CSS lebih lama di perangkat mobile, dan risiko "bocor gaya" — class baru di halaman bisa tidak sengaja mewarisi aturan lama dari situs marketing. Catatan: sebagian class mungkin dirakit dinamis, sehingga angka ini adalah batas atas.
- Rekomendasi: hapus blok landing/marketing yang tidak dipakai, pindahkan style per halaman ke file masing-masing (seperti `LoginPage.css`), dan jalankan PurgeCSS/`@tailwindcss`-style audit terhadap build akhir.

### [Major] 237 `!important`, termasuk override global semua heading (duplikat)
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` (blok akhir file)
- Aspek / standar: Maintainability / WCAG 1.4.4
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```
  h1,.h1,h2,.h2{font-size:var(--font-size-2xl)!important}   ← muncul 2× identik
  h3,.h3,h4,.h4{font-size:var(--font-size-xl)!important}
  .notification-item,...{font-size:var(--font-size-md)!important}
  ```
  `grep -o "!important" | wc -l` → 237. Aturan heading ini berada di akhir file sehingga menang atas semua file lain yang dimuat sebelumnya.
- Dampak: Semua `<h1>` dipaksa 22px, termasuk heading yang sengaja memakai utilitas Bootstrap seperti `display-5` di `src/pages/auth/LoginPage.jsx:130` — hierarki visual halaman rusak dan sulit diubah tanpa `!important` baru. Dua aturan identik menandakan hasil penggabungan file tanpa pembersihan.
- Rekomendasi: hapus override heading global (biarkan token/utility), kurangi `!important` bertahap dimulai dari aturan tipografi, dan jadikan Stylelint (`declaration-no-important`) sebagai peringatan di CI.

### [Minor] Dua sistem token tipografi paralel — satu di antaranya mati
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` (blok `:root` di posisi ±6.860 dan ±7.515)
- Aspek / standar: Maintainability / ISO 27001 A.8.9
- Klasifikasi: ketidaksesuaian minor
- Bukti: script `var()` menemukan 30 variabel yang didefinisikan tetapi **0 pemakaian**, yaitu seluruh `--layout-font-size-{xs..3xl}` (7), `--layout-font-weight-{regular..black}` (6), `--font-sans`, `--font-mono`, `--font-size-2xs`, `--font-weight-light`, dll. Sementara `--font-size-*` dipakai 200+ kali (`--font-size-md` 56×, `--font-size-base` 36×).
- Dampak: Rancangan token ganda membingungkan; developer baru akan memilih token yang salah (dan tidak berefek).
- Rekomendasi: pertahankan satu set token (`--font-*`), hapus `--layout-*` yang tidak dipakai.

### [Minor] Sidebar horizontal tetap `top: 64px` saat header mengecil menjadi 58px di mobile
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` (`.app-sidebar.sidebar-horizontal{...top:64px}`) vs `admin.kkpus.id/src/App.css:131-134` (`@media (max-width:575.98px){ .fixed-header{height:58px} }`)
- Aspek / standar: Kebenaran fungsional / responsive
- Klasifikasi: ketidaksesuaian minor
- Bukti: `.app-sidebar.sidebar-horizontal{...position:fixed;top:64px;left:0;...}` tidak memiliki variasi media query; satu-satunya `@media (width<=768px)` di file ini hanya menyentuh `.topbar`.
- Dampak: Pada layar <576px muncul celah 6px di antara header dan menu horizontal (atau garis ganda), terlihat sebagai garis putih/tepi tidak rapi di perangkat kecil.
- Rekomendasi: gunakan variabel `--header-offset` (sudah ada di file ini) untuk `top`, atau tambahkan override `top:58px` pada breakpoint yang sama.

### [Minor] z-index bertumpuk tanpa skala yang konsisten — sidebar di atas modal
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` (`.app-sidebar.sidebar-vertical{z-index:1100}`, `.app-sidebar.sidebar-horizontal{z-index:999}`, `.fixed-header{z-index:1050!important}`)
- Aspek / standar: Keandalan / UI consistency
- Klasifikasi: ketidaksesuaian minor
- Bukti: distribusi z-index di file: `1100`, `1090`, `1060`, `1050` (2×), `1035!important`, `1034`, `1032` (2×), `999`. Bootstrap 5.3 memakai modal `1055` dan backdrop `1050`.
- Dampak: Sidebar vertikal (1100) dapat menutupi modal beserta backdrop-nya; header dan backdrop sama-sama 1050 sehingga urutan bergantung DOM. Ini membuat bug visual yang sulit direproduksi hanya di kombinasi state tertentu.
- Rekomendasi: tetapkan skala tetap (mis. isi 100, header 1030, sidebar 1040, modal 1055, toast 1080) dan dokumentasikan di komentar file.

### [Minor] Font "Inter" dideklarasikan tetapi tidak pernah dimuat
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` (`--layout-font-family:"Inter", ...`, dipakai oleh `.layout-font-family`); `admin.kkpus.id/index.html` (tidak ada `@font-face`/`@import`/`link` font)
- Aspek / standar: Kebenaran fungsional / konsistensi desain
- Klasifikasi: ketidaksesuaian minor
- Bukti: `grep -n "Inter\|fonts.googleapis\|font-family" index.html` → 0 hasil; `grep "@font-face"` di CSS → 0 hasil.
- Dampak: Teks dirender dengan font sistem (Segoe UI/Roboto), bukan Inter; tampilan antar-perangkat berbeda dan nama token menyesatkan desainer.
- Rekomendasi: muat Inter dari bundel sendiri (`@font-face` + `woff2`, `font-display: swap`) atau hapus "Inter" dari daftar agar jujur.

### [Minor] Skala tipografi terkecil 9–11px dipakai untuk teks nyata
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` (`--font-size-2xs:9px`, `--font-size-xs:10px`, `--font-size-sm:11px`)
- Aspek / standar: Aksesibilitas / WCAG 1.4.4, usability
- Klasifikasi: ketidaksesuaian minor
- Bukti: `var(--font-size-sm)` dipakai 27 kali (badge/label/teks sekunder), `--font-size-xs` 1 kali. Nilai 9–11px berada di bawah ukuran baca nyaman (umumnya ≥12px untuk teks isi).
- Dampak: Kesulitan membaca pada layar ber-DPI rendah dan bagi pengguna low vision; pengguna harus zoom (yang memicu masalah layout lain).
- Rekomendasi: naikkan minimum teks isi ke 12px (0.75rem) dan gunakan 10–11px hanya untuk label non-esensial.

### [Minor] Duplikasi selector lintas file CSS
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` vs `admin.kkpus.id/src/pages/auth/LoginPage.css:1-181` dan `admin.kkpus.id/src/App.css`
- Aspek / standar: Maintainability
- Klasifikasi: ketidaksesuaian minor
- Bukti: tiga selector `.pbs-*` didefinisikan di kedua file: `.pbs-brand-logo`, `.pbs-brand-title`, `.pbs-submit-v2` (53 selector `.pbs-*` di admin-theme vs 18 di LoginPage.css). Selain itu `.fixed-header`, `.header-title`, `.header-subtitle`, `.header-divider`, `.header-masjid-bg` didefinisikan ulang di `App.css` dengan nilai berbeda (mis. `--font-size-base` vs `0.95rem`, `#00d9a6` vs `#00e5b3`).
- Dampak: Sumber kebenaran ganda — perubahan tampilan login/header bisa tidak berefek karena tertimpa file lain yang dimuat belakangan.
- Rekomendasi: satu file per domain (theme hanya token + layout global), hapus definisi duplikat di `App.css`.

### [Minor] Nilai fallback hardcoded pada beberapa token
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1` — `.notification-badge{font-size:var(--font-size-badge,.6rem)}`, `.notification-body{var(--font-size-extra-small,.65rem)}`, `.notification-date{var(--font-size-tiny,10px)}`, `.notification-header{var(--font-size-small,.75rem)}`
- Aspek / standar: Maintainability
- Klasifikasi: ketidaksesuaian minor
- Bukti: keempat nama token (`--font-size-badge`, `--font-size-extra-small`, `--font-size-tiny`, `--font-size-small`) **tidak didefinisikan** di mana pun — bukan bug karena fallback valid, tetapi menandakan sisa refactor.
- Dampak: Empat nilai font notification tidak ikut berubah bila skala tipografi diubah.
- Rekomendasi: ganti dengan token yang ada (`--font-size-xs/sm`).

### [Saran] `outline:none` pada `.otp-input:focus`
- Lokasi: `admin.kkpus.id/src/styles/admin-theme.css:1`
- Aspek / standar: WCAG 2.4.7
- Klasifikasi: peluang perbaikan
- Bukti: `.otp-input:focus{border-color:#0d6efd;outline:none;transform:scale(1.05);box-shadow:0 0 0 .2rem #0d6efd40}` — indikator fokus diganti box-shadow.
- Dampak: Tidak melanggar selama ring tetap terlihat; namun ring tipis `#0d6efd40` di atas putih berpotensi kurang kontras, dan `scale(1.05)` menggeser posisi input saat fokus.
- Rekomendasi: pastikan ring memenuhi 3:1 terhadap latar dan hindari transform saat fokus.

## Hal yang sudah baik
- Sintaks CSS **valid**: esbuild memproses file tanpa error/warning (exit 0).
- Blok `@media (prefers-reduced-motion: reduce)` global menonaktifkan animasi/transisi bagi pengguna yang memintanya (`*,:before,:after`).
- Ada dukungan `@media (prefers-contrast: high)` yang menggelapkan `--color-muted-foreground` dan `--color-border`.
- Ikon dan dekorasi memakai **data URI** (hanya 1 URL aset eksternal: `/assets/images/masjid.png`), sehingga tidak ada request ke domain pihak ketiga — baik untuk privasi dan offline.
- Tidak ada `@import` (yang memblokir render) dan tidak ada `@font-face` eksternal.
- Menggunakan token warna berbasis triplet RGB (`--color-primary:59 130 246`) sehingga transparansi bisa dibuat konsisten via `rgb(var(--color-x) / a)`.
- Indikator fokus untuk elemen interaktif utama didefinisikan eksplisit (`outline:2px solid ...` muncul 16×) — bukan nol.

## Langkah lanjutan
1. Kembalikan `admin-theme.css` ke format terbaca (atau migrasikan ke SCSS) dan tambahkan Stylelint ke CI — prasyarat agar temuan lain bisa ditinjau.
2. Hapus ±412 selector yang tidak dipakai dan pindahkan style per halaman; ukur selisih ukuran bundel sebelum/sesudah.
3. Hapus override `h1..h4 !important` yang duplikat dan turunkan jumlah `!important` secara bertahap.
4. Satukan token (`--font-*` saja), hapus 15 variabel `--layout-*` yang mati, dan ganti 4 fallback hardcoded notification.
5. Perbaiki `top` sidebar agar mengikuti `--header-offset`, dan tetapkan skala z-index terdokumentasi.
6. Putuskan: muat font Inter sendiri atau hapus dari font stack.
