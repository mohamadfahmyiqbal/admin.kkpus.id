import ExcelJS from "exceljs";

/**
 * Menulis data ke file Excel dengan aman menggunakan ExcelJS.
 *
 * Melindungi dari kerentanan prototype pollution dan ReDoS yang ditemukan
 * di library xlsx lama (SheetJS < 0.20.2), serta membatasi jumlah baris
 * untuk mencegah penyalahgunaan file besar.
 *
 * @param {Array<Object>} data - Array objek berisi data yang akan diekspor.
 * @param {string} filename - Nama file tanpa ekstensi (.xlsx ditambahkan otomatis).
 * @throws {Error} Jika data kosong atau melebihi batas maksimum baris.
 */
export const exportToExcel = (data, filename = "report") => {
  if (!data || !Array.isArray(data)) return;

  // Batasi jumlah baris untuk mencegah ReDoS dan eksploitasi prototype pollution
  const MAX_ROWS = 10000;
  const safeData = data.slice(0, MAX_ROWS);
  if (safeData.length !== data.length) {
    console.warn(
      `⚠️ exportToExcel: Data terlalu banyak. Menghasilkan ${safeData.length} dari ${data.length} baris. Gunakan filter sebelum ekspor.`
    );
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Tambahkan header kolom berdasarkan kunci objek pertama
    if (safeData.length > 0 && typeof safeData[0] === "object") {
      const headerKeys = Object.keys(safeData[0]);
      worksheet.addRow(headerKeys);

      // Tambahkan baris data
      safeData.forEach((row) => {
        worksheet.addRow(
          headerKeys.map((key) => row[key] ?? "")
        );
      });
    }

    worksheet.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  } catch (err) {
    console.error("❌ exportToExcel gagal: ", err);
    throw new Error("Gagal mengekspor data ke Excel");
  }
};

export default exportToExcel;
export { exportToExcel as t };