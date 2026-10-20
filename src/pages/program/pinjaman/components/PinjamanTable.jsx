import React from "react";
import { Table, Button, Form, Badge, Spinner } from "react-bootstrap";
import { Receipt, Eye, User } from "phosphor-react";
import { renderApprovalBadge } from "./PinjamanApprovalBadge";

const PinjamanTable = ({
  loading,
  filteredTransactions = [],
  filters,
  setFilters,
  formatCurrency,
  onViewInvoice,
  onViewTransaksi,
}) => {
  return (
    <div className="table-responsive">
      <Table
        hover
        responsive
        borderless
        className="align-middle mb-0 custom-table-admin"
      >
        <thead className="table-light">
          <tr>
            <th className="px-4 py-3 font-medium text-muted small text-center">
              Aksi
            </th>
            <th className="px-4 py-3 font-medium text-muted small">
              Anggota
            </th>
            <th className="px-4 py-3 font-medium text-muted small">
              Jenis Pinjaman
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-end">
              Jumlah Pinjaman
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-center">
              Tenor
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-end">
              Cicilan
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-end">
              Piutang
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-center">
              Status Cicilan
            </th>
            <th className="px-4 py-3 font-medium text-muted small text-center">
              Status Approval
            </th>
          </tr>
          {/* Search / Filter Row */}
          <tr>
            <th className="px-2 py-2 bg-light border-bottom border-top" />
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Control
                size="sm"
                placeholder="Cari Anggota..."
                value={filters.anggota}
                onChange={(e) =>
                  setFilters({ ...filters, anggota: e.target.value })
                }
              />
            </th>
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Control
                size="sm"
                placeholder="Cari Jenis..."
                value={filters.jenis_pinjaman}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    jenis_pinjaman: e.target.value,
                  })
                }
              />
            </th>
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Control
                size="sm"
                placeholder="Cari Jumlah..."
                value={filters.jumlah_pinjaman}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    jumlah_pinjaman: e.target.value,
                  })
                }
              />
            </th>
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Control
                size="sm"
                placeholder="Cari Tenor..."
                value={filters.tenor}
                onChange={(e) =>
                  setFilters({ ...filters, tenor: e.target.value })
                }
              />
            </th>
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Control
                size="sm"
                placeholder="Cari Cicilan..."
                value={filters.cicilan}
                onChange={(e) =>
                  setFilters({ ...filters, cicilan: e.target.value })
                }
              />
            </th>
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Control
                size="sm"
                placeholder="Cari Piutang..."
                value={filters.piutang}
                onChange={(e) =>
                  setFilters({ ...filters, piutang: e.target.value })
                }
              />
            </th>
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Select
                size="sm"
                value={filters.status_cicilan}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status_cicilan: e.target.value,
                  })
                }
              >
                <option value="">Semua</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
              </Form.Select>
            </th>
            <th className="px-2 py-2 bg-light border-bottom border-top">
              <Form.Select
                size="sm"
                value={filters.status_approval}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status_approval: e.target.value,
                  })
                }
              >
                <option value="">Semua</option>
                <option value="waiting">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="active">Berjalan</option>
                <option value="completed">Selesai</option>
                <option value="rejected">Ditolak</option>
              </Form.Select>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
          ) : filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-5 text-muted">
                Data belum tersedia
              </td>
            </tr>
          ) : (
            filteredTransactions.map((tx) => {
              const totalRequired =
                Number(tx.amount_requested || 0) +
                Number(tx.margin_amount || 0) -
                Number(tx.down_payment || 0);
              const remainingDebt = Math.max(
                0,
                totalRequired - Number(tx.paid_amount || 0)
              );
              const isPaid =
                Number(tx.paid_amount || 0) >= totalRequired &&
                totalRequired > 0;

              return (
                <tr key={tx.id || tx.financing_id}>
                  <td className="px-4 py-3 text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        className="text-primary p-2 rounded-circle border shadow-sm"
                        title="View Invoice"
                        onClick={() => onViewInvoice(tx)}
                      >
                        <Receipt size={16} />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        className="text-info p-2 rounded-circle border shadow-sm"
                        title="View Transaksi"
                        onClick={() => onViewTransaksi(tx)}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-light rounded-circle p-2 text-secondary">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="fw-medium text-dark">
                          {tx.member_name || "Anggota"}
                        </div>
                        <small className="text-muted d-block">
                          {tx.financing_id}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {tx.category || tx.purpose || "Pinjaman Lunak"}
                  </td>
                  <td className="px-4 py-3 text-end fw-medium">
                    {formatCurrency(tx.amount_requested)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {tx.cooperation_months ||
                      tx.tenure ||
                      tx.tenor_months ||
                      "-"}{" "}
                    Bln
                  </td>
                  <td className="px-4 py-3 text-end">
                    {formatCurrency(
                      tx.monthly_installment || tx.installment_amount
                    )}
                  </td>
                  <td className="px-4 py-3 text-end text-danger fw-medium">
                    {formatCurrency(remainingDebt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isPaid ? (
                      <Badge bg="success">Lunas</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">
                        Belum Lunas
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {renderApprovalBadge(tx.status)}
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

export default PinjamanTable;
