import React from "react";
import { Table, Spinner } from "react-bootstrap";

export const ListReportTab = ({
  loading,
  listData,
  listTotals,
  formatRupiah,
}) => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="p-3 p-md-4">
      <div className="table-responsive border rounded-3">
        <Table
          striped
          hover
          bordered
          className="align-middle mb-0 text-nowrap custom-table-admin compact-table"
        >
          <thead
            className="table-light text-center sticky-top"
            style={{ zIndex: 2 }}
          >
            <tr>
              <th
                rowSpan="2"
                className="align-middle"
                style={{ width: "5%", borderRight: "1px solid #dee2e6" }}
              >
                No
              </th>
              <th
                rowSpan="2"
                className="align-middle text-start"
                style={{ width: "20%", borderRight: "1px solid #dee2e6" }}
              >
                Nama
              </th>
              <th
                rowSpan="2"
                className="align-middle text-start"
                style={{ width: "20%", borderRight: "1px solid #dee2e6" }}
              >
                Keperluan
              </th>
              <th
                colSpan="3"
                style={{ borderRight: "1px solid #dee2e6" }}
              >
                Jumlah Pinjaman
              </th>
              <th
                rowSpan="2"
                className="align-middle text-center"
                style={{ width: "5%", borderRight: "1px solid #dee2e6" }}
              >
                Termin
              </th>
              <th
                colSpan="3"
                style={{ borderRight: "1px solid #dee2e6" }}
              >
                Pembayaran Cicilan
              </th>
              <th
                rowSpan="2"
                className="align-middle text-end"
                style={{ width: "10%", borderRight: "1px solid #dee2e6" }}
              >
                Sisa Cicilan
              </th>
              <th
                rowSpan="2"
                className="align-middle text-end"
                style={{ width: "10%", borderRight: "1px solid #dee2e6" }}
              >
                Cicilan Tak Tertagih
              </th>
              <th
                rowSpan="2"
                className="align-middle text-center"
                style={{ width: "10%", borderRight: "2px solid #dee2e6" }}
              >
                Status
              </th>
            </tr>
            <tr>
              <th className="text-end">Tahun Ini</th>
              <th className="text-end">{currentYear - 1}</th>
              <th
                className="text-end"
                style={{ borderRight: "1px solid #dee2e6" }}
              >
                {currentYear - 2}
              </th>
              <th className="text-end">Tahun Ini</th>
              <th className="text-end">{currentYear - 1}</th>
              <th
                className="text-end"
                style={{ borderRight: "1px solid #dee2e6" }}
              >
                {currentYear - 2}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2 text-muted">Memuat data...</div>
                </td>
              </tr>
            ) : !listData || listData.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center text-muted py-4">
                  Belum ada data laporan
                </td>
              </tr>
            ) : (
              listData.map((item, idx) => {
                const totalPinjaman =
                  (item.tahun_ini?.total || 0) +
                  (item.tahun_lalu?.total || 0) +
                  (item.tahun_lalu2?.total || 0);
                const totalCicilan =
                  (item.tahun_ini?.cicilan || 0) +
                  (item.tahun_lalu?.cicilan || 0) +
                  (item.tahun_lalu2?.cicilan || 0);
                const sisaCicilan = totalPinjaman - totalCicilan;

                return (
                  <tr key={idx}>
                    <td
                      className="text-center"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      className="fw-medium"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      {item.nama}
                    </td>
                    <td
                      className="text-wrap"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      {item.keperluan}
                    </td>
                    <td className="text-end">
                      {formatRupiah(item.tahun_ini?.total || 0)}
                    </td>
                    <td className="text-end">
                      {formatRupiah(item.tahun_lalu?.total || 0)}
                    </td>
                    <td
                      className="text-end"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      {formatRupiah(item.tahun_lalu2?.total || 0)}
                    </td>
                    <td
                      className="text-center"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      {item.termin ? `${item.termin} Bln` : "-"}
                    </td>
                    <td className="text-end">
                      {formatRupiah(item.tahun_ini?.cicilan || 0)}
                    </td>
                    <td className="text-end">
                      {formatRupiah(item.tahun_lalu?.cicilan || 0)}
                    </td>
                    <td
                      className="text-end"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      {formatRupiah(item.tahun_lalu2?.cicilan || 0)}
                    </td>
                    <td
                      className="text-end"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      {formatRupiah(sisaCicilan)}
                    </td>
                    <td
                      className="text-end"
                      style={{ borderRight: "1px solid #dee2e6" }}
                    >
                      Rp 0
                    </td>
                    <td
                      className="text-center"
                      style={{ borderRight: "2px solid #dee2e6" }}
                    >
                      <span
                        className={`badge ${
                          item.status === "COMPLETED"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {item.status === "COMPLETED"
                          ? "Lunas"
                          : "Belum Lunas"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {listData && listData.length > 0 && (
            <tfoot
              className="table-light fw-bold position-sticky bottom-0"
              style={{ zIndex: 2 }}
            >
              <tr>
                <td
                  colSpan="3"
                  className="text-center"
                  style={{ borderRight: "1px solid #dee2e6" }}
                >
                  Total Keseluruhan
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(listTotals?.tahun_ini?.total || 0)}
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(listTotals?.tahun_lalu?.total || 0)}
                </td>
                <td
                  className="text-end text-primary"
                  style={{ borderRight: "1px solid #dee2e6" }}
                >
                  {formatRupiah(listTotals?.tahun_lalu2?.total || 0)}
                </td>
                <td
                  className="text-center"
                  style={{ borderRight: "1px solid #dee2e6" }}
                >
                  -
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(listTotals?.tahun_ini?.cicilan || 0)}
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(listTotals?.tahun_lalu?.cicilan || 0)}
                </td>
                <td
                  className="text-end text-primary"
                  style={{ borderRight: "1px solid #dee2e6" }}
                >
                  {formatRupiah(listTotals?.tahun_lalu2?.cicilan || 0)}
                </td>
                <td
                  className="text-end text-danger"
                  style={{ borderRight: "1px solid #dee2e6" }}
                >
                  {formatRupiah(
                    (listTotals?.tahun_ini?.total || 0) +
                      (listTotals?.tahun_lalu?.total || 0) +
                      (listTotals?.tahun_lalu2?.total || 0) -
                      ((listTotals?.tahun_ini?.cicilan || 0) +
                        (listTotals?.tahun_lalu?.cicilan || 0) +
                        (listTotals?.tahun_lalu2?.cicilan || 0))
                  )}
                </td>
                <td
                  className="text-end text-danger"
                  style={{ borderRight: "1px solid #dee2e6" }}
                >
                  Rp 0
                </td>
                <td
                  className="text-center"
                  style={{ borderRight: "2px solid #dee2e6" }}
                >
                  -
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
};

export default ListReportTab;
