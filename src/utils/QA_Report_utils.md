# Laporan QA: `admin.kkpus.id/src/utils/`

Tanggal: 2026-11-18
Mode: read-only (tidak ada file produksi diubah)

## Ringkasan
- Keputusan: TIDAK LAYAK
- Jumlah temuan: Blocker 0, Major 4, Minor 7, Saran 6
- Modul `utils/` adalah lapisan fondasi (HTTP client, socket, kriptografi routing, export Excel). Strukturnya rapi dan tidak ada secret ter-hardcode, tetapi ada tiga risiko yang harus diperbaiki sebelum rilis: **formula injection pada export Excel**, **dependensi `xlsx@0.18.5` dengan 2 CVE High tanpa fix di npm**, dan **kontrol akses halaman yang hanya mengandalkan keberadaan string di `localStorage`**. Ditambah HTTP client tanpa penanganan 401.

## Standar yang dipakai
- Tidak ditemukan standar tertulis (`AGENTS.md`/`CLAUDE.md`/ESLint/Prettier/test config). `package.json` hanya punya `dev`/`start`/`build`/`preview`.
- Baseline: OWASP Top 10 (A01, A03, A06, A08), OWASP ASVS 4.x (session), CWE-1236 (CSV/Excel injection), ISO/IEC 27001:2022 A.8.26, A.8.28, A.8.8, A.8.15, A.8.12, A.5.17; ISO/IEC 25010 (maintainability, reliability).

## Cakupan
- Diperiksa: seluruh 14 file (676 baris) di `src/utils/api/` dan `src/utils/helpers/`, ditambah konteks pemakaian `src/routes/EncryptedPage.jsx`, `src/routes/RouterConfig.jsx`, dan 16 call-site `exportToExcel`.
- Tidak diperiksa: kontrak aktual backend (tidak ada `openapi.yaml`), perilaku runtime socket di server, dan kode di luar pemakaian modul ini.

## Hasil perintah yang dijalankan
| Perintah | Hasil | Catatan |
|---|---|---|
| `npx esbuild <file> --outfile=...` untuk 14 file di `src/utils` | Semua **lulus** (tanpa error) | Sintaks valid |
| `npm audit --json` | 17 temuan: 13 high, 4 moderate | `xlsx` High (CVSS 7.8 & 7.5), `fixAvailable: false` |
| `npm audit` detail `xlsx` | versi terpasang **0.18.5** | GHSA-4r6h-8v6p-xvw6 | GHSA-5pgg-2g8v8-p4x9 |
| `grep -rn "401\|interceptors.response" src` | 0 hasil | Tidak ada penanganan sesi kedaluwarsa di seluruh app |
| `grep -rn "sanitizeString\|useNavigation" src` | hanya definisi | Kode mati |
| `grep -rniE "apikey\|secret\|password" src/utils` | 0 hasil | Tidak ada secret ter-hardcode |
| `npx vite build` (dari audit sebelumnya) | **GAGAL** di `src/pages/auth/LoginPage.jsx:108` | Blocker di luar folder ini, tetap memblokir rilis |

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)
| Kontrol | Status | Bukti / temuan |
|---|---|---|
| A.8.26 persyaratan keamanan aplikasi | Gagal | Formula injection (T1); kontrol akses halaman hanya di klien (T3) |
| A.8.28 secure coding | Gagal | `sanitizeString` berbasis blacklist (T7); `catch (e) {}` kosong (T5) |
| A.8.8 manajemen kerentanan teknis | Gagal | `xlsx@0.18.5`, 2 CVE High, tanpa fix di npm (T2) |
| A.8.15 logging | Lulus dengan catatan | Log hanya `console.*`; `memberId` masuk log (T6) |
| A.8.12 pencegahan kebocoran data | Lulus dengan catatan | PII (memberId) di console (T6) |
| A.5.17 kredensial autentikasi | Lulus dengan catatan | Token Bearer disimpan di `localStorage` (T17) |
| A.8.24 kriptografi | Gagal | `jwtEncode` memakai `alg:"none"`, tanpa tanda tangan (T3) |

