import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Form,
  Badge,
  Spinner,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  Receipt,
  Eye,
  User,
  X,
  ArrowsDownUp,
  CaretUp,
  CaretDown,
} from "phosphor-react";
import { renderApprovalBadge } from "./PinjamanApprovalBadge";

const PinjamanTable = ({
  loading,
  filteredTransactions: transactions = [],
  filters,
  setFilters,
  formatCurrency,
  onViewInvoice,
  onViewTransaksi,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      anggota: "",
      jenis_pinjaman: "",
      jumlah_pinjaman: "",
      tenor: "",
      cicilan: "",
      piutang: "",
      status_cicilan: "",
      status_approval: "",
    });
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowsDownUp size={12} className="text-muted ms-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <CaretUp size={12} className="text-primary ms-1" weight="bold" />
    ) : (
      <CaretDown size={12} className="text-primary ms-1" weight="bold" />
    );
  };

  const hasAnyFilter = Object.values(filters).some((v) => Boolean(v));

  // 1. Filtered rows with robust numeric matching
  const processedList = useMemo(() => {
    return transactions.filter((item) => {
      const totalRequired =
        Number(item.amount_requested || 0) +
        Number(item.margin_amount || 0) -
        Number(item.down_payment || 0);
      const remainingDebt = Math.max(
        0,
        totalRequired - Number(item.paid_amount || 0)
      );
      const isPaidOff =
        Number(item.paid_amount || 0) >= totalRequired && totalRequired > 0
          ? "Lunas"
          : "Belum Lunas";

      const memberName = (item.member_name || "").toLowerCase();
      const financingId = (item.financing_id || "").toLowerCase();
      const memberQuery = (filters.anggota || "").toLowerCase().trim();

      if (
        memberQuery &&
        !memberName.includes(memberQuery) &&
        !financingId.includes(memberQuery)
      ) {
        return false;
      }

      const jenis = (
        item.category ||
        item.purpose ||
        "Pinjaman Lunak"
      ).toLowerCase();
      if (
        filters.jenis_pinjaman &&
        !jenis.includes(filters.jenis_pinjaman.toLowerCase().trim())
      ) {
        return false;
      }

      // Helper for numeric/rupiah matching
      const checkNumeric = (filterVal, numVal) => {
        if (!filterVal) return true;
        const clean = filterVal.replace(/\D/g, "");
        const formatted = formatCurrency(numVal).toLowerCase();
        return (
          String(numVal || 0).includes(clean) ||
          formatted.includes(filterVal.toLowerCase().trim())
        );
      };

      if (
        !checkNumeric(filters.jumlah_pinjaman, item.amount_requested)
      ) {
        return false;
      }

      const tenorVal = String(
        item.cooperation_months || item.tenure || item.tenor_months || "-"
      );
      if (
        filters.tenor &&
        !tenorVal.toLowerCase().includes(filters.tenor.toLowerCase().trim())
      ) {
        return false;
      }

      const cicilanVal =
        item.monthly_installment || item.installment_amount || 0;
      if (!checkNumeric(filters.cicilan, cicilanVal)) {
        return false;
      }

      if (!checkNumeric(filters.piutang, remainingDebt)) {
        return false;
      }

      if (
        filters.status_cicilan &&
        isPaidOff.toLowerCase() !== filters.status_cicilan.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.status_approval &&
        (item.status || "").toUpperCase() !==
          filters.status_approval.toUpperCase()
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, filters, formatCurrency]);

  // 2. Sort rows
  const sortedList = useMemo(() => {
    if (!sortConfig.key) return processedList;
    return [...processedList].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "anggota") {
        aVal = a.member_name || "";
        bVal = b.member_name || "";
      } else if (sortConfig.key === "jenis_pinjaman") {
        aVal = a.category || a.purpose || "Pinjaman Lunak";
        bVal = b.category || b.purpose || "Pinjaman Lunak";
      } else if (sortConfig.key === "jumlah_pinjaman") {
        aVal = Number(a.amount_requested || 0);
        bVal = Number(b.amount_requested || 0);
      } else if (sortConfig.key === "tenor") {
        aVal = Number(
          a.cooperation_months || a.tenure || a.tenor_months || 0
        );
        bVal = Number(
          b.cooperation_months || b.tenure || b.tenor_months || 0
        );
      } else if (sortConfig.key === "cicilan") {
        aVal = Number(
          a.monthly_installment || a.installment_amount || 0
        );
        bVal = Number(
          b.monthly_installment || b.installment_amount || 0
        );
      } else if (sortConfig.key === "piutang") {
        const totalReqA =
          Number(a.amount_requested || 0) +
          Number(a.margin_amount || 0) -
          Number(a.down_payment || 0);
        aVal = Math.max(0, totalReqA - Number(a.paid_amount || 0));

        const totalReqB =
          Number(b.amount_requested || 0) +
          Number(b.margin_amount || 0) -
          Number(b.down_payment || 0);
        bVal = Math.max(0, totalReqB - Number(b.paid_amount || 0));
      } else if (sortConfig.key === "status_cicilan") {
        const totalReqA =
          Number(a.amount_requested || 0) +
          Number(a.margin_amount || 0) -
          Number(a.down_payment || 0);
        aVal =
          Number(a.paid_amount || 0) >= totalReqA && totalReqA > 0
            ? "Lunas"
            : "Belum Lunas";

        const totalReqB =
          Number(b.amount_requested || 0) +
          Number(b.margin_amount || 0) -
          Number(b.down_payment || 0);
        bVal =
          Number(b.paid_amount || 0) >= totalReqB && totalReqB > 0
            ? "Lunas"
            : "Belum Lunas";
      } else if (sortConfig.key === "status_approval") {
        aVal = a.status || "";
        bVal = b.status || "";
      }

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [processedList, sortConfig]);

  // 3. Pagination
  const totalItems = sortedList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = sortedList.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <div className="table-responsive border rounded-3">
        <Table
          hover
          className="table compact-table table-striped table-bordered align-middle mb-0 text-nowrap custom-table-admin"
        >
          <thead className="table-light sticky-top" style={{ zIndex: 2 }}>
            <tr>
              <th
                className="px-3 py-3 font-medium text-center"
                style={{ width: "90px" }}
              >
                Aksi
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium user-select-none"
                onClick={() => handleSort("anggota")}
              >
                Anggota {renderSortIcon("anggota")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium user-select-none"
                onClick={() => handleSort("jenis_pinjaman")}
              >
                Jenis Pinjaman {renderSortIcon("jenis_pinjaman")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium text-end user-select-none"
                onClick={() => handleSort("jumlah_pinjaman")}
              >
                Jumlah Pinjaman {renderSortIcon("jumlah_pinjaman")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium text-center user-select-none"
                onClick={() => handleSort("tenor")}
              >
                Tenor {renderSortIcon("tenor")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium text-end user-select-none"
                onClick={() => handleSort("cicilan")}
              >
                Cicilan {renderSortIcon("cicilan")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium text-end user-select-none"
                onClick={() => handleSort("piutang")}
              >
                Piutang {renderSortIcon("piutang")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium text-center user-select-none"
                onClick={() => handleSort("status_cicilan")}
              >
                Status Cicilan {renderSortIcon("status_cicilan")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium text-center user-select-none"
                onClick={() => handleSort("status_approval")}
              >
                Status Approval {renderSortIcon("status_approval")}
              </th>
            </tr>

            {/* Filter thead row */}
            <tr className="bg-light bg-opacity-75">
              <th className="py-2 px-1 text-center">
                {hasAnyFilter && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="p-0 px-1 border-0"
                    onClick={handleResetFilters}
                    title="Reset Semua Filter"
                  >
                    <X size={14} weight="bold" />
                  </Button>
                )}
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari anggota / ID..."
                  value={filters.anggota}
                  onChange={(e) =>
                    handleFilterChange("anggota", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ fontSize: "11px", minWidth: "140px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari jenis..."
                  value={filters.jenis_pinjaman}
                  onChange={(e) =>
                    handleFilterChange("jenis_pinjaman", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ fontSize: "11px", minWidth: "120px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari jumlah..."
                  value={filters.jumlah_pinjaman}
                  onChange={(e) =>
                    handleFilterChange("jumlah_pinjaman", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ fontSize: "11px", minWidth: "110px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Tenor..."
                  value={filters.tenor}
                  onChange={(e) => handleFilterChange("tenor", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-center"
                  style={{ fontSize: "11px", minWidth: "70px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cicilan..."
                  value={filters.cicilan}
                  onChange={(e) =>
                    handleFilterChange("cicilan", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ fontSize: "11px", minWidth: "100px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Piutang..."
                  value={filters.piutang}
                  onChange={(e) =>
                    handleFilterChange("piutang", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ fontSize: "11px", minWidth: "100px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Select
                  size="sm"
                  value={filters.status_cicilan}
                  onChange={(e) =>
                    handleFilterChange("status_cicilan", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ fontSize: "11px", minWidth: "110px" }}
                >
                  <option value="">Semua</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Lunas">Belum Lunas</option>
                </Form.Select>
              </th>
              <th className="py-2 px-2">
                <Form.Select
                  size="sm"
                  value={filters.status_approval}
                  onChange={(e) =>
                    handleFilterChange("status_approval", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ fontSize: "11px", minWidth: "130px" }}
                >
                  <option value="">Semua</option>
                  <option value="WAITING_APPROVAL">Menunggu</option>
                  <option value="APPROVED">Disetujui</option>
                  <option value="ACTIVE">Berjalan</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="REJECTED">Ditolak</option>
                </Form.Select>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <div className="mt-2 text-muted small">
                    Memuat data pinjaman...
                  </div>
                </td>
              </tr>
            ) : paginatedList.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-5 text-muted">
                  {hasAnyFilter
                    ? "Tidak ada data pinjaman yang cocok dengan filter pencarian"
                    : "Data pinjaman belum tersedia"}
                </td>
              </tr>
            ) : (
              paginatedList.map((tx) => {
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
                    <td className="px-3 py-2 text-center">
                      <div className="d-flex justify-content-center align-items-center gap-1">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tt-inv-${tx.id || tx.financing_id}`}>
                              Lihat Detail Invoice
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="light"
                            size="sm"
                            className="p-1 rounded-circle border shadow-xs text-primary d-inline-flex align-items-center justify-content-center"
                            style={{ width: "30px", height: "30px" }}
                            onClick={() => onViewInvoice(tx)}
                          >
                            <Receipt size={16} weight="bold" />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip
                              id={`tt-setoran-${tx.id || tx.financing_id}`}
                            >
                              Catat / Lihat Setoran Cicilan
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="light"
                            size="sm"
                            className="p-1 rounded-circle border shadow-xs text-info d-inline-flex align-items-center justify-content-center"
                            style={{ width: "30px", height: "30px" }}
                            onClick={() => onViewTransaksi(tx)}
                          >
                            <Eye size={16} weight="bold" />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-light rounded-circle p-2 text-secondary d-flex align-items-center justify-content-center"
                          style={{ width: "34px", height: "34px" }}
                        >
                          <User size={18} />
                        </div>
                        <div>
                          <div className="fw-medium text-dark">
                            {tx.member_name || "Anggota"}
                          </div>
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "11px" }}
                          >
                            {tx.financing_id}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {tx.category || tx.purpose || "Pinjaman Lunak"}
                    </td>
                    <td className="px-3 py-2 text-end fw-medium text-primary">
                      {formatCurrency(tx.amount_requested)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {tx.cooperation_months ||
                        tx.tenure ||
                        tx.tenor_months ||
                        "-"}{" "}
                      Bln
                    </td>
                    <td className="px-3 py-2 text-end">
                      {formatCurrency(
                        tx.monthly_installment || tx.installment_amount
                      )}
                    </td>
                    <td className="px-3 py-2 text-end text-danger fw-medium">
                      {formatCurrency(remainingDebt)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {isPaid ? (
                        <Badge bg="success" className="px-2 py-1">
                          Lunas
                        </Badge>
                      ) : (
                        <Badge
                          bg="warning"
                          text="dark"
                          className="px-2 py-1"
                        >
                          Belum Lunas
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {renderApprovalBadge(tx.status)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2 px-1">
          <div className="text-muted small">
            Menampilkan{" "}
            <strong>
              {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)}
            </strong>{" "}
            dari <strong>{totalItems}</strong> data pinjaman
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form.Select
              size="sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: "115px" }}
              className="rounded-3 shadow-none border-secondary border-opacity-25"
            >
              <option value={10}>10 baris</option>
              <option value={25}>25 baris</option>
              <option value={50}>50 baris</option>
              <option value={100}>100 baris</option>
            </Form.Select>
            <Pagination className="mb-0">
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <Pagination.Ellipsis key={pageNum} disabled />;
                }
                return null;
              })}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinjamanTable;
