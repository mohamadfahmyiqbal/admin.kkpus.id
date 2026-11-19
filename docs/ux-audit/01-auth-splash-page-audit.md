# UI/UX Audit Checklist — Splash Page (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Splash Page (`/`) |
| URL / Lokasi File | `src/pages/auth/SplashPage.jsx` |
| Route Key | `globalSplash` |
| Protected Route | ❌ Tidak |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 16 Nov 2026 |
| Versi Design System | Belum diketahui |
| Status Akhir | 🔴 Tidak Lulus — Perbaikan Besar |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 4 | ❌ Gagal |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 2 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 4 | ⚠️ Perlu verifikasi |
| 5. Responsivitas & Adaptasi | 10 | 0 | ❓ Tidak terverifikasi |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 1 | ❌ Gagal |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **14** | **❌ Tidak Lulus** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.  
**Catatan:** Terdapat 3 item **Kritis** yang gagal (Aksesibilitas timing, Etika privasi, Kontrol pengguna).

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi riset dalam kode | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti JTBD | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | Tujuan: melanjutkan ke login, tapi tidak dikomunikasikan eksplisit | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti riset | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Pass □ Fail □ N/A | Tidak ada dasar bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass □ Fail □ N/A | Splash screen adalah konvensi umum, tapi auto-redirect 3 detik kurang standar | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass □ Fail □ N/A | Hanya satu opsi utama: "Lewati" | Menengah |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Pass □ Fail □ N/A | Ukuran tombol tidak terlihat dari JSX, perlu verifikasi CSS | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass □ Fail □ N/A | Konten minimal, tidak overload | Menengah |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass □ Fail □ N/A | Kompleksitas membersihkan cookie/sessionStorage ditangguhkan ke pengguna tanpa izin | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass □ Fail □ N/A | Auto-redirect setelah **3000 ms** melanggu batas < 400 ms | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass □ Fail □ N/A | Loading bar dan pesan memuat terlihat | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass □ Fail □ N/A | Bahasa Indonesia digunakan | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass □ Fail □ N/A | Auto-redirect memaksa pengguna menunggu; tombol "Lewati" ada tapi tidak menonjol | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass □ Fail □ N/A | Perlu cek terhadap design system | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass □ Fail □ N/A | Tidak ada mekanisme pencegahan kesalahan spesifik | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass □ Fail □ N/A | Judul dan pesan terlihat jelas | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass □ Fail □ N/A | Tidak ada shortcut atau opsi efisiensi | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass □ Fail □ N/A | Visual modern dengan efek orb dan bintang | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass □ Fail □ N/A | Jika gambar gagal, ada fallback emoji, tapi tidak ada pesan error untuk pengguna | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi bantuan | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS (`splashx-title-white`, `splashx-title-green`) | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi, peringatan, atau aksi | #3 | □ Pass □ Fail □ N/A | Risiko: judul menggunakan warna hijau untuk membedakan "Sukses" | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px (atau 24 × 24 CSS dengan padding memadai) | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS tombol "Lewati" | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass □ Fail □ N/A | Tidak ada skip link; urutan Tab tidak dikonfirmasi | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | □ Pass □ Fail □ N/A | Tidak terlihat dari JSX; perlu verifikasi CSS | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% tanpa assistive technology | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | □ Pass □ Fail □ N/A | `alt="Logo PUS"` ada | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di-siapkan sebagai dekoratif | #3 | □ Pass □ Fail □ N/A | `aria-hidden="true"` pada elemen dekoratif, tapi emoji 🕌 sebagai fallback kurang ideal | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Pass □ Fail □ N/A | N/A — Tidak ada formulir di halaman ini | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | □ Pass □ Fail □ N/A | Jika gambar gagal, tidak ada pesan error untuk pengguna | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | □ Pass □ Fail □ N/A | Efek bintang, orb, dan gerakan loading tidak dapat dimatikan | Menengah |
| **3.13 (Tambahan)** | Timing yang dapat diatur (pesan berubah otomatis 1200 ms) | #3 | □ Pass □ Fail □ N/A | Pesan berubah otomatis setiap 1200 ms tanpa opsi pause (WCAG 2.2 Timing Adjustable) | Kritis |
| **3.14 (Tambahan)** | Progressbar memiliki nilai ARIA (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`) | #3 | □ Pass □ Fail □ N/A | `role="progressbar"` tanpa nilai ARIA | Kritis |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Menggunakan custom CSS classes (`splashx-*`), perlu verifikasi apakah menggunakan token | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Perlu cek CSS | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | □ Pass □ Fail □ N/A | Perlu cek CSS | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass □ Fail □ N/A | Perlu cek CSS | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass □ Fail □ N/A | Khusus untuk splash, tidak jelas apakah reusable di halaman lain | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | □ Pass □ Fail □ N/A | Tidak terlihat dari JSX | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass □ Fail □ N/A | Menggunakan Bootstrap `Container` dan `text-center` | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1-h6, body, caption, label) | #4 | □ Pass □ Fail □ N/A | Perlu cek CSS | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | □ Pass □ Fail □ N/A | Menggunakan emoji 🕌 sebagai fallback, perlu ikon yang seragam | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | □ Pass □ Fail □ N/A | Tidak ada indikator status standar | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile-first (dari layar kecil ke besar) | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | □ Pass □ Fail □ N/A | Tidak ada bukti riset pengguna | Menengah |
| 6.2 | Tahap Define: persona, user journey, dan requirement terdefinisi | #6 | □ Pass □ Fail □ N/A | Tidak ada persona/journey terdefinisi | Menengah |
| 6.3 | Tahap Develop: sketsa, wireframe, dan prototipe rendah fidelitas tersedia | #6 | □ Pass □ Fail □ N/A | Kode tersedia | Menengah |
| 6.4 | Tahap Deliver: desain tinggi fidelitas, prototype interaktif, dan handoff tersedia | #6 | □ Pass □ Fail □ N/A | Kode siap, tapi belum melalui uji coba | Tinggi |
| 6.5 | Setiap tahapan memiliki keluaran yang ditinjau stakeholder sebelum melanjut | #6 | □ Pass □ Fail □ N/A | Tidak ada bukti review stakeholder | Menengah |

---

## Bagian 7: Deliverable & Handoff ke Developer (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 7.1 | File desain (Figma) terstruktur: halaman bernama rapi, auto layout digunakan | #7 | □ Pass □ Fail □ N/A | Belum tersedia | Tinggi |
| 7.2 | Komponen dipublish ke library design system | #7 | □ Pass □ Fail □ N/A | Belum tersedia | Tinggi |
| 7.3 | Spesifikasi visual lengkap: ukuran, jarak, warna (hex), tipografi, radius, shadow | #7 | □ Pass □ Fail □ N/A | Tidak ada dokumen spesifikasi | Tinggi |
| 7.4 | Prototype interaktif alur utama dapat diklik dan diuji tanpa kode | #7 | □ Pass □ Fail □ N/A | Tidak ada | Tinggi |
| 7.5 | Annotation catatan desain: perilaku interaksi, state, dan responsivitas | #7 | □ Pass □ Fail □ N/A | Tidak ada | Menengah |
| 7.6 | Asset diekspor dalam skala yang benar (SVG/PNG 1x, 2x) | #7 | □ Pass □ Fail □ N/A | Tidak ada | Menengah |
| 7.7 | Checklist handoff telah ditandai: review selesai, aksesibilitas diperiksa, developer memiliki akses | #7 | □ Pass □ Fail □ N/A | Belum dilakukan | Tinggi |

---

## Bagian 8: Uji Usabilitas & Iterasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 8.1 | Uji coba dilakukan dengan pengguna nyata (minimal 5 orang per iterasi) | #8 | □ Pass □ Fail □ N/A | Tidak ada bukti uji coba | Tinggi |
| 8.2 | Data uji coba dicatat: tugas gagal, waktu penyelesaian, kepuasan (SUS) | #8 | □ Pass □ Fail □ N/A | Tidak ada data | Tinggi |
| 8.3 | Desain diiterasi berdasarkan temuan uji coba | #8 | □ Pass □ Fail □ N/A | Belum dilakukan | Tinggi |
| 8.4 | Validasi ulang dilakukan setelah iterasi | #8 | □ Pass □ Fail □ N/A | Belum dilakukan | Menengah |
| 8.5 | Fitur baru tidak diluncurkan tanpa minimal satu siklus uji usabilitas | #8 | □ Pass □ Fail □ N/A | Belum ada uji usabilitas | Tinggi |

---

## Bagian 9: Etika & Anti Dark Pattern (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 9.1 | Tidak ada forced continuity (paksa langganan berlanjut) | #9 | □ Pass □ Fail □ N/A | N/A — Tidak berlaku | Kritis |
| 9.2 | Tidak ada hidden cost (biaya tersembunyi) | #9 | □ Pass □ Fail □ N/A | N/A — Tidak berlaku | Kritis |
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | □ Pass □ Fail □ N/A | Tombol "Lewati" ada, tapi auto-redirect 3 detik bisa dianggap menyembunyikan opsi batal | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar-benar akurat | #9 | □ Pass □ Fail □ N/A | N/A — Tidak berlaku | Menengah |
| 9.5 | Tidak ada roach-motel (mudah daftar, sulit batal) | #9 | □ Pass □ Fail □ N/A | N/A — Tidak berlaku | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | □ Pass □ Fail □ N/A | **Membersihkan cookie dan `sessionStorage` secara diam-diam saat splash screen dimuat tanpa persetujuan pengguna** | Tinggi |

---

## Bagian 10: Metrik Sukses (Direkomendasikan)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 10.1 | Task success rate telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ditetapkan | Rendah |
| 10.2 | Time-on-task telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ditetapkan | Rendah |
| 10.3 | Error rate telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ditetapkan | Rendah |
| 10.4 | NPS / SUS telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ditetapkan | Rendah |
| 10.5 | Konversi dan retensi telah ditetapkan | #10 | □ Pass □ Fail □ N/A | Tidak ditetapkan | Rendah |

---

## Temuan Krítico & Perbaikan Harus Dilakukan Sebelum Rilis

| No | Masalah | Lokasi | Rekomendasi Perbaikan | Prioritas |
|----|---------|--------|----------------------|-----------|
| 1 | Membersihkan cookie & `sessionStorage` tanpa izin pengguna | `useEffect` purgeCacheAndCookies (baris 45-66) | Hapus pemisahan otomatis atau tambahkan persetujuan/peringatan kepada pengguna. Jika harus, sampaikan secara transparan. | **Kritis** |
| 2 | Auto-redirect 3000 ms melanggu Doherty Threshold & kontrol pengguna | `handleSkip` + `setTimeout` (baris 34-41) | Kurangi delay atau berikan opsi yang lebih jelas. Pertimbangkan apakah splash screen benar-benar diperlukan. | **Kritis** |
| 3 | Pesan berubah otomatis setiap 1200 ms tanpa kontrol | `setInterval` (baris 52-58) | Tambahkan opsi pause/play atau nonaktifkan animasi teks untuk pengguna yang menggunakan `prefers-reduced-motion`. | **Kritis** |
| 4 | Progressbar tanpa nilai ARIA (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`) | `<div role="progressbar">` (baris 113) | Tambahkan atribut ARIA yang lengkap | **Tinggi** |
| 5 | Tidak ada indikasi fokus keyboard terlihat | Tombol "Lewati" | Pastikan `:focus-visible` terlihat jelas di CSS | **Tinggi** |
| 6 | Efek animasi tanpa opsi nonaktifkan (`prefers-reduced-motion`) | `.splashx-stars`, `.splashx-orb`, loading bar | Respek `prefers-reduced-motion` di CSS | **Tinggi** |
| 7 | Emoji 🕌 sebagai fallback gambar tidak ideal untuk layar pembaca | `splashx-mosque-fallback` (baris 98-102) | Ganti dengan SVG atau ikon yang memiliki `aria-label` deskriptif | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🔴 **Tidak Lulus — Perbaikan Besar**

Halaman ini **tidak boleh dirilis** dalam bentuk saat ini karena:
1. **Pelanggaran privasi (Kritis):** Membersihkan cookie dan `sessionStorage` tanpa persetujuan pengguna.
2. **Melanggu aksesibilitas (Kritis):** Tidak ada kontrol animasi, progressbar tanpa ARIA, risiko fokus keyboard, timing tidak dapat diatur.
3. **Melanggu prinsip UX (Kritis):** Auto-redirect 3 detik tanpa alasan yang jelas.

**Langkah selanjutnya:**
1. Perbaiki 7 temuan di atas (3 Kritis, 3 Tinggi, 1 Menengah).
2. Lakukan uji coba usabilitas dengan minimal 5 pengguna.
3. Buat spesifikasi handoff dan prototype interaktif.
4. Audit ulang setelah perbaikan.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Splash Page  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`  
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\auth\SplashPage.jsx`
