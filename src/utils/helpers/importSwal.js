import Swal from "sweetalert2";
import { normalizeRows } from "../../components/ui/ImportFailureTable";

/**
 * Tampilkan daftar baris yang gagal di dalam popup SweetAlert2.
 *
 * Dipakai oleh seluruh fitur import (anggota, simpanan, tabungan, pinjaman,
 * jual beli, arisan, pendanaan, investasi) agar admin langsung melihat data
 * mana saja yang gagal beserta penyebabnya tanpa harus membuka modal.
 *
 * @param {object} opts
 * @param {Array}  [opts.errors]        rincian error dari backend (`data.errors`)
 * @param {number} [opts.totalFailed]   jumlah baris gagal (`data.totalFailed`)
 * @param {number} [opts.totalImported] jumlah baris berhasil (`data.totalImported`)
 * @param {string} [opts.label]         label jenis data yang diimpor
 * @param {string} [opts.filename]      nama file CSV saat diunduh
 * @returns {Promise} promise Swal.fire
 */
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

const buildCsv = (rows, hasAccountColumn) => {
  const header = [
    "Baris",
    ...(hasAccountColumn ? ["No. Anggota", "Nama Anggota"] : []),
    "Penyebab Gagal",
  ];
  const body = rows.map((r) => [
    r.row ?? "-",
    ...(hasAccountColumn ? [r.account || "-", r.name || "-"] : []),
    r.reason,
  ]);

  const escapeCell = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [header, ...body]
    .map((cols) => cols.map(escapeCell).join(";"))
    .join("\r\n");
};

const downloadCsv = (filename, csv) => {
  // BOM agar Excel membaca UTF-8 dengan benar
  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const showImportFailureSwal = async ({
  errors = [],
  totalFailed = 0,
  totalImported = 0,
  label = "Data",
  filename = "Data_Gagal_Import",
} = {}) => {
  const rows = normalizeRows(errors, totalFailed);
  const hasAccountColumn = rows.some((r) => r.account || r.name);
  const failedTotal = totalFailed || rows.length;

  const summary = `
    <div style="text-align:left;font-size:0.95rem;">
      <p class="mb-1">Jenis data: <b>${escapeHtml(label)}</b></p>
      <p class="mb-1">Berhasil diimpor: <b style="color:#198754;">${totalImported}</b> baris</p>
      <p class="mb-2">Gagal diproses: <b style="color:#dc3545;">${failedTotal}</b> baris</p>
    </div>`;

  const thead = `
    <tr>
      <th style="width:70px;">Baris</th>
      ${hasAccountColumn ? `<th style="width:140px;">No. Anggota</th><th>Nama</th>` : ""}
      <th>Penyebab Gagal</th>
    </tr>`;

  const tbody =
    rows.length === 0
      ? `<tr><td colspan="${hasAccountColumn ? 4 : 2}" class="text-center text-muted">Tidak ada rincian baris gagal dari server.</td></tr>`
      : rows
          .map(
            (r) => `
        <tr>
          <td class="fw-semibold text-muted">${escapeHtml(r.row ?? "-")}</td>
          ${
            hasAccountColumn
              ? `<td>${
                  r.account
                    ? `<span class="badge bg-light text-dark border">${escapeHtml(r.account)}</span>`
                    : '<span class="text-muted">-</span>'
                }</td><td>${r.name ? escapeHtml(r.name) : '<span class="text-muted">-</span>'}</td>`
              : ""
          }
          <td><span class="text-danger">${escapeHtml(r.reason)}</span>${
            r.field
              ? ` <span class="badge bg-danger-subtle text-danger-emphasis">${escapeHtml(r.field)}</span>`
              : ""
          }</td>
        </tr>`
          )
          .join("");

  const table = `
    <div style="max-height:340px;overflow:auto;border:1px solid #dee2e6;border-radius:.5rem;margin-top:.5rem;">
      <table class="table table-sm table-hover mb-0 align-middle" style="font-size:0.85rem;">
        <thead class="table-light" style="position:sticky;top:0;">
          ${thead}
        </thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>`;

  return Swal.fire({
    icon: totalImported > 0 ? "warning" : "error",
    title: totalImported > 0 ? "Import Selesai Sebagian" : "Import Gagal",
    html: `${summary}${table}`,
    width: 900,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Tutup",
    footer:
      '<button type="button" id="import-failure-download" class="btn btn-outline-secondary btn-sm">Unduh CSV</button>',
    didOpen: () => {
      const btn = document.getElementById("import-failure-download");
      if (btn) {
        btn.addEventListener("click", () => {
          downloadCsv(filename, buildCsv(rows, hasAccountColumn));
        });
      }
    },
  });
};

export default showImportFailureSwal;