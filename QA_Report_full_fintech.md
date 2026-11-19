# Laporan QA: `admin.kkpus.id` (audit seluruh proyek, fokus fintech)

Tanggal: 2026-11-18
Versi laporan: 1.0
Commit diperiksa: `20ee523` + perubahan lokal pada `src/pages/auth/LoginPage.jsx`
Mode: read-only (tidak ada kode produksi yang diubah)

## Ringkasan

- **Keputusan: TIDAK LAYAK.**
- Jumlah temuan: **Blocker 1, Major 8, Minor 6, Saran 2**
- Proyek ini adalah backoffice koperasi syariah yang mengelola simpanan, pembiayaan/pinjaman, jual beli (murabahah), tabungan, arisan, sukuk, dan pendanaan syariah — sehingga aspek 12–15 (integritas finansial, AML/anti-fraud, pembayaran/PCI, ketahanan) wajib dinilai. **Build produksi gagal**, **tidak ada satu pun test otomatis**, dan kontrol otorisasi approval bersifat **fail-open** di 6 komponen. Di sisi positif, tidak ditemukan pemrosesan data kartu (PCI DSS tidak berlaku untuk frontend ini), PWA tidak meng-cache respons API, dan tidak ada secret ter-hardcode.

## Standar yang dipakai

- **Proyek:** tidak ada `AGENTS.md`, `README`, ESLint/Prettier, test config, maupun ambang coverage. Satu-satunya gate CI adalah `npm run build` di `.github/workflows/deploy.yml`.
- **Baseline:** ISO/IEC 27001:2022 Annex A, ISO/IEC 25010, OWASP Top 10/ASVS, CWE Top 25, WCAG 2.2 AA, ISTQB.
- **Fintech:** UU PDP No. 27/2022, POJK/SEOJK & PBI/PSBI (status: tidak ada bukti dokumen), DSN-MUI & PSAK (produk syariah), FATF/AML-KYC, PCI DSS v4.0.1 (dinilai **tidak berlaku**: tidak ada integrasi kartu/PJP di frontend).

## Cakupan

- **Diperiksa:** seluruh `src/` (204 file JS/JSX, 32.787 baris), `package.json`, `vite.config.js`, `index.html`, `.github/workflows/deploy.yml`, `public/`, `robots.txt`, konfigurasi `.env.*`, serta dependensi (`npm audit`).
- **Tidak diperiksa:** kode backend/API `api.kkpus.id` (tidak ada di repositori) dan rendering visual di browser. Karena itu, klaim "server menolak" atau "server memvalidasi" selalu ditandai **tidak terverifikasi**.
- **Jalur uang (money path) yang dipetakan:** simpanan (setor/tarik) → `SimpananDashboard` + `WithdrawalApprovalModal`; pinjaman → `PinjamanList` + `ProgramApprovalModal`; jual beli/murabahah (DP, margin, biaya operasional, diskon pelunasan) → `JualBeliDashboard` + `JualBeliApprovalModal`; tabungan → `TabunganPage`; sukuk → `InvestasiHalalListPage`; pendanaan syariah → `PendanaanSyariahListPage`; arisan → `ArisanBatchModal`; biaya admin → `PaymentFeeConfigPage`; ekspor laporan → `exportToExcel`/`xlsx`.

## Hasil perintah yang dijalankan

