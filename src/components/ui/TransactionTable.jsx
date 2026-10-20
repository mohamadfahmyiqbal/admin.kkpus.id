import React from "react";
import { Table, Badge, Pagination, Form } from "react-bootstrap";
import { Eye, CheckCircle, Package } from "phosphor-react";
import EmptyState from "./EmptyState";

export const TransactionTable = ({
  transactions = [],
  loading,
  formatRupiah,
  pagination,
  onPageChange,
  onSearchChange,
  searchFilters = {},
  onApprove,
  onView,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded p-5 text-center text-muted">
        <div className="spinner-border text-primary me-2" role="status" />
        Memuat data transaksi...
      </div>
    );
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return { day: "-", time: "-" };
    const t = new Date(dateStr);
    return {
      day: t.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: t.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <>
      <div className="table-responsive">
        <Table align="middle" className="mb-0 custom-table-admin" hover>
          <thead>
            <tr>
              <th className="py-3 px-4 text-muted small fw-bold text-uppercase text-center">
                Aksi
              </th>
              <th className="py-3 px-4 text-muted small fw-bold text-uppercase" style={{ width: "180px" }}>
                Waktu Transaksi
              </th>
              <th className="py-3 px-4 text-muted small fw-bold text-uppercase">
                Deskripsi
              </th>
              <th className="py-3 px-4 text-muted small fw-bold text-uppercase text-end">
                Amount
              </th>
              <th className="py-3 px-4 text-muted small fw-bold text-uppercase">
                Anggota
              </th>
              <th className="py-3 px-4 text-muted small fw-bold text-uppercase text-center">
                Status
              </th>
            </tr>
            <tr className="table-search-row bg-light">
              <th className="px-4" />
              <th className="px-4">
                <Form.Control
                  type="text"
                  placeholder="Cari tanggal..."
                  size="sm"
                  value={searchFilters.date || ""}
                  onChange={(e) => onSearchChange("date", e.target.value)}
                />
              </th>
              <th className="px-4">
                <Form.Select
                  size="sm"
                  value={searchFilters.type || ""}
                  onChange={(e) => onSearchChange("type", e.target.value)}
                >
                  <option value="">Semua</option>
                  <option value="Setoran">Setoran</option>
                  <option value="Penarikan">Penarikan</option>
                </Form.Select>
              </th>
              <th className="px-4" />
              <th className="px-4">
                <Form.Control
                  type="text"
                  placeholder="Cari nama..."
                  size="sm"
                  value={searchFilters.member || ""}
                  onChange={(e) => onSearchChange("member", e.target.value)}
                />
              </th>
              <th className="px-4" />
            </tr>
          </thead>
          <tbody>
            {!transactions || transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-0 border-0">
                  <EmptyState
                    icon={Package}
                    title="Belum Ada Transaksi"
                    message="Data transaksi untuk kategori ini masih kosong."
                  />
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const { day, time } = formatDateTime(tx.date || tx.created_at);
                const isDeposit = tx.type === "Setoran" || tx.type === "Deposit";
                const isCompleted =
                  tx.status === "Selesai" ||
                  tx.status === "COMPLETED" ||
                  tx.status === "APPROVED";

                return (
                  <tr key={tx.id || tx.transaction_id}>
                    <td className="py-3 px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {tx.is_manual_payment || tx.raw_status === "PENDING_VERIFICATION" || tx.status === "PENDING_VERIFICATION" ? (
                          <button
                            className="btn btn-sm btn-light text-warning border rounded-circle p-2"
                            title="Verifikasi Pembayaran Manual"
                            onClick={() => onApprove && onApprove(tx)}
                          >
                            <CheckCircle size={16} weight="bold" />
                          </button>
                        ) : (tx.type === "Pencairan" || tx.type === "Pencairan Tabungan") &&
                          !isCompleted && (
                            <button
                              className="btn btn-sm btn-light text-primary border rounded-circle p-2"
                              title="Approve Pencairan"
                              onClick={() => onApprove && onApprove(tx)}
                            >
                              <CheckCircle size={16} weight="bold" />
                            </button>
                          )}
                        <button
                          className="btn btn-sm btn-light text-secondary border rounded-circle p-2"
                          title="Lihat Detail"
                          onClick={() => onView && onView(tx)}
                        >
                          <Eye size={16} weight="bold" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="d-flex flex-column">
                        <span className="text-dark fw-bold small">{day}</span>
                        <span className="text-muted extra-small">{time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="d-flex flex-column">
                        <span className="text-dark fw-bold small">
                          {tx.product_name || tx.type || "Simpanan"}
                        </span>
                        <Badge
                          bg={isDeposit ? "success" : "danger"}
                          className="bg-opacity-10 text-capitalize fw-bold border-0 px-2 py-1 mt-1 align-self-start"
                          style={{ color: isDeposit ? "#10b981" : "#ef4444" }}
                        >
                          {tx.type}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <span className={`fw-bold small ${isDeposit ? "text-success" : "text-danger"}`}>
                        {formatRupiah(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-dark d-block small mb-0">
                          {tx.member || tx.full_name || "-"}
                        </span>
                        <span className="text-muted extra-small">
                          ID: {tx.member_id?.substring(0, 8) || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        bg={isCompleted ? "success" : "warning"}
                        className="px-3 py-1 rounded-pill"
                      >
                        {isCompleted ? "Selesai" : tx.status || "Pending"}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
          <span className="text-muted small">
            Halaman {pagination.current_page} dari {pagination.total_pages}
          </span>
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={pagination.current_page === 1}
              onClick={() => onPageChange(pagination.current_page - 1)}
            />
            {[...Array(pagination.total_pages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === pagination.current_page}
                onClick={() => onPageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={pagination.current_page === pagination.total_pages}
              onClick={() => onPageChange(pagination.current_page + 1)}
            />
          </Pagination>
        </div>
      )}
    </>
  );
};

export default TransactionTable;
