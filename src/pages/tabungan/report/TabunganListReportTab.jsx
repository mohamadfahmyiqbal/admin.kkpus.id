import React from "react";
import { Table, Spinner } from "react-bootstrap";

const TabunganListReportTab = ({
  filteredData = [],
  reportData = [],
  summaryData = {},
  loading,
  searchFilters = [],
  handleSearchChange,
  formatRupiah,
}) => {
  const currentYear = new Date().getFullYear();
  const searchPlaceholders = [
    "",
    "Cari No Transaksi",
    "Cari Bulan Pencairan",
    "Cari Nama",
    "Cari Termin",
    "Cari Value/Bulan",
    "Cari Value Akhir",
    `Cari ${currentYear}`,
    `Cari ${currentYear - 1}`,
    `Cari ${currentYear - 2}`,
    "Cari Sisa Termin",
    `Cari ${currentYear}`,
    `Cari ${currentYear - 1}`,
    `Cari ${currentYear - 2}`,
    "Cari Sisa Pembayaran",
    "Cari Piutang",
  ];

  return (
    <div className="p-2 p-md-3">
      <div className="table-responsive border rounded-3">
        <Table
          striped
          hover
          bordered
          className="align-middle mb-0 text-nowrap compact-table"
          style={{ minWidth: "1600px" }}
        >
          <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
            <tr className="table-light text-center">
              <th
                rowSpan="2"
                className="align-middle position-sticky sticky-col-no thead-sticky"
                style={{ borderRight: "1px solid #e2e8f0", width: "50px" }}
              >
                No
              </th>
              <th rowSpan="2" className="align-middle text-start">
                No Transaksi
              </th>
              <th rowSpan="2" className="align-middle text-start">
                Bulan Pencairan
              </th>
              <th
                rowSpan="2"
                className="align-middle text-start position-sticky sticky-col-nama thead-sticky sticky-border"
                style={{ minWidth: "200px" }}
              >
                Nama Anggota
              </th>
              <th rowSpan="2" className="align-middle text-center">
                Termin
              </th>
              <th rowSpan="2" className="align-middle text-end">
                Value Per Bulan
              </th>
              <th colSpan="1" className="align-middle text-center">
                Komitmen
              </th>
              <th colSpan="4" className="align-middle text-center">
                Balance Termin
              </th>
              <th colSpan="5" className="align-middle text-center">
                Aktual Pembayaran
              </th>
            </tr>
            <tr className="table-light">
              <th className="align-middle text-end">Value Akhir</th>
              <th className="align-middle text-center">{currentYear}</th>
              <th className="align-middle text-center">{currentYear - 1}</th>
              <th className="align-middle text-center">{currentYear - 2}</th>
              <th className="align-middle text-center">Sisa</th>
              <th className="align-middle text-end">{currentYear}</th>
              <th className="align-middle text-end">{currentYear - 1}</th>
              <th className="align-middle text-end">{currentYear - 2}</th>
              <th className="align-middle text-end">Sisa Pembayaran</th>
              <th className="align-middle text-end">Piutang</th>
            </tr>
            <tr className="bg-light">
              {searchPlaceholders.map((ph, idx) => (
                <th
                  key={idx}
                  className="p-1"
                  style={{
                    fontWeight: "normal",
                    borderRight: idx === 3 ? "2px solid #e2e8f0" : undefined,
                  }}
                >
                  {ph && (
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder={ph}
                      value={searchFilters[idx] || ""}
                      onChange={(e) => handleSearchChange(idx, e.target.value)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={16} className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <div className="mt-1 text-muted">Memuat data...</div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={16} className="text-center text-muted py-4">
                  {searchFilters.some((f) => f && f.trim() !== "")
                    ? "Data tidak ditemukan dengan filter yang diberikan"
                    : "Belum ada data laporan tabungan"}
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="text-center position-sticky sticky-col-no bg-sticky col-separator">
                    {item.no}
                  </td>
                  <td className="text-muted">{item.no_transaksi || "-"}</td>
                  <td className="text-muted">{item.bulan_pencairan || "-"}</td>
                  <td className="fw-medium position-sticky sticky-col-nama bg-sticky sticky-border">
                    {item.nama}
                  </td>
                  <td className="text-center">{item.termin || "0"} Bln</td>
                  <td className="text-end">{formatRupiah(item.value_per_bulan)}</td>
                  <td className="text-end fw-medium text-dark">
                    {formatRupiah(item.target)}
                  </td>
                  <td className="text-center text-muted">{item.term_now || "0"}</td>
                  <td className="text-center text-muted">{item.term_1 || "0"}</td>
                  <td className="text-center text-muted">{item.term_2 || "0"}</td>
                  <td className="text-center fw-medium text-primary">
                    {item.term_sisa || "0"}
                  </td>
                  <td className="text-end text-success">
                    {formatRupiah(item.aktual_now)}
                  </td>
                  <td className="text-end text-success">
                    {formatRupiah(item.aktual_1)}
                  </td>
                  <td className="text-end text-success">
                    {formatRupiah(item.aktual_2)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(item.kekurangan)}
                  </td>
                  <td className="text-end fw-medium text-danger">
                    {formatRupiah(item.piutang)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {reportData.length > 0 && (
            <tfoot
              className="table-light fw-bold"
              style={{ position: "sticky", bottom: 0, zIndex: 2 }}
            >
              <tr>
                <td
                  colSpan="5"
                  className="text-center position-sticky sticky-col-no thead-sticky sticky-border"
                >
                  Total Keseluruhan
                </td>
                <td className="text-end">
                  {formatRupiah(summaryData.total_value_per_bulan || 0)}
                </td>
                <td className="text-end">
                  {formatRupiah(summaryData.total_target || 0)}
                </td>
                <td className="text-center">{summaryData.total_term_now || 0}</td>
                <td className="text-center">{summaryData.total_term_1 || 0}</td>
                <td className="text-center">{summaryData.total_term_2 || 0}</td>
                <td className="text-center">{summaryData.total_term_sisa || 0}</td>
                <td className="text-end text-success">
                  {formatRupiah(summaryData.total_aktual_now || 0)}
                </td>
                <td className="text-end text-success">
                  {formatRupiah(summaryData.total_aktual_1 || 0)}
                </td>
                <td className="text-end text-success">
                  {formatRupiah(summaryData.total_aktual_2 || 0)}
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(summaryData.total_kekurangan || 0)}
                </td>
                <td className="text-end text-danger">
                  {formatRupiah(summaryData.total_piutang || 0)}
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
};

export default TabunganListReportTab;
