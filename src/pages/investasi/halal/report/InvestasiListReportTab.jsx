import React from "react";
import { Form } from "react-bootstrap";
import { FunnelSimple, MagnifyingGlass, SmileyMeh } from "phosphor-react";
import InvestasiStatusBadge from "./InvestasiStatusBadge";

const InvestasiListReportTab = ({
  filteredData,
  reportData,
  loading,
  searchFilters,
  handleSearchChange,
  formatRupiah,
}) => (
  <div className="tabungan-list-wrapper mt-3 animate-fade-in">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
        <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
          <FunnelSimple size={18} />
        </div>
        Filter Data Laporan
      </h6>
      <div className="text-muted small">
        Menampilkan{" "}
        <span className="fw-bold text-primary">{filteredData.length}</span> dari{" "}
        {reportData.length} data
      </div>
    </div>

    <div
      className="table-responsive rounded-4 border shadow-sm"
      style={{ maxHeight: "65vh", backgroundColor: "#fff" }}
    >
      <table className="table table-hover align-middle mb-0 compact-table">
        <thead className="bg-light sticky-top shadow-sm" style={{ zIndex: 2 }}>
          <tr className="text-secondary text-uppercase" style={{ letterSpacing: "0.5px" }}>
            <th className="border-0">No</th>
            <th className="border-0">Nama Anggota</th>
            <th className="border-0">No Anggota</th>
            <th className="border-0">Produk Sukuk</th>
            <th className="border-0 text-center">Lembar</th>
            <th className="border-0 text-end">Investasi Pokok</th>
            <th className="border-0 text-end">Estimasi Imbal Hasil</th>
            <th className="border-0 text-end">Total Pengembalian</th>
            <th className="border-0 text-center">Status</th>
          </tr>
          <tr className="bg-white border-bottom shadow-sm">
            <th className="p-2 border-0" />
            <th className="p-2 border-0">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-light text-muted">
                  <MagnifyingGlass size={14} />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
                  className="bg-light border-light shadow-none focus-ring-primary"
                  value={searchFilters[1]}
                  onChange={(e) => handleSearchChange(1, e.target.value)}
                />
              </div>
            </th>
            <th className="p-2 border-0">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-light text-muted">
                  <MagnifyingGlass size={14} />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
                  className="bg-light border-light shadow-none focus-ring-primary"
                  value={searchFilters[2]}
                  onChange={(e) => handleSearchChange(2, e.target.value)}
                />
              </div>
            </th>
            <th className="p-2 border-0">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-light text-muted">
                  <MagnifyingGlass size={14} />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
                  className="bg-light border-light shadow-none focus-ring-primary"
                  value={searchFilters[3]}
                  onChange={(e) => handleSearchChange(3, e.target.value)}
                />
              </div>
            </th>
            <th className="p-2 border-0">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-light text-muted">
                  <MagnifyingGlass size={14} />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
                  className="bg-light border-light shadow-none focus-ring-primary"
                  value={searchFilters[4]}
                  onChange={(e) => handleSearchChange(4, e.target.value)}
                />
              </div>
            </th>
            <th className="p-2 border-0">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-light text-muted">
                  <MagnifyingGlass size={14} />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
                  className="bg-light border-light shadow-none focus-ring-primary text-end"
                  value={searchFilters[5]}
                  onChange={(e) => handleSearchChange(5, e.target.value)}
                />
              </div>
            </th>
            <th className="p-2 border-0">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-light text-muted">
                  <MagnifyingGlass size={14} />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
                  className="bg-light border-light shadow-none focus-ring-primary text-end"
                  value={searchFilters[6]}
                  onChange={(e) => handleSearchChange(6, e.target.value)}
                />
              </div>
            </th>
            <th className="p-2 border-0">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-light text-muted">
                  <MagnifyingGlass size={14} />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
                  className="bg-light border-light shadow-none focus-ring-primary text-end"
                  value={searchFilters[7]}
                  onChange={(e) => handleSearchChange(7, e.target.value)}
                />
              </div>
            </th>
            <th className="p-2 border-0">
              <Form.Select
                size="sm"
                className="bg-light border-light shadow-none focus-ring-primary"
                value={searchFilters[8]}
                onChange={(e) => handleSearchChange(8, e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="PAID">Lunas</option>
                <option value="APPROVED">Disetujui</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Ditolak</option>
              </Form.Select>
            </th>
          </tr>
        </thead>
        <tbody className="border-top-0">
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2 text-muted fw-medium">
                  Memuat data report...
                </div>
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-5">
                <div className="bg-light rounded-circle d-inline-flex p-4 mb-3 shadow-sm">
                  <SmileyMeh size={40} className="text-secondary" />
                </div>
                <h6 className="fw-bold text-dark fs-5">Data Kosong</h6>
                <p className="text-muted mb-0">
                  Belum ada transaksi investasi yang tercatat atau sesuai dengan filter.
                </p>
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-bottom"
                style={{ transition: "background-color 0.2s" }}
              >
                <td className="text-muted small">{item.no}</td>
                <td className="fw-bold text-dark">{item.member_name}</td>
                <td className="text-muted small">{item.member_no}</td>
                <td className="fw-medium text-dark">{item.issue_name}</td>
                <td className="text-center fw-medium text-secondary">
                  {item.lembar} lb
                </td>
                <td className="text-end fw-bold text-primary">
                  {formatRupiah(item.amount)}
                </td>
                <td className="text-end fw-bold text-info">
                  {formatRupiah(item.imbal_hasil)}
                </td>
                <td className="text-end fw-bold text-success">
                  {formatRupiah(item.pengembalian)}
                </td>
                <td className="text-center">
                  <InvestasiStatusBadge status={item.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot className="bg-light sticky-bottom shadow-sm" style={{ zIndex: 1 }}>
          <tr>
            <td
              colSpan="5"
              className="text-end fw-bold text-uppercase"
              style={{ letterSpacing: "1px" }}
            >
              Total (Terkumpul):
            </td>
            <td className="text-end fw-bolder text-primary fs-6">
              {formatRupiah(
                filteredData
                  .filter((i) => i.status === "APPROVED" || i.status === "PAID")
                  .reduce((acc, curr) => acc + curr.amount, 0)
              )}
            </td>
            <td className="text-end fw-bolder text-info fs-6">
              {formatRupiah(
                filteredData
                  .filter((i) => i.status === "APPROVED" || i.status === "PAID")
                  .reduce((acc, curr) => acc + curr.imbal_hasil, 0)
              )}
            </td>
            <td className="text-end fw-bolder text-success fs-6">
              {formatRupiah(
                filteredData
                  .filter((i) => i.status === "APPROVED" || i.status === "PAID")
                  .reduce((acc, curr) => acc + curr.pengembalian, 0)
              )}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

export default InvestasiListReportTab;
