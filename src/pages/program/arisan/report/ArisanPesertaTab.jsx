import React, { useState } from "react";
import { Table, Spinner } from "react-bootstrap";

export const ArisanPesertaTab = ({
  loading,
  listData = [],
  listTotals = {},
  currentYear,
  formatRupiah,
}) => {
  const [filter, setFilter] = useState({
    nama: "",
    batch: "",
    jenis: "",
    term: "",
    total: "",
    sisa: "",
    status: "",
  });

  const handleFilterChange = (e, field) => {
    setFilter({ ...filter, [field]: e.target.value });
  };

  const filteredData = listData.filter((item) => {
    const mNama =
      !filter.nama ||
      (item.nama && item.nama.toLowerCase().includes(filter.nama.toLowerCase()));
    const mBatch =
      !filter.batch ||
      (item.batch &&
        item.batch.toLowerCase().includes(filter.batch.toLowerCase()));
    const mJenis =
      !filter.jenis ||
      (item.jenis &&
        item.jenis.toLowerCase().includes(filter.jenis.toLowerCase()));
    const mTerm =
      !filter.term ||
      (item.term &&
        item.term.toString().toLowerCase().includes(filter.term.toLowerCase()));
    const mTotal =
      !filter.total ||
      (item.total_pembayaran &&
        item.total_pembayaran.toString().includes(filter.total));
    const mSisa =
      !filter.sisa ||
      (item.sisa_cicilan &&
        item.sisa_cicilan.toString().includes(filter.sisa));
    const mStatus =
      !filter.status ||
      (item.status_cicilan &&
        item.status_cicilan
          .toLowerCase()
          .includes(filter.status.toLowerCase()));

    return mNama && mBatch && mJenis && mTerm && mTotal && mSisa && mStatus;
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
                Nama
              </th>
              <th rowSpan="2" className="align-middle font-medium text-muted small border-bottom">
                Batch
              </th>
              <th rowSpan="2" className="align-middle font-medium text-muted small border-bottom">
                Jenis
              </th>
              <th rowSpan="2" className="align-middle font-medium text-muted small border-bottom">
                Term
              </th>
              <th
                rowSpan="2"
                className="align-middle font-medium text-muted small text-end border-bottom"
                style={{
                  position: "sticky",
                  left: "250px",
                  zIndex: 3,
                  backgroundColor: "#f8f9fa",
                }}
              >
                Total Pembayaran
              </th>
              <th rowSpan="2" className="align-middle font-medium text-muted small text-end border-bottom">
                Sisa Cicilan
              </th>
              <th
                rowSpan="2"
                className="align-middle font-medium text-muted small text-center border-bottom border-end"
              >
                Status
              </th>
              <th colSpan="3" className="font-medium text-muted small border-bottom">
                Riwayat Pembayaran
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
                  placeholder="Cari..."
                  value={filter.nama}
                  onChange={(e) => handleFilterChange(e, "nama")}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.batch}
                  onChange={(e) => handleFilterChange(e, "batch")}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.jenis}
                  onChange={(e) => handleFilterChange(e, "jenis")}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.term}
                  onChange={(e) => handleFilterChange(e, "term")}
                />
              </th>
              <th
                style={{
                  position: "sticky",
                  left: "250px",
                  zIndex: 3,
                  backgroundColor: "#f8f9fa",
                }}
              >
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.total}
                  onChange={(e) => handleFilterChange(e, "total")}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.sisa}
                  onChange={(e) => handleFilterChange(e, "sisa")}
                />
              </th>
              <th className="border-end">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cari..."
                  value={filter.status}
                  onChange={(e) => handleFilterChange(e, "status")}
                />
              </th>
              <th colSpan="3" style={{ backgroundColor: "#f8f9fa" }} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2 text-muted fw-medium small">
                    Memuat data laporan...
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center bg-light py-5">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <h6 className="fw-bold text-dark mb-1">Belum ada data laporan</h6>
                    <p className="small text-muted mb-0">
                      Data laporan arisan akan muncul di sini
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
                    {item.nama}
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border rounded-pill fw-medium">
                      {item.batch}
                    </span>
                  </td>
                  <td className="text-muted fw-medium">{item.jenis}</td>
                  <td className="text-muted small">{item.term} Bln</td>
                  <td
                    className="text-end fw-bold text-success shadow-sm"
                    style={{
                      position: "sticky",
                      left: "250px",
                      zIndex: 1,
                      backgroundColor: "#fff",
                      borderRight: "1px solid #e2e8f0",
                    }}
                  >
                    {formatRupiah(item.total_pembayaran)}
                  </td>
                  <td className="text-end text-danger fw-bold">
                    {formatRupiah(item.sisa_cicilan)}
                  </td>
                  <td
                    className="text-center border-end"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <span
                      className={`badge rounded-pill fw-normal letter-spacing-1 small ${
                        item.status_cicilan === "COMPLETED"
                          ? "bg-success"
                          : "bg-primary"
                      }`}
                    >
                      {item.status_cicilan}
                    </span>
                  </td>
                  <td className="text-end fw-medium text-dark">
                    {formatRupiah(item.pembayaran_ini)}
                  </td>
                  <td className="text-end text-muted">
                    {formatRupiah(item.pembayaran_lalu)}
                  </td>
                  <td className="text-end text-muted">
                    {formatRupiah(item.pembayaran_lalu2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot className="fw-bold" style={{ backgroundColor: "#f1f5f9" }}>
              <tr>
                <td
                  colSpan="5"
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
                <td
                  className="text-end text-success fs-6 shadow-sm"
                  style={{
                    position: "sticky",
                    left: "250px",
                    zIndex: 1,
                    backgroundColor: "#f1f5f9",
                    borderRight: "1px solid #e2e8f0",
                  }}
                >
                  {formatRupiah(listTotals.total_pembayaran || 0)}
                </td>
                <td className="text-end text-danger fs-6">
                  {formatRupiah(listTotals.sisa_cicilan || 0)}
                </td>
                <td className="border-end" />
                <td className="text-end text-dark">
                  {formatRupiah(listTotals.pembayaran_ini || 0)}
                </td>
                <td className="text-end text-muted">
                  {formatRupiah(listTotals.pembayaran_lalu || 0)}
                </td>
                <td className="text-end text-muted">
                  {formatRupiah(listTotals.pembayaran_lalu2 || 0)}
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
};

export default ArisanPesertaTab;
