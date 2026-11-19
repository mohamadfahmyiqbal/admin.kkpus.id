# Laporan QA: `admin.kkpus.id/public/`

Tanggal: 2026-11-18
Mode: read-only (tidak ada file produksi diubah)

## Ringkasan
- Keputusan: LAYAK DENGAN CATATAN
- Jumlah temuan: Blocker 0, Major 3, Minor 4, Saran 2
- `push-sw.js` berfungsi untuk alur dasar (tampilkan notifikasi + buka window) dan ikon PWA sudah lengkap termasuk versi maskable. Tiga risiko utama: URL notifikasi tidak divalidasi origin-nya (bisa dipakai untuk phishing bila payload push dikendalikan pihak lain), `robots.txt` tidak ikut ter-deploy sehingga panel admin bisa diindeks mesin pencari, dan aset gambar tidak dioptimalkan (≈1.4 MB untuk logo + background).

## Standar yang dipakai
- Tidak ada standar tertulis di repo (tanpa ESLint/Prettier/test config; `package.json` hanya `dev`/`build`/`preview`).
- Baseline: OWASP Top 10 (A01 Broken Access Control, A05 Security Misconfiguration), OWASP ASVS 14.x (konfigurasi), ISO/IEC 27001:2022 A.8.26, A.8.28, A.8.9, A.8.12, WCAG 2.2 AA 1.4.11, dan praktik Web Push/W3C.
- Konteks build: `vite.config.js:28-34` (`includeAssets`), `vite.config.js:91-120` (Workbox).

## Cakupan
- Diperiksa: `public/push-sw.js` (66 baris, seluruh isi), `public/assets/icons/*` (7 file), `public/assets/images/masjid.png`, serta konsistensi dengan `vite.config.js` dan `index.html`.
- Tidak diperiksa: layanan push server (di luar repo), `sw.js` hasil generate Workbox di `dist/`, dan uji runtime di browser/device nyata.

## Hasil perintah yang dijalankan
| Perintah | Hasil | Catatan |
|---|---|---|
| `ls -la public/` | hanya `assets/` dan `push-sw.js` | **tidak ada** `robots.txt` |
| `ls dist/robots.txt` | `No such file or directory` | `includeAssets: ['robots.txt']` tidak menghasilkan artefak |
| `git ls-files public` | 9 file | seluruh ikon + push-sw.js ter-track |
| `git ls-files assets \| wc -l` | 71 | sisa build CRA di root ikut ter-commit (6.6 MB) |
| `du -sh public/assets/images/masjid.png` (via `ls -la`) | 1,107,847 byte | satu file PNG |
| Pemeriksaan dimensi PNG (script `struct`) | `PUSlogo.png` 1181×1181 (296 KB); `pwa-192x192` 192×192; `pwa-512x512` 512×512; `pwa-maskable-512x512` 512×512; `apple-touch-icon` 180×180 | semua dimensi sesuai deklarasi |
| `grep masjid-*.png dist/assets/*.css` | `LoginPage-CqywRUqq.css: masjid-CP23IKHJ-CP23IKHJ.png` | URL `/assets/masjid-CP23IKHJ.png` di-resolve dari folder root `assets/`, bukan `public/` |

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)
| Kontrol | Status | Bukti / temuan |
|---|---|---|
| A.8.26 persyaratan keamanan aplikasi | Gagal | URL notifikasi diterima apa adanya → potensi phishing (Temuan 1) |
| A.8.28 secure coding | Lulus dengan catatan | Tidak ada eval/injeksi; validasi input push kurang |
| A.8.9 manajemen konfigurasi | Gagal | `robots.txt` tidak ter-deploy; artefak build `assets/` di root ter-commit |
| A.8.12 pencegahan kebocoran data | Lulus dengan catatan | Tidak ada PII di service worker; namun panel admin dapat diindeks tanpa robots |
| A.8.15 logging | Tidak berlaku | Service worker tidak melakukan logging |
| A.8.8 kerentanan teknis | Tidak terverifikasi | `npm audit` tidak dijalankan (di luar cakupan folder) |

