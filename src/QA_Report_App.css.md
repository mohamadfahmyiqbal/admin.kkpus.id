# Laporan QA: App.css (admin.kkpus.id)

Tanggal: 2026-11-18
Mode: read-only (tidak ada file produksi yang diubah)

## Ringkasan
- Keputusan: TIDAK LAYAK (ditemukan 1 Blocker di luar App.css yang membuat build gagal)
- Jumlah temuan: Blocker 1, Major 2, Minor 4, Saran 2
- `App.css` sendiri tidak menimbulkan kegagalan build, tetapi berisi dua masalah cascade yang berdampak nyata: selector global yang menimpa tombol lain di seluruh aplikasi, dan `box-shadow: none !important` yang mematikan indikator fokus keyboard. Saat memverifikasi build, ditemukan `src/pages/auth/LoginPage.jsx` tidak lolos kompilasi JSX, sehingga bundel produksi tidak dapat dibuat.

## Standar yang dipakai
- Tidak ditemukan `AGENTS.md`/`CLAUDE.md`/`CONTRIBUTING.md`/ESLint/Prettier/test config di repo. `package.json` hanya punya script `dev`, `start`, `build`, `preview` (tanpa lint/test).
- Baseline: ISO/IEC 25010 (maintainability), OWASP ASVS/WCAG 2.2 AA (2.4.7 Focus Visible, 1.4.11 Non-text Contrast), ISO 27001 A.8.25/A.8.28 (secure development), A.8.32 (manajemen perubahan).
- Urutan impor CSS: `App.jsx:7` `styles/admin-theme.css` lalu `App.jsx:8` `App.css`, sehingga `App.css` menang saat specificity/`!important` sama.

## Cakupan
- Diperiksa: `src/App.css` (seluruh 366 baris), interaksi cascade dengan `src/styles/admin-theme.css`, dampak ke komponen yang memakai selector tersebut (`components/layout/NotificationDropdown.jsx`, `components/layout/Topbar.jsx`), serta verifikasi build.
- Tidak diperiksa: pengujian visual di browser (tidak ada environment browser), audit dependensi (`npm audit` tidak diminta), dan seluruh file selain yang terkait temuan.

## Hasil perintah yang dijalankan
| Perintah | Hasil | Catatan |
|---|---|---|
| `grep -c '!important' src/App.css` | 105 | Kepadatan `!important` sangat tinggi |
| `grep -o 'btn:focus-visible{[^}]*}' node_modules/bootstrap/dist/css/bootstrap.min.css` | `outline:0;box-shadow:var(--bs-btn-focus-box-shadow)` | Fokus Bootstrap hanya bergantung pada box-shadow |
| `npx vite build --outDir /tmp/qa-dist-appcss --emptyOutDir` | **GAGAL** | `src/pages/auth/LoginPage.jsx:108:17 Expected '</Link>'` |
| Script kontras (WCAG) | lihat Saran | `#16a34a/#f0fdf4` = 3.15:1, `#dc2626/#fef2f2` = 4.41:1 |

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)
| Kontrol | Status | Bukti / temuan |
|---|---|---|
| A.8.25 siklus hidup pengembangan aman | Gagal | Build produksi tidak dapat dibuat (Temuan 1) |
| A.8.28 secure coding | Lulus dengan catatan | Tidak ada pola tidak aman di `App.css` (file presentasi) |
| A.8.32 manajemen perubahan | Tidak terverifikasi | Tidak ada gate CI lint/test; `.github/workflows` hanya `deploy.yml` |

## Matriks aspek
| Aspek | Status | Catatan singkat |
|---|---|---|
| Kebenaran fungsional | Gagal | Build gagal; selector global mengubah ukuran tombol topbar |
| Kualitas kode | Gagal | 105 `!important`, duplikasi aturan dengan theme, dead code |
| Pengujian | Tidak berlaku | Tidak ada test/style lint di proyek |
| Keamanan | Lulus dengan catatan | Tidak ada risiko langsung di CSS |
| Performa | Lulus dengan catatan | `backdrop-filter` dan animasi tak terbatas; sudah ada reset `prefers-reduced-motion` di theme |
| Keandalan | Lulus dengan catatan | `pulse` bergantung pada theme lain |
| Aksesibilitas | Gagal | Indikator fokus tombol hilang (2.4.7) |
| Dokumentasi | Lulus dengan catatan | Komentar seksi ada; tidak ada dokumentasi keputusan CSS |
| Build/CI | Gagal | Lihat Temuan 1 |

## Temuan

