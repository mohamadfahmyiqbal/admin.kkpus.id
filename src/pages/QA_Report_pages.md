# Laporan QA: `admin.kkpus.id/src/pages/`

Tanggal: 2026-11-18
Mode: read-only (tidak ada file produksi diubah)

## Ringkasan
- Keputusan: TIDAK LAYAK
- Jumlah temuan: Blocker 1, Major 3, Minor 9, Saran 4
- Ruang lingkup 118 file / 24.720 baris di 10 modul. Tidak ditemukan `dangerouslySetInnerHTML`, `eval`, atau `innerHTML` — fondasi XSS klasik bersih. Namun ada tiga masalah serius: **build produksi masih gagal** (warisan dari modul `auth`), **kontrol approval yang fail-open dengan pencocokan peran berbasis substring/nama orang**, dan **DOM XSS via `Swal.fire({ html })` yang menyisipkan pesan error hasil import Excel tanpa escape**.

## Standar yang dipakai
- Tidak ada standar tertulis (tanpa ESLint/Prettier/test config; `package.json` hanya `dev`/`build`/`preview`).
- Baseline: OWASP Top 10 (A01, A03, A04, A07), CWE-79/CWE-1236/CWE-863, ISO/IEC 27001:2022 A.8.26, A.8.28, A.8.11, A.8.12, A.8.29; ISO/IEC 25010 (security, maintainability, usability); WCAG 2.2 AA.

## Cakupan
- Diperiksa: struktur & ukuran seluruh modul, seluruh handler import Excel (7 modal), alur approval anggota (`RegistrationReviewModal`, `TerminationReviewModal`), export Excel (17 call-site), unggah bukti transfer, penanganan tanggal, hardcoded URL, pemakaian `alert`/`window.location`, dan hook dashboard/socket.
- Tidak diperiksa (alasan): logika perhitungan finansial mendalam di `program/` dan `investasi/` (butuh spesifikasi bisnis/rumus acuan yang tidak tersedia di repo), serta pengujian runtime browser (tidak ada environment browser). Otorisasi sisi server juga tidak dapat diverifikasi (backend di luar repo).

## Hasil perintah yang dijalankan
| Perintah | Hasil | Catatan |
|---|---|---|
| `find src/pages -type f` | 118 file, 24.720 baris | `program/` terbesar (31 file) |
| `grep -rn "dangerouslySetInnerHTML\|eval(\|new Function\|innerHTML"` | 0 hasil | Tidak ada sink XSS langsung |
| `grep -rn "html:" \| wc -l` | 9 | 9 pemakaian HTML di SweetAlert |
| `grep -rn "e.reason\|err.reason"` | 3 file | Data backend masuk HTML tanpa escape |
| `grep -rn "file.size"` | 1 (hanya `TerminationReviewModal.jsx:93`) | Klaim "Maks 5MB" di 3 tempat tidak ditegakkan |
| `grep -rn "https://api.kkpus.id"` | 2 file | Origin API di-hardcode di halaman |
| `grep -rn "window.location.href"` | 7 file | Fallback unduh template melewati header auth |
| `grep -rn "alert("` | 4 | Alur bisnis memakai `alert()` |
| `grep -rn "toISOString().split"` | 8 file | Nama file laporan memakai tanggal UTC |
| `npx vite build` (audit sebelumnya, repo sama) | **GAGAL** — `src/pages/auth/LoginPage.jsx:108` | Bundel produksi tidak dapat dibuat |

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)
| Kontrol | Status | Bukti / temuan |
|---|---|---|
| A.8.26 persyaratan keamanan aplikasi | Gagal | XSS via Swal (T2); kontrol approval fail-open (T1) |
| A.8.28 secure coding | Gagal | Substring role matching; empty `catch` (T9); `alert()` (T7) |
| A.8.3 pembatasan akses informasi | Gagal | `if (!currentUser) return true` (T1) |
| A.8.12 pencegahan kebocoran data | Lulus dengan catatan | Payload socket di-log (S2); gambar PII ke domain eksternal (T6) |
| A.8.29 pengujian keamanan | Tidak terverifikasi | Tidak ada test/SAST di repo |
| A.8.25 siklus hidup pengembangan aman | Gagal | Build rusak (T0) |
| A.8.11 data masking | Lulus dengan catatan | NIK/selfie ditampilkan lewat `getMediaUrl` dengan rel aman |

## Exit criteria
| Kriteria | Ambang | Aktual | Status |
|---|---|---|---|
| Blocker | 0 | 1 | **Gagal** |
| Major keamanan | 0 | 2 (T1, T2) | **Gagal** |
| Build lulus | Ya | Gagal | **Gagal** |
| Test lulus | 100% | Tidak ada test | Tidak terverifikasi |
| Tanpa data uji produksi | Ya | Tidak diperiksa | Tidak terverifikasi |

