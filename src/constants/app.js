/**
 * Konstanta aplikasi — terpusat untuk menghindari magic numbers.
 * Semua nilai yang perlu di-tune di satu tempat.
 */

export const APP = {
  // Nama aplikasi
  NAME: "Admin KKPUS",
  VERSION: "1.0.0",

  // Timeout & Delay (milliseconds)
  TOAST_AUTO_CLOSE_MS: 4000,
  SPLASH_REDIRECT_MS: 3000,
  SOCKET_RECONNECT_MS: 5000,
  API_TIMEOUT_MS: 30000,

  // Upload limits
  MAX_IMPORT_FILE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_IMAGE_FILE_BYTES: 2 * 1024 * 1024, // 2 MB

  // UI
  DESKTOP_WIDTH: 768,
  TABLET_WIDTH: 992,
  MOBILE_WIDTH: 576,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Date
  DATE_FORMAT: "DD/MM/YYYY",
  DATETIME_FORMAT: "DD/MM/YYYY HH:mm",
  LOCALE: "id-ID",
};

export default APP;
