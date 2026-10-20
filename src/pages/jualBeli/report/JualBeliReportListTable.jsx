import React from "react";
import { Table, Spinner } from "react-bootstrap";

const JualBeliReportListTable = ({
  listData = [],
  listTotals,
  loading,
  formatRupiah,
  currentYear,
}) => {
  return (
    <div className="table-responsive border rounded-3">
      <Table
        className="table compact-table table-striped table-hover table-bordered align-middle mb-0 text-nowrap custom-table-admin"
        style={{ minWidth: "1500px" }}
      >
        <thead
          className="table-light text-center sticky-top"
          style={{ zIndex: 2 }}
        >
          <tr>
            <th
              rowSpan="2"
              className="align-middle position-sticky start-0 bg-light"
              style={{
                zIndex: 3,
                borderRight: "1px solid #dee2e6",
              }}
            >
              No
            </th>
            <th
              rowSpan="2"
              className="align-middle text-start position-sticky bg-light"
              style={{
                left: "45px",
                zIndex: 3,
                borderRight: "2px solid #dee2e6",
              }}
            >
              Nama
            </th>
            <th colSpan="5" style={{ borderRight: "2px solid #dee2e6" }}>
              Pembiayaan Tahun Ini
            </th>
            <th colSpan="5" style={{ borderRight: "2px solid #dee2e6" }}>
              Pembiayaan {currentYear - 1}
            </th>
            <th colSpan="5">Pembiayaan {currentYear - 2}</th>
          </tr>
          <tr>
            <th className="text-end">Total</th>
            <th className="text-end">Pokok</th>
            <th className="text-end">DP</th>
            <th className="text-end">Margin</th>
            <th className="text-end" style={{ borderRight: "2px solid #dee2e6" }}>
              Cicilan
            </th>
            <th className="text-end">Total</th>
            <th className="text-end">Pokok</th>
            <th className="text-end">DP</th>
            <th className="text-end">Margin</th>
            <th className="text-end" style={{ borderRight: "2px solid #dee2e6" }}>
              Cicilan
            </th>
            <th className="text-end">Total</th>
            <th className="text-end">Pokok</th>
            <th className="text-end">DP</th>
            <th className="text-end">Margin</th>
            <th className="text-end">Cicilan</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="17" className="text-center py-4">
                <Spinner animation="border" variant="primary" size="sm" />
                <div className="mt-2 text-muted">Memuat data...</div>
              </td>
            </tr>
          ) : listData.length === 0 ? (
            <tr>
              <td colSpan="17" className="text-center text-muted py-4">
                Belum ada data laporan
              </td>
            </tr>
          ) : (
            listData.map((item, idx) => (
              <tr key={item.id || idx}>
                <td
                  className="text-center position-sticky start-0 bg-white"
                  style={{ borderRight: "1px solid #dee2e6" }}
                >
                  {idx + 1}
                </td>
                <td
                  className="fw-medium position-sticky bg-white"
                  style={{
                    left: "45px",
                    borderRight: "2px solid #dee2e6",
                  }}
                >
                  {item.nama}
                </td>
                <td className="text-end text-primary fw-medium bg-light">
                  {formatRupiah(item.tahun_ini?.total)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_ini?.pokok)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_ini?.dp)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_ini?.margin)}
                </td>
                <td
                  className="text-end"
                  style={{ borderRight: "2px solid #dee2e6" }}
                >
                  {formatRupiah(item.tahun_ini?.cicilan)}
                </td>
                <td className="text-end text-primary fw-medium bg-light">
                  {formatRupiah(item.tahun_lalu?.total)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_lalu?.pokok)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_lalu?.dp)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_lalu?.margin)}
                </td>
                <td
                  className="text-end"
                  style={{ borderRight: "2px solid #dee2e6" }}
                >
                  {formatRupiah(item.tahun_lalu?.cicilan)}
                </td>
                <td className="text-end text-primary fw-medium bg-light">
                  {formatRupiah(item.tahun_lalu2?.total)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_lalu2?.pokok)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_lalu2?.dp)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_lalu2?.margin)}
                </td>
                <td className="text-end">
                  {formatRupiah(item.tahun_lalu2?.cicilan)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {listData.length > 0 && listTotals && (
          <tfoot
            className="table-light fw-bold position-sticky bottom-0"
            style={{ zIndex: 2 }}
          >
            <tr>
              <td
                colSpan="2"
                className="text-center position-sticky start-0 bg-light"
                style={{ borderRight: "2px solid #dee2e6" }}
              >
                Total Keseluruhan
              </td>
              <td className="text-end text-primary">
                {formatRupiah(listTotals.tahun_ini.total)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_ini.pokok)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_ini.dp)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_ini.margin)}
              </td>
              <td
                className="text-end"
                style={{ borderRight: "2px solid #dee2e6" }}
              >
                {formatRupiah(listTotals.tahun_ini.cicilan)}
              </td>
              <td className="text-end text-primary">
                {formatRupiah(listTotals.tahun_lalu.total)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_lalu.pokok)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_lalu.dp)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_lalu.margin)}
              </td>
              <td
                className="text-end"
                style={{ borderRight: "2px solid #dee2e6" }}
              >
                {formatRupiah(listTotals.tahun_lalu.cicilan)}
              </td>
              <td className="text-end text-primary">
                {formatRupiah(listTotals.tahun_lalu2.total)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_lalu2.pokok)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_lalu2.dp)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_lalu2.margin)}
              </td>
              <td className="text-end">
                {formatRupiah(listTotals.tahun_lalu2.cicilan)}
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
};

export default JualBeliReportListTable;