### [Blocker] Build gagal: tag `Link` ditutup dengan `</a>`
- Lokasi: `admin.kkpus.id/src/pages/auth/LoginPage.jsx:96` dan `admin.kkpus.id/src/pages/auth/LoginPage.jsx:108`
- Aspek / standar: Build/CI — ISO 27001 A.8.25
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```
  error during build:
  Build failed with 1 error:
       ╭─[ src/pages/auth/LoginPage.jsx:108:17 ]
       │
  108  │  </a>
       ╰── Expected `</Link>`
  ```
  Kode: baris 96 `<Link to="/" className="...">` … baris 108 `</a>`.
- Dampak: `vite build` gagal total; artefak rilis tidak bisa dibuat, `dist/` yang ada adalah hasil build lama. Dev server juga akan error pada file ini.
- Rekomendasi: ganti `</a>` di baris 108 menjadi `</Link>`, lalu jalankan ulang `npm run build`. Temuan ini tidak berasal dari `App.css`, tetapi dilaporkan lebih dulu karena memblokir rilis.

### [Major] Selector global `.btn.rounded-circle` menimpa semua tombol bulat di aplikasi
- Lokasi: `admin.kkpus.id/src/App.css:185-202`, `admin.kkpus.id/src/App.css:283-288`
- Aspek / standar: Kebenaran fungsional / maintainability (ISO 25010), WCAG 2.5.8 (ukuran target)
- Klasifikasi: ketidaksesuaian minor dengan dampak lebar
- Bukti: komentar menyebut "Tombol Aksi di Tabel Admin", tetapi selector-nya global:
  ```css
  .btn-action-table,
  .btn.rounded-circle,   /* ← semua tombol Bootstrap ber-rounded-circle */
  .btn-icon {
    width: 32px !important;
    height: 32px !important;
    padding: 0 !important;
    border: 1px solid transparent !important;
  }
  ```
  Korban konkret: `src/components/layout/NotificationDropdown.jsx:320` memakai `btn btn-topbar-action ... rounded-circle`. Ukuran yang dimaksud didefinisikan di `App.css:82-86`:
  ```css
  .btn-topbar-action { width: 38px; height: 38px; }   /* tanpa !important */
  ```
  Karena `!important` menang atas deklarasi normal, tombol notifikasi topbar menyusut 38px → 32px dan kehilangan padding.
- Dampak: regresi visual pada topbar, dan setiap tombol `.btn.rounded-circle` baru otomatis terkunci 32px tanpa disadari.
- Rekomendasi: hapus `.btn.rounded-circle` dari daftar selector; cukup gunakan class eksplisit `.btn-action-table` / `.btn-icon` (dan `.btn.rounded-circle` hanya jika di-scope, mis. `.custom-table-admin .btn.rounded-circle`).

### [Major] `box-shadow: none !important` mematikan cincin fokus keyboard
- Lokasi: `admin.kkpus.id/src/App.css:200`
- Aspek / standar: Aksesibilitas / WCAG 2.2 AA 2.4.7 (Focus Visible), ISO 25010 usability
- Klasifikasi: ketidaksesuaian minor dengan dampak aksesibilitas
- Bukti: Bootstrap menandai fokus hanya lewat box-shadow:
  ```css
  /* bootstrap.min.css */
  .btn:focus-visible{ ... outline:0; box-shadow:var(--bs-btn-focus-box-shadow) }
  ```
  sedangkan `App.css` memasang `box-shadow: none !important;` pada blok dasar yang berlaku di semua state (`.btn-action-table, .btn.rounded-circle, .btn-icon`, baris 185-202). Deklarasi `!important` mengalahkan `:focus-visible` milik Bootstrap.
- Dampak: tombol aksi tabel dan tombol ikon tidak menampilkan indikator fokus saat dinavigasi dengan Tab; pengguna keyboard kehilangan posisi fokus.
- Rekomendasi: batasi reset ke state normal (`:not(:focus-visible)`), atau tambahkan aturan eksplisit:
  ```css
  .btn-action-table:focus-visible,
  .btn-icon:focus-visible {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .45) !important;
    outline: 2px solid transparent;
  }
  ```

### [Minor] Duplikasi dan penyimpangan nilai dengan `styles/admin-theme.css`
- Lokasi: `admin.kkpus.id/src/App.css:28-32`, `:61-67`, `:69-74`, `:76-80`, `:131-151`
- Aspek / standar: Maintainability (ISO 25010)
- Klasifikasi: ketidaksesuaian minor
- Bukti: aturan yang sama didefinisikan dua kali dengan nilai berbeda:
  | Selector | `admin-theme.css` | `App.css` |
  |---|---|---|
  | `.fixed-header` | `overflow:hidden` | `overflow:visible !important` (baris 30) |
  | `.header-title` | `font-size: var(--font-size-base)` | `font-size: 0.95rem` (baris 62) |
  | `.header-subtitle` | `color:#00d9a6` | `color:#00e5b3` (baris 72) |
  | `.header-masjid-bg` | `background:url(/assets/images/masjid.png)` | hanya override di media query (baris 147-150) |