## Matriks aspek
| Aspek | Status | Catatan singkat |
|---|---|---|
| Kebenaran fungsional | Lulus dengan catatan | Push tampil dan klik membuka window; tidak ada penanganan subscription berubah |
| Kualitas kode | Lulus dengan catatan | Handler ringkas; `try/catch` terlalu sempit |
| Pengujian | Tidak berlaku | Tidak ada test untuk service worker |
| Keamanan | Gagal | URL notifikasi tidak divalidasi; robots.txt tidak ada |
| Performa | Gagal | 1.1 MB `masjid.png` + 289 KB logo 1181px |
| Keandalan | Lulus dengan catatan | Tidak ada `pushsubscriptionchange` |
| Aksesibilitas | Lulus dengan catatan | Ikon maskable tersedia; badge notifikasi bukan monokrom |
| Build/CI | Lulus dengan catatan | Aset masuk precache dengan benar; robots.txt terlewat |

## Temuan

### [Major] URL dari payload push tidak divalidasi — bisa dipakai membuka situs eksternal/phishing
- Lokasi: `admin.kkpus.id/public/push-sw.js:45`, `:57`, `:62`
- Aspek / standar: Keamanan / OWASP A01+A05 / ISO 27001 A.8.26
- Klasifikasi: ketidaksesuaian minor dengan dampak keamanan
- Bukti:
  ```js
  const targetUrl = event.notification.data?.url || "/";   // baris 45
  ...
    if (client.url.includes(self.location.origin) && "focus" in client) {
      client.navigate(targetUrl);                          // baris 57 — tanpa cek origin targetUrl
      return client.focus();
    }
  ...
    return clients.openWindow(targetUrl);                  // baris 62 — menerima URL absolut apa pun
  ```
  Pemeriksaan `client.url.includes(self.location.origin)` hanya memeriksa **window yang ditemukan**, bukan URL tujuan. Nilai `data.url` juga disalin mentah dari payload (`:34`).
- Dampak: Jika payload push dapat dikendalikan (kompromi server push, kredensial VAPID bocor, atau integrasi pihak ketiga), penyerang dapat menampilkan notifikasi resmi berisi teks bebas yang mengarah ke situs tiruan — vektor phishing berbekal domain tepercaya. Skema `javascript:`/`data:` juga tidak diblokir eksplisit.
- Rekomendasi:
  ```js
  const origin = self.location.origin;
  function safeUrl(raw) {
    try {
      const u = new URL(raw || "/", origin);
      if (u.origin !== origin) return "/";
      if (!["http:", "https:"].includes(u.protocol)) return "/";
      return u.href;
    } catch { return "/"; }
  }
  ```

### [Major] `robots.txt` tidak ter-deploy, panel admin dapat diindeks mesin pencari
- Lokasi: `admin.kkpus.id/vite.config.js:32` (referensi) vs `admin.kkpus.id/robots.txt:1-2` (lokasi file), bukti `admin.kkpus.id/dist/robots.txt` tidak ada
- Aspek / standar: Keamanan / OWASP A05 Security Misconfiguration / ISO 27001 A.8.9, A.8.12
- Klasifikasi: ketidaksesuaian minor dengan dampak paparan informasi
- Bukti:
  ```
  $ ls public/
  assets  push-sw.js            # tidak ada robots.txt
  $ ls dist/robots.txt
  ls: cannot access 'dist/robots.txt': No such file or directory
  $ cat robots.txt
  User-agent: *
  Disallow: /
  ```
  `includeAssets` di `vite.config.js:32` mendaftarkan `robots.txt`, tetapi Vite hanya menyalinnya dari `publicDir` (`public/`). File sebenarnya berada di root proyek.
- Dampak: Aturan `Disallow: /` tidak pernah sampai ke server produksi; halaman login/backoffice berpotensi muncul di hasil pencarian dan arsip crawler.
- Rekomendasi: pindahkan `robots.txt` ke `public/robots.txt` (atau salin lewat pipeline deploy), lalu verifikasi `dist/robots.txt` ada setelah `npm run build`.

