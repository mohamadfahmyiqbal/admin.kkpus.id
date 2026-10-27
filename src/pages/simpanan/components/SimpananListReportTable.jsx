import React, { useState, useMemo } from "react";
import { Table, Spinner, Form, Pagination } from "react-bootstrap";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const totalItems = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset ke halaman 1 jika filter berubah atau halaman saat ini melebihi total pages
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = useMemo(() => {
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, startIndex, pageSize]);

  return (
    <div>
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
                      onChange={(e) => {
                        onFilterChange(idx, e.target.value);
                        setCurrentPage(1);
                      }}
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
              currentItems.map((item, idx) => {
                const rowNo = startIndex + idx + 1;
                return (
                  <tr key={item.id || idx}>
                    <td className="text-center position-sticky sticky-col-no bg-sticky col-separator">
                      {rowNo}
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
                );
              })
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

      {/* Pagination Footer */}
      {!loading && totalItems > 0 && (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3 px-1">
          <div className="text-muted small">
            Menampilkan <strong>{totalItems === 0 ? 0 : startIndex + 1}</strong> - <strong>{Math.min(startIndex + pageSize, totalItems)}</strong> dari <strong>{totalItems}</strong> data anggota
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form.Select
              size="sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: "115px" }}
              className="rounded-3 shadow-none border-secondary border-opacity-25"
            >
              <option value={10}>10 baris</option>
              <option value={15}>15 baris</option>
              <option value={25}>25 baris</option>
              <option value={50}>50 baris</option>
              <option value={100}>100 baris</option>
            </Form.Select>
            <Pagination className="mb-0" size="sm">
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <Pagination.Ellipsis key={pageNum} disabled />;
                }
                return null;
              })}
              <Pagination.Next
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpananListReportTable;
