import { toast } from "react-toastify";

/**
 * Fungsi global untuk menampilkan notifikasi toast.
 * Dapat dipanggil di mana saja setelah import.
 *
 * @param {'info'|'success'|'warning'|'error'} type - Tipe notifikasi
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {object} [options] - Opsi tambahan untuk react-toastify
 */
export function showNotifikasi(type, message, options = {}) {
  switch (type) {
    case "success":
      toast.success(message, { position: "top-center", ...options });
      break;
    case "error":
      toast.error(message, { position: "top-center", ...options });
      break;
    case "warning":
      toast.warning(message, { position: "top-center", ...options });
      break;
    case "info":
    default:
      toast.info(message, { position: "top-center", ...options });
      break;
  }
}

// Contoh penggunaan:
// showNotifikasi("success", "Data berhasil disimpan!");
// showNotifikasi("error", "Terjadi kesalahan!", { autoClose: 5000 });
