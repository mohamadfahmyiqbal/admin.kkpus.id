# Laporan QA: `admin.kkpus.id/src/routes/`

Tanggal: 2026-11-18
Mode: read-only (tidak ada file produksi diubah)

## Ringkasan
- Keputusan: TIDAK LAYAK
- Jumlah temuan: Blocker 1, Major 5, Minor 4, Saran 2
- Hanya ada 3 file (213 baris) dan semuanya menjadi pintu masuk seluruh aplikasi. Arsitektur "satu rute `/:token` + lazy per halaman" sudah tepat untuk code-splitting, tetapi **otorisasi rute hanya mengecek keberadaan string di `localStorage`**, **enam nama rute dirender sebagai Dashboard** (menu Settings/Account/Billing membuka halaman yang salah), **tidak ada error boundary** sehingga kegagalan chunk menghasilkan layar putih, dan **navigasi ke `/` menghapus cookie + sessionStorage** milik pengguna yang sedang login.

## Standar yang dipakai
- Tidak ada standar tertulis (tanpa ESLint/Prettier/test config; `package.json` hanya `dev`/`build`/`preview`).
- Baseline: OWASP Top 10 (A01 Broken Access Control, A04 Insecure Design), OWASP ASVS 4.x (session), CWE-863, ISO/IEC 27001:2022 A.8.3, A.8.26, A.8.28, A.8.25; ISO/IEC 25010 (security, reliability, maintainability); WCAG 2.2 AA (state loading/error).

## Cakupan
- Diperiksa: `RouterConfig.jsx` (18 baris), `EncryptedPage.jsx` (61 baris), `PageRoutes.jsx` (134 baris), ditambah interaksi dengan `components/layout/LayoutGlobal.jsx`, `components/layout/SidebarNav.jsx`, `pages/auth/SplashPage.jsx`, dan `utils/helpers/index.js`.
- Tidak diperiksa: otorisasi di backend (di luar repo) dan perilaku history browser secara runtime.

## Hasil perintah yang dijalankan
| Perintah | Hasil | Catatan |
|---|---|---|
| `grep -rn "errorElement\|ErrorBoundary" src` | **0 hasil** | Tidak ada penanganan error rute/komponen |
| `grep -rn "decodedToken" src` | 1 hasil (`EncryptedPage.jsx:50`) | Prop dikirim, tidak pernah dibaca |
| `node -e '...PAGE_COMPONENTS[k]...'` untuk `constructor`, `toString`, `__proto__` | ketiganya truthy, `component` = `undefined` | Kunci warisan prototipe lolos pengecekan |
| `grep -rn 'to="/"' src` | `pages/auth/LoginPage.jsx:96` | Logo mengarah ke `/` → splash |
| `grep -n "roles" components/layout/SidebarNav.jsx` | hanya `:270` (teks peran) | Menu tidak difilter per peran |
| `npx vite build` (audit sebelumnya, repo sama) | **GAGAL** — `src/pages/auth/LoginPage.jsx:108` | Bundel produksi tidak dapat dibuat |

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)
| Kontrol | Status | Bukti / temuan |
|---|---|---|
| A.8.3 pembatasan akses informasi | Gagal | Gate rute hanya `localStorage.token` truthy (T2) |
| A.8.26 persyaratan keamanan aplikasi | Gagal | Tidak ada RBAC per rute; menu semua peran tampil |
| A.8.28 secure coding | Gagal | Akses properti tanpa `hasOwnProperty` (T6); tanpa error boundary (T5) |
| A.8.25 siklus hidup pengembangan aman | Gagal | Build rusak (T1) |
| A.8.15 logging | Lulus dengan catatan | Hanya `console.error` saat token gagal decode |
| A.8.5 autentikasi aman | Lulus dengan catatan | Sesi tidak diverifikasi di titik masuk |

## Matriks aspek
| Aspek | Status | Catatan singkat |
|---|---|---|
| Kebenaran fungsional | Gagal | 6 rute menampilkan Dashboard yang salah |
| Kualitas kode | Lulus dengan catatan | Struktur jelas, peta rute deklaratif, lazy konsisten |
| Pengujian | Tidak berlaku | Tidak ada test |
| Keamanan | Gagal | Gate token & RBAC (T2) |
| Performa | Lulus | Semua halaman di-`lazy()` |
| Keandalan | Gagal | Tidak ada error boundary (T5); crash prototipe (T6) |
| Aksesibilitas | Lulus dengan catatan | Loader punya `role="status"` + teks tersembunyi |
| Dokumentasi | Lulus dengan catatan | Komentar singkat pada pengecekan auth |
| Build/CI | Gagal | Lihat T1 |