| Perintah | Hasil | Catatan |
|---|---|---|
| `npx vite build --outDir /tmp/opencode/qa-dist-full` | **exit 1** | `LoginPage.jsx:108:17 Expected '</Link>'` |
| `npm audit` | **17 temuan** (13 high, 4 moderate) | `xlsx` High, `fixAvailable: false` |
| `find __tests__ -type f` | **0 file** | Folder kosong; tidak ada test framework di `package.json` |
| `cat package.json` | scripts: `dev`, `start`, `build`, `preview` | Tidak ada `test`, `lint`, `audit` |
| `grep -rn "idempoten"` | 0 hasil | Tidak ada idempotency key |
| `grep -rn "ErrorBoundary"` | 0 hasil | `react-error-boundary` terpasang tetapi tidak dipakai |
| `grep -n "dashboard/Dashboard" src/routes/PageRoutes.jsx` | 7 hasil | 7 nama rute memetakan ke Dashboard |
| `git ls-files` (`.env`, `dist`) | `.env.*` ter-track; `dist/` tidak | `.env` hanya berisi base URL (bukan secret) |

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)

| Kontrol | Status | Bukti / temuan |
|---|---|---|
| A.8.28 secure coding | Gagal | Build gagal; XSS pada `GenericImportModal.jsx:91`; tanpa CSP |
| A.8.32 manajemen perubahan | Gagal | Perbaikan `LoginPage.jsx` setengah jalan; tidak ada gate review/test |
| A.8.29 pengujian keamanan | Gagal | Tidak ada SAST/SCA/test; `npm audit` tidak dijalankan di CI |
| A.8.8 manajemen kerentanan | Gagal | 13 High, termasuk `xlsx` tanpa fix |
| A.8.5 autentikasi aman | Gagal dengan catatan | Token di `localStorage`; tidak ada penanganan 401 terpusat |
| A.5.15 / 5.18 hak akses | Gagal | Otorisasi UI fail-open (T2) |
| A.8.15 logging & A.8.16 pemantauan | Tidak terverifikasi | Audit trail hanya ada di sisi server; tidak ada bukti |
| A.8.24 kriptografi | Lulus dengan catatan | HTTPS; tidak ada kripto kustom; JWT klien `alg:none` hanya untuk routing |
| A.5.34 privasi PII | Gagal dengan catatan | `userData` lengkap disimpan di `localStorage` |
| A.8.13 backup / A.8.14 redundansi | Tidak terverifikasi | Tidak ada bukti RTO/RPO/DR |
| A.8.25 / 8.31 / 8.4 | Lulus dengan catatan | Env terpisah via `.env.*`; tidak ada secret ter-hardcode |

## Matriks regulasi

| Regulasi / standar | Berlaku? | Bukti yang tersedia | Status | Temuan |
|---|---|---|---|---|
| POJK/SEOJK (OJK) | Ya (koperasi simpan pinjam/pembiayaan) | Tidak ada dokumen izin/kebijakan di repo | Tidak terverifikasi | T2, T3 |
| UU PDP No. 27/2022 | Ya | Tidak ada kebijakan retensi/notifikasi kebocoran | Tidak terverifikasi | T8 |
| DSN-MUI / PSAK (syariah) | Ya | Akad dikonfigurasi (`AkadConfigPage`) tanpa referensi fatwa | Tidak terverifikasi | — |
| AML/CFT & KYC (FATF/PPATK) | Ya | Tidak ada layar/uji CDD, PEP, atau monitoring | Tidak terverifikasi | T2 |
| PCI DSS v4.0.1 | Tidak (tidak ada data kartu/PJP) | Pembayaran manual via bukti transfer | Tidak berlaku | — |
| ISO 22301 (BCM) | Tidak diwajibkan eksplisit | Tidak ada runbook/DR | Tidak terverifikasi | T13 |

## Matriks kebenaran finansial

| Skenario | Nilai uji | Hasil diharapkan | Hasil aktual | Selisih | Temuan |
|---|---|---|---|---|---|
| Iuran arisan dibagi tenor | target 1.000.000, 3 bulan | 333.334 + 333.333 + 333.333 | 333.333 × 3 = 999.999 | **−1** | T10 |
| Diskon pelunasan diisi approve | sisa piutang 5.000.000, diskon 50.000.000 | ditolak | diterima UI (`Number(discount)`) | melebihi piutang | T4 |
| Retry approve karena timeout | 1 permintaan | 1 mutasi | tidak ada idempotency key | berpotensi 2 mutasi | T3 |
| Total jual beli ditampilkan | harga + biaya + margin | sama dengan ledger | dihitung di klien dari `Number()` | belum diuji vs server | T4 |
| Ekspor laporan | nama anggota `=HYPERLINK(...)` | teks literal | formula aktif di Excel | eksekusi formula | T6 |