## Matriks aspek
| Aspek | Status | Catatan singkat |
|---|---|---|
| Kebenaran fungsional | Gagal | Gate approval meloloskan peran salah; tanggal export UTC |
| Kualitas kode | Lulus dengan catatan | 1 file 1.148 baris; 9 pemakaian HTML manual |
| Pengujian | Tidak berlaku | Tidak ada test |
| Keamanan | Gagal | T1, T2, T3 |
| Performa | Lulus dengan catatan | Refetch tanpa throttle pada event socket |
| Keandalan | Lulus dengan catatan | Empty catch; fallback unduh tanpa auth |
| Aksesibilitas | Lulus dengan catatan | `alert()` memblokir; tidak ada audit kontras menyeluruh |
| i18n/lokalisasi | Lulus dengan catatan | Tanggal file export UTC |
| Build/CI | Gagal | Lihat T0 |

## Temuan

### [Blocker] Build produksi gagal — JSX tag tidak cocok di halaman login
- Lokasi: `admin.kkpus.id/src/pages/auth/LoginPage.jsx:96` dan `:108`
- Aspek / standar: Build / ISO 27001 A.8.25
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```
  ╭─[ src/pages/auth/LoginPage.jsx:108:17 ]
  108 │  </a>
      ╰── Expected `</Link>`
  ```
  `<Link to="/" ...>` dibuka pada baris 96, ditutup `</a>`.
- Dampak: `npm run build` gagal total; artefak rilis tidak dapat dibuat.
- Rekomendasi: ubah `</a>` menjadi `</Link>` di baris 108, lalu jalankan `npm run build` sampai lulus.

### [Major] Gate approval fail-open dan mencocokkan peran dengan substring nama orang
- Lokasi: `admin.kkpus.id/src/pages/anggota/RegistrationReviewModal.jsx:76-98` dan `admin.kkpus.id/src/pages/anggota/TerminationReviewModal.jsx:68-83`
- Aspek / standar: Keamanan / OWASP A01, A07 / CWE-863 / ISO 27001 A.8.3, A.8.28
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  if (!targetRole) return true;
  if (!currentUser) return true;                 // fail-open (Reg:79, Term:71)
  ...
  const hasMatchingRole =
    userRole.includes(target) || target.includes(userRole) || ...
    userRoles.some((r) => r.includes(target) || target.includes(r)) ||
    userFullName.includes(target);               // Reg:96 — nama orang jadi penentu
  ```
  `TerminationReviewModal.jsx:83` memasukkan `userFullName` ke `allRoles` lalu mengujinya dengan `includes`.
- Dampak: (1) jika data pengguna gagal dimuat, tombol approve **aktif** — kegagalan sistem berubah menjadi izin; (2) pencocokan substring dua arah membuat peran seperti `admin` cocok dengan `admin_pengawas` dan sebaliknya; (3) admin bernama "Bendahara Muda" otomatis dianggap Bendahara. Jika backend tidak memvalidasi peran langkah yang sama secara ketat, approval bisa dilakukan pihak yang tidak berwenang.
- Rekomendasi: `return false` saat `!currentUser`; bandingkan peran secara eksak (`Set` + `role_id`, bukan substring); hapus pencocokan `full_name`; jadikan hasil ini hanya *hint* UI dan tetap kirim `step_id`/`role_id` ke backend untuk otorisasi final.

### [Major] XSS melalui `Swal.fire({ html })` yang menyisipkan pesan error import
- Lokasi: `admin.kkpus.id/src/pages/anggota/components/ImportAnggotaModal.jsx:52-67`; `admin.kkpus.id/src/pages/tabungan/components/ImportTabunganModal.jsx:47-62`; `admin.kkpus.id/src/pages/program/pinjaman/components/ImportPinjamanModal.jsx:61-80`
- Aspek / standar: Keamanan / OWASP A03 / CWE-79 / ISO 27001 A.8.26
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  const previewErrors = errors.slice(0, 5)
    .map((e) => `<li>Baris ${e.row}: ${e.reason}</li>`).join("");   // tabungan:47
  Swal.fire({ icon: ..., html: `... ${errorHtml} ...` });           // tabungan:62
  ```
  `e.reason` berasal dari respons backend dan umumnya memuat **nilai sel dari file Excel yang diunggah** (mis. "NIK <img src=x onerror=...> tidak valid"). SweetAlert2 merender string `html` sebagai HTML, sehingga payload dieksekusi di sesi admin.
