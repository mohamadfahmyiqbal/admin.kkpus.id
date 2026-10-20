import React from "react";
import { Table, Badge } from "react-bootstrap";
import { Eye, CheckCircle } from "phosphor-react";

export const MemberBillsTable = ({
  bills,
  search,
  onFilterChange,
  member,
  formatRupiah,
  onViewInvoice,
  onVerifyPayment,
}) => {
  return (
    <div className="table-responsive" style={{ minHeight: "350px" }}>
      <Table hover className="align-middle custom-table-admin">
        <thead className="table-light">
          <tr>
            <th scope="col" className="text-secondary fw-semibold text-nowrap">
              Action
            </th>
            <th scope="col" className="text-secondary fw-semibold text-nowrap">
              Periode
            </th>
            <th scope="col" className="text-secondary fw-semibold text-nowrap">
              Tanggal
            </th>
            <th scope="col" className="text-secondary fw-semibold text-nowrap">
              Nama Anggota
            </th>
            <th scope="col" className="text-secondary fw-semibold text-nowrap">
              Nama Setoran
            </th>
            <th
              scope="col"
              className="text-secondary fw-semibold text-nowrap text-end"
            >
              Jumlah
            </th>
            <th
              scope="col"
              className="text-secondary fw-semibold text-nowrap text-center"
            >
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
                value={search.periode}
                onChange={(e) => onFilterChange("periode", e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                className="form-control form-control-sm shadow-none"
                placeholder="Cari..."
                value={search.tanggal}
                onChange={(e) => onFilterChange("tanggal", e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                className="form-control form-control-sm shadow-none"
                placeholder="Cari..."
                value={search.namaAnggota}
                onChange={(e) => onFilterChange("namaAnggota", e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                className="form-control form-control-sm shadow-none"
                placeholder="Cari..."
                value={search.namaSetoran}
                onChange={(e) => onFilterChange("namaSetoran", e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                className="form-control form-control-sm shadow-none"
                placeholder="Cari..."
                value={search.jumlah}
                onChange={(e) => onFilterChange("jumlah", e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                className="form-control form-control-sm shadow-none"
                placeholder="Cari..."
                value={search.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
              />
            </th>
          </tr>
        </thead>
        <tbody className="border-top-0">
          {bills.length > 0 ? (
            bills.map((b, i) => {
              const pri = b.due_date
                ? new Date(b.due_date).toLocaleDateString("id-ID", {
                    month: "long",
                    year: "numeric",
                  })
                : "-";
              const tg = b.due_date
                ? new Date(b.due_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-";
              const isPendingVerification = b.status === "PENDING_VERIFICATION";

              return (
                <tr key={b.id || i}>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      {isPendingVerification && (
                        <button
                          onClick={() =>
                            onVerifyPayment({
                              id: b.transaction_id,
                              transaction_id: b.transaction_id,
                              amount: formatRupiah(b.amount),
                              proof_of_transfer: b.proof_of_transfer,
                              sender_name: b.sender_name,
                              sender_bank: b.sender_bank,
                              member: member?.nama,
                              member_id: member?.member_id,
                              created_at: b.due_date,
                            })
                          }
                          className="btn btn-sm btn-light text-warning border-0 rounded-circle d-flex align-items-center justify-content-center"
                          title="Verifikasi Pembayaran"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <CheckCircle size={16} weight="bold" />
                        </button>
                      )}
                      <button
                        onClick={() => onViewInvoice(b)}
                        className="btn btn-sm btn-light text-primary border-0 rounded-circle d-flex align-items-center justify-content-center"
                        title="Detail Tagihan"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <Eye size={16} weight="bold" />
                      </button>
                    </div>
                  </td>
                  <td className="text-muted text-nowrap">{pri}</td>
                  <td className="text-muted text-nowrap">{tg}</td>
                  <td className="fw-medium text-dark text-nowrap">
                    {member?.nama}
                  </td>
                  <td className="text-muted text-nowrap">
                    {b.item_name || "Setoran Tabungan"}
                  </td>
                  <td className="fw-semibold text-success text-nowrap text-end">
                    {formatRupiah(b.amount)}
                  </td>
                  <td className="text-center">
                    <Badge
                      bg={
                        b.status === "PAID"
                          ? "success"
                          : isPendingVerification
                          ? "info"
                          : b.status === "UNPAID"
                          ? "warning"
                          : "secondary"
                      }
                      className="rounded-pill px-2 py-1"
                    >
                      {isPendingVerification ? "Menunggu Verifikasi" : b.status}
                    </Badge>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                Data tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export const MemberBillsPagination = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
      <span className="text-muted mb-3 mb-md-0">
        Menampilkan {(page - 1) * 5 + 1} hingga{" "}
        {Math.min(page * 5, totalItems)} dari {totalItems} entri
      </span>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link shadow-none"
              onClick={() => onPageChange(Math.max(page - 1, 1))}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, idx) => (
            <li
              key={idx + 1}
              className={`page-item ${page === idx + 1 ? "active" : ""}`}
            >
              <button
                className="page-link shadow-none"
                onClick={() => onPageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              page === totalPages || totalPages === 0 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link shadow-none"
              onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
