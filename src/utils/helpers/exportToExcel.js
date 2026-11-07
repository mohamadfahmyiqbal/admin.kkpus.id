import * as XLSX from "xlsx";

/**
 * Menulis data ke file Excel dengan aman.
 * Validasi minimal data dan batasan jumlah baris untuk mencegah ReDoS/xlsx prototype pollution.
 *
 * @param {Array<Object>} data - Array objek berisi data yang akan diekspor.
 * @param {string} filename - Nama file tanpa ekstensi (akan otomatis .xlsx ditambahkan).
 * @throws {Error} Jika data kosong atau melebihi batas maksimum baris (10000).
 */
export const exportToExcel = (data, filename = "report") => {
  if (!data || !Array.isArray(data)) return;
  // Batasi jumlah baris untuk mencegah ReDoS dan eksploitasi prototype pollution di xlsx
  const MAX_ROWS = 10000;
  const safeData = data.slice(0, MAX_ROWS);
  if (safeData.length !== data.length) {
    console.warn(
      `⚠️ exportToExcel: Data terlalu banyak. Menghasilkan ${safeData.length} dari ${data.length} baris. Gunakan filter sebelum ekspor.`
    );
  }
  try {
    const worksheet = XLSX.utils.json_to_sheet(safeData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (err) {
    console.error("❌ exportToExcel gagal: ", err);
    throw new Error("Gagal mengekspor data ke Excel");
  }
};

export default exportToExcel;
export { exportToExcel as t };