## Traceability (requirement → test → hasil)
| Requirement | Test | Hasil | Temuan |
|---|---|---|---|
| Export Excel tidak mengeksekusi konten sel | Tidak ada test | Tidak terverifikasi | T1 |
| Halaman terproteksi hanya bisa diakses pengguna terautentikasi | Tidak ada test | Gagal (bypass via `localStorage`) | T3 |
| Sesi berakhir saat token kedaluwarsa | Tidak ada test | Gagal (tidak ada interceptor 401) | T4 |
| Koneksi socket tunggal & bersih | Tidak ada test | Lulus dengan catatan | T5 |

## Exit criteria
| Kriteria | Ambang | Aktual | Status |
|---|---|---|---|
| Blocker | 0 | 0 di folder ini | Lulus |
| Major keamanan | 0 | 3 (T1, T2, T3) | **Gagal** |
| Kerentanan High tanpa mitigasi | 0 | 2 pada `xlsx` | **Gagal** |
| Test lulus | 100% | Tidak ada test | Tidak terverifikasi |
| Build lulus | Ya | Gagal (LoginPage.jsx:108) | **Gagal** |

## Matriks aspek
| Aspek | Status | Catatan singkat |
|---|---|---|
| Kebenaran fungsional | Lulus dengan catatan | API layer konsisten; `formatRupiah` memotong desimal |
| Kualitas kode | Lulus dengan catatan | Struktur bersih; ada dead code dan alias `as t` |
| Pengujian | Tidak berlaku | Tidak ada framework test di proyek |
| Keamanan | Gagal | T1, T2, T3 |
| Performa | Lulus dengan catatan | Cache-buster `_t` mematikan cache dashboard |
| Keandalan | Gagal | Socket leak (T5); tanpa timeout & tanpa handling 401 |
| Aksesibilitas/i18n | Tidak berlaku | Lapisan non-UI; locale `id-ID` sudah dipakai |
| Dependensi | Gagal | `xlsx` High tanpa fix |
| Kontrak API | Tidak terverifikasi | Tidak ada OpenAPI/schema |
| Dokumentasi | Lulus dengan catatan | JSDoc hanya di `UNotification.js` |
| Build/CI | Gagal | Lihat audit `App.css` (Blocker LoginPage) |

## Temuan