## Abuse case dan skenario fraud

| Abuse case | Kontrol yang diuji | Hasil | Temuan |
|---|---|---|---|
| Self-approval pengajuan sendiri | Perbandingan pembuat vs penyetuju | Tidak ada perbandingan di UI | T2 |
| Manipulasi role via `localStorage` | Otorisasi tombol approve | Tombol muncul; server tidak terverifikasi | T2 |
| Approve ganda (double click/retry) | Idempotensi | Tidak ada | T3 |
| Diskon pelunasan untuk menutup piutang | Batas atas diskon | Tidak ada | T4 |
| XSS lewat file import berisi HTML | Escaping pesan error | Tidak di-escape | T5 |
| Formula injection lewat nama anggota | Sanitasi ekspor | Tidak ada | T6 |

## Exit criteria

| Kriteria | Ambang | Aktual | Status |
|---|---|---|---|
| Build bersih | 0 error | 1 error (`LoginPage.jsx:108`) | **Gagal** |
| Test otomatis jalur uang | 100% | 0 test | **Gagal** |
| Kerentanan High/Critical | 0 | 13 High | **Gagal** |
| Temuan integritas finansial terbuka | 0 | 3 (T3, T4, T10) | **Gagal** |
| Selisih rekonsiliasi | 0 | Tidak dapat diuji (tanpa backend) | Tidak terverifikasi |
| Traceability requirement → test | 100% | 0% | **Gagal** |

## Matriks aspek

| Aspek | Status | Catatan singkat |
|---|---|---|
| 1. Kebenaran fungsional | Gagal | Build gagal; rute ganda; pembulatan arisan |
| 2. Kualitas kode | Lulus dengan catatan | 32.787 baris; beberapa file >600 baris; tanpa lint |
| 3. Pengujian | Gagal | Tidak ada test sama sekali |
| 4. Keamanan | Gagal | Fail-open authz UI, XSS, token di localStorage, tanpa CSP |
| 5. Performa | Lulus dengan catatan | Bundle besar; CSS mati ±76% (laporan styles) |
| 6. Keandalan | Gagal dengan catatan | Tanpa ErrorBoundary; tanpa 401 handling |
| 7. Aksesibilitas | Lulus dengan catatan | Lihat `QA_Report_styles.md` (font 9–11px, override heading) |
| 8. Dependensi | Gagal | 13 High; `xlsx` tanpa fix |
| 9. Kontrak API | Tidak terverifikasi | Tanpa OpenAPI; error handling tidak seragam |
| 10. Dokumentasi | Gagal | Tanpa README/ADR/runbook |
| 11. Build/CI | Gagal | CI hanya build; build saat ini gagal |
| 12. Integritas finansial | Gagal | T3, T4, T10, T11 |
| 13. AML/anti-fraud | Tidak terverifikasi | Tidak ada bukti implementasi |
| 14. Pembayaran/PCI | Tidak berlaku | Pembayaran manual, tanpa kartu |
| 15. Ketahanan | Tidak terverifikasi | Tanpa SLO/RTO/RPO/DR |

## Temuan

### [Blocker] Build produksi gagal — tag penutup `Link` tidak cocok