## Temuan

### [Blocker] Build produksi gagal — rute `authLogin` tidak dapat dikompilasi
- Lokasi: `admin.kkpus.id/src/pages/auth/LoginPage.jsx:96` dan `:108` (dimuat oleh `admin.kkpus.id/src/routes/PageRoutes.jsx:9`)
- Aspek / standar: Build / ISO 27001 A.8.25
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```
  ╭─[ src/pages/auth/LoginPage.jsx:108:17 ]
  108 │  </a>
      ╰── Expected `</Link>`
  ```
  `<Link to="/" ...>` dibuka pada baris 96, ditutup `</a>`.
- Dampak: `npm run build` gagal total; seluruh peta rute tidak pernah sampai ke produksi.
- Rekomendasi: ubah `</a>` menjadi `</Link>`, lalu jalankan `npm run build` sampai lulus.

### [Major] Otorisasi rute hanya mengecek keberadaan token; tidak ada RBAC per peran
- Lokasi: `admin.kkpus.id/src/routes/EncryptedPage.jsx:41-46`; menu terkait `admin.kkpus.id/src/components/layout/SidebarNav.jsx:243-271`
- Aspek / standar: Keamanan / OWASP A01 / CWE-863 / ISO 27001 A.8.3, A.8.26
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  if (isProtected) {
    const authToken = localStorage.getItem("token");
    if (!authToken) return <Navigate to="/" replace />;   // hanya cek keberadaan
  }
  ```
  `grep -n "roles" SidebarNav.jsx` hanya menemukan `:270` (menampilkan teks peran); tidak ada filter menu. Tidak ada properti `roles` pada 25 entri `PAGE_COMPONENTS` (`PageRoutes.jsx:3-132`).
- Dampak: (1) string apa pun di `localStorage.token` membuka seluruh halaman `isProtected`; (2) peran `bendahara`/`pengawas` dapat membuka rute konfigurasi & approval yang bukan wewenangnya, dan semua menu tampil untuk semua peran. Jika backend tidak menolak, ini eskalasi hak akses; jika backend menolak, ini kebocoran UI dan UX menyesatkan.
- Rekomendasi: tambahkan `roles: ["admin", ...]` pada tiap entri `PAGE_COMPONENTS`, verifikasi token (decode JWT + cek `exp`) sebelum render, dan tolak rute yang tidak sesuai peran. Contoh:
  ```js
  const allowed = routeConfig.roles;
  if (isProtected && (!authToken || (allowed && !allowed.some(r => userRoles.includes(r))))) {
    return <Navigate to="/" replace />;
  }
  ```

### [Major] Enam nama rute dirender sebagai Dashboard
- Lokasi: `admin.kkpus.id/src/routes/PageRoutes.jsx:108-131`
- Aspek / standar: Kebenaran fungsional / ISO 25010 functional suitability
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  reportsPage:       { component: lazy(() => import("../pages/dashboard/Dashboard")), ... },
  settingsPage:      { component: lazy(() => import("../pages/dashboard/Dashboard")), ... },
  accountPage:       { component: lazy(() => import("../pages/dashboard/Dashboard")), ... },
  registrationsPage: { component: lazy(() => import("../pages/dashboard/Dashboard")), ... },
  billingPage:       { component: lazy(() => import("../pages/dashboard/Dashboard")), ... },
  transactionsPage:  { component: lazy(() => import("../pages/dashboard/Dashboard")), ... },
  ```
- Dampak: Pengguna yang memilih menu "Pengaturan", "Akun", "Tagihan", "Pendaftaran", "Transaksi", atau "Laporan" akan melihat Dashboard. Tidak ada indikator bahwa fitur belum tersedia, sehingga pengguna mengira datanya kosong/salah. URL juga tampak sah (token valid), menyulitkan pelaporan bug.
- Rekomendasi: jika belum ada komponennya, arahkan ke `EmptyState`/`ApprovalPlaceholder` dengan pesan "Fitur belum tersedia", atau hapus entri dan menu terkait sampai halaman siap.

### [Major] Navigasi ke `/` menghapus cookie dan `sessionStorage` pengguna yang sedang login
- Lokasi: `admin.kkpus.id/src/routes/RouterConfig.jsx:7-10` → `admin.kkpus.id/src/pages/auth/SplashPage.jsx:40-68`; pemicu `admin.kkpus.id/src/pages/auth/LoginPage.jsx:96`
- Aspek / standar: Keandalan / keamanan sesi / ISO 27001 A.8.5
- Klasifikasi: ketidaksesuaian mayor
- Bukti: rute `/` **selalu** me-redirect ke `globalSplash`:
  ```jsx
  { path: "/", element: <Navigate to={`/${jwtEncode({ page: "globalSplash" })}`} replace /> }
  ```
  dan `SplashPage` menghapus seluruh cookie (termasuk `domain=${hostname}` dan `.${rootDomain}`) serta `sessionStorage.clear()` pada setiap mount (`SplashPage.jsx:44-61`).