### [Major] Formula injection pada export Excel (CWE-1236)
- Lokasi: `admin.kkpus.id/src/utils/helpers/exportToExcel.js:5`
- Aspek / standar: Keamanan / OWASP A03 / CWE-1236 / ISO 27001 A.8.26
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  const worksheet = XLSX.utils.json_to_sheet(data);   // data mentah dari API
  ```
  Call-site mengirim hasil pemetaan record apa adanya, termasuk nama anggota/deskripsi yang diketik pengguna (16 pemanggilan, mis. `src/pages/simpanan/SimpananDashboard.jsx:331`). SheetJS menulis string apa pun sebagai sel; nilai yang diawali `=`, `+`, `-`, atau `@` dibaca Excel/LibreOffice sebagai formula.
- Dampak: Berkas laporan yang diunduh admin dapat mengeksekusi formula saat dibuka (mis. `HYPERLINK`/`WEBSERVICE` untuk mengeksfiltrasi isi sheet, atau `DDE`). Ini serangan ke pengguna internal, bukan ke server.
- Rekomendasi: netralkan sel sebelum ditulis:
  ```js
  const safe = (rows) => rows.map((r) =>
    Object.fromEntries(Object.entries(r).map(([k, v]) =>
      [k, typeof v === "string" && /^[=+\-@\t\r]/.test(v) ? `'${v}` : v])));
  const worksheet = XLSX.utils.json_to_sheet(safe(data));
  ```

### [Major] Dependensi `xlsx@0.18.5` memiliki 2 CVE High tanpa perbaikan di npm
- Lokasi: `admin.kkpus.id/src/utils/helpers/exportToExcel.js:1` (import) → `package.json:26`
- Aspek / standar: Supply chain / ISO 27001 A.8.8, A.8.25
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```
  npm audit: xlsx  range: *  fixAvailable: false
   - Prototype Pollution in sheetJS (GHSA-4r6h-8v6p-xvw6) cvss 7.8
   - SheetJS Regular Expression Denial of Service (GHSA-5pgg-2g8v8-p4x9) cvss 7.5
  versi terpasang: 0.18.5
  ```
- Dampak: Meski kode saat ini hanya memakai jalur tulis (`json_to_sheet`/`writeFile`) — bukan `XLSX.read` pada berkas pengguna — sehingga eksploitasi prototype pollution/ReDoS belum terbukti dari kode ini, versi ini tetap masuk daftar kerentanan High yang tidak bisa ditambal lewat `npm audit fix`. Risiko naik jika fitur import Excel berbasis SheetJS ditambahkan kemudian.
- Rekomendasi: ganti ke `exceljs` (aktif, tanpa CVE ini) atau SheetJS distribusi resmi ≥ 0.20.2 dari CDN artefak resmi, lalu jalankan ulang `npm audit`. Catat mitigasi/penerimaan risiko tertulis bila tetap dipertahankan.

### [Major] Token rute tidak ditandatangani dan gate halaman hanya mengecek keberadaan string di `localStorage`
- Lokasi: `admin.kkpus.id/src/utils/helpers/index.js:19-20`; dampak di `admin.kkpus.id/src/routes/EncryptedPage.jsx:41-46`
- Aspek / standar: Keamanan / OWASP A01 / CWE-287 / ISO 27001 A.8.24, A.8.26
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  // helpers/index.js
  const header = { alg: "none", typ: "JWT", ver: "1.0" };
  return `${encode(header)}.${encode(data)}.`;      // tanpa tanda tangan

  // routes/EncryptedPage.jsx
  if (isProtected) {
    const authToken = localStorage.getItem("token");
    if (!authToken) return <Navigate to="/" replace />;   // validitas tidak diperiksa
  }
  ```
  Siapa pun bisa membuat token ini (base64 + JSON) atau menulis string sembarang ke `localStorage.token`, lalu membuka halaman `isProtected` mana pun (13 halaman terproteksi di `src/routes/PageRoutes.jsx`).
- Dampak: Nama `jwt` + `alg: none` menciptakan kesan kontrol keamanan yang tidak ada. Selama backend menolak request tanpa token valid, data tetap aman, tetapi seluruh UI backoffice (struktur menu, layar berisi data yang sudah ter-cache) terbuka bagi pengguna tak berhak — melanggar prinsip defense-in-depth dan A.8.3.
- Rekomendasi: (1) ganti `jwtEncode` menjadi encoder bernama jujur (mis. `encodeRouteToken`) dan dokumentasikan sebagai obfuscation, bukan otorisasi; (2) validasi `_exp`/`_ts` di `jwtDecodePage`; (3) di `EncryptedPage`, panggil endpoint verifikasi sesi (atau decode JWT server dan cek `exp`) sebelum merender halaman terproteksi; (4) pastikan otorisasi tetap 100% di backend.

### [Major] HTTP client tidak menangani 401/403 — sesi kedaluwarsa tanpa redirect
- Lokasi: `admin.kkpus.id/src/utils/api/common.js:15-24`
- Aspek / standar: Keandalan + manajemen sesi / OWASP ASVS 4.x / ISO 27001 A.8.5
- Klasifikasi: ketidaksesuaian mayor
- Bukti: hanya ada request interceptor. `grep -rn "401\|interceptors.response" src` → **0 hasil** di seluruh proyek. Token hanya dibaca sekali saat request dibuat.
- Dampak: Setelah token JWT kedaluwarsa, setiap request gagal dan UI menampilkan error generik tanpa mengarahkan ulang ke login; pengguna bisa terjebak di layar dengan data basi, dan `localStorage.token` yang kedaluwarsa terus dikirim.
- Rekomendasi:
  ```js
  api.interceptors.response.use(
    (r) => r,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        disconnectSocket();
        window.location.assign("/");
      }
      return Promise.reject(err);
    }
  );
  ```