- Dampak: sumber kebenaran ganda; perubahan tema tidak konsisten, dan override `overflow` bergantung pada urutan impor (`App.jsx:7-8`).
- Rekomendasi: satukan definisi header di satu file (theme) dan sisakan hanya override yang benar-benar perlu di `App.css`.

### [Minor] Animasi `pulse` bergantung pada keyframes di file lain
- Lokasi: `admin.kkpus.id/src/App.css:98`
- Aspek / standar: Maintainability / keandalan
- Klasifikasi: ketidaksesuaian minor
- Bukti: `animation: pulse 2s infinite;` — `@keyframes pulse` hanya ada di `src/styles/admin-theme.css`. Bila theme diganti/dihapus, animasi badge berhenti tanpa error.
- Dampak: kerusakan senyap saat refactor CSS.
- Rekomendasi: pindahkan keyframes ke file yang menggunakannya atau dokumentasikan dependensinya.

### [Minor] Dead code `.App { text-align: center }`
- Lokasi: `admin.kkpus.id/src/App.css:1-3`
- Aspek / standar: Maintainability
- Klasifikasi: ketidaksesuaian minor
- Bukti: `grep -rn 'className="App"' src` → tidak ada hasil; class tidak dipakai komponen mana pun.
- Dampak: CSS mati, menambah kebingungan.
- Rekomendasi: hapus.

### [Saran] Kepadatan `!important` (105 kemunculan)
- Lokasi: seluruh `admin.kkpus.id/src/App.css`
- Aspek / standar: Maintainability
- Klasifikasi: peluang perbaikan
- Bukti: `grep -c '!important' src/App.css` → `105` pada 366 baris.
- Dampak: menyulitkan override lain (termasuk oleh komponen), mempersulit pemeliharaan, dan menjadi penyebab langsung Temuan 2 dan 3.
- Rekomendasi: turunkan spesifisitas secara bertahap; prioritas pada rule yang memicu regresi (blok tombol aksi) dan rule yang mematikan state fokus.

### [Saran] Kontras teks di tombol aksi berada di batas/ bawah ambang
- Lokasi: `admin.kkpus.id/src/App.css:235` (`#16a34a` di `#f0fdf4`), `admin.kkpus.id/src/App.css:271` (`#dc2626` di `#fef2f2`)
- Aspek / standar: WCAG 2.2 AA 1.4.3 / 1.4.11
- Klasifikasi: peluang perbaikan
- Bukti: rasio kontras terukur 3.15:1 dan 4.41:1. Lolos ambang komponen non-teks (3:1) tetapi gagal ambang teks normal (4.5:1) bila tombol memuat label teks.
- Dampak: keterbacaan rendah bagi pengguna low vision jika tombol berisi teks.
- Rekomendasi: jika tombol hanya ikon, tidak ada aksi wajib; jika ada teks, gelapkan warna (`#15803d`, `#b91c1c`).

## Hal yang sudah baik
- Struktur file rapi: dikelompokkan per seksi dengan komentar pembatas yang jelas (`Header/Topbar`, `Jual Beli`, `Tabel Admin`).
- Sudah tersedia blok `prefers-reduced-motion` global di `admin-theme.css`, sehingga animasi `pulse`/transisi ikut dinonaktifkan bagi pengguna yang memintanya.
- Penanganan responsif untuk header (`@media (max-width: 575.98px)`, baris 131-151) lengkap: tinggi header, ukuran logo, dan padding logout disesuaikan.
- Dukungan lintas browser untuk efek blur sudah disertakan (`backdrop-filter` + `-webkit-backdrop-filter`, baris 118-119).

## Langkah lanjutan
1. Perbaiki `LoginPage.jsx:108` (`</a>` → `</Link>`) dan jalankan `npm run build` sampai lulus — ini prasyarat rilis.
2. Hapus `.btn.rounded-circle` dari blok `App.css:185-202` dan `:283-288`, verifikasi tombol notifikasi topbar kembali 38px.
3. Tambahkan aturan `:focus-visible` eksplisit untuk tombol aksi tabel, lalu uji navigasi Tab.
4. Satukan definisi header dengan `admin-theme.css` dan hapus `.App` yang tidak terpakai.
5. Tambahkan gate CI minimal: `npm run build` + stylelint (`.github/workflows/deploy.yml` saat ini hanya deploy).
