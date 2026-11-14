/**
 * Utilitas state filter kolom tabel anggota.
 *
 * Dipisahkan agar dapat diuji tanpa memuat komponen halaman (yang menarik
 * dependensi berat seperti exceljs / axios).
 */

export const MEMBER_FILTER_KEYS = [
  "memberNo",
  "nameOrContact",
  "type",
  "role",
  "joinDate",
  "status",
];

export const createEmptyMemberFilters = () =>
  MEMBER_FILTER_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {});

/**
 * Bandingkan dua state filter kolom secara shallow.
 *
 * Dipakai untuk mendeteksi nilai yang disuntikkan browser (autofill/password
 * manager) ke kolom pencarian saat dialog konfirmasi hapus terbuka, lalu
 * memulihkan filter seperti sebelum dialog dibuka.
 *
 * @param {Record<string, string>|null|undefined} a
 * @param {Record<string, string>|null|undefined} b
 * @returns {boolean}
 */
export const isSameFilterState = (a, b) =>
  MEMBER_FILTER_KEYS.every((key) => (a?.[key] ?? "") === (b?.[key] ?? ""));