- Lokasi: `src/pages/auth/LoginPage.jsx:108` (pembuka `<Link>` di baris 96)
- Aspek / standar: Build / ISO 27001 A.8.28, A.8.25
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```
  $ npx vite build --outDir /tmp/opencode/qa-dist-full
  [builtin:vite-transform] Expected corresponding JSX closing tag for 'Link'.
     src/pages/auth/LoginPage.jsx:108:17
     96 │ <Link to="/" ...>
    108 │ </a>
        │  Expected `</Link>`
  EXIT=1
  ```
  Perubahan lokal sudah mengganti pembuka menjadi `<Link>` (baris 96) tetapi penutup masih `</a>`. Perbaikan belum selesai.
- Dampak: Seluruh pipeline deploy berhenti; tidak ada rilis yang bisa dibuat. Ini juga berarti seluruh temuan lain belum pernah teruji di build nyata.
- Rekomendasi: ganti `</a>` di baris 108 dengan `</Link>`, lalu jalankan `npm run build` sampai exit 0 sebelum merge.

### [Major] Otorisasi approval fail-open di 6 komponen

- Lokasi:
  - `src/components/modals/WithdrawalApprovalModal.jsx:71-72`
  - `src/components/modals/TabunganApprovalModal.jsx:59-60`
  - `src/components/modals/InvestasiHalalApprovalModal.jsx:54-55`
  - `src/components/modals/PendanaanSyariahApprovalModal.jsx:62-63`
  - `src/pages/anggota/RegistrationReviewModal.jsx:78-79`
  - `src/pages/anggota/TerminationReviewModal.jsx:70-71`
  - `src/components/modals/jualbeli/utils/jualBeliHelpers.js:43-44`
- Aspek / standar: Keamanan / OWASP A01 Broken Access Control / ISO 27001 A.5.15, A.5.18
- Klasifikasi: ketidaksesuaian mayor
- Bukti (pola sama di semua file):
  ```js
  if (!currentRoleName) return true;   // role tidak diketahui → boleh approve
  if (!currentUser) return true;       // user tidak terbaca → boleh approve
  ```
  Role dibaca dari `localStorage.getItem("userData")` (mis. `WithdrawalApprovalModal.jsx:37`), yang dapat diubah pengguna. Pencocokan memakai `r.includes(target) || target.includes(r)` (`jualBeliHelpers.js:63`), sehingga nama/role yang mirip dapat lolos.
- Dampak: Tombol setujui muncul ketika data role hilang atau token rusak; pengguna yang memodifikasi `localStorage` dapat membuka UI approval. Jika backend mengandalkan sinyal yang sama atau tidak memvalidasi ulang step/role, terjadi **self-approval** dan pelanggaran maker-checker pada transaksi keuangan.
- Rekomendasi: ubah menjadi **fail-closed** (`return false` bila role/user tidak diketahui), hapus pencocokan `includes`, dan pastikan backend menolak approval bila `approver_id == maker_id` atau role tidak sesuai step. Tambahkan test otorisasi untuk tiap kombinasi role.

### [Major] Tidak ada idempotency pada aksi approve/reject/disburse

- Lokasi: `src/components/modals/jualbeli/hooks/useJualBeliApproval.js:144-162`, `src/pages/dashboard/components/DashboardApprovalModals.jsx:115-121`
- Aspek / standar: Integritas finansial / ISO 27001 A.8.28
- Klasifikasi: ketidaksesuaian mayor
- Bukti: `grep -rni "idempoten\|Idempotency-Key" src` → 0 hasil. Payload approval hanya berisi `action` dan `notes`.
- Dampak: Retry otomatis, timeout, atau double-submit dapat mencatat persetujuan/pencairan dua kali. Pada pencairan simpanan/tabungan ini berarti **mutasi dana ganda**.
- Rekomendasi: kirim `Idempotency-Key` unik per aksi dan hormati hasil idempoten di server; nonaktifkan tombol selama request dan tangani `409`/duplikat di UI.

### [Major] Diskon pelunasan dan biaya operasional tanpa batas atas atau validasi

