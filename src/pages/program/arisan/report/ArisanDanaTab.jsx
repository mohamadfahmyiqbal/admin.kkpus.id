import React, { useState } from "react";
import { Table, Spinner } from "react-bootstrap";

export const ArisanDanaTab = ({
  loading,
  danaList = [],
  danaTotals = {},
  currentYear,
  formatRupiah,
}) => {
  const [filter, setFilter] = useState({ batch: "", komitmen: "", sisa: "" });

  const handleFilterChange = (e, field) => {
    setFilter({ ...filter, [field]: e.target.value });
  };

  const filteredData = danaList.filter((item) => {
    const mBatch =
      !filter.batch ||
      (item.batch &&
        item.batch.toLowerCase().includes(filter.batch.toLowerCase()));
    const mKomitmen =
      !filter.komitmen ||
      (item.total_komitmen &&
        item.total_komitmen.toString().includes(filter.komitmen));
    const mSisa =
      !filter.sisa ||
      (item.sisa_komitmen &&
        item.sisa_komitmen.toString().includes(filter.sisa));
    return mBatch && mKomitmen && mSisa;
  });

  return (
    <div className="p-3 p-md-4">
      <div className="table-responsive border-0 shadow-sm rounded-4">
        <Table
          hover
          borderless
          className="align-middle mb-0 text-nowrap custom-table-admin compact-table"
        >
          <thead className="table-light text-center sticky-top" style={{ zIndex: 2 }}>
            <tr>
              <th
                rowSpan="2"
                className="align-middle font-medium text-muted small text-center border-bottom border-end"
                style={{ width: "60px" }}
              >
                No
              </th>
              <th
                rowSpan="2"
                className="align-middle font-medium text-muted small text-start border-bottom border-end"
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  backgroundColor: "#f8f9fa",
                  minWidth: "250px",
                  width: "250px",
                  maxWidth: "250px",
                }}
              >
                Batch
              </th>
              <th rowSpan="2" className="align-middle font-medium text-muted small text-end border-bottom">
                Total Komitmen
              </th>
              <th
                rowSpan="2"
                className="align-middle font-medium text-muted small text-end border-bottom border-end"
              >
                Sisa Komitmen
              </th>
              <th colSpan="3" className="font-medium text-muted small border-bottom">
                Penggunaan Dana
              </th>
            </tr>
            <tr>
              <th className="text-end font-medium text-muted small border-bottom">
                {currentYear}
              </th>
              <th className="text-end font-medium text-muted small border-bottom">
                {currentYear - 1}
              </th>
              <th className="text-end font-medium text-muted small border-bottom">
                {currentYear - 2}
              </th>
            </tr>
            <tr className="bg-light border-bottom">
              <th className="border-end" style={{ backgroundColor: "#f8f9fa" }} />
              <th
                className="border-end"
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  backgroundColor: "#f8f9fa",
                }}
              >
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari Batch..."
                  value={filter.batch}
                  onChange={(e) => handleFilterChange(e, "batch")}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.komitmen}
                  onChange={(e) => handleFilterChange(e, "komitmen")}
                />
              </th>
              <th className="border-end">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.sisa}
                  onChange={(e) => handleFilterChange(e, "sisa")}
                />
              </th>
              <th colSpan="3" style={{ backgroundColor: "#f8f9fa" }} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2 text-muted fw-medium small">
                    Memuat data laporan...
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center bg-light py-5">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <h6 className="fw-bold text-dark mb-1">Belum ada data laporan</h6>
                    <p className="small text-muted mb-0">
                      Data penggunaan dana arisan akan muncul di sini
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="align-middle border-bottom"
                  style={{ borderColor: "#f8fafc" }}
                >
                  <td
                    className="text-center text-muted border-end"
                    style={{ backgroundColor: "#fff" }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className="fw-bold text-dark border-end text-truncate"
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: "#fff",
                      maxWidth: "250px",
                    }}
                  >
                    {item.batch}
                  </td>
                  <td className="text-end fw-bold text-success">
                    {formatRupiah(item.total_komitmen)}
                  </td>
                  <td className="text-end text-danger fw-bold border-end">
                    {formatRupiah(item.sisa_komitmen)}
                  </td>
                  <td className="text-end fw-medium text-dark">
                    {formatRupiah(item.penggunaan_ini)}
                  </td>
                  <td className="text-end text-muted">
                    {formatRupiah(item.penggunaan_lalu)}
                  </td>
                  <td className="text-end text-muted">
                    {formatRupiah(item.penggunaan_lalu2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot className="fw-bold" style={{ backgroundColor: "#f1f5f9" }}>
              <tr>
                <td
                  colSpan="2"
                  className="text-end text-uppercase small text-muted letter-spacing-1 border-end"
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: "#f1f5f9",
                    width: "100%",
                  }}
                >
                  Total Keseluruhan
                </td>
                <td className="text-end text-success fs-6">
                  {formatRupiah(danaTotals.total_komitmen || 0)}
                </td>
                <td className="text-end text-danger fs-6 border-end">
                  {formatRupiah(danaTotals.sisa_komitmen || 0)}
                </td>
                <td className="text-end text-dark">
                  {formatRupiah(danaTotals.penggunaan_ini || 0)}
                </td>
                <td className="text-end text-muted">
                  {formatRupiah(danaTotals.penggunaan_lalu || 0)}
                </td>
                <td className="text-end text-muted">
                  {formatRupiah(danaTotals.penggunaan_lalu2 || 0)}
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
};

export default ArisanDanaTab;
