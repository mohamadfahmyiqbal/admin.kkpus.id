import React, { useState } from "react";
import { Table, Pagination } from "react-bootstrap";
import { Users, Info } from "phosphor-react";
import EmptyState from "../../../components/ui/EmptyState";
import {
  ProgramDetailModal,
  ProgramMembersModal,
} from "./ProgramModals";

const TabunganProgressTable = ({ currentPage, tableData = [] }) => {
  const [filter, setFilter] = useState({
    kategori: "",
    nama: "",
    saldo: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [selectedRow, setSelectedRow] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleFilterChange = (field, val) => {
    setFilter((prev) => ({ ...prev, [field]: val }));
    setPage(1);
  };

  const filtered = tableData.filter((item) => {
    const kMatch = (item.kategori || "")
      .toLowerCase()
      .includes(filter.kategori.toLowerCase());
    const nMatch = (item.nama || "")
      .toLowerCase()
      .includes(filter.nama.toLowerCase());
    const sMatch = (item.saldo?.toString() || "")
      .toLowerCase()
      .includes(filter.saldo.toLowerCase());
    const stMatch = (item.status || "")
      .toLowerCase()
      .includes(filter.status.toLowerCase());
    return kMatch && nMatch && sMatch && stMatch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="bg-white p-4 rounded shadow-sm border-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h5 className="fw-bold text-dark mb-0">
          Progress Program Tabungan {currentPage === "tabunganList" ? "(List)" : ""}
        </h5>
      </div>

      <div className="table-responsive" style={{ minHeight: "400px" }}>
        <table className="table table-hover align-middle mb-0 custom-table-admin">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-secondary fw-semibold">
                Action
              </th>
              <th scope="col" className="text-secondary fw-semibold">
                Kategori
              </th>
              <th scope="col" className="text-secondary fw-semibold">
                Nama Program
              </th>
              <th scope="col" className="text-secondary fw-semibold">
                Total Saldo
              </th>
              <th scope="col" className="text-secondary fw-semibold">
                Status
              </th>
            </tr>
            <tr>
              <th />
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm shadow-none"
                  placeholder="Cari..."
                  value={filter.kategori}
                  onChange={(e) => handleFilterChange("kategori", e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm shadow-none"
                  placeholder="Cari..."
                  value={filter.nama}
                  onChange={(e) => handleFilterChange("nama", e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm shadow-none"
                  placeholder="Cari..."
                  value={filter.saldo}
                  onChange={(e) => handleFilterChange("saldo", e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="form-control form-control-sm shadow-none"
                  placeholder="Cari..."
                  value={filter.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
              </th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {pagedData.length > 0 ? (
              pagedData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-light text-primary border-0 rounded-circle d-flex align-items-center justify-content-center"
                        title="Lihat Daftar Anggota"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => {
                          setSelectedRow(item);
                          setShowMembersModal(true);
                        }}
                      >
                        <Users size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-light text-info border-0 rounded-circle d-flex align-items-center justify-content-center"
                        title="Lihat Detail Program"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => {
                          setSelectedRow(item);
                          setShowDetailModal(true);
                        }}
                      >
                        <Info size={18} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="fw-medium text-dark">{item.kategori}</span>
                  </td>
                  <td>
                    <span className="fw-medium text-dark">{item.nama}</span>
                  </td>
                  <td>
                    <span className="fw-semibold text-success">
                      {formatCurrency(item.saldo)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === "Aktif"
                          ? "bg-success-subtle text-success"
                          : "bg-secondary-subtle text-secondary"
                      } rounded-pill px-3 py-2 fw-medium`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-0 border-0">
                  <EmptyState
                    title="Data tidak ditemukan"
                    message="Tidak ada program tabungan yang sesuai dengan filter Anda."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
          <span className="text-muted mb-3 mb-md-0">
            Menampilkan {(page - 1) * pageSize + 1} hingga{" "}
            {Math.min(page * pageSize, filtered.length)} dari {filtered.length}{" "}
            entri
          </span>
          <Pagination className="pagination-sm mb-0">
            <Pagination.First
              onClick={() => setPage(1)}
              disabled={page === 1}
            />
            <Pagination.Prev
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            />
            <Pagination.Last
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Modals */}
      <ProgramMembersModal
        show={showMembersModal}
        onHide={() => setShowMembersModal(false)}
        selectedRow={selectedRow}
        formatRupiah={formatCurrency}
      />

      <ProgramDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        selectedRow={selectedRow}
        formatRupiah={formatCurrency}
      />
    </div>
  );
};

export default TabunganProgressTable;