- Lokasi: `src/components/modals/jualbeli/JualBeliActionForm.jsx:56-77`, `src/components/modals/jualbeli/hooks/useJualBeliApproval.js:156-159`
- Aspek / standar: Integritas finansial / ISO 27001 A.8.28
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  setDiscount(e.target.value.replace(/[^\d]/g, ""))       // tanpa batas
  operational_cost: Number(operationalCost) || 0,
  discount: Number(discount) || 0,                       // dikirim apa adanya
  ```
  Tidak ada pengecekan `discount <= sisa_piutang` maupun `operational_cost` terhadap plafon.
- Dampak: Penyetuju dapat menetapkan diskon melebihi sisa piutang sehingga piutang lunas tanpa dana masuk, atau biaya operasional negatif tak terbatas. Ini adalah titik fraud internal yang paling langsung pada jalur uang.
- Rekomendasi: validasi `0 <= discount <= sisa_piutang` dan batas biaya operasional di UI **dan** server; catat alasan + bukti untuk setiap diskon; terapkan maker-checker terpisah untuk diskon di atas ambang tertentu.

### [Major] XSS melalui pesan error import yang dirender sebagai HTML

- Lokasi: `src/components/modals/GenericImportModal.jsx:89-102`; pola sama di `src/pages/anggota/components/ImportAnggotaModal.jsx:56-67` dan 4 modal import lain
- Aspek / standar: Keamanan / OWASP A03 Injection / ISO 27001 A.8.28
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  detailsHtml += `Baris ${err.row || "-"}: ${err.reason || err.message || JSON.stringify(err)}<br/>`;
  Swal.fire({ html: detailsHtml, ... });
  ```
  `err.reason` berasal dari isi file yang diunggah (mis. nama anggota pada baris gagal) dan tidak di-escape. `DOMPurify` terpasang tetapi tidak dipakai di sini.
- Dampak: File Excel berisi `<img src=x onerror=...>` dapat mencuri token dari `localStorage` saat admin membuka dialog hasil import — eskalasi dari pengguna berhak import menjadi eksekusi kode di sesi admin.
- Rekomendasi: escape nilai dengan `textContent`/`DOMPurify.sanitize` atau gunakan `Swal.fire` tanpa `html`; batasi `err.reason` menjadi teks polos.

### [Major] Formula injection pada ekspor Excel

- Lokasi: `src/utils/helpers/exportToExcel.js:4-8`; `src/pages/jualBeli/JualBeliDashboard.jsx:77-80`; data pengguna di `src/pages/tabungan/TabunganPage.jsx:124-126`, `src/pages/anggota/MembersPage.jsx:240`
- Aspek / standar: Keamanan / OWASP A03 / ISO 27001 A.8.28
- Klasifikasi: ketidaksesuaian mayor
- Bukti: `XLSX.utils.json_to_sheet(data)` menulis nilai apa adanya. Tidak ada prefiks `'` untuk sel yang dimulai `=`, `+`, `-`, `@`.
- Dampak: Nama anggota/deskripsi transaksi berisi `=HYPERLINK("http://...","klik")` atau `=cmd|...` dapat dieksekusi saat laporan dibuka di Excel — vektor exfiltration data koperasi.
- Rekomendasi: sanitasi setiap sel string (prefiks `'` atau ganti karakter awal) sebelum `json_to_sheet`; tambahkan unit test untuk nama berawalan `=`.

### [Major] Dependensi rentan tanpa perbaikan — `xlsx@0.18.5`

