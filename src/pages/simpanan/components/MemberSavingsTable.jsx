import React from "react";
import { Table, Pagination, Form, Spinner, Button } from "react-bootstrap";
import {
  ArrowsDownUp,
  CaretUp,
  CaretDown,
  X,
  ListBullets,
} from "phosphor-react";
import EmptyState from "../../../components/ui/EmptyState";

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

export const MemberSavingsTable = ({
  members = [],
  loading = false,
  formatRupiah,
  pagination = null,
  onPageChange,
  onViewDetail,
  sortConfig = { key: "full_name", direction: "asc" },
  onSort,
  pageSize = 10,
  onPageSizeChange,
  columnFilters = {
    member_no: "",
    full_name: "",
    total_amount: "",
    paid_amount: "",
    unpaid_amount: "",
  },
  onColumnFilterChange,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-4 p-5 text-center text-muted">
        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
        <span className="small fw-semibold">Memuat data simpanan anggota...</span>
      </div>
    );
  }

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

  const currentPage = pagination?.current_page || 1;
  const totalPages = pagination?.total_pages || 1;
  const totalRecords = pagination?.total_records || members.length;
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords);

  const hasActiveFilters = Object.values(columnFilters || {}).some((v) => Boolean(v));

  return (
    <div className="d-flex flex-column h-100">
      <div className="table-responsive flex-grow-1" style={{ overflowX: "auto" }}>
        <Table hover className="align-middle mb-0 custom-table text-nowrap" style={{ minWidth: "900px" }}>
          <thead className="bg-light text-uppercase text-secondary" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
            <tr>
              <th className="py-3 px-3 text-center" style={{ width: "60px" }}>No</th>
              <th
                className="py-3 px-3 cursor-pointer user-select-none"
                onClick={() => onSort && onSort("member_no")}
                style={{ width: "140px" }}
              >
                <div className="d-flex align-items-center">
                  <span>No. Anggota</span>
                  {renderSortIcon("member_no")}
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer user-select-none"
                onClick={() => onSort && onSort("full_name")}
              >
                <div className="d-flex align-items-center">
                  <span>Nama Anggota</span>
                  {renderSortIcon("full_name")}
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer user-select-none text-end"
                onClick={() => onSort && onSort("total_amount")}
                style={{ width: "170px" }}
              >
                <div className="d-flex align-items-center justify-content-end">
                  <span title="Hanya transaksi yang sudah dibayarkan (PAID)">Transaksi Terbayar</span>
                  {renderSortIcon("total_amount")}
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer user-select-none text-end"
                onClick={() => onSort && onSort("paid_amount")}
                style={{ width: "170px" }}
              >
                <div className="d-flex align-items-center justify-content-end">
                  <span>Terbayar</span>
                  {renderSortIcon("paid_amount")}
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer user-select-none text-end"
                onClick={() => onSort && onSort("unpaid_amount")}
                style={{ width: "170px" }}
              >
                <div className="d-flex align-items-center justify-content-end">
                  <span>Belum Terbayar</span>
                  {renderSortIcon("unpaid_amount")}
                </div>
              </th>
              <th className="py-3 px-3 text-center" style={{ width: "130px" }}>
                Aksi
              </th>
            </tr>

            {/* Filter Search Row across every column in thead */}
            <tr className="bg-white border-bottom">
              <th className="p-2 text-center">
                {hasActiveFilters && (
                  <Button
                    variant="link"
                    className="p-0 text-danger"
                    onClick={onResetFilters}
                    title="Reset Semua Pencarian Kolom"
                  >
                    <X size={14} weight="bold" />
                  </Button>
                )}
              </th>
              <th className="p-2">
                <Form.Control
                  type="text"
                  placeholder="Cari no..."
                  size="sm"
                  value={columnFilters?.member_no || ""}
                  onChange={(e) => onColumnFilterChange?.("member_no", e.target.value)}
                  className="bg-light border-0 shadow-none text-dark"
                  style={{ fontSize: "11px", height: "28px" }}
                />
              </th>
              <th className="p-2">
                <Form.Control
                  type="text"
                  placeholder="Cari nama anggota..."
                  size="sm"
                  value={columnFilters?.full_name || ""}
                  onChange={(e) => onColumnFilterChange?.("full_name", e.target.value)}
                  className="bg-light border-0 shadow-none text-dark"
                  style={{ fontSize: "11px", height: "28px" }}
                />
              </th>
              <th className="p-2">
                <Form.Control
                  type="text"
                  placeholder="Cari total..."
                  size="sm"
                  value={columnFilters?.total_amount || ""}
                  onChange={(e) => onColumnFilterChange?.("total_amount", e.target.value)}
                  className="bg-light border-0 shadow-none text-dark text-end"
                  style={{ fontSize: "11px", height: "28px" }}
                />
              </th>
              <th className="p-2">
                <Form.Control
                  type="text"
                  placeholder="Cari terbayar..."
                  size="sm"
                  value={columnFilters?.paid_amount || ""}
                  onChange={(e) => onColumnFilterChange?.("paid_amount", e.target.value)}
                  className="bg-light border-0 shadow-none text-dark text-end"
                  style={{ fontSize: "11px", height: "28px" }}
                />
              </th>
              <th className="p-2">
                <Form.Control
                  type="text"
                  placeholder="Cari belum bayar..."
                  size="sm"
                  value={columnFilters?.unpaid_amount || ""}
                  onChange={(e) => onColumnFilterChange?.("unpaid_amount", e.target.value)}
                  className="bg-light border-0 shadow-none text-dark text-end"
                  style={{ fontSize: "11px", height: "28px" }}
                />
              </th>
              <th className="p-2 text-center">
                {hasActiveFilters && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="extra-small px-2 py-0 border-0 text-muted"
                    onClick={onResetFilters}
                  >
                    Reset
                  </Button>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="border-top-0" style={{ fontSize: "13px" }}>
            {members.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-0 border-0">
                  <EmptyState
                    title="Tidak Ada Data Anggota"
                    description="Belum ada anggota yang memiliki data transaksi pada simpanan ini atau tidak cocok dengan filter."
                  />
                </td>
              </tr>
            ) : (
              members.map((member, index) => {
                const rowNo = (currentPage - 1) * pageSize + index + 1;
                const hasUnpaid = (member.unpaid_count || 0) > 0 || (member.unpaid_amount || 0) > 0;

                return (
                  <tr key={member.member_id || index} className="border-bottom">
                    <td className="py-3 px-3 text-center text-muted fw-medium">
                      {rowNo}
                    </td>
                    <td className="py-3 px-3 fw-bold text-secondary">
                      {member.member_no || "-"}
                    </td>
                    <td className="py-3 px-3">
                      <div className="fw-semibold text-dark">
                        {member.full_name}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-end">
                      <div className="fw-bold text-dark">
                        {formatRupiah(member.total_amount || 0)}
                      </div>
                      <div className="text-muted extra-small">
                        {member.total_count || 0} Transaksi
                      </div>
                    </td>
                    <td className="py-3 px-3 text-end">
                      <div className="fw-bold text-success">
                        {formatRupiah(member.paid_amount || 0)}
                      </div>
                      <div className="text-muted extra-small">
                        {member.paid_count || 0} Terbayar
                      </div>
                    </td>
                    <td className="py-3 px-3 text-end">
                      <div className={`fw-bold ${hasUnpaid ? "text-danger" : "text-muted"}`}>
                        {formatRupiah(member.unpaid_amount || 0)}
                      </div>
                      <div className="text-muted extra-small">
                        {member.unpaid_count || 0} Belum Terbayar
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill extra-small fw-semibold shadow-none"
                        onClick={() => onViewDetail && onViewDetail(member)}
                        title="Lihat Rincian Transaksi Anggota"
                      >
                        <ListBullets size={15} weight="bold" />
                        <span>Detail</span>
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalRecords > 0 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 p-3 px-md-4 border-top bg-white">
          <div className="d-flex align-items-center gap-2 text-muted small">
            <span>Baris per halaman:</span>
            <Form.Select
              size="sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="border-light-subtle shadow-none w-auto py-1"
              style={{ fontSize: "12px" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Select>
            <span className="ms-2">
              Menampilkan {startItem}-{endItem} dari {totalRecords} data anggota
            </span>
          </div>

          <Pagination size="sm" className="mb-0 gap-1">
            <Pagination.Prev
              disabled={currentPage <= 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="rounded-circle border-0"
            />
            {getPaginationRange(currentPage, totalPages).map((p, idx) =>
              p === "..." ? (
                <Pagination.Ellipsis key={`el-${idx}`} disabled />
              ) : (
                <Pagination.Item
                  key={p}
                  active={p === currentPage}
                  onClick={() => onPageChange && onPageChange(p)}
                  className="rounded-3"
                >
                  {p}
                </Pagination.Item>
              )
            )}
            <Pagination.Next
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="rounded-circle border-0"
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MemberSavingsTable;