- Dampak: Eskalasi dari "berkas import berisi teks aneh" menjadi eksekusi JavaScript di panel backoffice ber-privilese tinggi — dapat mencuri `localStorage.token`, memanggil API atas nama admin, atau mengubah data. Cukup satu kali admin mengunggah template yang diterima dari pihak lain.
- Rekomendasi: escape setiap nilai dinamis (`const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))`) atau gunakan `text`/DOM node (`html: <ul>...</ul>` dengan elemen React) alih-alih string HTML. Terapkan pada 9 pemakaian `html:`.

### [Major] Export Excel langsung di dashboard Jual Beli — duplikasi helper dan formula injection
- Lokasi: `admin.kkpus.id/src/pages/jualBeli/JualBeliDashboard.jsx:5,77-80`
- Aspek / standar: Keamanan / CWE-1236 / maintainability / ISO 27001 A.8.26
- Klasifikasi: ketidaksesuaian mayor
- Bukti:
  ```js
  import * as XLSX from "xlsx";
  const ws = XLSX.utils.json_to_sheet(exportData);
  XLSX.writeFile(wb, "Laporan_Jual_Beli.xlsx");
  ```
  Berbeda dari 16 call-site lain yang memakai `utils/helpers/exportToExcel`. Nilai `Anggota`/`Nama Barang` dari API ditulis apa adanya sehingga sel berawalan `=`/`+`/`-`/`@` menjadi formula saat dibuka.
- Dampak: Perilaku export tidak konsisten (satu tempat tidak memakai sanitasi saat helper diperbaiki), dan jalur formula injection pada laporan jual beli tetap terbuka.
- Rekomendasi: hapus import `xlsx` lokal dan panggil `exportToExcel` (setelah helper-nya diberi netralisasi formula). Naikkan juga `xlsx@0.18.5` yang memiliki 2 CVE High (lihat laporan `src/utils`).

### [Minor] Validasi unggah file tidak konsisten dengan yang dijanjikan UI
- Lokasi: `admin.kkpus.id/src/pages/program/arisan/components/ArisanDrawView.jsx:264-269` (klaim 5MB, `onChange={(e) => setProofFile(e.target.files[0])}` tanpa cek); `admin.kkpus.id/src/pages/investasi/halal/components/SukukInvestorsModal.jsx:65-88` (unggah otomatis tanpa cek ukuran/tipe)
- Aspek / standar: Keandalan + keamanan input / ISO 27001 A.8.28
- Klasifikasi: ketidaksesuaian minor
- Bukti: `grep -rn "file.size" src/pages` → hanya `anggota/TerminationReviewModal.jsx:93`. `accept` bersifat saran; pengguna dapat memilih file 200 MB sehingga UI membeku saat upload.
- Dampak: Upload besar gagal di tengah jalan tanpa pesan jelas; pengguna mengira sistem rusak.
- Rekomendasi: satu util `validateUploadFile(file, {maxMB:5, types:[...]})` dan pakai di semua modal unggah.

### [Minor] Origin API di-hardcode pada tautan bukti transfer
- Lokasi: `admin.kkpus.id/src/pages/program/arisan/components/ArisanDrawView.jsx:216`; `admin.kkpus.id/src/pages/investasi/halal/components/investors/SukukInvestorRow.jsx:95`
- Aspek / standar: Kualitas kode / ISO 25010 portability
- Klasifikasi: ketidaksesuaian minor
- Bukti: `` href={`https://api.kkpus.id/api/${d.transfer_proof}`} `` dan ``window.open(`https://api.kkpus.id/api/${item.transfer_proof}`, "_blank")`` — mengabaikan `VITE_API_ORIGIN` yang dipakai modul lain.
- Dampak: Bukti transfer tidak dapat dibuka di dev/staging; `window.open` tanpa `noopener`.
- Rekomendasi: gunakan `getMediaUrl('/api/' + proof)` dan `window.open(url, "_blank", "noopener,noreferrer")`.