- Lokasi: `package.json` (`"xlsx": "^0.18.5"`); pemakaian `src/utils/helpers/exportToExcel.js:1`, `src/pages/jualBeli/JualBeliDashboard.jsx:5`
- Aspek / standar: Supply chain / ISO 27001 A.8.8 / OWASP A06
- Klasifikasi: ketidaksesuaian mayor
- Bukti `npm audit`: 13 High, 4 Moderate. `xlsx` = Prototype Pollution (CVSS 7.8) + ReDoS (7.5), `fixAvailable: false`. 12 High lainnya berasal dari rantai build (`vite`, `vite-plugin-pwa`, `workbox-build`, `picomatch`, `follow-redirects`).
- Dampak: `xlsx` hanya dipakai untuk menulis (bukan membaca file pengguna), sehingga eksploitasi langsung lebih sempit; namun ReDoS/Prototype Pollution tetap tersedia bagi kode yang memproses data tak tepercaya, dan tidak akan pernah ditambal di versi npm.
- Rekomendasi: ganti ke `exceljs`/`@e965/xlsx` (fork yang dipelihara) atau SheetJS versi CDN resmi terbaru; perbarui `vite`/`vite-plugin-pwa`; jalankan `npm audit --audit-level=high` di CI.

### [Major] Sesi: token di `localStorage`, tanpa penanganan 401, tanpa CSP

