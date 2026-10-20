import React from "react";
import { Table, Form, Badge, Button, Spinner } from "react-bootstrap";
import { Eye, Receipt } from "phosphor-react";
import { formatDate } from "./SetoranInvoiceModal";

const SetoranInstallmentsTable = ({
  installments = [],
  filters,
  onFilterChange,
  loading,
  formatRp,
  transaction,
  onViewInvoice,
  onVerify,
}) => {
  return (
    <div className="table-responsive mt-3 jb-table-wrapper border rounded-3">
      <Table className="custom-table-admin align-middle mb-0" borderless hover>
        <thead className="bg-light">
          <tr>
            <th className="py-3 px-3 text-muted fw-bold small">
              Periode
              <Form.Control
                size="sm"
                type="text"
                placeholder="Cari..."
                className="mt-2 text-xs"
                value={filters.periode}
                onChange={(e) => onFilterChange(e, "periode")}
              />
            </th>
            <th className="py-3 px-3 text-muted fw-bold small">
              Tanggal Setor
              <Form.Control
                size="sm"
                type="text"
                placeholder="Cari..."
                className="mt-2 text-xs"
                value={filters.tanggal}
                onChange={(e) => onFilterChange(e, "tanggal")}
              />
            </th>
            <th className="py-3 px-3 text-muted fw-bold small">
              Nama Setoran
              <Form.Control
                size="sm"
                type="text"
                placeholder="Cari..."
                className="mt-2 text-xs"
                value={filters.nama}
                onChange={(e) => onFilterChange(e, "nama")}
              />
            </th>
            <th className="py-3 px-3 text-muted fw-bold small text-end">
              <div className="text-end">Jumlah</div>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Cari..."
                className="mt-2 text-xs"
                value={filters.jumlah}
                onChange={(e) => onFilterChange(e, "jumlah")}
              />
            </th>
            <th className="py-3 px-3 text-muted fw-bold small text-center">
              <div className="text-center">Status</div>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Cari..."
                className="mt-2 text-xs"
                value={filters.status}
                onChange={(e) => onFilterChange(e, "status")}
              />
            </th>
            <th
              className="py-3 px-3 text-muted fw-bold small text-center"
              style={{ verticalAlign: "top" }}
            >
              <div className="text-center">Aksi</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <Spinner
                  animation="border"
                  variant="success"
                  size="sm"
                  className="mb-2"
                />
                <p className="text-muted small mb-0">
                  Memuat data setoran...
                </p>
              </td>
            </tr>
          ) : installments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted small">
                <div className="d-flex flex-column align-items-center">
                  <Eye size={24} className="mb-2 opacity-50" />
                  Belum ada data setoran yang cocok.
                </div>
              </td>
            </tr>
          ) : (
            installments.map((item, idx) => {
              const isPaid =
                item.status === "PAID" || item.status === "COMPLETED";
              const isPendingVerification =
                item.status === "PENDING_VERIFICATION";

              return (
                <tr key={item.id || idx} className="border-bottom">
                  <td className="py-3 px-3 small">
                    Bulan {item.installment_number || idx + 1}
                  </td>
                  <td className="py-3 px-3 small">
                    {formatDate(item.payment_date)}
                  </td>
                  <td className="py-3 px-3 small">
                    {item.description ||
                      `Setoran ${item.installment_number || idx + 1}`}
                  </td>
                  <td className="py-3 px-3 small text-end fw-bold">
                    {formatRp ? formatRp(item.amount) : item.amount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      bg={
                        isPaid
                          ? "success"
                          : isPendingVerification
                          ? "info"
                          : "warning"
                      }
                      className={`px-2 py-1 bg-opacity-10 text-${
                        isPaid
                          ? "success"
                          : isPendingVerification
                          ? "primary"
                          : "warning"
                      } border border-${
                        isPaid
                          ? "success"
                          : isPendingVerification
                          ? "primary"
                          : "warning"
                      } border-opacity-25`}
                    >
                      {isPendingVerification
                        ? "Menunggu Verifikasi"
                        : item.status || "PENDING"}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="d-flex justify-content-center gap-1">
                      {isPendingVerification && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() =>
                            onVerify({
                              id: item.transaction_id,
                              transaction_id: item.transaction_id,
                              amount: formatRp
                                ? formatRp(item.amount)
                                : item.amount,
                              proof_of_transfer: item.proof_of_transfer,
                              sender_name: item.sender_name,
                              sender_bank: item.sender_bank,
                              member:
                                transaction?.nama_nasabah ||
                                transaction?.member_name ||
                                transaction?.user_id,
                              member_id: transaction?.member_id,
                              created_at: item.payment_date,
                            })
                          }
                          className="d-inline-flex align-items-center rounded-pill px-2 py-1 text-xs fw-bold"
                        >
                          Verifikasi
                        </Button>
                      )}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onViewInvoice(item)}
                        className="d-inline-flex align-items-center rounded-pill px-3"
                      >
                        <Receipt size={16} className="me-1" /> Invoice
                      </Button>
                    </div>
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

export default SetoranInstallmentsTable;