### [Major] Aset gambar tidak dioptimalkan: 1.1 MB background + logo 289 KB untuk ukuran 38 px
- Lokasi: `admin.kkpus.id/public/assets/images/masjid.png:1` (1,107,847 byte), `admin.kkpus.id/public/assets/icons/PUSlogo.png:1` (296,303 byte, 1181×1181)
- Aspek / standar: Performa / ISO 25010 performance efficiency / Core Web Vitals (LCP)
- Klasifikasi: ketidaksesuaian minor dengan dampak performa
- Bukti: `masjid.png` 1.1 MB dipakai `admin.kkpus.id/src/styles/admin-theme.css` (`.header-masjid-bg`, `background:url(/assets/images/masjid.png)`) dan dimuat pada setiap halaman. `PUSlogo.png` 1181×1181 (289 KB) ditampilkan dengan `height: 38px`–`42px` (`src/App.css:49-55`, `src/pages/auth/LoginPage.css:118-121`) dan sebagai `img` di `src/pages/auth/SplashPage.jsx:101`.
- Dampak: ±1.4 MB transfer tambahan pada setiap kunjungan, terutama merugikan pengguna mobile/3G; halaman admin yang seharusnya ringan menjadi lambat pada cold cache. (Catatan: `globIgnores: ['**/masjid*.*']` di `vite.config.js:95` sudah mencegah precache — penghematan ini hilang jika aset di-hard-refresh.)
- Rekomendasi: konversi ke WebP/AVIF (target < 150 KB untuk background, < 20 KB untuk logo), sajikan versi 1×/2× untuk logo, dan tambahkan `fetchpriority`/`loading` yang sesuai.

### [Minor] `.text()` dipanggil di luar `try/catch`
- Lokasi: `admin.kkpus.id/public/push-sw.js:9`vs `:30-37`
- Aspek / standar: Keandalan / secure coding
- Klasifikasi: ketidaksesuaian minor
- Bukti:
  ```js
  const rawText = event.data.text();   // baris 9 — di luar try
  ...
  try { const data = JSON.parse(rawText); ... } catch (error) { options.body = rawText; }
  ```
- Dampak: Push tanpa payload teks valid dapat melempar error sebelum jalur fallback, sehingga handler berhenti dan notifikasi tidak tampil.
- Rekomendasi: pindahkan `event.data.text()` ke dalam `try`, dengan fallback ke `event.data.json()` atau teks statis.

### [Minor] Tidak ada penanganan `pushsubscriptionchange`
- Lokasi: `admin.kkpus.id/public/push-sw.js:1-66` (tidak ada listener)
- Aspek / standar: Keandalan / Web Push (W3C)
- Klasifikasi: ketidaksesuaian minor
- Bukti: hanya dua listener terdaftar — `push` (`:4`) dan `notificationclick` (`:42`). Browser dapat merotasi/kedaluwarsakan langganan; tanpa handler ini langganan baru tidak pernah dikirim ke backend.
- Dampak: Notifikasi berhenti diam-diam untuk sebagian pengguna; sulit dideteksi karena tidak ada error di klien.
- Rekomendasi: tambahkan listener `pushsubscriptionchange` yang mem-POST `event.newSubscription` ke endpoint langganan backend (dengan autentikasi), atau perbarui langganan saat aplikasi dibuka.

### [Minor] `showNotification` tidak menangani kegagalan izin
- Lokasi: `admin.kkpus.id/public/push-sw.js:39`
- Aspek / standar: Keandalan
- Klasifikasi: ketidaksesuaian minor
- Bukti: `event.waitUntil(self.registration.showNotification(title, options));` tanpa `.catch`. Bila izin dicabut atau `options` tidak valid, promise ditolak tanpa penanganan.
- Dampak: rejection pada `waitUntil` tercatat sebagai error service worker; tidak ada umpan balik yang bisa ditindaklanjuti.
- Rekomendasi: `.catch((err) => { /* log minimal, jangan kirim PII */ })`.

### [Minor] Ikon `badge` notifikasi memakai ikon berwarna 192 px
- Lokasi: `admin.kkpus.id/public/push-sw.js:13` (dan `:20`, `:25`)
- Aspek / standar: Usability / panduan notifikasi Android
- Klasifikasi: ketidaksesuaian minor
- Bukti: `badge: "/assets/icons/pwa-192x192.png"` — `badge` dirender monokrom pada status bar Android; idealnya 72–96 px hitam-putih.
- Dampak: Badge tampil kecil/blur atau tampak sebagai kotak putih.
- Rekomendasi: sediakan `badge-96x96.png` monokrom dan pakai untuk `badge`; pertahankan ikon 192 px hanya untuk `icon`.

