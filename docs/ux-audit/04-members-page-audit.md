# UI/UX Audit Checklist — Members Page / Daftar Anggota Koperasi (HASIL AUDIT)

## Informasi Audit

| Field | Isi |
|-------|-----|
| Nama Proyek | Admin Kkpus (Backoffice Koperasi) |
| Halaman / Layar yang Di-audit | Members Page / Daftar Anggota Koperasi (`/anggota`) |
| URL / Lokasi File | `src/pages/anggota/MembersPage.jsx` |
| Route Key | `membersPage` (terkait `globalMembers` / `membersPage`) |
| Protected Route | ✅ Ya (memerlukan autentikasi admin) |
| Auditor | Senior UI/UX Designer (Skill `/uiux`) |
| Tanggal Audit | 16 Nov 2026 |
| Versi Design System | Belum diketahui |
| Status Akhir | 🟡 Perbaikan Besar |

## Komponen & File yang Di-audit

| File | Peran |
|------|-------|
| `src/pages/anggota/MembersPage.jsx` | Halaman utama: fetch, filter, sort, pagination, batch select, export, delete |
| `src/pages/anggota/components/MembersHeader.jsx` | Header judul, tombol Import/Export/Hapus Batch |
| `src/pages/anggota/components/MembersStats.jsx` | 4 kartu statistik anggota (Total, Aktif, Reguler, Luar Biasa) |
| `src/pages/anggota/components/MembersTable.jsx` | Tabel anggota dengan filter per kolom, sort, pagination, aksi detail/role |
| `src/pages/anggota/components/MemberDetailModal.jsx` | Modal detail profil lengkap (tab: Semua, Biodata, Keuangan, Pekerjaan, Dokumen) |
| `src/pages/anggota/components/EditRoleModal.jsx` | Modal ubah role/peran anggota |
| `src/pages/anggota/components/ImportAnggotaModal.jsx` | Modal import anggota dari Excel |
| `src/pages/anggota/components/MemberIdentitySection.jsx` | Seksi identitas & dokumen registrasi (KTP, selfie, alamat) |
| `src/pages/anggota/components/MemberDetailsSection.jsx` | Seksi informasi akun, pekerjaan, bank |
| `src/pages/anggota/components/MemberPaymentProofSection.jsx` | Seksi bukti pembayaran simpanan pokok/wajib |
| `src/pages/anggota/components/MemberApprovalWorkflowSection.jsx` | Seksi alur persetujuan (Pengawas, Ketua, Bendahara) |
| `src/pages/anggota/components/TerminationMemberInfoSection.jsx` | Seksi info anggota untuk pengajuan berhenti |

---

## Skor Akhir

| Kategori | Maksimal | Skor Dapat | Status |
|----------|----------|------------|--------|
| 1. Riset & Pemahaman Pengguna | 10 | 2 | ❌ Gagal |
| 2. Hukum UX & Heuristik | 10 | 6 | ⚠️ Perlu perbaikan |
| 3. Aksesibilitas (WCAG 2.2 AA) | 10 | 4 | ❌ Gagal |
| 4. Design System & Konsistensi | 10 | 4 | ⚠️ Perlu verifikasi |
| 5. Responsivitas & Adaptasi | 10 | 7 | ✅ Baik |
| 6. Proses Desain (Double Diamond) | 5 | 1 | ❌ Gagal |
| 7. Deliverable & Handoff | 5 | 0 | ❌ Gagal |
| 8. Uji Usabilitas & Iterasi | 5 | 0 | ❌ Gagal |
| 9. Etika & Anti Dark Pattern | 5 | 3 | ⚠️ Perlu perbaikan |
| 10. Metrik Sukses | 5 | 0 | ❌ Gagal |
| **Total** | **80** | **27** | **🟡 Perbaikan Besar** |

**Keterangan lulus:** Skor minimal 70 dan tidak ada item **Kritis** yang gagal.

---