- Dampak: Klik logo ("Paguyuban Usaha Sukses") atau membuka `/` menghapus cookie sesi seluruh subdomain dan isi `sessionStorage`, lalu menampilkan splash 3 detik dan halaman login. Pengguna yang masih memiliki `localStorage.token` mendapati aplikasi "setengah logout" (UI masuk, sesi cookie hilang → 401 pada API yang mengandalkan cookie). Pola "GET yang menghapus state" juga dapat dipicu tautan/iframe pihak ketiga (logout paksa).
- Rekomendasi: jangan menghapus cookie di splash; lakukan pembersihan hanya pada aksi logout eksplisit. Untuk `/`, arahkan ke dashboard bila `token` ada dan ke login bila tidak.

### [Major] Tidak ada error boundary / `errorElement` — kegagalan chunk menghasilkan layar putih
- Lokasi: `admin.kkpus.id/src/routes/EncryptedPage.jsx:48-52`; `admin.kkpus.id/src/routes/RouterConfig.jsx:5-16`
- Aspek / standar: Keandalan / ISO 25010 reliability / WCAG 2.2 (state error)
- Klasifikasi: ketidaksesuaian mayor
- Bukti: `grep -rn "errorElement\|ErrorBoundary" src` → **0 hasil**. `react-error-boundary` sudah ada di `package.json` tetapi tidak dipakai. Semua halaman dimuat via `lazy()` + `<Suspense>` yang hanya menangani state loading, bukan penolakan promise chunk.
- Dampak: Setelah deploy baru, klien dengan service worker lama dapat gagal mengambil `assets/xxx-hash.js` (404). React akan melempar error tanpa penangkap → layar putih total tanpa pesan dan tanpa jalan pulih. Hal yang sama terjadi jika satu halaman melempar error saat render.
- Rekomendasi: bungkus `<RouterProvider>` dengan `<ErrorBoundary>` dan isi `errorElement` pada `createBrowserRouter`, dengan tombol "Muat ulang" (dan opsi `window.location.reload()`), karena chunk mismatch hanya bisa dipulihkan dengan reload.

### [Minor] Kunci prototipe dapat membuat aplikasi crash
- Lokasi: `admin.kkpus.id/src/routes/EncryptedPage.jsx:32-34`
- Aspek / standar: Keamanan / CWE-1321 (prototype key access) / keandalan
- Klasifikasi: ketidaksesuaian minor dengan dampak DoS klien
- Bukti:
  ```js
  const routeConfig = PAGE_COMPONENTS[pageName];
  if (!decodedData || !routeConfig) return <Navigate to="/" replace />;
  ```
  Token dengan `page: "constructor"` (atau `"toString"`, `"__proto__"`) membuat `PAGE_COMPONENTS[pageName]` mengembalikan properti warisan `Object.prototype`. Diverifikasi dengan Node:
  ```
  constructor true undefined undefined
  toString    true undefined undefined
  __proto__   true undefined undefined
  ```
  `routeConfig` truthy, tetapi `component` = `undefined` → `<PageComponent />` merender elemen `undefined` → React melempar "Element type is invalid".
- Dampak: Siapa pun dapat membuat tautan `/<token>` yang membuat aplikasi crash (layar putih) di browser korban — cukup dengan mengirim URL.
- Rekomendasi: gunakan `Object.hasOwn(PAGE_COMPONENTS, pageName)` atau definisikan peta dengan `Object.create(null)`/`Map`. Tambahkan juga whitelist `typeof pageName === "string"`.

### [Minor] Token rute tidak divalidasi masa berlakunya
- Lokasi: `admin.kkpus.id/src/routes/EncryptedPage.jsx:22-29` (via `utils/helpers/index.js:27-44`)
- Aspek / standar: Keamanan sesi / ISO 27001 A.8.5
- Klasifikasi: ketidaksesuaian minor
- Bukti: `jwtEncode` menulis `_exp` (24 jam) di `helpers/index.js:7`, tetapi `jwtDecodePage` tidak pernah memeriksanya; `EncryptedPage` hanya memakai `decodedData.page`.
- Dampak: URL lama (mis. dari riwayat atau pesan chat) tetap membuka halaman terkait selamanya, meskipun dimaksudkan kedaluwarsa.
- Rekomendasi: tolak `decodedData._exp < Date.now()` dan redirect ke login.