### [Minor] Unduh template memakai `window.location.href` sehingga melewati header Authorization
- Lokasi: `anggota/components/ImportAnggotaModal.jsx:31`; `tabungan/components/ImportTabunganModal.jsx:114`; `program/pinjaman/components/ImportPinjamanModal.jsx:220`; `program/arisan/components/ImportArisanModal.jsx:107`; `investasi/halal/components/ImportInvestasiModal.jsx:109`; `investasi/pendanaan/components/ImportPendanaanModal.jsx:108`; `jualBeli/components/ImportExcelModal.jsx:165`
- Aspek / standar: Kebenaran fungsional + keamanan sesi
- Klasifikasi: ketidaksesuaian minor
- Bukti: fallback `window.location.href = ${apiOrigin}/api/...`. Autentikasi utama di aplikasi memakai header `Authorization: Bearer` (`utils/api/common.js:19`); navigasi browser tidak mengirim header itu.
- Dampak: Jika cookie tidak tersedia/ditolak (mis. `SameSite`), fallback menghasilkan JSON 401 di tab, bukan file — pengguna melihat halaman error mentah.
- Rekomendasi: perlakukan kegagalan blob sebagai error dengan pesan jelas; jangan fallback ke navigasi langsung, atau gunakan endpoint yang mengandalkan cookie sesi.

### [Minor] `alert()` dipakai pada alur bisnis
- Lokasi: `simpanan/SimpananDashboard.jsx:292`, `:334`; `investasi/halal/components/SukukInvestorsModal.jsx:81`, `:85`
- Aspek / standar: UI/UX / ISO 25010 usability
- Klasifikasi: ketidaksesuaian minor
- Bukti: `alert("Tidak ada data transaksi simpanan untuk diexport.");` dan `alert("Bukti transfer berhasil diupload.");` — sementara modul lain memakai SweetAlert/toast.
- Dampak: Dialog memblokir thread UI, tidak konsisten, tidak dapat ditata/diterjemahkan, dan tidak ramah pembaca layar.
- Rekomendasi: gunakan `toast`/`Swal` yang sudah dipakai di proyek.

### [Minor] Nama file laporan memakai tanggal UTC, bukan waktu lokal
- Lokasi: `simpanan/SimpananDashboard.jsx:330`; `simpanan/SimpananReportPage.jsx:134`; `jualBeli/JualBeliReport.jsx:122`; `investasi/halal/InvestasiHalalListPage.jsx:38,57`; `investasi/halal/InvestasiReportPage.jsx:106`; `investasi/pendanaan/PendanaanSyariahReportPage.jsx:55`; `investasi/pendanaan/PendanaanSyariahListPage.jsx:82`
- Aspek / standar: i18n / kebenaran fungsional
- Klasifikasi: ketidaksesuaian minor
- Bukti: `new Date().toISOString().split("T")[0]` mengembalikan tanggal UTC. WIB = UTC+7.
- Dampak: Laporan yang diunduh antara 00:00–06:59 WIB diberi nama tanggal kemarin, menyulitkan rekonsiliasi laporan harian.
- Rekomendasi: `new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })` (format `YYYY-MM-DD`).

### [Minor] Placeholder gambar memakai domain pihak ketiga
- Lokasi: `anggota/components/MemberDetailModal.jsx:411`, `:430`; `anggota/components/TerminationReasonSection.jsx:21`
- Aspek / standar: Privasi / ISO 27001 A.8.12
- Klasifikasi: ketidaksesuaian minor
- Bukti: `e.target.src = "https://placehold.co/400x300?text=KTP+Tidak+Ditemukan";` pada `onError` foto KTP/selfie anggota.
- Dampak: Setiap kegagalan memuat dokumen mengirim request ke domain ketiga (IP + waktu + konteks "melihat KTP"), dan placeholder tidak muncul saat offline/jaringan internal ketat.
- Rekomendasi: pakai `SVG_FALLBACK_IMAGE` yang sudah ada di `utils/helpers/index.js:68`.

### [Minor] `window.location.reload()` setelah aksi sukses
- Lokasi: `investasi/halal/InvestasiHalalListPage.jsx:126`
- Aspek / standar: UI/UX / performa
- Klasifikasi: ketidaksesuaian minor
- Bukti: `onSuccess={() => window.location.reload()}` — memuat ulang seluruh SPA, menghapus state filter/pencarian dan memicu semua request awal.
- Dampak: Pengalaman pengguna menurun; data yang sudah dimuat diambil ulang dari server.
- Rekomendasi: panggil callback refresh data (`fetchData`) seperti modul lain.

### [Minor] `catch` kosong menelan kegagalan pembacaan sesi
- Lokasi: `anggota/RegistrationReviewModal.jsx:33`, `:37`; `anggota/TerminationReviewModal.jsx:36`, `:40`
- Aspek / standar: Keandalan / maintainability
- Klasifikasi: ketidaksesuaian minor
- Bukti: `} catch (e) {}` pada `JSON.parse(localStorage.getItem("userData"))` dan `jwtDecodePage(token)`.
- Dampak: Jika `userData` rusak, `currentUser` menjadi `null` lalu memicu jalur fail-open pada Temuan 1 — kegagalan senyap berubah menjadi izin.
- Rekomendasi: log saat `DEV`, dan pastikan `currentUser === null` berarti **tidak boleh** approve.