### [Minor] Folder `assets/` sisa build CRA ter-commit dan masih menjadi sumber aset
- Lokasi: `admin.kkpus.id/assets/` (71 file, 6.6 MB); `.gitignore:25-27`; referensi `admin.kkpus.id/src/pages/auth/LoginPage.css:23`
- Aspek / standar: Manajemen konfigurasi / ISO 27001 A.8.9, A.8.25
- Klasifikasi: ketidaksesuaian minor
- Bukti: `git ls-files assets | wc -l` → `71`; `du -sh assets` → `6.6M`. `LoginPage.css:23` memakai `url(/assets/masjid-CP23IKHJ.png)` — file itu hanya ada di `assets/` root, sehingga build Vite me-resolve-nya menjadi `dist/assets/masjid-CP23IKHJ-CP23IKHJ.png`. `.gitignore` mengabaikan `dist` tetapi tidak `assets`.
- Dampak: Repo membengkak oleh bundel JS lama (termasuk kode yang sudah tidak dipakai), dan CSS bergantung pada direktori yang seharusnya tidak ada. Jika `assets/` dibersihkan, background login hilang tanpa error build.
- Rekomendasi: pindahkan `LoginPage.css` agar menunjuk `/assets/images/masjid.png` di `public/`, hapus folder root `assets/` dari git, dan tambahkan `assets/` ke `.gitignore` (atau batasi pola seperti `/assets/*.js`).

### [Saran] Tidak ada `tag`/`renotify` pada notifikasi
- Lokasi: `admin.kkpus.id/public/push-sw.js:11-28`
- Aspek / standar: Usability
- Klasifikasi: peluang perbaikan
- Bukti: `options` tidak memiliki `tag`. Notifikasi berulang (mis. banyak pengajuan) akan menumpuk dan mengganggu.
- Rekomendasi: gunakan `tag` per kategori (mis. `tag: data.type || "pus-notif"`) dan `renotify: true` bila ingin alert ulang.

### [Saran] Jangan simpan artefak laporan QA di dalam `public/`
- Lokasi: `admin.kkpus.id/public/`
- Aspek / standar: Higiene rilis
- Klasifikasi: peluang perbaikan
- Bukti: semua isi `public/` disalin apa adanya ke `dist/` saat build, sehingga file `.md` apa pun di sini akan ikut ter-publish dan dapat diakses publik.
- Rekomendasi: laporan ini disimpan di `admin.kkpus.id/QA_Report_public.md` (di luar `public/`). Terapkan hal yang sama untuk laporan lain.

## Hal yang sudah baik
- Ikon PWA lengkap dan benar ukurannya: 16/32/180/192/512 plus `pwa-maskable-512x512.png` dengan `purpose: "maskable"` (`vite.config.js:49-80`).
- Manifest PWA memakai atribut yang tepat: `id`, `scope`, `start_url`, `lang: 'id'`, `dir: 'ltr'`, `theme_color`.
- `vite.config.js:99-106`: seluruh endpoint API di-`NetworkOnly`, jadi service worker tidak pernah menyimpan data sensitif ke cache — keputusan yang tepat.
- `push-sw.js:5` memeriksa `event.data` sebelum diproses, dan `:30-37` menyediakan fallback teks biasa saat JSON gagal di-parse.
- `notificationclick` menutup notifikasi lebih dulu (`:43`) dan memusatkan window yang sudah ada sebelum membuka tab baru (`:55-63`) — pola yang benar.
- Aset berat seperti `masjid.png` dikecualikan dari precache (`vite.config.js:95`), sehingga tidak memperbesar kerja `sw.js` saat instalasi.

## Langkah lanjutan
1. Tambahkan validasi origin + skema pada `targetUrl` di `push-sw.js` (Temuan 1) — perbaikan ±10 baris, dampak keamanan terbesar di folder ini.
2. Pindahkan `robots.txt` ke `public/` dan pastikan `dist/robots.txt` ada setelah build (Temuan 2).
3. Kompres `masjid.png` dan `PUSlogo.png` ke WebP/AVIF + ukuran tampil (Temuan 3).
4. Tambahkan listener `pushsubscriptionchange` dan `.catch()` pada `showNotification`.
5. Bersihkan folder root `assets/` dan perbaiki referensi `LoginPage.css:23` agar memakai aset dari `public/`.
6. Tambahkan uji manual terdaftar untuk push: payload valid, payload rusak, izin dicabut, langganan kedaluwarsa, klik dari state app tertutup.
