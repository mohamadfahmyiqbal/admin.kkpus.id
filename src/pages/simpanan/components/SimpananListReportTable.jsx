import React from "react";
import { Table, Spinner } from "react-bootstrap";
import { formatRupiah, REPORT_SEARCH_PLACEHOLDERS } from "./reportConstants";

const SimpananListReportTable = ({
  loading,
  filteredList,
  reportList,
  summary,
  searchFilters,
  onFilterChange,
  currentYear,
}) => {
  return (
    <div className="table-responsive border rounded-3">
      <Table
        className="table table-striped table-hover table-bordered align-middle mb-0 text-nowrap compact-table"
        style={{ minWidth: "1200px" }}
      >
        <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
          <tr>
            <th
              rowSpan="3"
              className="align-middle position-sticky sticky-col-no thead-sticky"
              style={{ borderRight: "1px solid #e2e8f0", width: "40px" }}
            >
              No
            </th>
            <th
              rowSpan="3"
              className="align-middle text-start position-sticky sticky-col-nama thead-sticky sticky-border"
            >
              Nama
            </th>
            <th colSpan="4" className="sticky-border text-center">
              Simpanan Tahun Ini
            </th>
            <th colSpan="4" className="sticky-border text-center">
              Simpanan {currentYear - 1}
            </th>
            <th colSpan="2" className="text-center">
              Simpanan {currentYear - 2}
            </th>
          </tr>
          <tr>
            <th className="num-cell">Total</th>
            <th className="num-cell">Pokok</th>
            <th className="num-cell">Wajib</th>
            <th className="num-cell col-separator">Sukarela</th>
            <th className="num-cell">Total</th>
            <th className="num-cell">Pokok</th>
            <th className="num-cell">Wajib</th>
            <th className="num-cell col-separator">Sukarela</th>
            <th className="num-cell">Total</th>
            <th className="num-cell">Pokok</th>
          </tr>
          <tr>
            {REPORT_SEARCH_PLACEHOLDERS.map((ph, idx) => (
              <th
                key={idx}
                className="p-1"
                style={{
                  fontWeight: "normal",
                  borderRight:
                    idx === 1
                      ? "2px solid #e2e8f0"
                      : idx === 5 || idx === 9
                      ? "1px solid #e2e8f0"
                      : undefined,
                }}
              >
                {idx > 0 && (
                  <input
                    type="text"
                    className="compact-search-input"
                    placeholder={ph}
                    value={searchFilters[idx]}
                    onChange={(e) => onFilterChange(idx, e.target.value)}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={12} className="text-center py-4">
                <Spinner animation="border" variant="primary" size="sm" />
                <div className="mt-1 text-muted">Memuat data...</div>
              </td>
            </tr>
          ) : filteredList.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center text-muted py-4">
                {searchFilters.some((f) => f.trim() !== "")
                  ? "Data tidak ditemukan dengan filter yang diberikan"
                  : "Belum ada data laporan"}
              </td>
            </tr>
          ) : (
            filteredList.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="text-center position-sticky sticky-col-no bg-sticky col-separator">
                  {idx + 1}
                </td>
                <td className="fw-medium position-sticky sticky-col-nama bg-sticky sticky-border">
                  {item.nama}
                </td>
                <td className="num-cell text-primary fw-medium total-highlight">
                  {formatRupiah(item.tahun_ini?.total)}
                </td>
                <td className="num-cell">{formatRupiah(item.tahun_ini?.pokok)}</td>
                <td className="num-cell">{formatRupiah(item.tahun_ini?.wajib)}</td>
                <td className="num-cell col-separator">
                  {formatRupiah(item.tahun_ini?.sukarela)}
                </td>
                <td className="num-cell text-primary fw-medium total-highlight">
                  {formatRupiah(item.tahun_lalu?.total)}
                </td>
                <td className="num-cell">{formatRupiah(item.tahun_lalu?.pokok)}</td>
                <td className="num-cell">{formatRupiah(item.tahun_lalu?.wajib)}</td>
                <td className="num-cell col-separator">
                  {formatRupiah(item.tahun_lalu?.sukarela)}
                </td>
                <td className="num-cell text-primary fw-medium total-highlight">
                  {formatRupiah(item.tahun_lalu2?.total)}
                </td>
                <td className="num-cell">{formatRupiah(item.tahun_lalu2?.pokok)}</td>
              </tr>
            ))
          )}
        </tbody>
        {reportList.length > 0 && (
          <tfoot
            className="fw-bold"
            style={{ position: "sticky", bottom: 0, zIndex: 2 }}
          >
            <tr>
              <td
                colSpan="2"
                className="text-center position-sticky sticky-col-no thead-sticky sticky-border"
              >
                Total Keseluruhan
              </td>
              <td className="num-cell text-primary">
                {formatRupiah(summary.total_all)}
              </td>
              <td className="num-cell">{formatRupiah(summary.total_pokok)}</td>
              <td className="num-cell">{formatRupiah(summary.total_wajib)}</td>
              <td
                className="num-cell col-separator"
                style={{ borderRight: "2px solid #e2e8f0" }}
              >
                {formatRupiah(summary.total_sukarela)}
              </td>
              <td className="num-cell text-primary">{formatRupiah(0)}</td>
              <td className="num-cell">{formatRupiah(0)}</td>
              <td className="num-cell">{formatRupiah(0)}</td>
              <td className="num-cell col-separator">{formatRupiah(0)}</td>
              <td className="num-cell text-primary">{formatRupiah(0)}</td>
              <td className="num-cell">{formatRupiah(0)}</td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
};

export default SimpananListReportTable;