### [Saran] Password admin dikirim di body `DELETE`
- Lokasi: `anggota/MembersPage.jsx:282-284`
- Aspek / standar: Keamanan / higiene
- Klasifikasi: peluang perbaikan
- Bukti: `api.delete(`/anggota/${memberId}`, { data: { password } })`. Banyak reverse proxy/APM mencatat body request, dan `DELETE` umumnya dianggap tanpa body.
- Rekomendasi: gunakan `POST /anggota/{id}/hard-delete` dengan body terpisah, atau verifikasi ulang lewat endpoint khusus (re-auth token) agar password tidak ikut di request destruktif.

### [Saran] `console.log` mencatat payload event socket
- Lokasi: `dashboard/hooks/useDashboardData.jsx:67`
- Aspek / standar: Privasi / ISO 27001 A.8.12
- Bukti: `console.log("🔔 [Dashboard] Socket event received:", payload);` — payload notifikasi bisa memuat nama/id anggota.
- Rekomendasi: hapus atau bungkus dengan `import.meta.env.DEV`.

### [Saran] Refetch dashboard tanpa throttle pada setiap event socket
- Lokasi: `dashboard/hooks/useDashboardData.jsx:66-89`
- Aspek / standar: Performa
- Bukti: `fetchData()` dipanggil pada setiap event dari 4 kanal; hanya toast yang di-throttle (`lastToastTime`).
- Dampak: Lonjakan banyak event (mis. batch approval) memicu puluhan request dashboard beruntun.
- Rekomendasi: debounce `fetchData` (mis. 1–2 detik) dengan pola yang sama seperti throttle toast.

### [Saran] Satu file 1.148 baris berisi 4 tab + 3 modal + service
- Lokasi: `training/TrainingPage.jsx:1-1148`
- Aspek / standar: Maintainability
- Bukti: `CurriculumTab` (:38), `MaterialTab` (:167), `EvaluationTab` (:278), `RankingTab` (:389), `CurriculumModal` (:475), `MaterialModal` (:608), `EvaluationModal` (:799), dan `TrainingPage` (:984) dalam satu file.
- Rekomendasi: pecah per tab/modal ke `training/components/`, dan pindahkan `trainingService` ke `utils/api/` agar konsisten dengan modul lain.

## Hal yang sudah baik
- Tidak ada `dangerouslySetInnerHTML`, `eval`, `new Function`, atau `innerHTML` di seluruh 118 file — permukaan XSS klasik dijaga.
- Sebagian besar tautan `target="_blank"` sudah memakai `rel="noreferrer"` (mencegah reverse tabnabbing).
- `dashboard/hooks/useDashboardData.jsx:90-96` membersihkan keempat listener socket dengan referensi handler yang sama — pola cleanup yang benar.
- Semua gambar anggota diambil melalui `getMediaUrl` sehingga base URL tetap terpusat (kecuali dua temuan hardcode di atas).
- Penghapusan anggota (single & massal) meminta konfirmasi password admin dan menyebut pencatatan audit log (`MembersPage.jsx:250-300`).
- Modul import sudah memakai `FormData` + service layer (tidak ada `axios` langsung di halaman), dan satu modal (`TerminationReviewModal.jsx:93`) sudah menegakkan batas 5MB sebagai contoh yang bisa direplikasi.
- Tidak ada `any`/`eval` dan tidak ada TODO/FIXME menggantung; struktur folder per domain (anggota, program, tabungan, …) konsisten.

## Langkah lanjutan
1. Perbaiki Blocker `LoginPage.jsx:108` (`</a>` → `</Link>`) dan jalankan `npm run build` sampai hijau.
2. Tutup celah approval: `return false` saat `!currentUser`, cocokkan peran secara eksak, hapus `full_name.includes(...)` (T1).
3. Escape atau ganti ke elemen React pada 9 pemakaian `Swal.fire({ html })`, prioritas tiga modal import yang menyisipkan `e.reason` (T2).
4. Satukan export Excel ke `exportToExcel` dan netralkan formula `= + - @` di helper tersebut (T3).
5. Tambahkan util validasi unggah (ukuran + MIME) dan pakai di `ArisanDrawView`, `SukukInvestorsModal`, serta semua modal import.
6. Ganti dua URL hardcode dan 7 fallback `window.location.href` dengan `getMediaUrl`/penanganan error yang benar.
7. Standarkan feedback UI (hapus `alert`), perbaiki tanggal file export ke zona `Asia/Jakarta`, dan ganti placeholder eksternal dengan `SVG_FALLBACK_IMAGE`.
