# Laporan QA: SplashPage.jsx

## Ringkasan
- Keputusan: LAYAK DENGAN CATATAN
- Jumlah temuan: 0 Blocker, 0 Major, 1 Minor, 0 Saran
- File `SplashPage.jsx` secara umum memenuhi standar kualitas yang berlaku, tetapi ada beberapa poin kecil yang perlu diperhatikan.

## Standar yang dipakai
- Standar internal proyek (bila ada)
- Standar umum: ISO/IEC 27001:2022, OWASP Top 10, WCAG 2.2 AA, SemVer, Conventional Commits

## Cakupan
- Diperiksa: Kebenaran fungsional, Kualitas kode, Keamanan, Aksesibilitas, Dokumentasi
- Tidak diperiksa: Pengujian (tidak ada test yang ditemukan), Performa dan skalabilitas, Keandalan dan observabilitas, Dependensi dan supply chain, Kontrak API dan kompatibilitas, Build, CI/CD, dan deployment

## Hasil perintah yang dijalankan
Tidak ada perintah yang dijalankan secara langsung untuk file ini.

## Matriks kepatuhan ISO/IEC 27001:2022 (Annex A)
Tidak ada kontrol ISO/IEC 27001:2022 yang diperiksa secara spesifik untuk file ini.

## Temuan
### [Minor] Penanganan Error pada Gambar
- Lokasi: `admin.kkpus.id/src/pages/auth/SplashPage.jsx:95-106`
- Aspek / standar: Kualitas kode
- Klasifikasi: Ketidaksesuaian minor
- Bukti:
  ```jsx
  {imageError ? (
    <div className="splashx-mosque-fallback" aria-hidden="true">
      <span className="splashx-mosque-icon">🕌</span>
    </div>
  ) : (
    <img
      src="/assets/icons/PUSlogo.png"
      alt="Logo PUS"
      className="splashx-mosque-image"
      onError={() => setImageError(true)}
    />
  )
  ```
- Dampak: Penanganan error pada gambar hanya menampilkan ikon fallback tanpa memberikan informasi tambahan atau log yang berguna untuk debugging.
- Rekomendasi: Tambahkan log error untuk membantu dalam debugging jika gambar gagal dimuat.

## Hal yang sudah baik
- Kode memiliki dokumentasi yang baik dengan komentar yang menjelaskan fungsi tertentu.
- Penggunaan React hooks (useState, useEffect, useCallback, useRef) yang tepat.
- Penanganan cookie dan sessionStorage yang baik untuk membersihkan data pada splash screen.
- Aksesibilitas yang baik dengan penggunaan atribut ARIA seperti `aria-live`, `aria-label`, dan `aria-hidden`.

## Langkah lanjutan
1. Tambahkan log error untuk penanganan error pada gambar.
2. Pertimbangkan untuk menambahkan pengujian unit untuk komponen ini.