### [Minor] `initSocket` membuat socket baru tanpa membuang socket lama saat terputus
- Lokasi: `admin.kkpus.id/src/utils/api/socket.js:8-19` (kondisi `socket && socket.connected`), `:21-34`
- Aspek / standar: Keandalan / ISO 25010 reliability
- Klasifikasi: ketidaksesuaian minor
- Bukti:
  ```js
  if (socket && socket.connected) return socket;   // socket terputus → lanjut
  socket = io(SOCKET_URL, {...});                  // menimpa referensi lama
  socket.on("connect", () => { ... socket.emit("register", memberId) });
  ```
- Dampak: Setelah `disconnect`/putus jaringan, pemanggilan berikutnya (`App.jsx:17`, `App.jsx:23`, `getSocket()`) membuat koneksi kedua sementara socket lama dengan auto-reconnect masih hidup → dua koneksi, listener ganda, event notifikasi duplikat. Handler juga memakai variabel modul `socket`, bukan instance yang memicu event.
- Rekomendasi: `disconnectSocket()` sebelum membuat instance baru, gunakan parameter `s` di dalam handler, dan set `reconnectionAttempts` + backoff.

### [Minor] Data pengguna (memberId) tercatat di console
- Lokasi: `admin.kkpus.id/src/utils/api/socket.js:30` (dan `:22`, `:37`, `:41`)
- Aspek / standar: Privasi / ISO 27001 A.8.12, A.8.15
- Klasifikasi: ketidaksesuaian minor
- Bukti: `console.log("👤 [Socket Admin] Register user ke socket:", memberId);` — identifier anggota, plus pesan koneksi/putus dengan emoji.
- Dampak: Log pengenal pengguna masuk ke console browser (dan bisa tertangkap alat monitoring) tanpa kebutuhan operasional; melanggar minimalisasi data.
- Rekomendasi: hapus atau turunkan ke logger yang hanya aktif saat `import.meta.env.DEV`.

### [Minor] `sanitizeString` berbasis blacklist dan tidak dipakai
- Lokasi: `admin.kkpus.id/src/utils/helpers/sanitization.js:27-34`
- Aspek / standar: Keamanan / OWASP A03 / CWE-79
- Klasifikasi: ketidaksesuaian minor
- Bukti:
  ```js
  return str.replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "").trim();
  ```
  `grep -rn "sanitizeString" src` → hanya definisi, tidak ada pemakaian. Pola blacklist ini dapat dilewati (`&#106;avascript:`, `on\nclick=`), dan merusak teks sah seperti `i < 5` atau `online=`.
- Dampak: Kode mati yang berbahaya bila nanti dipakai sebagai "sudah disanitasi" untuk `dangerouslySetInnerHTML`; memberi rasa aman palsu.
- Rekomendasi: hapus. Untuk XSS, gunakan `DOMPurify` (sudah ada di `package.json`); untuk render teks, biarkan React meng-escape.

### [Minor] `jwtDecodePage` tidak memvalidasi masa berlaku dan rapuh untuk JWT server berisi UTF-8
- Lokasi: `admin.kkpus.id/src/utils/helpers/index.js:27-44`; pemakaian pada `src/components/modals/WithdrawalApprovalModal.jsx:45`
- Aspek / standar: Keandalan + keamanan sesi
- Klasifikasi: ketidaksesuaian minor
- Bukti: `_exp` ditulis di `:7` tetapi tidak pernah dibaca di decoder. Decoder memakai `atob()` lalu `decodeURIComponent(decoded)` — banyak dipakai ulang untuk membaca JWT asli server (`jwtDecodePage(token)?.userData`), padahal payload JWT adalah JSON UTF-8 (bukan percent-encoded). Nama dengan karakter non-ASCII menghasilkan mojibake atau `URIError` → `null` senyap.
- Dampak: Token 24 jam tidak pernah dianggap kedaluwarsa oleh klien; nama pengguna non-ASCII bisa membuat `currentUser` bernilai `null` pada modal approval.
- Rekomendasi: pisahkan `decodeRouteToken` (khusus token rute) dan `decodeJwtPayload` (base64url + `TextDecoder`), serta tolak token dengan `_exp < Date.now()`.