- Lokasi: `src/pages/auth/LoginPage.jsx:72-73`, `src/utils/api/common.js:14-26`, `index.html:1-30`
- Aspek / standar: Keamanan / OWASP A07, A05 / ISO 27001 A.8.5
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  localStorage.setItem("token", data.data.token);
  localStorage.setItem("userData", JSON.stringify(data.data.user));
  ```
  Interceptor hanya menambahkan header; tidak ada `api.interceptors.response` untuk `401`. `index.html` tidak memuat `Content-Security-Policy`.
- Dampak: Setiap XSS (lihat T5/T6) langsung mencuri token bearer; token kedaluwarsa tidak memicu logout sehingga pengguna terus melihat error tanpa diarahkan ke login.
- Rekomendasi: pertimbangkan cookie `HttpOnly` + `SameSite` untuk sesi, atau minimal simpan token di memori dan refresh token di cookie; tambahkan response interceptor 401 → bersihkan sesi → redirect login; terapkan CSP (`default-src 'self'`) di server/CDN.

### [Major] Tidak ada test otomatis, lint, atau gate kualitas di CI

- Lokasi: `package.json:6-11`; `__tests__/` (kosong); `.github/workflows/deploy.yml:1-40`
- Aspek / standar: Pengujian / ISO 27001 A.8.29, A.8.25; ISTQB
- Klasifikasi: ketidaksesuaian mayor
- Bukti: scripts hanya `dev`/`start`/`build`/`preview`; folder `__tests__` kosong; workflow hanya `npm ci` → `npm run build` → rsync ke VPS. Tidak ada `lint`, `test`, `audit`.
- Dampak: Regresi pada perhitungan bunga/fee/diskon dan alur approval tidak terdeteksi sampai produksi. Sesuai exit criteria fintech, 100% jalur uang wajib punya test — saat ini 0%.
- Rekomendasi: tambahkan Vitest + React Testing Library, prioritaskan unit test untuk `parseNumber`, `formatRupiah`, kalkulasi jual beli, dan guard approval; tambahkan ESLint + `npm audit --audit-level=high` sebagai gate sebelum deploy.

### [Major] Konfigurasi biaya admin menerima nilai tidak valid

- Lokasi: `src/pages/konfigurasi/PaymentFeeConfigPage.jsx:141-176`, penyimpanan `:55-80`
- Aspek / standar: Integritas finansial / ISO 27001 A.8.28
- Klasifikasi: ketidaksesuaian mayor
- Bukti: input `type="number"` tanpa `min`/`max`/`required`; nilai `""` dapat dikirim; `percentage_fee` tidak dibatasi `0–100`; `flat_fee` tidak dibatasi `>= 0`. `handleSaveAll` mengirim seluruh `configs` tanpa validasi.
- Dampak: Biaya admin negatif atau persentase >100% dapat membebani anggota secara berlebihan atau memberi keuntungan tidak sah; konfigurasi tersimpan massal tanpa review.
- Rekomendasi: validasi rentang di UI dan server, tolak nilai kosong/NaN, dan tambahkan konfirmasi four-eyes untuk perubahan konfigurasi biaya.

### [Minor] Pembulatan iuran arisan tidak menjaga total

- Lokasi: `src/pages/program/arisan/components/ArisanBatchModal.jsx:158`, `:190`
- Aspek / standar: Integritas finansial / ISO 27001 A.8.28
- Klasifikasi: ketidaksesuaian minor
- Bukti: `Math.round(t / r)` menyimpan satu angka iuran; tidak ada kompensasi sisa. Contoh: target Rp 1.000.000 / 3 bulan → Rp 333.333 × 3 = Rp 999.999.
- Dampak: Selisih Rp 1–(n−1) per batch tidak pernah tertagih atau kelebihan tagih; rekonsiliasi arisan tidak akan nol.
- Rekomendasi: hitung iuran dasar + iuran penyesuaian pada periode terakhir, atau simpan sisa pembulatan sebagai komponen eksplisit; tambahkan test `sum(installments) == target`.

### [Minor] Tujuh nama rute memetakan ke Dashboard

- Lokasi: `src/routes/PageRoutes.jsx:108-129`
- Aspek / standar: Kebenaran fungsional
- Klasifikasi: ketidaksesuaian minor
- Bukti: `reportsPage`, `settingsPage`, `accountPage`, `registrationsPage`, `billingPage`, `transactionsPage`, dan satu rute lain semuanya memakai `import("../pages/dashboard/Dashboard")`.
- Dampak: Menu yang dituju menampilkan halaman yang salah; pengguna mengira fitur belum tersedia, dan perubahan pada Dashboard berdampak ke banyak rute sekaligus.
- Rekomendasi: hapus rute yang belum diimplementasikan atau arahkan ke halaman placeholder eksplisit.

### [Minor] Tidak ada ErrorBoundary meski dependensi tersedia

- Lokasi: `src/main.jsx`, `src/App.jsx`; `package.json` memuat `react-error-boundary`
- Aspek / standar: Keandalan / ISO 25010 reliability
- Klasifikasi: ketidaksesuaian minor
- Bukti: `grep -rn "ErrorBoundary" src` → 0 hasil.
- Dampak: Satu error render pada komponen transaksi membuat seluruh aplikasi blank (layar putih) tanpa jalur pemulihan.
- Rekomendasi: bungkus router dengan `ErrorBoundary` dan tampilkan fallback + tombol muat ulang; catat error ke layanan monitoring.

### [Minor] `formatRupiah` memotong desimal dengan `parseInt`

- Lokasi: `src/utils/helpers/index.js:46-55`
- Aspek / standar: Integritas tampilan finansial
- Klasifikasi: ketidaksesuaian minor
- Bukti: `const num = parseInt(value, 10);` sementara komponen lain memakai `parseFloat` (mis. `SimpananDashboard.jsx:159`, `WithdrawalApprovalModal.jsx:97`).
- Dampak: Nilai desimal (mis. bunga atau bagi hasil) tampil terpotong, menimbulkan selisih persepsi dengan angka di ledger.
- Rekomendasi: gunakan satu fungsi format berbasis `Number`/`Decimal` dan tetapkan kebijakan pembulatan tampilan.

### [Minor] `robots.txt` berada di root dan tidak ikut ter-deploy

- Lokasi: `robots.txt` (root); `public/` tidak memuat `robots.txt`
- Aspek / standar: Konfigurasi deployment
- Klasifikasi: ketidaksesuaian minor
- Bukti: `ls public/robots.txt` → tidak ada; workflow hanya meng-upload `dist/`.
- Dampak: Backoffice dapat terindeks mesin pencari jika tidak diblokir di level server.
- Rekomendasi: pindahkan ke `public/` atau tambahkan header `X-Robots-Tag: noindex` di server.

### [Minor] `react-error-boundary` dan beberapa dependensi tidak terpakai

- Lokasi: `package.json:14-32`
- Aspek / standar: Supply chain
- Klasifikasi: ketidaksesuaian minor
- Bukti: `react-error-boundary` tidak diimpor di mana pun; `prop-types` juga tidak terlihat dipakai di file yang diperiksa.
- Dampak: Permukaan serangan dan waktu instalasi bertambah tanpa manfaat.
- Rekomendasi: hapus dependensi tak terpakai atau gunakan sesuai rencana.

### [Saran] Tambahkan pemetaan akad ke fatwa DSN-MUI

- Lokasi: `src/pages/konfigurasi/AkadConfigPage.jsx`
- Aspek / standar: Kepatuhan syariah
- Klasifikasi: peluang perbaikan
- Bukti: konfigurasi akad tidak menyertakan referensi fatwa/nomor akad.
- Dampak: Sulit membuktikan kesesuaian syariah saat audit.
- Rekomendasi: tambahkan field referensi fatwa dan validasi saat akad dipilih.

### [Saran] Dokumentasikan asumsi timezone dan cut-off

- Lokasi: seluruh modul transaksi (mis. `JualBeliTable.jsx:115`, `SimpananDashboard.jsx:159`)
- Aspek / standar: Integritas finansial
- Klasifikasi: peluang perbaikan
- Bukti: tidak ditemukan penggunaan timezone eksplisit; tanggal mengandalkan `new Date()` perangkat.
- Dampak: Transaksi di sekitar tengah malam dapat masuk periode laporan yang berbeda.
- Rekomendasi: tetapkan `Asia/Jakarta` di server dan gunakan format tanggal eksplisit di UI.

## Hal yang sudah baik

- **PWA aman untuk data sensitif:** `vite.config.js:99-106` memakai `NetworkOnly` untuk seluruh API (`api.kkpus.id`, `/api/`) sehingga respons transaksi tidak di-cache.
- **Tidak ada pemrosesan kartu:** pembayaran memakai bukti transfer manual, sehingga scope PCI DSS tidak melebar ke frontend.
- **Tidak ada secret ter-hardcode:** grep kredensial tidak menemukan nilai sensitif; `.env.*` hanya memuat base URL.
- **`DOMPurify` sudah tersedia** sebagai dependensi, tinggal diterapkan pada titik XSS.
- **Beberapa perbaikan keamanan sudah dilakukan:** `LoginPage.jsx` kini memakai `<Link>` (walau penutupnya belum), dan label form sudah memiliki `htmlFor`/`id`.
- **Tidak ada mutasi data destruktif otomatis** di frontend; operasi hapus anggota meminta password ulang (`MembersPage.jsx:248-290`).

## Langkah lanjutan

1. **Hari ini:** perbaiki `LoginPage.jsx:108` (`</a>` → `</Link>`) dan pastikan `npm run build` exit 0.
2. **Sebelum rilis:** ubah seluruh guard approval menjadi fail-closed; tambahkan pengecekan backend `approver != maker` dan validasi step/role.
3. **Sebelum rilis:** validasi diskon pelunasan, biaya operasional, dan biaya admin di UI + server; tambahkan idempotency key pada approve/disburse.
4. **Minggu ini:** escape pesan error import (atau hapus `html:`), sanitasi sel Excel, dan ganti `xlsx`.
5. **Minggu ini:** tambahkan response interceptor 401, CSP, dan pertimbangkan sesi berbasis cookie `HttpOnly`.
6. **Dua minggu:** pasang Vitest + ESLint + `npm audit` di CI, dengan test wajib untuk seluruh jalur uang dan pembulatan.
7. **Bulan ini:** lengkapi dokumen kepatuhan (izin OJK, kebijakan AML/KYC, retensi UU PDP, RTO/RPO) agar status "tidak terverifikasi" bisa ditutup dengan bukti.