## Bagian 1: Riset & Pemahaman Pengguna (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 1.1 | Persona utama telah ditetapkan dan dokumentasi tersedia | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi riset dalam kode | Tinggi |
| 1.2 | Jobs-to-be-done (JTBD) pengguna telah ditetapkan | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti JTBD | Tinggi |
| 1.3 | User goal utama tiap layar jelas dan tercatat | #1 | □ Pass □ Fail □ N/A | Tujuan: kelola data anggota, verifikasi setoran, ubah role, impor/ekspor — tidak dikomunikasikan eksplisit | Tinggi |
| 1.4 | Pain point pengguna teridentifikasi | #1 | □ Pass □ Fail □ N/A | Tidak ada bukti riset | Menengah |
| 1.5 | User journey / user flow telah dilacak dari awal sampai akhir | #1 | □ Pass □ Fail □ N/A | Tidak ada dokumentasi journey | Tinggi |
| 1.6 | Keputusan desain dapat diturunkan dari riset (wawancara, survei, analitik, uji coba) | #1 | □ Pass □ Fail □ N/A | Tidak ada dasar bukti | Tinggi |

---

## Bagian 2: Hukum UX & Heuristik (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 2.1 | Mengikuti konvensi umum yang dikenal pengguna (Jakob's Law) | #2 | □ Pass □ Fail □ N/A | Layout tabel data dengan filter, sort, pagination mengikuti konvensi admin panel standar | Menengah |
| 2.2 | Jumlah opsi pilihan tidak berlebihan (Hick's Law) | #2 | □ Pass □ Fail □ N/A | 6 filter kolom + sort + pagination + aksi detail/role per baris — cukup banyak opsi di satu layar | Tinggi |
| 2.3 | Tombol / target interaksi cukup besar dan mudah dijangkau (Fitts's Law) | #2 | □ Pass □ Fail □ N/A | Tombol Eye (detail) dan UserGear (role) menggunakan rounded-circle p-2, ukuran kecil kemungkinan < 44×44 px | Tinggi |
| 2.4 | Informasi tidak melebihi 7 (±2) item sekaligus; digunakan chunking (Miller's Law) | #2 | □ Pass □ Fail □ N/A | 8 kolom tabel + 4 kartu statistik + detail modal dengan 5 tab — mendekati/melebihi batas 7±2 | Tinggi |
| 2.5 | Kompleksitas tidak ditransfer secara tidak perlu ke pengguna (Tesler's Law) | #2 | □ Pass □ Fail □ N/A | Filter dan sort diabstraksi ke komponen, tapi batch delete mengharuskan verifikasi password — kompleksitas aman | Menengah |
| 2.6 | Sistem memberikan respons dalam waktu < 400 ms (Doherty Threshold) | #2 | □ Pass □ Fail □ N/A | useDeferredValue untuk filter agar pengetikan tidak freeze, Spinner loading, SweetAlert2 konfirmasi — respons baik | Menengah |
| 2.7 | Visibilitas status sistem (Nielsen #1) | #2 | □ Pass □ Fail □ N/A | Loading spinner, badge status anggota, info "Menampilkan X-Y dari Z anggota" — baik | Tinggi |
| 2.8 | Kecocokan dengan dunia nyata / bahasa pengguna (Nielsen #2) | #2 | □ Pass □ Fail □ N/A | Bahasa Indonesia, label yang jelas ("No. Anggota / NIK", "Bergabung", "Status") | Menengah |
| 2.9 | Kontrol pengguna dan kebebasan keluar (Nielsen #3) | #2 | □ Pass □ Fail □ N/A | Tombol Batal pada modal, close button modal, reset filter — kontrol pengguna baik | Tinggi |
| 2.10 | Konsistensi dan standar di seluruh antarmuka (Nielsen #4) | #2 | □ Pass □ Fail □ N/A | Menggunakan Bootstrap classes konsisten, tapi ada inline style campuran (backgroundColor, width, height) | Tinggi |
| 2.11 | Pencegahan kesalahan (Nielsen #5) | #2 | □ Pass □ Fail □ N/A | Validasi file Excel sebelum import, password konfirmasi untuk hapus, SweetAlert2 peringatan permanen — baik | Tinggi |
| 2.12 | Pengenalan bukan ingatan (Nielsen #6) | #2 | □ Pass □ Fail □ N/A | Icon phosphor-react (Eye, UserGear, Upload, Download, Trash) sebagai pengenal visual | Menengah |
| 2.13 | Fleksibilitas dan efisiensi penggunaan (Nielsen #7) | #2 | □ Pass □ Fail □ N/A | Batch select, batch delete, export ke Excel, import Excel — fitur efisiensi baik | Rendah |
| 2.14 | Estetika dan desain minimalis (Nielsen #8) | #2 | □ Pass □ Fail □ N/A | Desain bersih, kartu dengan shadow, badge warna sesuai status | Rendah |
| 2.15 | Pemulihan dari kesalahan (Nielsen #9) | #2 | □ Pass □ Fail □ N/A | Reset filter, error message deskriptif dari API, import failure table — baik | Tinggi |
| 2.16 | Dokumentasi dan bantuan tersedia (Nielsen #10) | #2 | □ Pass □ Fail □ N/A | Import modal memiliki langkah-langkah (1-4), tapi tidak ada tooltip/panduan di tabel utama | Rendah |

---

## Bagian 3: Aksesibilitas (WCAG 2.2 — Level AA Minimum) (WAJIB)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 3.1 | Kontras teks normal minimal 4.5:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Menggunakan Bootstrap text-primary/success/warning/danger dan text-muted — perlu verifikasi kontras aktual | Kritis |
| 3.2 | Kontras teks besar dan elemen UI minimal 3:1 terhadap latar | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS | Kritis |
| 3.3 | Warna bukan satu-satunya pengenal informasi, peringatan, atau aksi | #3 | □ Pass □ Fail □ N/A | Badge menggunakan warna + teks label, cukup baik | Kritis |
| 3.4 | Target sentuhan minimal 44 × 44 px (atau 24 × 24 CSS dengan padding memadai) | #3 | □ Pass □ Fail □ N/A | Tombol Eye/UserGear rounded-circle p-2 kemungkinan < 44×44 px; tombol tabel header size="sm" | Kritis |
| 3.5 | Semua elemen interaktif dapat diakses melalui navigasi keyboard (Tab) | #3 | □ Pass □ Fail □ N/A | Elemen HTML standar (button, input, select, checkbox), seharusnya bisa diakses Tab, tapi tidak ada skip link | Kritis |
| 3.6 | Indikasi fokus (:focus-visible) terlihat jelas pada semua elemen interaktif | #3 | □ Pass □ Fail □ N/A | Bootstrap menyediakan focus ring, perlu verifikasi visual pada semua elemen | Kritis |
| 3.7 | Konten tetap terbaca hingga diperbesar 200% tanpa assistive technology | #3 | □ Pass □ Fail □ N/A | Perlu verifikasi CSS dan layout saat zoom 200% (tabel 8 kolom bisa pecah) | Tinggi |
| 3.8 | Gambar berfungsi memiliki teks alternatif (`alt`) yang deskriptif | #3 | □ Pass □ Fail □ N/A | KTP/selfie img memiliki `alt="KTP"` / `alt="Selfie"` / `alt="Bukti Transfer"` — baik | Tinggi |
| 3.9 | Gambar dekoratif memiliki `alt` kosong atau di-siapkan sebagai dekoratif | #3 | □ Pass □ Fail □ N/A | Ikon phosphor-react dekoratif tidak memiliki aria-hidden, mungkin dibaca layar pembaca | Rendah |
| 3.10 | Setiap input formulir memiliki label yang terprogram dan terlihat | #3 | □ Pass □ Fail □ N/A | Filter Form.Control tidak memiliki `<label>` yang terlihat, hanya placeholder | Kritis |
| 3.11 | Pesan error deskriptif dan membantu perbaikan (bukan hanya "terjadi kesalahan") | #3 | □ Pass □ Fail □ N/A | SweetAlert2 error dari API deskriptif, import errorMsg — baik | Tinggi |
| 3.12 | Tersedia opsi untuk mematikan animasi yang memicu gangguan vestibular | #3 | □ Pass □ Fail □ N/A | animate__animated animate__fadeIn pada tombol hapus, tidak diketahui apakah respeck prefers-reduced-motion | Menengah |
| **3.13 (Tambahan)** | Tabel dan tab memiliki atribut ARIA yang sesuai | #3 | □ Pass □ Fail □ N/A | react-bootstrap Tab/Nav mungkin sudah ARIA, tabel tidak memiliki caption/summary, th sort menggunakan role="button" tapi tanpa aria-sort | Kritis |
| **3.14 (Tambahan)** | Notifikasi toast/SweetAlert2 di-announce ke layar pembaca | #3 | □ Pass □ Fail □ N/A | SweetAlert2 dialog, tidak diketahui apakah di-announce ke screen reader | Tinggi |

---

## Bagian 4: Design System & Konsistensi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 4.1 | Warna didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Inline style backgroundColor ("#fee2e2", "#e0e7ff"), borderColor ("#f1f5f9"), style backgroundColor ("#10b981") — hardcode | Tinggi |
| 4.2 | Tipografi didefinisikan sebagai design token, tidak hardcode | #4 | □ Pass □ Fail □ N/A | Inline style fontSize "11px", letterSpacing "0.5px", kelas small/fw-bold campuran — tidak terdefinisi sebagai token | Tinggi |
| 4.3 | Spacing / jarak didefinisikan sebagai design token (mis. 8px grid) | #4 | □ Pass □ Fail □ N/A | Menggunakan Bootstrap spacing (p-3, mb-4, g-3, px-2.5, py-2.5) hardcode | Tinggi |
| 4.4 | Border-radius dan shadow didefinisikan sebagai token | #4 | □ Pass □ Fail □ N/A | Bootstrap rounded-3, rounded-4, rounded-pill, shadow-sm hardcode | Menengah |
| 4.5 | Komponen utama (tombol, input, kartu, modal, navigasi) dibuat reusable | #4 | □ Pass □ Fail □ N/A | InfoCard reusable, tabel reusable untuk anggota | Tinggi |
| 4.6 | Komponen memiliki varian: default, hover, active, disabled, loading | #4 | □ Pass □ Fail □ N/A | Tombol ada variant primary/danger/success/outline/link, loading via Spinner, disabled state ada | Tinggi |
| 4.7 | Grid dan layout konsisten di seluruh layar | #4 | □ Pass □ Fail □ N/A | Bootstrap Container/Row/Col, konsisten | Tinggi |
| 4.8 | Skala tipografi terdefinisi (h1-h6, body, caption, label) | #4 | □ Pass □ Fail □ N/A | Menggunakan h3, h5, h6, small, fs-5, fs-6 campuran — tidak ada skala terdefinisi | Menengah |
| 4.9 | Ikonset menggunakan satu gaya, ukuran, dan stroke yang konsisten | #4 | □ Pass □ Fail □ N/A | Menggunakan phosphor-react (User, Trash, IdentificationCard, dll.) — konsisten | Menengah |
| 4.10 | Warna dan ikon status (sukses, peringatan, error, info, loading) seragam | #4 | □ Pass □ Fail □ N/A | Menggunakan warna Bootstrap (success, warning, danger, secondary) — seragam | Tinggi |

---

## Bagian 5: Responsivitas & Adaptasi (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 5.1 | Desain diterapkan mobile-first (dari layar kecil ke besar) | #5 | □ Pass □ Fail □ N/A | Menggunakan Bootstrap classes responsive (xs/md/lg), tapi tidak ada CSS custom untuk verifikasi mobile-first | Tinggi |
| 5.2 | Breakpoint terdefinisi dengan jelas (mis. xs, sm, md, lg, xl) | #5 | □ Pass □ Fail □ N/A | Menggunakan Col xs={6} lg={3}, Col md={2} md={10} — Bootstrap breakpoint | Tinggi |
| 5.3 | Tata letak berubah dengan baik di setiap breakpoint | #5 | □ Pass □ Fail □ N/A | Tabel dalam table-responsive, header tabel wrap, statistik menumpuk di xs — baik | Tinggi |
| 5.4 | Konten menyusun ulang, elemen tidak pecah atau terpotong | #5 | □ Pass □ Fail □ N/A | text-truncate pada email, tabel responsive — konten disusun ulang | Tinggi |
| 5.5 | Antarmuka usable di orientasi portrait dan landscape | #5 | □ Pass □ Fail □ N/A | Perlu verifikasi | Menengah |
| 5.6 | Target sentuhan di mobile mematuhi standar aksesibilitas (≥ 44 × 44 px) | #5 | □ Pass □ Fail □ N/A | Tombol Eye/UserGear kecil kemungkinan < 44×44 px di mobile | Kritis |
| 5.7 | Tombol aksi tabel mudah dijangkau dengan jempol di mobile | #5 | □ Pass □ Fail □ N/A | Tombol aksi di tengah tabel (Eye, UserGear) — di tengah layar dapat dijangkau | Menengah |

---

## Bagian 6: Proses Desain (Double Diamond) (Wajib)

| No | Item Audit | Standar | Status | Catatan | Severity |
|----|------------|---------|--------|---------|----------|
| 6.1 | Tahap Discover: riset pengguna dan analisis kompetitor tersedia | #6 | □ Pass □ Fail □ N/A | Tidak ada bukti riset pengguna | Menengah |
| 6.2 | Tahap Define: persona, user journey, dan requirement terdefinisi | #6 | □ Pass □ Fail □ N/A | Tidak ada persona/journey terdefinisi | Menengah |
| 6.3 | Tahap Develop: sketsa, wireframe, dan prototipe rendah fidelitas tersedia | #6 | □ Pass □ Fail □ N/A | Kode tersedia sebagai hasil develop | Menengah |
| 6.4 | Tahap Deliver: desain tinggi fidelitas, prototype interaktif, dan handoff tersedia | #6 | □ Pass □ Fail □ N/A | Kode siap, tapi belum melalui uji coba dan handoff | Tinggi |
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
| 9.3 | Opsi batal tidak disembunyikan di balik konfirmasi mahal | #9 | □ Pass □ Fail □ N/A | SweetAlert2 konfirmasi hapus memiliki tombol "Batal" yang jelas, modal detail memiliki "Tutup" | Kritis |
| 9.4 | Tidak ada urgency palsu kecuali informasi benar-benar akurat | #9 | □ Pass □ Fail □ N/A | Tidak ada urgency palsu di halaman ini | Menengah |
| 9.5 | Tidak ada roach-motel (mudah daftar, sulit batal) | #9 | □ Pass □ Fail □ N/A | Hapus anggota mudah (tombol terlihat), tidak ada penghalang berlebihan | Kritis |
| 9.6 | Privasi default: data minimal, izin yang sesuai, transparansi penggunaan data | #9 | □ Pass □ Fail □ N/A | **NIK KTP, nomor telepon, email, alamat, dan nomor rekening bank ditampilkan secara terbuka di tabel dan detail modal — risiko pelanggaran privasi data sensitif** | Tinggi |

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
| 1 | Data sensitif (NIK KTP, telepon, email, alamat, rekening bank) ditampilkan secara terbuka | `MembersTable.jsx`, `MemberDetailModal.jsx`, `MemberIdentitySection.jsx`, `MemberDetailsSection.jsx` | Terapkan maskir data (mis. NIK hanya 4 digit terakhir), batasi akses data sensitif, atau tambahkan opsi "Tampilkan data sensitif" dengan otorisasi | **Kritis** |
| 2 | Tombol Eye (detail) dan UserGear (role) ukuran kecil kemungkinan < 44×44 px | `MembersTable.jsx` baris 266-283 | Perbesar tombol atau tambahkan padding agar minimal 44×44 px | **Kritis** |
| 3 | Filter input di header tabel tidak memiliki `<label>` yang terlihat dan terprogram | `MembersTable.jsx` baris 156-214 | Tambahkan `<label>` yang terlihat atau `aria-label` pada setiap Form.Control | **Kritis** |
| 4 | Tidak ada skip link dan indikasi fokus keyboard yang terlihat jelas | `MembersPage.jsx` + semua komponen | Tambahkan skip link dan pastikan `:focus-visible` terlihat | **Kritis** |
| 5 | Warna dan spacing hardcode (inline style backgroundColor, borderColor) | `MemberIdentitySection.jsx`, `MemberApprovalWorkflowSection.jsx`, `MembersPage.jsx` | Migrasi ke design token / CSS variable | **Tinggi** |
| 6 | Ikon phosphor-react tanpa aria-label atau aria-hidden | Semua komponen (phosphor-react ikon) | Tambahkan `aria-label` pada ikon fungsional atau `aria-hidden="true"` pada ikon dekoratif | **Tinggi** |
| 7 | Animasi animate__animated animate__fadeIn tanpa `prefers-reduced-motion` | `MembersHeader.jsx` baris 24 | Respek prefers-reduced-motion, nonaktifkan animasi jika diperlukan | **Tinggi** |
| 8 | Tabel 8 kolom tanpa caption/summary dan th sort tanpa aria-sort | `MembersTable.jsx` baris 69-135 | Tambahkan `<caption>`, `aria-sort`, dan atribut ARIA pada tabel | **Tinggi** |
| 9 | Batch delete adalah hard delete permanen dengan risiko tinggi | `MembersPage.jsx` baris 297-355 | Pertimbangkan soft delete (arsip) daripada hard delete, atau tambahkan konfirmasi dua langkah | **Tinggi** |
| 10 | Export Excel mencakup data sensitif lengkap (NIK, telepon, email, rekening) | `MembersPage.jsx` baris 201-245 | Batasi data yang diekspor atau tambahkan opsi pemilihan kolom yang diekspor | **Tinggi** |
| 11 | Tidak ada uji usabilitas dan handoff yang terdokumentasi | Seluruh halaman | Lakukan uji coba usabilitas dengan minimal 5 admin, buat spesifikasi handoff | **Menengah** |

---

## Kesimpulan & Rekomendasi

**Keputusan akhir:** 🟡 **Perbaikan Besar**

Members Page memiliki fitur yang sangat lengkap dan berguna untuk admin: tabel dengan filter per kolom, sort, pagination, batch selection, export/import Excel, detail modal dengan 5 tab, role editing, dan approval workflow. Konfirmasi sebelum aksi destruktif (hapus) juga sudah baik menggunakan SweetAlert2.

Namun terdapat beberapa celah kritis yang harus diperbaiki:

1. **Privasi data (Kritis):** NIK KTP, telepon, email, alamat, dan rekening bank ditampilkan secara terbuka — melanggu prinsip data minimal dan privasi.
2. **Aksesibilitas (Kritis):** Tombol aksi kecil (< 44×44 px), filter tanpa label, tidak ada skip link/fokus indikator, ikon tanpa ARIA.
3. **Design System (Tinggi):** Masih banyak inline style hardcode, belum menggunakan design token.
4. **Keamanan operasi (Tinggi):** Hard delete permanen dan export data sensitif perlu pertimbangan ulang.

**Langkah selanjutnya:**
1. Perbaiki 11 temuan di atas (4 Kritis, 6 Tinggi, 1 Menengah).
2. Lakukan uji coba usabilitas dengan minimal 5 pengguna admin (fokus pada manajemen anggota dan verifikasi setoran).
3. Buat spesifikasi handoff dan prototype interaktif.
4. Audit ulang setelah perbaikan.

---

**Dibuat oleh:** Senior UI/UX Designer — Skill `/uiux`  
**Halaman:** Members Page / Daftar Anggota Koperasi  
**Referensi standar:** WCAG 2.2 Level AA, Nielsen's 10 Usability Heuristics, Double Diamond Process  
**File template:** `.opencode/skills/uiux/references/uiux-audit-checklist.md`  
**File kode sumber:** `D:\kkpus\admin.kkpus.id\src\pages\anggota\MembersPage.jsx` dan komponen terkait