### [Minor] `getMediaUrl` menerima host arbitrer
- Lokasi: `admin.kkpus.id/src/utils/helpers/index.js:57-66`
- Aspek / standar: Keamanan / privasi
- Klasifikasi: ketidaksesuaian minor
- Bukti: `if (cleanPath.startsWith("http") || cleanPath.startsWith("data:")) return cleanPath;` — menerima `https://situs-lain/...`, juga `httpfoo`, tanpa allowlist. Dipakai di 27 tempat (mis. `RegistrationReviewModal.jsx:4`).
- Dampak: Jika nilai berasal dari data API yang bisa dikendalikan pengguna, gambar bisa dimuat dari domain eksternal (pelacakan IP/privasi, mixed content bila `http:`).
- Rekomendasi: allowlist host (`api.kkpus.id`, origin sendiri) dan hanya izinkan `https:`.

### [Minor] `formatRupiah` memotong desimal dan salah menangani string terformat
- Lokasi: `admin.kkpus.id/src/utils/helpers/index.js:46-55`
- Aspek / standar: Kebenaran fungsional / i18n
- Klasifikasi: ketidaksesuaian minor
- Bukti: `const num = parseInt(value, 10);` → `1500.75` menjadi `Rp 1.501` (dibulatkan Intl dari 1500) dan string `"1.500.000"` menjadi `Rp 1`. Dipakai di 296 tempat.
- Dampak: Selisih nominal pada tampilan laporan/tagihan bila API mengirim desimal atau string berformat.
- Rekomendasi: gunakan `Number(value)` dengan normalisasi pemisah atau `react-number-format` (sudah tersedia) untuk input, serta `Intl.NumberFormat` pada angka asli.

### [Minor] `exportToExcel` tanpa penanganan kegagalan
- Lokasi: `admin.kkpus.id/src/utils/helpers/exportToExcel.js:3-9`
- Aspek / standar: Keandalan
- Klasifikasi: ketidaksesuaian minor
- Bukti: `XLSX.writeFile(...)` dipanggil tanpa `try/catch`; jika data kosong fungsi hanya `return` tanpa memberi tahu pemanggil (`:4`).
- Dampak: Kegagalan unduhan (popup diblokir, memori tidak cukup) menjadi unhandled rejection tanpa umpan balik ke pengguna.
- Rekomendasi: `try/catch` + kembalikan status boolean, dan beri toast "Tidak ada data untuk diekspor" pada `data.length === 0`.

### [Saran] Alias export `as t` tidak terpakai dan tidak konsisten
- Lokasi: 10 file (`src/utils/api/UApproval.js:35`, `UBilling.js:58`, `UJualBeli.js:91`, `UInvestasi.js:39`, `UProgram.js:98`, `USavings.js:45`, `UDashboard.js:11`, `UTabungan.js:22`, `common.js:27`, `helpers/exportToExcel.js:12`)
- Aspek / standar: Maintainability
- Klasifikasi: peluang perbaikan
- Bukti: `grep -rnF "as t }" src` → 10 definisi, 0 pemakaian import bernama `t`. `UNotification.js` justru tidak punya alias.
- Rekomendasi: hapus seluruh alias `as t`.

### [Saran] `useNavigation` kode mati di file bernama `sanitization.js`
- Lokasi: `admin.kkpus.id/src/utils/helpers/sanitization.js:1-25`
- Aspek / standar: Maintainability
- Klasifikasi: peluang perbaikan
- Bukti: `grep -rn "useNavigation" src` → hanya definisi; tidak ada importer.
- Rekomendasi: hapus atau pindahkan ke `helpers/navigation.js` bila akan dipakai.

### [Saran] Pola service tidak seragam
- Lokasi: `class` + instance (`UApproval.js:3-33`), object literal (`UTabungan.js:3-19`), default instance (`UNotification.js:32`)
- Aspek / standar: Maintainability
- Klasifikasi: peluang perbaikan
- Rekomendasi: pilih satu pola (objek literal paling sederhana) dan terapkan konsisten.

