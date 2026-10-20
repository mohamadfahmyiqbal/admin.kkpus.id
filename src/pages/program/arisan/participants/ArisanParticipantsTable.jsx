import React from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import { Info, Receipt } from "phosphor-react";

const ArisanParticipantsTable = ({
  loading,
  filtered = [],
  filter,
  onFilterChange,
  formatCurrency,
  onOpenApproval,
  onOpenInstallments,
}) => {
  return (
    <div className="table-responsive">
      <Table
        hover
        responsive
        borderless
        className="align-middle mb-0 custom-table-admin"
        style={{ minWidth: "800px", whiteSpace: "nowrap" }}
      >
        <thead className="table-light">
          <tr>
            <th
              className="px-4 py-3 font-medium text-muted small text-center"
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                backgroundColor: "#f8f9fa",
                borderRight: "1px solid #e2e8f0",
                width: "100px",
              }}
            >
              Aksi
            </th>
            <th className="px-4 py-3 font-medium text-muted small">Arisan</th>
            <th className="px-4 py-3 font-medium text-muted small">Anggota</th>
            <th className="px-4 py-3 font-medium text-muted small">
              Nama Anggota 2
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-end">
              Saldo
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-end">
              Piutang Cicilan
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-end">
              Target
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-center">
              Status
            </th>
          </tr>
          <tr className="bg-light border-bottom">
            <th
              className="px-2 py-2"
              style={{
                position: "sticky",
                left: 0,
                zIndex: 2,
                backgroundColor: "#f8f9fa",
                borderRight: "1px solid #e2e8f0",
              }}
            />
            <th className="px-2 py-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Cari..."
                value={filter.arisan}
                onChange={(e) => onFilterChange("arisan", e.target.value)}
              />
            </th>
            <th className="px-2 py-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Cari..."
                value={filter.anggota}
                onChange={(e) => onFilterChange("anggota", e.target.value)}
              />
            </th>
            <th className="px-2 py-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Cari..."
                value={filter.anggota2}
                onChange={(e) => onFilterChange("anggota2", e.target.value)}
              />
            </th>
            <th className="px-2 py-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Cari..."
                value={filter.saldo}
                onChange={(e) => onFilterChange("saldo", e.target.value)}
              />
            </th>
            <th className="px-2 py-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Cari..."
                value={filter.piutang}
                onChange={(e) => onFilterChange("piutang", e.target.value)}
              />
            </th>
            <th className="px-2 py-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Cari..."
                value={filter.target}
                onChange={(e) => onFilterChange("target", e.target.value)}
              />
            </th>
            <th className="px-2 py-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Cari..."
                value={filter.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-5 text-muted">
                Data tidak ditemukan atau belum ada peserta.
              </td>
            </tr>
          ) : (
            filtered.map((item) => {
              const saldoVal =
                item.paid_installment_amount || item.paid_amount || 0;
              const piutangVal = item.unpaid_amount || 0;
              const targetVal =
                item.amount_requested || item.item_price || 0;

              return (
                <tr
                  key={item.id || item.financing_id}
                  className="border-bottom"
                  style={{ borderColor: "#f8fafc" }}
                >
                  <td
                    className="px-3 py-3 text-center"
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: "#fff",
                      borderRight: "1px solid #e2e8f0",
                    }}
                  >
                    <div className="d-flex justify-content-center gap-1">
                      <Button
                        variant="light"
                        size="sm"
                        className="btn-icon text-info rounded-circle border shadow-sm p-1"
                        title="Informasi Pendaftaran"
                        onClick={() => onOpenApproval(item)}
                      >
                        <Info size={18} />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        className="btn-icon text-success rounded-circle border shadow-sm p-1"
                        title="Daftar Setoran"
                        onClick={() => onOpenInstallments(item)}
                      >
                        <Receipt size={18} />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 fw-bold text-dark">
                    {item.purpose || item.category || "-"}
                  </td>
                  <td className="px-4 py-3 text-dark">
                    {item.member_name || "-"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {item.nama_peserta_2 || "-"}
                  </td>
                  <td className="px-4 py-3 text-end fw-bold text-success">
                    {formatCurrency(saldoVal)}
                  </td>
                  <td className="px-4 py-3 text-end fw-bold text-danger">
                    {formatCurrency(piutangVal)}
                  </td>
                  <td className="px-4 py-3 text-end fw-medium">
                    {formatCurrency(targetVal)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      bg={
                        item.status === "APPROVED"
                          ? "success"
                          : item.status === "REJECTED"
                          ? "danger"
                          : item.status === "PAID"
                          ? "info"
                          : "warning"
                      }
                      className="px-3 py-2 rounded-pill fw-normal letter-spacing-1 small"
                    >
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ArisanParticipantsTable;