### [Minor] Tidak ada rute 404 / pesan "tautan tidak valid"
- Lokasi: `admin.kkpus.id/src/routes/EncryptedPage.jsx:34-35`, `:43-44`
- Aspek / standar: UI/UX / WCAG 2.2 (pesan error jelas)
- Klasifikasi: ketidaksesuaian minor
- Bukti: semua kegagalan (`!decodedData`, `!routeConfig`, tanpa token) melakukan `<Navigate to="/" replace />`, yang kembali ke splash → login.
- Dampak: Pengguna yang membuka tautan rusak/kedaluwarsa tidak tahu penyebabnya; mereka hanya melihat splash dan diminta login ulang, lalu mengira sesinya habis.
- Rekomendasi: tampilkan halaman "Tautan tidak valid atau kedaluwarsa" dengan tombol kembali ke dashboard/login.

### [Minor] Prop `decodedToken` dikirim ke semua halaman tetapi tidak pernah dipakai
- Lokasi: `admin.kkpus.id/src/routes/EncryptedPage.jsx:50`
- Aspek / standar: Maintainability
- Klasifikasi: ketidaksesuaian minor
- Bukti: `<PageComponent decodedToken={decodedData} />`; `grep -rn "decodedToken" src` → hanya baris ini (tidak ada halaman yang menerima/membacanya).
- Dampak: Kontrak antar-komponen menyesatkan; pengembang baru bisa mengira ada data halaman yang diteruskan.
- Rekomendasi: hapus prop, atau dokumentasikan jika direncanakan dipakai.

### [Saran] Dua nama rute untuk satu halaman yang sama
- Lokasi: `admin.kkpus.id/src/routes/PageRoutes.jsx:32-39`
- Aspek / standar: Maintainability
- Bukti: `jualBeliReportPage` dan `jualBeliReport` sama-sama memuat `../pages/jualBeli/JualBeliReport`.
- Rekomendasi: pertahankan satu nama dan alihkan pembuat tautan lama, agar tidak ada dua URL berbeda untuk konten identik (masalah bookmark/analytics).

### [Saran] `React.memo` pada komponen rute tidak memberi manfaat
- Lokasi: `admin.kkpus.id/src/routes/EncryptedPage.jsx:15`
- Aspek / standar: Performa/maintainability
- Bukti: `export const EncryptedPage = React.memo(() => { ... })` tanpa props; komponen hanya bergantung pada `useParams` dan selalu di-render ulang saat token berubah.
- Rekomendasi: hapus `React.memo` agar tidak menyesatkan pembaca.

## Hal yang sudah baik
- Semua halaman dimuat dengan `lazy()` sehingga bundel awal kecil dan pemisahan per modul tercapai.
- `Suspense` fallback berupa loader yang punya `role="status"` + `visually-hidden` ("Loading...") — ramah pembaca layar.
- Rute tidak dikenal tidak pernah merender komponen sembarang: ada pengecekan `!decodedData || !routeConfig` sebelum render.
- `window.scrollTo(0, 0)` dipanggil setiap token berubah (navigasi tidak menyisakan posisi scroll halaman sebelumnya).
- `createBrowserRouter` dipakai (bukan `HashRouter`), dan navigasi memakai `replace` saat redirect, sehingga tombol Back tidak terjebak loop.
- Peta rute bersifat deklaratif dan terpusat (`PageRoutes.jsx`), memudahkan audit cakupan halaman.

## Langkah lanjutan
1. Perbaiki Blocker `LoginPage.jsx:108` (`</a>` → `</Link>`) dan jalankan `npm run build` sampai hijau.
2. Tambahkan properti `roles` pada `PAGE_COMPONENTS` dan tegakkan di `EncryptedPage` setelah memverifikasi token (T2).
3. Ganti enam rute "Dashboard palsu" dengan komponen nyata atau placeholder yang jelas (T3).
4. Hentikan penghapusan cookie/`sessionStorage` dari splash; pindahkan ke aksi logout, dan buat `/` sadar-sesi (T4).
5. Bungkus router dengan `ErrorBoundary` + tambahkan `errorElement` untuk pemulihan chunk gagal (T5).
6. Amankan akses peta rute dengan `Object.hasOwn`/`Map` (T6) dan validasi `_exp` token (T7).
7. Tambahkan halaman 404/tautan-kedaluwarsa, lalu rapikan `decodedToken` dan alias rute duplikat.