### [Saran] Header `multipart/form-data` manual bersifat redundan
- Lokasi: `src/utils/api/UInvestasi.js:26,32`; `UJualBeli.js:70,76`; `UProgram.js:71,79,85,91`; `USavings.js:38`; `UTabungan.js:14,18`
- Aspek / standar: Maintainability
- Klasifikasi: peluang perbaikan
- Bukti: diverifikasi pada `node_modules/axios/dist/browser/axios.cjs` (axios 1.20.0): untuk body `FormData`, axios memanggil `headers.setContentType(undefined)` sehingga browser menetapkan `boundary`. Jadi **tidak ada bug**, hanya deklarasi yang tidak diperlukan.
- Rekomendasi: hapus header manual agar tidak menyesatkan pembaca berikutnya.

### [Saran] Cache-buster `_t` mematikan caching dashboard
- Lokasi: `admin.kkpus.id/src/utils/api/UDashboard.js:5`
- Aspek / standar: Performa
- Klasifikasi: peluang perbaikan
- Bukti: `api.get(\`/dashboard/admin?_t=${new Date().getTime()}\`)` — setiap render memaksa request tidak tercache.
- Rekomendasi: gunakan header `Cache-Control: no-store` dari server atau parameter eksplisit saat refresh manual saja.

### [Saran] Tidak ada `timeout` pada axios; `withCredentials` + Bearer di `localStorage` dipakai bersamaan
- Lokasi: `admin.kkpus.id/src/utils/api/common.js:7-13`
- Aspek / standar: Keandalan / manajemen sesi
- Klasifikasi: peluang perbaikan
- Bukti: konfigurasi hanya `baseURL`, `withCredentials: true`, `Content-Type`. Token diambil dari `localStorage` (`:17`) yang dapat dibaca skrip mana pun bila terjadi XSS; `withCredentials` juga menambah permukaan CSRF.
- Rekomendasi: tambahkan `timeout: 15000`; pilih satu mekanisme autentikasi (cookie `HttpOnly`+`SameSite` **atau** Bearer), dan bila tetap memakai `localStorage`, pastikan CSP ketat dan rotasi token pendek.

## Hal yang sudah baik
- Satu instance axios terpusat (`common.js`) dipakai seluruh service — tidak ada duplikasi konfigurasi base URL saat ini.
- Tidak ada secret/kredensial ter-hardcode di seluruh `src/utils` (diverifikasi dengan grep pola `apikey|secret|password`).
- Seluruh 14 file lolos pemeriksaan sintaks (esbuild) — tidak ada file rusak di modul ini.
- `getMediaUrl` menormalkan backslash Windows dan trailing slash base URL, serta menyediakan fallback dev/prod yang konsisten dengan `common.js`.
- `UNotification.js` punya JSDoc yang menjelaskan kontrak endpoint dan status (`SENT -> READ`) — contoh dokumentasi yang baik.
- `disconnectSocket()` menutup koneksi dan mengosongkan referensi, serta dipanggil pada cleanup `App.jsx:31`.
- `SVG_FALLBACK_IMAGE` memakai data URI sehingga tidak menambah request jaringan saat gambar gagal dimuat.

## Langkah lanjutan
1. Netralkan formula pada `exportToExcel` (T1) — perbaikan kecil, dampak langsung ke keamanan laporan.
2. Ganti/naikkan `xlsx` dan catat hasil `npm audit` setelahnya (T2).
3. Tambahkan verifikasi sesi nyata di `EncryptedPage` + validasi `_exp` di decoder, dan ubah nama `jwtEncode` agar tidak menyiratkan tanda tangan (T3).
4. Tambahkan response interceptor 401 → bersihkan token, putus socket, redirect ke login (T4).
5. Perbaiki siklus hidup socket (T5) dan hapus log berisi `memberId` (T6).
6. Bersihkan dead code (`sanitizeString`, `useNavigation`, alias `as t`) dan seragamkan pola service.
7. Tambahkan unit test minimal untuk `jwtEncode`/`jwtDecodePage`, `formatRupiah`, `getMediaUrl`, dan `exportToExcel` (termasuk kasus sel berawalan `=`).
