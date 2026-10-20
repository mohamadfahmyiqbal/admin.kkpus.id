import React, { useState } from "react";
import { Modal, Table, Button, Badge, Pagination } from "react-bootstrap";
import { Users, Info, Receipt } from "phosphor-react";
import EmptyState from "../../../components/ui/EmptyState";
import {
  MemberInfoModal,
  MemberTransactionsModal,
} from "./TabunganDetailModals";

export const ProgramDetailModal = ({
  show,
  onHide,
  selectedRow,
  formatRupiah,
}) => (
  <Modal show={show} onHide={onHide} size="md" centered>
    <Modal.Header closeButton className="border-0 pb-0">
      <Modal.Title className="fw-bold d-flex align-items-center gap-2">
        <Info size={24} className="text-info" weight="fill" />
        Informasi Program Tabungan
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="pt-3">
      {selectedRow && (
        <div className="d-flex flex-column gap-3">
          <div className="p-3 bg-light rounded-3">
            <div className="text-muted small mb-1">Nama Program</div>
            <div className="fw-bold fs-5 text-dark">{selectedRow.nama}</div>
          </div>
          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 border rounded-3 d-flex flex-column h-100">
                <span className="text-muted small mb-1">Kategori</span>
                <span className="fw-semibold text-dark">
                  {selectedRow.kategori}
                </span>
              </div>
            </div>
            <div className="col-12">
              <div className="p-3 bg-success bg-opacity-10 rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-success small d-flex align-items-center gap-1 mb-1 fw-bold">
                    Total Saldo Terkumpul
                  </span>
                  <span className="text-muted">
                    Dari {selectedRow.members?.length || 0} anggota
                  </span>
                </div>
                <span className="fw-bold text-success fs-5">
                  {formatRupiah(selectedRow.saldo)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal.Body>
    <Modal.Footer className="border-0 pt-0 mt-3">
      <Button variant="light" className="w-100" onClick={onHide}>
        Tutup
      </Button>
    </Modal.Footer>
  </Modal>
);

export const ProgramMembersModal = ({
  show,
  onHide,
  selectedRow,
  formatRupiah,
}) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const [showMemberTx, setShowMemberTx] = useState(false);

  const [filter, setFilter] = useState({
    kategori: "",
    nama: "",
    term: "",
    saldo: "",
    kekurangan: "",
    target: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const handleFilterChange = (field, val) => {
    setFilter((prev) => ({ ...prev, [field]: val }));
    setPage(1);
  };

  const filteredMembers = (selectedRow?.members || []).filter(
    (m) =>
      (m.kategori || "")
        .toLowerCase()
        .includes(filter.kategori.toLowerCase()) &&
      (m.nama || "").toLowerCase().includes(filter.nama.toLowerCase()) &&
      (m.term || "").toLowerCase().includes(filter.term.toLowerCase()) &&
      (m.saldo?.toString() || "")
        .toLowerCase()
        .includes(filter.saldo.toLowerCase()) &&
      (m.kekurangan?.toString() || "")
        .toLowerCase()
        .includes(filter.kekurangan.toLowerCase()) &&
      (m.target?.toString() || "")
        .toLowerCase()
        .includes(filter.target.toLowerCase()) &&
      (m.status || "").toLowerCase().includes(filter.status.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const pagedMembers = filteredMembers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <Users size={24} className="text-primary" weight="fill" />
            Daftar Anggota - {selectedRow?.nama}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <div className="table-responsive" style={{ minHeight: "350px" }}>
            <Table hover className="align-middle custom-table-admin">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
                    Action
                  </th>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
                    Kategori
                  </th>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
                    Nama Anggota
                  </th>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
                    Durasi
                  </th>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
                    Total Saldo
                  </th>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
                    Kekurangan
                  </th>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
                    Target Nominal
                  </th>
                  <th scope="col" className="text-secondary fw-semibold text-nowrap">
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
                      onChange={(e) =>
                        handleFilterChange("kategori", e.target.value)
                      }
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder="Cari..."
                      value={filter.nama}
                      onChange={(e) =>
                        handleFilterChange("nama", e.target.value)
                      }
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder="Cari..."
                      value={filter.term}
                      onChange={(e) =>
                        handleFilterChange("term", e.target.value)
                      }
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder="Cari..."
                      value={filter.saldo}
                      onChange={(e) =>
                        handleFilterChange("saldo", e.target.value)
                      }
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder="Cari..."
                      value={filter.kekurangan}
                      onChange={(e) =>
                        handleFilterChange("kekurangan", e.target.value)
                      }
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder="Cari..."
                      value={filter.target}
                      onChange={(e) =>
                        handleFilterChange("target", e.target.value)
                      }
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      className="form-control form-control-sm shadow-none"
                      placeholder="Cari..."
                      value={filter.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {pagedMembers.length > 0 ? (
                  pagedMembers.map((m, idx) => (
                    <tr key={m.member_saving_target_id || idx}>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedMember(m);
                              setShowMemberInfo(true);
                            }}
                            className="btn btn-sm btn-light text-info border-0 rounded-circle d-flex align-items-center justify-content-center"
                            title="Informasi Pendaftaran"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <Info size={18} weight="bold" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMember(m);
                              setShowMemberTx(true);
                            }}
                            className="btn btn-sm btn-light text-primary border-0 rounded-circle d-flex align-items-center justify-content-center"
                            title="Riwayat Transaksi"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <Receipt size={18} weight="bold" />
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="fw-medium text-dark text-nowrap">
                          {m.kategori}
                        </span>
                      </td>
                      <td>
                        <span className="fw-medium text-dark text-nowrap">
                          {m.nama}
                        </span>
                      </td>
                      <td className="text-muted text-nowrap">{m.term}</td>
                      <td className="text-success fw-semibold text-nowrap">
                        {formatRupiah(m.saldo)}
                      </td>
                      <td className="text-danger fw-semibold text-nowrap">
                        {formatRupiah(m.kekurangan)}
                      </td>
                      <td className="text-muted text-nowrap">
                        {formatRupiah(m.target)}
                      </td>
                      <td>
                        <Badge
                          bg={
                            m.status === "Aktif" || m.status === "APPROVED"
                              ? "success"
                              : m.status === "PENDING"
                              ? "warning"
                              : "secondary"
                          }
                          className="rounded-pill px-2 py-1"
                        >
                          {m.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {filteredMembers.length > 0 && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
              <span className="text-muted mb-3 mb-md-0">
                Menampilkan {(page - 1) * pageSize + 1} hingga{" "}
                {Math.min(page * pageSize, filteredMembers.length)} dari{" "}
                {filteredMembers.length} entri
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
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onHide}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <MemberInfoModal
        show={showMemberInfo}
        onHide={() => setShowMemberInfo(false)}
        member={selectedMember}
        formatRupiah={formatRupiah}
      />

      <MemberTransactionsModal
        show={showMemberTx}
        onHide={() => setShowMemberTx(false)}
        member={selectedMember}
        formatRupiah={formatRupiah}
      />
    </>
  );
};
