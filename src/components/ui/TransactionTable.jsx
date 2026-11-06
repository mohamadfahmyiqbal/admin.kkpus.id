import React from "react";
import {
  Table,
  Badge,
  Pagination,
  Form,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Button,
} from "react-bootstrap";
import {
  Eye,
  CheckCircle,
  Package,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowsDownUp,
  CaretUp,
  CaretDown,
  X,
} from "phosphor-react";
import EmptyState from "./EmptyState";

const getPaginationRange = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

export const TransactionTable = ({
  transactions = [],
  loading = false,
  formatRupiah,
  pagination = null,
  onPageChange,
  onSearchChange,
  searchFilters = {},
  onApprove,
  onView,
  sortConfig = { key: "", direction: "asc" },
  onSort,
  pageSize,
  onPageSizeChange,
  showSearchRow = true,
  onResetFilter,
}) => {
  const formatDateTime = (dateStr) => {
    if (!dateStr) return { day: "-", time: "-" };
    const t = new Date(dateStr);
    if (isNaN(t.getTime())) return { day: String(dateStr), time: "-" };
    return {
      day: t.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: t.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    };
  };

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowsDownUp size={12} className="text-muted ms-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <CaretUp size={12} className="text-primary ms-1" weight="bold" />
    ) : (
      <CaretDown size={12} className="text-primary ms-1" weight="bold" />
    );
  };

  const renderStatusBadge = (tx) => {
    const raw = (tx.status || tx.raw_status || "").toUpperCase();
    const isCompleted =
      raw === "SELESAI" || raw === "COMPLETED" || raw === "PAID" || raw === "APPROVED";
    const isVerification =
      raw === "PENDING_VERIFICATION" ||
      (tx.status || "").toLowerCase().includes("verifikasi") ||
      Boolean(tx.is_manual_payment);
    const isRejected = raw === "REJECTED" || raw === "DITOLAK" || raw === "FAILED";

    if (isCompleted) {
      return (
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
          Selesai
        </span>
      );
    }

    if (isVerification) {
      return (
        <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
          Menunggu Verifikasi
        </span>
      );
    }

    if (isRejected) {
      return (
        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
          Ditolak
        </span>
      );
    }

    return (
      <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
        {tx.status || "Pending"}
      </span>
    );
  };

  return (
    <>
      <div className="table-responsive" style={{ overflowX: "auto" }}>
        <Table align="middle" className="mb-0 custom-table-admin table-hover text-nowrap" hover style={{ minWidth: "900px" }}>
          <thead className="table-light">
            <tr>
              <th
                className="py-3 px-4 text-muted small fw-bold text-uppercase user-select-none"
                style={{ width: "175px", cursor: onSort ? "pointer" : "default" }}
                onClick={() => onSort?.("date")}
              >
                <div className="d-flex align-items-center gap-1">
                  <span>Waktu Transaksi</span>
                  {onSort && renderSortIcon("date")}
                </div>
              </th>

              <th
                className="py-3 px-4 text-muted small fw-bold text-uppercase user-select-none"
                style={{ cursor: onSort ? "pointer" : "default" }}
                onClick={() => onSort?.("member")}
              >
                <div className="d-flex align-items-center gap-1">
                  <span>Anggota</span>
                  {onSort && renderSortIcon("member")}
                </div>
              </th>

              <th className="py-3 px-4 text-muted small fw-bold text-uppercase" style={{ minWidth: "160px" }}>
                Jenis Simpanan
              </th>

              <th
                className="py-3 px-4 text-muted small fw-bold text-uppercase text-end user-select-none"
                style={{ cursor: onSort ? "pointer" : "default", width: "150px" }}
                onClick={() => onSort?.("amount")}
              >
                <div className="d-flex align-items-center justify-content-end gap-1">
                  <span>Nominal</span>
                  {onSort && renderSortIcon("amount")}
                </div>
              </th>

              <th
                className="py-3 px-4 text-muted small fw-bold text-uppercase text-center user-select-none"
                style={{ width: "175px", cursor: onSort ? "pointer" : "default" }}
                onClick={() => onSort?.("status")}
              >
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <span>Status</span>
                  {onSort && renderSortIcon("status")}
                </div>
              </th>

              <th
                className="py-3 px-3 text-muted small fw-bold text-uppercase text-center text-nowrap"
                style={{ width: "110px", minWidth: "110px" }}
              >
                Aksi
              </th>
            </tr>

            {showSearchRow && (
              <tr className="table-search-row bg-light bg-opacity-75">
                <th className="py-2 px-3">
                  <Form.Control
                    type="text"
                    placeholder="Cari waktu..."
                    size="sm"
                    className="bg-white border-1 rounded-3 shadow-none"
                    style={{ fontSize: "0.82rem" }}
                    value={searchFilters.date || ""}
                    onChange={(e) => onSearchChange?.("date", e.target.value)}
                  />
                </th>
                <th className="py-2 px-3">
                  <Form.Control
                    type="text"
                    placeholder="Cari nama / no..."
                    size="sm"
                    className="bg-white border-1 rounded-3 shadow-none"
                    style={{ fontSize: "0.82rem" }}
                    value={searchFilters.member || ""}
                    onChange={(e) => onSearchChange?.("member", e.target.value)}
                  />
                </th>
                <th className="py-2 px-3">
                  <Form.Control
                    type="text"
                    placeholder="Cari jenis simpanan..."
                    size="sm"
                    className="bg-white border-1 rounded-3 shadow-none"
                    style={{ fontSize: "0.82rem" }}
                    value={searchFilters.type || ""}
                    onChange={(e) => onSearchChange?.("type", e.target.value)}
                  />
                </th>
                <th className="py-2 px-3">
                  <Form.Control
                    type="text"
                    placeholder="Cari nominal..."
                    size="sm"
                    className="bg-white border-1 rounded-3 shadow-none text-end"
                    style={{ fontSize: "0.82rem" }}
                    value={searchFilters.amount || ""}
                    onChange={(e) => onSearchChange?.("amount", e.target.value)}
                  />
                </th>
                <th className="py-2 px-3">
                  <Form.Select
                    size="sm"
                    className="bg-white border-1 rounded-3 shadow-none text-center"
                    style={{ fontSize: "0.82rem" }}
                    value={searchFilters.status || ""}
                    onChange={(e) => onSearchChange?.("status", e.target.value)}
                  >
                    <option value="">Semua Status</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Pending">Pending</option>
                    <option value="Ditolak">Ditolak</option>
                  </Form.Select>
                </th>
                <th className="py-2 px-2 text-center text-nowrap" style={{ width: "110px", minWidth: "110px" }}>
                  {Object.values(searchFilters || {}).some((v) => Boolean(v)) && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="btn-reset-table-filter border-0 extra-small fw-semibold"
                      onClick={onResetFilter}
                      title="Reset Semua Pencarian Kolom"
                    >
                      <X size={13} weight="bold" />
                      <span>Reset</span>
                    </Button>
                  )}
                </th>
              </tr>
            )}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-5 text-center text-muted border-0">
                  <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                  <span className="small fw-semibold">Memuat data transaksi...</span>
                </td>
              </tr>
            ) : !transactions || transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-0 border-0">
                  <EmptyState
                    icon={Package}
                    title="Belum Ada Transaksi"
                    message="Tidak ditemukan data transaksi untuk filter yang dipilih."
                    action={
                      onResetFilter ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3 mt-2"
                          onClick={onResetFilter}
                        >
                          Reset Filter
                        </button>
                      ) : null
                    }
                  />
                </td>
              </tr>
            ) : (
              transactions.map((tx, idx) => {
                const { day, time } = formatDateTime(tx.date || tx.created_at);
                const isDeposit =
                  tx.type === "Setoran" || tx.type === "Deposit" || !tx.type?.includes("Pencairan");
                const isCompleted =
                  tx.status === "Selesai" ||
                  tx.status === "COMPLETED" ||
                  tx.status === "APPROVED" ||
                  tx.raw_status === "COMPLETED";

                const isNeedsApproval =
                  tx.is_manual_payment ||
                  tx.raw_status === "PENDING_VERIFICATION" ||
                  tx.status === "PENDING_VERIFICATION";

                const isWithdrawalPending =
                  (tx.type === "Pencairan" || tx.type === "Pencairan Tabungan") && !isCompleted;

                const rowKey = tx.id || tx.transaction_id || `tx-${idx}`;

                return (
                  <tr key={rowKey}>
                    {/* 1. Waktu */}
                    <td className="py-3 px-4">
                      <div className="d-flex flex-column">
                        <span className="text-dark fw-bold small">{day}</span>
                        <span className="text-muted extra-small d-flex align-items-center gap-1 mt-0.5">
                          <Clock size={11} /> {time}
                        </span>
                      </div>
                    </td>

                    {/* 2. Anggota */}
                    <td className="py-3 px-4">
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-dark d-block small mb-0.5">
                          {tx.member || tx.full_name || "Anggota"}
                        </span>
                        <span className="text-muted extra-small">
                          No. Anggota:{" "}
                          <strong className="text-dark">
                            {tx.member_no || tx.member_id?.substring(0, 8) || "-"}
                          </strong>
                        </span>
                      </div>
                    </td>

                    {/* 3. Jenis Simpanan */}
                    <td className="py-3 px-4">
                      <div className="d-flex flex-column align-items-start gap-1">
                        <span className="text-dark fw-bold small">
                          {tx.product_name || "Simpanan"}
                        </span>
                        <span
                          className={`badge px-2 py-0.5 rounded-pill extra-small fw-semibold d-inline-flex align-items-center gap-1 ${
                            isDeposit
                              ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                              : "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25"
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft size={11} weight="bold" />
                          ) : (
                            <ArrowUpRight size={11} weight="bold" />
                          )}
                          {tx.type || (isDeposit ? "Setoran" : "Pencairan")}
                        </span>
                      </div>
                    </td>

                    {/* 4. Nominal */}
                    <td className="py-3 px-4 text-end">
                      <div className="d-flex flex-column align-items-end">
                        <span
                          className={`fw-bold small ${
                            isDeposit ? "text-success" : "text-danger"
                          }`}
                        >
                          {isDeposit ? "+" : "-"}
                          {formatRupiah ? formatRupiah(tx.amount) : `Rp ${Number(tx.amount || 0).toLocaleString("id-ID")}`}
                        </span>
                        {tx.balance && tx.balance !== "-" && (
                          <span className="text-muted extra-small">
                            Saldo: {formatRupiah ? formatRupiah(tx.balance) : tx.balance}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Status */}
                    <td className="py-3 px-4 text-center">
                      {renderStatusBadge(tx)}
                    </td>

                    {/* 6. Aksi */}
                    <td className="py-3 px-3 text-center text-nowrap" style={{ width: "110px", minWidth: "110px" }}>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {isNeedsApproval ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tt-manual-${rowKey}`}>
                                Verifikasi Pembayaran Manual
                              </Tooltip>
                            }
                          >
                            <button
                              type="button"
                              className="btn-action-table action-warning border-0"
                              onClick={() => onApprove && onApprove(tx)}
                              aria-label="Verifikasi Pembayaran Manual"
                            >
                              <CheckCircle size={16} weight="bold" />
                            </button>
                          </OverlayTrigger>
                        ) : isWithdrawalPending ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tt-withdraw-${rowKey}`}>
                                Proses Persetujuan Pencairan
                              </Tooltip>
                            }
                          >
                            <button
                              type="button"
                              className="btn-action-table action-approve border-0"
                              onClick={() => onApprove && onApprove(tx)}
                              aria-label="Proses Persetujuan Pencairan"
                            >
                              <CheckCircle size={16} weight="bold" />
                            </button>
                          </OverlayTrigger>
                        ) : null}

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tt-view-${rowKey}`}>
                              Lihat Detail Transaksi
                            </Tooltip>
                          }
                        >
                          <button
                            type="button"
                            className="btn-action-table action-view border-0"
                            onClick={() => onView && onView(tx)}
                            aria-label="Lihat Detail Transaksi"
                          >
                            <Eye size={16} weight="bold" />
                          </button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {pagination && (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-4 py-3 border-top gap-3 bg-white">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="text-muted small">
              {pagination.total_records > 0 ? (
                <>
                  Menampilkan{" "}
                  <strong className="text-dark">
                    {(pagination.current_page - 1) * (pagination.per_page || 10) + 1}
                  </strong>{" "}
                  -{" "}
                  <strong className="text-dark">
                    {Math.min(
                      pagination.current_page * (pagination.per_page || 10),
                      pagination.total_records
                    )}
                  </strong>{" "}
                  dari{" "}
                  <strong className="text-dark">
                    {pagination.total_records}
                  </strong>{" "}
                  transaksi
                </>
              ) : (
                "0 data"
              )}
            </span>

            {onPageSizeChange && (
              <div className="d-flex align-items-center gap-1.5 ms-sm-3">
                <span className="text-muted extra-small">Baris:</span>
                <Form.Select
                  size="sm"
                  className="rounded-3 shadow-none py-0.5 px-2"
                  style={{ width: "70px", fontSize: "0.775rem" }}
                  value={pageSize || pagination.per_page || 10}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Form.Select>
              </div>
            )}
          </div>

          {pagination.total_pages > 1 && (
            <Pagination className="mb-0 custom-pagination" size="sm">
              <Pagination.First
                disabled={pagination.current_page === 1}
                onClick={() => onPageChange?.(1)}
              />
              <Pagination.Prev
                disabled={pagination.current_page === 1}
                onClick={() => onPageChange?.(pagination.current_page - 1)}
              />
              {getPaginationRange(pagination.current_page, pagination.total_pages).map(
                (p, idx) =>
                  p === "..." ? (
                    <Pagination.Ellipsis key={`ellipsis-${idx}`} disabled />
                  ) : (
                    <Pagination.Item
                      key={p}
                      active={p === pagination.current_page}
                      onClick={() => onPageChange?.(p)}
                    >
                      {p}
                    </Pagination.Item>
                  )
              )}
              <Pagination.Next
                disabled={pagination.current_page === pagination.total_pages}
                onClick={() => onPageChange?.(pagination.current_page + 1)}
              />
              <Pagination.Last
                disabled={pagination.current_page === pagination.total_pages}
                onClick={() => onPageChange?.(pagination.total_pages)}
              />
            </Pagination>
          )}
        </div>
      )}
    </>
  );
};

export default TransactionTable;
