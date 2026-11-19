# UI/UX Audit Checklist — Login Page (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Login Page (`/login`) |
| URL / Lokasi File | `src/pages/auth/LoginPage.jsx` |
| Route Key | `authLogin` |
| Protected Route | ❌ Tidak |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 16 Nov 2026 |
| Versi Design System | Belum diketahui |
| Status Akhir | 🟡 Perbaikan Besar |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 6 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 4 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 5 | ⚠️ Perlu verifikasi |
| 5. Responsivitas & Adaptasi | 10 | 6 | ⚠️ Parsial |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 4 | ⚠️ Parsial |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **28** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi riset dalam kode | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti JTBD | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | Tujuan: login ke dashboard, sudah jelas dari UI | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti riset | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Pass □ Fail □ N/A | Tidak ada dasar bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass □ Fail □ N/A | Layout login standar (email + password + tombol masuk) | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass □ Fail □ N/A | Hanya 2 input + 1 tombol utama, tidak overload | Menengah |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Pass □ Fail □ N/A | Form control min-height 48px, tombol lebar penuh — baik | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass □ Fail □ N/A | Konten minimal, informasi terpusat | Menengah |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass □ Fail □ N/A | Validasi sederhana, tidak ada kompleksitas tambahan | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass □ Fail □ N/A | Loading state selama proses login, respons visual baik | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass □ Fail □ N/A | Error alert, loading spinner, tombol disabled saat loading | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass □ Fail □ N/A | Bahasa Indonesia, label yang jelas | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass □ Fail □ N/A | Tidak ada tombol batal/kembali, hanya login | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass □ Fail □ N/A | Menggunakan Bootstrap + custom CSS, konsisten dalam halaman | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass □ Fail □ N/A | Validasi kosong sebelum submit, feedback invalid per field | Menengah |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass □ Fail □ N/A | Icon user dan lock sebagai pengenal visual input | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass □ Fail □ N/A | Tidak ada fitur "ingat saya" atau auto-fill pengingat | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass □ Fail □ N/A | Desain bersih, gradient, kartu yang jelas | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass □ Fail □ N/A | Pesan error deskriptif, field invalid ditandai | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Pass □ Fail □ N/A | Ada kontak IT Support di panel kiri | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Teks putih pada gradient gelap perlu verifikasi kontras | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi, peringatan, atau aksi | #3 | □ Pass □ Fail □ N/A | Error menggunakan warna merah + ikon seru + teks, baik | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px (atau 24 × 24 CSS dengan padding memadai) | #3 | □ Pass □ Fail □ N/A | Form control min-height 48px baik; tombol eye perlu verifikasi | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass □ Fail □ N/A | Elemen form standar HTML, seharusnya bisa diakses Tab | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | □ Pass □ Fail □ N/A | CSS ada `:focus` dengan border biru dan box-shadow | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% tanpa assistive technology | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS dan layout saat zoom | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | □ Pass □ Fail □ N/A | `alt="PUS Logo"` pada logo | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di-siapkan sebagai dekoratif | #3 | □ Pass □ Fail □ N/A | Mosque overlay tidak ada alt (CSS background), baik | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Pass □ Fail □ N/A | `Form.Label` ada untuk email dan password | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | □ Pass □ Fail □ N/A | Pesan error spesifik ("Email/Nomor HP wajib diisi", dll.) | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | □ Pass □ Fail □ N/A | Animasi framer-motion pada card, tidak diketahui apakah respeck prefers-reduced-motion | Menengah |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | CSS menggunakan hardcode hex (#02113d, #2563eb, #00d9a6, dll.) | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | CSS menggunakan font-size hardcode (14px, 15px, dll.) | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | □ Pass □ Fail □ N/A | CSS menggunakan padding/margin hardcode | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass □ Fail □ N/A | CSS hardcode border-radius (12px, 28px) dan shadow | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass □ Fail □ N/A | Khusus halaman login, tidak jelas reusable di halaman lain | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | □ Pass □ Fail □ N/A | Tombol ada hover, loading state ada | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass □ Fail □ N/A | Bootstrap Container/Row/Col, konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1-h6, body, caption, label) | #4 | □ Pass □ Fail □ N/A | Tidak ada skala terdefinisi, hardcode per elemen | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | □ Pass □ Fail □ N/A | Menggunakan react-icons/fa (FaUser, FaLock, dll.) | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | □ Pass □ Fail □ N/A | Error menggunakan merah, loading menggunakan spinner biru | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile-first (dari layar kecil ke besar) | #5 | □ Pass □ Fail □ N/A | Ada media query max-width 576px, tapi tidak jelas mobile-first | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | □ Pass □ Fail □ N/A | Hanya satu breakpoint (576px) dalam CSS | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass □ Fail □ N/A | Col lg={6} md={10} xs={12}, left column disembunyikan di mobile | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | □ Pass □ Fail □ N/A | Card menumpuk vertikal di mobile | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | □ Pass □ Fail □ N/A | Form control 48px, perlu verifikasi tombol eye | Kritis |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | □ Pass □ Fail □ N/A | Tidak ada bukti riset | Menengah |
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
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | □ Pass □ Fail □ N/A | Tidak ada tombol batal/kembali, hanya login | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar-benar akurat | #9 | □ Pass □ Fail □ N/A | N/A — Tidak berlaku | Menengah |
| 9.5 | Tidak ada roach-motel (mudah daftar, sulit batal) | #9 | □ Pass □ Fail □ N/A | N/A — Tidak berlaku | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | □ Pass □ Fail □ N/A | Input email dan password standar, tidak ada indikasi pelanggaran | Tinggi |

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
| 1 | Tidak ada tombol batal / kembali ke halaman sebelumnya | `LoginPage.jsx` (baris 91-302) | Tambahkan tombol "Kembali" atau tautan ke halaman utama | **Kritis** |
| 2 | Warna hardcode tanpa design token | `LoginPage.css` (baris 1-181) | Ganti nilai hardcode dengan CSS variable / design token | **Tinggi** |
| 3 | Tidak ada verifikasi kontras warna teks putih pada gradient latar | `LoginPage.css` (baris 3) | Verifikasi kontras ≥ 4.5:1, sesuaikan warna jika perlu | **Tinggi** |
| 4 | Hanya satu breakpoint (576px), tidak ada breakpoint tablet/desktop | `LoginPage.css` (baris 44-48) | Tambahkan breakpoint sm/md/lg/xl untuk layout yang lebih baik | **Tinggi** |
| 5 | Animasi framer-motion tanpa opsi `prefers-reduced-motion` | `LoginPage.jsx` (baris 190-196) | Respek prefers-reduced-motion, nonaktifkan animasi jika diperlukan | **Tinggi** |
| 6 | Tombol "Lihat password" (eye button) ukuran tidak diketahui, risiko touch target < 44px | `LoginPage.jsx` (baris 256-262), `LoginPage.css` (baris 179-181) | Pastikan tombol eye minimal 44×44 px atau padding yang memadai | **Kritis** |
| 7 | Tidak ada fitur "Ingat Saya" atau pengingat kredensial | `LoginPage.jsx` (baris 221-293) | Pertimbangkan menambahkan opsi "Ingat Saya" untuk efisiensi pengguna | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Halaman Login secara fungsional sudah baik (validasi, error handling, loading state), namun masih memiliki beberapa celah penting:

1. **Kontrol pengguna:** Tidak ada tombol batal/kembali — pengguna terpaku hanya bisa login.
2. **Design system:** Semua warna, tipografi, dan spacing masih hardcode CSS, belum menggunakan token.
3. **Aksesibilitas:** Perlu verifikasi kontras warna dan ukuran tombol eye icon.
4. **Responsivitas:** Hanya satu breakpoint mobile, kurang adaptif untuk tablet.
5. **Etika:** Tidak ada indikasi privasi untuk input kredensial.

**Langkah selanjutnya:**
1. Perbaiki 7 temuan di atas (2 Kritis, 4 Tinggi, 1 Menengah).
2. Lakukan uji coba usabilitas dengan minimal 5 pengguna.
3. Buat spesifikasi handoff dan prototype interaktif.
4. Audit ulang setelah perbaikan.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Login Page  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`  
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\auth\LoginPage.jsx`, `D:\kkpus\admin.kkpus.id\src\pages\auth\LoginPage.css`
